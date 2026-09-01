import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  Check,
  ChevronLeft,
  Clock3,
  Copy,
  Loader2,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';
import { Reveal } from '../components/shop/Reveal';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import {
  ApiError,
  consumeCartToken,
  createOrder,
  getOrCreateCartToken,
  getOrderStatus,
} from '../lib/api';
import type { FieldErrors } from '../lib/api';

const inputClass =
  'w-full px-4 py-3 rounded-xl bg-[#FDFCFB] border border-[#C8A86B]/30 text-sm placeholder:text-[#8A82A5]/70 focus:outline-none focus:border-[#C8A86B] focus:ring-1 focus:ring-[#C8A86B]/40 transition-all';

const labelClass = 'block text-[9px] font-mono tracking-[0.22em] uppercase text-[#8A82A5] mb-1.5';

const fieldErrorClass = 'mt-1.5 text-[11px] text-[#6B1D2F]';

type ShippingOption = 'ESPECIALIZADA' | 'PADRAO';
type PaymentOption = 'PIX' | 'CARTAO';

/** Mapeia chaves de erro do backend para os inputs do formulário. */
const ERROR_KEY_TO_INPUT: Record<string, string> = {
  'customer.name': 'nome',
  'customer.email': 'email',
  'customer.phone': 'telefone',
  'customer.cpf': 'cpf',
  'address.cep': 'cep',
  'address.street': 'rua',
  'address.number': 'numero',
  'address.district': 'bairro',
  'address.city': 'cidade',
  'address.state': 'uf',
};

