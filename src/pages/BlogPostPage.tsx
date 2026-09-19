import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, CalendarDays, User, Quote, Sparkles, ArrowUpRight, ChevronLeft, ChevronRight, Images } from 'lucide-react';
import { BLOG_CATEGORY_LABELS, BLOG_POSTS } from '../data/blog';
import { BlogBlock } from '../types';
import { BlogCard } from '../components/blog/BlogCard';

const BlogCarousel: React.FC<{ images: { src: string; alt: string; caption?: string }[] }> = ({ images }) => {
  const [index, setIndex] = useState(0);
  const total = images.length;
  const goPrev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total]);
  const goNext = useCallback(() => setIndex((i) => (i + 1) % total), [total]);

  // touch swipe
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = e.changedTouches[0].clientX - touchStart;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goPrev(); else goNext();
    }
    setTouchStart(null);
  };

  if (total === 0) return null;
  const current = images[index];
  return (
    <div className="space-y-3">
      <div
        className="relative rounded-2xl overflow-hidden border border-[#C8A86B]/30 bg-[#EAE5D8] group"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* image */}
        <div className="relative aspect-[4/3] sm:aspect-[16/10] bg-[#EAE5D8] overflow-hidden">
          <img
            key={current.src}
            src={current.src}
            alt={current.alt}
            loading={index === 0 ? 'eager' : 'lazy'}
            decoding="async"
            className="w-full h-full object-cover select-none"
            draggable={false}
          />
          {/* gradient caption bar */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent pt-12 pb-4 px-4 sm:px-6 pointer-events-none">
            {current.caption && (
              <p className="text-[11px] sm:text-xs font-serif italic text-white/95 leading-snug max-w-3xl line-clamp-2">
                {current.caption}
              </p>
            )}
          </div>
          {/* nav buttons */}
          <button
            onClick={goPrev}
            aria-label="Imagem anterior"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-[#C8A86B]/20 flex items-center justify-center text-[#1E1D1A] hover:bg-[#1E1D1A] hover:text-white transition-colors shadow-md opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goNext}
            aria-label="Próxima imagem"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-[#C8A86B]/20 flex items-center justify-center text-[#1E1D1A] hover:bg-[#1E1D1A] hover:text-white transition-colors shadow-md opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          {/* counter */}
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#1E1D1A]/80 backdrop-blur-md text-white text-[10px] font-mono tracking-widest border border-[#C8A86B]/20">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </div>
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#E0C995] text-[#1E1D1A] text-[9px] font-mono font-bold tracking-[0.2em] uppercase flex items-center gap-1.5">
            <Images className="w-3 h-3" /> Galeria
          </div>
        </div>
      </div>
      {/* dots */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5 justify-center flex-1">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Ir para imagem ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-6 bg-[#C8A86B]' : 'w-1.5 bg-[#C8A86B]/30 hover:bg-[#C8A86B]/60'}`}
            />
          ))}
        </div>
        <span className="text-[10px] font-mono text-[#8A82A5] shrink-0 hidden sm:block">
          Toque ou use as setas • {total} fotos
        </span>
      </div>
      {/* thumbnails strip - desktop */}
      <div className="hidden sm:grid grid-cols-6 lg:grid-cols-8 gap-2 pt-1">
        {images.slice(0, 16).map((img, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${i === index ? 'border-[#C8A86B] shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}
            aria-label={`Miniatura ${i + 1}`}
          >
            <img src={img.src} alt="" loading="lazy" className="w-full h-full object-cover" />
          </button>
        ))}
        {total > 16 && (
          <div className="aspect-[4/3] rounded-lg bg-[#F0ECE1] border border-[#C8A86B]/20 flex items-center justify-center text-[11px] font-mono text-[#8A82A5]">
            +{total - 16}
          </div>
        )}
      </div>
    </div>
  );
};

const SITE_URL = 'https://fernandoquincas.com.br';

