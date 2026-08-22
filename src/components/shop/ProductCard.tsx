import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Product } from '../../types';
import { formatPrice, isAvailable } from '../../data/products';

interface ProductCardProps {
  product: Product;
  eager?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, eager = false }) => {
  const available = isAvailable(product);

  return (
    <Link
      to={`/loja/${product.slug}`}
      className="group flex flex-col focus:outline-none"
      aria-label={`${product.name} — ${formatPrice(product.price)}`}
    >
      <div className="relative overflow-hidden rounded-2xl border border-[#C8A86B]/20 bg-[#EAE5D8] aspect-[4/5] gold-border-glow transition-all duration-500">
        <img
          src={product.images[0]}
          alt={product.name}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.045]"
        />

        {/* Availability veil */}
        {!available && (
          <div className="absolute inset-0 bg-[#FAF8F5]/55 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-4 py-2 rounded-full border border-[#1E1D1A]/25 bg-[#FAF8F5]/85 text-[10px] font-mono tracking-[0.25em] uppercase text-[#1E1D1A]">
              Obra Adquirida
            </span>
          </div>
        )}

        {/* Discreet hover affordance */}
        <span className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-[#FAF8F5]/85 border border-[#C8A86B]/40 flex items-center justify-center opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
          <ArrowUpRight className="w-3.5 h-3.5 text-[#9C7D3E]" />
        </span>
      </div>

      <div className="pt-5 pb-1 space-y-1.5 px-0.5">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-[9px] font-mono tracking-[0.28em] uppercase text-[#C8A86B]">
            {product.category}
          </span>
          <span
            className={`flex items-center gap-1.5 text-[9px] font-mono tracking-[0.18em] uppercase ${
              available ? 'text-[#6A7D69]' : 'text-[#8A82A5]'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${available ? 'bg-[#C8A86B]' : 'bg-[#D8D2C4]'}`} />
            {available ? 'Disponível' : 'Adquirida'}
          </span>
        </div>

        <h3 className="font-serif text-xl leading-snug text-[#1E1D1A] group-hover:text-[#9C7D3E] transition-colors duration-300">
          {product.name}
        </h3>

        <p className="text-xs font-serif italic text-[#8A82A5] line-clamp-1">
          {product.shortDescription}
        </p>

        <p className="pt-1 font-mono text-sm tracking-wide text-[#1E1D1A]">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
};
