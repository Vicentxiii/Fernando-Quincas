import React, { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, CalendarDays, User, Quote, Sparkles, ArrowUpRight } from 'lucide-react';
import { BLOG_CATEGORY_LABELS, BLOG_POSTS } from '../data/blog';
import { BlogBlock } from '../types';
import { BlogCard } from '../components/blog/BlogCard';

const BlockRenderer: React.FC<{ block: BlogBlock }> = ({ block }) => {
  switch (block.type) {
    case 'heading':
      return (
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1E1D1A] leading-snug">
          {block.text}
        </h2>
      );
    case 'subheading':
      return (
        <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#1E1D1A]">
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

  const post = BLOG_POSTS.find((p) => p.slug === slug);

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

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
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
              <p className="font-display text-sm font-semibold text-[#1E1D1A] group-hover:text-[#C8A86B] transition-colors">
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
              <p className="font-display text-sm font-semibold text-[#1E1D1A] group-hover:text-[#C8A86B] transition-colors">
                {nextPost.title}
              </p>
            </Link>
          )}
        </nav>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="pt-16 space-y-6">
            <div className="border-b border-[#C8A86B]/20 pb-4">
              <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#1E1D1A]">
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