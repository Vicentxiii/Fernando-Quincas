/**
 * AUDIT 2 — Manipulação de preço/ID/quantidade pelo frontend contra o handler REAL.
 * Executar: npx tsx scripts/audit/run-prices.ts
 */
import { randomUUID } from 'crypto';
import handler from '../../api/create-order';
import { __resetMemoryStoreForTests } from '../../api/lib/db';
import { makeReq, makeRes, check, resetCounters, summary, stubMercadoPago } from './helpers';

process.env.MERCADOPAGO_ACCESS_TOKEN = 'TEST-auditoria-nao-e-credencial-real';

const MULTI = 'p-pomo-de-ouro'; // R$980, stock 40
const SOLD = 'p-lira-das-aguas'; // status SOLD

function validPayload(overrides: Record<string, unknown> = {}) {
  return {
    items: [{ productId: MULTI, qty: 2 }],
    customer: {
      name: 'Maria da Silva',
      email: 'maria@example.com',
      phone: '31999998888',
      cpf: '529.982.247-25',
    },
    address: {
      cep: '30140-071',
      street: 'Rua da Bahia',
      number: '1200',
      district: 'Centro',
      city: 'Belo Horizonte',
      state: 'MG',
    },
    paymentMethod: 'PIX',
    cartToken: randomUUID(),
    ...overrides,
  };
}

async function callCreate(payload: unknown) {
  const { res, store } = makeRes();
  await handler(makeReq({ body: payload }), res);
  return store;
}

resetCounters();
console.log('\n═══ 2. TESTE DE PREÇO (manipulação pelo frontend) ═══');
{
  const restoreFetch = stubMercadoPago({ pixResponse: { id: 9001 } });
  __resetMemoryStoreForTests();

  let r = await callCreate(
    validPayload({
      items: [{ productId: MULTI, qty: 2, price: 1, unitPriceCents: 1, total: 2 }],
    })
  );
  check(
    'preço falsificado é ignorado — total vem do catálogo (R$980 × 2)',
    r.statusCode === 201 && r.body.order.totalCents === 980 * 100 * 2,
    { status: r.statusCode, total: r.body?.order?.totalCents }
  );
  check('subtotal calculado no backend', r.body.order.subtotalCents === 980 * 100 * 2);
  check('shipping = 0 (combinado com o ateliê)', r.body.order.shippingCents === 0);

  r = await callCreate(validPayload({ items: [{ productId: 'p-inexistente', qty: 1 }] }));
  check('ID de produto desconhecido → 409', r.statusCode === 409 && r.body.error === 'CATALOG_CONFLICT');

  r = await callCreate(validPayload({ items: [{ productId: SOLD, qty: 1 }] }));
  check('produto SOLD rejeitado', r.statusCode === 409);

  const qtyCases: [string, number][] = [
    ['negativa', -3],
    ['zero', 0],
    ['fracionária', 2.7],
    ['absurda', 10000],
  ];
  for (const [label, qty] of qtyCases) {
    r = await callCreate(validPayload({ items: [{ productId: MULTI, qty }] }));
    const rejected =
      r.statusCode === 409 || (r.statusCode === 400 && r.body.error === 'VALIDATION_ERROR');
    check(`quantidade ${label} (${qty}) rejeitada`, rejected, { status: r.statusCode });
  }

  r = await callCreate(
    validPayload({ items: [{ productId: MULTI, qty: 39 }, { productId: MULTI, qty: 5 }] })
  );
  check('linhas duplicadas somadas e revalidadas (44 > 40 → 409)', r.statusCode === 409);

  r = await callCreate(validPayload({ items: [] }));
  check('carrinho vazio rejeitado', r.statusCode === 400 || r.statusCode === 409);

  restoreFetch();
}
process.exit(summary('preços') ? 0 : 1);
