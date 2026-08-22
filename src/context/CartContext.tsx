import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';

interface CartLine {
  slug: string;
  qty: number;
}

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
    const product = PRODUCTS.find((p) => p.slug === slug);
    if (!product || product.status !== 'AVAILABLE' || product.stock <= 0) return;
    setLines((prev) => {
      const existing = prev.find((l) => l.slug === slug);
      if (existing) {
        return prev.map((l) =>
          l.slug === slug ? { ...l, qty: Math.min(l.qty + qty, product.stock) } : l
        );
      }
      return [...prev, { slug, qty: Math.min(qty, product.stock) }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((slug: string) => {
    setLines((prev) => prev.filter((l) => l.slug !== slug));
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    const product = PRODUCTS.find((p) => p.slug === slug);
    const max = product ? product.stock : 99;
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.slug !== slug)
        : prev.map((l) => (l.slug === slug ? { ...l, qty: Math.min(qty, max) } : l))
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const detailedLines = useMemo(
    () =>
      lines
        .map((line) => {
          const product = PRODUCTS.find((p) => p.slug === line.slug);
          return product ? { product, qty: line.qty } : null;
        })
        .filter((v): v is { product: Product; qty: number } => v !== null),
    [lines]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      detailedLines,
      count: lines.reduce((acc, l) => acc + l.qty, 0),
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
