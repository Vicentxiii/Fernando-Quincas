/**
 * Otimiza as fotos do livro gigante (Bíblia aberta com chama) da Igreja Universal.
 * As fotos originais são colagens com vários quadros — aqui recortamos os
 * quadros individuais e exportamos cada um como WEBP leve.
 * Executa: npx tsx scripts/optimize-livro-gigante.ts
 */
import sharp from 'sharp';
import { mkdir, stat } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const PUBLIC = path.join(root, 'public');
const OUTPUT_DIR = path.join(PUBLIC, 'blog/livro-gigante-biblia-igreja-universal');

const SRC = {
  f1: 'Livro gigante Igreja Universal (1).jpeg', // livro no ateliê (2 ângulos)
  f2: 'Livro gigante Igreja Universal (2).jpeg', // livro instalado com o culto
  f3: 'Livro gigante Igreja Universal (3).jpeg', // livro na parede com a chama acesa (2 ângulos)
};

/** Recorta um quadro da colagem e remove a borda branca em volta da foto */
async function cut(
  file: string,
  area: { left: number; top: number; width: number; height: number } | null,
  dest: string,
  quality = 82
) {
  const src = path.join(PUBLIC, SRC[file as keyof typeof SRC]);
  let pipeline = sharp(src);
  if (area) pipeline = pipeline.extract(area);
  const buf = await pipeline.jpeg({ quality: 95 }).toBuffer();
  await sharp(buf).trim({ threshold: 12 }).webp({ quality, effort: 5 }).toFile(dest);
  const m = await sharp(dest).metadata();
  return { w: m.width!, h: m.height!, size: Math.round((await stat(dest)).size / 1024) };
}

const JOBS = [
  // livro no ateliê, vista de cima — a peça antes de ir para a parede
  { file: 'f1', area: { left: 0, top: 0, width: 805, height: 600 }, out: 'livro-gigante-biblia-no-atelie.webp' },
  // livro na parede com a chama e a luz azul acesas — escada e instalação
  { file: 'f3', area: { left: 0, top: 0, width: 790, height: 590 }, out: 'livro-gigante-na-parede-instalacao.webp' },
  // livro na parede, vista aberta do salão
  { file: 'f3', area: { left: 0, top: 690, width: 790, height: 590 }, out: 'livro-gigante-na-parede-vista-aberta.webp' },
  // livro instalado com o culto em andamento — os fieis vendo a obra
  { file: 'f2', area: null, out: 'livro-gigante-na-igreja-durante-o-culto.webp' },
];

async function run() {
  await mkdir(OUTPUT_DIR, { recursive: true });
  for (const job of JOBS) {
    const dest = path.join(OUTPUT_DIR, job.out);
    const r = await cut(job.file, job.area, dest);
    console.log(`  ✓ ${job.out}  ${r.w}x${r.h}  ${r.size}KB`);
  }
  console.log(`[optimize] ${JOBS.length} imagens em public/blog/livro-gigante-biblia-igreja-universal/`);
}

run().catch((e) => {
  console.error('[optimize] Erro:', e);
  process.exit(1);
});