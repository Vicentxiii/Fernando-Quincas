import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';
import { addToLines, removeFromLines, setLineQty, CartLine } from '../lib/cartRules';

interface CartContextValue {
  lines: CartLine[];
  detailedLines: { product: Product; qty: number }[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (slug: string, qty?: number) => void;
  removeItem: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
}

const STORAGE_KEY = 'quincas_shop_cart';

const CartContext = createContext<CartContextValue | null>(null);

const readStoredLines = (): CartLine[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((l) => typeof l?.slug === 'string' && Number.isFinite(l?.qty) && l.qty > 0)
      .map((l) => ({ slug: l.slug, qty: l.qty }));
  } catch {
    return [];
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lines, setLines] = useState<CartLine[]>(readStoredLines);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // ignore storage failures (private mode etc.)
    }
  }, [lines]);

  const addItem = useCallback((slug: string, qty = 1) => {
    if (!PRODUCTS.some((p) => p.slug === slug)) return;
    setLines((prev) => addToLines(prev, slug, qty));
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((slug: string) => {
    setLines((prev) => removeFromLines(prev, slug));
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setLines((prev) => setLineQty(prev, slug, qty));
  }, []);

  const clear = useCallback(() => setLines([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const detailedLines = useMemo(
    () =>
      lines
        .map((line) => {
          const product = PRODUCTS.find((p) => p.slug === line.slug);
          // só conta se produto existe, está disponível e qty respeita estoque
          if (!product || product.status !== 'AVAILABLE' || product.stock <= 0) return null;
          const qty = Math.min(Math.max(1, Math.floor(line.qty)), product.stock);
          return { product, qty };
        })
        .filter((v): v is { product: Product; qty: number } => v !== null),
    [lines]
  );

  // auto-limpa carrinho se tiver slugs inválidos / sem estoque (ex.: 5 itens fantasmas de teste antigo)
  useEffect(() => {
    if (lines.length !== detailedLines.length) {
      const validSlugs = new Set(detailedLines.map((d) => d.product.slug));
      const cleaned = lines.filter((l) => validSlugs.has(l.slug));
      // só atualiza se realmente mudou e se tem itens inválidos
      if (cleaned.length !== lines.length) {
        setLines(cleaned);
      }
    }
  }, [lines, detailedLines]);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      detailedLines,
      count: detailedLines.reduce((acc, l) => acc + l.qty, 0),
      subtotal: detailedLines.reduce((acc, l) => acc + l.product.price * l.qty, 0),
      isOpen,
      openCart,
      closeCart,
      addItem,
      removeItem,
      setQty,
      clear,
    }),
    [lines, detailedLines, isOpen, openCart, closeCart, addItem, removeItem, setQty, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart deve ser usado dentro de CartProvider');
  return ctx;
};
