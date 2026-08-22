import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Minus, Plus, Trash2, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../data/products';

export const CartDrawer: React.FC = () => {
  const { isOpen, closeCart, detailedLines, subtotal, setQty, removeItem, count } = useCart();
  const navigate = useNavigate();

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeCart]);

  if (!isOpen) return null;

  const goToCheckout = () => {
    closeCart();
    navigate('/loja/checkout');
  };

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Carrinho de compras">
      {/* Backdrop */}
      <button
        aria-label="Fechar carrinho"
        onClick={closeCart}
        className="absolute inset-0 bg-[#16251E]/45 backdrop-blur-sm animate-fadeInSoft"
      />

      {/* Panel */}
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-[#FAF8F5] border-l border-[#C8A86B]/30 shadow-[-20px_0_60px_rgba(22,37,30,0.18)] flex flex-col animate-drawerIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#C8A86B]/25">
          <div>
            <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-[#C8A86B] block">
              Ateliê Fernando Quincas
            </span>
            <h2 className="font-serif text-xl text-[#1E1D1A]">
              Seu Carrinho{' '}
              <span className="font-mono text-xs text-[#8A82A5]">
                ({count} {count === 1 ? 'item' : 'itens'})
              </span>
            </h2>
          </div>
          <button
            onClick={closeCart}
            aria-label="Fechar carrinho"
            className="p-2 rounded-full border border-[#C8A86B]/30 hover:border-[#C8A86B] hover:bg-[#C8A86B]/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Items */}
        {detailedLines.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="w-14 h-14 rounded-full border border-[#C8A86B]/40 flex items-center justify-center font-display text-sm text-[#C8A86B]">
              FQ
            </span>
            <p className="font-serif italic text-lg text-[#8A82A5]">
              Seu carrinho aguarda a primeira obra.
            </p>
            <button
              onClick={() => {
                closeCart();
                navigate('/loja');
              }}
              className="px-6 py-3 rounded-full bg-[#1E1D1A] text-[#FAF8F5] text-[11px] font-mono tracking-widest uppercase hover:bg-[#C8A86B] hover:text-[#1E1D1A] transition-colors"
            >
              Explorar a Loja
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
              {detailedLines.map(({ product, qty }) => (
                <li key={product.slug} className="flex gap-4 py-4 border-b border-[#C8A86B]/15 last:border-b-0">
                  <div className="w-20 h-24 shrink-0 rounded-xl overflow-hidden border border-[#C8A86B]/25 bg-[#EAE5D8]">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif text-base leading-snug text-[#1E1D1A] truncate">
                        {product.name}
                      </h3>
                      <button
                        onClick={() => removeItem(product.slug)}
                        aria-label={`Remover ${product.name}`}
                        title="Remover obra"
                        className="p-1 text-[#8A82A5] hover:text-[#6B1D2F] transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="block text-[9px] font-mono tracking-[0.25em] uppercase text-[#C8A86B]">
                      {product.category}
                    </span>

                    <div className="flex items-center justify-between pt-1">
                      {/* Qty stepper */}
                      <div className="inline-flex items-center rounded-full border border-[#C8A86B]/35 overflow-hidden">
                        <button
                          onClick={() => setQty(product.slug, qty - 1)}
                          disabled={qty <= 1}
                          aria-label="Diminuir quantidade"
                          className="p-1.5 disabled:opacity-30 hover:bg-[#C8A86B]/10 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center font-mono text-xs">{qty}</span>
                        <button
                          onClick={() => setQty(product.slug, qty + 1)}
                          disabled={qty >= product.stock}
                          aria-label="Aumentar quantidade"
                          className="p-1.5 disabled:opacity-30 hover:bg-[#C8A86B]/10 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-mono text-sm text-[#1E1D1A]">
                        {formatPrice(product.price * qty)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Footer */}
            <div className="border-t border-[#C8A86B]/25 px-6 py-5 space-y-4 bg-[#FDFCFB]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#8A82A5]">
                  Subtotal
                </span>
                <span className="font-serif text-xl text-[#1E1D1A]">{formatPrice(subtotal)}</span>
              </div>

              <div className="space-y-1.5 text-[11px] font-light text-[#2C2A26]/75">
                <p className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C8A86B]" />
                  Certificado de autenticidade assinado pelo artista
                </p>
                <p className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-[#C8A86B]" />
                  Logística especializada e seguro de transporte inclusos
                </p>
              </div>

              <button
                onClick={goToCheckout}
                className="w-full py-4 rounded-full bg-[#1E1D1A] text-[#FAF8F5] text-[11px] font-mono tracking-[0.25em] uppercase hover:bg-[#C8A86B] hover:text-[#1E1D1A] transition-colors duration-300"
              >
                Finalizar Compra
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
};
