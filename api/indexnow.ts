import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * POST /api/indexnow  - submete URLs ao IndexNow
 * GET  /api/indexnow?dryRun=1 - lista URLs que seriam enviadas (sem enviar)
 * GET  /api/indexnow?check=1 - verifica se key está acessível
 *
 * Body opcional: { urls: string[] }  - se omitido, envia URLs do sitemap com lastmod === today ou todas
 * Auth: se INDEXNOW_SECRET estiver setada, requer header x-indexnow-secret === valor
 *
 * IndexNow Key fixa: 20d43b075b2a5fbafd41c9d562ec6214
 * KeyLocation deve estar em https://fernandoquincas.com.br/20d43b075b2a5fbafd41c9d562ec6214.txt
 */

const SITE_URL = 'https://fernandoquincas.com.br';
const SITE_HOST = 'fernandoquincas.com.br';
const INDEXNOW_KEY = '20d43b075b2a5fbafd41c9d562ec6214';
const KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

// Import dinâmico para não quebrar build se data não existir
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

async function submitToIndexNow(urlList: string[]) {
  const payload = {
    host: SITE_HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  };

  // tenta api.indexnow.org
  let res = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    // fallback bing.com
    res = await fetch('https://www.bing.com/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    });
  }

  const text = await res.text().catch(() => '');
  return { ok: res.ok || res.status === 202, status: res.status, body: text };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS simples para permitir chamada pós-deploy manual
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-indexnow-secret');

  if (req.method === 'OPTIONS') return res.status(204).end();

  // Auth opcional via env INDEXNOW_SECRET
  const secret = process.env.INDEXNOW_SECRET;
  if (secret) {
    const provided = (req.headers['x-indexnow-secret'] as string) || (req.query.secret as string);
    if (provided !== secret) {
      return res.status(401).json({ error: 'Unauthorized - x-indexnow-secret required' });
    }
  }

  // GET ?check=1 - verifica key acessível
  if (req.method === 'GET' && req.query.check) {
    try {
      const r = await fetch(KEY_LOCATION);
      const txt = await r.text();
      return res.status(200).json({
        key: INDEXNOW_KEY,
        keyLocation: KEY_LOCATION,
        fetchStatus: r.status,
        fetchBody: txt.slice(0, 200),
        valid: txt.trim() === INDEXNOW_KEY,
      });
    } catch (e) {
      return res.status(500).json({ error: String(e), keyLocation: KEY_LOCATION });
    }
  }

  // GET ?dryRun=1 - lista URLs sem enviar
  if (req.method === 'GET') {
    const dryRun = req.query.dryRun === '1' || req.query.dryRun === 'true';
    const urls = await getAllUrls();
    if (dryRun) {
      return res.status(200).json({
        dryRun: true,
        host: SITE_HOST,
        key: INDEXNOW_KEY,
        keyLocation: KEY_LOCATION,
        total: urls.length,
        urls,
      });
    }
    // GET sem dryRun também lista, não envia por segurança (use POST para enviar)
    return res.status(200).json({
      message: 'Use POST para enviar. GET com ?dryRun=1 para preview, ?check=1 para validar key',
      host: SITE_HOST,
      key: INDEXNOW_KEY,
      keyLocation: KEY_LOCATION,
      total: urls.length,
      urls: urls.slice(0, 5),
      note: `Total ${urls.length} URLs disponíveis. Envie POST { urls?: string[] }`,
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed, use GET ou POST' });
  }

  try {
    let urlList: string[] = [];
    if (Array.isArray((req.body as any)?.urls) && (req.body as any).urls.length > 0) {
      urlList = (req.body as any).urls.filter((u: string) => typeof u === 'string' && u.startsWith('http'));
    } else {
      urlList = await getAllUrls();
    }

    // valida que urls são do host correto
    urlList = urlList.filter((u) => u.includes(SITE_HOST));
    // limita 10k mas chunk real já é feito no submitToIndexNow (single chunk aqui, script faz chunk)
    if (urlList.length > 10000) urlList = urlList.slice(0, 10000);

    const result = await submitToIndexNow(urlList);

    if (result.ok) {
      return res.status(200).json({
        success: true,
        submitted: urlList.length,
        indexnowStatus: result.status,
        keyLocation: KEY_LOCATION,
      });
    } else {
      return res.status(502).json({
        success: false,
        submitted: urlList.length,
        indexnowStatus: result.status,
        indexnowBody: result.body.slice(0, 1000),
        hint: `Verifique se ${KEY_LOCATION} contém "${INDEXNOW_KEY}" e está público`,
      });
    }
  } catch (e) {
    console.error('[api/indexnow] error', e);
    return res.status(500).json({ error: String(e) });
  }
}
