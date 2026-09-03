/**
 * Gera sitemap.xml dinâmico com <image:image> e lastmod a partir de PRODUCTS e BLOG_POSTS
 * Executa em build: tsx scripts/generate-sitemap.ts
 * Gera em public/sitemap.xml e dist/sitemap.xml
 */
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_URL = 'https://fernandoquincas.com.br';

import { PRODUCTS } from '../src/data/products';
import { BLOG_POSTS } from '../src/data/blog';
import { INSTRUMENTS } from '../src/data/instruments';

function esc(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatLastMod(dateStr?: string): string {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  // Garante YYYY-MM-DD
  return dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
}

function imageEntries(images: string[], caption?: string): string {
  return images
    .slice(0, 3) // limita a 3 por URL para não estourar sitemap
    .map((src) => {
      const loc = src.startsWith('http') ? src : `${SITE_URL}${src}`;
      return `    <image:image>\n      <image:loc>${esc(loc)}</image:loc>${caption ? `\n      <image:caption>${esc(caption)}</image:caption>` : ''}\n    </image:image>`;
    })
    .join('\n');
}

async function generate() {
  const now = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

  // Home
  xml += `  <url>\n    <loc>${SITE_URL}/</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n${imageEntries(['/fernando-quincas.webp'], 'Fernando Quincas, mestre artesão em fibra de vidro')}\n  </url>\n`;
  // Loja
  xml += `  <url>\n    <loc>${SITE_URL}/loja</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n${imageEntries(PRODUCTS.slice(0, 3).map((p) => p.images[0]))}\n  </url>\n`;
  // Instrumentos
  xml += `  <url>\n    <loc>${SITE_URL}/instrumentos</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n${imageEntries(['/products/lira-instrumento-musical-corda.jpeg', '/products/lira-bolsa-close.jpeg', '/products/lira-guia-musical.jpeg'], 'Lira 15 cordas por Fernando Quincas')}\n  </url>\n`;
  // Instrumentos — fotos com URL dedicada para SEO
  for (const inst of INSTRUMENTS) {
    for (const img of inst.gallery) {
      xml += `  <url>\n    <loc>${SITE_URL}/instrumentos/${esc(img.slug)}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n${imageEntries([img.src], img.seoTitle ?? img.caption ?? img.alt)}\n  </url>\n`;
    }
  }
  // Blog
  xml += `  <url>\n    <loc>${SITE_URL}/blog</loc>\n    <lastmod>${formatLastMod(BLOG_POSTS[0]?.date)}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n${imageEntries(BLOG_POSTS.slice(0, 3).map((p) => p.coverImage))}\n  </url>\n`;

  // Blog posts - ordena por date desc para priority
  const sortedBlog = [...BLOG_POSTS].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  for (const post of sortedBlog) {
    const lastmod = formatLastMod(post.date);
    const priority = post.featured ? '0.9' : '0.7';
    const changefreq = 'monthly';
    const imageBlock = post.blocks.filter((b: any) => b.type === 'image').slice(0, 2) as any[];
    const images = [post.coverImage, ...imageBlock.map((b) => b.src)];
    xml += `  <url>\n    <loc>${SITE_URL}/blog/${esc(post.slug)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n${imageEntries(images, post.title)}\n  </url>\n`;
  }

  // Produtos
  for (const p of PRODUCTS) {
    const priority = p.featured ? '0.9' : p.stock === 1 ? '0.7' : '0.6';
    // usa data de hoje como lastmod para produtos (sem campo date), mas poderia usar year
    const lastmod = now;
    xml += `  <url>\n    <loc>${SITE_URL}/loja/${esc(p.slug)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n${imageEntries(p.images, p.name)}\n  </url>\n`;
  }

  xml += `</urlset>\n`;

  const publicPath = path.resolve(__dirname, '../public/sitemap.xml');
  const distPath = path.resolve(__dirname, '../dist/sitemap.xml');

  await writeFile(publicPath, xml, 'utf-8');
  const instrumentosCount = INSTRUMENTS.flatMap((i) => i.gallery).length;
  console.log(`[sitemap] Gerado public/sitemap.xml com ${PRODUCTS.length + BLOG_POSTS.length + 3 + instrumentosCount} URLs`);

  try {
    await mkdir(path.dirname(distPath), { recursive: true });
    await writeFile(distPath, xml, 'utf-8');
    console.log(`[sitemap] Copiado para dist/sitemap.xml`);
  } catch {
    // dist pode não existir ainda (quando roda antes do build)
  }

  // Validação rápida
  const missingImages = xml.split('<image:loc>').length - 1;
  console.log(`[sitemap] Total image entries: ${missingImages}`);
}

generate().catch((e) => {
  console.error('[sitemap] Erro:', e);
  process.exit(1);
});
