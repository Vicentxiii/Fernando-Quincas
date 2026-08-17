import React, { useState } from 'react';
import { COMMISSION_STEPS } from '../data/commissions';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface CommissionsSectionProps {
  onStartCommission: (config?: { spaceType: string; motif: string; scale: string }) => void;
}

export const CommissionsSection: React.FC<CommissionsSectionProps> = ({ onStartCommission }) => {
  const [activeStep, setActiveStep] = useState(0);

  // Interactive Bespoke Configurator State
  const [spaceType, setSpaceType] = useState('Parque ou Jardim Botânico Privado');
  const [motif, setMotif] = useState('Cisne Monumental & Conchas Ornamentais');
  const [scale, setScale] = useState('Monumental (3 a 6+ metros)');

  const projectEnvironments = [
    { title: 'Residências & Fazendas Históricas', desc: 'Consolos entalhados, espelhos com moldura dourada e peças centrais exclusivas.' },
    { title: 'Jardins Botânicos & Parques', desc: 'Cisnes monumentais em fibra naval, fontes com cascata e pórticos botânicos.' },
    { title: 'Hotéis de Luxo & Spas', desc: 'Fontes centrais para pátios nobres, portais de entrada monumentais e esculturas acústicas.' },
    { title: 'Salões Nobres & Alta Gastronomia', desc: 'Painéis murais em relevo escultural, revestimentos clássicos e composições policromáticas.' },
  ];

  const handleLaunchBespoke = () => {
    onStartCommission({ spaceType, motif, scale });
  };

  return (
    <section id="commissions" className="py-24 sm:py-32 px-6 sm:px-8 md:px-12 bg-[#16251E] text-[#FAF8F5] relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0D1713]/50 to-[#0D1713] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#C8A86B]/30 pb-8 mb-16">
          <div>
            <span className="text-[10px] sm:text-[11px] tracking-[0.3em] text-[#C8A86B] uppercase font-mono block mb-2">
              CAPÍTULO IX • PROJETOS ESPECIAIS & ENCOMENDAS
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#FAF8F5] font-light tracking-tight">
              CRIE ALGO <br />
              <span className="italic font-normal text-[#E0C995]">EXTRAORDINÁRIO</span>
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#FAF8F5]/80 font-light leading-relaxed">
            De peças exclusivas para interiores a fontes monumentais para parques e fazendas. Trabalhamos diretamente com colecionadores, paisagistas e arquitetos.
          </p>
        </div>

        {/* Suitable Environments Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {projectEnvironments.map((env, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-[#0D1713] border border-[#C8A86B]/25 flex flex-col justify-between hover:border-[#E0C995] transition-colors"
            >
              <div>
                <span className="text-[10px] font-mono text-[#E0C995] tracking-widest block mb-2">
                  DESTINO 0{i + 1}
                </span>
                <h4 className="font-serif text-lg text-[#FAF8F5] mb-2">{env.title}</h4>
                <p className="text-xs text-[#FAF8F5]/70 leading-relaxed font-light">{env.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 6-Step Process Display */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#C8A86B] uppercase block mb-2">
              O MÉTODO
            </span>
            <h3 className="font-serif text-2xl sm:text-4xl text-[#FAF8F5] font-light">
              As 6 Etapas de uma Obra sob Medida
            </h3>
          </div>

          {/* Steps Navigation Carousel */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            {COMMISSION_STEPS.map((step, idx) => {
              const isSelected = activeStep === idx;
              return (
                <button
                  key={step.number}
                  onClick={() => setActiveStep(idx)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#FAF8F5] text-[#16251E] border-[#FAF8F5] shadow-xl scale-[1.02]'
                      : 'bg-[#0D1713] text-[#FAF8F5] border-[#C8A86B]/20 hover:border-[#C8A86B]'
                  }`}
                >
                  <span className={`text-[10px] font-mono font-bold tracking-widest ${isSelected ? 'text-[#9C7D3E]' : 'text-[#E0C995]'}`}>
                    {step.number}
                  </span>
                  <h5 className="font-serif text-sm font-semibold mt-2 line-clamp-2">
                    {step.title.split('&')[0]}
                  </h5>
                  <span className={`text-[9px] font-mono mt-3 ${isSelected ? 'text-[#16251E]/60' : 'text-[#FAF8F5]/50'}`}>
                    {step.duration}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Step Detailed Card */}
          {(() => {
            const currentStep = COMMISSION_STEPS[activeStep];
            return (
              <div className="glass-card rounded-3xl p-6 sm:p-10 border border-[#C8A86B]/40 text-[#1E1D1A] shadow-2xl bg-[#FAF8F5]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-5 rounded-2xl overflow-hidden aspect-[4/3] border border-[#C8A86B]/30 shadow-md">
                    <img
                      src={currentStep.image}
                      alt={currentStep.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center gap-3 text-xs font-mono text-[#9C7D3E]">
                      <span className="px-2.5 py-1 rounded-full bg-[#C8A86B]/20 font-bold">
                        ETAPA {currentStep.number}
                      </span>
                      <span>•</span>
                      <span>{currentStep.duration}</span>
                    </div>

                    <h4 className="font-serif text-2xl sm:text-3xl text-[#1E1D1A]">
                      {currentStep.title}
                    </h4>

                    <p className="text-sm text-[#2C2A26]/85 leading-relaxed font-light">
                      {currentStep.description}
                    </p>

                    <div className="pt-3 border-t border-[#C8A86B]/20">
                      <span className="text-[10px] font-mono tracking-wider uppercase text-[#C8A86B] block mb-2">
                        ENTREGÁVEIS & GARANTIAS AO CLIENTE:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {currentStep.deliverables.map((del, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-[#2C2A26]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#C8A86B] shrink-0" />
                            <span>{del}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Interactive Bespoke Project Configurator Banner */}
        <div className="rounded-3xl p-8 sm:p-12 border border-[#C8A86B]/40 bg-[#0D1713] shadow-2xl">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#E0C995] uppercase block mb-2">
              CONFIGURADOR DE PROJETO SOB MEDIDA
            </span>
            <h3 className="font-serif text-2xl sm:text-4xl text-[#FAF8F5] font-light">
              Configure Sua Visão Espacial
            </h3>
            <p className="text-xs sm:text-sm text-[#FAF8F5]/70 mt-2 font-light">
              Selecione os parâmetros iniciais para dialogar diretamente com o ateliê e receber um estudo de viabilidade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Space Type Selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-[#E0C995] uppercase block">
                01 • Ambiente Previsto
              </label>
              <select
                value={spaceType}
                onChange={(e) => setSpaceType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#16251E] border border-[#C8A86B]/30 text-[#FAF8F5] text-xs font-mono focus:border-[#E0C995] outline-none"
              >
                <option value="Parque ou Jardim Botânico Privado">Parque ou Jardim Botânico Privado</option>
                <option value="Pátio de Hotel de Luxo ou Spa">Pátio de Hotel de Luxo ou Spa</option>
                <option value="Fazenda Histórica ou Propriedade Rural">Fazenda Histórica ou Propriedade Rural</option>
                <option value="Salão Nobre / Hall de Entrada">Salão Nobre / Hall de Entrada</option>
                <option value="Praça ou Espaço Institucional">Praça ou Espaço Institucional</option>
              </select>
            </div>

            {/* Motif Selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-[#E0C995] uppercase block">
                02 • Motivo Escultural
              </label>
              <select
                value={motif}
                onChange={(e) => setMotif(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#16251E] border border-[#C8A86B]/30 text-[#FAF8F5] text-xs font-mono focus:border-[#E0C995] outline-none"
              >
                <option value="Cisne Monumental & Conchas Ornamentais">Cisne Monumental & Conchas Ornamentais</option>
                <option value="Fonte Esculpida em Cascata">Fonte Esculpida em Cascata</option>
                <option value="Pórtico Botânico Escultural">Pórtico Botânico Escultural</option>
                <option value="Consolo Entalhado & Dourado a Ouro">Consolo Entalhado & Dourado a Ouro</option>
                <option value="Escultura Acústica / Instrumento Nobre">Escultura Acústica / Instrumento Nobre</option>
              </select>
            </div>

            {/* Scale Selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-[#E0C995] uppercase block">
                03 • Escala & Dimensões
              </label>
              <select
                value={scale}
                onChange={(e) => setScale(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#16251E] border border-[#C8A86B]/30 text-[#FAF8F5] text-xs font-mono focus:border-[#E0C995] outline-none"
              >
                <option value="Monumental (3 a 6+ metros)">Monumental (3 a 6+ metros)</option>
                <option value="Destaque de Jardim (1.5 a 3 metros)">Destaque de Jardim (1.5 a 3 metros)</option>
                <option value="Escala para Interiores (1 a 2 metros)">Escala para Interiores (1 a 2 metros)</option>
                <option value="Peça de Coleção (&lt; 1 metro)">Peça de Coleção (&lt; 1 metro)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#FAF8F5]/10">
            <div className="text-xs text-[#FAF8F5]/70 font-mono">
              Selecionado: <span className="text-[#E0C995]">{spaceType}</span> • <span className="text-[#FAF8F5]">{motif}</span>
            </div>
            <button
              onClick={handleLaunchBespoke}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#FAF8F5] text-[#16251E] hover:bg-[#E0C995] transition-all text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 shadow-2xl"
            >
              <span>INICIAR UM PROJETO</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
