import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Truck, Award, HandHeart } from 'lucide-react';
import { PRODUCTS, SHOP_FILTERS, getFeaturedProduct, formatPrice } from '../data/products';
import { ProductCategory } from '../types';
import { ProductCard } from '../components/shop/ProductCard';
import { Reveal } from '../components/shop/Reveal';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

type Filter = ProductCategory | 'ALL';

export const ShopPage: React.FC = () => {
  useDocumentMeta({
    title: 'Loja — Obras Disponíveis',
    description:
      'Obras originais, esculturas, edições numeradas e objetos de arte de Fernando Quincas, disponíveis para aquisição direta do ateliê.',
  });

  const [filter, setFilter] = useState<Filter>('ALL');
  const [query, setQuery] = useState('');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const featured = getFeaturedProduct();
  const [featuredIdx, setFeaturedIdx] = useState(0);
  const [isFeaturedHovered, setIsFeaturedHovered] = useState(false);

  useEffect(() => {
    if (!featured) {
      setFeaturedIdx(0);
      return;
    }
    // Mantém fundo verde como primeira na galeria do produto, mas a hero/frontend inicia no jardim conforme pedido anterior
    const jardimIdx = featured.images.findIndex((img) => img.includes('jardim'));
    setFeaturedIdx(jardimIdx >= 0 ? jardimIdx : 0);
  }, [featured?.id]);

  const featuredImages = featured?.images ?? [];
  const featuredHasMultiple = featuredImages.length > 1;
  const goPrevFeatured = () => {
    if (!featured) return;
    setFeaturedIdx((i) => (i - 1 + featuredImages.length) % featuredImages.length);
  };
  const goNextFeatured = () => {
    if (!featured) return;
    setFeaturedIdx((i) => (i + 1) % featuredImages.length);
  };

  // Carrossel WEBGL elegante — avança a cada 2s, pausa no hover
  useEffect(() => {
    if (!featuredHasMultiple || isFeaturedHovered) return;
    const id = window.setInterval(() => {
      setFeaturedIdx((i) => (i + 1) % featuredImages.length);
    }, 2000);
    return () => window.clearInterval(id);
  }, [featuredHasMultiple, featuredImages.length, isFeaturedHovered]);

  const visibleProducts = useMemo(() => {
    let list = PRODUCTS;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((p) => {
        const cats = [p.category, ...(p.categories ?? [])].map((c) => c.toLowerCase());
        return (
          p.name.toLowerCase().includes(q) ||
          cats.some((c) => c.includes(q)) ||
          p.shortDescription.toLowerCase().includes(q)
        );
      });
    }
    if (filter !== 'ALL') {
      list = list.filter((p) => p.category === filter || (p.categories?.includes(filter) ?? false));
    }
    return list;
  }, [filter, query]);

  const availableCount = PRODUCTS.filter((p) => p.status === 'AVAILABLE').length;

  const applyFilter = (f: Filter) => {
    setFilter(f);
    setIsFilterSheetOpen(false);
  };

  const activeFilterLabel = SHOP_FILTERS.find((f) => f.id === filter)?.label ?? 'Todas';

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E1D1A]">
      {/* ───────────────────────── Editorial Hero ───────────────────────── */}
      <section className="relative pt-36 sm:pt-44 pb-14 sm:pb-20 px-6 sm:px-8 md:px-12 overflow-hidden">
        <div className="absolute top-10 -left-24 w-96 h-96 bg-[#C8A86B]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7 space-y-7">
            <Reveal>
              <span className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] uppercase text-[#C8A86B]">
                <span className="w-8 h-px bg-[#C8A86B]/60" />
                Ateliê • Acervo • Aquisição
              </span>
            </Reveal>

            <Reveal delay={120}>
              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-medium tracking-tight leading-[0.95]">
                LOJA
                <span className="block mt-2 font-serif italic font-light text-2xl sm:text-3xl md:text-4xl text-[#9C7D3E] tracking-normal">
                  obras disponíveis
                </span>
              </h1>
            </Reveal>

            <Reveal delay={220}>
              <p className="font-serif italic text-lg sm:text-xl text-[#8A82A5] max-w-xl leading-relaxed">
                Esculturas, edições numeradas e objetos nascidos no ateliê — cada peça carrega a
                assinatura, o certificado e o silêncio da serra.
              </p>
            </Reveal>

            <Reveal delay={320}>
              <div className="flex items-center gap-4 text-xs font-mono text-[#2C2A26]/70 pt-2">
                <span>{PRODUCTS.length} obras catalogadas</span>
                <span className="w-8 h-px bg-[#C8A86B]/40" />
                <span>{availableCount} disponíveis</span>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={260}>
              <Link
                to={featured ? `/loja/${featured.slug}` : '/loja'}
                className="group block relative rounded-3xl overflow-hidden border border-[#C8A86B]/25 aspect-[4/5] max-h-[520px] w-full gold-border-glow"
                aria-label="Conhecer a obra em destaque"
              >
                <img
                  src={
                    (featuredImages.find((img) => img.includes('jardim')) ?? featured?.images[0]) ??
                    'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=85'
                  }
                  alt={featured ? featured.name : 'Obra em destaque'}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#16251E]/75 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                  <div>
                    <span className="text-[9px] font-mono tracking-[0.28em] uppercase text-[#E0C995] block mb-1">
                      Obra em Destaque
                    </span>
                    <span className="font-serif text-lg text-[#FAF8F5] leading-snug block">
                      {featured?.name ?? 'Voo Botânico'}
                    </span>
                  </div>
                  <span className="w-10 h-10 shrink-0 rounded-full border border-[#E0C995]/60 flex items-center justify-center text-[#E0C995] group-hover:bg-[#C8A86B] group-hover:text-[#16251E] group-hover:border-[#C8A86B] transition-colors duration-300">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─────────────────────── Featured Exhibition ─────────────────────── */}
      {featured && (
        <section className="relative bg-[#16251E] text-[#FAF8F5] py-20 sm:py-28 px-6 sm:px-8 md:px-12 overflow-hidden">
          <div className="absolute -top-32 right-0 w-[500px] h-[500px] bg-[#C8A86B]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 order-2 lg:order-1">
              <Reveal>
                <div
                  className="relative rounded-3xl overflow-hidden border border-[#E0C995]/25 aspect-[16/11] group bg-[#0F1B15]"
                  onMouseEnter={() => setIsFeaturedHovered(true)}
                  onMouseLeave={() => setIsFeaturedHovered(false)}
                >
                  {/* WEBGL elegante — crossfade + zoom + blur/displace a cada 2s */}
                  <div className="absolute inset-0">
                    {featuredImages.map((img, i) => (
                      <img
                        key={img}
                        src={img}
                        alt={featured.name}
                        loading={i === featuredIdx ? 'eager' : 'lazy'}
                        decoding="async"
                        className={`absolute inset-0 w-full h-full object-cover will-change-transform transition-all duration-[1200ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
                          i === featuredIdx
                            ? 'opacity-100 scale-100 blur-0 brightness-100'
                            : 'opacity-0 scale-[1.08] blur-[6px] brightness-110'
                        }`}
                        style={{
                          filter: i === featuredIdx ? 'blur(0px) brightness(1)' : 'blur(6px) brightness(1.1)',
                        }}
                      />
                    ))}
                    {/* Véu WEBGL sutil — gradiente animado que simula displacement */}
                    <div className="pointer-events-none absolute inset-0 opacity-30 mix-blend-soft-light bg-gradient-to-br from-[#C8A86B]/20 via-transparent to-[#1E3A68]/20 transition-opacity duration-[1200ms]" />
                  </div>
                  {/* Setas ao lado da foto principal — navega sem entrar na página */}
                  {featuredHasMultiple && (
                    <>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          goPrevFeatured();
                        }}
                        aria-label="Imagem anterior da obra em destaque"
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#16251E]/60 backdrop-blur-md border border-[#E0C995]/40 text-[#FAF8F5] flex items-center justify-center hover:bg-[#C8A86B] hover:text-[#16251E] hover:border-[#C8A86B] transition-colors duration-200"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          goNextFeatured();
                        }}
                        aria-label="Próxima imagem da obra em destaque"
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#16251E]/60 backdrop-blur-md border border-[#E0C995]/40 text-[#FAF8F5] flex items-center justify-center hover:bg-[#C8A86B] hover:text-[#16251E] hover:border-[#C8A86B] transition-colors duration-200"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#16251E]/55 backdrop-blur-md border border-[#E0C995]/20">
                        {featuredImages.map((_, i) => (
                          <button
                            key={i}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setFeaturedIdx(i);
                            }}
                            aria-label={`Ir para imagem ${i + 1}`}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${i === featuredIdx ? 'bg-[#E0C995] w-4' : 'bg-[#FAF8F5]/60 hover:bg-[#FAF8F5]'}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-5 order-1 lg:order-2 space-y-6">
              <Reveal>
                <span className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] uppercase text-[#E0C995]">
                  <span className="w-8 h-px bg-[#C8A86B]/60" />
                  Obra em Destaque
                </span>
              </Reveal>
              <Reveal delay={100}>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light leading-tight">
                  {featured.name}
                </h2>
              </Reveal>
              <Reveal delay={180}>
                <p className="font-serif italic text-base sm:text-lg text-[#E0C995]/90 leading-relaxed">
                  {featured.shortDescription}
                </p>
              </Reveal>
              <Reveal delay={240}>
                <p className="text-sm font-light text-[#FAF8F5]/70 leading-relaxed line-clamp-3">
                  {featured.description[0]}
                </p>
              </Reveal>
              <Reveal delay={300}>
                <div className="flex flex-wrap items-center gap-6 pt-2">
                  <Link
                    to={`/loja/${featured.slug}`}
                    className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-[#C8A86B]/50 text-[11px] font-mono tracking-[0.22em] uppercase text-[#FAF8F5] hover:bg-[#C8A86B] hover:text-[#16251E] hover:border-[#C8A86B] transition-colors duration-300"
                  >
                    Conhecer a Obra
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                  <span className="font-mono text-sm text-[#E0C995]">{formatPrice(featured.price)}</span>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* ───────────────────────── Catalog ───────────────────────── */}
      <section id="catalogo" className="py-20 sm:py-28 px-6 sm:px-8 md:px-12">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Section header + controls */}
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#C8A86B]/25 pb-8">
              <div>
                <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#C8A86B] block mb-2">
                  Catálogo do Ateliê
                </span>
                <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-tight">
                  O ACERVO &{' '}
                  <span className="italic text-[#9C7D3E]">EDIÇÕES</span>
                </h2>
              </div>

              {/* Search */}
              <label className="relative block w-full md:w-72">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C8A86B]" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar uma obra..."
                  aria-label="Buscar uma obra"
                  className="w-full pl-11 pr-9 py-3 rounded-full bg-[#FDFCFB] border border-[#C8A86B]/30 text-sm placeholder:text-[#8A82A5]/80 focus:outline-none focus:border-[#C8A86B] focus:ring-1 focus:ring-[#C8A86B]/40 transition-all"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    aria-label="Limpar busca"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#8A82A5] hover:text-[#1E1D1A] transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </label>
            </div>
          </Reveal>

          {/* Desktop filters / Mobile filter button */}
          <div className="flex items-center justify-between gap-4">
            <div className="hidden md:flex flex-wrap items-center gap-2.5">
              {SHOP_FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => applyFilter(f.id)}
                  className={`px-4 py-2 rounded-full text-[10px] font-mono tracking-[0.18em] uppercase border transition-colors duration-300 ${
                    filter === f.id
                      ? 'bg-[#1E1D1A] text-[#FAF8F5] border-[#1E1D1A]'
                      : 'bg-transparent text-[#2C2A26]/75 border-[#C8A86B]/35 hover:border-[#C8A86B] hover:text-[#9C7D3E]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsFilterSheetOpen(true)}
              className="md:hidden inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#C8A86B]/40 text-[10px] font-mono tracking-[0.2em] uppercase"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#C8A86B]" />
              Filtrar · {activeFilterLabel}
            </button>

            <span className="hidden md:block text-xs font-mono text-[#8A82A5]">
              {visibleProducts.length} {visibleProducts.length === 1 ? 'obra' : 'obras'}
            </span>
          </div>

          {/* Grid */}
          {visibleProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
              {visibleProducts.map((product, i) => (
                <Reveal key={product.id} delay={(i % 3) * 90}>
                  <ProductCard product={product} eager={i < 3} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center space-y-4">
              <p className="font-serif italic text-2xl text-[#8A82A5]">Nenhuma obra encontrada.</p>
              <button
                onClick={() => {
                  setQuery('');
                  setFilter('ALL');
                }}
                className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#C8A86B] hover:text-[#9C7D3E] underline underline-offset-4 decoration-[#C8A86B]/40 transition-colors"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ───────────────────── Atelier assurances strip ───────────────────── */}
      <section className="border-t border-[#C8A86B]/25 py-16 px-6 sm:px-8 md:px-12 bg-[#FDFCFB]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-10">
          {[
            { icon: Award, title: 'Certificado', text: 'Toda peça acompanha certificado assinado pelo artista.' },
            { icon: Truck, title: 'Envio Especializado', text: 'Logística segura com embalagem de museu e seguro.' },
            { icon: ShieldCheck, title: 'Autenticidade', text: 'Edições numeradas e obras únicas documentadas.' },
            { icon: HandHeart, title: 'Atendimento Direto', text: 'Aquisição conduzida pessoalmente pelo ateliê.' },
          ].map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 80}>
              <div className="space-y-3">
                <Icon className="w-5 h-5 text-[#C8A86B]" strokeWidth={1.5} />
                <h3 className="font-display text-xs tracking-[0.2em] uppercase">{title}</h3>
                <p className="text-xs font-light text-[#2C2A26]/75 leading-relaxed">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────────── Mobile filter bottom sheet ───────────────── */}
      {isFilterSheetOpen && (
        <div className="fixed inset-0 z-[65] md:hidden" role="dialog" aria-modal="true" aria-label="Filtrar obras">
          <button
            aria-label="Fechar filtros"
            onClick={() => setIsFilterSheetOpen(false)}
            className="absolute inset-0 bg-[#16251E]/45 backdrop-blur-sm animate-fadeInSoft"
          />
          <div className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-[#FAF8F5] border-t border-[#C8A86B]/30 px-6 pt-5 pb-8 animate-sheetUp">
            <div className="flex items-center justify-between pb-4 border-b border-[#C8A86B]/20">
              <h3 className="font-serif text-xl">Filtrar Obras</h3>
              <button
                onClick={() => setIsFilterSheetOpen(false)}
                aria-label="Fechar"
                className="p-2 rounded-full border border-[#C8A86B]/30"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <ul className="py-4 space-y-1">
              {SHOP_FILTERS.map((f) => (
                <li key={f.id}>
                  <button
                    onClick={() => applyFilter(f.id)}
                    className={`w-full flex items-center justify-between py-3.5 px-2 rounded-xl text-left transition-colors ${
                      filter === f.id ? 'bg-[#C8A86B]/10' : 'hover:bg-[#C8A86B]/5'
                    }`}
                  >
                    <span className="font-serif text-lg">{f.label}</span>
                    {filter === f.id && <span className="w-2 h-2 rounded-full bg-[#C8A86B]" />}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
