"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

const Skiper52 = () => {
  const images = [
    {
      src: "/images/x.com/13.jpeg",
      alt: "Illustrations by my fav AarzooAly",
      code: "# 23",
    },
    {
      src: "/images/x.com/32.jpeg",
      alt: "Illustrations by my fav AarzooAly",
      code: "# 23",
    },
    {
      src: "/images/x.com/20.jpeg",
      alt: "Illustrations by my fav AarzooAly",
      code: "# 23",
    },
    {
      src: "/images/x.com/21.jpeg",
      alt: "Illustrations by my fav AarzooAly",
      code: "# 23",
    },
    {
      src: "/images/x.com/19.jpeg",
      alt: "Illustrations by my fav AarzooAly",
      code: "# 23",
    },
    {
      src: "/images/x.com/1.jpeg",
      alt: "Illustrations by my fav AarzooAly",
      code: "# 23",
    },
    {
      src: "/images/x.com/2.jpeg",
      alt: "Illustrations by my fav AarzooAly",
      code: "# 23",
    },
    {
      src: "/images/x.com/3.jpeg",
      alt: "Illustrations by my fav AarzooAly",
      code: "# 23",
    },
    {
      src: "/images/x.com/4.jpeg",
      alt: "Illustrations by my fav AarzooAly",
      code: "# 23",
    },
  ];

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-[#f5f4f3]">
      <HoverExpand_001 className="" images={images} />{" "}
    </div>
  );
};

export { Skiper52 };

const HoverExpand_001 = ({
  images,
  className,
}: {
  images: { src: string; alt: string; code: string; caption?: string }[];
  className?: string;
}) => {
  const [activeImage, setActiveImage] = useState<number | null>(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // apenas troca o ativo — sem scroll automático
  const handleSelect = (index: number) => {
    setActiveImage(index);
  };

  const scrollBy = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = dir === 'left' ? -340 : 340;
    scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 12 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className={cn("relative w-full", className)}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        {/* wrapper com setas — scroll manual, sem auto */}
        <div className="relative">
          {/* seta esquerda */}
          <button
            onClick={() => scrollBy('left')}
            aria-label="Ver fotos anteriores"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 -ml-1 sm:ml-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-[#C8A86B]/25 flex items-center justify-center text-[#1E1D1A] hover:bg-[#1E1D1A] hover:text-white hover:border-[#1E1D1A] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          {/* seta direita */}
          <button
            onClick={() => scrollBy('right')}
            aria-label="Ver próximas fotos"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 -mr-1 sm:mr-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-[#C8A86B]/25 flex items-center justify-center text-[#1E1D1A] hover:bg-[#1E1D1A] hover:text-white hover:border-[#1E1D1A] transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* faixa skiper52 — sem scrollbar visível, sem auto scroll */}
          <div
            ref={scrollRef}
            className="flex w-full items-center gap-1 overflow-x-auto overflow-y-hidden py-2 px-10 sm:px-12 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth"
          >
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="relative shrink-0 cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl border border-[#C8A86B]/15"
              initial={{ width: "4rem", height: "22rem" }}
              animate={{
                width: activeImage === index ? "28rem" : "5.5rem",
                height: activeImage === index ? "26rem" : "22rem",
              }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              onClick={() => handleSelect(index)}
              onHoverStart={() => handleSelect(index)}
            >
                <AnimatePresence>
                  {activeImage === index && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"
                    />
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {activeImage === index && (
                    <motion.div
                      initial={{ opacity: 0, translateY: 6 }}
                      animate={{ opacity: 1, translateY: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-x-0 bottom-0 flex flex-col items-start justify-end p-3 sm:p-4"
                    >
                      <p className="text-[10px] font-mono tracking-widest text-white/60">
                        {image.code} • {(index + 1).toString().padStart(2, '0')}/{images.length.toString().padStart(2, '0')}
                      </p>
                      {(image.caption || image.alt) && (
                        <p className="text-[11px] sm:text-xs font-serif italic text-white/95 leading-snug line-clamp-2">
                          {image.caption || image.alt}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                <img
                  src={image.src}
                  className="size-full object-cover"
                  alt={image.alt}
                  loading={index < 3 ? 'eager' : 'lazy'}
                  decoding="async"
                  draggable={false}
                />
              </motion.div>
            ))}
          </div>
        </div>
        <p className="text-center text-[10px] font-mono tracking-widest text-[#8A82A5]/70 mt-2">
          Passe o mouse ou toque para expandir • Use as setas ao lado para navegar • {images.length} fotos em WEBP
        </p>
      </motion.div>
    </motion.div>
  );
};

export { HoverExpand_001 };

/**
 * Skiper 52 HoverExpand_001 — React + Framer Motion
 * Illustrations by AarzooAly - https://x.com/AarzooAly
 *
 * License & Usage:
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * - No attribution required with Skiper UI Pro.
 *
 * Feedback and contributions are welcome.
 *
 * Author: @gurvinder-singh02
 * Website: https://gxuri.me
 * Twitter: https://x.com/Gur__vi
 */
