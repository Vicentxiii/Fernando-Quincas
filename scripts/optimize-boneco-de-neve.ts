/**
 * Otimiza as fotos do Boneco de Neve em fibra de vidro (Natal 2026).
 * As fotos de produto sao grades/colagens com varios quadros — aqui recortamos
 * os quadros individuais e exportamos cada um como WEBP leve.
 * Executa: npx tsx scripts/optimize-boneco-de-neve.ts
 */
import sharp from 'sharp';
import { mkdir, stat } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const PUBLIC = path.join(root, 'public');
const BLOG_DIR = path.join(PUBLIC, 'blog/boneco-de-neve-fibra-vidro-natal');
const SHOP_DIR = path.join(PUBLIC, 'products');

type Area = { left: number; top: number; width: number; height: number };

async function cut(file: string, area: Area | null, dest: string, quality = 82, width?: number) {
  const src = path.join(PUBLIC, file);
  let pipeline = sharp(src);
  if (area) pipeline = pipeline.extract(area);
  const buf = await pipeline.jpeg({ quality: 95 }).toBuffer();
  let out = sharp(buf).trim({ threshold: 12 });
  if (width) out = out.resize({ width, withoutEnlargement: true });
  await out.webp({ quality, effort: 5 }).toFile(dest);
  const m = await sharp(dest).metadata();
  return { w: m.width!, h: m.height!, size: Math.round((await stat(dest)).size / 1024) };
}

const FOTOS = (n: number) => `Boneco de Neve by Fernando Aprisco (${n}).jpg`;
const PROD = 'Boneco de neve para Produto valor 3500 reais 1.70 de altura 35 kilos, 1.jpg';
const PROD2 = 'Boneco de neve para Produto valor 3500 reais 1.70 de altura 35 kilos, 2.jpg';
const PROD3 = 'Boneco de neve para Produto valor 3500 reais 1.70 de altura 35 kilos,.jpg';

// Grade da foto de produto 2 — 4 quadros
const GRADE: { area: Area; out: string }[] = [
  { area: { left: 0, top: 0, width: 560, height: 768 }, out: 'boneco-de-neve-3-4-esquerdo' },
  { area: { left: 700, top: 0, width: 676, height: 450 }, out: 'boneco-de-neve-3-4-direito' },
  { area: { left: 570, top: 390, width: 335, height: 378 }, out: 'boneco-de-neve-perfil' },
  { area: { left: 900, top: 455, width: 476, height: 313 }, out: 'boneco-de-neve-detalhe-rosto' },
];

async function run() {
  await mkdir(BLOG_DIR, { recursive: true });
  await mkdir(SHOP_DIR, { recursive: true });

  console.log('--- Blog ---');
  // Fotos de ambientacao (1:1, ja sem moldura branca relevante)
  const blog: { file: string; area: Area | null; out: string }[] = [
    { file: FOTOS(1), area: null, out: 'boneco-de-neve-na-vila-historica' },
    { file: FOTOS(2), area: null, out: 'boneco-de-neve-selfie-com-familia' },
    { file: FOTOS(3), area: null, out: 'boneco-de-neve-na-loja-de-artesanato' },
    { file: FOTOS(4), area: null, out: 'boneco-de-neve-na-calcada-rua' },
  ];
  for (const j of blog) {
    const dest = path.join(BLOG_DIR, `${j.out}.webp`);
    const r = await cut(j.file, j.area, dest);
    console.log(`  ✓ ${j.out}  ${r.w}x${r.h}  ${r.size}KB`);
  }
  for (const g of GRADE) {
    const dest = path.join(BLOG_DIR, `${g.out}.webp`);
    const r = await cut(PROD2, g.area, dest);
    console.log(`  ✓ ${g.out}  ${r.w}x${r.h}  ${r.size}KB`);
  }
  // Estudio com o autor (escala) e estudio frontal
  for (const [file, out] of [[PROD, 'boneco-de-neve-estudio-com-autor'], [PROD3, 'boneco-de-neve-estudio-frontal']] as const) {
    const dest = path.join(BLOG_DIR, `${out}.webp`);
    const r = await cut(file, null, dest);
    console.log(`  ✓ ${out}  ${r.w}x${r.h}  ${r.size}KB`);
  }

  console.log('--- Loja ---');
  const shop = [
    { file: PROD3, out: 'boneco-de-neve-fibra-vidro-3500', width: 1400 },
    { file: PROD, out: 'boneco-de-neve-escala-autor', width: 1600 },
    { file: GRADE[0].out, from: BLOG_DIR, out: 'boneco-de-neve-3-4-esquerdo', width: 1400 },
    { file: GRADE[1].out, from: BLOG_DIR, out: 'boneco-de-neve-3-4-direito', width: 1400 },
    { file: GRADE[3].out, from: BLOG_DIR, out: 'boneco-de-neve-detalhe-rosto', width: 1400 },
    { file: FOTOS(1), out: 'boneco-de-neve-vila-historica', width: 1400 },
    { file: FOTOS(4), out: 'boneco-de-neve-rua-paco-quinho', width: 1400 },
  ];
  for (const s of shop) {
    const src = 'from' in s && s.from ? path.join(s.from, `${s.file}.webp`) : path.join(PUBLIC, s.file);
    const dest = path.join(SHOP_DIR, `${s.out}.webp`);
    await sharp(src).resize({ width: s.width, withoutEnlargement: true }).webp({ quality: 82, effort: 5 }).toFile(dest);
    const m = await sharp(dest).metadata();
    console.log(`  ✓ ${s.out}  ${m.width}x${m.height}  ${Math.round((await stat(dest)).size / 1024)}KB`);
  }
}

run().catch((e) => {
  console.error('[optimize] Erro:', e);
  process.exit(1);
});