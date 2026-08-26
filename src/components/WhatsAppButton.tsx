import React from 'react';

const WHATSAPP_URL = 'https://wa.me/5511975855263';
const WHATSAPP_LABEL = 'Falar com Fernando no WhatsApp';

export const WhatsAppButton: React.FC = () => {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={WHATSAPP_LABEL}
      title={WHATSAPP_LABEL}
      className="group fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[70] flex items-center justify-center w-[46px] h-[46px] sm:w-[50px] sm:h-[50px] rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.16),0_2px_6px_rgba(0,0,0,0.12)] hover:scale-[1.05] hover:shadow-[0_10px_28px_rgba(0,0,0,0.20)] active:scale-[0.97] transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF8F5]"
    >
      {/* Pulse ring - sutil */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-[#25D366] opacity-[0.14] animate-[whatsapp-pulse_2.8s_cubic-bezier(0.4,0,0.6,1)_infinite]"
      />
      {/* Tooltip - desktop only, à esquerda do botão no canto direito */}
      <span className="pointer-events-none absolute right-[calc(100%+12px)] top-1/2 -translate-y-1/2 hidden sm:flex items-center whitespace-nowrap rounded-full bg-[#1E1D1A] px-3.5 py-2 text-[10px] font-sans font-semibold tracking-[0.14em] uppercase text-white shadow-lg opacity-0 translate-x-[6px] group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0 transition-all duration-300">
        Fale com o Fernando
        <span className="absolute right-0 top-1/2 translate-x-[4px] -translate-y-1/2 w-2 h-2 bg-[#1E1D1A] rotate-45" aria-hidden="true" />
      </span>

      {/* Ícone em public/whatsapp.png */}
      <img
        src="/whatsapp.png"
        alt="WhatsApp"
        width={50}
        height={50}
        draggable={false}
        className="relative z-10 w-full h-full object-cover rounded-full"
      />
    </a>
  );
};
