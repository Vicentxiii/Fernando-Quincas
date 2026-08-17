import React, { useState } from 'react';
import { Artwork } from '../types';
import { X, Bookmark, Check, ArrowRight } from 'lucide-react';

interface ArtworkModalProps {
  artwork: Artwork | null;
  onClose: () => void;
  onInquire: (artwork) => void;
  onToggleSave: (artworkId: string) => void;
  isSaved: boolean;
}

export const ArtworkModal: React.FC<ArtworkModalProps> = ({
  artwork,
  onClose,
  onInquire,
  onToggleSave,
  isSaved,
}) => {
  if (!artwork) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const allImages = [artwork.image, ...artwork.secondaryImages];

  const availabilityLabels: Record<string, string> = {
    AVAILABLE: 'DISPONÍVEL',
    LIMITED_EDITION: 'EDIÇÃO LIMITADA',
    PRIVATE_COLLECTION: 'COLEÇÃO PRIVADA',
    COMMISSIONED: 'OBRA ENCOMENDADA',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-6xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#FAF8F5] text-[#1E1D1A] border border-[#C8A86B]/40 shadow-2xl p-6 sm:p-10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2.5 rounded-full border border-[#C8A86B]/30 hover:bg-[#1E1D1A] hover:text-white transition-colors z-20 bg-[#FAF8F5]"
          aria-label="Fechar detalhes da obra"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="border-b border-[#C8A86B]/20 pb-6 mb-8 pr-12">
          <div className="flex items-center gap-3 text-[10px] font-mono tracking-widest text-[#C8A86B] uppercase mb-1">
            <span>{artwork.category}</span>
            <span>•</span>
            <span>ANO {artwork.year}</span>
            <span>•</span>
            <span>{artwork.edition || availabilityLabels[artwork.availability] || artwork.availability}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#1E1D1A] font-light">
            {artwork.title}
          </h2>
          {artwork.frenchTitle && (
            <span className="text-sm font-serif italic text-[#8A82A5] block mt-1">
              {artwork.frenchTitle}
            </span>
          )}
        </div>

        {/* Modal Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Gallery Viewer */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-2xl overflow-hidden border border-[#C8A86B]/30 aspect-[4/3] bg-[#EAE5D8] shadow-lg relative">
              <img
                src={allImages[activeImageIndex]}
                alt={artwork.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 glass-card px-3 py-1 rounded-full text-[9px] font-mono text-[#1E1D1A]">
                PERSPECTIVA 0{activeImageIndex + 1} DE 0{allImages.length}
              </div>
            </div>

            {/* Thumbnail Selectors */}
            {allImages.length > 1 && (
              <div className="flex gap-3">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImageIndex === i ? 'border-[#C8A86B] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Miniatura" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Curatorial Notes & Inspiration */}
            <div className="p-6 rounded-2xl bg-[#FAF6EE] border border-[#C8A86B]/20 space-y-3">
              <span className="text-[10px] font-mono uppercase text-[#C8A86B] tracking-widest block">
                TEXTO CURATORIAL
              </span>
              <p className="text-xs sm:text-sm text-[#2C2A26]/85 font-serif italic leading-relaxed">
                "{artwork.curatorNotes}"
              </p>
              <div className="text-[11px] font-mono text-[#8A82A5] pt-2 border-t border-[#C8A86B]/15">
                <strong>Inspiração:</strong> {artwork.inspiration}
              </div>
            </div>
          </div>

          {/* Right: Technical Sheet & Acquisition */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-[#9C7D3E] mb-2">
                DESCRIÇÃO DA OBRA
              </h4>
              <p className="text-sm text-[#1E1D1A]/85 font-light leading-relaxed">
                {artwork.description}
              </p>
            </div>

            {/* Specifications Matrix */}
            <div className="p-4 rounded-2xl bg-[#FAF6EE] border border-[#C8A86B]/25 space-y-3 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-[#C8A86B]/15">
                <span className="text-[#8A82A5]">Dimensões</span>
                <span className="font-semibold text-[#1E1D1A]">{artwork.dimensions}</span>
              </div>
              {artwork.weight && (
                <div className="flex justify-between py-1 border-b border-[#C8A86B]/15">
                  <span className="text-[#8A82A5]">Peso Estimado</span>
                  <span className="font-semibold text-[#1E1D1A]">{artwork.weight}</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-[#C8A86B]/15">
                <span className="text-[#8A82A5]">Materiais Principais</span>
                <span className="font-semibold text-[#1E1D1A] text-right">{artwork.materials.join(', ')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#C8A86B]/15">
                <span className="text-[#8A82A5]">Acabamentos Nobres</span>
                <span className="font-semibold text-[#C8A86B] text-right">{artwork.finishes.join(', ')}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#8A82A5]">Disponibilidade</span>
                <span className="font-semibold text-[#6B1D2F]">{availabilityLabels[artwork.availability] || artwork.availability}</span>
              </div>
            </div>

            {/* Color Palette Harmonization */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#9C7D3E] block mb-2">
                HARMONIA CROMÁTICA
              </span>
              <div className="flex flex-wrap gap-2">
                {artwork.colorPalette.map((color, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF6EE] border border-[#C8A86B]/20 text-[10px] font-mono">
                    <span className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: color.hex }} />
                    <span>{color.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions: Inquire & Dossier */}
            <div className="space-y-3 pt-4 border-t border-[#C8A86B]/20">
              <button
                onClick={() => {
                  onClose();
                  onInquire(artwork);
                }}
                className="w-full py-4 rounded-full bg-[#1E1D1A] text-[#FAF8F5] hover:bg-[#C8A86B] hover:text-[#1E1D1A] transition-all text-xs font-semibold tracking-widest uppercase flex items-center justify-center gap-2 shadow-xl"
              >
                <span>SOLICITAR DOSSIÊ / AQUISIÇÃO</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onToggleSave(artwork.id)}
                className={`w-full py-3 rounded-full border text-xs font-mono tracking-wider flex items-center justify-center gap-2 transition-colors ${
                  isSaved
                    ? 'bg-[#6B1D2F] text-white border-[#6B1D2F]'
                    : 'border-[#C8A86B]/40 hover:bg-[#C8A86B]/10 text-[#1E1D1A]'
                }`}
              >
                {isSaved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                <span>{isSaved ? 'SALVA NO DOSSIÊ PRIVADO' : 'ADICIONAR AO DOSSIÊ PRIVADO'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
