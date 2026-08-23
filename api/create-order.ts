import type { VercelRequest, VercelResponse } from '@vercel/node';
import { randomUUID } from 'crypto';
import { buildOrderItems, CatalogError } from './lib/catalog';
import {
  appendEvent,
  createOrder,
  findOrderByCartToken,
  getReservedQuantities,
  isDatabaseConfigured,
} from './lib/db';
import { sendOrderConfirmationToClient, sendSaleNoticeToAtelier } from './lib/email';
import { createCardPreference, createPixPayment, isMercadoPagoConfigured } from './lib/mercadopago';
import { CreateOrderResponse, Order } from './lib/types';
import { validateCheckout } from './lib/validation';

export const config = { api: { bodyParser: { sizeLimit: '64kb' } } };

/** Limite simples em memória por IP (best-effort entre instâncias warm). */
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > RATE_LIMIT_MAX;
}

function generateOrderCode(): string {
  const time = Date.now().toString(36).toUpperCase().slice(-5);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `FQ-${time}${rand}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  }

  const ip =
    (req.headers['x-real-ip'] as string) ||
    ((req.headers['x-forwarded-for'] as string) || '').split(',')[0].trim() ||
    'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({
      error: 'RATE_LIMITED',
      message: 'Muitas tentativas em sequência. Aguarde um momento.',
    });
  }

  // ── 1. Parse seguro do corpo ──
  let body: unknown;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'INVALID_JSON' });
  }
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'INVALID_BODY' });
  }

  // ── 2. Validação de campos ──
  const result = validateCheckout(body as never);
  if (result.ok === false) {
    return res.status(400).json({ error: 'VALIDATION_ERROR', fieldErrors: result.errors });
  }
  const { items, customer, address, paymentMethod, cartToken } = result.data;

  // ── 2b. Produção SEM banco configurado NUNCA cria pedido em memória ──
  if (!isDatabaseConfigured() && process.env.VERCEL === '1') {
    return res.status(503).json({
      error: 'DATABASE_NOT_CONFIGURED',
      message:
        'Pedidos temporariamente indisponíveis. Configure DATABASE_URL nas variáveis de ambiente do projeto.',
    });
  }

  // ── 3. Idempotência: mesmo carrinho não gera dois pedidos ──
  const existing = await findOrderByCartToken(cartToken);
  if (
    existing &&
    (existing.paymentStatus === 'PENDING' || existing.paymentStatus === 'APPROVED')
  ) {
    return res
      .status(200)
      .json({ order: publicOrder(existing), payment: null, warnings: ['EXISTING_ORDER'] });
  }

  // ── 4. Estoque e preços SEMPRE pelo catálogo oficial (nada do frontend é confiado) ──
  let orderItems;
  try {
    const reserved = await getReservedQuantities();
    orderItems = buildOrderItems(items, reserved);
  } catch (err) {
    if (err instanceof CatalogError) {
      return res
        .status(409)
        .json({ error: 'CATALOG_CONFLICT', message: err.message, fieldErrors: { items: err.message } });
    }
    throw err;
  }

  const subtotalCents = orderItems.reduce((acc, i) => acc + i.unitPriceCents * i.qty, 0);
  // Frete combinado pessoalmente com o ateliê (sob cotação), como no fluxo atual.
  const shippingCents = 0;

  if (!isMercadoPagoConfigured()) {
    return res.status(503).json({
      error: 'PAYMENT_UNAVAILABLE',
      message:
        'Pagamento temporariamente indisponível. Configure MERCADOPAGO_ACCESS_TOKEN nas variáveis de ambiente.',
    });
  }

  const nowIso = new Date().toISOString();
  const baseOrder: Order = {
    id: randomUUID(),
    code: generateOrderCode(),
    paymentMethod,
    paymentStatus: 'PENDING',
    orderStatus: 'AGUARDANDO_PAGAMENTO',
    items: orderItems,
    subtotalCents,
    shippingCents,
    totalCents: subtotalCents + shippingCents,
    customer,
    address,
    mpPaymentId: null,
    mpPreferenceId: null,
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  // ── 5. Inicia o pagamento ANTES de persistir (nenhum pedido órfão se o gateway falhar) ──
  const warnings: string[] = [];
  try {
    if (paymentMethod === 'PIX') {
      const pix = await createPixPayment(baseOrder);
      if (pix.ok === false) {
        return res.status(502).json({ error: 'PIX_ERROR', message: pix.error });
      }
      baseOrder.mpPaymentId = pix.paymentId;
      const insert = await createOrder(baseOrder, cartToken);
      if (insert.created === false) {
        if (insert.reason === 'duplicate') {
          return res.status(200).json({
            order: publicOrder(baseOrder),
            payment: null,
            warnings: ['EXISTING_ORDER'],
          });
        }
        return res.status(409).json({
          error: 'CATALOG_CONFLICT',
          message: 'Uma das obras acabou de ser reservada por outro colecionador.',
          fieldErrors: { items: 'Estoque esgotado no momento da confirmação.' },
        });
      }
      await appendEvent(baseOrder.id, 'PIX_CREATED', { mpPaymentId: pix.paymentId });

      void sendOrderConfirmationToClient(baseOrder);
      void sendSaleNoticeToAtelier(baseOrder);

      if (!isDatabaseConfigured()) warnings.push('NO_DATABASE');

      const response: CreateOrderResponse & { payment: NonNullable<CreateOrderResponse['payment']> } = {
        order: publicOrder(baseOrder),
        payment: {
          method: 'PIX',
          qrCodeBase64: pix.qrCodeBase64,
          qrCodeCopyPaste: pix.qrCodeCopyPaste,
          ticketUrl: pix.ticketUrl,
        },
        warnings,
      };
      return res.status(201).json(response);
    }

    // CARTÃO → Checkout Pro hospedado (dados de cartão nunca tocam nossos servidores)
    const pref = await createCardPreference(baseOrder);
    if (pref.ok === false) {
      return res.status(502).json({ error: 'CARD_ERROR', message: pref.error });
    }
    baseOrder.mpPreferenceId = pref.preferenceId;
    const insert = await createOrder(baseOrder, cartToken);
    if (insert.created === false) {
      if (insert.reason === 'duplicate') {
        return res
          .status(200)
          .json({ order: publicOrder(baseOrder), payment: null, warnings: ['EXISTING_ORDER'] });
      }
      return res.status(409).json({
        error: 'CATALOG_CONFLICT',
        message: 'Uma das obras acabou de ser reservada por outro colecionador.',
        fieldErrors: { items: 'Estoque esgotado no momento da confirmação.' },
      });
    }

    void sendSaleNoticeToAtelier(baseOrder);

    if (!isDatabaseConfigured()) warnings.push('NO_DATABASE');

    const response: CreateOrderResponse = {
      order: publicOrder(baseOrder),
      payment: { method: 'CARD', initPoint: pref.initPoint },
      warnings,
    };
    return res.status(201).json(response);
  } catch (err) {
    console.error('[create-order] erro inesperado', err);
    return res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Não foi possível concluir agora. Tente novamente em instantes.',
    });
  }
}

/** Remove PII antes de devolver ao frontend. */
function publicOrder(order: Order): Order {
  return {
    ...order,
    customer: {
      ...order.customer,
      cpf: order.customer.cpf.replace(/^(\d{3}).*(\d{2})$/, '$1.***.***-$2'),
      email: maskEmail(order.customer.email),
    },
  };
}

function maskEmail(email: string): string {
  const [user, domain] = email.split('@');
  if (!domain || user.length <= 2) return email;
  return `${user.slice(0, 2)}***@${domain}`;
}
