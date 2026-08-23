import { Order, PaymentStatus } from './types';

/**
 * Integração com o Mercado Pago via REST API (fetch puro, sem SDK).
 *
 * SEGURANÇA:
 * • O Access Token vive EXCLUSIVAMENTE na env var MERCADOPAGO_ACCESS_TOKEN (backend).
 * • Nenhum dado de cartão passa pelos nossos servidores: cartão usa o Checkout Pro
 *   hospedado do Mercado Pago (redirecionamento para init_point), PCI-compliant.
 * • Pix é gerado server-side e exibido como QR Code + copia-e-cola.
 *
 * ENV VARS NECESSÁRIAS (ver .env.example):
 * • MERCADOPAGO_ACCESS_TOKEN  → credencial privada (APP_USR-...)
 * • APP_URL                   → URL pública do site (back_urls / notification_url)
 * • MERCADOPAGO_WEBHOOK_SECRET→ (opcional, recomendado) chave do webhook p/ validar x-signature
 */

const MP_API = 'https://api.mercadopago.com';

export function isMercadoPagoConfigured(): boolean {
  return Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN);
}

function appUrl(): string {
  return (
    process.env.APP_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'http://localhost:3000')
  );
}

export function webhookUrl(): string {
  return `${appUrl()}/api/webhooks/mercadopago`;
}

async function mpFetch<T>(
  path: string,
  init: RequestInit & { idempotencyKey?: string } = {}
): Promise<{ ok: boolean; status: number; data: T | { error?: string; message?: string } }> {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  if (init.idempotencyKey) headers['X-Idempotency-Key'] = init.idempotencyKey;

  const res = await fetch(`${MP_API}${path}`, {
    ...init,
    headers: { ...headers, ...(init.headers as Record<string, string>) },
  });

  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  return { ok: res.ok, status: res.status, data: data as T };
}

// ────────────────────────────────────────────────────────────────
// PIX — API de pagamentos v1
// ────────────────────────────────────────────────────────────────

interface MpPixResponse {
  id: number;
  status?: string;
  point_of_interaction?: {
    transaction_data?: {
      qr_code?: string;
      qr_code_base64?: string;
      ticket_url?: string;
    };
  };
}

export async function createPixPayment(
  order: Order
): Promise<
  | { ok: true; paymentId: string; qrCodeBase64: string; qrCodeCopyPaste: string; ticketUrl?: string }
  | { ok: false; error: string }
> {
  const payerEmail = order.customer.email;
  const [firstName, ...rest] = order.customer.name.split(' ');

  const { ok, status, data } = await mpFetch<MpPixResponse>('/v1/payments', {
    method: 'POST',
    idempotencyKey: order.id, // retry-safe: mesma chave não duplica cobrança
    body: JSON.stringify({
      transaction_amount: Number((order.totalCents / 100).toFixed(2)),
      description: `Ateliê Fernando Quincas — Pedido ${order.code}`,
      payment_method_id: 'pix',
      external_reference: order.id,
      notification_url: webhookUrl(),
      statement_descriptor: 'ATELIE FQUINCAS',
      payer: {
        email: payerEmail,
        first_name: firstName || 'Colecionador',
        last_name: rest.join(' ') || undefined,
        identification: {
          type: 'CPF',
          number: order.customer.cpf,
        },
      },
    }),
  });

  if (!ok) {
    const message =
      (data as { message?: string })?.message ?? `Erro ${status} ao gerar o Pix.`;
    return { ok: false, error: message };
  }

  const payment = data as MpPixResponse;
  const tx = payment.point_of_interaction?.transaction_data;
  if (!tx?.qr_code || !tx.qr_code_base64) {
    return { ok: false, error: 'Resposta do Pix incompleta. Tente novamente.' };
  }

  return {
    ok: true,
    paymentId: String(payment.id),
    qrCodeBase64: tx.qr_code_base64,
    qrCodeCopyPaste: tx.qr_code,
    ticketUrl: tx.ticket_url,
  };
}

// ────────────────────────────────────────────────────────────────
// CARTÃO — Checkout Pro (preferência + redirecionamento hospedado)
// ────────────────────────────────────────────────────────────────

interface MpPreferenceResponse {
  id: string;
  init_point?: string;
  sandbox_init_point?: string;
}

export async function createCardPreference(
  order: Order
): Promise<{ ok: true; initPoint: string; preferenceId: string } | { ok: false; error: string }> {
  const base = appUrl();
  const isSandbox = process.env.MERCADOPAGO_ACCESS_TOKEN.startsWith('TEST-');

  const { ok, status, data } = await mpFetch<MpPreferenceResponse>('/checkout/preferences', {
    method: 'POST',
    body: JSON.stringify({
      items: order.items.map((item) => ({
        id: item.productId,
        title: item.name,
        quantity: item.qty,
        currency_id: 'BRL',
        unit_price: Number((item.unitPriceCents / 100).toFixed(2)),
        category_id: 'art',
        description: 'Obra original do ateliê Fernando Quincas',
      })),
      payer: {
        email: order.customer.email,
        name: order.customer.name,
      },
      back_urls: {
        success: `${base}/loja/pedido/${order.id}`,
        pending: `${base}/loja/pedido/${order.id}`,
        failure: `${base}/loja/pedido/${order.id}`,
      },
      auto_return: 'approved',
      binary_mode: true,
      external_reference: order.id,
      statement_descriptor: 'ATELIE FQUINCAS',
      notification_url: webhookUrl(),
    }),
  });

  if (!ok) {
    const message =
      (data as { message?: string })?.message ?? `Erro ${status} ao criar preferência de pagamento.`;
    return { ok: false, error: message };
  }

  const preference = data as MpPreferenceResponse;
  const initPoint =
    (!isSandbox && preference.init_point) || preference.sandbox_init_point || preference.init_point;
  if (!initPoint || !preference.id) {
    return { ok: false, error: 'Checkout de cartão indisponível no momento.' };
  }

  return { ok: true, initPoint, preferenceId: preference.id };
}

// ────────────────────────────────────────────────────────────────
// Consulta de pagamento (fonte da verdade para webhooks/polling)
// ────────────────────────────────────────────────────────────────

export interface MpPaymentInfo {
  id: number;
  status: string;
  statusDetail?: string;
  externalReference?: string;
}

const STATUS_TO_PAYMENT_STATUS: Record<string, PaymentStatus> = {
  approved: 'APPROVED',
  authorized: 'APPROVED',
  pending: 'PENDING',
  in_process: 'PENDING',
  in_mediation: 'PENDING',
  rejected: 'REJECTED',
  cancelled: 'CANCELLED',
  refunded: 'CANCELLED', // reembolso encerra o pedido
  charged_back: 'CANCELLED',
};

export function mapMpStatus(mpStatus: string): PaymentStatus | null {
  return STATUS_TO_PAYMENT_STATUS[mpStatus] ?? null;
}

export async function getPayment(paymentId: string): Promise<MpPaymentInfo | null> {
  const { ok, data } = await mpFetch<MpPaymentInfo>(`/v1/payments/${paymentId}`, {
    method: 'GET',
  });
  if (!ok) return null;
  return data as MpPaymentInfo;
}
