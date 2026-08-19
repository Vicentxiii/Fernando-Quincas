import React, { useState } from 'react';
import { GARDEN_ZONES } from '../data/garden';
import { Artwork } from '../types';
import { ARTWORKS } from '../data/artworks';
import { Compass, Wind, Eye } from 'lucide-react';

interface GardenExperienceProps {
  onSelectArtwork: (artwork: Artwork) => void;
}

export const GardenExperience: React.FC<GardenExperienceProps> = ({ onSelectArtwork }) => {
  const [selectedZoneId, setSelectedZoneId] = useState<string>(GARDEN_ZONES[0].id);
  const activeZone = GARDEN_ZONES.find((z) => z.id === selectedZoneId) || GARDEN_ZONES[0];

  const focalArtwork = ARTWORKS.find((a) => a.id === activeZone.focalPieceId);

  return (
    <section id="garden" className="py-24 sm:py-32 bg-[#16251E] text-[#FAF8F5] relative overflow-hidden">
      {/* Botanical Background Light Glow */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#C8A86B]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#6A7D69]/20 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 relative z-10">
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#C8A86B]/30 pb-8 mb-12">
          <div>
            <span className="text-[10px] sm:text-[11px] tracking-[0.3em] text-[#C8A86B] uppercase font-mono block mb-2">
              CAPÍTULO VI • SANTUÁRIO BOTÂNICO VIVO
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#FAF8F5] font-light tracking-tight">
              O JARDIM <br />
              <span className="italic font-normal text-[#E0C995]">VIVO</span>
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-sm text-[#FAF8F5]/80 font-light leading-relaxed">
              Em Minas Gerais, o santuário botânico não é apenas um cenário para as esculturas — o próprio jardim é parte indissociável da obra de arte.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-[#C8A86B] mt-2">
              <Compass className="w-3.5 h-3.5" />
              <span>PARQUE BOTÂNICO SERRA DOS ÓRGÃOS • RJ</span>
            </div>
          </div>
        </div>

        {/* Interactive Zone Navigation Map / Botanical Sanctuary View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Interactive Garden Map & Visual Portal */}
          <div className="lg:col-span-7 relative">
            <div className="relative rounded-3xl overflow-hidden border border-[#C8A86B]/40 shadow-2xl aspect-[16/10] bg-[#0D1713] group">
              <img
                src={activeZone.image}
                alt={activeZone.name}
                className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1713]/80 via-transparent to-black/30" />

              {/* Waypoints for Zones on the Map */}
              <div className="absolute inset-0 pointer-events-auto">
                {GARDEN_ZONES.map((zone, idx) => {
                  const isCurrent = zone.id === selectedZoneId;
                  return (
                    <button
                      key={zone.id}
                      onClick={() => setSelectedZoneId(zone.id)}
                      style={{ left: `${zone.xPercent}%`, top: `${zone.yPercent}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-500 group/marker ${
                        isCurrent
                          ? 'scale-125 z-30'
                          : 'scale-90 opacity-75 hover:opacity-100 hover:scale-110 z-20'
                      }`}
                      title={zone.name}
                    >
                      <div className="relative flex items-center justify-center">
                        <div
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[11px] font-mono font-bold shadow-2xl transition-colors ${
                            isCurrent
                              ? 'bg-[#E0C995] text-[#16251E] ring-4 ring-[#FAF8F5]/30 animate-pulse'
                              : 'bg-[#FAF8F5]/80 text-[#1E1D1A] border border-[#C8A86B]'
                          }`}
                        >
                          0{idx + 1}
                        </div>
                        {/* Tooltip on Hover */}
                        <div className="absolute bottom-full mb-2 hidden sm:group-hover/marker:flex flex-col items-center pointer-events-none whitespace-nowrap">
                          <span className="glass-card px-2.5 py-1 rounded-md text-[9px] font-mono text-[#1E1D1A] shadow-lg">
                            {zone.name}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Tag inside Viewport */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-[#FAF8F5]/80">
                <span className="glass-card px-3 py-1 rounded-full text-[#1E1D1A] text-[10px]">
                  MAPA INTERATIVO DO SANTUÁRIO
                </span>
                <span className="text-[10px] text-[#E0C995]">
                  CLIQUE NOS PONTOS PARA PERCORRER
                </span>
              </div>
            </div>

            {/* Quick Zone Selector Carousel */}
            <div className="grid grid-cols-5 gap-2 mt-4">
              {GARDEN_ZONES.map((zone, idx) => (
                <button
                  key={zone.id}
                  onClick={() => setSelectedZoneId(zone.id)}
                  className={`p-2 rounded-xl text-center border transition-all text-[10px] font-mono ${
                    zone.id === selectedZoneId
                      ? 'bg-[#E0C995] text-[#16251E] border-[#E0C995] font-bold'
                      : 'bg-[#FAF8F5]/10 text-[#FAF8F5]/70 border-[#C8A86B]/20 hover:border-[#C8A86B]'
                  }`}
                >
                  ZONA 0{idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Zone Story, Flora Ecosystem & Focal Artwork Link */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-serif italic text-[#E0C995] block">
                {activeZone.frenchName}
              </span>
              <h3 className="font-serif text-2xl sm:text-4xl text-[#FAF8F5] font-light mt-1">
                {activeZone.name}
              </h3>
            </div>

            <p className="text-[#FAF8F5]/85 text-base font-light leading-relaxed">
              {activeZone.description}
            </p>

            {/* Atmospheric Details */}
            <div className="p-4 rounded-2xl bg-[#0D1713] border border-[#C8A86B]/30 space-y-3">
              <div className="flex items-center gap-2 text-[#E0C995] text-xs font-mono tracking-wider">
                <Wind className="w-3.5 h-3.5" />
                <span>ATMOSFERA & MICROCLIMA</span>
              </div>
              <p className="text-xs text-[#FAF8F5]/80 font-serif italic">
                "{activeZone.atmosphere}"
              </p>

              <div className="pt-2 border-t border-[#FAF8F5]/10">
                <span className="text-[10px] font-mono uppercase text-[#C8A86B] block mb-1.5">
                  FLORA EM HARMONIA:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeZone.flora.map((f, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-full bg-[#FAF8F5]/10 text-[#FAF8F5]/90 text-[10px] font-mono"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Focal Sculpture Spotlight Pill */}
            {focalArtwork && (
              <div className="p-4 rounded-2xl glass-card text-[#1E1D1A] border border-[#C8A86B]/40 space-y-3">
                <span className="text-[9px] font-mono tracking-widest uppercase text-[#9C7D3E] block">
                  ESCULTURA EM DESTAQUE NESTA ZONA
                </span>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-serif text-lg font-semibold text-[#1E1D1A]">
                      {focalArtwork.title}
                    </h4>
                    <span className="text-xs text-[#2C2A26]/70 font-mono">
                      {focalArtwork.materials[0]} • {focalArtwork.year}
                    </span>
                  </div>
                  <button
                    onClick={() => onSelectArtwork(focalArtwork)}
                    className="p-3 rounded-full bg-[#1E1D1A] text-white hover:bg-[#C8A86B] hover:text-[#1E1D1A] transition-colors shrink-0 shadow-md"
                    title="Examinar Escultura"
                    aria-label={`Examinar ${focalArtwork.title}`}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
