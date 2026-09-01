import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Sparkles, Clock, ArrowUpRight, BookOpen } from 'lucide-react';
import { BLOG_CATEGORIES, BLOG_CATEGORY_LABELS, BLOG_POSTS } from '../data/blog';
import { BlogCategory } from '../types';
import { BlogCard } from '../components/blog/BlogCard';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

type CategoryFilter = BlogCategory | 'ALL';

export const BlogIndexPage: React.FC = () => {
  useDocumentMeta({
    title: 'Blog do Atelier — Bastidores e Obras',
    description: 'Blog do Atelier de Fernando Quincas, mestre artesão em fibra de vidro: bastidores de esculturas monumentais, fontes, vasos e histórias do atelier em Minas Gerais.',
    canonical: 'https://fernandoquincas.com.br/blog',
    type: 'website',
    keywords: 'Fernando Quincas, blog, esculturas monumentais, fibra de vidro, atelier',
  });
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('ALL');

  const featuredPost = BLOG_POSTS.find((p) => p.featured) || BLOG_POSTS[0];
  const filteredPosts = useMemo(
    () =>
      activeCategory === 'ALL'
        ? BLOG_POSTS
        : BLOG_POSTS.filter((p) => p.category === activeCategory),
    [activeCategory]
  );
  const listPosts = filteredPosts.filter((p) => p.id !== featuredPost.id);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E1D1A]">
      {/* Blog Editorial Hero */}
      <section className="relative pt-36 sm:pt-44 pb-16 sm:pb-20 px-4 sm:px-6 md:px-12 bg-[#16251E] text-[#FAF8F5] overflow-hidden">
        {/* Foto elegante ao fundo — Fernando esculpindo a Galinha — 30% opacidade, grande no canto direito, sem corte visível */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[78%] sm:w-[68%] lg:w-[58%] overflow-hidden">
          <img
            src="/products/galinha-monte-verde-processo-atelier.jpeg"
            alt=""
            aria-hidden="true"
            loading="eager"
            decoding="async"
            className="h-full w-full object-cover object-[center_30%] opacity-30 scale-[1.08]"
          />
          {/* Degradês para esconder cortes e fundir com o fundo — elegante */}
          <div className="absolute inset-0 bg-gradient-to-l from-[#16251E]/10 via-[#16251E]/35 to-[#16251E]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#16251E] via-[#16251E]/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#16251E] via-transparent to-transparent opacity-60" />
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C8A86B]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1E3A68]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#C8A86B]/40 bg-[#FAF8F5]/5 text-[#C8A86B] text-[10px] tracking-[0.25em] font-mono uppercase">
            <Newspaper className="w-3 h-3" />
            <span>DIÁRIO DO ATELIÊ</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
            Blog do Escultor
            <span className="block font-light text-[#E0C995] text-2xl sm:text-3xl md:text-4xl mt-1">— Fernando Quincas</span>
          </h1>
          <p className="font-serif italic text-lg sm:text-xl text-[#E0C995] max-w-2xl leading-relaxed">
            Ensaios, bastidores e memórias do ateliê: processos, materiais, projetos e a vida entre as esculturas.
          </p>

          <div className="flex items-center gap-4 text-xs font-mono text-[#FAF8F5]/60">
            <span>{BLOG_POSTS.length} Artigos Publicados</span>
            <span className="w-8 h-px bg-[#C8A86B]/40" />
            <span>{BLOG_CATEGORIES.length} Categorias</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-16 sm:py-20 space-y-16">
        {/* Featured Article */}
        <section className="relative rounded-3xl overflow-hidden bg-[#16251E] text-[#FAF8F5] border border-[#E0C995]/40 shadow-[0_20px_50px_rgba(22,37,30,0.25)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-6 sm:p-10 md:p-14 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-[#E0C995] text-[#16251E] text-[10px] font-mono font-bold tracking-[0.25em] uppercase flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3 h-3" />
                  ARTIGO EM DESTAQUE
                </span>
                <span className="text-xs font-mono tracking-widest text-[#E0C995] uppercase font-semibold">
                  {BLOG_CATEGORY_LABELS[featuredPost.category]}
                </span>
                <span className="text-[#E0C995]/50">•</span>
                <span className="text-xs font-serif italic text-[#FAF8F5]/70 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {featuredPost.readingTimeMinutes} min de leitura
                </span>
              </div>

              <h2 className="font-sans text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight normal-case">
                {featuredPost.title}
              </h2>

              <p className="font-serif italic text-base sm:text-lg text-[#E0C995] leading-relaxed">
                {featuredPost.subtitle}
              </p>

              <p className="text-sm sm:text-base text-[#FAF8F5]/80 font-light leading-relaxed">
                {featuredPost.excerpt}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  to={`/blog/${featuredPost.slug}`}
                  className="px-6 py-3.5 rounded-full bg-[#E0C995] text-[#16251E] hover:bg-[#FAF8F5] font-mono text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center gap-2 shadow-lg group hover:scale-[1.02]"
                >
                  <span>Ler Artigo Completo</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <span className="text-xs font-serif italic text-[#FAF8F5]/60">
                  {featuredPost.author} •{' '}
                  {new Date(featuredPost.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-[#E0C995]/30 shadow-2xl bg-[#0F1B15] group">
                <img
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                  className="w-full h-[320px] sm:h-[400px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#16251E] via-[#16251E]/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#16251E]/90 backdrop-blur-md border border-[#E0C995]/30 space-y-1">
                  <div className="flex flex-wrap gap-1.5">
                    {featuredPost.tags.map((tag) => (
                      <span key={tag} className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#C8A86B]/15 text-[#E0C995]">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#C8A86B]/20 pb-6">
            <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#1E1D1A]">
              Todos os Artigos
            </h3>
            <span className="text-xs font-mono text-[#8A82A5]">
              {filteredPosts.length} {filteredPosts.length === 1 ? 'Artigo' : 'Artigos'}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory('ALL')}
              className={`px-4 py-2 rounded-full border text-[10px] font-mono tracking-widest uppercase transition-colors ${
                activeCategory === 'ALL'
                  ? 'bg-[#1E1D1A] text-[#FAF8F5] border-[#1E1D1A]'
                  : 'border-[#C8A86B]/40 text-[#1E1D1A] hover:border-[#C8A86B] hover:bg-[#C8A86B]/10'
              }`}
            >
              Todas
            </button>
            {BLOG_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full border text-[10px] font-mono tracking-widest uppercase transition-colors ${
                  activeCategory === category
                    ? 'bg-[#1E1D1A] text-[#FAF8F5] border-[#1E1D1A]'
                    : 'border-[#C8A86B]/40 text-[#1E1D1A] hover:border-[#C8A86B] hover:bg-[#C8A86B]/10'
                }`}
              >
                {BLOG_CATEGORY_LABELS[category]}
              </button>
            ))}
          </div>

          {listPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {listPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#C8A86B]/30 bg-[#F0ECE1] p-12 text-center space-y-3">
              <BookOpen className="w-10 h-10 text-[#C8A86B] mx-auto" />
              <p className="font-serif italic text-lg text-[#1E1D1A]">
                Nenhum artigo nesta categoria por enquanto.
              </p>
              <p className="text-xs font-mono text-[#8A82A5]">
                Novos ensaios do ateliê em breve.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};