import { createHmac, timingSafeEqual } from 'crypto';

/**
 * Validação da assinatura do webhook do Mercado Pago (header x-signature).
 *
 * Formato: "ts=<timestamp>;v1=<hash>"
 * Manifest assinado: "id:<data.id>;request-id:<x-request-id>;ts:<ts>;"  (minúsculas)
 *
 * Se MERCADOPAGO_WEBHOOK_SECRET não estiver configurada, a validação é pulada
 * (com aviso em log) — mas o status SEMPRE é buscado direto na API do Mercado Pago,
 * nunca confiado no corpo da notificação.
 */

export function verifyMercadoPagoSignature(params: {
  xSignature: string | undefined;
  xRequestId: string | undefined;
  dataId: string | undefined;
}): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!secret) {
    console.warn('[webhook] MERCADOPAGO_WEBHOOK_SECRET não configurada — assinatura não verificada.');
    return true;
  }
  if (!params.xSignature || !params.dataId) return false;

  const parts = params.xSignature.split(';').reduce<Record<string, string>>((acc, part) => {
    const [key, value] = part.split('=');
    if (key && value) acc[key.trim()] = value.trim();
    return acc;
  }, {});

  const ts = parts.ts;
  const hash = parts.v1;
  if (!ts || !hash) return false;

  const manifest = `id:${params.dataId.toLowerCase()};request-id:${
    params.xRequestId ?? ''
  };ts:${ts};`;

  const computed = createHmac('sha256', secret).update(manifest).digest('hex');

  const a = Buffer.from(computed, 'utf8');
  const b = Buffer.from(hash, 'utf8');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
