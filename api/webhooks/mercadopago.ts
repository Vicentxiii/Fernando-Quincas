import type { VercelRequest, VercelResponse } from '@vercel/node';
import { appendEvent, applyPaymentTransition, getOrderByMpPaymentId, getOrder } from '../lib/db';
import { sendPaymentStatusUpdate, sendSaleNoticeToAtelier } from '../lib/email';
import { getPayment, mapMpStatus } from '../lib/mercadopago';
import { OrderStatus, PaymentStatus } from '../lib/types';
import { verifyMercadoPagoSignature } from '../lib/webhook';

// Parser JSON padrão da Vercel popula req.body (application/json do Mercado Pago).

const ORDER_STATUS_BY_PAYMENT: Record<PaymentStatus, OrderStatus> = {
  PENDING: 'AGUARDANDO_PAGAMENTO',
  APPROVED: 'PAGAMENTO_CONFIRMADO',
  REJECTED: 'CANCELADO',
  CANCELLED: 'CANCELADO',
};

/**
 * POST /api/webhooks/mercadopago
 *
 * Fluxo de segurança:
 * 1. valida a assinatura x-signature (quando MERCADOPAGO_WEBHOOK_SECRET configurada);
 * 2. IGNORA os valores do corpo — busca o pagamento direto na API do Mercado Pago;
 * 3. localiza o pedido por external_reference (fallback: mp_payment_id);
 * 4. aplica transição de status IDEMPOTENTE;
 * 5. responde 200 rápido (evita reenvios em cascata do gateway).
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  }

  try {
    const url = new URL(req.url || '', 'https://internal');
    const queryId = url.searchParams.get('data.id') || url.searchParams.get('id');

    let body: { data?: { id?: unknown }; resource?: unknown; type?: unknown; topic?: unknown } = {};
    if (typeof req.body === 'string') {
      try {
        body = JSON.parse(req.body);
      } catch {
        body = {};
      }
    } else if (req.body && typeof req.body === 'object') {
      body = req.body as typeof body;
    }

    const dataId = String(body?.data?.id ?? queryId ?? '');
    if (!dataId) {
      // Notificação sem id utilizável — nada a fazer, mas confirma recebimento.
      return res.status(200).json({ received: true });
    }

    const validSignature = verifyMercadoPagoSignature({
      xSignature: req.headers['x-signature'] as string | undefined,
      xRequestId: req.headers['x-request-id'] as string | undefined,
      dataId,
    });
    if (!validSignature) {
      return res.status(401).json({ error: 'INVALID_SIGNATURE' });
    }

    // Fonte da verdade é SEMPRE a API do Mercado Pago.
    const payment = await getPayment(dataId);
    if (!payment) {
      console.warn('[webhook] pagamento não encontrado na API do MP:', dataId);
      return res.status(200).json({ received: true });
    }

    const nextStatus = mapMpStatus(payment.status);
    if (!nextStatus) {
      return res.status(200).json({ received: true });
    }

    // Localiza o pedido: external_reference → mp_payment_id
    let order =
      (payment.externalReference ? await getOrder(payment.externalReference) : null) ??
      (await getOrderByMpPaymentId(String(payment.id)));

    if (!order) {
      console.warn('[webhook] pedido não localizado para pagamento', payment.id);
      return res.status(200).json({ received: true });
    }

    const { changed, order: updated } = await applyPaymentTransition(order.id, {
      paymentStatus: nextStatus,
      orderStatus: ORDER_STATUS_BY_PAYMENT[nextStatus],
      mpPaymentId: String(payment.id),
    });

    if (changed && updated) {
      await appendEvent(order.id, `PAYMENT_${nextStatus}`, {
        mpPaymentId: payment.id,
        statusDetail: payment.statusDetail,
      });
      void sendPaymentStatusUpdate(updated);
      if (nextStatus === 'APPROVED') {
        void sendSaleNoticeToAtelier(updated);
      }
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('[webhook] erro', err);
    // 200 mesmo em erro interno evita loops de retry; o polling do frontend cobre a lacuna.
    return res.status(200).json({ received: true });
  }
}
