import React from 'react';
import { GlobeFolio } from './GlobeFolio';
import { globeImages, GLOBE_CARD_COUNT } from '../data/globeImages';

export const GlobeFolioSection: React.FC = () => {
  return (
    <section id="atlas" className="relative py-24 sm:py-32 px-6 sm:px-8 md:px-12 bg-[#16251E] text-[#FAF8F5] overflow-hidden">
      {/* Editorial Decorative Watermark */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.04] font-serif text-[16vw] leading-none text-[#FAF8F5] font-light whitespace-nowrap">
        ATLAS
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Editorial Eyebrow & Chapter Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#C8A86B]/25 pb-6 mb-8">
          <div>
            <span className="text-[10px] sm:text-[11px] tracking-[0.3em] text-[#C8A86B] uppercase font-mono block mb-2">
              ATLAS DAS OBRAS
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#FAF8F5] font-light tracking-tight">
              A COLEÇÃO EM <br />
              <span className="italic font-normal text-[#E0C995]">UMA ESFERA</span>
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-[#FAF8F5]/70 font-light leading-relaxed sm:text-right">
            Uma coleção de formas, matérias e criações que atravessam o tempo.
          </p>
        </div>

        <GlobeFolio images={globeImages} cardCount={GLOBE_CARD_COUNT} />
      </div>
    </section>
  );
};