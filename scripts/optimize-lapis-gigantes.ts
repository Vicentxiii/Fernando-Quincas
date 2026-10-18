/**
 * Otimiza as fotos do processo de fabricacao dos lapis gigantes para
 * pesquisa didatica (Aprisco Play) — convertidas para WEBP.
 * Executa: npx tsx scripts/optimize-lapis-gigantes.ts
 */
import sharp from 'sharp';
import { mkdir, stat } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const PUBLIC = path.join(root, 'public');
const OUT = path.join(PUBLIC, 'blog/lapis-gigantes-aprisco-play');

const f = (n: number) => `Processo de fabricacao de Lapis gigante para aprisco didatico (${n}).jpeg`;

const JOBS = [
  { n: 1, out: 'lapis-gigantes-linha-de-producao-prontos', width: 1800 },
  { n: 2, out: 'lapis-gigantes-fase-de-acabamento', width: 1800 },
  { n: 3, out: 'lapis-gigantes-atelie-a-ceu-aberto', width: 1800 },
  { n: 4, out: 'lapis-gigantes-area-do-aprisco-play', width: 1800 },
];

async function run() {
  await mkdir(OUT, { recursive: true });
  for (const j of JOBS) {
    const dest = path.join(OUT, `${j.out}.webp`);
    await sharp(path.join(PUBLIC, f(j.n)))
      .resize({ width: j.width, withoutEnlargement: true })
      .webp({ quality: 84, effort: 5 })
      .toFile(dest);
    const m = await sharp(dest).metadata();
    const size = Math.round((await stat(dest)).size / 1024);
    console.log(`  ✓ ${j.out}  ${m.width}x${m.height}  ${size}KB`);
  }
  console.log(`[optimize] ${JOBS.length} imagens em public/blog/lapis-gigantes-aprisco-play/`);
}

run().catch((e) => {
  console.error('[optimize] Erro:', e);
  process.exit(1);
});