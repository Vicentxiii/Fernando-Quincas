/**
 * Submete URLs ao IndexNow (Bing, Yandex, Seznam)
 * Uso: tsx scripts/submit-indexnow.ts [--all] [--dry-run] [url1 url2 ...]
 *  --all: envia todas as URLs do sitemap (PRODUCTS + BLOG_POSTS + / , /loja , /blog)
 *  --dry-run: apenas loga sem enviar
 *  sem args: envia apenas URLs que mudaram hoje (lastmod === today) ou todas se for primeiro envio
 *
 * Requer public/{key}.txt já existir e estar deployado em https://fernandoquincas.com.br/{key}.txt
 */
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_URL = 'https://fernandoquincas.com.br';
const SITE_HOST = 'fernandoquincas.com.br';
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const BING_ENDPOINT = 'https://www.bing.com/indexnow'; // fallback

// Key fixa gerada em 2026-09-01 - NÃO regenerar sem atualizar public/{key}.txt
const INDEXNOW_KEY = '20d43b075b2a5fbafd41c9d562ec6214';
const KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;

async function getAllUrls(): Promise<string[]> {
  const { PRODUCTS } = await import('../src/data/products');
  const { BLOG_POSTS } = await import('../src/data/blog');

  const urls: string[] = [];
  urls.push(`${SITE_URL}/`);
  urls.push(`${SITE_URL}/loja`);
  urls.push(`${SITE_URL}/blog`);
  for (const p of BLOG_POSTS) urls.push(`${SITE_URL}/blog/${p.slug}`);
  for (const p of PRODUCTS) urls.push(`${SITE_URL}/loja/${p.slug}`);
  return urls;
}

async function getChangedUrls(): Promise<string[]> {
  // lê sitemap e filtra por lastmod === today
  try {
    const sitemapPath = path.resolve(__dirname, '../public/sitemap.xml');
    const xml = await readFile(sitemapPath, 'utf-8');
    const today = new Date().toISOString().split('T')[0];
    const urlBlocks = xml.split('<url>').slice(1);
    const changed: string[] = [];
    for (const block of urlBlocks) {
      const locMatch = block.match(/<loc>(.*?)<\/loc>/);
      const lastmodMatch = block.match(/<lastmod>(.*?)<\/lastmod>/);
      if (locMatch && lastmodMatch && lastmodMatch[1] === today) {
        changed.push(locMatch[1]);
      }
    }
    // se nada mudou hoje (ex: blog antigo), fallback para todas
    if (changed.length === 0) return getAllUrls();
    return changed;
  } catch {
    return getAllUrls();
  }
}

async function submit(urlList: string[]) {
  if (urlList.length === 0) {
    console.log('[indexnow] Nenhuma URL para enviar');
    return;
  }

  // IndexNow limita 10k URLs por request, chunk de 1000 por segurança
  const chunks: string[][] = [];
  for (let i = 0; i < urlList.length; i += 1000) {
    chunks.push(urlList.slice(i, i + 1000));
  }

  for (const chunk of chunks) {
    const payload = {
      host: SITE_HOST,
      key: INDEXNOW_KEY,
      keyLocation: KEY_LOCATION,
      urlList: chunk,
    };

    console.log(`[indexnow] Enviando ${chunk.length} URLs para ${INDEXNOW_ENDPOINT} ...`);
    // tenta api.indexnow.org primeiro, depois bing.com como fallback
    let res = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    });

    if (!res.ok && res.status >= 400) {
      console.warn(`[indexnow] api.indexnow.org respondeu ${res.status}, tentando bing.com ...`);
      res = await fetch(BING_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(payload),
      });
    }

    const text = await res.text().catch(() => '');
    if (res.ok || res.status === 202) {
      console.log(`[indexnow] Sucesso ${res.status}: ${chunk.length} URLs aceitas`);
      if (text) console.log(`[indexnow] resposta: ${text.slice(0, 500)}`);
    } else {
      console.error(`[indexnow] Falha ${res.status}: ${text.slice(0, 1000)}`);
      // 429 = rate limit, 400 = key não verificada, 403 = forbidden
      if (res.status === 400 || res.status === 403) {
        console.error(`[indexnow] Verifique se ${KEY_LOCATION} está acessível e contém "${INDEXNOW_KEY}"`);
      }
      throw new Error(`IndexNow submit failed ${res.status}`);
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const sendAll = args.includes('--all');
  const explicitUrls = args.filter((a) => a.startsWith('http'));

  let urlList: string[];
  if (explicitUrls.length > 0) {
    urlList = explicitUrls;
  } else if (sendAll) {
    urlList = await getAllUrls();
  } else {
    urlList = await getChangedUrls();
  }

  console.log(`[indexnow] Host: ${SITE_HOST}`);
  console.log(`[indexnow] Key: ${INDEXNOW_KEY}`);
  console.log(`[indexnow] KeyLocation: ${KEY_LOCATION}`);
  console.log(`[indexnow] URLs (${urlList.length}):`);
  urlList.forEach((u) => console.log(`  - ${u}`));

  if (dryRun) {
    console.log('[indexnow] --dry-run: não enviando');
    return;
  }

  await submit(urlList);
  console.log('[indexnow] Concluído');
}

main().catch((e) => {
  console.error('[indexnow] Erro:', e);
  process.exit(1);
});
