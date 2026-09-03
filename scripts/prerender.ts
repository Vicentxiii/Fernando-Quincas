/**
 * Prerender estático para SEO — gera HTML com meta tags já injetadas
 * para crawlers que não executam JS (Bing, LLMs, WhatsApp, etc).
 * 
 * Executa após `vite build`: lê dist/index.html como template e gera
 * dist/blog/index.html, dist/blog/<slug>/index.html, dist/loja/index.html, dist/loja/<slug>/index.html
 */

import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, '../dist');
const TEMPLATE_PATH = path.join(DIST_DIR, 'index.html');
const SITE_URL = 'https://fernandoquincas.com.br';

// Importa dados do site (via tsx, funciona com ESNext)
import { PRODUCTS } from '../src/data/products';
import { BLOG_POSTS, BLOG_CATEGORY_LABELS } from '../src/data/blog';
import { INSTRUMENTS } from '../src/data/instruments';

interface PrerenderMeta {
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage?: string;
  ogType: 'website' | 'article' | 'product';
  keywords?: string;
  jsonLds?: object[];
  robots?: string;
}

const SITE_NAME = 'Fernando Quincas';

function escapeAttr(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function upsertMeta(html: string, attr: 'name' | 'property', key: string, content: string): string {
  const escaped = escapeAttr(content);
  const regex = new RegExp(`<meta\\s+[^>]*${attr}=["']${key}["'][^>]*>`, 'i');
  const newTag = `<meta ${attr}="${key}" content="${escaped}">`;
  if (regex.test(html)) {
    return html.replace(regex, newTag);
  }
  return html.replace('</head>', `    ${newTag}\n  </head>`);
}

function upsertLinkCanonical(html: string, href: string): string {
  const escaped = escapeAttr(href);
  const regex = /<link\s+[^>]*rel=["']canonical["'][^>]*>/i;
  const newTag = `<link rel="canonical" href="${escaped}">`;
  if (regex.test(html)) {
    return html.replace(regex, newTag);
  }
  return html.replace('</head>', `    ${newTag}\n  </head>`);
}

function upsertTitle(html: string, title: string): string {
  const escaped = escapeAttr(title);
  const regex = /<title>.*?<\/title>/is;
  const newTag = `<title>${escaped}</title>`;
  if (regex.test(html)) {
    return html.replace(regex, newTag);
  }
  return html.replace('</head>', `    ${newTag}\n  </head>`);
}

function injectJsonLd(html: string, jsonLdObjects: object[]): string {
  if (!jsonLdObjects.length) return html;
  const scripts = jsonLdObjects
    .map((obj) => `    <script type="application/ld+json" data-prerender="true">${JSON.stringify(obj)}</script>`)
    .join('\n');
  return html.replace('</head>', `${scripts}\n  </head>`);
}

function injectMeta(html: string, meta: PrerenderMeta): string {
  let out = html;
  const fullTitle = meta.title.includes(SITE_NAME) ? meta.title : `${meta.title} | ${SITE_NAME}`;
  out = upsertTitle(out, fullTitle);
  out = upsertMeta(out, 'name', 'description', meta.description);
  if (meta.keywords) out = upsertMeta(out, 'name', 'keywords', meta.keywords);
  out = upsertLinkCanonical(out, meta.canonical);
  out = upsertMeta(out, 'property', 'og:title', meta.ogTitle || fullTitle);
  out = upsertMeta(out, 'property', 'og:description', meta.ogDescription || meta.description);
  if (meta.ogImage) {
    const absImage = meta.ogImage.startsWith('http') ? meta.ogImage : `${SITE_URL}${meta.ogImage}`;
    out = upsertMeta(out, 'property', 'og:image', absImage);
    out = upsertMeta(out, 'name', 'twitter:image', absImage);
  }
  out = upsertMeta(out, 'property', 'og:url', meta.canonical);
  out = upsertMeta(out, 'property', 'og:type', meta.ogType);
  out = upsertMeta(out, 'property', 'og:site_name', 'Ateliê Fernando Quincas');
  out = upsertMeta(out, 'property', 'og:locale', 'pt_BR');
  out = upsertMeta(out, 'name', 'twitter:card', meta.ogImage ? 'summary_large_image' : 'summary');
  out = upsertMeta(out, 'name', 'twitter:title', meta.ogTitle || fullTitle);
  out = upsertMeta(out, 'name', 'twitter:description', meta.ogDescription || meta.description);
  if (meta.robots) {
    out = upsertMeta(out, 'name', 'robots', meta.robots);
  } else {
    out = upsertMeta(out, 'name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  }
  if (meta.jsonLds && meta.jsonLds.length) {
    out = injectJsonLd(out, meta.jsonLds);
  }
  return out;
}

async function ensureDir(dir: string) {
  await mkdir(dir, { recursive: true });
}

async function generate() {
  console.log('[prerender] Lendo template:', TEMPLATE_PATH);
  let template: string;
  try {
    template = await readFile(TEMPLATE_PATH, 'utf-8');
  } catch (e) {
    console.error('[prerender] dist/index.html não encontrado. Execute "vite build" primeiro.');
    process.exit(1);
  }

  const pages: { filePath: string; meta: PrerenderMeta }[] = [];

  // ── LOJA (CollectionPage + ItemList) ──
  const shopJsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Loja — Obras Disponíveis | Ateliê Fernando Quincas',
      description: 'Obras originais, esculturas, edições numeradas e objetos de arte de Fernando Quincas, disponíveis para aquisição direta do ateliê.',
      url: `${SITE_URL}/loja`,
      isPartOf: { '@type': 'WebSite', name: 'Ateliê Fernando Quincas', url: SITE_URL },
      inLanguage: 'pt-BR',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Acervo da Loja',
      numberOfItems: PRODUCTS.length,
      itemListElement: PRODUCTS.map((p, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `${SITE_URL}/loja/${p.slug}`,
        name: p.name,
        image: p.images[0]?.startsWith('http') ? p.images[0] : `${SITE_URL}${p.images[0]}`,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Loja', item: `${SITE_URL}/loja` },
      ],
    },
  ];

  pages.push({
    filePath: 'loja/index.html',
    meta: {
      title: 'Loja — Obras Disponíveis',
      description: 'Obras originais, esculturas, edições numeradas e objetos de arte de Fernando Quincas, disponíveis para aquisição direta do ateliê. Esculturas monumentais em fibra de vidro, fontes e vasos.',
      canonical: `${SITE_URL}/loja`,
      ogTitle: 'Loja — Obras Disponíveis | Ateliê Fernando Quincas — Mestre Artesão em Fibra de Vidro',
      ogDescription: 'Obras originais, esculturas, edições numeradas e objetos de arte de Fernando Quincas, disponíveis para aquisição direta do ateliê.',
      ogImage: PRODUCTS.find((p) => p.featured)?.images[0] || PRODUCTS[0]?.images[0] || '/fernando-quincas.webp',
      ogType: 'website',
      keywords: 'Fernando Quincas, loja, esculturas monumentais, fibra de vidro, atelier',
      jsonLds: shopJsonLd,
    },
  });

  // ── INSTRUMENTOS ──
  const instrumentosJsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Instrumentos — Liras Artesanais | Ateliê Fernando Quincas',
      description: 'Liras artesanais de 15 cordas por Fernando Quincas — madeira nobre, coração vazado, timbre cristalino. Cada lira acompanha bolsa porta-lira e guia musical didático.',
      url: `${SITE_URL}/instrumentos`,
      isPartOf: { '@type': 'WebSite', name: 'Ateliê Fernando Quincas', url: SITE_URL },
      inLanguage: 'pt-BR',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Instrumentos', item: `${SITE_URL}/instrumentos` },
      ],
    },
  ];

  pages.push({
    filePath: 'instrumentos/index.html',
    meta: {
      title: 'Instrumentos — Liras Artesanais',
      description: 'Liras artesanais de 15 cordas por Fernando Quincas — madeira nobre, coração vazado, timbre cristalino. Cada lira acompanha bolsa porta-lira e guia musical didático. Feitas à mão no ateliê.',
      canonical: `${SITE_URL}/instrumentos`,
      ogTitle: 'Instrumentos — Liras Artesanais | Ateliê Fernando Quincas',
      ogDescription: 'Liras de 15 cordas em madeira nobre por Fernando Quincas — timbre cristalino, bolsa e guia musical inclusos. Conheça o novo ateliê de instrumentos.',
      ogImage: '/products/lira-instrumento-musical-corda.jpeg',
      ogType: 'website',
      keywords: 'Fernando Quincas, lira, instrumentos, lira 15 cordas, madeira nobre, instrumentos artesanais, luteria, Waldorf',
      jsonLds: instrumentosJsonLd,
    },
  });

  // ── INSTRUMENTOS FOTOS — cada foto com URL dedicada para SEO ──
  for (const inst of INSTRUMENTS) {
    for (const img of inst.gallery) {
      const url = `${SITE_URL}/instrumentos/${img.slug}`;
      const title = img.seoTitle ?? img.caption ?? inst.name;
      const description = img.seoDescription ?? img.alt;
      const imageLd = {
        '@context': 'https://schema.org',
        '@type': 'ImageObject',
        name: title,
        description,
        caption: img.seoCaption ?? img.caption,
        contentUrl: img.src.startsWith('http') ? img.src : `${SITE_URL}${img.src}`,
        url,
        author: { '@type': 'Person', name: 'Fernando Quincas' },
        creator: { '@type': 'Person', name: 'Fernando Quincas' },
      };
      const breadcrumbLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Instrumentos', item: `${SITE_URL}/instrumentos` },
          { '@type': 'ListItem', position: 3, name: title, item: url },
        ],
      };
      pages.push({
        filePath: `instrumentos/${img.slug}/index.html`,
        meta: {
          title,
          description,
          canonical: url,
          ogTitle: `${title} | Fernando Quincas`,
          ogDescription: description,
          ogImage: img.src,
          ogType: 'article',
          keywords: `${title}, Fernando Quincas, lira, instrumentos, madeira nobre, ${img.caption ?? ''}`,
          jsonLds: [imageLd, breadcrumbLd],
        },
      });
    }
  }

  // ── BLOG INDEX ──
  const blogJsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Blog do Atelier — Bastidores e Obras',
      description: 'Blog do Atelier de Fernando Quincas: bastidores de esculturas monumentais, fontes, vasos e histórias do atelier em Minas Gerais.',
      url: `${SITE_URL}/blog`,
      isPartOf: { '@type': 'WebSite', name: 'Ateliê Fernando Quincas', url: SITE_URL },
      inLanguage: 'pt-BR',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      numberOfItems: BLOG_POSTS.length,
      itemListElement: BLOG_POSTS.map((post, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `${SITE_URL}/blog/${post.slug}`,
        name: post.title,
        image: post.coverImage.startsWith('http') ? post.coverImage : `${SITE_URL}${post.coverImage}`,
      })),
    },
  ];

  pages.push({
    filePath: 'blog/index.html',
    meta: {
      title: 'Blog do Atelier — Bastidores e Obras',
      description: 'Blog do Atelier de Fernando Quincas, mestre artesão em fibra de vidro: bastidores de esculturas monumentais, fontes, vasos e histórias do atelier em Minas Gerais.',
      canonical: `${SITE_URL}/blog`,
      ogTitle: 'Blog do Atelier — Bastidores e Obras | Fernando Quincas',
      ogDescription: 'Blog do Atelier de Fernando Quincas: bastidores de esculturas monumentais, fontes, vasos e histórias do atelier em Minas Gerais.',
      ogImage: BLOG_POSTS.find((p) => p.featured)?.coverImage || BLOG_POSTS[0]?.coverImage || '/fernando-quincas.webp',
      ogType: 'website',
      keywords: 'Fernando Quincas, blog, esculturas monumentais, fibra de vidro, atelier',
      jsonLds: blogJsonLd,
    },
  });

  // ── BLOG POSTS ──
  for (const post of BLOG_POSTS) {
    const url = `${SITE_URL}/blog/${post.slug}`;
    const fullTitle = post.title.includes('Fernando Quincas') ? post.title : `${post.title} | Fernando Quincas`;
    const absCover = post.coverImage.startsWith('http') ? post.coverImage : `${SITE_URL}${post.coverImage}`;
    const imageBlocks = post.blocks.filter((b) => (b as any).type === 'image') as any[];
    const images = [absCover, ...imageBlocks.map((b) => (b.src.startsWith('http') ? b.src : `${SITE_URL}${b.src}`))];

    const blogPostingLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      alternativeHeadline: post.subtitle,
      description: post.excerpt,
      image: images,
      author: {
        '@type': 'Person',
        name: post.author,
        jobTitle: (post as any).authorRole || 'Escultor & Mestre Artesão',
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
      articleSection: (BLOG_CATEGORY_LABELS as any)[post.category] || post.category,
      inLanguage: 'pt-BR',
      isAccessibleForFree: true,
    };

    const breadcrumbLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
        { '@type': 'ListItem', position: 3, name: post.title, item: url },
      ],
    };

    pages.push({
      filePath: `blog/${post.slug}/index.html`,
      meta: {
        title: post.title,
        description: post.excerpt,
        canonical: url,
        ogTitle: fullTitle,
        ogDescription: post.excerpt,
        ogImage: post.coverImage,
        ogType: 'article',
        keywords: post.tags.join(', '),
        jsonLds: [blogPostingLd, breadcrumbLd],
      },
    });
  }

  // ── PRODUCT PAGES ──
  for (const product of PRODUCTS) {
    const url = `${SITE_URL}/loja/${product.slug}`;
    const title = `${product.name} — Loja`;
    const ogImage = product.images[0];
    const absImages = product.images.map((img) => (img.startsWith('http') ? img : `${SITE_URL}${img}`));

    const availability =
      product.status !== 'AVAILABLE' || product.stock <= 0
        ? 'https://schema.org/OutOfStock'
        : product.stock === 1
          ? 'https://schema.org/LimitedAvailability'
          : 'https://schema.org/InStock';

    const productLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      '@id': `${url}#product`,
      name: product.name,
      description: product.shortDescription,
      category: product.categories ? product.categories.join(', ') : product.category,
      image: absImages,
      sku: product.id,
      mpn: product.id,
      brand: { '@type': 'Brand', name: 'Ateliê Fernando Quincas' },
      offers: {
        '@type': 'Offer',
        url,
        priceCurrency: 'BRL',
        price: product.price,
        priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        availability,
        itemCondition: 'https://schema.org/NewCondition',
        seller: { '@type': 'Organization', name: 'Ateliê Fernando Quincas', url: SITE_URL },
      },
    };

    const breadcrumbLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Loja', item: `${SITE_URL}/loja` },
        { '@type': 'ListItem', position: 3, name: product.name, item: url },
      ],
    };

    pages.push({
      filePath: `loja/${product.slug}/index.html`,
      meta: {
        title,
        description: product.shortDescription,
        canonical: url,
        ogTitle: `${product.name} | Fernando Quincas`,
        ogDescription: product.shortDescription,
        ogImage,
        ogType: 'product',
        keywords: `${product.name}, Fernando Quincas, fibra de vidro, ${product.category}, ${product.materials?.join(', ') || ''}`,
        jsonLds: [productLd, breadcrumbLd],
      },
    });
  }

  // Gera todos os arquivos
  console.log(`[prerender] Gerando ${pages.length} páginas...`);
  for (const page of pages) {
    const html = injectMeta(template, page.meta);
    const outPath = path.join(DIST_DIR, page.filePath);
    await ensureDir(path.dirname(outPath));
    await writeFile(outPath, html, 'utf-8');
    console.log(`  ✓ ${page.filePath} -> ${page.meta.canonical}`);
  }

  console.log(`[prerender] Concluído: ${pages.length} páginas prerenderizadas em ${DIST_DIR}`);
}

generate().catch((err) => {
  console.error('[prerender] Erro:', err);
  process.exit(1);
});
