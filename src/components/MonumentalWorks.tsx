import React, { useState } from 'react';
import { MONUMENTAL_PROJECTS } from '../data/monumental';
import { MonumentalProject } from '../types';
import { Maximize2, MapPin, X } from 'lucide-react';

interface MonumentalWorksProps {
  onInquireProject: (projectTitle: string) => void;
}

export const MonumentalWorks: React.FC<MonumentalWorksProps> = ({ onInquireProject }) => {
  const [selectedProject, setSelectedProject] = useState<MonumentalProject | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="monumental" className="py-24 sm:py-32 bg-[#16251E] text-[#FAF8F5] relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0D1713]/40 to-[#0D1713] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 relative z-10">
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#C8A86B]/30 pb-8 mb-16">
          <div>
            <span className="text-[10px] sm:text-[11px] tracking-[0.3em] text-[#C8A86B] uppercase font-mono block mb-2">
              CAPÍTULO III • ESCALA ARQUITETÔNICA
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#FAF8F5] font-light tracking-tight">
              OBRAS <br />
              <span className="italic font-normal text-[#E0C995]">MONUMENTAIS</span>
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#FAF8F5]/75 font-light leading-relaxed">
            Estudos de caso arquitetônicos e instalações concebidas para propriedades nobres, parques botânicos e projetos paisagísticos de destaque.
          </p>
        </div>

        {/* Project Selector Tabs */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {MONUMENTAL_PROJECTS.map((proj, idx) => (
            <button
              key={proj.id}
              onClick={() => setActiveTab(idx)}
              className={`px-5 py-2.5 rounded-full text-xs font-mono tracking-widest uppercase whitespace-nowrap transition-all duration-300 border ${
                activeTab === idx
                  ? 'bg-[#FAF8F5] text-[#16251E] border-[#FAF8F5] font-bold shadow-lg'
                  : 'bg-[#FAF8F5]/10 text-[#FAF8F5]/70 border-[#C8A86B]/30 hover:border-[#C8A86B] hover:text-[#FAF8F5]'
              }`}
            >
              0{idx + 1} • {proj.title}
            </button>
          ))}
        </div>

        {/* Dramatic Full-Width Architectural Case Study Display */}
        {(() => {
          const project = MONUMENTAL_PROJECTS[activeTab];
          return (
            <div className="relative rounded-3xl overflow-hidden border border-[#C8A86B]/30 shadow-2xl bg-[#0D1713]">
              {/* Massive Hero Image Canvas */}
              <div className="relative h-[480px] sm:h-[620px] lg:h-[720px] w-full overflow-hidden group">
                <img
                  src={project.heroImage}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1713] via-[#0D1713]/30 to-transparent" />

                {/* Top Badge Overlay */}
                <div className="absolute top-6 left-6 right-6 flex items-center justify-between pointer-events-none">
                  <div className="glass-card px-4 py-2 rounded-full border border-[#C8A86B]/40 text-[#1E1D1A] text-[11px] font-mono tracking-widest pointer-events-auto">
                    ESTUDO DE CASO 0{activeTab + 1}
                  </div>
                  <div className="glass-card px-4 py-2 rounded-full border border-[#C8A86B]/40 text-[#1E1D1A] text-[11px] font-mono tracking-widest pointer-events-auto">
                    {project.status}
                  </div>
                </div>

                {/* Bottom Overlay Case Study Card */}
                <div className="absolute bottom-6 left-6 right-6 lg:left-12 lg:right-12 glass-card rounded-2xl p-6 sm:p-8 border border-[#C8A86B]/40 shadow-2xl text-[#1E1D1A] backdrop-blur-md">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    <div className="lg:col-span-8 space-y-2">
                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#9C7D3E] font-mono tracking-wider">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {project.clientOrLocation}
                        </span>
                        <span>•</span>
                        <span>{project.dimensions}</span>
                        <span>•</span>
                        <span>{project.year}</span>
                      </div>
                      <h3 className="font-serif text-2xl sm:text-4xl font-light text-[#1E1D1A]">
                        {project.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#2C2A26]/80 font-serif italic line-clamp-2">
                        {project.concept}
                      </p>
                    </div>

                    <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="w-full px-6 py-3.5 rounded-full bg-[#1E1D1A] text-[#FAF8F5] hover:bg-[#C8A86B] hover:text-[#1E1D1A] transition-all text-xs tracking-[0.2em] font-semibold flex items-center justify-center gap-2 shadow-lg"
                      >
                        <Maximize2 className="w-4 h-4" />
                        <span>VER DOSSIÊ DO PROJETO</span>
                      </button>

                      <button
                        onClick={() => onInquireProject(project.title)}
                        className="w-full px-6 py-3 rounded-full border border-[#C8A86B]/50 hover:bg-[#C8A86B]/15 text-[#1E1D1A] transition-colors text-xs tracking-[0.18em] font-medium flex items-center justify-center gap-2"
                      >
                        <span>ENCOMENDAR PROJETO SIMILAR</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Modal: Full Monumental Architectural Dossier */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#FAF8F5] text-[#1E1D1A] border border-[#C8A86B]/40 shadow-2xl p-6 sm:p-10">
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 p-2.5 rounded-full border border-[#C8A86B]/30 hover:bg-[#1E1D1A] hover:text-white transition-colors"
              aria-label="Fechar modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="border-b border-[#C8A86B]/20 pb-6 mb-8">
              <span className="text-[10px] tracking-[0.3em] uppercase font-mono text-[#C8A86B] block mb-2">
                DOSSIÊ ARQUITETÔNICO MONUMENTAL
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#1E1D1A] font-light">
                {selectedProject.title}
              </h2>
              <span className="text-sm font-serif italic text-[#8A82A5]">
                {selectedProject.frenchTitle}
              </span>
            </div>

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#FAF6EE] border border-[#C8A86B]/20 mb-8 text-xs font-mono">
              <div>
                <span className="text-[#8A82A5] block">LOCALIZAÇÃO</span>
                <span className="font-bold text-[#1E1D1A] mt-1 block">{selectedProject.clientOrLocation}</span>
              </div>
              <div>
                <span className="text-[#8A82A5] block">DIMENSÕES</span>
                <span className="font-bold text-[#1E1D1A] mt-1 block">{selectedProject.dimensions}</span>
              </div>
              <div>
                <span className="text-[#8A82A5] block">ANO</span>
                <span className="font-bold text-[#1E1D1A] mt-1 block">{selectedProject.year}</span>
              </div>
              <div>
                <span className="text-[#8A82A5] block">STATUS</span>
                <span className="font-bold text-[#6B1D2F] mt-1 block">{selectedProject.status}</span>
              </div>
            </div>

            {/* Image Gallery Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {selectedProject.galleryImages.map((img, i) => (
                <div key={i} className="rounded-xl overflow-hidden border border-[#C8A86B]/20 aspect-[4/3]">
                  <img src={img} alt="Ângulo da instalação" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            {/* Deep Conceptual & Engineering Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed font-light mb-8">
              <div className="space-y-3">
                <h4 className="font-serif text-lg font-semibold text-[#1E1D1A] border-b border-[#C8A86B]/20 pb-2">
                  Conceito Espacial & Filosofia
                </h4>
                <p className="text-[#2C2A26]/85">{selectedProject.concept}</p>
                <p className="text-[#2C2A26]/85">{selectedProject.architecturalContext}</p>
              </div>

              <div className="space-y-3">
                <h4 className="font-serif text-lg font-semibold text-[#1E1D1A] border-b border-[#C8A86B]/20 pb-2">
                  Materiais & Engenharia
                </h4>
                <ul className="list-disc pl-5 text-[#2C2A26]/85 space-y-1">
                  {selectedProject.materials.map((mat, idx) => (
                    <li key={idx}>{mat}</li>
                  ))}
                </ul>
                <div className="p-3 rounded-xl bg-[#F5F2EB] border border-[#C8A86B]/20 text-xs font-mono text-[#2C2A26]">
                  <strong>Nota de Engenharia:</strong> {selectedProject.engineeringNotes}
                </div>
              </div>
            </div>

            {/* Modal Bottom CTA */}
            <div className="pt-6 border-t border-[#C8A86B]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-[#8A82A5] font-mono">
                Ateliê Fernando Quincas • Projeto sob Medida
              </span>
              <button
                onClick={() => {
                  setSelectedProject(null);
                  onInquireProject(selectedProject.title);
                }}
                className="px-8 py-3.5 rounded-full bg-[#1E1D1A] text-[#FAF8F5] hover:bg-[#C8A86B] hover:text-[#1E1D1A] transition-all text-xs font-semibold tracking-widest uppercase"
              >
                SOLICITAR CONSULTORIA PARA PROJETO MONUMENTAL
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
