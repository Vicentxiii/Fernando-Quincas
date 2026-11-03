import React from 'react';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export const MaintenancePage: React.FC = () => {
  useDocumentMeta({
    title: 'Manutenção de Infraestrutura',
    description: 'Nosso ambiente digital está passando por uma manutenção programada e aprimoramentos técnicos de estabilidade.',
    noindex: true,
  });

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center bg-[#FAF8F5] text-[#1E1D1A] px-6 py-12 selection:bg-[#C8A86B]/20 selection:text-[#1E1D1A] overflow-hidden">
      {/* Subtle architectural background ambiance */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30">
        <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#C8A86B]/15 via-[#EAE5D8]/40 to-transparent blur-3xl animate-pulse" />
      </div>

      {/* Decorative refined borders */}
      <div className="pointer-events-none absolute inset-4 sm:inset-8 border border-[#C8A86B]/20 rounded-2xl" />

      {/* Top Header / Monogram */}
      <header className="relative z-10 pt-4 flex flex-col items-center space-y-2">
        <div className="w-10 h-10 rounded-full border border-[#C8A86B]/40 flex items-center justify-center bg-white/60 shadow-sm backdrop-blur-xs">
          <span className="font-serif italic text-base text-[#C8A86B] font-semibold">FQ</span>
        </div>
        <p className="font-mono text-[9px] tracking-[0.35em] uppercase text-[#1E1D1A]/60">
          Ateliê Fernando Quincas
        </p>
      </header>

      {/* Center Notice Card */}
      <main className="relative z-10 max-w-xl mx-auto text-center my-auto py-8">
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#C8A86B]/30 bg-white/70 backdrop-blur-md mb-6 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C8A86B] animate-ping" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#C8A86B] -ml-3.5" />
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#9C7D3E] font-medium">
            Estabilidade & Infraestrutura
          </span>
        </div>

        {/* Heading */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#1E1D1A] leading-[1.15] mb-5">
          Ambiente em Manutenção Programada
        </h1>

        {/* Divider hairline with diamond accent */}
        <div className="flex items-center justify-center gap-3 my-6">
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#C8A86B]/50" />
          <span className="w-1.5 h-1.5 rotate-45 border border-[#C8A86B]" />
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#C8A86B]/50" />
        </div>

        {/* Informative message */}
        <p className="font-serif text-base sm:text-lg text-[#1E1D1A]/70 leading-relaxed font-light max-w-md mx-auto">
          Nosso portal está temporariamente em processo de modernização e estabilização de infraestrutura de servidores.
        </p>

        <p className="mt-3 text-xs sm:text-sm text-[#1E1D1A]/50 tracking-wide font-light">
          Todas as rotas e serviços normais serão restabelecidos em breve.
        </p>
      </main>

      {/* Elegant Artisan Credit Footer */}
      <footer className="relative z-10 pb-4 text-center">
        <div className="max-w-md mx-auto pt-6 border-t border-[#C8A86B]/15">
          <p className="font-mono text-[10px] tracking-[0.18em] text-[#1E1D1A]/60 leading-relaxed uppercase">
            Website Created by{' '}
            <a
              href="https://instagram.com/vicenteczar.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#9C7D3E] hover:text-[#C8A86B] font-medium transition-colors underline decoration-[#C8A86B]/30 underline-offset-4"
            >
              @vicenteczar.dev
            </a>
            <br />
            <span className="text-[9px] tracking-[0.22em] text-[#1E1D1A]/40 font-normal">
              an digital artisan from Transcent Digital CO.
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
};

