/**
 * Otimiza as fotos do estande de bar em shopping center para WEBP.
 * As fotos originais são colagens com vários quadros — aqui recortamos os
 * quadros individuais e exportamos cada um como WEBP leve.
 * Executa: npx tsx scripts/optimize-estande.ts
 */
import sharp from 'sharp';
import { mkdir, stat } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const PUBLIC = path.join(root, 'public');
const OUTPUT_DIR = path.join(PUBLIC, 'blog/estande-cupom-fiscal-shopping');

const SRC = {
  f1: 'Estande em Shopping Center feito em Fibra de Vidro (1).jpeg', // barril no ateliê
  f2: 'Estande em Shopping Center feito em Fibra de Vidro (2).jpeg', // colagem com vista aérea
  f3: 'Estande em Shopping Center feito em Fibra de Vidro (3).jpeg', // balcão e barril no shopping
  f4: 'Estande em Shopping Center feito em Fibra de Vidro (4).jpeg', // 2 painéis verticais com fogo
  f5: 'Estande em Shopping Center feito em Fibra de Vidro (5).jpeg', // 2 painéis verticais com fogo
};

/** Recorta um quadro da colagem e remove a borda branca em volta da foto */
async function cut(
  file: string,
  area: { left: number; top: number; width: number; height: number },
  dest: string,
  quality = 80
) {
  const src = path.join(PUBLIC, SRC[file as keyof typeof SRC]);
  const buf = await sharp(src).extract(area).jpeg({ quality: 95 }).toBuffer();
  await sharp(buf).trim({ threshold: 12 }).webp({ quality, effort: 5 }).toFile(dest);
  const m = await sharp(dest).metadata();
  return { name: dest, w: m.width, h: m.height };
}

const JOBS = [
  // capa — balcão da troca de cupom fiscal + letreiro + painéis com fogo
  { file: 'f4', area: { left: 0, top: 0, width: 819, height: 655 }, out: 'estande-troca-cupom-fiscal-balcao.webp' },
  // painéis verticais em linha com fogo cinematográfico + vista do corredor
  { file: 'f4', area: { left: 0, top: 655, width: 819, height: 609 }, out: 'estande-paineis-em-linha-fogo-cinematografico.webp' },
  // painéis com vegetação e árvore + balcão de atendimento
  { file: 'f5', area: { left: 0, top: 0, width: 803, height: 645 }, out: 'estande-paineis-com-vegetacao-e-arvore.webp' },
  // balcão, tambor e banquetas altas
  { file: 'f5', area: { left: 0, top: 645, width: 803, height: 632 }, out: 'estande-banquetas-e-tambor-de-premios.webp' },
  // balcão com tambor e arvore, vista ampla
  { file: 'f3', area: { left: 0, top: 0, width: 802, height: 607 }, out: 'estande-atendimento-da-troca.webp' },
  // tambor de prêmios em fibra de vidro no ateliê — bastidores
  { file: 'f1', area: { left: 0, top: 0, width: 595, height: 809 }, out: 'tambor-de-premios-em-fibra-de-vidro.webp' },
  // vista aérea do shopping com o estande montado
  { file: 'f2', area: { left: 520, top: 915, width: 345, height: 290 }, out: 'estande-vista-aerea-no-corredor.webp' },
  // corredor do shopping com o estande em ângulo
  { file: 'f2', area: { left: 50, top: 615, width: 445, height: 290 }, out: 'estande-no-corredor-do-shopping.webp' },
];

async function run() {
  await mkdir(OUTPUT_DIR, { recursive: true });
  const manifest: { slug: string; src: string }[] = [];
  for (const job of JOBS) {
    const dest = path.join(OUTPUT_DIR, job.out);
    const r = await cut(job.file, job.area, dest);
    const size = Math.round((await stat(dest)).size / 1024);
    manifest.push({ slug: r.name, src: SRC[job.file as keyof typeof SRC] });
    console.log(`  ✓ ${job.out}  ${r.w}x${r.h}  ${size}KB`);
  }
  console.log(`[optimize] ${JOBS.length} imagens em public/blog/estande-cupom-fiscal-shopping/`);
  return manifest;
}

run().catch((e) => {
  console.error('[optimize] Erro:', e);
  process.exit(1);
});
