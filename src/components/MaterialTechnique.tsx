import React, { useState } from 'react';
import { TECHNIQUES } from '../data/techniques';
import { ZoomIn } from 'lucide-react';

export const MaterialTechnique: React.FC = () => {
  const [activeTechniqueId, setActiveTechniqueId] = useState<string>('fiberglass');
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  const activeTechnique = TECHNIQUES.find((t) => t.id === activeTechniqueId) || TECHNIQUES[0];

  return (
    <section id="techniques" className="py-24 sm:py-32 px-6 sm:px-8 md:px-12 bg-[#F5F2EB] text-[#1E1D1A] relative border-t border-b border-[#C8A86B]/25">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#C8A86B]/25 pb-8 mb-12">
          <div>
            <span className="text-[10px] sm:text-[11px] tracking-[0.3em] text-[#C8A86B] uppercase font-mono block mb-2">
              CAPÍTULO V • SABER-FAZER & ALQUIMIA
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#1E1D1A] font-light tracking-tight">
              MATERIAIS & <br />
              <span className="italic font-normal text-[#9C7D3E]">TÉCNICAS</span>
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#2C2A26]/80 font-light leading-relaxed">
            Sete disciplinas onde as tradições clássicas do entalhe e da douração encontram compósitos contemporâneos de alta resistência.
          </p>
        </div>

        {/* Horizontal Techniques Category Ribbon */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-4 mb-12 scrollbar-none">
          {TECHNIQUES.map((tech) => {
            const isSelected = tech.id === activeTechniqueId;
            return (
              <button
                key={tech.id}
                onClick={() => {
                  setActiveTechniqueId(tech.id);
                  setIsZoomed(false);
                }}
                className={`px-5 py-3 rounded-full text-xs font-mono tracking-widest uppercase transition-all duration-300 whitespace-nowrap border flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#1E1D1A] text-[#FAF8F5] border-[#1E1D1A] shadow-md scale-[1.02]'
                    : 'bg-[#FAF8F5] text-[#2C2A26]/75 border-[#C8A86B]/30 hover:border-[#C8A86B] hover:text-[#1E1D1A]'
                }`}
              >
                <span>{tech.name}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Deep-Dive Showcase Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 md:p-12 border border-[#C8A86B]/30 shadow-2xl bg-[#FAF8F5]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Left: Dual Photography (Macro Texture + Process Workshop) */}
            <div className="lg:col-span-6 space-y-4">
              {/* Macro Texture Magnifier Container */}
              <div
                className="relative rounded-2xl overflow-hidden border border-[#C8A86B]/30 shadow-lg aspect-[4/3] bg-[#EAE5D8] cursor-crosshair group"
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <img
                  src={activeTechnique.textureImage}
                  alt={`${activeTechnique.name} textura macro`}
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    isZoomed ? 'scale-150' : 'group-hover:scale-110'
                  }`}
                />
                <div className="absolute top-4 left-4 glass-card px-3 py-1 rounded-full text-[10px] font-mono tracking-widest text-[#1E1D1A] flex items-center gap-1.5">
                  <ZoomIn className="w-3.5 h-3.5 text-[#C8A86B]" />
                  <span>{isZoomed ? 'AMPLIAÇÃO MACRO (CLIQUE P/ RESETAR)' : 'CLIQUE PARA AMPLIAR TEXTURA'}</span>
                </div>
                <div className="absolute bottom-4 right-4 glass-card px-3 py-1 rounded-full text-[9px] font-mono text-[#8A82A5]">
                  {activeTechnique.category}
                </div>
              </div>

              {/* Secondary In-Atelier Process Strip */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl overflow-hidden border border-[#C8A86B]/20 h-32 relative group">
                  <img
                    src={activeTechnique.processImage}
                    alt="Processo artesanal"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-end p-2 text-white text-[9px] font-mono">
                    PROCESSO NO ATELIÊ
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF6EE] border border-[#C8A86B]/20 flex flex-col justify-center text-xs space-y-1">
                  <span className="text-[10px] font-mono uppercase text-[#C8A86B] tracking-wider">
                    MATERIAIS PRINCIPAIS
                  </span>
                  <div className="text-[#2C2A26] font-medium line-clamp-3">
                    {activeTechnique.keyMaterials.join(' • ')}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Technical Explanation, Steps & Artisan Voice */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-serif italic text-[#8A82A5] block">
                  {activeTechnique.frenchName}
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl text-[#1E1D1A] font-light mt-1">
                  {activeTechnique.name}
                </h3>
                <p className="text-sm font-serif italic text-[#9C7D3E] mt-2">
                  "{activeTechnique.tagline}"
                </p>
              </div>

              <p className="text-[#1E1D1A]/85 text-base font-light leading-relaxed">
                {activeTechnique.description}
              </p>

              {/* 4-Step Process Breakdown */}
              <div className="space-y-3 pt-2">
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#C8A86B] block">
                  A METODOLOGIA
                </span>
                <div className="space-y-2">
                  {activeTechnique.process.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#2C2A26]/85">
                      <span className="w-5 h-5 rounded-full bg-[#C8A86B]/20 text-[#9C7D3E] font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                        0{idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Master Quote Box */}
              <div className="p-4 rounded-2xl bg-[#FAF6EE] border-l-2 border-[#C8A86B] text-xs sm:text-sm text-[#2C2A26] font-serif italic">
                "{activeTechnique.artisanQuote}"
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
