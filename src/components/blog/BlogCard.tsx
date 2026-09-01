import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowUpRight } from 'lucide-react';
import { BlogPost } from '../../types';
import { BLOG_CATEGORY_LABELS } from '../../data/blog';

interface BlogCardProps {
  post: BlogPost;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex flex-col rounded-2xl border border-[#C8A86B]/30 bg-[#FAF8F5] overflow-hidden hover:shadow-xl hover:border-[#C8A86B] transition-all duration-300"
    >
      <div className="relative h-52 overflow-hidden bg-[#EAE5D8]">
        <img
          src={post.coverImage}
          alt={`${post.title} — ${BLOG_CATEGORY_LABELS[post.category]} por Fernando Quincas`}
          loading="lazy"
          decoding="async"
          width="400"
          height="300"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#1E1D1A]/85 backdrop-blur-md text-[#E0C995] text-[9px] font-mono uppercase tracking-widest border border-[#C8A86B]/30">
          {BLOG_CATEGORY_LABELS[post.category]}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1 space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-mono text-[#8A82A5] uppercase tracking-wider">
          <span>{new Date(post.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
          <span>•</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {post.readingTimeMinutes} min
          </span>
        </div>

        <h3 className="font-sans text-[17px] sm:text-lg font-semibold text-[#1E1D1A] group-hover:text-[#C8A86B] transition-colors leading-snug tracking-tight normal-case">
          {post.title}
        </h3>

        <p className="text-xs sm:text-sm text-[#2C2A26]/80 font-light leading-relaxed font-serif flex-1">
          {post.excerpt}
        </p>

        <div className="pt-4 border-t border-[#C8A86B]/20 flex items-center justify-between">
          <span className="text-xs font-serif italic text-[#8A82A5]">
            {post.author}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-mono tracking-widest uppercase text-[#C8A86B]">
            <span>Ler</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
};