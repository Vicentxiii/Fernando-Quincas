import React from 'react';
import { ArrowDown, Sparkles, Compass, Hammer, ChevronRight } from 'lucide-react';

interface HeroProps {
  onExploreCollection: () => void;
  onEnterAtelier: () => void;
  onDiscoverGarden: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreCollection,
  onEnterAtelier,
  onDiscoverGarden
}) => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#16251E] text-[#FAF8F5] pt-20 pb-16"
    >
      {/* Background Monumental Sculpture & Botanical Imagery */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=2200&q=90"
          alt="Escultura monumental e fonte ornamental em santuário botânico por Fernando Quincas"
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-[12000ms] ease-out animate-subtleZoom"
          loading="eager"
        />
        {/* Editorial Gradients & Vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#16251E] via-[#16251E]/45 to-[#16251E]/70" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#16251E]/20 to-[#16251E]/80" />
      </div>

      {/* Floating Gold Micro-Detail Accents */}
      <div className="absolute top-1/4 left-8 md:left-16 hidden md:flex flex-col gap-2 items-center text-[#C8A86B]/60 text-[10px] tracking-[0.3em] font-mono [writing-mode:vertical-lr] rotate-180">
        <span>PETRÓPOLIS • BRASIL</span>
        <div className="w-[1px] h-12 bg-[#C8A86B]/30" />
        <span>ARTE MONUMENTAL</span>
      </div>

      <div className="absolute top-1/3 right-8 md:right-16 hidden md:flex flex-col gap-2 items-center text-[#C8A86B]/60 text-[10px] tracking-[0.3em] font-mono [writing-mode:vertical-lr]">
        <span>ROCOCÓ × NATUREZA</span>
        <div className="w-[1px] h-12 bg-[#C8A86B]/30" />
        <span>FOLHA DE OURO 24K</span>
      </div>

      {/* Center Cinematic Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-8 text-center flex flex-col items-center">
        {/* Artist Name & Tagline */}
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-[#C8A86B]/40 bg-[#FAF8F5]/10 backdrop-blur-md mb-6 animate-fadeIn">
          <Sparkles className="w-3.5 h-3.5 text-[#C8A86B]" />
          <span className="text-[11px] sm:text-xs tracking-[0.3em] text-[#FAF8F5] uppercase font-display font-medium">
            FERNANDO QUINCAS
          </span>
          <span className="text-[#C8A86B]">•</span>
          <span className="text-[10px] sm:text-[11px] tracking-[0.25em] text-[#C8A86B] font-serif italic">
            ESCULTOR & MESTRE ARTESÃO
          </span>
        </div>

        {/* Main Statement */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight font-light leading-[1.08] text-[#FAF8F5] max-w-4xl mb-6 drop-shadow-sm">
          ONDE A ARTE <br className="hidden sm:inline" />
          <span className="italic font-normal text-[#E0C995] font-serif">ENCONTRA A NATUREZA</span>
        </h1>

        {/* Delicate Gold Divider */}
        <div className="flex items-center justify-center gap-3 w-full max-w-xs my-3 opacity-80">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#C8A86B]" />
          <div className="w-2 h-2 rotate-45 border border-[#C8A86B] bg-[#16251E]" />
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#C8A86B]" />
        </div>

        {/* Secondary Text */}
        <p className="font-sans text-base sm:text-lg md:text-xl text-[#FAF8F5]/85 max-w-2xl font-light leading-relaxed mb-10 text-balance">
          Esculturas, peças decorativas e criações monumentais moldadas pela imaginação, maestria artesanal e pelo mundo natural.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
          <button
            onClick={onExploreCollection}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#FAF8F5] text-[#16251E] hover:bg-[#E0C995] font-sans text-xs tracking-[0.2em] font-semibold transition-all duration-300 shadow-[0_10px_25px_rgba(0,0,0,0.3)] flex items-center justify-center gap-2 group"
          >
            <span>EXPLORAR AS OBRAS</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#16251E] group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onEnterAtelier}
            className="w-full sm:w-auto px-8 py-4 rounded-full border border-[#C8A86B]/60 bg-[#FAF8F5]/10 hover:bg-[#FAF8F5]/20 backdrop-blur-md text-[#FAF8F5] hover:border-[#C8A86B] font-sans text-xs tracking-[0.2em] font-medium transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Hammer className="w-3.5 h-3.5 text-[#C8A86B]" />
            <span>CONHECER O ATELIÊ</span>
          </button>
        </div>

        {/* Quick Garden Portal Teaser */}
        <div className="mt-14 pt-8 border-t border-[#FAF8F5]/15 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs tracking-[0.18em] text-[#FAF8F5]/70">
          <button
            onClick={onDiscoverGarden}
            className="flex items-center gap-2 hover:text-[#C8A86B] transition-colors group"
          >
            <Compass className="w-4 h-4 text-[#C8A86B] group-hover:rotate-45 transition-transform" />
            <span className="underline-offset-4 hover:underline">VISITAR O SANTUÁRIO BOTÂNICO VIVO</span>
          </button>
          <div className="hidden sm:block text-[#C8A86B]/40">•</div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8A86B]" />
            <span>FIBRA MONUMENTAL & DOURAÇÃO 24K</span>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[#FAF8F5]/50 hover:text-[#C8A86B] transition-colors cursor-pointer">
        <span className="text-[9px] tracking-[0.25em] uppercase font-mono">DESLIZE</span>
        <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
      </div>
    </section>
  );
};
