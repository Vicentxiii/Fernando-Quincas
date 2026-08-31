import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowDown, Sparkles, Hammer, ChevronRight, ShoppingBag } from 'lucide-react';

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
  const navigate = useNavigate();
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center md:justify-start overflow-hidden bg-[#16251E] text-[#FAF8F5] pt-28 sm:pt-24 md:pt-20 pb-16 px-6 sm:px-8 md:px-0 md:pl-[14%] md:pr-10"
    >
      {/* Background Monumental Sculpture & Botanical Imagery */}
      <div className="absolute inset-0 z-0">
        <img
          src={encodeURI('/Atelier Fernando Quincas.png')}
          alt="Atelier de Fernando Quincas, mestre artesão em fibra de vidro, com esculturas monumentais e fontes esculturais"
          className="hidden md:block w-full h-full object-cover object-right scale-100 transition-transform duration-[12000ms] ease-out animate-subtleZoom"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          width="1920"
          height="1080"
        />
        <img
          src={encodeURI('/Hero para Mobile Fernando Quincas Escultor.png')}
          alt="Atelier de Fernando Quincas, mestre artesão em fibra de vidro - esculturas monumentais"
          className="md:hidden w-full h-full object-cover object-center scale-100 transition-transform duration-[12000ms] ease-out animate-subtleZoom"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          width="800"
          height="1200"
        />
        {/* Editorial Gradients & Vignettes */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#16251E]/90 via-[#16251E]/35 to-[#16251E]/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#16251E] via-transparent to-[#16251E]/30" />
      </div>

      {/* Floating Gold Micro-Detail Accents */}
      <div className="absolute top-1/4 left-8 md:left-16 hidden md:flex flex-col gap-2 items-center text-[#C8A86B]/60 text-[10px] tracking-[0.3em] font-mono [writing-mode:vertical-lr] rotate-180">
        <span>MINAS GERAIS • BRASIL</span>
        <div className="w-[1px] h-12 bg-[#C8A86B]/30" />
        <span>ARTE MONUMENTAL</span>
      </div>

      <div className="absolute top-1/3 right-8 md:right-16 hidden md:flex flex-col gap-2 items-center text-[#C8A86B]/60 text-[10px] tracking-[0.3em] font-mono [writing-mode:vertical-lr]">
        <span>ROCOCÓ × NATUREZA</span>
        <div className="w-[1px] h-12 bg-[#C8A86B]/30" />
        <span>FOLHA DE OURO 24K</span>
      </div>

      {/* Cinematic Editorial Content */}
      <div className="relative z-10 w-full max-w-[560px] text-center md:text-left flex flex-col items-center md:items-start md:mt-12">
        {/* Artist Name & Tagline */}
        <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full border border-[#C8A86B]/30 bg-[#FAF8F5]/5 backdrop-blur-md mb-8">
          <Sparkles className="w-3 h-3 text-[#C8A86B]" />
          <span className="text-[10px] sm:text-[11px] tracking-[0.3em] text-[#FAF8F5] uppercase font-display font-medium">
            FERNANDO QUINCAS
          </span>
          <span className="text-[#C8A86B]">•</span>
          <span className="text-[10px] sm:text-[10px] tracking-[0.25em] text-[#C8A86B] font-serif italic">
            ESCULTOR & MESTRE ARTESÃO
          </span>
        </div>

        {/* Main Statement - SEO H1 otimizado para Google e IAs: mestre artesão em fibra de vidro */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-[2.95rem] 2xl:text-[3.4rem] tracking-tight font-light leading-[1.12] text-[#FAF8F5] mb-4 drop-shadow-sm text-balance">
          Conheça o Atelier de <br />
          <span className="font-semibold text-[#FAF8F5]">Fernando Quincas</span> <br />
          <span className="italic font-normal text-[#E0C995] font-serif text-2xl sm:text-3xl md:text-[2.2rem]">Mestre Artesão em Fibra de Vidro</span>
        </h1>
        <p className="font-serif italic text-base sm:text-lg text-[#E0C995]/90 tracking-wide mb-1">Onde a Arte Encontra a Natureza</p>

        {/* Delicate Gold Divider */}
        <div className="flex items-center gap-3 w-24 md:w-28 my-6 opacity-60">
          <div className="h-px flex-1 bg-gradient-to-r from-[#C8A86B] to-transparent" />
          <div className="w-1.5 h-1.5 rotate-45 border border-[#C8A86B] bg-[#16251E]" />
        </div>

        {/* Secondary Text - SEO */}
        <p className="font-sans text-base md:text-lg text-[#FAF8F5]/85 max-w-[480px] font-light leading-relaxed mb-10 text-balance">
          Esculturas monumentais, fontes, vasos e peças decorativas em <strong className="font-semibold text-[#FAF8F5]/95">fibra de vidro</strong>, douração 24k e pedra reconstituída — feitas à mão no atelier de Minas Gerais para jardins, fazendas e projetos sob medida.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-start gap-4 w-full sm:w-auto">
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

        {/* Quick Shop Portal Teaser */}
        <div className="mt-10 pt-6 border-t border-[#FAF8F5]/10 flex flex-wrap items-center justify-center md:justify-start gap-6 sm:gap-8 text-xs tracking-[0.18em] text-[#FAF8F5]/60">
          <button
            onClick={() => navigate('/loja')}
            className="flex items-center gap-2 hover:text-[#C8A86B] transition-colors group"
          >
            <ShoppingBag className="w-4 h-4 text-[#C8A86B] group-hover:scale-110 transition-transform" />
            <span className="underline-offset-4 hover:underline">Conhecer a loja</span>
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
