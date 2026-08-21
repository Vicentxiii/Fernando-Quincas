import React from 'react';
import { Sparkles, Quote, Compass, Feather, Award } from 'lucide-react';

interface IntroPhilosophyProps {
  onLearnTechniques: () => void;
  onExploreStory: () => void;
}

export const IntroPhilosophy: React.FC<IntroPhilosophyProps> = ({
  onLearnTechniques,
  onExploreStory
}) => {
  return (
    <section id="artist" className="py-24 sm:py-32 px-6 sm:px-8 md:px-12 bg-[#FAF8F5] text-[#1E1D1A] relative overflow-hidden">
      {/* Editorial Decorative Watermark */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.03] font-serif text-[18vw] leading-none text-[#1E1D1A] font-light">
        ESCULTURA
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Editorial Eyebrow & Chapter Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#C8A86B]/25 pb-6 mb-16 sm:mb-20">
          <div>
            <span className="text-[10px] sm:text-[11px] tracking-[0.3em] text-[#C8A86B] uppercase font-mono block mb-2">
              CAPÍTULO I • O ARTISTA & FILOSOFIA
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#1E1D1A] font-light tracking-tight">
              UM UNIVERSO CRIADO <br />
              <span className="italic font-normal text-[#9C7D3E]">PELA MÃO HUMANA</span>
            </h2>
          </div>
          <div className="sm:text-right">
            <span className="text-xs font-serif italic text-[#8A82A5] block">
              "Esculpir uma curva é conduzir o olhar através do silêncio."
            </span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#1E1D1A]/60 font-mono mt-1 block">
              FERNANDO QUINCAS
            </span>
          </div>
        </div>

        {/* Asymmetric Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Large Editorial Photography Spread with Fernando Quincas Photo */}
          <div className="lg:col-span-7 relative">
            <div className="relative z-10 rounded-2xl overflow-hidden border border-[#C8A86B]/30 shadow-2xl bg-[#EAE5D8]">
              <img
                src={encodeURI('/Escultor mestre artesão fernando quincas de almeida.png')}
                alt="Fernando Quincas — Escultor & Mestre Artesão em seu ateliê"
                className="w-full h-[450px] sm:h-[580px] object-cover object-top hover:scale-105 transition-transform duration-1000"
              />
              {/* Photo Caption Pill */}
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:left-6 sm:bottom-6 glass-card px-4 py-3 rounded-xl border border-[#C8A86B]/30 max-w-sm">
                <span className="text-[9px] tracking-[0.25em] text-[#C8A86B] uppercase font-mono block">
                  FERNANDO QUINCAS • ATELIÊ MINAS GERAIS
                </span>
                <p className="text-xs text-[#1E1D1A] font-serif italic mt-0.5">
                  Escultor & Mestre Artesão dedicando sua vida à criação de obras monumentais e ornamentação artística.
                </p>
              </div>
            </div>

            {/* Overlapping Secondary Image / Material Detail */}
            <div className="hidden sm:block absolute -bottom-10 -right-8 z-20 w-48 h-64 rounded-xl overflow-hidden border-2 border-[#FAF8F5] shadow-2xl">
              <img
                src={encodeURI('/Galinha Monte Verde Fernando Quincas.png')}
                alt="Escultura Galinha da roça by Fernando Quincas"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3 text-white text-[10px] font-mono tracking-wider">
                Escultura Galinha da roça by Fernando Quincas
              </div>
            </div>

            {/* Subtle Gold Frame Offset */}
            <div className="absolute -top-4 -left-4 w-32 h-32 border-t-2 border-l-2 border-[#C8A86B]/40 rounded-tl-3xl pointer-events-none" />
          </div>

          {/* Right Column: Editorial Narrative & Principles */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
            <div className="space-y-4 text-[#1E1D1A]/85 leading-relaxed font-light text-base sm:text-lg">
              <p className="first-letter:text-5xl first-letter:font-serif first-letter:text-[#C8A86B] first-letter:float-left first-letter:mr-3 first-letter:leading-none">
                Fernando Quincas não apenas molda esculturas. Ele transforma espaços em santuários vivos de encantamento, nobreza e ressonância estética.
              </p>
              <p>
                Unindo a sofisticação das linhas ornamentais clássicas com a exuberância luminosa e vibrante da flora brasileira, suas criações ocupam um território singular onde a tradição artesanal e a moderna engenharia de compósitos coexistem em harmonia.
              </p>
              <p className="text-[#2C2A26] font-medium text-sm sm:text-base border-l-2 border-[#C8A86B] pl-4 italic font-serif">
                "Enquanto a pressa do mundo contemporâneo retira a poesia, nossa arte restaura o encanto, a celebração da beleza e o toque insubstituível da mão humana."
              </p>
            </div>

            {/* Three Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#C8A86B]/20">
              <div className="p-3 rounded-lg bg-[#FAF6EE] border border-[#C8A86B]/15">
                <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-[#C8A86B] block mb-1">
                  01 • ESCALA
                </span>
                <h4 className="font-serif text-sm font-semibold text-[#1E1D1A]">Fibra Monumental</h4>
                <p className="text-[11px] text-[#2C2A26]/70 mt-1">
                  Compósitos de alta resistência desenvolvidos para permanência ao ar livre.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#FAF6EE] border border-[#C8A86B]/15">
                <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-[#C8A86B] block mb-1">
                  02 • PINTURA
                </span>
                <h4 className="font-serif text-sm font-semibold text-[#1E1D1A]">Mestre do Pincel</h4>
                <p className="text-[11px] text-[#2C2A26]/70 mt-1">
                  Pintura expressiva que dá vida e alma às superfícies, das peças ornamentais às composições monumentais.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#FAF6EE] border border-[#C8A86B]/15">
                <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-[#C8A86B] block mb-1">
                  03 • VIDA
                </span>
                <h4 className="font-serif text-sm font-semibold text-[#1E1D1A]">Natureza Viva</h4>
                <p className="text-[11px] text-[#2C2A26]/70 mt-1">
                  Fontes, cisnes majestosos e vegetação integrados como parte da escultura.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-4">
              <button
                onClick={onExploreStory}
                className="px-6 py-3 rounded-full bg-[#1E1D1A] text-[#FAF8F5] hover:bg-[#C8A86B] hover:text-[#1E1D1A] transition-all duration-300 text-xs tracking-[0.18em] font-semibold flex items-center gap-2"
              >
                <span>UMA VIDA NA ESCULTURA</span>
              </button>
              <button
                onClick={onLearnTechniques}
                className="px-6 py-3 rounded-full border border-[#C8A86B]/40 hover:border-[#C8A86B] text-[#1E1D1A] hover:bg-[#C8A86B]/10 transition-colors text-xs tracking-[0.18em] font-medium"
              >
                <span>SABER-FAZER</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
