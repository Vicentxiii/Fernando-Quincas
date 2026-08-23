import { neon } from '@neondatabase/serverless';
import { CATALOG } from './catalog';
import {
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from './types';

/**
 * Camada de persistência de pedidos — desacoplada da interface.
 *
 * • Produção: Postgres serverless (Neon / Vercel Marketplace) via DATABASE_URL ou POSTGRES_URL.
 *   - Criação de pedido é ATÔMICA (advisory lock + verificação de estoque em uma única
 *     instrução SQL) → a mesma unidade nunca é vendida duas vezes, mesmo sob concorrência.
 *   - Reservas de checkout PENDING expiram após RESERVATION_TTL_MINUTES minutos (abandono).
 *   - Transições de pagamento são MONOTÔNICAS (nunca regridem de APPROVED para PENDING).
 * • Fallback em memória: SOMENTE desenvolvimento/testes locais. Em produção na Vercel
 *   (process.env.VERCEL), o handler bloqueia pedidos quando o banco não está configurado.
 */

const CONNECTION_STRING =
  process.env.DATABASE_URL || process.env.POSTGRES_URL || '';

export const isDatabaseConfigured = (): boolean => CONNECTION_STRING.length > 0;

/** Janela de reserva de estoque para checkouts abandonados. */
export const RESERVATION_TTL_MINUTES = 30;

/** Transições permitidas — evita regressão indevida de status por webhook fora de ordem. */
const ALLOWED_TRANSITIONS: Record<PaymentStatus, PaymentStatus[]> = {
  PENDING: ['APPROVED', 'REJECTED', 'CANCELLED'],
  APPROVED: ['CANCELLED'],
  REJECTED: [],
  CANCELLED: [],
};

// ────────────────────────────────────────────────────────────────
// Fallback em memória (dev/demo local)
// ────────────────────────────────────────────────────────────────

interface MemoryRecord {
  order: Order;
  cartToken: string;
}

const memoryOrders = new Map<string, MemoryRecord>();
const memoryByToken = new Map<string, string>();
const memoryEvents: { orderId: string; type: string; payload?: unknown }[] = [];

let schemaReady: Promise<void> | null = null;

/** Uso exclusivo de testes automatizados. */
export function __resetMemoryStoreForTests(): void {
  memoryOrders.clear();
  memoryByToken.clear();
  memoryEvents.length = 0;
}

/** Uso exclusivo de testes automatizados: simula checkout abandonado há N minutos. */
export function __backdateMemoryOrderForTests(orderId: string, minutes: number): void {
  const record = memoryOrders.get(orderId);
  if (!record) return;
  record.order = {
    ...record.order,
    createdAt: new Date(Date.now() - minutes * 60_000).toISOString(),
  };
}

function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    const sql = neon(CONNECTION_STRING);
    schemaReady = (async () => {
      // Catálogo oficial espelhado no banco — fonte da verdade para checagens atômicas.
      await sql`
        CREATE TABLE IF NOT EXISTS products (
          product_id TEXT PRIMARY KEY,
          slug TEXT NOT NULL,
          name TEXT NOT NULL,
          price_cents INTEGER NOT NULL,
          stock INTEGER NOT NULL,
          status TEXT NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS orders (
          id UUID PRIMARY KEY,
          code TEXT UNIQUE NOT NULL,
          cart_token TEXT UNIQUE,
          payment_method TEXT NOT NULL,
          payment_status TEXT NOT NULL DEFAULT 'PENDING',
          order_status TEXT NOT NULL DEFAULT 'AGUARDANDO_PAGAMENTO',
          mp_payment_id TEXT,
          mp_preference_id TEXT,
          subtotal_cents INTEGER NOT NULL,
          shipping_cents INTEGER NOT NULL DEFAULT 0,
          total_cents INTEGER NOT NULL,
          customer JSONB NOT NULL,
          address JSONB NOT NULL,
          items JSONB NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS order_events (
          id BIGSERIAL PRIMARY KEY,
          order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
          type TEXT NOT NULL,
          payload JSONB,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      await sql`CREATE INDEX IF NOT EXISTS idx_orders_mp_payment_id ON orders (mp_payment_id)`;

      for (const entry of CATALOG.values()) {
        await sql`
          INSERT INTO products (product_id, slug, name, price_cents, stock, status, updated_at)
          VALUES (${entry.id}, ${entry.slug}, ${entry.name}, ${entry.priceCents}, ${entry.stock}, ${entry.status}, now())
          ON CONFLICT (product_id) DO UPDATE SET
            slug = EXCLUDED.slug,
            name = EXCLUDED.name,
            price_cents = EXCLUDED.price_cents,
            stock = EXCLUDED.stock,
            status = EXCLUDED.status,
            updated_at = now()
        `;
      }
    })();
  }
  return schemaReady;
}

function isReservationActive(order: Order): boolean {
  if (order.paymentStatus === 'APPROVED') return true;
  if (order.paymentStatus !== 'PENDING') return false;
  const ageMs = Date.now() - new Date(order.createdAt).getTime();
  return ageMs < RESERVATION_TTL_MINUTES * 60_000;
}

function addReservationsFrom(order: Order, target: Map<string, number>): void {
  for (const item of order.items) {
    target.set(item.productId, (target.get(item.productId) ?? 0) + item.qty);
  }
}

// ────────────────────────────────────────────────────────────────
// Mapeamento linha ↔ domínio
// ────────────────────────────────────────────────────────────────

interface OrderRow {
  id: string;
  code: string;
  cart_token: string | null;
  payment_method: string;
  payment_status: string;
  order_status: string;
  mp_payment_id: string | null;
  mp_preference_id: string | null;
  subtotal_cents: number;
  shipping_cents: number;
  total_cents: number;
  customer: unknown;
  address: unknown;
  items: unknown;
  created_at: string | Date;
  updated_at: string | Date;
}

function rowToOrder(row: OrderRow): Order {
  return {
    id: row.id,
    code: row.code,
    paymentMethod: row.payment_method as PaymentMethod,
    paymentStatus: row.payment_status as PaymentStatus,
    orderStatus: row.order_status as OrderStatus,
    items: (row.items as OrderItem[]) ?? [],
    subtotalCents: Number(row.subtotal_cents),
    shippingCents: Number(row.shipping_cents),
    totalCents: Number(row.total_cents),
    customer: row.customer as Order['customer'],
    address: row.address as Order['address'],
    mpPaymentId: row.mp_payment_id,
    mpPreferenceId: row.mp_preference_id,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

// ────────────────────────────────────────────────────────────────
// Repositório público
// ────────────────────────────────────────────────────────────────

/** Cancela pedidos PENDING cuja janela de reserva expirou (checkout abandonado). */
async function cancelExpiredPendingOrders(): Promise<void> {
  const sql = neon(CONNECTION_STRING);
  await sql`
    UPDATE orders SET
      payment_status = 'CANCELLED',
      order_status = 'CANCELADO',
      updated_at = now()
    WHERE payment_status = 'PENDING'
      AND created_at <= now() - make_interval(mins => ${RESERVATION_TTL_MINUTES})
  `;
}

export async function getReservedQuantities(): Promise<Map<string, number>> {
  const reserved = new Map<string, number>();

  if (!isDatabaseConfigured()) {
    for (const { order } of memoryOrders.values()) {
      if (isReservationActive(order)) addReservationsFrom(order, reserved);
    }
    return reserved;
  }

  await ensureSchema();
  await cancelExpiredPendingOrders();
  const sql = neon(CONNECTION_STRING);
  const result = (await sql`
    SELECT item->>'productId' AS product_id, SUM((item->>'qty')::int) AS qty
    FROM orders o, jsonb_array_elements(o.items) AS item
    WHERE o.payment_status = 'APPROVED'
       OR (o.payment_status = 'PENDING'
           AND o.created_at > now() - make_interval(mins => ${RESERVATION_TTL_MINUTES}))
    GROUP BY item->>'productId'
  `) as { product_id: string; qty: number }[];

  for (const r of result) {
    reserved.set(r.product_id, Number(r.qty));
  }
  return reserved;
}

/**
 * Insere o pedido de forma ATÔMICA:
 * • valida disponibilidade de TODOS os itens contra `products` + reservas ativas;
 * • serializa concorrência com pg_advisory_xact_lock (uma única instrução SQL);
 * • respeita idempotência por cart_token (constraint UNIQUE como retaguarda).
 */
export async function createOrder(
  order: Order,
  cartToken: string
): Promise<{ created: boolean; reason?: 'duplicate' | 'stock_conflict' }> {
  if (!isDatabaseConfigured()) {
    // Seção síncrona (sem await) → atômica dentro do event-loop Node.
    if (memoryByToken.has(cartToken)) return { created: false, reason: 'duplicate' };

    const reserved = new Map<string, number>();
    for (const { order: o } of memoryOrders.values()) {
      if (isReservationActive(o)) addReservationsFrom(o, reserved);
    }
    for (const item of order.items) {
      const stock = CATALOG.get(item.productId)?.stock ?? 0;
      if ((reserved.get(item.productId) ?? 0) + item.qty > stock) {
        return { created: false, reason: 'stock_conflict' };
      }
    }

    const record: MemoryRecord = { order, cartToken };
    memoryOrders.set(order.id, record);
    memoryByToken.set(cartToken, order.id);
    memoryEvents.push({ orderId: order.id, type: 'ORDER_CREATED' });
    return { created: true };
  }

  try {
    await ensureSchema();
    const sql = neon(CONNECTION_STRING);
    const itemsJson = JSON.stringify(order.items);
    const rows = (await sql`
      WITH lock AS (SELECT pg_advisory_xact_lock(814207)),
      avail AS (
        SELECT COALESCE(
          bool_and(p.stock - COALESCE(r.reserved, 0) >= (i->>'qty')::int),
          false
        ) AS valid
        FROM jsonb_array_elements(${itemsJson}::jsonb) AS i
        JOIN products p ON p.product_id = i->>'productId'
        CROSS JOIN lock
        LEFT JOIN LATERAL (
          SELECT SUM((it->>'qty')::int) AS reserved
          FROM orders o2, jsonb_array_elements(o2.items) AS it
          WHERE o2.payment_status IN ('PENDING', 'APPROVED')
            AND it->>'productId' = i->>'productId'
            AND (o2.payment_status = 'APPROVED'
                 OR o2.created_at > now() - make_interval(mins => ${RESERVATION_TTL_MINUTES}))
        ) r ON true
      ),
      ins AS (
        INSERT INTO orders (
          id, code, cart_token, payment_method, payment_status, order_status,
          mp_payment_id, mp_preference_id, subtotal_cents, shipping_cents, total_cents,
          customer, address, items, created_at, updated_at
        )
        SELECT ${order.id}, ${order.code}, ${cartToken}, ${order.paymentMethod},
               'PENDING', 'AGUARDANDO_PAGAMENTO',
               ${order.mpPaymentId ?? null}, ${order.mpPreferenceId ?? null},
               ${order.subtotalCents}, ${order.shippingCents}, ${order.totalCents},
               ${JSON.stringify(order.customer)}::jsonb,
               ${JSON.stringify(order.address)}::jsonb,
               ${itemsJson}::jsonb, now(), now()
        FROM avail
        CROSS JOIN lock
        WHERE avail.valid
        RETURNING id
      )
      SELECT EXISTS(SELECT 1 FROM ins) AS created
    `) as { created: boolean }[];

    if (rows[0]?.created) return { created: true };

    const duplicated = await findOrderByCartToken(cartToken);
    return duplicated
      ? { created: false, reason: 'duplicate' }
      : { created: false, reason: 'stock_conflict' };
  } catch (err) {
    if (typeof err === 'object' && err !== null && 'code' in err && (err as { code?: string }).code === '23505') {
      return { created: false, reason: 'duplicate' };
    }
    throw err;
  }
}

export async function findOrderByCartToken(cartToken: string): Promise<Order | null> {
  if (!isDatabaseConfigured()) {
    const id = memoryByToken.get(cartToken);
    return id ? (memoryOrders.get(id)?.order ?? null) : null;
  }
  await ensureSchema();
  const sql = neon(CONNECTION_STRING);
  const rows = (await sql`
    SELECT * FROM orders WHERE cart_token = ${cartToken} LIMIT 1
  `) as unknown as OrderRow[];
  return rows[0] ? rowToOrder(rows[0]) : null;
}

export async function getOrder(id: string): Promise<Order | null> {
  if (!isDatabaseConfigured()) {
    const record = memoryOrders.get(id);
    if (!record) return null;
    // Expiração preguiçosa: checkout abandonado vira CANCELADO ao ser consultado.
    if (record.order.paymentStatus === 'PENDING' && !isReservationActive(record.order)) {
      record.order = {
        ...record.order,
        paymentStatus: 'CANCELLED',
        orderStatus: 'CANCELADO',
        updatedAt: new Date().toISOString(),
      };
      memoryEvents.push({ orderId: id, type: 'PAYMENT_TRANSITION', payload: { paymentStatus: 'CANCELLED', expired: true } });
    }
    return record.order;
  }
  await ensureSchema();
  await cancelExpiredPendingOrders();
  const sql = neon(CONNECTION_STRING);
  const rows = (await sql`
    SELECT * FROM orders WHERE id = ${id} LIMIT 1
  `) as unknown as OrderRow[];
  return rows[0] ? rowToOrder(rows[0]) : null;
}

export async function getOrderByMpPaymentId(mpPaymentId: string): Promise<Order | null> {
  if (!isDatabaseConfigured()) {
    for (const { order } of memoryOrders.values()) {
      if (order.mpPaymentId === mpPaymentId) return order;
    }
    return null;
  }
  await ensureSchema();
  const sql = neon(CONNECTION_STRING);
  const rows = (await sql`
    SELECT * FROM orders WHERE mp_payment_id = ${mpPaymentId} LIMIT 1
  `) as unknown as OrderRow[];
  return rows[0] ? rowToOrder(rows[0]) : null;
}

/**
 * Aplica transição de pagamento IDEMPOTENTE e MONOTÔNICA.
 * Webhooks fora de ordem (ex.: pending depois de approved) são ignorados sem erro.
 */
export async function applyPaymentTransition(
  orderId: string,
  next: {
    paymentStatus?: PaymentStatus;
    orderStatus?: OrderStatus;
    mpPaymentId?: string;
  }
): Promise<{ changed: boolean; order: Order | null }> {
  let current: Order | null;

  if (!isDatabaseConfigured()) {
    const record = memoryOrders.get(orderId);
    current = record?.order ?? null;
    if (!current) return { changed: false, order: null };

    const psChanged = next.paymentStatus !== undefined && next.paymentStatus !== current.paymentStatus;
    const mpChanged = next.mpPaymentId !== undefined && next.mpPaymentId !== current.mpPaymentId;

    if (psChanged && !ALLOWED_TRANSITIONS[current.paymentStatus].includes(next.paymentStatus!)) {
      return { changed: false, order: current }; // transição proibida (regressão)
    }
    if (!psChanged && !mpChanged) {
      return { changed: false, order: current }; // duplicado — nada a fazer
    }

    const updated: Order = {
      ...current,
      paymentStatus: psChanged ? next.paymentStatus! : current.paymentStatus,
      orderStatus: next.orderStatus ?? (psChanged ? mapOrderStatus(next.paymentStatus!) : current.orderStatus),
      mpPaymentId: mpChanged ? next.mpPaymentId : current.mpPaymentId,
      updatedAt: new Date().toISOString(),
    };
    memoryOrders.set(orderId, { ...record!, order: updated });
    memoryEvents.push({ orderId, type: 'PAYMENT_TRANSITION', payload: next });
    return { changed: true, order: updated };
  }

  await ensureSchema();
  const sql = neon(CONNECTION_STRING);
  const ps = next.paymentStatus ?? null;
  const rows = (await sql`
    UPDATE orders SET
      payment_status = COALESCE(${ps}, payment_status),
      order_status   = COALESCE(${next.orderStatus ?? null}, order_status),
      mp_payment_id  = COALESCE(${next.mpPaymentId ?? null}, mp_payment_id),
      updated_at     = now()
    WHERE id = ${orderId}
      AND (
        (${ps}::text IS NULL AND ${next.mpPaymentId ?? null}::text IS NOT NULL
             AND mp_payment_id IS DISTINCT FROM ${next.mpPaymentId ?? null})
        OR
        (${ps}::text IS NOT NULL AND payment_status IS DISTINCT FROM ${ps}
             AND CASE payment_status
                   WHEN 'PENDING'  THEN ${ps} IN ('APPROVED', 'REJECTED', 'CANCELLED')
                   WHEN 'APPROVED' THEN ${ps} = 'CANCELLED'
                   ELSE false
                 END)
      )
    RETURNING *
  `) as unknown as OrderRow[];

  if (rows[0]) return { changed: true, order: rowToOrder(rows[0]) };

  const unchanged = await getOrder(orderId);
  return { changed: false, order: unchanged };
}

function mapOrderStatus(ps: PaymentStatus): OrderStatus {
  switch (ps) {
    case 'APPROVED': return 'PAGAMENTO_CONFIRMADO';
    case 'PENDING': return 'AGUARDANDO_PAGAMENTO';
    default: return 'CANCELADO';
  }
}

export async function appendEvent(
  orderId: string,
  type: string,
  payload?: unknown
): Promise<void> {
  if (!isDatabaseConfigured()) {
    memoryEvents.push({ orderId, type, payload });
    return;
  }
  try {
    await ensureSchema();
    const sql = neon(CONNECTION_STRING);
    await sql`
      INSERT INTO order_events (order_id, type, payload)
      VALUES (${orderId}, ${type}, ${JSON.stringify(payload ?? null)}::jsonb)
    `;
  } catch (err) {
    console.error('[db] falha ao registrar evento', type, err);
  }
}
