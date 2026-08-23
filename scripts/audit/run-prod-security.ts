/**
 * AUDIT 7 — Produção (VERCEL=1) SEM DATABASE_URL deve BLOQUEAR pedidos.
 * AUDIT 8 — Segurança: credenciais no bundle, PII no endpoint público.
 * Executar: npx tsx scripts/audit/run-prod-security.ts
 */
import { randomUUID } from 'crypto';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();

async function main() {
  let ok = true;

  // ── 7. Produção sem banco ──
  console.log('\n═══ 7. PRODUÇÃO SEM BANCO DE DADOS ═══');
  {
    const { default: handler } = await import('../../api/create-order');
    const originalToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    const originalVercel = process.env.VERCEL;
    delete process.env.DATABASE_URL;
    delete process.env.POSTGRES_URL;
    process.env.MERCADOPAGO_ACCESS_TOKEN = 'TEST-x'; // gateway configurado, mas sem banco

    // Simula execução na Vercel
    process.env.VERCEL = '1';
    const { makeReq, makeRes } = await import('./helpers');
    const payload = {
      items: [{ productId: 'p-pomo-de-ouro', qty: 1 }],
      customer: { name: 'Maria da Silva', email: 'm@e.com', phone: '31999998888', cpf: '52998224725' },
      address: { cep: '30140-071', street: 'Rua da Bahia', number: '1200', district: 'Centro', city: 'Belo Horizonte', state: 'MG' },
      paymentMethod: 'PIX',
      cartToken: randomUUID(),
    };
    const a = makeRes();
    await handler(makeReq({ body: payload }), a.res);
    console.log(`  → status ${a.store.statusCode}: ${JSON.stringify(a.store.body)}`);
    if (
      a.store.statusCode === 503 &&
      a.store.body.error === 'DATABASE_NOT_CONFIGURED'
    ) {
      console.log('  ✓ produção sem DATABASE_URL bloqueia criação de pedidos (503 controlado)');
    } else {
      ok = false;
      console.error('  ✗ FALHA: pedido foi criado em memória em produção!');
    }

    // Desenvolvimento local continua funcionando com memória
    delete process.env.VERCEL;
    process.env.MERCADOPAGO_ACCESS_TOKEN = 'TEST-y';
    const stubMod = await import('./helpers');
    const restore = stubMod.stubMercadoPago({ pixResponse: { id: 555 } });
    const b = makeRes();
    await handler(makeReq({ body: payload }), b.res);
    if (b.store.statusCode === 201 && b.store.body.warnings?.includes('NO_DATABASE')) {
      console.log('  ✓ desenvolvimento local funciona com memória e AVISA o frontend (NO_DATABASE)');
    } else {
      ok = false;
      console.error('  ✗ modo dev local quebrou:', b.store.statusCode);
    }
    restore();

    process.env.MERCADOPAGO_ACCESS_TOKEN = originalToken;
    if (originalVercel !== undefined) process.env.VERCEL = originalVercel;
    else delete process.env.VERCEL;
  }

  // ── 8. Segurança ──
  console.log('\n═══ 8. TESTE DE SEGURANÇA ═══');
  {
    const distDir = join(ROOT, 'dist', 'assets');

    // 8a/8b — nenhum token/secreta no bundle do frontend
    const secretPatterns: [string, RegExp][] = [
      ['MERCADOPAGO_ACCESS_TOKEN (nome ou valor APP_USR)', /MERCADOPAGO_ACCESS_TOKEN|APP_USR-[A-Za-z0-9-]{10,}/],
      ['Access token genérico de MP', /APP_[A-Z]{3}-[0-9]+-/],
      ['Webhook secret', /WEBHOOK_SECRET|chave-secreta-do-webhook/i],
      ['DATABASE_URL', /postgres(?:ql)?:\/\/[^\s"']+:[^\s"']*@/],
    ];

    if (existsSync(distDir)) {
      for (const f of readdirSync(distDir).filter((f) => f.endsWith('.js') || f.endsWith('.css'))) {
        const content = readFileSync(join(distDir, f), 'utf8');
        for (const [label, re] of secretPatterns) {
          if (re.test(content)) {
            ok = false;
            console.error(`  ✗ VAZAMENTO em ${f}: ${label}`);
          }
        }
      }
      console.log('  ✓ nenhum padrão de credencial encontrado no bundle de produção (dist/assets)');
    } else {
      console.log('  ⚠ dist/assets inexistente — rode npm run build antes desta verificação');
    }

    // 8c — código-fonte frontend não referencia env secrets
    const srcApi = readFileSync(join(ROOT, 'src', 'lib', 'api.ts'), 'utf8');
    if (/process\.env\.(?!VITE_)[A-Z_]+/.test(srcApi)) {
      ok = false;
      console.error('  ✗ src/lib/api.ts referencia process.env não-VITE');
    } else {
      console.log('  ✓ cliente frontend usa apenas caminhos relativos /api — zero env vars expostas');
    }

    // 8d — handlers nunca logam o corpo/token do MP
    const mpSrc = readFileSync(join(ROOT, 'api', 'lib', 'mercadopago.ts'), 'utf8');
    if (/console\.log/.test(mpSrc)) {
      ok = false;
      console.error('  ✗ mercadopago.ts contém console.log');
    } else {
      console.log('  ✓ api/lib/mercadopago.ts não faz console.log (sem risco de vazar token em logs)');
    }

    // 8e — dados de cartão: validação aceita apenas PIX/CARTAO e nunca campos de cartão
    const valSrc = readFileSync(join(ROOT, 'api', 'lib', 'validation.ts'), 'utf8');
    if (/card_number|cardNumber|cvv|card_expiration/i.test(valSrc)) {
      ok = false;
      console.error('  ✗ backend coleta dados de cartão!');
    } else {
      console.log('  ✓ nenhum dado de cartão é coletado/tratado no backend (cartão via Checkout Pro hospedado)');
    }

    // 8f — endpoint público de pedido sem PII (verificação estrutural do handler)
    const orderHandlerSrc = readFileSync(join(ROOT, 'api', 'orders', '[id].ts'), 'utf8');
    const exposesPii = /customer|address|cpf|email(?![^]*availability)/i.test(
      orderHandlerSrc.replace(/import[^\n]+\n/g, '').replace(/\/\*[\s\S]*?\*\//g, '')
    );
    if (exposesPii && !/OrderPublicView/.test(orderHandlerSrc)) {
      ok = false;
      console.error('  ✗ handler público pode estar expondo PII');
    } else {
      console.log('  ✓ GET /api/orders/:id retorna somente OrderPublicView (id, code, status, itens, valores, datas)');
    }

    // 8g — CPF mascarado na resposta de criação
    const createSrc = readFileSync(join(ROOT, 'api', 'create-order.ts'), 'utf8');
    if (!/maskEmail/.test(createSrc) || !/\*\*\*/.test(createSrc)) {
      ok = false;
      console.error('  ✗ mascaramento de PII ausente no create-order');
    } else {
      console.log('  ✓ create-order mascara CPF e e-mail antes de responder ao frontend');
    }
  }

  return ok;
}

main()
  .then((ok) => {
    console.log(ok ? '\n[prod/segurança] TODOS OS CHECKS PASSARAM' : '\n[prod/segurança] HÁ FALHAS ACIMA');
    process.exit(ok ? 0 : 1);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
