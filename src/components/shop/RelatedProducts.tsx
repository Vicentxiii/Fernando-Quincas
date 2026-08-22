import React from 'react';
import { Product } from '../../types';
import { getRelatedProducts } from '../../data/products';
import { ProductCard } from './ProductCard';
import { Reveal } from './Reveal';

interface RelatedProductsProps {
  product: Product;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({ product }) => {
  const related = getRelatedProducts(product, 4);
  if (related.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 pb-24 sm:pb-32">
      <Reveal>
        <div className="flex items-end justify-between gap-6 border-b border-[#C8A86B]/25 pb-6 mb-12">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#C8A86B] block mb-2">
              Continuar a Visita
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#1E1D1A]">
              Você também pode <span className="italic text-[#9C7D3E]">gostar</span>
            </h2>
          </div>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-14">
        {related.map((p, i) => (
          <Reveal key={p.id} delay={i * 90}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
};
