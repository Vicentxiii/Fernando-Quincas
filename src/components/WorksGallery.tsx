import React, { useState } from 'react';
import { ARTWORKS } from '../data/artworks';
import { Artwork, Category } from '../types';
import { Eye, Bookmark, Check } from 'lucide-react';

interface WorksGalleryProps {
  onSelectArtwork: (artwork: Artwork) => void;
  onToggleSave: (artworkId: string) => void;
  savedArtworkIds: string[];
}

export const WorksGallery: React.FC<WorksGalleryProps> = ({
  onSelectArtwork,
  onToggleSave,
  savedArtworkIds,
}) => {
  const [activeCategory, setActiveCategory] = useState<Category>('ALL');

  const categoryLabels: Record<Category, string> = {
    ALL: 'TODAS AS OBRAS',
    SCULPTURE: 'ESCULTURA',
    GARDEN: 'JARDIM & PARQUE',
    FOUNTAINS: 'FONTES',
    ANIMALS: 'FAUNA & CISNES',
    'DECORATIVE ART': 'ARTE DECORATIVA',
    INSTRUMENTS: 'INSTRUMENTOS',
    MONUMENTAL: 'MONUMENTAL',
  };

  const categories: Category[] = [
    'ALL',
    'SCULPTURE',
    'GARDEN',
    'FOUNTAINS',
    'ANIMALS',
    'DECORATIVE ART',
    'INSTRUMENTS',
    'MONUMENTAL',
  ];

  const filteredArtworks = activeCategory === 'ALL'
    ? ARTWORKS
    : ARTWORKS.filter((art) => art.category === activeCategory || (activeCategory === 'MONUMENTAL' && art.isMonumental));

  return (
    <section id="works" className="py-24 sm:py-32 px-6 sm:px-8 md:px-12 bg-[#FAF8F5] text-[#1E1D1A] relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Title & Curatorial Statement */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#C8A86B]/25 pb-8 mb-12">
          <div>
            <span className="text-[10px] sm:text-[11px] tracking-[0.3em] text-[#C8A86B] uppercase font-mono block mb-2">
              CAPÍTULO IV • COLEÇÃO PERMANENTE
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#1E1D1A] font-light tracking-tight">
              ESCULTURAS & <br />
              <span className="italic font-normal text-[#9C7D3E]">CRIAÇÕES</span>
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-sm text-[#2C2A26]/80 font-light leading-relaxed">
              Cada criação nasce do diálogo entre a matéria orgânica nobre, a ornamentação escultural e a imaginação monumental.
            </p>
            <span className="text-xs font-mono text-[#C8A86B] tracking-wider mt-2 block">
              EXIBINDO {filteredArtworks.length} OBRAS SELECIONADAS
            </span>
          </div>
        </div>

        {/* Category Filter Bar */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-4 mb-14 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs tracking-[0.18em] font-medium transition-all duration-300 uppercase whitespace-nowrap border ${
                  isSelected
                    ? 'bg-[#1E1D1A] text-[#FAF8F5] border-[#1E1D1A] shadow-md scale-[1.02]'
                    : 'bg-[#FAF8F5] text-[#2C2A26]/70 border-[#C8A86B]/25 hover:border-[#C8A86B] hover:text-[#1E1D1A]'
                }`}
              >
                {categoryLabels[cat]}
              </button>
            );
          })}
        </div>

        {/* Editorial Asymmetric Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10">
          {filteredArtworks.map((artwork, index) => {
            const isSaved = savedArtworkIds.includes(artwork.id);
            const isDominant = index % 3 === 0;
            const colSpan = isDominant ? 'md:col-span-7' : 'md:col-span-5';
            const imageHeight = isDominant ? 'h-[440px] sm:h-[540px]' : 'h-[360px] sm:h-[440px]';

            return (
              <div
                key={artwork.id}
                className={`${colSpan} group flex flex-col justify-between`}
              >
                {/* Artwork Image Container */}
                <div className="relative rounded-2xl overflow-hidden border border-[#C8A86B]/25 bg-[#EAE5D8] shadow-lg transition-all duration-700 group-hover:border-[#C8A86B] group-hover:shadow-2xl">
                  <div className={`relative ${imageHeight} w-full overflow-hidden`}>
                    <img
                      src={artwork.image}
                      alt={artwork.title}
                      className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <span className="glass-card px-3 py-1 rounded-full text-[9px] font-mono tracking-widest text-[#1E1D1A] uppercase border border-[#C8A86B]/30">
                      {categoryLabels[artwork.category] || artwork.category}
                    </span>

                    {/* Bookmark / Dossier Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave(artwork.id);
                      }}
                      className={`pointer-events-auto p-2 rounded-full backdrop-blur-md transition-colors ${
                        isSaved
                          ? 'bg-[#6B1D2F] text-white'
                          : 'bg-[#FAF8F5]/80 text-[#1E1D1A] hover:bg-[#C8A86B] hover:text-white'
                      }`}
                      title={isSaved ? 'Remover do Dossiê Privado' : 'Salvar no Dossiê Privado'}
                    >
                      {isSaved ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Hover Quick Action */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <button
                      onClick={() => onSelectArtwork(artwork)}
                      className="px-5 py-2.5 rounded-full bg-[#FAF8F5] text-[#1E1D1A] hover:bg-[#C8A86B] hover:text-white transition-colors text-xs font-mono tracking-widest uppercase flex items-center gap-2 shadow-lg"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>EXAMINAR OBRA</span>
                    </button>

                    <span className="text-[10px] text-white font-mono tracking-widest hidden sm:inline">
                      {artwork.dimensions}
                    </span>
                  </div>
                </div>

                {/* Artwork Metadata */}
                <div className="pt-4 pb-2 space-y-1.5 cursor-pointer" onClick={() => onSelectArtwork(artwork)}>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-serif text-xl sm:text-2xl text-[#1E1D1A] group-hover:text-[#9C7D3E] transition-colors">
                      {artwork.title}
                    </h3>
                    <span className="text-xs font-mono text-[#8A82A5]">
                      {artwork.year}
                    </span>
                  </div>

                  <p className="text-xs text-[#2C2A26]/75 font-serif italic line-clamp-1">
                    {artwork.subtitle}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-2 text-[10px] font-mono text-[#8A82A5]">
                    <span>{artwork.materials[0]}</span>
                    <span>•</span>
                    <span className="text-[#C8A86B]">{artwork.finishes[0]}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
