import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#16251E] text-[#FAF8F5] py-20 sm:py-28 px-6 sm:px-8 md:px-12 relative border-t border-[#C8A86B]/30 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Top Colophon / Art Book Closing Page Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 border-b border-[#FAF8F5]/15 pb-12">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-[#E0C995] flex items-center justify-center text-[#E0C995] font-display text-sm font-semibold">
                FQ
              </div>
              <span className="font-display tracking-[0.25em] text-lg font-semibold text-[#FAF8F5]">
                FERNANDO QUINCAS
              </span>
            </div>
            <p className="text-xs font-serif italic text-[#E0C995] max-w-sm">
              Escultor & Mestre Artesão • Onde a Arte Encontra a Natureza
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="px-5 py-2.5 rounded-full border border-[#C8A86B]/40 hover:border-[#E0C995] hover:bg-[#FAF8F5]/10 text-xs font-mono tracking-widest text-[#FAF8F5] flex items-center gap-2 transition-colors"
            >
              <span>VOLTAR AO INÍCIO</span>
              <ArrowUp className="w-3.5 h-3.5 text-[#E0C995]" />
            </button>
          </div>
        </div>

        {/* Multi-Column Editorial Directory */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs font-mono">
          {/* Navigation */}
          <div className="space-y-3">
            <span className="text-[10px] uppercase text-[#E0C995] tracking-[0.25em] block">
              EXPLORAÇÃO
            </span>
            <ul className="space-y-2 text-[#FAF8F5]/75">
              <li><button onClick={() => onNavigate('home')} className="hover:text-[#E0C995]">Início</button></li>
              <li><Link to="/loja" className="hover:text-[#E0C995]">Loja — Obras Disponíveis</Link></li>
              <li><button onClick={() => onNavigate('artist')} className="hover:text-[#E0C995]">O Artista & Filosofia</button></li>
              <li><button onClick={() => onNavigate('story')} className="hover:text-[#E0C995]">Trajetória na Escultura</button></li>
              <li><button onClick={() => onNavigate('monumental')} className="hover:text-[#E0C995]">Obras Monumentais</button></li>
              <li><Link to="/blog" className="hover:text-[#E0C995]">Blog & Ensaios</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] uppercase text-[#E0C995] tracking-[0.25em] block">
              O UNIVERSO
            </span>
            <ul className="space-y-2 text-[#FAF8F5]/75">
              <li><button onClick={() => onNavigate('works')} className="hover:text-[#E0C995]">Coleção de Esculturas</button></li>
              <li><button onClick={() => onNavigate('techniques')} className="hover:text-[#E0C995]">Saber-Fazer & Matérias</button></li>
              <li><button onClick={() => onNavigate('garden')} className="hover:text-[#E0C995]">Santuário Botânico</button></li>
              <li><button onClick={() => onNavigate('atelier')} className="hover:text-[#E0C995]">O Ateliê</button></li>
              <li><button onClick={() => onNavigate('media')} className="hover:text-[#E0C995]">Mídia & Imprensa</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] uppercase text-[#E0C995] tracking-[0.25em] block">
              AQUISIÇÕES
            </span>
            <ul className="space-y-2 text-[#FAF8F5]/75">
              <li><button onClick={() => onNavigate('boutique')} className="hover:text-[#E0C995]">Peças & Edições</button></li>
              <li><button onClick={() => onNavigate('commissions')} className="hover:text-[#E0C995]">Projetos sob Medida</button></li>
              <li><button onClick={() => onNavigate('contact')} className="hover:text-[#E0C995]">Atendimento Exclusivo</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] uppercase text-[#E0C995] tracking-[0.25em] block">
              LOCALIZAÇÃO & CONTATO
            </span>
            <div className="text-[#FAF8F5]/75 space-y-2 leading-relaxed font-light">
              <p><strong>Ateliê:</strong> Minas Gerais, Brasil</p>
              <p><strong>Parque:</strong> Serra dos Órgãos</p>
              <p className="text-[#E0C995]">contato@fernandoquincas.art</p>
            </div>
          </div>
        </div>

        {/* Bottom Colophon Bar */}
        <div className="pt-10 border-t border-[#FAF8F5]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-[#FAF8F5]/50">
          <div>
            © {new Date().getFullYear()} Fernando Quincas. Todos os direitos reservados.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <a
              href="https://www.instagram.com/fernando_quincas"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#E0C995] transition-colors"
            >
              Instagram
            </a>
            <Link to="/loja" className="hover:text-[#E0C995] transition-colors">
              Loja
            </Link>
            <span>Termos</span>
            <span>Privacidade</span>
          </div>
          <div className="flex items-center gap-6">
            <span>Arte Escultural × Natureza</span>
          </div>
        </div>

        {/* Back to Top */}
        <div className="flex justify-center pt-12">
          <button
            onClick={scrollToTop}
            aria-label="Voltar ao topo"
            className="flex flex-col items-center gap-2 group"
          >
            <span className="w-12 h-12 rounded-full border border-[#C8A86B]/50 flex items-center justify-center text-[#E0C995] hover:bg-[#C8A86B] hover:text-[#16251E] transition-colors">
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            </span>
            <span className="text-[10px] tracking-[0.25em] uppercase font-mono text-[#FAF8F5]/60 group-hover:text-[#C8A86B] transition-colors">
              Voltar ao topo
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
};
