import React, { useEffect, useState } from 'react';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { STORYBOOK_IMAGES } from '../data/storyBookImages';

const SITE_URL = 'https://fernandoquincas.com.br';

export const StoryBookPage: React.FC = () => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const total = STORYBOOK_IMAGES.length;

  useDocumentMeta({
    title: 'StoryBook — Livro Histórico de Fernando Quincas | 51 Páginas de Feiras, Galpões e Obras Monumentais',
    description: 'StoryBook de Fernando Quincas: 51 páginas do acervo histórico com feiras antigas, galpões, esculturas gigantes em fibra de vidro e bastidores do ateliê. Acervo indexável para Google, Bing e IAs.',
    canonical: `${SITE_URL}/storybook`,
    image: `/Book/${STORYBOOK_IMAGES[0]?.filename}`,
    type: 'website',
    keywords: 'Fernando Quincas, StoryBook, livro histórico, escultor brasileiro, fibra de vidro, obras monumentais, feiras antigas, galpão ateliê, esculturas gigantes, acervo histórico, Blumenau',
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightboxIndex !== null) {
        if (e.key === 'Escape') { e.preventDefault(); setLightboxIndex(null); return; }
        if (e.key === 'ArrowRight') { e.preventDefault(); setLightboxIndex(i => i !== null ? Math.min(total - 1, i + 1) : i); return; }
        if (e.key === 'ArrowLeft') { e.preventDefault(); setLightboxIndex(i => i !== null ? Math.max(0, i - 1) : i); return; }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex, total]);

  useEffect(() => {
    if (lightboxIndex !== null) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [lightboxIndex]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: 'StoryBook — Livro Histórico de Fernando Quincas',
    creator: { '@type': 'Person', name: 'Fernando Quincas', url: SITE_URL },
    about: 'Acervo histórico de 51 fotografias de feiras antigas, galpões e obras monumentais em fibra de vidro do escultor brasileiro Fernando Quincas',
    isAccessibleForFree: true,
    inLanguage: 'pt-BR',
    numberOfPages: total,
    image: STORYBOOK_IMAGES.slice(0, 6).map(i => i.contentUrl),
    hasPart: STORYBOOK_IMAGES.map((img, idx) => ({
      '@type': 'ImageObject',
      contentUrl: img.contentUrl,
      name: img.title,
      description: img.description,
      caption: img.caption,
      representativeOfPage: idx === 0,
      encodingFormat: 'image/jpeg',
      creator: { '@type': 'Person', name: 'Fernando Quincas' },
    })),
  };

  return (
    <main className="min-h-screen bg-[#F9F6F0] text-[#1E1D1A] flex flex-col selection:bg-[#C8A86B]/25">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="h-[84px] sm:h-[94px]" aria-hidden />
      <section className="max-w-5xl mx-auto px-6 sm:px-8 pt-6 sm:pt-8 pb-3 text-center">
        <span className="inline-block font-mono text-[10px] tracking-[0.32em] uppercase text-[#C8A86B]">Acervo Histórico • 1980—2005</span>
        <h1 className="mt-3 font-display text-[26px] sm:text-[40px] font-semibold leading-[0.95] tracking-[-0.02em] text-[#1E1D1A]">
          StoryBook<span className="font-serif italic font-light text-[#C8A86B]"> de</span> Fernando Quincas
        </h1>
        <p className="mt-3 font-serif text-[14px] sm:text-[16px] leading-6 sm:leading-7 text-[#2C2A26]/75 max-w-3xl mx-auto">
          51 páginas fotografadas do livro físico: feiras antigas, galpões do ateliê no Jaguari e esculturas gigantes em fibra de vidro. Toque em qualquer foto para ampliar.
        </p>
        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] font-mono tracking-widest uppercase text-[#8A82A5]">
          <span className="w-8 h-px bg-[#C8A86B]/30" aria-hidden />
          <span>Livro físico digitalizado • Edição única</span>
          <span className="w-8 h-px bg-[#C8A86B]/30" aria-hidden />
        </div>
      </section>

      <article className="max-w-5xl mx-auto w-full px-6 sm:px-8 mt-6 sm:mt-8">
        <header className="border-t border-[#C8A86B]/15 pt-7">
          <h2 className="font-display text-xl sm:text-2xl font-semibold tracking-[-0.01em] text-[#1E1D1A]">Sobre este StoryBook — acervo histórico</h2>
          <p className="mt-3 font-sans text-[14px] leading-6 text-[#2C2A26]/75">
            O StoryBook reúne 51 fotografias do livro físico de Fernando Quincas, mestre em fibra de vidro há quatro décadas. Cada página foi fotografada e renomeada semanticamente para descoberta por Google, Bing e IAs. As imagens mostram feiras antigas, galpões do ateliê no Jaguari, transporte de esculturas gigantes, fontes e colunas, e obras como a Boneca Eva (45 m) e o Papai Noel gigante de Blumenau. Todas em <code className="px-1.5 py-0.5 rounded bg-[#F0ECE1] text-[12px]">/Book/nome-do-arquivo.jpg</code>.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="px-2.5 py-1 rounded-full bg-[#1E1D1A] text-[#FAF8F5] font-mono text-[10px] tracking-widest uppercase">Escultor • Fernando Quincas</span>
            <span className="px-2.5 py-1 rounded-full border border-[#C8A86B]/20 bg-white font-mono text-[10px] tracking-widest uppercase text-[#8A82A5]">Fibra de vidro • Obras monumentais</span>
            <span className="px-2.5 py-1 rounded-full border border-[#C8A86B]/20 bg-white font-mono text-[10px] tracking-widest uppercase text-[#8A82A5]">Blumenau • Minas Gerais • Brasil</span>
          </div>
        </header>

        <section aria-label="Foto do StoryBook físico" className="mt-8">
          <h3 className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#C8A86B]">O StoryBook físico</h3>
          <figure className="mt-3 rounded-2xl overflow-hidden border border-[#C8A86B]/15 bg-[#FDFCFB]">
            <img
              src={STORYBOOK_IMAGES[49].src}
              alt={STORYBOOK_IMAGES[49].alt}
              title={STORYBOOK_IMAGES[49].title}
              width={1200}
              height={900}
              loading="eager"
              decoding="async"
              className="w-full h-auto object-cover"
            />
            <figcaption className="px-4 py-3 bg-[#FAF8F5] font-serif italic text-sm text-[#2C2A26]/70">
              {STORYBOOK_IMAGES[49].caption} — capa do StoryBook físico.
            </figcaption>
          </figure>
        </section>

        <section aria-label="Galeria indexável — todas as páginas do StoryBook" className="mt-10">
          <h3 className="font-display text-lg font-semibold text-[#1E1D1A]">Galeria indexável — 51 páginas</h3>
          <p className="mt-2 font-sans text-[13px] leading-6 text-[#2C2A26]/70">
            Toque em qualquer foto para ampliar. Cada imagem tem <code>alt</code>, <code>title</code>, <code>width/height</code> e <code>loading</code> otimizados — sem distorção.
          </p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {STORYBOOK_IMAGES.map((img, idx) => (
              <figure key={img.filename} id={`storybook-page-${idx + 1}`} className="group rounded-2xl overflow-hidden border border-[#C8A86B]/15 bg-white shadow-[0_8px_22px_rgba(30,29,26,0.06)] hover:shadow-[0_12px_30px_rgba(30,29,26,0.10)] transition-shadow">
                <button
                  type="button"
                  onClick={() => setLightboxIndex(idx)}
                  aria-label={`Abrir ${img.caption} em tela cheia`}
                  className="relative aspect-[4/3] overflow-hidden bg-[#F0ECE1] w-full text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A86B] focus-visible:ring-inset"
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    title={img.title}
                    width={1200}
                    height={900}
                    loading={idx < 3 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="w-full h-full object-cover transition-[transform,filter] duration-700 group-hover:scale-[1.02]"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2 py-1 rounded-full bg-[#1E1D1A]/85 text-white font-mono text-[10px] tracking-widest">
                    {String(idx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                  </span>
                  <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity bg-[#1E1D1A]/0 group-hover:bg-[#1E1D1A]/12">
                    <span className="px-3 py-1.5 rounded-full bg-white/92 text-[#1E1D1A] font-mono text-[11px] tracking-widest uppercase shadow-sm">Toque para ampliar</span>
                  </span>
                </button>
                <figcaption className="px-4 py-3">
                  <h4 className="font-sans text-[12px] font-semibold leading-4 text-[#1E1D1A] line-clamp-2">{img.caption}</h4>
                  <p className="mt-1 font-serif italic text-xs leading-4 text-[#8A82A5] line-clamp-3">{img.description}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <button onClick={() => setLightboxIndex(idx)} className="inline-flex items-center gap-1 font-mono text-[10px] tracking-widest uppercase text-[#1E1D1A] bg-[#F0ECE1] hover:bg-[#C8A86B]/20 px-2.5 py-1 rounded-full transition-colors">
                      Ampliar
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden><path d="M3 7L7 3M7 3H4M7 3V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                    <a href={img.src} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="inline-flex items-center gap-1 font-mono text-[10px] tracking-widest uppercase text-[#8A82A5] hover:text-[#C8A86B] transition-colors">
                      Original
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden><path d="M3 7L7 3M7 3H4M7 3V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </a>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-[#C8A86B]/12 bg-[#FDFCFB] p-6 sm:p-7">
          <h3 className="font-display text-base font-semibold text-[#1E1D1A]">O que este StoryBook documenta</h3>
          <ul className="mt-3 grid sm:grid-cols-2 gap-2 font-sans text-[13px] leading-6 text-[#2C2A26]/75 list-disc pl-5">
            <li><strong>Feiras antigas</strong> — vasos, colunas gregas e esculturas gigantes em fibra de vidro nos anos 1980–1990.</li>
            <li><strong>Galpões do ateliê</strong> — Jaguari, Serra dos Órgãos, moldes, laminação, pintura PU e pátina mineral.</li>
            <li><strong>Obras monumentais</strong> — Boneca Eva 45 m, Galinha de Monte Verde, Papai Noel gigante, cisnes, cavalinhos e grutas.</li>
            <li><strong>Paisagismo</strong> — fontes, cascatas, lagos ornamentais e jardins com esculturas.</li>
          </ul>
          <p className="mt-4 font-mono text-[11px] tracking-wide uppercase text-[#8A82A5]">Todas as páginas: public/Book • URLs públicas • Indexáveis • GEO ready</p>
        </section>
      </article>
      <div className="h-10 sm:h-14" aria-hidden />

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[80] bg-[#0F0E0D]/92 backdrop-blur-[6px] flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label={`Imagem ${String(lightboxIndex + 1).padStart(2, '0')} de ${String(total).padStart(2, '0')} ampliada`}
          onClick={(e) => { if (e.target === e.currentTarget) setLightboxIndex(null); }}
        >
          <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 shrink-0">
            <button
              onClick={() => setLightboxIndex(null)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-[#1E1D1A] font-mono text-[12px] tracking-[0.14em] uppercase shadow-[0_4px_16px_rgba(0,0,0,0.18)] active:scale-[0.98] transition-transform min-h-[44px] min-w-[88px] justify-center"
              aria-label="Voltar para galeria"
              autoFocus
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Voltar
            </button>
            <span className="font-mono text-[11px] tracking-[0.22em] text-white/75 tabular-nums">
              {String(lightboxIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
            <button
              onClick={() => setLightboxIndex(null)}
              aria-label="Fechar imagem ampliada"
              className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/14 active:bg-white/20 text-white flex items-center justify-center border border-white/15 shrink-0 min-w-[44px] min-h-[44px] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>
            </button>
          </div>

          <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-3 sm:p-6 lg:p-8 overflow-auto gap-4">
            <img
              src={STORYBOOK_IMAGES[lightboxIndex].src}
              alt={STORYBOOK_IMAGES[lightboxIndex].alt}
              title={STORYBOOK_IMAGES[lightboxIndex].title}
              width={1600}
              height={1200}
              decoding="async"
              className="max-w-full max-h-[62vh] sm:max-h-[68vh] w-auto h-auto object-contain rounded-xl shadow-[0_16px_40px_rgba(0,0,0,0.45)] bg-white"
              draggable={false}
            />
            <div className="max-w-2xl w-full text-center px-2">
              <h3 className="font-sans text-[13px] sm:text-sm font-semibold leading-4 text-white">{STORYBOOK_IMAGES[lightboxIndex].caption}</h3>
              <p className="mt-1.5 font-serif italic text-xs sm:text-[13px] leading-5 text-white/68 line-clamp-3">{STORYBOOK_IMAGES[lightboxIndex].description}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 sm:px-6 py-4 sm:py-5 border-t border-white/10 shrink-0 bg-[#0F0E0D]/40">
            <button
              onClick={() => setLightboxIndex(i => i !== null ? Math.max(0, i - 1) : i)}
              disabled={lightboxIndex === 0}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-white text-[#1E1D1A] disabled:opacity-30 disabled:cursor-not-allowed font-mono text-[11px] tracking-[0.16em] uppercase min-h-[44px] active:scale-[0.98] transition-transform"
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden className="hidden sm:block"><path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Anterior
            </button>
            <a
              href={STORYBOOK_IMAGES[lightboxIndex].src}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] tracking-widest uppercase text-white/60 hover:text-white transition-colors px-2"
            >
              Abrir original
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden><path d="M3 7L7 3M7 3H4M7 3V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
            <button
              onClick={() => setLightboxIndex(i => i !== null ? Math.min(total - 1, i + 1) : i)}
              disabled={lightboxIndex === total - 1}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-[#C8A86B] text-[#1E1D1A] disabled:opacity-30 disabled:cursor-not-allowed font-mono text-[11px] tracking-[0.16em] uppercase min-h-[44px] active:scale-[0.98] transition-transform"
            >
              Próxima
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden className="hidden sm:block"><path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default StoryBookPage;
