export type PaymentMethod = 'PIX' | 'CARTAO';

/**
 * Estados do pagamento (sincronizados com o gateway Mercado Pago).
 * A confirmação real SEMPRE depende do retorno/webhook do gateway.
 */
export type PaymentStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

/** Estado operacional do pedido dentro do ateliê. */
export type OrderStatus =
  | 'AGUARDANDO_PAGAMENTO'
  | 'PAGAMENTO_CONFIRMADO'
  | 'EM_PREPARACAO'
  | 'ENVIADO'
  | 'ENTREGUE'
  | 'CANCELADO';

export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
  /** CPF é necessário para o gateway de pagamento (Mercado Pago). */
  cpf: string;
}

export interface ShippingAddress {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
}

export interface OrderItem {
  productId: string;
  slug: string;
  name: string;
  /** Preço unitário em centavos, sempre recalculado no backend a partir do catálogo. */
  unitPriceCents: number;
  qty: number;
}

export interface Order {
  id: string;
  /** Código humano exibido ao cliente (FQ-XXXXXX). */
  code: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  items: OrderItem[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  customer: OrderCustomer;
  address: ShippingAddress;
  mpPaymentId?: string | null;
  mpPreferenceId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PixPaymentData {
  method: 'PIX';
  qrCodeBase64: string;
  qrCodeCopyPaste: string;
  ticketUrl?: string;
}

export interface CardPaymentData {
  method: 'CARD';
  initPoint: string;
}

export type PaymentInitiation = PixPaymentData | CardPaymentData | null;

/** Resposta pública de criação de pedido. */
export interface CreateOrderResponse {
  order: Order;
  payment: PaymentInitiation;
  warnings?: string[];
}

export interface FieldErrors {
  [field: string]: string;
}

/** Visão pública do pedido (sem PII) — consumida pela página de acompanhamento. */
export interface OrderPublicItem {
  slug: string;
  name: string;
  qty: number;
  unitPriceCents: number;
}

export interface OrderPublicView {
  id: string;
  code: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  items: OrderPublicItem[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  createdAt: string;
  updatedAt: string;
}
