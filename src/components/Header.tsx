import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bookmark, Menu, X, ArrowUpRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  activeSection: string;
  savedCount: number;
  onOpenDossier: () => void;
  onNavigate: (sectionId: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  subtitle: string;
  route?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  savedCount,
  onOpenDossier,
  onNavigate
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isBlogRoute = location.pathname.startsWith('/blog');
  const isShopRoute = location.pathname.startsWith('/loja');
  const isInstrumentsRoute = location.pathname.startsWith('/instrumentos');
  const { count: cartCount, openCart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const mainNavItems: NavItem[] = [
    { id: 'shop', label: 'LOJA', subtitle: 'Obras & Edições Disponíveis', route: '/loja' },
    { id: 'instruments', label: 'INSTRUMENTOS', subtitle: 'Liras Artesanais', route: '/instrumentos' },
    { id: 'atelier', label: 'ATELIÊ', subtitle: 'Processo Criativo' },
    { id: 'media', label: 'MÍDIA', subtitle: 'Imprensa & Notícias' },
    { id: 'commissions', label: 'ENCOMENDAS', subtitle: 'Projetos sob Medida' },
    { id: 'blog', label: 'BLOG', subtitle: 'Diário & Ensaios', route: '/blog' },
  ];

  const mobileNavItems: NavItem[] = [
    ...mainNavItems,
    { id: 'contact', label: 'CONTATO', subtitle: 'Atendimento Exclusivo' },
  ];

  const handleItemClick = (item: NavItem) => {
    if (item.route) {
      navigate(item.route);
    } else {
      onNavigate(item.id);
    }
    setIsMobileMenuOpen(false);
  };

  const isRouteActive = (route?: string) => {
    if (!route) return false;
    if (route.startsWith('/blog')) return isBlogRoute;
    if (route.startsWith('/loja')) return isShopRoute;
    if (route.startsWith('/instrumentos')) return isInstrumentsRoute;
    return false;
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 md:px-8 pt-3 sm:pt-5 transition-all duration-700 pointer-events-none">
        <div
          id="main-floating-header"
          className={`pointer-events-auto w-full max-w-7xl xl:max-w-[1320px] 2xl:max-w-[1680px] rounded-full transition-all duration-700 ease-out flex items-center justify-between gap-6 xl:gap-8 px-6 sm:px-8 py-3.5 xl:py-4 ${
            isScrolled
              ? 'glass-header-scrolled border border-[#C8A86B]/30 shadow-[0_8px_32px_rgba(30,29,26,0.08)]'
              : 'glass-header-top border border-[#C8A86B]/15 shadow-[0_4px_20px_rgba(30,29,26,0.03)]'
          }`}
        >
          {/* Brand Logo & Monogram — own territory (≈20–25% width) - agora crawlable */}
          <div className="flex items-center gap-3 shrink-0 w-auto sm:w-[240px] xl:w-[270px] 2xl:w-[360px]">
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); handleItemClick({ id: 'home', label: 'INÍCIO', subtitle: '' }); }}
              className="flex items-center gap-3 group text-left transition-opacity duration-300 hover:opacity-70"
              aria-label="Fernando Quincas Início"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#C8A86B]/50 flex items-center justify-center bg-[#FAF8F5]/80 text-[#C8A86B] font-display font-medium text-xs sm:text-sm tracking-wider shadow-sm group-hover:border-[#C8A86B] transition-colors duration-300">
                FQ
              </div>
              <div className="flex flex-col">
                <span className="hidden min-[400px]:block font-display tracking-[0.18em] text-xs sm:text-sm font-semibold text-[#1E1D1A] leading-tight">
                  FERNANDO QUINCAS
                </span>
                <span className="hidden xl:block text-[9px] sm:text-[10px] tracking-[0.22em] text-[#C8A86B] font-serif italic uppercase leading-tight">
                  Escultor & Mestre Artesão
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation — centered, generous spacing (xl and up) - agora crawlable com <a> */}
          <nav
            className="hidden xl:flex flex-1 items-center justify-center gap-x-6 xl:gap-x-7 2xl:gap-x-10"
            aria-label="Navegação Principal"
          >
            {mainNavItems.map((item) => {
              const isActive = item.route ? isRouteActive(item.route) : activeSection === item.id;
              const href = item.route || `/#${item.id}`;
              return (
                <a
                  key={item.id}
                  href={href}
                  onClick={(e) => { e.preventDefault(); handleItemClick(item); }}
                  className={`group relative py-2 whitespace-nowrap text-[10px] xl:text-[11px] tracking-[0.12em] 2xl:tracking-[0.14em] font-medium uppercase transition-colors duration-300 ${
                    isActive ? 'text-[#C8A86B]' : 'text-[#2C2A26]/70 hover:text-[#C8A86B]'
                  }`}
                >
                  {item.label}
                  <span
                    aria-hidden
                    className={`absolute left-1/2 -translate-x-1/2 -bottom-px h-px bg-[#C8A86B] transition-all duration-300 ${
                      isActive ? 'w-5 opacity-100' : 'w-0 opacity-0 group-hover:w-5 group-hover:opacity-100'
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          {/* Actions — Contact (text) + Cart + Dossier (pill), visually separated */}
          <div className="hidden xl:flex shrink-0 w-[140px] 2xl:w-[240px] items-center justify-end gap-3 2xl:gap-4">
            <a
              href="/#contact"
              onClick={(e) => { e.preventDefault(); handleItemClick({ id: 'contact', label: 'CONTATO', subtitle: 'Atendimento Exclusivo' }); }}
              className={`group hidden xl:inline-flex items-center gap-1.5 whitespace-nowrap ml-8 2xl:ml-12 text-[10px] xl:text-[11px] tracking-[0.18em] uppercase font-medium transition-colors duration-300 ${
                activeSection === 'contact' ? 'text-[#C8A86B]' : 'text-[#2C2A26]/70 hover:text-[#C8A86B]'
              }`}
            >
              CONTATO
              <ArrowUpRight className="w-3 h-3 text-[#C8A86B] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            {/* Shop Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2.5 rounded-full border border-[#C8A86B]/35 bg-[#FAF8F5]/70 hover:border-[#C8A86B] transition-colors duration-300"
              aria-label={`Abrir carrinho${cartCount > 0 ? ` (${cartCount} itens)` : ''}`}
              title="Abrir carrinho"
            >
              <ShoppingBag className="w-4 h-4 text-[#1E1D1A]" strokeWidth={1.75} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#6B1D2F] text-white text-[9px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Collector Dossier Drawer Button */}
            <button
              onClick={onOpenDossier}
              className="relative flex items-center gap-2 pl-3.5 pr-3 py-2 rounded-full border border-[#C8A86B]/35 bg-[#FAF8F5]/70 hover:bg-[#1E1D1A] hover:text-[#FAF8F5] hover:border-[#1E1D1A] transition-colors duration-300"
              aria-label="Abrir dossiê de obras salvas"
              title="Abrir dossiê de obras salvas"
            >
              <Bookmark className="w-3.5 h-3.5 text-[#C8A86B] transition-colors duration-300 group-hover:text-[#E0C995]" />
              <span className="hidden 2xl:inline text-[10px] tracking-[0.18em] font-medium">DOSSIÊ</span>
              {savedCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#6B1D2F] text-white text-[9px] font-bold flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile / Tablet Actions — compact, not a squeezed desktop nav */}
          <div className="xl:hidden flex items-center gap-2">
            <button
              onClick={openCart}
              className="relative p-2.5 rounded-full border border-[#C8A86B]/30 text-[#1E1D1A] hover:border-[#C8A86B] transition-colors bg-[#FAF8F5]/60"
              aria-label={`Abrir carrinho${cartCount > 0 ? ` (${cartCount} itens)` : ''}`}
              title="Abrir carrinho"
            >
              <ShoppingBag className="w-4 h-4 text-[#1E1D1A]" strokeWidth={1.75} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#6B1D2F] text-white text-[9px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={onOpenDossier}
              className="relative p-2.5 rounded-full border border-[#C8A86B]/30 text-[#1E1D1A] hover:border-[#C8A86B] transition-colors bg-[#FAF8F5]/60"
              aria-label="Abrir dossiê de obras salvas"
              title="Abrir dossiê de obras salvas"
            >
              <Bookmark className="w-4 h-4 text-[#1E1D1A]" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#6B1D2F] text-white text-[9px] font-bold flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2.5 rounded-full border border-[#C8A86B]/30 text-[#1E1D1A] hover:border-[#C8A86B] transition-colors bg-[#FAF8F5]/60"
              aria-label="Abrir menu"
            >
              <Menu className="w-5 h-5 text-[#1E1D1A]" />
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

          {/* Navigation Links with Subtitles - agora crawlable */}
          <div className="py-6 flex flex-col gap-3 sm:gap-4 overflow-y-auto">
            {mobileNavItems.map((item, idx) => {
              const isActive = item.route
                ? isRouteActive(item.route)
                : activeSection === item.id;
              const href = item.route || `/#${item.id}`;
              return (
                <a
                  key={item.id}
                  href={href}
                  onClick={(e) => { e.preventDefault(); handleItemClick(item); }}
                  className={`group flex items-baseline justify-between text-left py-2 border-b border-[#C8A86B]/10 hover:border-[#C8A86B]/40 transition-colors ${
                    isActive ? 'text-[#C8A86B]' : 'text-[#1E1D1A]'
                  }`}
                >
                  <div className="flex items-baseline gap-3">
                    <span className="text-[10px] tracking-widest text-[#C8A86B] font-mono">
                      0{idx + 1}
                    </span>
                    <span className="font-serif text-2xl sm:text-3xl group-hover:text-[#C8A86B] transition-colors">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-xs font-serif italic text-[#8A82A5] group-hover:text-[#1E1D1A] transition-colors">
                    {item.subtitle}
                  </span>
                </a>
              );
            })}
          </div>

          {/* Mobile Footer Area */}
          <div className="border-t border-[#C8A86B]/20 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#2C2A26]/70">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#6A7D69] animate-ping" />
              <span>Ateliê & Parque de Esculturas • Minas Gerais</span>
            </div>
            <div className="flex items-center gap-4 text-[#C8A86B]">
              <button onClick={() => { setIsMobileMenuOpen(false); openCart(); }} className="flex items-center gap-1 hover:underline">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Carrinho ({cartCount})</span>
              </button>
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