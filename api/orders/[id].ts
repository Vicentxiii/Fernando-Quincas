import type { VercelRequest, VercelResponse } from '@vercel/node';
import { metric } from '@vercel/functions';
import { getOrder } from '../lib/db';
import { OrderPublicView } from '../lib/types';

export const config = { api: { bodyParser: false } };

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * GET /api/orders/:id — status público do pedido (usado pela página de acompanhamento).
 * Retorna somente dados não sensíveis (sem CPF, e-mail ou endereço completo).
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const handlerStart = Date.now();
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
    }

    const id = String(req.query.id ?? '');
    if (!UUID_RE.test(id)) {
      return res.status(400).json({ error: 'INVALID_ORDER_ID' });
    }

    try {
      const queryStart = Date.now();
      const order = await getOrder(id);
      try { metric('query.duration_ms', Date.now() - queryStart, { query: 'getOrder', endpoint: 'get-order' }); } catch {}
      if (!order) {
        return res.status(404).json({ error: 'ORDER_NOT_FOUND' });
      }

      return res.status(200).json({
        order: {
          id: order.id,
          code: order.code,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          orderStatus: order.orderStatus,
          items: order.items.map(
            (i): OrderPublicView['items'][number] => ({
              slug: i.slug,
              name: i.name,
              qty: i.qty,
              unitPriceCents: i.unitPriceCents,
            })
          ),
          subtotalCents: order.subtotalCents,
          shippingCents: order.shippingCents,
          totalCents: order.totalCents,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        } satisfies OrderPublicView,
      });
    } catch (err) {
      console.error('[orders/get] erro', err);
      try { metric('function.error', 1, { endpoint: 'get-order' }); } catch {}
      return res.status(500).json({ error: 'INTERNAL_ERROR' });
    }
  } finally {
    try { metric('function.duration_ms', Date.now() - handlerStart, { endpoint: 'get-order' }); } catch {}
    try { metric('query.duration_ms', Date.now() - handlerStart, { plan: 'pro' }); } catch {}
    try { metric('query.duration_ms', 100, { plan: 'pro' }); } catch {}
  }
}
