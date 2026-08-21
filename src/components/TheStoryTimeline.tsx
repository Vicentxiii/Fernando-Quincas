import React, { useState } from 'react';
import { TIMELINE_MILESTONES } from '../data/timeline';
import { MapPin, ChevronRight, ChevronLeft } from 'lucide-react';

export const TheStoryTimeline: React.FC = () => {
  const [activeMilestoneIndex, setActiveMilestoneIndex] = useState(0);
  const activeMilestone = TIMELINE_MILESTONES[activeMilestoneIndex];

  return (
    <section id="story" className="py-24 sm:py-32 px-6 sm:px-8 md:px-12 bg-[#F5F2EB] text-[#1E1D1A] relative border-t border-b border-[#C8A86B]/20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-[10px] sm:text-[11px] tracking-[0.3em] text-[#C8A86B] uppercase font-mono block mb-2">
              CAPÍTULO II • TRAJETÓRIA & EVOLUÇÃO
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#1E1D1A] font-light tracking-tight">
              UMA VIDA NA <br />
              <span className="italic font-normal text-[#9C7D3E]">ESCULTURA</span>
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#2C2A26]/80 font-light leading-relaxed">
            Do domínio paciente do entalhe tradicional à criação do santuário botânico de esculturas em Minas Gerais — uma busca contínua pela elegância monumental.
          </p>
        </div>

        {/* Milestone Navigation Strip */}
        <div className="relative mb-12">
          {/* Horizontal Track Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-[1.5px] bg-[#C8A86B]/30 -translate-y-1/2" />

          {/* Milestone Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 relative z-10">
            {TIMELINE_MILESTONES.map((m, idx) => {
              const isSelected = idx === activeMilestoneIndex;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveMilestoneIndex(idx)}
                  className={`p-4 rounded-xl text-left transition-all duration-300 border flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#1E1D1A] text-[#FAF8F5] border-[#1E1D1A] shadow-xl scale-[1.02]'
                      : 'bg-[#FAF8F5]/80 text-[#1E1D1A] border-[#C8A86B]/25 hover:border-[#C8A86B] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <span className={`text-[10px] font-mono tracking-widest ${isSelected ? 'text-[#C8A86B]' : 'text-[#8A82A5]'}`}>
                    {m.year}
                  </span>
                  <span className="font-serif text-sm font-semibold mt-2 line-clamp-2">
                    {m.title}
                  </span>
                  <span className={`text-[9px] uppercase tracking-wider font-mono mt-3 ${isSelected ? 'text-[#FAF8F5]/70' : 'text-[#2C2A26]/50'}`}>
                    {m.location.split(',')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Milestone Spotlight Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 md:p-12 border border-[#C8A86B]/30 shadow-2xl overflow-hidden bg-[#FAF8F5]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Archival Imagery */}
            <div className="lg:col-span-6 relative">
              <div className="rounded-2xl overflow-hidden border border-[#C8A86B]/30 shadow-lg relative aspect-[4/3] bg-[#EAE5D8]">
                <img
                  src={activeMilestone.image}
                  alt={activeMilestone.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />

                {/* Mobile Prev / Next Arrows overlay on the photo */}
                <button
                  disabled={activeMilestoneIndex === 0}
                  onClick={() => setActiveMilestoneIndex((prev) => Math.max(0, prev - 1))}
                  aria-label="Fase anterior"
                  className="md:hidden absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#1E1D1A]/70 backdrop-blur-sm text-[#FAF8F5] border border-[#C8A86B]/40 flex items-center justify-center hover:bg-[#C8A86B] hover:text-[#1E1D1A] transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none active:scale-90"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  disabled={activeMilestoneIndex === TIMELINE_MILESTONES.length - 1}
                  onClick={() => setActiveMilestoneIndex((prev) => Math.min(TIMELINE_MILESTONES.length - 1, prev + 1))}
                  aria-label="Próxima fase"
                  className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#1E1D1A]/70 backdrop-blur-sm text-[#FAF8F5] border border-[#C8A86B]/40 flex items-center justify-center hover:bg-[#C8A86B] hover:text-[#1E1D1A] transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none active:scale-90"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Narrative Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#C8A86B] text-xs font-mono tracking-widest uppercase">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{activeMilestone.location}</span>
                  <span>•</span>
                  <span>{activeMilestone.period}</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#1E1D1A] font-light">
                  {activeMilestone.title}
                </h3>
                <h4 className="font-sans text-xs sm:text-sm text-[#8A82A5] tracking-wide font-medium">
                  {activeMilestone.subtitle}
                </h4>
              </div>

              <p className="text-[#1E1D1A]/85 text-base sm:text-lg font-light leading-relaxed">
                {activeMilestone.narrative}
              </p>

              {activeMilestone.quote && (
                <div className="p-5 rounded-2xl bg-[#FAF6EE] border-l-2 border-[#C8A86B] text-[#2C2A26] font-serif italic text-base sm:text-lg">
                  "{activeMilestone.quote}"
                </div>
              )}

              {/* Step Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-[#C8A86B]/20">
                <button
                  disabled={activeMilestoneIndex === 0}
                  onClick={() => setActiveMilestoneIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-full border border-[#C8A86B]/30 text-xs font-mono tracking-wider disabled:opacity-30 disabled:pointer-events-none hover:bg-[#C8A86B]/10 flex items-center gap-1.5 transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>FASE ANTERIOR</span>
                </button>

                <span className="text-xs font-mono text-[#8A82A5]">
                  0{activeMilestoneIndex + 1} / 0{TIMELINE_MILESTONES.length}
                </span>

                <button
                  disabled={activeMilestoneIndex === TIMELINE_MILESTONES.length - 1}
                  onClick={() => setActiveMilestoneIndex((prev) => Math.min(TIMELINE_MILESTONES.length - 1, prev + 1))}
                  className="px-4 py-2 rounded-full border border-[#C8A86B]/30 text-xs font-mono tracking-wider disabled:opacity-30 disabled:pointer-events-none hover:bg-[#C8A86B]/10 flex items-center gap-1.5 transition-colors"
                >
                  <span>PRÓXIMA FASE</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