function formatCpf(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

interface PixSession {
  orderId: string;
  code: string;
  totalCents: number;
  qrCodeBase64: string;
  qrCodeCopyPaste: string;
  ticketUrl?: string;
}

export const CheckoutPage: React.FC = () => {
  useDocumentMeta({
    title: 'Finalizar Aquisição — Loja',
    description: 'Conclua sua aquisição com atendimento direto do ateliê Fernando Quincas.',
    canonical: 'https://fernandoquincas.com.br/loja/checkout',
    noindex: true,
    type: 'website',
  });

  const navigate = useNavigate();
  const { detailedLines, subtotal, clear } = useCart();
  const [shipping, setShipping] = useState<ShippingOption>('ESPECIALIZADA');
  const [payment, setPayment] = useState<PaymentOption>('PIX');

  // ── Fluxo real de pagamento ──
  const [phase, setPhase] = useState<'form' | 'pix'>('form');
  const [reviewOpen, setReviewOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [pixSession, setPixSession] = useState<PixSession | null>(null);
  const [demoNotice, setDemoNotice] = useState(false);
  const [copied, setCopied] = useState(false);

  const formDataRef = useRef<FormData | null>(null);
  const pollTimerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (pollTimerRef.current) window.clearInterval(pollTimerRef.current);
    },
    []
  );

  // ── Polling do status após criar o pedido Pix ──
  useEffect(() => {
    if (!pixSession) return;
    let cancelled = false;

    const tick = async () => {
      try {
        const { order } = await getOrderStatus(pixSession.orderId);
        if (cancelled) return;
        if (
          order.paymentStatus === 'APPROVED' ||
          order.paymentStatus === 'REJECTED' ||
          order.paymentStatus === 'CANCELLED'
        ) {
          if (pollTimerRef.current) window.clearInterval(pollTimerRef.current);
          navigate(`/loja/pedido/${order.id}`, { replace: true });
        }
      } catch {
        // falhas transitórias de rede não interrompem o polling
      }
    };

    pollTimerRef.current = window.setInterval(tick, 4000);
    return () => {
      cancelled = true;
      if (pollTimerRef.current) window.clearInterval(pollTimerRef.current);
    };
  }, [pixSession, navigate]);

  const shippingLabel = useMemo(
    () => (shipping === 'ESPECIALIZADA' ? 'Logística especializada de arte' : 'Transporte padrão rastreado'),
    [shipping]
  );

  // ── Painel Pix: criação concluída, aguardando confirmação ──
  if (phase === 'pix' && pixSession) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-[#1E1D1A]">
        <div className="pt-32 sm:pt-40 pb-24 px-6 sm:px-8 md:px-12 max-w-7xl mx-auto">
          <div className="max-w-md mx-auto text-center space-y-8">
            <Reveal>
              <div className="rounded-3xl border border-[#C8A86B]/30 bg-[#FDFCFB] p-6 sm:p-10 space-y-6 shadow-[0_18px_50px_rgba(30,29,26,0.06)]">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#C8A86B] block">
                    Pedido {pixSession.code}
                  </span>
                  <h1 className="font-serif text-3xl font-light">
                    Pague com <span className="italic text-[#9C7D3E]">Pix</span>
                  </h1>
                  <p className="font-serif italic text-[#8A82A5] text-sm leading-relaxed">
                    A confirmação é automática assim que o banco aprova o pagamento.
                  </p>
                </div>

                <img
                  src={`data:image/png;base64,${pixSession.qrCodeBase64}`}
                  alt="QR Code Pix do ateliê Fernando Quincas"
                  className="mx-auto w-44 h-44 sm:w-52 sm:h-52 rounded-2xl border border-[#C8A86B]/25 bg-white p-2"
                />

                <p className="font-serif text-2xl">{formatPrice(pixSession.totalCents / 100)}</p>

                {/* Copia e cola */}
                <div className="flex items-stretch rounded-xl border border-[#C8A86B]/35 overflow-hidden bg-[#FAF8F5]">
                  <span className="flex-1 min-w-0 px-4 py-3 text-left font-mono text-[10px] leading-relaxed text-[#2C2A26]/80 break-all">
                    {pixSession.qrCodeCopyPaste}
                  </span>
                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(pixSession.qrCodeCopyPaste);
                      } catch {
                        // clipboard indisponível — usuário pode selecionar manualmente
                      }
                      setCopied(true);
                      window.setTimeout(() => setCopied(false), 2400);
                    }}
                    className={`shrink-0 inline-flex items-center gap-2 px-4 text-[10px] font-mono tracking-[0.18em] uppercase transition-colors ${
                      copied
                        ? 'bg-[#6A7D69] text-[#FAF8F5]'
                        : 'bg-[#1E1D1A] text-[#FAF8F5] hover:bg-[#C8A86B] hover:text-[#1E1D1A]'
                    }`}
                    aria-label="Copiar código Pix"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copiado' : 'Copiar'}
                  </button>
                </div>

                {pixSession.ticketUrl && (
                  <a
                    href={pixSession.ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] uppercase text-[#C8A86B] hover:text-[#9C7D3E] transition-colors underline underline-offset-4 decoration-[#C8A86B]/40"
                  >
                    Abrir comprovante no app do banco
                  </a>
                )}

                {/* Como pagar */}
                <ol className="text-left space-y-2.5 pt-2 border-t border-[#C8A86B]/20">
                  {[
                    'Abra o aplicativo do seu banco e escolha pagar com Pix.',
                    'Escaneie o QR Code ou cole o código copiado.',
                    'O valor cai direto na conta do ateliê — sem taxas para você.',
                  ].map((step, i) => (
                    <li key={i} className="flex gap-3 text-xs font-light text-[#2C2A26]/80 leading-relaxed">
                      <span className="font-mono text-[10px] text-[#C8A86B] pt-0.5">{i + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>

                {/* Status aguardando */}
                <div className="flex items-center justify-center gap-3 pt-3 border-t border-[#C8A86B]/20">
                  <span className="relative flex w-2 h-2">
                    <span className="absolute inline-flex w-full h-full rounded-full bg-[#C8A86B] opacity-60 animate-ping" />
                    <span className="relative inline-flex w-2 h-2 rounded-full bg-[#C8A86B]" />
                  </span>
                  <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-[#8A82A5]">
                    Aguardando confirmação do pagamento…
                  </span>
                </div>

                {demoNotice && (
                  <p className="text-[10px] font-mono tracking-wide text-[#6B1D2F]/80 leading-relaxed">
                    Ambiente de demonstração — configure POSTGRES_URL para persistência dos pedidos.
                  </p>
                )}
              </div>
            </Reveal>

            <Link
              to={`/loja/pedido/${pixSession.orderId}`}
              className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.22em] uppercase text-[#8A82A5] hover:text-[#C8A86B] transition-colors underline underline-offset-4 decoration-[#C8A86B]/40"
            >
              <Clock3 className="w-3.5 h-3.5" />
              Acompanhar status do pedido
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Empty cart state ──
  if (detailedLines.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-[#1E1D1A] flex items-center justify-center px-6 pt-24 pb-16">
        <div className="max-w-md w-full text-center space-y-5">
          <span className="block text-[10px] font-mono tracking-[0.3em] uppercase text-[#C8A86B]">
            Carrinho Vazio
          </span>
          <h1 className="font-serif text-3xl font-light">
            Nenhuma obra selecionada <span className="italic text-[#9C7D3E]">ainda</span>
          </h1>
          <p className="font-serif italic text-[#8A82A5]">
            Escolha uma peça do acervo para iniciar sua aquisição.
          </p>
          <button
            onClick={() => navigate('/loja')}
            className="px-7 py-3.5 rounded-full bg-[#1E1D1A] text-[#FAF8F5] text-[11px] font-mono tracking-widest uppercase hover:bg-[#C8A86B] hover:text-[#1E1D1A] transition-colors"
          >
            Explorar a Loja
          </button>
        </div>
      </div>
    );
  }

  // ── Submissão: abre revisão antes de cobrar ──
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBannerError(null);
    formDataRef.current = new FormData(e.currentTarget);
    setReviewOpen(true);
  };

  const confirmAndPay = async () => {
    const form = formDataRef.current;
    if (!form || submitting) return;

    setSubmitting(true);
    setFieldErrors({});
    setBannerError(null);

    const payload = {
      items: detailedLines.map(({ product, qty }) => ({ productId: product.id, qty })),
      customer: {
        name: String(form.get('nome') ?? ''),
        email: String(form.get('email') ?? ''),
        phone: String(form.get('telefone') ?? ''),
        cpf: String(form.get('cpf') ?? ''),
      },
      address: {
        cep: String(form.get('cep') ?? ''),
        street: String(form.get('rua') ?? ''),
        number: String(form.get('numero') ?? ''),
        complement: String(form.get('complemento') ?? '') || undefined,
        district: String(form.get('bairro') ?? ''),
        city: String(form.get('cidade') ?? ''),
        state: String(form.get('uf') ?? ''),
      },
      paymentMethod: payment,
      cartToken: getOrCreateCartToken(),
    };

    try {
      const result = await createOrder(payload);

      if (result.warnings?.includes('NO_DATABASE')) setDemoNotice(true);
      consumeCartToken();

      if (result.payment?.method === 'CARD') {
        clear();
        window.location.assign(result.payment.initPoint);
        return;
      }
      if (result.payment?.method === 'PIX') {
        clear();
        setPixSession({
          orderId: result.order.id,
          code: result.order.code,
          totalCents: result.order.totalCents,
          qrCodeBase64: result.payment.qrCodeBase64,
          qrCodeCopyPaste: result.payment.qrCodeCopyPaste,
          ticketUrl: result.payment.ticketUrl,
        });
        setPhase('pix');
        window.scrollTo({ top: 0 });
        return;
      }

      // Pedido existente retornado por idempotência sem novo pagamento
      navigate(`/loja/pedido/${result.order.id}`);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.fieldErrors) {
          const mapped: FieldErrors = {};
          for (const [key, message] of Object.entries(err.fieldErrors)) {
            mapped[ERROR_KEY_TO_INPUT[key] ?? key] = message;
          }
          setFieldErrors(mapped);
          const firstInput = Object.values(ERROR_KEY_TO_INPUT).find((inputName) =>
            Object.keys(err.fieldErrors!).some((k) => ERROR_KEY_TO_INPUT[k] === inputName)
          );
          if (firstInput) document.getElementById(firstInput)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        if (!err.fieldErrors || err.code !== 'VALIDATION_ERROR') {
          setBannerError(err.message);
          if (!err.fieldErrors) window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        setBannerError('Não foi possível conectar ao ateliê. Verifique sua conexão e tente novamente.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const fieldError = (inputName: string) =>
    fieldErrors[inputName] ? <p className={fieldErrorClass}>{fieldErrors[inputName]}</p> : null;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E1D1A]">
      <div className="pt-32 sm:pt-40 pb-24 px-6 sm:px-8 md:px-12 max-w-7xl mx-auto">
        {/* Header */}
        <Reveal>
          <button
            onClick={() => navigate('/loja')}
            className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-[0.2em] uppercase text-[#C8A86B] hover:text-[#9C7D3E] transition-colors mb-6"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Continuar navegando na loja
          </button>

          <div className="border-b border-[#C8A86B]/25 pb-8 mb-12 space-y-3">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#C8A86B] block">
              Ateliê • Aquisição Segura
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-light">
              FINALIZAR <span className="italic text-[#9C7D3E]">AQUISIÇÃO</span>
            </h1>
            <p className="font-serif italic text-[#8A82A5] max-w-xl">
              Um formulário único, sem etapas desnecessárias. Revise tudo antes de pagar.
            </p>
          </div>
        </Reveal>

        {bannerError && (
          <div
            role="alert"
            className="mb-10 flex items-start gap-3 rounded-2xl border border-[#6B1D2F]/25 bg-[#6B1D2F]/[0.05] px-5 py-4"
          >
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-[#6B1D2F]" />
            <div className="text-sm text-[#6B1D2F] leading-relaxed">
              <p>{bannerError}</p>
              {fieldErrors.items && <p className="mt-1 text-xs opacity-90">{fieldErrors.items}</p>}
              <Link
                to="/loja"
                className="inline-block mt-2 text-xs underline underline-offset-2 hover:opacity-75 transition-opacity"
              >
                Voltar à loja
              </Link>
            </div>
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-14">
          {/* ── Form column ── */}
          <div className="lg:col-span-7 space-y-12">
            {/* 01 · Identificação */}
            <Reveal>
              <fieldset className="space-y-5">
                <legend className="flex items-baseline gap-3 pb-2 border-b border-[#C8A86B]/20 w-full mb-2">
                  <span className="font-mono text-xs text-[#C8A86B]">01</span>
                  <span className="font-display text-sm tracking-[0.18em] uppercase">Identificação</span>
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label htmlFor="nome" className={labelClass}>Nome completo</label>
                    <input id="nome" name="nome" required autoComplete="name" placeholder="Seu nome" className={inputClass} />
                    {fieldError('nome')}
                  </div>
                  <div>
                    <label htmlFor="email" className={labelClass}>E-mail</label>
                    <input id="email" name="email" type="email" required autoComplete="email" placeholder="voce@email.com" className={inputClass} />
                    {fieldError('email')}
                  </div>
                  <div>
                    <label htmlFor="telefone" className={labelClass}>Telefone / WhatsApp</label>
                    <input id="telefone" name="telefone" type="tel" required autoComplete="tel" placeholder="(00) 00000-0000" className={inputClass} />
                    {fieldError('telefone')}
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="cpf" className={labelClass}>CPF · usado pelo gateway de pagamento</label>
                    <input
                      id="cpf"
                      name="cpf"
                      required
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="000.000.000-00"
                      className={inputClass}
                      onChange={(e) => {
                        e.currentTarget.value = formatCpf(e.currentTarget.value);
                      }}
                    />
                    {fieldError('cpf')}
                  </div>
                </div>
              </fieldset>
            </Reveal>

            {/* 02 · Endereço & Entrega */}
            <Reveal delay={80}>
              <fieldset className="space-y-5">
                <legend className="flex items-baseline gap-3 pb-2 border-b border-[#C8A86B]/20 w-full mb-2">
                  <span className="font-mono text-xs text-[#C8A86B]">02</span>
                  <span className="font-display text-sm tracking-[0.18em] uppercase">Endereço & Entrega</span>
                </legend>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label htmlFor="cep" className={labelClass}>CEP</label>
                    <input id="cep" name="cep" required inputMode="numeric" maxLength={9} autoComplete="postal-code" placeholder="00000-000" className={inputClass} />
                    {fieldError('cep')}
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="rua" className={labelClass}>Rua</label>
                    <input id="rua" name="rua" required autoComplete="address-line1" placeholder="Nome da rua" className={inputClass} />
                    {fieldError('rua')}
                  </div>
                  <div>
                    <label htmlFor="numero" className={labelClass}>Número</label>
                    <input id="numero" name="numero" required autoComplete="address-line2" placeholder="123" className={inputClass} />
                    {fieldError('numero')}
                  </div>
                  <div className="col-span-2 sm:col-span-2">
                    <label htmlFor="complemento" className={labelClass}>Complemento (opcional)</label>
                    <input id="complemento" name="complemento" placeholder="Apto, bloco..." className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="bairro" className={labelClass}>Bairro</label>
                    <input id="bairro" name="bairro" required autoComplete="address-level3" placeholder="Bairro" className={inputClass} />
                    {fieldError('bairro')}
                  </div>
                  <div className="col-span-1">
                    <label htmlFor="cidade" className={labelClass}>Cidade</label>
                    <input id="cidade" name="cidade" required autoComplete="address-level2" placeholder="Cidade" className={inputClass} />
                    {fieldError('cidade')}
                  </div>
                  <div className="col-span-1">
                    <label htmlFor="uf" className={labelClass}>UF</label>
                    <input id="uf" name="uf" required maxLength={2} autoComplete="address-level1" placeholder="MG" className={`${inputClass} uppercase`} />
                    {fieldError('uf')}
                  </div>

                  <div className="col-span-2 sm:col-span-4 pt-2 space-y-3">
                    <span className={labelClass}>Modalidade de envio</span>
                    {([
                      { id: 'ESPECIALIZADA', title: 'Logística especializada de arte', note: 'Embalagem de museu, seguro total e instalação assistida' },
                      { id: 'PADRAO', title: 'Transporte padrão rastreado', note: 'Para peças de pequeno e médio porte' },
                    ] as { id: ShippingOption; title: string; note: string }[]).map((opt) => (
                      <label
                        key={opt.id}
                        className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                          shipping === opt.id
                            ? 'border-[#C8A86B] bg-[#C8A86B]/[0.07]'
                            : 'border-[#C8A86B]/25 hover:border-[#C8A86B]/60'
                        }`}
                      >
                        <input
                          type="radio"
                          name="entrega"
                          value={opt.id}
                          checked={shipping === opt.id}
                          onChange={() => setShipping(opt.id)}
                          className="mt-1 accent-[#C8A86B]"
                        />
                        <span>
                          <span className="block text-sm font-medium">{opt.title}</span>
                          <span className="block text-xs font-light text-[#2C2A26]/70 mt-0.5">{opt.note}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </fieldset>
            </Reveal>

            {/* 03 · Pagamento */}
            <Reveal delay={140}>
              <fieldset className="space-y-4">
                <legend className="flex items-baseline gap-3 pb-2 border-b border-[#C8A86B]/20 w-full mb-2">
                  <span className="font-mono text-xs text-[#C8A86B]">03</span>
                  <span className="font-display text-sm tracking-[0.18em] uppercase">Pagamento</span>
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {([
                    { id: 'PIX', title: 'PIX', note: 'QR Code com confirmação automática' },
                    { id: 'CARTAO', title: 'Cartão de crédito', note: 'Checkout seguro do Mercado Pago' },
                  ] as { id: PaymentOption; title: string; note: string }[]).map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex flex-col gap-1 p-4 rounded-xl border cursor-pointer transition-colors ${
                        payment === opt.id
                          ? 'border-[#C8A86B] bg-[#C8A86B]/[0.07]'
                          : 'border-[#C8A86B]/25 hover:border-[#C8A86B]/60'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="pagamento"
                          value={opt.id}
                          checked={payment === opt.id}
                          onChange={() => setPayment(opt.id)}
                          className="accent-[#C8A86B]"
                        />
                        <span className="text-sm font-medium">{opt.title}</span>
                      </span>
                      <span className="text-xs font-light text-[#2C2A26]/70 pl-6">{opt.note}</span>
                    </label>
                  ))}
                </div>
                <p className="flex items-center gap-2 text-xs font-light text-[#2C2A26]/70 pt-1">
                  <Lock className="w-3.5 h-3.5 text-[#C8A86B]" />
                  Nenhum dado de cartão passa pelo site — pagamento processado pelo Mercado Pago.
                </p>
              </fieldset>
            </Reveal>
          </div>

          {/* ── Summary column ── */}
          <aside className="lg:col-span-5">
            <Reveal delay={120}>
              <div className="rounded-3xl border border-[#C8A86B]/30 bg-[#FDFCFB] p-6 sm:p-8 space-y-6 lg:sticky lg:top-28">
                <h2 className="font-display text-sm tracking-[0.2em] uppercase border-b border-[#C8A86B]/20 pb-4">
                  Resumo da Aquisição
                </h2>

                <ul className="space-y-4 max-h-72 overflow-y-auto pr-1">
                  {detailedLines.map(({ product, qty }) => (
                    <li key={product.slug} className="flex gap-4 items-center">
                      <div className="w-14 h-16 shrink-0 rounded-lg overflow-hidden border border-[#C8A86B]/25 bg-[#EAE5D8]">
                        <img src={product.images[0]} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-sm truncate">{product.name}</p>
                        <p className="text-[9px] font-mono tracking-[0.2em] uppercase text-[#C8A86B] mt-0.5">
                          {product.category} · {qty}×
                        </p>
                      </div>
                      <span className="font-mono text-xs whitespace-nowrap">
                        {formatPrice(product.price * qty)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="space-y-2.5 border-t border-[#C8A86B]/20 pt-4 text-sm">
                  <div className="flex justify-between font-light text-[#2C2A26]/85">
                    <span>Subtotal</span>
                    <span className="font-mono text-xs">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between font-light text-[#2C2A26]/85">
                    <span>Entrega</span>
                    <span className="text-xs font-serif italic text-[#8A82A5] text-right max-w-[180px]">
                      {shippingLabel} · sob cotação
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline pt-3 border-t border-[#C8A86B]/20">
                    <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#8A82A5]">
                      Total das obras
                    </span>
                    <span className="font-serif text-xl">{formatPrice(subtotal)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-[#1E1D1A] text-[#FAF8F5] text-[11px] font-mono tracking-[0.25em] uppercase hover:bg-[#C8A86B] hover:text-[#1E1D1A] transition-colors duration-300 min-h-[52px]"
                >
                  Revisar Pedido
                </button>

                <p className="flex items-start gap-2 text-[11px] font-light text-[#2C2A26]/65 leading-relaxed">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-[#C8A86B]" />
                  Você revisará todos os dados antes de qualquer cobrança. O valor da entrega é
                  combinado pessoalmente com o ateliê após a confirmação.
                </p>
              </div>
            </Reveal>
          </aside>
        </form>
      </div>

      {/* ── Modal de revisão antes do pagamento ── */}
      {reviewOpen && (
        <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-label="Revisar pedido">
          <button
            aria-label="Fechar revisão"
            onClick={() => !submitting && setReviewOpen(false)}
            className="absolute inset-0 bg-[#16251E]/55 backdrop-blur-sm animate-fadeInSoft"
          />
          <div className="relative w-full max-w-lg max-h-[88vh] overflow-y-auto rounded-3xl border border-[#C8A86B]/35 bg-[#FDFCFB] p-6 sm:p-8 space-y-6 animate-fadeInSoft shadow-2xl">
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#C8A86B] block">
                Última verificação
              </span>
              <h2 className="font-serif text-2xl font-light">
                Revise seu <span className="italic text-[#9C7D3E]">pedido</span>
              </h2>
            </div>

            {formDataRef.current && (
              <>
                <div className="space-y-2 text-sm font-light text-[#2C2A26]/85">
                  <p><span className="text-[9px] font-mono tracking-[0.22em] uppercase text-[#C8A86B] block">Comprador</span></p>
                  <p>{String(formDataRef.current.get('nome'))}</p>
                  <p className="text-xs">{String(formDataRef.current.get('email'))} · {String(formDataRef.current.get('telefone'))}</p>
                  <p className="text-xs">CPF {String(formDataRef.current.get('cpf'))}</p>
                </div>

                <div className="space-y-2 text-sm font-light text-[#2C2A26]/85 border-t border-[#C8A86B]/20 pt-4">
                  <p><span className="text-[9px] font-mono tracking-[0.22em] uppercase text-[#C8A86B] block">Entrega</span></p>
                  <p className="leading-relaxed">
                    {String(formDataRef.current.get('rua'))}, {String(formDataRef.current.get('numero'))}
                    {String(formDataRef.current.get('complemento') || '') && ` · ${String(formDataRef.current.get('complemento'))}`}
                    <br />
                    {String(formDataRef.current.get('bairro'))} — {String(formDataRef.current.get('cidade'))}/{String(formDataRef.current.get('uf'))}
                    {' '}· CEP {String(formDataRef.current.get('cep'))}
                  </p>
                </div>

                <div className="space-y-3 border-t border-[#C8A86B]/20 pt-4">
                  <p><span className="text-[9px] font-mono tracking-[0.22em] uppercase text-[#C8A86B]">Pagamento · {payment === 'PIX' ? 'PIX' : 'Cartão de crédito'}</span></p>
                  {detailedLines.map(({ product, qty }) => (
                    <div key={product.slug} className="flex items-center justify-between gap-3 text-sm font-light">
                      <span className="truncate">{product.name} <span className="text-[#8A82A5]">× {qty}</span></span>
                      <span className="font-mono text-xs whitespace-nowrap">{formatPrice(product.price * qty)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-baseline pt-3 border-t border-[#C8A86B]/20">
                    <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#8A82A5]">Total agora</span>
                    <span className="font-serif text-xl">{formatPrice(subtotal)}</span>
                  </div>
                  <p className="text-[11px] font-light text-[#2C2A26]/65">
                    Frete combinado pessoalmente com o ateliê após a confirmação.
                  </p>
                </div>
              </>
            )}

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setReviewOpen(false)}
                disabled={submitting}
                className="px-6 py-3.5 rounded-full border border-[#C8A86B]/40 text-[10px] font-mono tracking-[0.22em] uppercase text-[#2C2A26]/80 hover:border-[#C8A86B] hover:text-[#9C7D3E] transition-colors disabled:opacity-50"
              >
                Voltar e editar
              </button>
              <button
                onClick={confirmAndPay}
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#1E1D1A] text-[#FAF8F5] text-[11px] font-mono tracking-[0.25em] uppercase hover:bg-[#C8A86B] hover:text-[#1E1D1A] transition-colors duration-300 disabled:opacity-60 min-h-[48px]"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {submitting ? 'Processando…' : payment === 'PIX' ? 'Gerar Pix e concluir' : 'Ir para o pagamento'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
