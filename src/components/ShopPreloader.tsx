import React, { useEffect, useState } from 'react';

interface ShopPreloaderProps {
  onFinish: () => void;
}

const DRAW_MS = 600;
const HOLD_MS = 500;
const EXIT_MS = 400;
const TOTAL_MS = 1500;

export const ShopPreloader: React.FC<ShopPreloaderProps> = ({ onFinish }) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const finishId = window.setTimeout(() => {
      document.body.style.overflow = '';
      onFinish();
    }, TOTAL_MS);
    const exitId = window.setTimeout(() => setExiting(true), DRAW_MS + HOLD_MS);

    return () => {
      window.clearTimeout(finishId);
      window.clearTimeout(exitId);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      aria-hidden={exiting}
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#FAF8F5] transition-opacity ease-out ${
        exiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ transitionDuration: `${EXIT_MS}ms` }}
    >
      {/* Soft ambient gold glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 55% 40% at 50% 42%, rgba(200,168,107,0.10), transparent 70%)',
        }}
      />

      <div
        className={`relative flex flex-col items-center px-8 transition-transform ease-out ${
          exiting ? 'scale-[1.04]' : 'scale-100'
        }`}
        style={{ transitionDuration: `${EXIT_MS}ms` }}
      >
        {/* Monogram inside self-drawing golden ring */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32">
          <svg viewBox="0 0 120 120" className="w-full h-full">
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="#C8A86B"
              strokeOpacity="0.18"
              strokeWidth="1"
            />
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="#C8A86B"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="fq-shop-ring"
              style={{
                transformOrigin: 'center',
                transform: 'rotate(-90deg)',
                animationDuration: `${DRAW_MS}ms`,
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="fq-shop-pulse font-display text-xl sm:text-2xl tracking-[0.22em] text-[#C8A86B] pl-[0.22em] select-none">
              FQ
            </span>
          </div>
        </div>

        {/* Wordmark */}
        <div
          className="mt-8 flex flex-col items-center gap-2 animate-preloader-fade"
          style={{ animationDelay: '350ms' }}
        >
          <span className="font-display text-[11px] sm:text-xs tracking-[0.35em] uppercase text-[#1E1D1A]/85">
            Fernando Quincas
          </span>
          <span className="font-mono text-[9px] tracking-[0.42em] uppercase text-[#C8A86B]">
            Loja &amp; Coleções
          </span>
        </div>

        {/* Transition progress line */}
        <div className="mt-8 h-px w-44 sm:w-52 bg-[#C8A86B]/15 overflow-hidden rounded-full animate-preloader-fade" style={{ animationDelay: '500ms' }}>
          <div
            className="fq-shop-line h-full bg-gradient-to-r from-[#9C7D3E] via-[#C8A86B] to-[#E0C995]"
            style={{ animationDuration: `${TOTAL_MS}ms`, boxShadow: '0 0 10px rgba(200,168,107,0.4)' }}
          />
        </div>
      </div>
    </div>
  );
};
