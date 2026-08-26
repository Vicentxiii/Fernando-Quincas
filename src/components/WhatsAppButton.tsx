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
      className="group fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[70] flex items-center justify-center w-[46px] h-[46px] sm:w-[50px] sm:h-[50px] rounded-full bg-[#25D366] text-white shadow-[0_8px_20px_rgba(0,0,0,0.14),0_2px_6px_rgba(0,0,0,0.10)] ring-1 ring-white/20 hover:bg-[#20bd5a] hover:scale-[1.05] hover:shadow-[0_10px_28px_rgba(0,0,0,0.18)] active:scale-[0.97] transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF8F5]"
    >
      {/* Pulse ring - mais sutil e elegante */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-[#25D366] opacity-[0.14] animate-[whatsapp-pulse_2.8s_cubic-bezier(0.4,0,0.6,1)_infinite]"
      />
      {/* Tooltip - desktop only, à esquerda do botão no canto direito */}
      <span className="pointer-events-none absolute right-[calc(100%+12px)] top-1/2 -translate-y-1/2 hidden sm:flex items-center whitespace-nowrap rounded-full bg-[#1E1D1A] px-3.5 py-2 text-[10px] font-sans font-semibold tracking-[0.14em] uppercase text-white shadow-lg opacity-0 translate-x-[6px] group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0 transition-all duration-300">
        Fale com o Fernando
        <span className="absolute right-0 top-1/2 translate-x-[4px] -translate-y-1/2 w-2 h-2 bg-[#1E1D1A] rotate-45" aria-hidden="true" />
      </span>

      {/* WhatsApp SVG - versão minimalista e elegante (outline luxo) */}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="relative z-10 w-[18px] h-[18px] sm:w-[19px] sm:h-[19px]"
      >
        {/* balão */}
        <path d="M12.04 2.5c-5.05 0-9.14 3.74-9.14 8.36 0 1.58.48 3.06 1.32 4.32L3 21l6.07-1.55a9.2 9.2 0 0 0 2.97.5c5.05 0 9.14-3.74 9.14-8.36 0-4.62-4.09-8.36-9.14-8.36Z" />
        {/* telefone estilizado minimalista */}
        <path
          d="M9.4 11.1c.25.72 1.46 2.23 3.12 2.98.42.19.75.26 1.02.33.54.13.95.05 1.23-.2.17-.15.42-.45.54-.7.08-.17.08-.32.02-.45-.06-.13-.3-.32-.52-.45l-.52-.31c-.14-.08-.3-.06-.42.06l-.6.64c-.09.09-.2.1-.32.04-1.03-.5-1.7-1-2.25-1.94-.07-.12-.05-.24.04-.34l.52-.58c.11-.12.13-.27.06-.4l-.29-.6c-.13-.26-.28-.44-.42-.52-.13-.08-.28-.08-.42-.02l-.5.22c-.2.09-.36.31-.4.57-.04.26.02.66.19 1.05.1.23.24.48.44.77Z"
          fill="currentColor"
          stroke="none"
        />
      </svg>
    </a>
  );
};
