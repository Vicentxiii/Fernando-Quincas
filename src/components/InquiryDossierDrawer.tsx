import React from 'react';
import { Artwork } from '../types';
import { ARTWORKS } from '../data/artworks';
import { X, Trash2, Bookmark, Send } from 'lucide-react';

interface InquiryDossierDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedArtworkIds: string[];
  onRemoveArtwork: (id: string) => void;
  onSelectArtwork: (artwork: Artwork) => void;
  onProceedToInquiry: () => void;
}

export const InquiryDossierDrawer: React.FC<InquiryDossierDrawerProps> = ({
  isOpen,
  onClose,
  savedArtworkIds,
  onRemoveArtwork,
  onSelectArtwork,
  onProceedToInquiry,
}) => {
  if (!isOpen) return null;

  const savedArtworks = ARTWORKS.filter((a) => savedArtworkIds.includes(a.id));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-[#FAF8F5] text-[#1E1D1A] h-full shadow-2xl flex flex-col justify-between border-l border-[#C8A86B]/30 animate-slideInRight">
        {/* Drawer Header */}
        <div className="p-6 sm:p-8 border-b border-[#C8A86B]/25 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1E1D1A] text-[#E0C995] flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl text-[#1E1D1A]">
                Dossiê Privado de Curadoria
              </h3>
              <span className="text-[10px] font-mono text-[#8A82A5] tracking-widest uppercase">
                {savedArtworks.length} {savedArtworks.length === 1 ? 'OBRA SELECIONADA' : 'OBRAS SELECIONADAS'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full border border-[#C8A86B]/30 hover:bg-[#1E1D1A] hover:text-white transition-colors"
            aria-label="Fechar dossiê"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer List */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-4">
          {savedArtworks.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <div className="w-12 h-12 rounded-full border border-[#C8A86B]/40 flex items-center justify-center mx-auto text-[#C8A86B]">
                <Bookmark className="w-6 h-6" />
              </div>
              <p className="text-sm font-serif italic text-[#8A82A5]">
                Seu dossiê privado está vazio no momento.
              </p>
              <p className="text-xs text-[#2C2A26]/70 max-w-xs mx-auto font-light leading-relaxed">
                Clique no ícone de marcador nas obras para reuni-las aqui e solicitar uma consulta unificada.
              </p>
            </div>
          ) : (
            savedArtworks.map((art) => (
              <div
                key={art.id}
                className="p-4 rounded-2xl bg-[#FAF6EE] border border-[#C8A86B]/25 flex items-center gap-4 hover:border-[#C8A86B] transition-colors"
              >
                <div
                  className="w-20 h-20 rounded-xl overflow-hidden bg-[#EAE5D8] shrink-0 cursor-pointer"
                  onClick={() => {
                    onClose();
                    onSelectArtwork(art);
                  }}
                >
                  <img src={art.image} alt={art.title} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-mono text-[#C8A86B] uppercase block">
                    {art.category} • {art.year}
                  </span>
                  <h4
                    className="font-serif text-base font-semibold text-[#1E1D1A] truncate cursor-pointer hover:text-[#C8A86B] transition-colors"
                    onClick={() => {
                      onClose();
                      onSelectArtwork(art);
                    }}
                  >
                    {art.title}
                  </h4>
                  <span className="text-xs text-[#8A82A5] font-mono block">
                    {art.dimensions}
                  </span>
                </div>

                <button
                  onClick={() => onRemoveArtwork(art.id)}
                  className="p-2 text-[#8A82A5] hover:text-[#6B1D2F] transition-colors shrink-0"
                  title="Remover do dossiê"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer Actions */}
        {savedArtworks.length > 0 && (
          <div className="p-6 sm:p-8 border-t border-[#C8A86B]/25 space-y-3 bg-[#FAF8F5]">
            <button
              onClick={() => {
                onClose();
                onProceedToInquiry();
              }}
              className="w-full py-4 rounded-full bg-[#1E1D1A] text-[#FAF8F5] hover:bg-[#C8A86B] hover:text-[#1E1D1A] transition-all text-xs font-semibold tracking-widest uppercase flex items-center justify-center gap-2 shadow-xl"
            >
              <Send className="w-4 h-4" />
              <span>ENVIAR CONSULTA DO DOSSIÊ</span>
            </button>
            <p className="text-[10px] text-center text-[#8A82A5] font-mono">
              O ateliê preparará o material detalhado de todas as {savedArtworks.length} obras selecionadas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
