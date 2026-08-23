import { PRODUCTS } from '../data/products';

/**
 * Regras puras do carrinho — extraídas de CartContext para permitir testes
 * automatizados sem alterar nenhum comportamento da interface.
 */

export interface CartLine {
  slug: string;
  qty: number;
}

/** Estoque efetivamente comprável (0 quando indisponível/vendido). */
export function purchasableStock(slug: string): number {
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product || product.status !== 'AVAILABLE' || product.stock <= 0) return 0;
  return product.stock;
}

export function addToLines(lines: CartLine[], slug: string, qty: number): CartLine[] {
  const max = purchasableStock(slug);
  if (max <= 0 || qty < 1) return lines; // produto indisponível ou qty inválida → inerte
  const existing = lines.find((l) => l.slug === slug);
  if (existing) {
    return lines.map((l) =>
      l.slug === slug ? { ...l, qty: Math.min(l.qty + qty, max) } : l
    );
  }
  return [...lines, { slug, qty: Math.min(qty, max) }];
}

export function removeFromLines(lines: CartLine[], slug: string): CartLine[] {
  return lines.filter((l) => l.slug !== slug);
}

export function setLineQty(lines: CartLine[], slug: string, qty: number): CartLine[] {
  if (!Number.isFinite(qty)) return lines;
  const whole = Math.floor(qty);
  if (whole <= 0) return removeFromLines(lines, slug);
  const max = purchasableStock(slug);
  if (max <= 0) return removeFromLines(lines, slug);
  return lines.map((l) => (l.slug === slug ? { ...l, qty: Math.min(whole, max) } : l));
}
