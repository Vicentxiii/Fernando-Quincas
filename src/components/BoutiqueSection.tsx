import React, { useState } from 'react';
import { ARTWORKS } from '../data/artworks';
import { Artwork } from '../types';
import { Eye, ShieldCheck, Truck, Award, Bookmark } from 'lucide-react';

interface BoutiqueSectionProps {
  onSelectArtwork: (artwork: Artwork) => void;
  onInquireArtwork: (artwork: Artwork) => void;
  onToggleSave: (artworkId: string) => void;
  savedArtworkIds: string[];
}

export const BoutiqueSection: React.FC<BoutiqueSectionProps> = ({
  onSelectArtwork,
  onInquireArtwork,
  onToggleSave,
  savedArtworkIds,
}) => {
  const [filterAvailability, setFilterAvailability] = useState<'ALL' | 'AVAILABLE' | 'LIMITED_EDITION'>('ALL');

  const boutiquePieces = ARTWORKS.filter((art) => {
    if (filterAvailability === 'AVAILABLE') return art.availability === 'AVAILABLE';
    if (filterAvailability === 'LIMITED_EDITION') return art.availability === 'LIMITED_EDITION';
    return true;
  });

  return (
    <section id="boutique" className="py-24 sm:py-32 px-6 sm:px-8 md:px-12 bg-[#FAF8F5] text-[#1E1D1A] relative border-b border-[#C8A86B]/25">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#C8A86B]/25 pb-8 mb-12">
          <div>
            <span className="text-[10px] sm:text-[11px] tracking-[0.3em] text-[#C8A86B] uppercase font-mono block mb-2">
              CAPÍTULO VIII • AQUISIÇÃO & EDIÇÕES
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#1E1D1A] font-light tracking-tight">
              A COLEÇÃO & <br />
              <span className="italic font-normal text-[#9C7D3E]">AQUISIÇÕES</span>
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-sm text-[#2C2A26]/80 font-light leading-relaxed">
              Adquira esculturas exclusivas e edições limitadas numeradas. Cada peça é acompanhada por Certificado de Autenticidade assinado pelo artista e logística especializada.
            </p>
            <div className="flex items-center gap-3 pt-3">
              <span className="text-xs font-mono text-[#8A82A5]">Filtrar:</span>
              <button
                onClick={() => setFilterAvailability('ALL')}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-colors ${
                  filterAvailability === 'ALL' ? 'bg-[#1E1D1A] text-white' : 'bg-[#FAF6EE] text-[#2C2A26]'
                }`}
              >
                TODAS
              </button>
              <button
                onClick={() => setFilterAvailability('AVAILABLE')}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-colors ${
                  filterAvailability === 'AVAILABLE' ? 'bg-[#1E1D1A] text-white' : 'bg-[#FAF6EE] text-[#2C2A26]'
                }`}
              >
                PEÇAS ÚNICAS
              </button>
              <button
                onClick={() => setFilterAvailability('LIMITED_EDITION')}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-colors ${
                  filterAvailability === 'LIMITED_EDITION' ? 'bg-[#1E1D1A] text-white' : 'bg-[#FAF6EE] text-[#2C2A26]'
                }`}
              >
                EDIÇÕES LIMITADAS
              </button>
            </div>
          </div>
        </div>

        {/* Boutique Pieces Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {boutiquePieces.map((artwork) => {
            const isSaved = savedArtworkIds.includes(artwork.id);

            return (
              <div
                key={artwork.id}
                className="group rounded-2xl overflow-hidden border border-[#C8A86B]/25 bg-[#FAF6EE] flex flex-col justify-between shadow-md hover:shadow-2xl hover:border-[#C8A86B] transition-all duration-500"
              >
                {/* Artwork Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EAE5D8]">
                  <img
                    src={artwork.image}
                    alt={artwork.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 glass-card px-2.5 py-1 rounded-full text-[9px] font-mono tracking-widest text-[#1E1D1A] uppercase border border-[#C8A86B]/30">
                    {artwork.edition || (artwork.availability === 'AVAILABLE' ? 'DISPONÍVEL' : artwork.availability === 'LIMITED_EDITION' ? 'EDIÇÃO LIMITADA' : 'COLEÇÃO PRIVADA')}
                  </div>
                  <button
                    onClick={() => onToggleSave(artwork.id)}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${
                      isSaved ? 'bg-[#6B1D2F] text-white' : 'bg-white/80 text-[#1E1D1A] hover:bg-[#C8A86B] hover:text-white'
                    }`}
                    title={isSaved ? 'Remover do Dossiê' : 'Salvar no Dossiê'}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono tracking-widest text-[#C8A86B] uppercase block">
                      {artwork.category}
                    </span>
                    <h3 className="font-serif text-2xl text-[#1E1D1A]">
                      {artwork.title}
                    </h3>
                    <p className="text-xs text-[#2C2A26]/75 font-serif italic line-clamp-2">
                      {artwork.subtitle}
                    </p>
                  </div>

                  {/* Specifications Summary */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono py-3 border-t border-b border-[#C8A86B]/15 text-[#2C2A26]">
                    <div>
                      <span className="text-[#8A82A5] block text-[9px]">DIMENSÕES</span>
                      <span>{artwork.dimensions}</span>
                    </div>
                    <div>
                      <span className="text-[#8A82A5] block text-[9px]">MATERIAIS</span>
                      <span className="truncate block">{artwork.materials[0]}</span>
                    </div>
                  </div>

                  {/* Actions: Inquire or Examine */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => onInquireArtwork(artwork)}
                      className="flex-1 px-4 py-3 rounded-full bg-[#1E1D1A] text-[#FAF8F5] hover:bg-[#C8A86B] hover:text-[#1E1D1A] transition-all text-xs font-semibold tracking-wider flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <span>SOLICITAR INFORMAÇÕES</span>
                    </button>
                    <button
                      onClick={() => onSelectArtwork(artwork)}
                      className="p-3 rounded-full border border-[#C8A86B]/30 hover:bg-[#C8A86B]/10 transition-colors"
                      title="Examinar Detalhes"
                    >
                      <Eye className="w-4 h-4 text-[#1E1D1A]" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Luxury Acquisition Guarantees */}
        <div className="mt-16 p-8 rounded-3xl bg-[#FAF6EE] border border-[#C8A86B]/25 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-start gap-4">
            <Award className="w-6 h-6 text-[#C8A86B] shrink-0 mt-1" />
            <div>
              <h4 className="font-serif text-base font-semibold text-[#1E1D1A]">Certificado de Autenticidade</h4>
              <p className="text-xs text-[#2C2A26]/70 mt-1">Cada obra acompanha chancela oficial do ateliê Fernando Quincas e dossiê curatorial assinado.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Truck className="w-6 h-6 text-[#C8A86B] shrink-0 mt-1" />
            <div>
              <h4 className="font-serif text-base font-semibold text-[#1E1D1A]">Transporte & Logística Segura</h4>
              <p className="text-xs text-[#2C2A26]/70 mt-1">Embalagens especiais sob medida e transporte dedicado para obras de arte em todo o país e exterior.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <ShieldCheck className="w-6 h-6 text-[#C8A86B] shrink-0 mt-1" />
            <div>
              <h4 className="font-serif text-base font-semibold text-[#1E1D1A]">Consultoria Espacial & Montagem</h4>
              <p className="text-xs text-[#2C2A26]/70 mt-1">Nossa equipe presta assessoria técnica direta a arquitetos, paisagistas e designers de interiores.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
