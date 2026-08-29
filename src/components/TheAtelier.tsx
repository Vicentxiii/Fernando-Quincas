import React, { useState } from 'react';
import { ATELIER_STORIES } from '../data/atelier';

export const TheAtelier: React.FC = () => {
  const [activeStoryId, setActiveStoryId] = useState<string>(ATELIER_STORIES[0].id);
  const [isHovered, setIsHovered] = useState(false);
  const [isClickedPaused, setIsClickedPaused] = useState(false);
  const activeStory = ATELIER_STORIES.find((s) => s.id === activeStoryId) || ATELIER_STORIES[0];
  const isPaused = isHovered || isClickedPaused;

  return (
    <section id="atelier" className="py-24 sm:py-32 px-6 sm:px-8 md:px-12 bg-[#FAF8F5] text-[#1E1D1A] relative border-b border-[#C8A86B]/25">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#C8A86B]/25 pb-8 mb-16">
          <div>
            <span className="text-[10px] sm:text-[11px] tracking-[0.3em] text-[#C8A86B] uppercase font-mono block mb-2">
              CAPÍTULO VII • NOS BASTIDORES DA CRIAÇÃO
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#1E1D1A] font-light tracking-tight">
              O <br />
              <span className="italic font-normal text-[#9C7D3E]">ATELIÊ</span>
            </h2>
            <p className="font-serif italic text-lg sm:text-xl text-[#8A82A5] mt-2">
              Onde a imaginação se faz matéria.
            </p>
          </div>
            <p className="max-w-md text-sm text-[#2C2A26]/80 font-light leading-relaxed font-serif italic">
            “A mão age, cria e, por vezes, parece pensar — é por ela que o espírito se faz matéria.”
            <span className="block text-xs font-mono not-italic tracking-[0.15em] text-[#9C7D3E] mt-2">— Henri Focillon, Elogio da Mão (1943)</span>
          </p>
        </div>

        {/* Tour pelo Ateliê — carrossel horizontal infinito, pausa no hover e no clique */}
        <div
          className="relative overflow-hidden mb-12 py-2"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Fade edges */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#FAF8F5] to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#FAF8F5] to-transparent z-10" />
          <div
            className="flex gap-4 w-max animate-atelier-marquee"
            style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
          >
            {[...ATELIER_STORIES, ...ATELIER_STORIES].map((story, idx) => {
              const isSelected = story.id === activeStoryId;
              return (
                <button
                  key={`${story.id}-${idx}`}
                  onClick={() => {
                    setActiveStoryId(story.id);
                    setIsClickedPaused((prev) => !prev);
                  }}
                  className={`w-[220px] sm:w-[260px] flex-shrink-0 p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between min-h-[120px] ${
                    isSelected
                      ? 'bg-[#1E1D1A] text-[#FAF8F5] border-[#1E1D1A] shadow-xl scale-[1.02]'
                      : 'bg-[#FAF6EE] text-[#1E1D1A] border-[#C8A86B]/25 hover:border-[#C8A86B] hover:bg-white'
                  }`}
                >
                  <div>
                    <h4 className="font-serif text-sm font-semibold line-clamp-2 leading-tight">
                      {story.title}
                    </h4>
                    <span className={`text-[10px] font-serif italic mt-1 block line-clamp-1 ${isSelected ? 'text-[#E0C995]' : 'text-[#8A82A5]'}`}>
                      {story.frenchTitle}
                    </span>
                  </div>
                  <span className={`text-[9px] font-mono mt-3 ${isSelected ? 'text-[#FAF8F5]/60' : 'text-[#2C2A26]/50'}`}>
                    {story.artisanRole}
                  </span>
                </button>
              );
            })}
          </div>
          <style>{`@keyframes atelier-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } .animate-atelier-marquee { animation: atelier-marquee 60s linear infinite; }`}</style>
        </div>

        {/* Detailed In-Studio Documentary Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 md:p-12 border border-[#C8A86B]/30 shadow-2xl bg-[#FAF8F5]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Visual Canvas */}
            <div className="lg:col-span-6 relative">
              <div className="rounded-2xl overflow-hidden border border-[#C8A86B]/30 shadow-xl aspect-[4/3] bg-[#EAE5D8] relative group">
                <img
                  src={activeStory.image}
                  alt={activeStory.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 glass-card px-3 py-1.5 rounded-full text-[10px] font-mono tracking-widest text-[#1E1D1A]">
                  REGISTRO DOCUMENTAL • TOUR PELO ATELIÊ
                </div>
              </div>
            </div>

            {/* Narrative & Tools Breakdown */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-serif italic text-[#8A82A5] block">
                  {activeStory.frenchTitle}
                </span>
                <h3 className="font-serif text-2xl sm:text-4xl text-[#1E1D1A] font-light mt-1">
                  {activeStory.title}
                </h3>
              </div>

              <p className="text-[#1E1D1A]/85 text-base font-light leading-relaxed">
                {activeStory.description}
              </p>

              {/* Sensory Workshop Note */}
              <div className="p-4 rounded-2xl bg-[#FAF6EE] border-l-2 border-[#C8A86B] text-xs sm:text-sm text-[#2C2A26] font-serif italic">
                "{activeStory.sensoryDetail}"
              </div>

              {/* Authentic Tool Manifest */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C8A86B] block">
                  INSTRUMENTOS & FERRAMENTAS PRINCIPAIS:
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeStory.toolsUsed.map((tool, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-[#FAF6EE] text-[#2C2A26] border border-[#C8A86B]/30 text-xs font-mono"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
