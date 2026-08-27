import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../../types';

interface ProductGalleryProps {
  product: Product;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ product }) => {
  const images = product.images;
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const go = useCallback(
    (dir: 1 | -1) => {
      setZoomed(false);
      setIndex((i) => (i + dir + images.length) % images.length);
    },
    [images.length]
  );

  useEffect(() => {
    setIndex(0);
    setZoomed(false);
  }, [product.slug]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  // Slide automático elegante dentro do container — igual ao esquema da Fonte (WEBGL suave) — pausa no hover/zoom
  useEffect(() => {
    if (images.length <= 1 || zoomed || isHovered) return;
    const id = window.setInterval(() => go(1), 2500);
    return () => window.clearInterval(id);
  }, [images.length, zoomed, isHovered, go]);

  return (
    <div className="space-y-4">
      {/* Main stage — slide passando por dentro do container */}
      <div
        className="relative overflow-hidden rounded-3xl border border-[#C8A86B]/25 bg-[#EAE5D8] group/stage select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(dx) > 48) go(dx < 0 ? 1 : -1);
          touchStartX.current = null;
        }}
      >
        <div className="flex items-center justify-center h-[52vh] sm:h-[62vh] lg:h-[72vh]">
          <img
            key={images[index]}
            src={images[index]}
            alt={`${product.name} — imagem ${index + 1} de ${images.length}`}
            loading={index === 0 ? 'eager' : 'lazy'}
            decoding="async"
            onClick={() => setZoomed((z) => !z)}
            className={`max-h-full max-w-full object-contain animate-galleryFade cursor-zoom-in transition-transform duration-700 ease-out ${
              zoomed ? 'scale-[1.35]' : 'scale-100'
            }`}
          />
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              aria-label="Imagem anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#FAF8F5]/85 border border-[#C8A86B]/40 backdrop-blur-sm flex items-center justify-center text-[#1E1D1A] opacity-0 group-hover/stage:opacity-100 focus-visible:opacity-100 hover:bg-[#1E1D1A] hover:text-[#FAF8F5] transition-all duration-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Próxima imagem"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#FAF8F5]/85 border border-[#C8A86B]/40 backdrop-blur-sm flex items-center justify-center text-[#1E1D1A] opacity-0 group-hover/stage:opacity-100 focus-visible:opacity-100 hover:bg-[#1E1D1A] hover:text-[#FAF8F5] transition-all duration-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <span className="absolute bottom-3 right-4 px-2.5 py-1 rounded-full bg-[#1E1D1A]/70 backdrop-blur-md text-[#E0C995] text-[9px] font-mono tracking-widest">
              {String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
            </span>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1 -mx-1 px-1">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => {
                setIndex(i);
                setZoomed(false);
              }}
              aria-label={`Ver imagem ${i + 1}`}
              className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border transition-all duration-300 ${
                i === index
                  ? 'border-[#C8A86B] ring-1 ring-[#C8A86B]/50'
                  : 'border-[#C8A86B]/20 opacity-60 hover:opacity-100 hover:border-[#C8A86B]/60'
              }`}
            >
              <img src={src} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
