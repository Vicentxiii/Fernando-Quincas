/**
 * AUDIT 3/4 — Corrida de estoque, idempotência, recusa/cancelamento, expiração, pedido completo.
 * Executar: npx tsx scripts/audit/run-stock.ts
 */
import { randomUUID } from 'crypto';
import handler from '../../api/create-order';
import orderHandler from '../../api/orders/[id]';
import {
  __backdateMemoryOrderForTests,
  __resetMemoryStoreForTests,
  applyPaymentTransition,
  getReservedQuantities,
} from '../../api/lib/db';
import { makeReq, makeRes, check, resetCounters, summary, stubMercadoPago } from './helpers';

process.env.MERCADOPAGO_ACCESS_TOKEN = 'TEST-auditoria-nao-e-credencial-real';

const UNIQUE = 'p-voo-botanico-painel'; // stock 1
const MULTI = 'p-pomo-de-ouro';

function validPayload(overrides: Record<string, unknown> = {}) {
  return {
    items: [{ productId: MULTI, qty: 1 }],
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

async function callGetOrder(id: string) {
  const { res, store } = makeRes();
  await orderHandler(makeReq({ method: 'GET', query: { id } }), res);
  return store;
}

resetCounters();

console.log('\n═══ 3. TESTE DE ESTOQUE — duas compras simultâneas, peça única ═══');
let winnerId = '';
{
  const restoreFetch = stubMercadoPago({ pixResponse: { id: 9002 } });
  __resetMemoryStoreForTests();

  const t1 = callCreate(validPayload({ items: [{ productId: UNIQUE, qty: 1 }], cartToken: randomUUID() }));
  const t2 = callCreate(validPayload({ items: [{ productId: UNIQUE, qty: 1 }], cartToken: randomUUID() }));
  const [a, b] = await Promise.all([t1, t2]);
  const statuses = [a.statusCode, b.statusCode].sort();

  check(
    'exatamente UMA compra tem sucesso (201) e a outra falha (409)',
    statuses[0] === 201 && statuses[1] === 409,
    statuses
  );
  const winner = a.statusCode === 201 ? a : b;
  const loser = a.statusCode === 201 ? b : a;
  check('perdedor recebe CATALOG_CONFLICT claro', loser.body?.error === 'CATALOG_CONFLICT', loser.body);
  check('vencedor tem UUID válido', /^[0-9a-f-]{36}$/i.test(winner.body.order.id));

  winnerId = winner.body.order.id;
  const reserved = await getReservedQuantities();
  check('reserva ativa = 1 unidade', reserved.get(UNIQUE) === 1, reserved);

  await applyPaymentTransition(winnerId, { paymentStatus: 'REJECTED' });
  const afterReject = await getReservedQuantities();
  check('pagamento RECUSADO libera a unidade', !afterReject.has(UNIQUE), afterReject);

  restoreFetch();
}

console.log('\n── cancelamento e expiração de reserva (abandono) ──');
{
  __resetMemoryStoreForTests();
  const restoreFetch = stubMercadoPago({ pixResponse: { id: 9003 } });

  let r = await callCreate(validPayload({ items: [{ productId: UNIQUE, qty: 1 }], cartToken: randomUUID() }));
  check('peça única reservada', r.statusCode === 201);
  const orderId = r.body.order.id;

  // CANCELLED libera
  await applyPaymentTransition(orderId, { paymentStatus: 'CANCELLED' });
  let reserved = await getReservedQuantities();
  check('pagamento CANCELADO libera a unidade', !reserved.has(UNIQUE), reserved);

  // Abandono: nova reserva + retroagir criação além do TTL
  r = await callCreate(validPayload({ items: [{ productId: UNIQUE, qty: 1 }], cartToken: randomUUID() }));
  check('nova reserva após cancelamento', r.statusCode === 201);
  const abandonedId = r.body.order.id;
  __backdateMemoryOrderForTests(abandonedId, 31); // TTL = 30 min

  reserved = await getReservedQuantities();
  check('reserva EXPIRADA (checkout abandonado) não bloqueia estoque', !reserved.has(UNIQUE), reserved);

  const statusAfterExpiry = await callGetOrder(abandonedId);
  check(
    'pedido abandonado aparece como CANCELADO na consulta pública',
    statusAfterExpiry.body.order.paymentStatus === 'CANCELLED',
    statusAfterExpiry.body.order?.paymentStatus
  );

  restoreFetch();
}

console.log('\n═══ 4. TESTE DO PEDIDO — estrutura completa ═══');
{
  const restoreFetch = stubMercadoPago({ pixResponse: { id: 777001 } });
  __resetMemoryStoreForTests();

  const token = randomUUID();
  const r = await callCreate(
    validPayload({
      cartToken: token,
      items: [{ productId: MULTI, qty: 3 }],
    })
  );
  check('pedido criado', r.statusCode === 201);
  const o = r.body.order;

  check('possui id (UUID)', typeof o.id === 'string' && /^[0-9a-f-]{36}$/i.test(o.id));
  check('possui código humano FQ-', /^FQ-/i.test(o.code));
  check('possui produtos com nome/slug/preço unitário', o.items[0].name && o.items[0].slug && o.items[0].unitPriceCents === 98000);
  check('possui quantidades', o.items[0].qty === 3);
  check('subtotal correto em centavos', o.subtotalCents === 294000);
  check('total correto', o.totalCents === 294000);
  check('comprador presente (nome/email/telefone)', Boolean(o.customer.name && o.customer.email && o.customer.phone));
  check('CPF mascarado na resposta', /^\d{3}\.\*\*\*\.\*\*\*-\d{2}$/.test(o.customer.cpf), o.customer.cpf);
  check('endereço presente', Boolean(o.address.street && o.address.city && o.address.state && o.address.cep));
  check('status pagamento PENDING', o.paymentStatus === 'PENDING');
  check('status pedido AGUARDANDO_PAGAMENTO', o.orderStatus === 'AGUARDANDO_PAGAMENTO');
  check('data de criação ISO', !Number.isNaN(Date.parse(o.createdAt)));
  check('identificador MP (payment) persistido', o.mpPaymentId === '777001');

  // Endpoint público: sem PII
  const pub = await callGetOrder(o.id);
  const p = pub.body.order;
  check('endpoint público retorna pedido', pub.statusCode === 200 && p.code === o.code);
  const publicKeys = Object.keys(p).sort().join(',');
  check(
    'endpoint público NÃO expõe customer/address/PII',
    !('customer' in p) && !('address' in p),
    publicKeys
  );

  // Idempotência: repetir a MESMA requisição
  const again = await callCreate(validPayload({ cartToken: token, items: [{ productId: MULTI, qty: 3 }] }));
  check(
    'mesma requisição repetida NÃO cria segundo pedido (EXISTING_ORDER)',
    again.statusCode === 200 &&
      again.body.warnings?.includes('EXISTING_ORDER') &&
      again.body.order.id === o.id,
    { status: again.statusCode }
  );
  // token diferente com mesmo carrinho criaria outro pedido (comportamento esperado — carrinho novo)

  // ID inválido no endpoint público
  const bad = await callGetOrder("'; DROP TABLE orders; --");
  check('ID inválido/malicioso → 400', bad.statusCode === 400);

  restoreFetch();
}

process.exit(summary('estoque/pedidos') ? 0 : 1);
