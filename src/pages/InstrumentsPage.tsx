import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Music, Heart, Award, Sparkles, ChevronLeft, ChevronRight, Mail } from 'lucide-react';
import { INSTRUMENTS, getFeaturedInstrument } from '../data/instruments';
import { Reveal } from '../components/shop/Reveal';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export const InstrumentsPage: React.FC = () => {
  const navigate = useNavigate();
  const instrument = getFeaturedInstrument();
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const allImages = instrument.gallery;

  useDocumentMeta({
    title: 'Instrumentos — Liras Artesanais',
    description:
      'Liras artesanais de 15 cordas por Fernando Quincas — madeira nobre, coração vazado, timbre cristalino. Cada lira acompanha bolsa porta-lira e guia musical didático. Feitas à mão no ateliê.',
    canonical: 'https://fernandoquincas.com.br/instrumentos',
    type: 'website',
    keywords: 'Fernando Quincas, lira, instrumentos, lira 15 cordas, madeira nobre, instrumentos artesanais, Waldorf',
  });

  const featuredImages = useMemo(() => allImages.slice(0, 3), [allImages]);

  const openLightbox = (idx: number) => setLightboxIdx(idx);
  const closeLightbox = () => setLightboxIdx(null);
  const goPrev = () => setLightboxIdx((i) => (i !== null ? (i - 1 + allImages.length) % allImages.length : null));
  const goNext = () => setLightboxIdx((i) => (i !== null ? (i + 1) % allImages.length : null));

  // Elegant muse: cada 6 fotos, a primeira ocupa 2 colunas
  const galleryItems = allImages;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E1D1A]">
      {/* ───────── Editorial Hero ───────── */}
      <section className="relative pt-36 sm:pt-44 pb-14 sm:pb-20 px-6 sm:px-8 md:px-12 overflow-hidden">
        <div className="absolute top-10 -left-24 w-96 h-96 bg-[#C8A86B]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-20 -right-24 w-[520px] h-[520px] bg-[#16251E]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7 space-y-7">
            <Reveal>
              <span className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] uppercase text-[#C8A86B]">
                <span className="w-8 h-px bg-[#C8A86B]/60" />
                Ateliê • Luteria • Som
              </span>
            </Reveal>

            <Reveal delay={120}>
              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-medium tracking-tight leading-[0.95]">
                INSTRUMENTOS
                <span className="block mt-2 font-serif italic font-light text-2xl sm:text-3xl md:text-4xl text-[#9C7D3E] tracking-normal">
                  liras artesanais
                </span>
              </h1>
            </Reveal>

            <Reveal delay={220}>
              <p className="font-serif italic text-lg sm:text-xl text-[#8A82A5] max-w-xl leading-relaxed">
                Quinze cordas sobre madeira nobre, coração vazado e contas coloridas que guiam as mãos — cada lira nasce afinada no colo, pronta para meditar, estudar e embalar.
              </p>
            </Reveal>

            <Reveal delay={320}>
              <div className="flex items-center gap-4 text-xs font-mono text-[#2C2A26]/70 pt-2">
                <span className="inline-flex items-center gap-1.5"><Music className="w-3.5 h-3.5 text-[#C8A86B]" /> 15 cordas</span>
                <span className="w-8 h-px bg-[#C8A86B]/40" />
                <span>{allImages.length} fotos no acervo</span>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={260}>
              <div className="group relative rounded-3xl overflow-hidden border border-[#C8A86B]/25 aspect-[4/5] max-h-[520px] w-full gold-border-glow bg-white">
                <img
                  src={instrument.featuredImage}
                  alt={instrument.name}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#16251E]/75 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                  <div>
                    <span className="text-[9px] font-mono tracking-[0.28em] uppercase text-[#E0C995] block mb-1">Destaque do Ateliê</span>
                    <span className="font-serif text-lg text-[#FAF8F5] leading-snug block">{instrument.name}</span>
                    <span className="text-xs font-light text-[#FAF8F5]/80">{instrument.subtitle}</span>
                  </div>
                  <span className="w-10 h-10 shrink-0 rounded-full border border-[#E0C995]/60 flex items-center justify-center text-[#E0C995] bg-[#FAF8F5]/10 backdrop-blur-md">
                    <Heart className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────── Narrative + Featured Carousel ───────── */}
      <section className="relative bg-[#16251E] text-[#FAF8F5] py-20 sm:py-28 px-6 sm:px-8 md:px-12 overflow-hidden">
        <div className="absolute -top-32 right-0 w-[500px] h-[500px] bg-[#C8A86B]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <Reveal>
              <div className="relative rounded-3xl overflow-hidden border border-[#E0C995]/25 aspect-[16/11] bg-[#0F1B15] group">
                <img
                  src={featuredImages[activeIdx]?.src ?? instrument.featuredImage}
                  alt={featuredImages[activeIdx]?.alt ?? instrument.name}
                  className="w-full h-full object-cover transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1713]/40 via-transparent to-transparent pointer-events-none" />
                {/* Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#16251E]/55 backdrop-blur-md border border-[#E0C995]/20">
                  {featuredImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIdx(i)}
                      aria-label={`Ver imagem ${i + 1}`}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${i === activeIdx ? 'bg-[#E0C995] w-4' : 'bg-[#FAF8F5]/60 hover:bg-[#FAF8F5]'}`}
                    />
                  ))}
                </div>
              </div>
              <p className="mt-3 text-center text-xs font-serif italic text-[#E0C995]/70">
                {featuredImages[activeIdx]?.caption ?? instrument.subtitle}
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-5 order-1 lg:order-2 space-y-6">
            <Reveal>
              <span className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] uppercase text-[#E0C995]">
                <span className="w-8 h-px bg-[#C8A86B]/60" />
                A Lira no Ateliê
              </span>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light leading-tight">Som que abraça o colo</h2>
            </Reveal>
            {instrument.description.map((para, i) => (
              <Reveal key={i} delay={180 + i * 80}>
                <p className={`${i === 0 ? 'font-serif italic text-base sm:text-lg text-[#E0C995]/90' : 'text-sm font-light text-[#FAF8F5]/75'} leading-relaxed`}>
                  {para}
                </p>
              </Reveal>
            ))}
            <Reveal delay={420}>
              <div className="flex flex-wrap gap-3 pt-2">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FAF8F5]/10 border border-[#E0C995]/20 text-xs font-mono tracking-wide text-[#E0C995]">
                  <Award className="w-3.5 h-3.5" /> Afinação manual
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FAF8F5]/10 border border-[#E0C995]/20 text-xs font-mono tracking-wide text-[#E0C995]">
                  <Sparkles className="w-3.5 h-3.5" /> Waldorf & Terapia
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────── Gallery — toutes les lires ───────── */}
      <section className="py-20 sm:py-28 px-6 sm:px-8 md:px-12">
        <div className="max-w-7xl mx-auto space-y-12">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#C8A86B]/25 pb-8">
              <div>
                <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#C8A86B] block mb-2">Acervo Completo</span>
                <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-tight">
                  TODAS AS <span className="italic text-[#9C7D3E]">LIRAS</span>
                </h2>
                <p className="mt-3 font-serif italic text-[#8A82A5] max-w-lg">Toque para ampliar • {allImages.length} fotografias do atelier: instrumento, bolsa, guia e bastidores.</p>
              </div>
              <span className="hidden md:block text-xs font-mono text-[#8A82A5]">{allImages.length} fotos • clique para lightbox</span>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 auto-rows-[320px] sm:auto-rows-[360px]">
            {galleryItems.map((img, i) => {
              const isWide = i % 6 === 0; // a cada 6, destaque elegante
              return (
                <Reveal key={`${img.src}-${i}`} delay={(i % 3) * 80} className={isWide ? 'sm:col-span-2 lg:col-span-2' : ''}>
                  <button
                    onClick={() => openLightbox(i)}
                    className="group relative w-full h-full rounded-3xl overflow-hidden border border-[#C8A86B]/20 bg-white text-left shadow-sm hover:shadow-md transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-[#C8A86B]/40"
                    aria-label={`Ampliar ${img.alt}`}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading={i < 6 ? 'eager' : 'lazy'}
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E1D1A]/55 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                      <span className="inline-flex items-center gap-1.5 text-[9px] font-mono tracking-[0.22em] uppercase text-[#E0C995] bg-[#1E1D1A]/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#E0C995]/20">
                        <Music className="w-3 h-3" /> {String(i + 1).padStart(2, '0')} / {String(allImages.length).padStart(2, '0')}
                      </span>
                      <p className="mt-2 font-serif text-sm sm:text-base text-[#FAF8F5] leading-snug line-clamp-2">{img.caption ?? img.alt}</p>
                    </div>
                    <span className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FAF8F5]/85 backdrop-blur-md border border-[#C8A86B]/30 flex items-center justify-center text-[#1E1D1A] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Sparkles className="w-3.5 h-3.5 text-[#9C7D3E]" />
                    </span>
                  </button>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────── Details strip ───────── */}
      <section className="border-t border-[#C8A86B]/25 py-16 px-6 sm:px-8 md:px-12 bg-[#FDFCFB]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <Reveal>
            <div className="space-y-3">
              <Heart className="w-5 h-5 text-[#C8A86B]" strokeWidth={1.5} />
              <h3 className="font-display text-xs tracking-[0.2em] uppercase">O que acompanha</h3>
              <ul className="text-xs font-light text-[#2C2A26]/75 leading-relaxed space-y-1.5">
                {instrument.details.includes.map((it) => (
                  <li key={it} className="flex gap-2"><span className="text-[#C8A86B]">•</span> {it}</li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="space-y-3">
              <Award className="w-5 h-5 text-[#C8A86B]" strokeWidth={1.5} />
              <h3 className="font-display text-xs tracking-[0.2em] uppercase">Materiais & Medidas</h3>
              <p className="text-xs font-light text-[#2C2A26]/75 leading-relaxed">
                <span className="font-medium text-[#1E1D1A]">{instrument.details.dimensions}</span> • {instrument.details.weight}<br />
                {instrument.details.materials.join(' • ')}<br />
                <span className="italic text-[#8A82A5]">{instrument.details.technique}</span>
              </p>
            </div>
          </Reveal>
          <Reveal delay={160}>
            <div className="space-y-3">
              <Sparkles className="w-5 h-5 text-[#C8A86B]" strokeWidth={1.5} />
              <h3 className="font-display text-xs tracking-[0.2em] uppercase">Edição & Encomenda</h3>
              <p className="text-xs font-light text-[#2C2A26]/75 leading-relaxed">
                {instrument.details.edition}<br />
                <span className="font-mono text-[11px] tracking-wide text-[#9C7D3E]">{instrument.priceNote}</span>
              </p>
              <button onClick={() => navigate('/', { state: { scrollTo: 'contact' } })} className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 rounded-full bg-[#1E1D1A] text-[#FAF8F5] text-[10px] font-mono tracking-[0.2em] uppercase hover:bg-[#C8A86B] hover:text-[#1E1D1A] transition-colors">
                <Mail className="w-3.5 h-3.5" /> Consultar o Ateliê
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────── Lightbox ───────── */}
      {lightboxIdx !== null && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-8" role="dialog" aria-modal="true" aria-label="Galeria de liras ampliada">
          <button aria-label="Fechar" onClick={closeLightbox} className="absolute inset-0 bg-[#0D1713]/85 backdrop-blur-sm" />
          <div className="relative w-full max-w-6xl max-h-[88vh] rounded-3xl overflow-hidden bg-[#FAF8F5] border border-[#C8A86B]/20 shadow-2xl animate-galleryFade flex flex-col">
            <div className="relative flex-1 min-h-0 bg-[#0F1B15] flex items-center justify-center">
              <img
                src={allImages[lightboxIdx].src}
                alt={allImages[lightboxIdx].alt}
                className="max-w-full max-h-[70vh] w-auto h-auto object-contain"
              />
              <button
                onClick={goPrev}
                aria-label="Anterior"
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#FAF8F5]/90 backdrop-blur-md border border-[#C8A86B]/30 text-[#1E1D1A] flex items-center justify-center hover:bg-[#C8A86B] hover:text-[#FAF8F5] hover:border-[#C8A86B] transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goNext}
                aria-label="Próxima"
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#FAF8F5]/90 backdrop-blur-md border border-[#C8A86B]/30 text-[#1E1D1A] flex items-center justify-center hover:bg-[#C8A86B] hover:text-[#FAF8F5] hover:border-[#C8A86B] transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={closeLightbox}
                aria-label="Fechar"
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-[#1E1D1A]/80 backdrop-blur-md border border-[#FAF8F5]/20 text-[#FAF8F5] flex items-center justify-center hover:bg-[#6B1D2F] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-6 sm:px-8 py-4 bg-[#FAF8F5] border-t border-[#C8A86B]/15 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-serif text-sm sm:text-base text-[#1E1D1A] truncate">{allImages[lightboxIdx].caption ?? allImages[lightboxIdx].alt}</p>
                <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#8A82A5]">{String(lightboxIdx + 1).padStart(2, '0')} / {String(allImages.length).padStart(2, '0')} • {instrument.name}</p>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-mono tracking-[0.18em] uppercase text-[#C8A86B] border border-[#C8A86B]/30 px-3 py-1.5 rounded-full">
                <Music className="w-3 h-3" /> Use as setas
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