const setMetaTag = (attr: 'name' | 'property', key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const BlockRenderer: React.FC<{ block: BlogBlock }> = ({ block }) => {
  switch (block.type) {
    case 'heading':
      return (
        <h2 className="font-sans text-xl sm:text-2xl font-semibold text-[#1E1D1A] leading-snug tracking-tight normal-case">
          {block.text}
        </h2>
      );
    case 'subheading':
      return (
        <h3 className="font-sans text-lg sm:text-xl font-semibold text-[#1E1D1A] leading-snug tracking-tight normal-case">
          {block.text}
        </h3>
      );
    case 'quote':
      return (
        <blockquote className="relative pl-6 border-l-2 border-[#C8A86B] py-2 space-y-2">
          <Quote className="w-6 h-6 text-[#C8A86B]/40" />
          <p className="font-serif italic text-lg sm:text-xl text-[#1E1D1A] leading-relaxed">
            {block.text}
          </p>
          {block.attribution && (
            <footer className="text-xs font-mono tracking-widest uppercase text-[#C8A86B]">
              — {block.attribution}
            </footer>
          )}
        </blockquote>
      );
    case 'image':
      return (
        <figure className="space-y-3">
          <div className="rounded-2xl overflow-hidden border border-[#C8A86B]/30 bg-[#EAE5D8]">
            <img
              src={block.src}
              alt={block.alt}
              loading="lazy"
              decoding="async"
              className="w-full h-auto object-cover"
            />
          </div>
          {block.caption && (
            <figcaption className="text-xs font-serif italic text-[#8A82A5] text-center">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    case 'carousel':
      return <BlogCarousel images={block.images} />;
    case 'list':
      return (
        <ul className="space-y-2 pl-1">
          {block.items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-[#2C2A26]/85 font-light leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8A86B] mt-2 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      );
    case 'paragraph':
    default:
      return (
        <p className="text-sm sm:text-base text-[#2C2A26]/85 font-light leading-relaxed">
          {block.text}
        </p>
      );
  }
};

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const post =
    BLOG_POSTS.find((p) => p.slug === slug) ||
    // alias para não quebrar link antigo do post Novos Rumos
    (slug === 'novos-rumos-do-atelie-2026' ? BLOG_POSTS.find((p) => p.id === 'novos-rumos-atelie') : undefined);

  // SEO avançado para Google e IAs: title, description, OG, Twitter, canonical e JSON-LD Article
  useEffect(() => {
    if (!post) return;
    const url = `${SITE_URL}/blog/${post.slug}`;
    const fullTitle = post.title.includes('Fernando Quincas') ? post.title : `${post.title} | Fernando Quincas`;
    document.title = fullTitle;
    setMetaTag('name', 'description', post.excerpt);
    setMetaTag('name', 'keywords', post.tags.join(', '));
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', post.excerpt);
    setMetaTag('property', 'og:image', post.coverImage.startsWith('http') ? post.coverImage : `${SITE_URL}${post.coverImage}`);
    setMetaTag('property', 'og:url', url);
    setMetaTag('property', 'og:type', 'article');
    setMetaTag('property', 'article:published_time', post.date);
    setMetaTag('property', 'article:author', post.author);
    setMetaTag('property', 'article:tag', post.tags.join(', '));
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', post.excerpt);
    setMetaTag('name', 'twitter:image', post.coverImage.startsWith('http') ? post.coverImage : `${SITE_URL}${post.coverImage}`);
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    const imageBlocks = post.blocks.filter((b) => b.type === 'image') as Extract<BlogBlock, { type: 'image' }>[];
    const carouselBlocks = post.blocks.filter((b) => b.type === 'carousel') as Extract<BlogBlock, { type: 'carousel' }>[];
    const carouselSrcs = carouselBlocks.flatMap((b) => b.images.map((img) => img.src));
    const images = [post.coverImage, ...imageBlocks.map((b) => b.src), ...carouselSrcs].map((src) => (src.startsWith('http') ? src : `${SITE_URL}${src}`));

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      alternativeHeadline: post.subtitle,
      description: post.excerpt,
      image: images,
      author: {
        '@type': 'Person',
        name: post.author,
        jobTitle: post.authorRole || 'Escultor & Mestre Artesão',
        url: SITE_URL,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Ateliê Fernando Quincas',
        logo: { '@type': 'ImageObject', url: `${SITE_URL}/fernando-quincas.webp` },
      },
      datePublished: post.date,
      dateModified: post.date,
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      keywords: post.tags.join(', '),
      articleSection: BLOG_CATEGORY_LABELS[post.category],
      inLanguage: 'pt-BR',
      isAccessibleForFree: true,
    };

    let script = document.head.querySelector<HTMLScriptElement>('script[data-blog-jsonld="true"]');
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-blog-jsonld', 'true');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(jsonLd);

    // Breadcrumb para IAs e Google
    const breadcrumbLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
        { '@type': 'ListItem', position: 3, name: post.title, item: url },
      ],
    };
    let breadcrumbScript = document.head.querySelector<HTMLScriptElement>('script[data-breadcrumb-jsonld="true"]');
    if (!breadcrumbScript) {
      breadcrumbScript = document.createElement('script');
      breadcrumbScript.type = 'application/ld+json';
      breadcrumbScript.setAttribute('data-breadcrumb-jsonld', 'true');
      document.head.appendChild(breadcrumbScript);
    }
    breadcrumbScript.textContent = JSON.stringify(breadcrumbLd);
  }, [post]);

  const relatedPosts = useMemo(() => {
    if (!post) return [];
    const sameCategory = BLOG_POSTS.filter(
      (p) => p.category === post.category && p.id !== post.id
    );
    const others = BLOG_POSTS.filter(
      (p) => p.category !== post.category && p.id !== post.id
    );
    return [...sameCategory, ...others].slice(0, 3);
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-[#1E1D1A] flex flex-col items-center justify-center px-6 text-center space-y-6">
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#C8A86B]">
          Erro 404
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold">
          Artigo não encontrado
        </h1>
        <p className="font-serif italic text-[#8A82A5] max-w-md">
          O ensaio que você procura pode ter sido movido ou ainda não publicado.
        </p>
        <Link
          to="/blog"
          className="px-6 py-3 rounded-full bg-[#1E1D1A] text-[#FAF8F5] text-xs font-mono tracking-widest uppercase hover:bg-[#C8A86B] hover:text-[#1E1D1A] transition-colors"
        >
          Voltar ao Blog
        </Link>
      </div>
    );
  }

  const postIndex = BLOG_POSTS.findIndex((p) => p.id === post.id);
  const prevPost = BLOG_POSTS[postIndex - 1];
  const nextPost = BLOG_POSTS[postIndex + 1];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E1D1A]">
      {/* Editorial Article Header */}
      <header className="relative pt-36 sm:pt-44 pb-16 sm:pb-20 px-4 sm:px-6 md:px-12 bg-[#16251E] text-[#FAF8F5] overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C8A86B]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-[#E0C995] hover:text-[#FAF8F5] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar ao Blog
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-[#E0C995] text-[#16251E] text-[10px] font-mono font-bold tracking-[0.25em] uppercase">
              {BLOG_CATEGORY_LABELS[post.category]}
            </span>
            {post.featured && (
              <span className="px-3 py-1 rounded-full border border-[#C8A86B]/50 text-[#C8A86B] text-[10px] font-mono tracking-widest uppercase flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                Em Destaque
              </span>
            )}
          </div>

          <h1 className="font-sans text-3xl sm:text-4xl md:text-[42px] font-bold tracking-tight leading-[1.1] normal-case">
            {post.title}
          </h1>

          <p className="font-serif italic text-lg sm:text-xl text-[#E0C995] leading-relaxed">
            {post.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-[#FAF8F5]/70">
            <span className="inline-flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-[#C8A86B]" />
              {post.author}
              {post.authorRole ? ` • ${post.authorRole}` : ''}
            </span>
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="w-3.5 h-3.5 text-[#C8A86B]" />
              {new Date(post.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#C8A86B]" />
              {post.readingTimeMinutes} min de leitura
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12 py-12 sm:py-16">
        {/* Cover Image */}
        <div className="rounded-3xl overflow-hidden border border-[#C8A86B]/30 shadow-xl bg-[#EAE5D8] -mt-10 relative z-20">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-[320px] sm:h-[440px] object-cover"
          />
        </div>

        {/* Article Body */}
        <article className="space-y-8 py-12">
          {post.blocks.map((block, idx) => (
            <BlockRenderer key={idx} block={block} />
          ))}

          <div className="flex flex-wrap gap-2 pt-4 border-t border-[#C8A86B]/20">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-md bg-[#C8A86B]/10 border border-[#C8A86B]/20 text-[10px] font-mono text-[#C8A86B]"
              >
                #{tag}
              </span>
            ))}
          </div>
        </article>

        {/* Author Card */}
        <aside className="rounded-2xl border border-[#C8A86B]/30 bg-[#F0ECE1] p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          <div className="w-14 h-14 rounded-full border border-[#C8A86B] bg-[#FAF8F5] flex items-center justify-center text-[#C8A86B] font-display font-semibold shrink-0">
            FQ
          </div>
          <div className="space-y-1 flex-1">
            <p className="font-display text-base font-semibold text-[#1E1D1A]">
              {post.author}
            </p>
            <p className="text-xs font-mono tracking-widest uppercase text-[#C8A86B]">
              {post.authorRole || 'Ateliê Fernando Quincas'}
            </p>
            <p className="text-xs text-[#2C2A26]/70 font-light leading-relaxed pt-1">
              Escultor e mestre artesão dedicado à arte monumental, à douração clássica e aos jardins esculturais na Serra dos Órgãos, Minas Gerais.
            </p>
          </div>
        </aside>

        {/* Prev / Next Navigation */}
        <nav className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-12">
          {prevPost ? (
            <Link
              to={`/blog/${prevPost.slug}`}
              className="group rounded-2xl border border-[#C8A86B]/30 bg-[#FAF8F5] p-5 hover:border-[#C8A86B] transition-colors space-y-2"
            >
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#8A82A5] inline-flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                Artigo Anterior
              </span>
              <p className="font-sans text-sm font-semibold text-[#1E1D1A] group-hover:text-[#C8A86B] transition-colors leading-snug normal-case">
                {prevPost.title}
              </p>
            </Link>
          ) : (
            <span />
          )}
          {nextPost && (
            <Link
              to={`/blog/${nextPost.slug}`}
              className="group rounded-2xl border border-[#C8A86B]/30 bg-[#FAF8F5] p-5 hover:border-[#C8A86B] transition-colors space-y-2 text-right"
            >
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#8A82A5] inline-flex items-center gap-1 justify-end w-full">
                Próximo Artigo
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
              <p className="font-sans text-sm font-semibold text-[#1E1D1A] group-hover:text-[#C8A86B] transition-colors leading-snug normal-case">
                {nextPost.title}
              </p>
            </Link>
          )}
        </nav>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="pt-16 space-y-6">
            <div className="border-b border-[#C8A86B]/20 pb-4">
              <h3 className="font-sans text-xl sm:text-2xl font-semibold text-[#1E1D1A] tracking-tight">
                Leituras Relacionadas
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((p) => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="rounded-2xl bg-[#16251E] text-[#FAF8F5] p-8 sm:p-10 mt-16 text-center space-y-4 border border-[#E0C995]/30">
          <h4 className="font-display text-2xl font-semibold">
            Viu algo que despertou seu interesse?
          </h4>
          <p className="font-serif italic text-[#E0C995] max-w-xl mx-auto">
            Encomende uma peça, agende uma visita ao ateliê ou solicite um dossiê privado de esculturas.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate('/', { state: { scrollTo: 'contact' } })}
              className="px-6 py-3 rounded-full bg-[#E0C995] text-[#16251E] hover:bg-[#FAF8F5] text-xs font-mono tracking-widest uppercase transition-colors flex items-center gap-2"
            >
              <span>Falar com o Ateliê</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <Link
              to="/blog"
              className="px-6 py-3 rounded-full border border-[#C8A86B]/40 hover:border-[#E0C995] text-xs font-mono tracking-widest uppercase text-[#FAF8F5] transition-colors"
            >
              Ver todos os artigos
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};