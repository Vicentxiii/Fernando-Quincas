import sharp from 'sharp';
import { readdir, mkdir, stat } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const INPUT_DIRS = [
  path.join(root, 'public/Alemanha'),
  path.join(root, 'public/Aprisco didatico'),
];
const OUTPUT_DIR = path.join(root, 'public/blog/intercambio-alemanha-waldorf-adolfo-holf');

function slugify(name: string): string {
  const base = name.replace(/\.[^.]+$/, '');
  // remove "by fernando quincas" variations, etc for cleaner slug but keep descriptive
  let s = base.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/by fernando quincas/g, '')
    .replace(/by fernando/g, '')
    .replace(/projeto fernando quincas/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  s = s.replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  // ensure not empty
  if (!s) s = 'imagem';
  return s;
}

async function run() {
  await mkdir(OUTPUT_DIR, { recursive: true });
  const allFiles: { src: string; name: string }[] = [];
  for (const dir of INPUT_DIRS) {
    const files = await readdir(dir);
    for (const f of files) {
      if (!/\.(jpe?g|png)$/i.test(f)) continue;
      allFiles.push({ src: path.join(dir, f), name: f });
    }
  }
  console.log(`[optimize] Encontradas ${allFiles.length} imagens`);
  // ensure unique slugs
  const slugCount = new Map<string, number>();
  const outputs: { src: string; dest: string; slug: string }[] = [];
  for (const { src, name } of allFiles) {
    let slug = slugify(name);
    // handle duplicates
    const count = slugCount.get(slug) || 0;
    slugCount.set(slug, count + 1);
    if (count > 0) slug = `${slug}-${count + 1}`;
    const dest = path.join(OUTPUT_DIR, `${slug}.webp`);
    outputs.push({ src, dest, slug });
  }

  let totalIn = 0, totalOut = 0;
  for (const { src, dest } of outputs) {
    const inStat = await stat(src);
    totalIn += inStat.size;
    await sharp(src)
      .rotate() // auto-orient
      .resize({ width: 1400, withoutEnlargement: true })
      .webp({ quality: 78, effort: 4 })
      .toFile(dest);
    const outStat = await stat(dest);
    totalOut += outStat.size;
    console.log(`  ✓ ${path.basename(src)} -> ${path.basename(dest)}  ${Math.round(inStat.size/1024)}KB -> ${Math.round(outStat.size/1024)}KB`);
  }
  console.log(`[optimize] Concluído: ${outputs.length} webp`);
  console.log(`[optimize] Total: ${Math.round(totalIn/1024)}KB -> ${Math.round(totalOut/1024)}KB  saving ${Math.round(100*(1-totalOut/totalIn))}%`);
  console.log(`[optimize] Pasta: public/blog/intercambio-alemanha-waldorf-adolfo-holf/`);

  // generate manifest json for blog.ts usage
  const manifestPath = path.join(OUTPUT_DIR, 'manifest.json');
  const manifest = outputs.map(o => ({
    original: path.basename(o.src),
    webp: `/blog/intercambio-alemanha-waldorf-adolfo-holf/${path.basename(o.dest)}`,
    slug: o.slug
  }));
  await import('fs/promises').then(m => m.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8'));
  console.log(`[optimize] Manifest: ${manifestPath}`);
}

run().catch(e => { console.error(e); process.exit(1); });
