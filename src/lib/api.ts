import type { CreateOrderResponse, FieldErrors, OrderPublicView } from '../../api/lib/types';

/**
 * Cliente tipado das APIs serverless da loja.
 * Todas as chamadas usam caminhos relativos (/api/...) — nenhuma credencial no frontend.
 */

export type { CreateOrderResponse, FieldErrors, OrderPublicView };

export class ApiError extends Error {
  status: number;
  code: string;
  fieldErrors?: FieldErrors;

  constructor(status: number, code: string, message?: string, fieldErrors?: FieldErrors) {
    super(message || 'Ocorreu um erro inesperado.');
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

async function parseError(res: Response): Promise<ApiError> {
  let code = 'UNKNOWN';
  let message: string | undefined;
  let fieldErrors: FieldErrors | undefined;
  try {
    const data = await res.json();
    if (typeof data?.error === 'string') code = data.error;
    if (typeof data?.message === 'string') message = data.message;
    if (data?.fieldErrors && typeof data.fieldErrors === 'object') {
      fieldErrors = data.fieldErrors as FieldErrors;
    }
  } catch {
    // corpo não-JSON
  }

  const friendlyByCode: Record<string, string> = {
    PAYMENT_UNAVAILABLE:
      'O pagamento online está temporariamente indisponível. Tente novamente em instantes ou fale com o ateliê.',
    RATE_LIMITED: 'Muitas tentativas seguidas. Aguarde um momento e tente novamente.',
    CATALOG_CONFLICT:
      'Uma das obras do carrinho não está mais disponível com essa quantidade.',
    VALIDATION_ERROR: 'Revise os campos destacados para continuar.',
    NETWORK: 'Não foi possível conectar ao ateliê. Verifique sua conexão.',
  };

  return new ApiError(res.status, code, message ?? friendlyByCode[code], fieldErrors);
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, {
      ...init,
      headers: init?.body ? { 'Content-Type': 'application/json', ...(init?.headers ?? {}) } : init?.headers,
    });
  } catch {
    throw new ApiError(0, 'NETWORK', undefined, undefined);
  }
  if (!res.ok) throw await parseError(res);
  return (await res.json()) as T;
}

export interface CheckoutPayload {
  items: { productId: string; qty: number }[];
  customer: { name: string; email: string; phone: string; cpf: string };
  address: {
    cep: string;
    street: string;
    number: string;
    complement?: string;
    district: string;
    city: string;
    state: string;
  };
  paymentMethod: 'PIX' | 'CARTAO';
  cartToken: string;
}

export function createOrder(payload: CheckoutPayload): Promise<CreateOrderResponse> {
  return request<CreateOrderResponse>('/api/create-order', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getOrderStatus(orderId: string): Promise<{ order: OrderPublicView }> {
  return request<{ order: OrderPublicView }>(`/api/orders/${orderId}`);
}

/** Token anti-duplicação por sessão de checkout. */
const CART_TOKEN_KEY = 'quincas_checkout_token';

export function getOrCreateCartToken(): string {
  try {
    const existing = sessionStorage.getItem(CART_TOKEN_KEY);
    if (existing) return existing;
    const token =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`;
    sessionStorage.setItem(CART_TOKEN_KEY, token);
    return token;
  } catch {
    return `fallback-${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`;
  }
}

export function consumeCartToken(): void {
  try {
    sessionStorage.removeItem(CART_TOKEN_KEY);
  } catch {
    // ignore
  }
}
