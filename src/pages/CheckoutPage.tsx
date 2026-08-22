import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, ChevronLeft, Lock, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';
import { Reveal } from '../components/shop/Reveal';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

const inputClass =
  'w-full px-4 py-3 rounded-xl bg-[#FDFCFB] border border-[#C8A86B]/30 text-sm placeholder:text-[#8A82A5]/70 focus:outline-none focus:border-[#C8A86B] focus:ring-1 focus:ring-[#C8A86B]/40 transition-all';

const labelClass = 'block text-[9px] font-mono tracking-[0.22em] uppercase text-[#8A82A5] mb-1.5';

type ShippingOption = 'ESPECIALIZADA' | 'PADRAO';
type PaymentOption = 'PIX' | 'TRANSFERENCIA' | 'CARTAO';

export const CheckoutPage: React.FC = () => {
  useDocumentMeta({
    title: 'Finalizar Aquisição — Loja',
    description: 'Conclua sua aquisição com atendimento direto do ateliê Fernando Quincas.',
  });

  const navigate = useNavigate();
  const { detailedLines, subtotal, clear } = useCart();
  const [shipping, setShipping] = useState<ShippingOption>('ESPECIALIZADA');
  const [payment, setPayment] = useState<PaymentOption>('PIX');
  const [orderCode, setOrderCode] = useState<string | null>(null);

  const shippingLabel = useMemo(
    () => (shipping === 'ESPECIALIZADA' ? 'Logística especializada de arte' : 'Transporte padrão rastreado'),
    [shipping]
  );

  // ── Confirmation state ──
  if (orderCode) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-[#1E1D1A] flex items-center justify-center px-6 pt-24 pb-16">
        <div className="max-w-lg w-full text-center space-y-6">
          <span className="mx-auto w-16 h-16 rounded-full border border-[#C8A86B]/50 flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-[#C8A86B]" strokeWidth={1.5} />
          </span>
          <span className="block text-[10px] font-mono tracking-[0.3em] uppercase text-[#C8A86B]">
            Pedido Recebido
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-light">
            Obrigado pela <span className="italic text-[#9C7D3E]">confiança</span>
          </h1>
          <p className="font-serif italic text-lg text-[#8A82A5] leading-relaxed">
            Sua aquisição foi registrada sob o código{' '}
            <span className="font-mono not-italic text-sm text-[#1E1D1A]">{orderCode}</span>. O ateliê
            entrará em contato em até 24 horas úteis para confirmar pagamento, embalagem e logística
            de entrega.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/loja"
              className="px-7 py-3.5 rounded-full bg-[#1E1D1A] text-[#FAF8F5] text-[11px] font-mono tracking-widest uppercase hover:bg-[#C8A86B] hover:text-[#1E1D1A] transition-colors"
            >
              Continuar Explorando
            </Link>
            <Link
              to="/"
              className="text-[10px] font-mono tracking-[0.22em] uppercase text-[#8A82A5] hover:text-[#C8A86B] transition-colors underline underline-offset-4 decoration-[#C8A86B]/40"
            >
              Voltar ao Início
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

  // ── Checkout form ──
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = `FQ-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    setOrderCode(code);
    clear();
    window.scrollTo({ top: 0 });
  };

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
              Um formulário único, sem etapas desnecessárias. O ateliê confirma cada pedido
              pessoalmente.
            </p>
          </div>
        </Reveal>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-14">
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
                  </div>
                  <div>
                    <label htmlFor="email" className={labelClass}>E-mail</label>
                    <input id="email" name="email" type="email" required autoComplete="email" placeholder="voce@email.com" className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="telefone" className={labelClass}>Telefone / WhatsApp</label>
                    <input id="telefone" name="telefone" type="tel" required autoComplete="tel" placeholder="(00) 00000-0000" className={inputClass} />
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
                    <input id="cep" name="cep" required autoComplete="postal-code" placeholder="00000-000" className={inputClass} />
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="rua" className={labelClass}>Rua</label>
                    <input id="rua" name="rua" required autoComplete="address-line1" placeholder="Nome da rua" className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="numero" className={labelClass}>Número</label>
                    <input id="numero" name="numero" required autoComplete="address-line2" placeholder="123" className={inputClass} />
                  </div>
                  <div className="col-span-2 sm:col-span-2">
                    <label htmlFor="complemento" className={labelClass}>Complemento (opcional)</label>
                    <input id="complemento" name="complemento" placeholder="Apto, bloco..." className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="bairro" className={labelClass}>Bairro</label>
                    <input id="bairro" name="bairro" required autoComplete="address-level3" placeholder="Bairro" className={inputClass} />
                  </div>
                  <div className="col-span-1">
                    <label htmlFor="cidade" className={labelClass}>Cidade</label>
                    <input id="cidade" name="cidade" required autoComplete="address-level2" placeholder="Cidade" className={inputClass} />
                  </div>
                  <div className="col-span-1">
                    <label htmlFor="uf" className={labelClass}>UF</label>
                    <input id="uf" name="uf" required maxLength={2} autoComplete="address-level1" placeholder="MG" className={`${inputClass} uppercase`} />
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {([
                    { id: 'PIX', title: 'PIX', note: 'Confirmação imediata' },
                    { id: 'TRANSFERENCIA', title: 'Transferência', note: 'TED / DOC bancário' },
                    { id: 'CARTAO', title: 'Cartão', note: 'Link seguro enviado pelo ateliê' },
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
                  Nenhum dado de cartão é coletado aqui — o ateliê envia um link de pagamento seguro.
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
                  Confirmar Pedido
                </button>

                <p className="flex items-start gap-2 text-[11px] font-light text-[#2C2A26]/65 leading-relaxed">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-[#C8A86B]" />
                  Ao confirmar, seu pedido é registrado no ateliê. Você receberá contato pessoal para
                  finalizar pagamento e agendar a entrega.
                </p>
              </div>
            </Reveal>
          </aside>
        </form>
      </div>
    </div>
  );
};
