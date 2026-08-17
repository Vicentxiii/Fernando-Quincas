import React, { useState, useEffect } from 'react';
import { Sparkles, Compass, Bookmark, Menu, X, ArrowUpRight } from 'lucide-react';

interface HeaderProps {
  activeSection: string;
  savedCount: number;
  onOpenDossier: () => void;
  onNavigate: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  savedCount,
  onOpenDossier,
  onNavigate
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'INÍCIO', subtitle: 'Apresentação' },
    { id: 'artist', label: 'O ARTISTA', subtitle: 'Biografia & Filosofia' },
    { id: 'works', label: 'OBRAS', subtitle: 'Galeria de Esculturas' },
    { id: 'techniques', label: 'SABER-FAZER', subtitle: 'Técnicas & Matérias' },
    { id: 'garden', label: 'O JARDIM', subtitle: 'Santuário Botânico' },
    { id: 'atelier', label: 'ATELIÊ', subtitle: 'Processo Criativo' },
    { id: 'media', label: 'MÍDIA', subtitle: 'Imprensa & Notícias' },
    { id: 'boutique', label: 'COLEÇÃO', subtitle: 'Peças & Esculturas' },
    { id: 'commissions', label: 'ENCOMENDAS', subtitle: 'Projetos sob Medida' },
    { id: 'contact', label: 'CONTATO', subtitle: 'Atendimento Exclusivo' },
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 md:px-8 pt-3 sm:pt-4 transition-all duration-700 pointer-events-none">
        <div
          id="main-floating-header"
          className={`pointer-events-auto w-full max-w-7xl rounded-full transition-all duration-700 ease-out flex items-center justify-between px-5 sm:px-8 py-3.5 sm:py-4 ${
            isScrolled
              ? 'glass-header-scrolled border border-[#C8A86B]/30 shadow-[0_8px_32px_rgba(30,29,26,0.08)]'
              : 'glass-header-top border border-[#C8A86B]/15 shadow-[0_4px_20px_rgba(30,29,26,0.03)]'
          }`}
        >
          {/* Brand Logo & Monogram */}
          <button
            onClick={() => handleItemClick('home')}
            className="flex items-center gap-3 group text-left transition-transform duration-300 hover:scale-[1.01]"
            aria-label="Fernando Quincas Início"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#C8A86B]/50 flex items-center justify-center bg-[#FAF8F5]/80 text-[#C8A86B] font-display font-medium text-xs sm:text-sm tracking-wider shadow-sm group-hover:border-[#C8A86B] transition-colors">
              FQ
            </div>
            <div className="flex flex-col">
              <span className="font-display tracking-[0.18em] text-xs sm:text-sm font-semibold text-[#1E1D1A]">
                FERNANDO QUINCAS
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-[0.22em] text-[#C8A86B] font-serif italic uppercase">
                Escultor & Mestre Artesão
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7" aria-label="Navegação Principal">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`text-[11px] xl:text-[12px] tracking-[0.18em] font-medium transition-all duration-300 relative py-1 hover:text-[#C8A86B] ${
                    isActive ? 'text-[#C8A86B] font-semibold' : 'text-[#2C2A26]/80'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-[1.5px] bg-[#C8A86B] rounded-full animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Actions: Dossier Curation, Mobile Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Collector Dossier Drawer Button */}
            <button
              onClick={onOpenDossier}
              className="relative px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[#C8A86B]/40 bg-[#FAF8F5]/70 hover:bg-[#1E1D1A] hover:text-[#FAF8F5] hover:border-[#1E1D1A] transition-all duration-300 flex items-center gap-2 group"
              aria-label="Abrir dossiê de obras salvas"
            >
              <Bookmark className="w-3.5 h-3.5 text-[#C8A86B] group-hover:text-[#D4B376] transition-colors" />
              <span className="hidden sm:inline text-[10px] sm:text-[11px] tracking-[0.18em] font-semibold">
                DOSSIÊ
              </span>
              {savedCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#6B1D2F] text-white text-[9px] font-bold flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Mobile Editorial Menu Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-full border border-[#C8A86B]/30 text-[#1E1D1A] hover:border-[#C8A86B] transition-colors bg-[#FAF8F5]/60"
              aria-label="Abrir menu"
            >
              <Menu className="w-4 h-4 text-[#1E1D1A]" />
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Editorial Curtain Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#FAF8F5] text-[#1E1D1A] flex flex-col justify-between p-6 sm:p-10 animate-fadeIn">
          {/* Top Bar inside mobile menu */}
          <div className="flex items-center justify-between border-b border-[#C8A86B]/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-[#C8A86B] flex items-center justify-center text-[#C8A86B] font-display text-xs">
                FQ
              </div>
              <span className="font-display tracking-[0.18em] text-xs font-semibold">
                FERNANDO QUINCAS
              </span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-full border border-[#C8A86B]/30 text-[#1E1D1A] hover:bg-[#C8A86B]/10 transition-colors"
              aria-label="Fechar menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links with Subtitles */}
          <div className="py-6 flex flex-col gap-3 sm:gap-4 overflow-y-auto">
            {navItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className="group flex items-baseline justify-between text-left py-2 border-b border-[#C8A86B]/10 hover:border-[#C8A86B]/40 transition-colors"
              >
                <div className="flex items-baseline gap-3">
                  <span className="text-[10px] tracking-widest text-[#C8A86B] font-mono">
                    0{idx + 1}
                  </span>
                  <span className="font-serif text-2xl sm:text-3xl text-[#1E1D1A] group-hover:text-[#C8A86B] transition-colors">
                    {item.label}
                  </span>
                </div>
                <span className="text-xs font-serif italic text-[#8A82A5] group-hover:text-[#1E1D1A] transition-colors">
                  {item.subtitle}
                </span>
              </button>
            ))}
          </div>

          {/* Mobile Footer Area */}
          <div className="border-t border-[#C8A86B]/20 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#2C2A26]/70">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#6A7D69] animate-ping" />
              <span>Ateliê & Parque de Esculturas • Petrópolis — RJ</span>
            </div>
            <div className="flex items-center gap-4 text-[#C8A86B]">
              <button onClick={() => { setIsMobileMenuOpen(false); onOpenDossier(); }} className="flex items-center gap-1 hover:underline">
                <span>Ver Dossiê ({savedCount})</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
