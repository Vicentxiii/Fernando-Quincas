import { PRODUCTS, isAvailable } from '../../src/data/products';
import { OrderItem } from './types';

/**
 * Catálogo server-side — única fonte de verdade para preços e estoque.
 * O frontend NUNCA define preços: tudo aqui é recalculado a partir do catálogo oficial.
 */

export interface CatalogEntry {
  id: string;
  slug: string;
  name: string;
  priceCents: number;
  stock: number;
  status: string;
}

export const CATALOG: Map<string, CatalogEntry> = new Map(
  PRODUCTS.map((p) => [
    p.id,
    {
      id: p.id,
      slug: p.slug,
      name: p.name,
      priceCents: Math.round(p.price * 100),
      stock: p.stock,
      status: p.status,
    },
  ])
);

export function findCatalogEntry(idOrSlug: string): CatalogEntry | undefined {
  return (
    CATALOG.get(idOrSlug) ??
    [...CATALOG.values()].find((e) => e.slug === idOrSlug)
  );
}

export function isEntryAvailable(entry: CatalogEntry, reservedQty = 0): boolean {
  if (entry.status !== 'AVAILABLE') return false;
  // Reaproveita a regra oficial do catálogo (status + stock) descontando reservas ativas.
  const baseAvailable = PRODUCTS.find((p) => p.id === entry.id);
  if (!baseAvailable || !isAvailable(baseAvailable)) return false;
  return entry.stock - reservedQty > 0;
}

/**
 * Monta os itens do pedido SEMPRE a partir do catálogo oficial.
 * Ignora qualquer preço enviado pelo cliente. Lança erro amigável quando inválido.
 */
export class CatalogError extends Error {}

export function buildOrderItems(
  requestedItems: { productId?: unknown; qty?: unknown }[],
  reservedByProduct: Map<string, number>
): OrderItem[] {
  if (!Array.isArray(requestedItems) || requestedItems.length === 0) {
    throw new CatalogError('O carrinho está vazio.');
  }

  const items: OrderItem[] = [];

  for (const raw of requestedItems) {
    const productId = typeof raw?.productId === 'string' ? raw.productId.trim() : '';
    const qtyRaw = Number(raw?.qty);

    if (!productId || !Number.isInteger(qtyRaw) || qtyRaw < 1 || qtyRaw > 99) {
      throw new CatalogError('Item inválido no carrinho.');
    }
    const qty = qtyRaw;

    const entry = findCatalogEntry(productId);
    if (!entry) {
      throw new CatalogError('Uma das obras não existe mais no catálogo do ateliê.');
    }
    if (entry.status !== 'AVAILABLE' || entry.stock <= 0) {
      throw new CatalogError(`"${entry.name}" não está mais disponível.`);
    }

    const reserved = reservedByProduct.get(entry.id) ?? 0;
    const available = entry.stock - reserved;
    if (available <= 0) {
      throw new CatalogError(`"${entry.name}" acabou de ser adquirida por outro colecionador.`);
    }
    if (qty > available) {
      throw new CatalogError(
        `Apenas ${available} unidade${available === 1 ? '' : 's'} de "${entry.name}" disponíve${
          available === 1 ? 'l' : 'is'
        }.`
      );
    }

    items.push({
      productId: entry.id,
      slug: entry.slug,
      name: entry.name,
      unitPriceCents: entry.priceCents,
      qty,
    });
  }

  // Deduplicação defensiva: mesmo produto repetido é somado e revalidado.
  const merged = new Map<string, OrderItem>();
  for (const item of items) {
    const existing = merged.get(item.productId);
    if (existing) existing.qty += item.qty;
    else merged.set(item.productId, item);
  }

  for (const item of merged.values()) {
    const entry = CATALOG.get(item.productId)!;
    const reserved = reservedByProduct.get(item.productId) ?? 0;
    if (item.qty > entry.stock - reserved) {
      throw new CatalogError(`Quantidade de "${item.name}" excede o estoque disponível.`);
    }
  }

  return [...merged.values()];
}
