import React, { useEffect, useRef, useState } from 'react';

interface PreloaderProps {
  onComplete: () => void;
}

const LOGO_SRC = '/Logo%20PNG%20Branco%20-%20By%20Fernando%20Quincas.png';
const LOAD_DURATION = 2400;
const HOLD_MS = 500;
const EXIT_MS = 950;

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    let rafId = 0;
    const timers: number[] = [];
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / LOAD_DURATION);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));
      if (t < 1) {
        rafId = requestAnimationFrame(tick);
        return;
      }
      timers.push(
        window.setTimeout(() => setExiting(true), HOLD_MS),
        window.setTimeout(() => {
          document.body.style.overflow = '';
          completeRef.current();
        }, HOLD_MS + EXIT_MS)
      );
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      timers.forEach((id) => window.clearTimeout(id));
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div
      aria-hidden={exiting}
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#0D1713] transition-opacity ease-out ${
        exiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ transitionDuration: `${EXIT_MS}ms` }}
    >
      {/* Ambient botanical depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 65% 45% at 50% 40%, rgba(200,168,107,0.09), transparent 70%), radial-gradient(ellipse 90% 70% at 50% 110%, rgba(22,37,30,0.9), transparent 60%)',
        }}
      />

      <div
        className={`relative flex flex-col items-center px-8 transition-transform ease-out ${
          exiting ? 'scale-[1.04]' : 'scale-100'
        }`}
        style={{ transitionDuration: `${EXIT_MS}ms` }}
      >
        {/* Logo */}
        <img
          src={LOGO_SRC}
          alt="Fernando Quincas — Escultor & Mestre Artesão"
          draggable={false}
          className="animate-preloader-logo w-52 sm:w-64 md:w-72 h-auto select-none"
        />

        {/* Loading bar */}
        <div className="mt-14 flex flex-col items-center gap-5 animate-preloader-fade" style={{ animationDelay: '600ms' }}>
          <div className="relative w-48 sm:w-60 h-px bg-white/10">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#9C7D3E] via-[#C8A86B] to-[#E0C995]"
              style={{ width: `${progress}%`, boxShadow: '0 0 12px rgba(200,168,107,0.45)' }}
            />
          </div>

          {/* Minimalist counter */}
          <span className="font-mono text-[11px] tracking-[0.45em] text-[#E0C995]/75 tabular-nums pl-[0.45em]">
            {String(progress).padStart(3, '0')}
          </span>
        </div>
      </div>
    </div>
  );
};
