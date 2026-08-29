import React, { useState } from 'react';
import { Newspaper, ExternalLink, Sparkles, Award, ArrowUpRight, Quote, ShieldCheck, Check } from 'lucide-react';
import { MEDIA_ARTICLES } from '../data/media';
import { MediaArticle } from '../types';

interface MediaSectionProps {
  onContactPress?: () => void;
}

export const MediaSection: React.FC<MediaSectionProps> = ({ onContactPress }) => {
  const [selectedArticle, setSelectedArticle] = useState<MediaArticle | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const mainArticle = MEDIA_ARTICLES.find((a) => a.isMainHeadline) || MEDIA_ARTICLES[0];

  const handleShareMain = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(mainArticle.url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <section
      id="media"
      className="py-24 sm:py-32 px-4 sm:px-6 md:px-12 bg-[#FAF8F5] relative overflow-hidden border-b border-[#C8A86B]/25"
    >
      {/* Background Decorative Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#E0C995]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#16251E]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#C8A86B]/30 pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#C8A86B]/40 bg-[#FAF8F5] text-[#C8A86B] text-[10px] tracking-[0.25em] font-mono uppercase">
              <Newspaper className="w-3 h-3" />
              <span>IMPRENSA & RECONHECIMENTO PÚBLICO</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#1E1D1A]">
              MÍDIA
            </h2>
            <p className="font-serif italic text-lg sm:text-xl text-[#8A82A5] leading-relaxed">
              O impacto da obra monumental de Fernando Quincas na imprensa nacional e na memória coletiva.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-[#8A82A5]">
            <span className="hidden sm:inline">COBERTURA JORNALÍSTICA</span>
            <span className="w-8 h-px bg-[#C8A86B]/40 hidden sm:inline" />
            <span className="text-[#C8A86B] font-semibold">ARQUIVO DE REPORTAGENS</span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 1. PRINCIPAL / HERO HEADLINE FEATURE (O GLOBO: BONECA EVA) */}
        {/* ============================================================ */}
        <div className="relative rounded-3xl overflow-hidden bg-[#16251E] text-[#FAF8F5] border border-[#E0C995]/40 shadow-[0_20px_50px_rgba(22,37,30,0.25)]">
          {/* Subtle gold watermark frame */}
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none hidden lg:block">
            <Quote className="w-48 h-48 text-[#E0C995]" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-6 sm:p-10 md:p-14 relative z-10 items-center">
            {/* Left Column: Editorial Information & Headline */}
            <div className="lg:col-span-7 space-y-6">
              {/* Publication Outlet Banner */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-[#E0C995] text-[#16251E] text-[10px] font-mono font-bold tracking-[0.25em] uppercase flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3 h-3" />
                  DESTAQUE PRINCIPAL NA IMPRENSA
                </span>
                <span className="text-xs font-mono tracking-widest text-[#E0C995] uppercase font-semibold">
                  {mainArticle.outlet}
                </span>
                <span className="text-[#E0C995]/50">•</span>
                <span className="text-xs font-serif italic text-[#FAF8F5]/70">
                  {mainArticle.section}
                </span>
              </div>

              {/* Headline Title */}
              <h3 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold tracking-tight text-[#FAF8F5] leading-snug">
                "{mainArticle.title}"
              </h3>

              {/* Lead Excerpt */}
              <p className="font-serif italic text-base sm:text-lg text-[#E0C995] leading-relaxed">
                {mainArticle.excerpt}
              </p>

              {/* Extended Curatorial Context */}
              <p className="text-sm sm:text-base text-[#FAF8F5]/80 font-light leading-relaxed">
                {mainArticle.extendedBody}
              </p>

              {/* Key Specs / Highlights of the Sculptural Feat */}
              {mainArticle.stats && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#E0C995]/20">
                  {mainArticle.stats.map((stat, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#FAF8F5]/5 border border-[#E0C995]/15 space-y-1">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-[#E0C995] block">
                        {stat.label}
                      </span>
                      <span className="font-display text-xs sm:text-sm font-semibold text-[#FAF8F5] block">
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <a
                  href={mainArticle.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-full bg-[#E0C995] text-[#16251E] hover:bg-[#FAF8F5] font-mono text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center gap-2 shadow-lg group hover:scale-[1.02]"
                >
                  <span>LER MATÉRIA COMPLETA NO O GLOBO</span>
                  <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>

                <button
                  onClick={handleShareMain}
                  className="px-5 py-3.5 rounded-full border border-[#E0C995]/40 hover:border-[#E0C995] bg-[#FAF8F5]/5 text-xs font-mono tracking-widest text-[#E0C995] transition-colors flex items-center gap-2"
                  title="Copiar link da notícia"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#E0C995]" />
                      <span>LINK COPIADO</span>
                    </>
                  ) : (
                    <>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>COMPARTILHAR</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Column: Visual Feature Showcase */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-[#E0C995]/30 shadow-2xl bg-[#0F1B15] group">
                <img
                  src={mainArticle.image}
                  alt="Escultura monumental em fibra de vidro por Fernando Quincas"
                  className="w-full h-[320px] sm:h-[400px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#16251E] via-[#16251E]/30 to-transparent" />

                {/* Badge Overlay */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#16251E]/90 backdrop-blur-md border border-[#E0C995]/30 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#E0C995] uppercase tracking-widest">
                    <span>ARQUIVO HISTÓRICO</span>
                    <span>45 METROS DE ESCULTURA</span>
                  </div>
                  <p className="text-xs font-serif italic text-[#FAF8F5]">
                    Pioneirismo na aplicação de compósitos de fibra de vidro estrutural para obras de escala arquitetônica.
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-1">
                {mainArticle.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-[#FAF8F5]/10 border border-[#E0C995]/20 text-[10px] font-mono text-[#E0C995]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 3. PRESS INQUIRY & ACCREDITATION BANNER — mantido */}
        {/* ============================================================ */}
        <div className="rounded-2xl border border-[#C8A86B]/30 bg-[#FAF8F5] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-[#C8A86B] flex items-center justify-center text-[#C8A86B] shrink-0 bg-[#FAF8F5]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-serif text-base font-semibold text-[#1E1D1A]">
                Assessoria de Imprensa & Dossiês Editoriais
              </h4>
              <p className="text-xs text-[#8A82A5] font-light max-w-xl">
                Jornalistas, curadores e publicações de arquitetura podem solicitar fotos em alta resolução, biografia detalhada e agendamento de entrevistas exclusivas com Fernando Quincas.
              </p>
            </div>
          </div>

          <button
            onClick={onContactPress}
            className="px-6 py-3 rounded-full bg-[#1E1D1A] text-[#FAF8F5] hover:bg-[#C8A86B] hover:text-[#1E1D1A] text-xs font-mono tracking-widest uppercase transition-colors shrink-0 shadow-md flex items-center gap-2"
          >
            <Newspaper className="w-3.5 h-3.5" />
            <span>SOLICITAR PRESS KIT</span>
          </button>
        </div>
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#FAF8F5] rounded-3xl border border-[#C8A86B]/40 max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#C8A86B]/20 pb-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#C8A86B] uppercase">
                <Award className="w-4 h-4" />
                <span>{selectedArticle.outlet}</span>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="w-8 h-8 rounded-full border border-[#C8A86B]/30 hover:border-[#1E1D1A] flex items-center justify-center text-xs font-mono"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="font-display text-2xl font-semibold text-[#1E1D1A]">
                {selectedArticle.title}
              </h3>
              <p className="text-xs font-mono text-[#8A82A5]">
                {selectedArticle.section} • {selectedArticle.date}
              </p>
            </div>

            <div className="rounded-xl overflow-hidden h-56 bg-[#EAE5D8]">
              <img
                src={selectedArticle.image}
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4 text-sm sm:text-base text-[#1E1D1A]/85 font-light leading-relaxed">
              <p className="font-serif italic text-lg text-[#C8A86B]">
                {selectedArticle.excerpt}
              </p>
              {selectedArticle.extendedBody && (
                <p className="text-sm text-[#2C2A26] leading-relaxed">
                  {selectedArticle.extendedBody}
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-[#C8A86B]/20 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-6 py-2.5 rounded-full bg-[#1E1D1A] text-[#FAF8F5] text-xs font-mono uppercase tracking-widest hover:bg-[#C8A86B] hover:text-[#1E1D1A] transition-colors"
              >
                Fechar Artigo
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
