/**
 * Gera as imagens do produto "Mesa Flutuante com Arvore" (R$ 18.000).
 * Recorta das fotos originais do projeto/showroom em resolucao nativa
 * (sem upscale) e exporta WEBP para public/products/.
 * Executa: npx tsx scripts/optimize-mesa-flutuante.ts
 */
import sharp from 'sharp';
import { mkdir, stat } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const PUBLIC = path.join(root, 'public');
const OUT = path.join(PUBLIC, 'products');

type Area = { left: number; top: number; width: number; height: number };

const f4 = 'Arvore e Globo na metade by fernando QUincas  (4).jpeg'; // mesa + cadeiras + arvore, foto com legenda embaixo
const f5 = 'Arvore e Globo na metade by fernando QUincas  (5).jpeg'; // mesa + pessoas, legenda em cima
const f8 = 'Arvore e Globo na metade by fernando QUincas  (8).jpeg'; // colagem 2 quadros
const f9 = 'Arvore e Globo na metade by fernando QUincas  (9).jpeg'; // grade 10 quadros
const BLOG = path.join(PUBLIC, 'blog/arvore-globo-mesa-flutuante-showroom');

const JOBS: { label: string; out: string; src: string; area: Area | null; width?: number }[] = [
  {
    label: 'Hero — mesa completa com cadeiras',
    out: 'mesa-flutuante-arvore-vidro-18000',
    src: path.join(PUBLIC, f4),
    area: { left: 0, top: 0, width: 1006, height: 745 },
  },
  {
    label: 'Mesa no uso, com pessoas',
    out: 'mesa-flutuante-arvore-vidro-ambiente',
    src: path.join(PUBLIC, f5),
    area: { left: 40, top: 205, width: 1023, height: 750 },
  },
  {
    label: 'Detalhe — vidro, base e troncos',
    out: 'mesa-flutuante-arvore-vidro-detalhe-vidro',
    src: path.join(PUBLIC, f4),
    area: { left: 150, top: 520, width: 720, height: 225 },
  },
  {
    label: 'Detalhe — copa no disco de luz do teto',
    out: 'mesa-flutuante-arvore-vidro-detalhe-copa',
    src: path.join(PUBLIC, f4),
    area: { left: 270, top: 10, width: 480, height: 300 },
  },
  {
    label: 'Detalhe — tronco da arvore na mesa',
    out: 'mesa-flutuante-arvore-vidro-detalhe-tronco',
    src: path.join(PUBLIC, f5),
    area: { left: 560, top: 205, width: 300, height: 700 },
  },
  {
    label: 'Arvore ate o teto (estrutura)',
    out: 'mesa-flutuante-arvore-vidro-arvore-teto',
    src: path.join(BLOG, 'arvore-iluminada-abertura-no-teto.webp'),
    area: null,
  },
  {
    label: 'Mesa e arvore — visao conjunta',
    out: 'mesa-flutuante-arvore-vidro-visao-conjunta',
    src: path.join(BLOG, 'arvore-e-mesa-visao-conjunta.webp'),
    area: null,
  },
  {
    label: 'Ponto de encontro com a mesa',
    out: 'mesa-flutuante-arvore-vidro-ponto-de-encontro',
    src: path.join(BLOG, 'mesa-flutuante-ponto-de-encontro.webp'),
    area: null,
  },
];

async function build(job: (typeof JOBS)[number]) {
  let p = sharp(job.src);
  if (job.area) p = p.extract(job.area);
  const buf = await p.jpeg({ quality: 96 }).toBuffer();
  let out = sharp(buf).trim({ threshold: 12 });
  if (job.width) out = out.resize({ width: job.width, withoutEnlargement: true });
  const dest = path.join(OUT, `${job.out}.webp`);
  await out.webp({ quality: 84, effort: 5 }).toFile(dest);
  const m = await sharp(dest).metadata();
  return { w: m.width!, h: m.height!, size: Math.round((await stat(dest)).size / 1024) };
}

async function run() {
  await mkdir(OUT, { recursive: true });
  for (const job of JOBS) {
    const r = await build(job);
    console.log(`  ✓ ${job.label.padEnd(42)} ${r.w}x${r.h}  ${r.size}KB  -> ${job.out}.webp`);
  }
  console.log(`[produto] ${JOBS.length} imagens em public/products/`);
}

run().catch((e) => {
  console.error('[produto] Erro:', e);
  process.exit(1);
});