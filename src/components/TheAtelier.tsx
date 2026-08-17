import React, { useState } from 'react';
import { ATELIER_STORIES } from '../data/atelier';

export const TheAtelier: React.FC = () => {
  const [activeStoryId, setActiveStoryId] = useState<string>(ATELIER_STORIES[0].id);
  const activeStory = ATELIER_STORIES.find((s) => s.id === activeStoryId) || ATELIER_STORIES[0];

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
          <p className="max-w-md text-sm text-[#2C2A26]/80 font-light leading-relaxed">
            Argila viva, compósitos estruturais, entalhe em madeiras nobres e folhas de ouro 24k. Um olhar autêntico no coração do ateliê em Petrópolis.
          </p>
        </div>

        {/* Documentary Photo Essay Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-12">
          {ATELIER_STORIES.map((story) => {
            const isSelected = story.id === activeStoryId;
            return (
              <button
                key={story.id}
                onClick={() => setActiveStoryId(story.id)}
                className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#1E1D1A] text-[#FAF8F5] border-[#1E1D1A] shadow-xl scale-[1.02]'
                    : 'bg-[#FAF6EE] text-[#1E1D1A] border-[#C8A86B]/25 hover:border-[#C8A86B]'
                }`}
              >
                <div>
                  <span className={`text-[10px] font-mono tracking-widest ${isSelected ? 'text-[#C8A86B]' : 'text-[#8A82A5]'}`}>
                    ETAPA {story.stageNumber}
                  </span>
                  <h4 className="font-serif text-sm font-semibold mt-1 line-clamp-2">
                    {story.title}
                  </h4>
                </div>
                <span className={`text-[9px] font-mono mt-4 ${isSelected ? 'text-[#FAF8F5]/60' : 'text-[#2C2A26]/50'}`}>
                  {story.artisanRole}
                </span>
              </button>
            );
          })}
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
                  REGISTRO DOCUMENTAL • ETAPA {activeStory.stageNumber}
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
