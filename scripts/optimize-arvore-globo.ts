/**
 * Otimiza as fotos do projeto Arvore + Globo (showroom / mesa flutuante).
 * As fotos originais sao colagens com varios quadros — aqui recortamos os
 * quadros individuais e exportamos cada um como WEBP leve.
 * Executa: npx tsx scripts/optimize-arvore-globo.ts
 */
import sharp from 'sharp';
import { mkdir, stat } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const PUBLIC = path.join(root, 'public');
const OUTPUT_DIR = path.join(PUBLIC, 'blog/arvore-globo-mesa-flutuante-showroom');

type Area = { left: number; top: number; width: number; height: number };

const f = (n: number) => `Arvore e Globo na metade by fernando QUincas  (${n}).jpeg`;

async function cut(file: string, area: Area | null, dest: string, quality = 82) {
  const src = path.join(PUBLIC, file);
  let pipeline = sharp(src);
  if (area) pipeline = pipeline.extract(area);
  const buf = await pipeline.jpeg({ quality: 95 }).toBuffer();
  await sharp(buf).trim({ threshold: 12 }).webp({ quality, effort: 5 }).toFile(dest);
  const m = await sharp(dest).metadata();
  return { w: m.width!, h: m.height!, size: Math.round((await stat(dest)).size / 1024) };
}

// Grades das colagens 9 e 10 — 2 colunas, cortes por linha
const grid = (x: number, y: number, w: number, h: number): Area => ({ left: x, top: y, width: w, height: h });

const JOBS: { file: string; area: Area | null; out: string }[] = [
  // --- capa: Fernando de pe ao lado do globo na parede ---
  { file: f(7), area: null, out: 'fernando-ao-lado-do-globo-na-parede.webp' },

  // --- globo: processo e pintura ---
  { file: f(1), area: { left: 0, top: 0, width: 800, height: 600 }, out: 'globo-calota-escura-relevo-noite.webp' },
  { file: f(1), area: { left: 0, top: 697, width: 800, height: 500 }, out: 'globo-calota-no-atelie.webp' },
  { file: f(3), area: { left: 0, top: 0, width: 820, height: 610 }, out: 'globo-pintado-azul-e-verde-amea.webp' },
  { file: f(3), area: { left: 0, top: 700, width: 820, height: 566 }, out: 'globo-pintado-azul-e-verde-asia.webp' },

  // --- globo instalado ---
  { file: f(8), area: { left: 0, top: 720, width: 802, height: 601 }, out: 'globo-instalado-parede-do-showroom.webp' },

  // --- mesa flutuante + arvore ---
  { file: f(4), area: { left: 0, top: 0, width: 1006, height: 745 }, out: 'mesa-flutuante-arvore-do-teto.webp' },
  { file: f(5), area: { left: 40, top: 205, width: 1023, height: 750 }, out: 'mesa-flutuante-recepcao-showroom.webp' },
  { file: f(6), area: { left: 0, top: 655, width: 811, height: 622 }, out: 'arvore-iluminada-abertura-no-teto.webp' },
  { file: f(8), area: { left: 0, top: 0, width: 802, height: 610 }, out: 'mesa-flutuante-autor-reunido.webp' },

  // --- estande no shopping (mesma empresa, outro projeto) ---
  { file: f(2), area: { left: 0, top: 0, width: 808, height: 605 }, out: 'estande-bar-shopping-detalhe.webp' },
  { file: f(2), area: { left: 0, top: 690, width: 808, height: 572 }, out: 'estande-bar-shopping-vista-aerea.webp' },

  // --- grade da foto 9 ---
  { file: f(9), area: grid(55, 22, 425, 268), out: 'processo-forma-do-globo.webp' },
  { file: f(9), area: grid(520, 22, 418, 268), out: 'globo-na-parede-com-autor.webp' },
  { file: f(9), area: grid(55, 330, 425, 268), out: 'mesa-flutuante-sala-interna.webp' },
  { file: f(9), area: grid(520, 330, 418, 268), out: 'autor-no-patio-agua.webp' },
  { file: f(9), area: grid(55, 648, 425, 268), out: 'globo-na-parede-escala.webp' },
  { file: f(9), area: grid(520, 648, 418, 268), out: 'mesa-flutuante-ponto-de-encontro.webp' },
  { file: f(9), area: grid(55, 960, 425, 268), out: 'mesa-flutuante-autor-sentado.webp' },
  { file: f(9), area: grid(520, 960, 418, 268), out: 'arvore-e-mesa-visao-conjunta.webp' },
  { file: f(9), area: grid(55, 1275, 425, 268), out: 'globo-instalado-sem-pessoas.webp' },
  { file: f(9), area: grid(520, 1275, 418, 268), out: 'mesa-flutuante-mostruario.webp' },

  // --- grade da foto 10 ---
  { file: f(10), area: grid(55, 22, 418, 268), out: 'mesa-flutuante-panoramica.webp' },
  { file: f(10), area: grid(520, 22, 418, 268), out: 'globo-acabamento-no-atelie.webp' },
  { file: f(10), area: grid(55, 335, 465, 290), out: 'raizes-arvore-detalhe.webp' },
  { file: f(10), area: grid(555, 335, 352, 290), out: 'arvore-estrutura-no-atelie.webp' },
  { file: f(10), area: grid(55, 668, 465, 290), out: 'arvore-base-galhos.webp' },
  { file: f(10), area: grid(555, 668, 352, 290), out: 'arvore-e-globo-no-caminhao.webp' },
  { file: f(10), area: grid(55, 1005, 465, 290), out: 'arvore-instalada-teto-iluminado.webp' },
  { file: f(10), area: grid(555, 1005, 352, 290), out: 'globo-pintura-detalhe.webp' },
  { file: f(10), area: grid(55, 1345, 465, 254), out: 'globo-oceanos-detalhe.webp' },
  { file: f(10), area: grid(555, 1345, 352, 254), out: 'globo-instalado-final.webp' },
];

async function run() {
  await mkdir(OUTPUT_DIR, { recursive: true });
  let total = 0;
  for (const job of JOBS) {
    const dest = path.join(OUTPUT_DIR, job.out);
    const r = await cut(job.file, job.area, dest);
    total += r.size;
    console.log(`  ✓ ${job.out}  ${r.w}x${r.h}  ${r.size}KB`);
  }
  console.log(`[optimize] ${JOBS.length} imagens · ${total}KB · public/blog/arvore-globo-mesa-flutuante-showroom/`);
}

run().catch((e) => {
  console.error('[optimize] Erro:', e);
  process.exit(1);
});