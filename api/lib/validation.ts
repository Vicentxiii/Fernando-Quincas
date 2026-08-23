import { OrderCustomer, ShippingAddress } from './types';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function onlyDigits(value: unknown): string {
  return typeof value === 'string' ? value.replace(/\D+/g, '') : '';
}

export function isValidCpf(rawCpf: string): boolean {
  const cpf = onlyDigits(rawCpf);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(cpf[i]) * (10 - i);
  let d1 = (sum * 10) % 11;
  if (d1 === 10) d1 = 0;
  if (d1 !== Number(cpf[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += Number(cpf[i]) * (11 - i);
  let d2 = (sum * 10) % 11;
  if (d2 === 10) d2 = 0;
  return d2 === Number(cpf[10]);
}

function cleanString(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export interface CheckoutPayloadInput {
  items?: unknown;
  customer?: Record<string, unknown>;
  address?: Record<string, unknown>;
  paymentMethod?: unknown;
  cartToken?: unknown;
}

export interface ValidatedCheckout {
  items: { productId: string; qty: number }[];
  customer: OrderCustomer;
  address: ShippingAddress;
  paymentMethod: 'PIX' | 'CARTAO';
  cartToken: string;
}

export type FieldErrorsMap = Record<string, string>;

/**
 * Validação server-side dos dados de checkout.
 * Retorna erros por campo (chaves compatíveis com os `name` dos inputs do frontend).
 */
export function validateCheckout(
  body: CheckoutPayloadInput
): { ok: true; data: ValidatedCheckout } | { ok: false; errors: FieldErrorsMap } {
  const errors: FieldErrorsMap = {};

  // ── Itens ──
  const rawItems = Array.isArray(body.items) ? body.items : [];
  const items: { productId: string; qty: number }[] = [];
  if (rawItems.length === 0) errors.items = 'Carrinho vazio.';
  for (const item of rawItems) {
    const productId = cleanString((item as { productId?: unknown })?.productId, 120);
    const qty = Number((item as { qty?: unknown })?.qty);
    if (!productId) {
      errors.items = 'Item inválido no carrinho.';
      break;
    }
    if (!Number.isInteger(qty) || qty < 1 || qty > 99) {
      errors.items = 'Quantidade inválida no carrinho.';
      break;
    }
    items.push({ productId, qty });
  }

  // ── Cliente ──
  const c = body.customer ?? {};
  const name = cleanString(c.name, 140);
  const email = cleanString(c.email, 180).toLowerCase();
  const phoneDigits = onlyDigits(c.phone);
  const cpf = onlyDigits(c.cpf);

  if (name.length < 3 || !/\s/.test(name)) errors['customer.name'] = 'Informe seu nome completo.';
  if (!EMAIL_RE.test(email)) errors['customer.email'] = 'E-mail inválido.';
  if (phoneDigits.length < 10 || phoneDigits.length > 13)
    errors['customer.phone'] = 'Telefone inválido (com DDD).';
  if (!isValidCpf(cpf)) errors['customer.cpf'] = 'CPF inválido.';

  const customer: OrderCustomer = {
    name,
    email,
    phone: phoneDigits,
    cpf,
  };

  // ── Endereço ──
  const a = body.address ?? {};
  const cep = onlyDigits(a.cep);
  const street = cleanString(a.street, 180);
  const number = cleanString(a.number, 20);
  const complement = cleanString(a.complement, 120);
  const district = cleanString(a.district, 120);
  const city = cleanString(a.city, 120);
  const state = cleanString(a.state, 2).toUpperCase();

  if (cep.length !== 8) errors['address.cep'] = 'CEP deve ter 8 dígitos.';
  if (street.length < 3) errors['address.street'] = 'Informe a rua.';
  if (!number) errors['address.number'] = 'Informe o número.';
  if (district.length < 2) errors['address.district'] = 'Informe o bairro.';
  if (city.length < 2) errors['address.city'] = 'Informe a cidade.';
  if (state.length !== 2) errors['address.state'] = 'UF inválida.';

  const address: ShippingAddress = { cep, street, number, district, city, state };
  if (complement) address.complement = complement;

  // ── Pagamento ──
  const paymentMethod = body.paymentMethod === 'CARTAO' ? 'CARTAO' : body.paymentMethod === 'PIX' ? 'PIX' : null;
  if (!paymentMethod) errors.paymentMethod = 'Escolha uma forma de pagamento.';

  const cartToken = /^[a-f0-9-]{16,64}$/i.test(cleanString(body.cartToken, 64))
    ? cleanString(body.cartToken, 64)
    : '';

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    data: {
      items,
      customer,
      address,
      paymentMethod,
      // Token gerado pelo cliente evita pedidos duplicados em duplo-clique/retry.
      cartToken:
        cartToken ||
        `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`,
    },
  };
}
