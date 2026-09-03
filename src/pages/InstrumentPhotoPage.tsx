import React, { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Music, ArrowLeft, ShoppingBag, Heart } from 'lucide-react';
import { getInstrumentImageBySlug, getFeaturedInstrument } from '../data/instruments';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export const InstrumentPhotoPage: React.FC = () => {
  const { photoSlug } = useParams<{ photoSlug: string }>();
  const navigate = useNavigate();
  const instrument = getFeaturedInstrument();
  const allImages = instrument.gallery;
  const idx = allImages.findIndex((img) => img.slug === photoSlug);
  const image = idx >= 0 ? allImages[idx] : null;

  const prev = idx >= 0 ? allImages[(idx - 1 + allImages.length) % allImages.length] : null;
  const next = idx >= 0 ? allImages[(idx + 1) % allImages.length] : null;

  useDocumentMeta({
    title: image?.seoTitle ?? image?.caption ?? 'Foto da Lira',
    description: image?.seoDescription ?? image?.alt ?? 'Foto da Lira artesanal por Fernando Quincas',
    canonical: image ? `https://fernandoquincas.com.br/instrumentos/${image.slug}` : 'https://fernandoquincas.com.br/instrumentos',
    type: 'article',
    keywords: 'Fernando Quincas, lira, instrumentos, lira 15 cordas, foto, detalhe',
    image: image?.src,
  });

  // Keyboard arrows (setas) navegam entre fotos também na página dedicada
  useEffect(() => {
    if (!image) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && prev) navigate(`/instrumentos/${prev.slug}`);
      if (e.key === 'ArrowRight' && next) navigate(`/instrumentos/${next.slug}`);
      if (e.key === 'Escape') navigate('/instrumentos');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [image, prev, next, navigate]);

  // Touch swipe
  useEffect(() => {
    if (!image) return;
    let startX = 0;
    const onTouchStart = (e: TouchEvent) => { startX = e.touches[0].clientX; };
    const onTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 60) {
        if (dx < 0 && next) navigate(`/instrumentos/${next.slug}`);
        if (dx > 0 && prev) navigate(`/instrumentos/${prev.slug}`);
      }
    };
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [image, prev, next, navigate]);

  if (!image) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center space-y-6 bg-[#FAF8F5] text-[#1E1D1A] pt-24">
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#C8A86B]">Foto não encontrada</span>
        <h1 className="font-display text-3xl font-semibold">Foto não encontrada</h1>
        <Link to="/instrumentos" className="px-6 py-3 rounded-full bg-[#1E1D1A] text-[#FAF8F5] text-xs font-mono tracking-widest uppercase hover:bg-[#C8A86B] hover:text-[#1E1D1A] transition-colors">
          Voltar para Instrumentos
        </Link>
      </div>
    );
  }

  const handleAcquire = () => {
    navigate('/', { state: { scrollTo: 'contact' } });
    // also could open WhatsApp - we keep contact scroll
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E1D1A] pt-28 sm:pt-32 pb-12 px-6 sm:px-8 md:px-12">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb + back */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link to="/instrumentos" className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.18em] uppercase text-[#8A82A5] hover:text-[#C8A86B] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar para Instrumentos
          </Link>
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#C8A86B] hidden sm:inline-flex items-center gap-1.5">
            <Music className="w-3 h-3" /> {String(idx + 1).padStart(2, '0')} / {String(allImages.length).padStart(2, '0')}
          </span>
        </div>

        {/* Image card */}
        <div className="rounded-3xl overflow-hidden border border-[#C8A86B]/20 bg-white shadow-sm">
          <div className="relative bg-[#0F1B15] flex items-center justify-center min-h-[380px] sm:min-h-[520px]">
            <img
              src={image.src}
              alt={image.alt}
              className="max-w-full max-h-[68vh] w-auto h-auto object-contain"
              loading="eager"
              decoding="async"
            />
            {prev && (
              <Link
                to={`/instrumentos/${prev.slug}`}
                aria-label="Foto anterior"
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#FAF8F5]/90 backdrop-blur-md border border-[#C8A86B]/30 text-[#1E1D1A] flex items-center justify-center hover:bg-[#C8A86B] hover:text-[#FAF8F5] hover:border-[#C8A86B] transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
            )}
            {next && (
              <Link
                to={`/instrumentos/${next.slug}`}
                aria-label="Próxima foto"
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#FAF8F5]/90 backdrop-blur-md border border-[#C8A86B]/30 text-[#1E1D1A] flex items-center justify-center hover:bg-[#C8A86B] hover:text-[#FAF8F5] hover:border-[#C8A86B] transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </Link>
            )}
          </div>

          {/* SEO texto embaixo da foto + botão */}
          <div className="px-6 sm:px-8 py-6 sm:py-8 space-y-4 bg-[#FAF8F5]">
            <div className="space-y-2">
              <h1 className="font-display text-xl sm:text-2xl font-medium tracking-tight leading-tight">
                {image.seoTitle ?? image.caption}
              </h1>
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#C8A86B]">
                Foto {String(idx + 1).padStart(2, '0')} de {String(allImages.length).padStart(2, '0')} • {instrument.name} • Fernando Quincas
              </p>
              <p className="font-serif italic text-base sm:text-lg text-[#8A82A5] leading-relaxed">
                {image.seoCaption ?? image.caption}
              </p>
              <p className="text-sm font-light text-[#2C2A26]/80 leading-relaxed">
                {image.seoDescription}
              </p>
              <p className="text-xs font-light text-[#8A82A5] leading-relaxed pt-2 border-t border-[#C8A86B]/15">
                Uso: <span className="font-mono text-[11px] tracking-wide text-[#9C7D3E]">https://fernandoquincas.com.br/instrumentos/{image.slug}</span> — URL dedicada para SEO. Use as <span className="font-medium text-[#C8A86B]">setas ← →</span> do teclado ou deslize no celular para navegar.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={handleAcquire}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#1E1D1A] text-[#FAF8F5] text-[11px] font-mono tracking-[0.2em] uppercase hover:bg-[#C8A86B] hover:text-[#1E1D1A] transition-colors"
              >
                <ShoppingBag className="w-4 h-4" /> Adquirir minha lira
              </button>
              <span className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.18em] uppercase text-[#8A82A5]">
                <Heart className="w-3 h-3 text-[#C8A86B]" /> Série artesanal • Bolsa e guia inclusos
              </span>
            </div>

            {/* navegação thumbnails */}
            <div className="pt-6 border-t border-[#C8A86B]/15">
              <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#8A82A5] mb-3">Navegue pelas {allImages.length} fotos</p>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {allImages.map((img, i) => (
                  <Link
                    key={img.slug}
                    to={`/instrumentos/${img.slug}`}
                    className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${i === idx ? 'border-[#C8A86B]' : 'border-transparent hover:border-[#C8A86B]/40'}`}
                    aria-label={`Ir para ${img.seoTitle}`}
                  >
                    <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                  </Link>
                ))}
              </div>
            </div>

            {/* JSON-LD per photo */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'ImageObject',
                  name: image.seoTitle,
                  description: image.seoDescription,
                  caption: image.seoCaption,
                  contentUrl: `https://fernandoquincas.com.br${image.src}`,
                  url: `https://fernandoquincas.com.br/instrumentos/${image.slug}`,
                  author: { '@type': 'Person', name: 'Fernando Quincas' },
                  creator: { '@type': 'Person', name: 'Fernando Quincas' },
                }),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
