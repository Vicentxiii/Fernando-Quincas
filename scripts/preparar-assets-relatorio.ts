/**
 * Prepara os logos e QR codes para o relatorio em PDF.
 * - Recorta bordas brancas, redimensiona e gera versoes webp/trimadas
 * - Gera QR codes (site, Instagram, LinkedIn) via segno
 * Saida: relatorios/assets/
 * Executa: npx tsx scripts/preparar-assets-relatorio.ts
 */
import sharp from 'sharp';
import { execFileSync } from 'child_process';
import { mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const PUBLIC = path.join(root, 'public');
const OUT = path.join(root, 'relatorios/assets');

const LOGOS: { src: string; out: string; width: number; trim: boolean }[] = [
  { src: 'Transcent Digital Logo.png', out: 'logo-transcent', width: 420, trim: true },
  { src: 'Logo GOOGLE.webp', out: 'logo-google', width: 260, trim: false },
  { src: 'LinkedIn_icon.svg.webp', out: 'logo-linkedin', width: 150, trim: true },
  { src: 'Instagram_logo_2022.svg.webp', out: 'logo-instagram', width: 150, trim: true },
  { src: 'Logo PNG Branco - By Fernando Quincas.webp', out: 'logo-fernando-quincas', width: 420, trim: true },
];

const QRS: { url: string; out: string }[] = [
  { url: 'https://transcentacademy.com.br/transcentdigital', out: 'qr-site-transcent' },
  { url: 'https://www.instagram.com/vicenteczar.dev/', out: 'qr-instagram' },
  { url: 'https://www.linkedin.com/in/vicenteczar/', out: 'qr-linkedin' },
  { url: 'https://fernandoquincas.com.br', out: 'qr-site-fernando-quincas' },
];

async function run() {
  await mkdir(OUT, { recursive: true });

  console.log('--- Logos ---');
  for (const l of LOGOS) {
    let p = sharp(path.join(PUBLIC, l.src));
    if (l.trim) p = p.trim({ threshold: 12 });
    await p
      .resize({ width: l.width, withoutEnlargement: true })
      .png()
      .toFile(path.join(OUT, `${l.out}.png`));
    const m = await sharp(path.join(OUT, `${l.out}.png`)).metadata();
    console.log(`  ✓ ${l.out}  ${m.width}x${m.height}  alpha=${m.hasAlpha}`);
  }

  console.log('--- QR codes ---');
  for (const q of QRS) {
    const dest = path.join(OUT, `${q.out}.png`);
    execFileSync('python', [
      '-c',
      `import segno; segno.make(${JSON.stringify(q.url)}, error='h').save(${JSON.stringify(dest)}, scale=12, border=2, dark='#16251E', light='#FFFFFF')`,
    ]);
    console.log(`  ✓ ${q.out}  ->  ${q.url}`);
  }

  console.log(`\n[assets] em relatorios/assets/`);
}

run().catch((e) => {
  console.error('[assets] Erro:', e);
  process.exit(1);
});