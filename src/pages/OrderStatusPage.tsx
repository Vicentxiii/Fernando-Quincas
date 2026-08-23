import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Loader2,
  RefreshCw,
  XCircle,
} from 'lucide-react';
import { PRODUCTS, formatPrice } from '../data/products';
import { useCart } from '../context/CartContext';
import { Reveal } from '../components/shop/Reveal';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { ApiError, getOrderStatus } from '../lib/api';
import type { OrderPublicView } from '../lib/api';

type LoadState = 'loading' | 'error' | 'notFound' | 'ready';

const STATUS_LABELS: Record<OrderPublicView['paymentStatus'], string> = {
  PENDING: 'Pagamento Pendente',
  APPROVED: 'Pagamento Aprovado',
  REJECTED: 'Pagamento Recusado',
  CANCELLED: 'Pedido Cancelado',
};

export const OrderStatusPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { removeItem } = useCart();

  const [state, setState] = useState<LoadState>('loading');
  const [order, setOrder] = useState<OrderPublicView | null>(null);
  const attemptsRef = useRef(0);
  const cleanedCartRef = useRef(false);

  // Pedidos são páginas privadas — fora dos motores de busca.
  useEffect(() => {
    const el = document.createElement('meta');
    el.name = 'robots';
    el.content = 'noindex,nofollow';
    document.head.appendChild(el);
    return () => {
      el.remove();
    };
  }, []);

  useDocumentMeta({
    title: 'Acompanhar Pedido',
    description: 'Acompanhe o status do seu pedido no ateliê Fernando Quincas.',
  });

  const load = async () => {
    if (!id) return;
    setState('loading');
    try {
      const { order: fetched } = await getOrderStatus(id);
      setOrder(fetched);
      setState('ready');

      // Evita recompra acidental: itens já reservados/pagos saem do carrinho.
      if (!cleanedCartRef.current && (fetched.paymentStatus === 'PENDING' || fetched.paymentStatus === 'APPROVED')) {
        cleanedCartRef.current = true;
        for (const item of fetched.items) removeItem(item.slug);
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) setState('notFound');
      else setState('error');
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Polling enquanto o pagamento estiver pendente (Pix confirmação automática).
  useEffect(() => {
    if (state !== 'ready' || order?.paymentStatus !== 'PENDING') return;
    let cancelled = false;

    const timer = window.setInterval(async () => {
      if (attemptsRef.current > 180 || !id) {
        window.clearInterval(timer);
        return;
      }
      attemptsRef.current += 1;
      try {
        const { order: updated } = await getOrderStatus(id);
        if (cancelled) return;
        setOrder(updated);
        if (updated.paymentStatus !== 'PENDING') window.clearInterval(timer);
      } catch {
        // silencioso — próxima tentativa cobre falhas transitórias
      }
    }, 5000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, order?.paymentStatus, id]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E1D1A] flex items-start justify-center px-6 pt-32 sm:pt-40 pb-24">
      <div className="w-full max-w-lg">
        {/* ── Loading ── */}
        {state === 'loading' && (
          <div className="flex flex-col items-center gap-5 py-24 text-center">
            <Loader2 className="w-7 h-7 animate-spin text-[#C8A86B]" strokeWidth={1.5} />
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#8A82A5]">
              Consultando o ateliê…
            </span>
          </div>
        )}

        {/* ── Erro de conexão ── */}
        {state === 'error' && (
          <div className="rounded-3xl border border-[#C8A86B]/30 bg-[#FDFCFB] p-10 text-center space-y-5">
            <AlertCircle className="w-8 h-8 mx-auto text-[#C8A86B]" strokeWidth={1.5} />
            <h1 className="font-serif text-2xl font-light">Conexão interrompida</h1>
            <p className="font-serif italic text-[#8A82A5] leading-relaxed">
              Não conseguimos falar com o ateliê agora. Seu pedido está seguro — tente novamente.
            </p>
            <button
              onClick={() => void load()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1E1D1A] text-[#FAF8F5] text-[11px] font-mono tracking-widest uppercase hover:bg-[#C8A86B] hover:text-[#1E1D1A] transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Tentar novamente
            </button>
          </div>
        )}

        {/* ── Pedido inexistente ── */}
        {state === 'notFound' && (
          <div className="rounded-3xl border border-[#C8A86B]/30 bg-[#FDFCFB] p-10 text-center space-y-5">
            <span className="mx-auto w-14 h-14 rounded-full border border-[#C8A86B]/40 flex items-center justify-center font-display text-sm text-[#C8A86B]">
              FQ
            </span>
            <h1 className="font-serif text-2xl font-light">Pedido não encontrado</h1>
            <p className="font-serif italic text-[#8A82A5] leading-relaxed">
              Este endereço de acompanhamento não corresponde a nenhum pedido registrado.
            </p>
            <Link
              to="/loja"
              className="inline-flex px-6 py-3 rounded-full bg-[#1E1D1A] text-[#FAF8F5] text-[11px] font-mono tracking-widest uppercase hover:bg-[#C8A86B] hover:text-[#1E1D1A] transition-colors"
            >
              Explorar a Loja
            </Link>
          </div>
        )}

        {/* ── Pedido encontrado ── */}
        {state === 'ready' && order && (
          <Reveal>
            <div className="space-y-8">
              {/* Cabeçalho de status */}
              <header className="text-center space-y-4">
                {order.paymentStatus === 'APPROVED' && (
                  <span className="mx-auto w-16 h-16 rounded-full border border-[#C8A86B]/50 flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7 text-[#C8A86B]" strokeWidth={1.5} />
                  </span>
                )}
                {order.paymentStatus === 'PENDING' && (
                  <span className="mx-auto w-16 h-16 rounded-full border border-[#C8A86B]/40 flex items-center justify-center">
                    <Clock3 className="w-7 h-7 text-[#C8A86B]" strokeWidth={1.5} />
                  </span>
                )}
                {(order.paymentStatus === 'REJECTED' || order.paymentStatus === 'CANCELLED') && (
                  <span className="mx-auto w-16 h-16 rounded-full border border-[#6B1D2F]/40 flex items-center justify-center">
                    <XCircle className="w-7 h-7 text-[#6B1D2F]" strokeWidth={1.5} />
                  </span>
                )}

                <div className="space-y-2">
                  <span className="block text-[10px] font-mono tracking-[0.3em] uppercase text-[#C8A86B]">
                    Pedido {order.code}
                  </span>
                  <h1 className="font-serif text-3xl sm:text-4xl font-light">
                    {order.paymentStatus === 'APPROVED' && (
                      <>Pagamento <span className="italic text-[#9C7D3E]">confirmado</span></>
                    )}
                    {order.paymentStatus === 'PENDING' && (
                      <>Aguardando <span className="italic text-[#9C7D3E]">pagamento</span></>
                    )}
                    {order.paymentStatus === 'REJECTED' && (
                      <>Pagamento <span className="italic text-[#6B1D2F]">não autorizado</span></>
                    )}
                    {order.paymentStatus === 'CANCELLED' && (
                      <>Pedido <span className="italic text-[#8A82A5]">cancelado</span></>
                    )}
                  </h1>
                  <p className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.25em] uppercase text-[#8A82A5]">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        order.paymentStatus === 'APPROVED'
                          ? 'bg-[#C8A86B]'
                          : order.paymentStatus === 'PENDING'
                            ? 'bg-[#C8A86B]/60'
                            : 'bg-[#6B1D2F]/70'
                      }`}
                    />
                    {STATUS_LABELS[order.paymentStatus]} ·{' '}
                    {order.paymentMethod === 'PIX' ? 'PIX' : 'Cartão'}
                  </p>
                </div>

                {order.paymentStatus === 'PENDING' && (
                  <p className="font-serif italic text-sm text-[#8A82A5] max-w-sm mx-auto leading-relaxed">
                    Esta página se atualiza sozinha assim que o banco confirmar — normalmente em
                    poucos segundos.
                  </p>
                )}
              </header>

              {/* Resumo das obras */}
              <section className="rounded-3xl border border-[#C8A86B]/30 bg-[#FDFCFB] p-6 sm:p-8 space-y-5">
                <h2 className="font-display text-xs tracking-[0.2em] uppercase border-b border-[#C8A86B]/20 pb-3">
                  Obras do Pedido
                </h2>
                <ul className="space-y-4">
                  {order.items.map((item) => {
                    const product = PRODUCTS.find((p) => p.slug === item.slug);
                    return (
                      <li key={item.slug} className="flex gap-4 items-center">
                        <div className="w-14 h-16 shrink-0 rounded-lg overflow-hidden border border-[#C8A86B]/25 bg-[#EAE5D8]">
                          {product && (
                            <img
                              src={product.images[0]}
                              alt=""
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/loja/${item.slug}`}
                            className="font-serif text-sm truncate block hover:text-[#9C7D3E] transition-colors"
                          >
                            {item.name}
                          </Link>
                          <p className="text-[9px] font-mono tracking-[0.2em] uppercase text-[#C8A86B] mt-0.5">
                            {product?.category ?? 'Obra'} · {item.qty}×
                          </p>
                        </div>
                        <span className="font-mono text-xs whitespace-nowrap">
                          {formatPrice(item.unitPriceCents * item.qty)}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <div className="space-y-2.5 border-t border-[#C8A86B]/20 pt-4 text-sm">
                  <div className="flex justify-between font-light text-[#2C2A26]/85">
                    <span>Subtotal</span>
                    <span className="font-mono text-xs">{formatPrice(order.subtotalCents)}</span>
                  </div>
                  <div className="flex justify-between font-light text-[#2C2A26]/85">
                    <span>Entrega</span>
                    <span className="text-xs font-serif italic text-[#8A82A5]">
                      combinada com o ateliê
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline pt-3 border-t border-[#C8A86B]/20">
                    <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#8A82A5]">
                      Total
                    </span>
                    <span className="font-serif text-xl">{formatPrice(order.totalCents)}</span>
                  </div>
                </div>
              </section>

              {/* Próximos passos */}
              <section className="rounded-3xl border border-[#C8A86B]/25 bg-[#FAF8F5] p-6 sm:p-8 space-y-4">
                <h2 className="font-display text-xs tracking-[0.2em] uppercase">
                  Próximos Passos
                </h2>
                <ol className="space-y-3">
                  {nextStepsFor(order).map((step, i) => (
                    <li key={i} className="flex gap-3 text-xs font-light text-[#2C2A26]/85 leading-relaxed">
                      <span className="font-mono text-[10px] text-[#C8A86B] pt-0.5">{i + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </section>

              {/* Ações */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Link
                  to="/loja"
                  className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#1E1D1A] text-[#FAF8F5] text-[11px] font-mono tracking-widest uppercase hover:bg-[#C8A86B] hover:text-[#1E1D1A] transition-colors"
                >
                  Continuar Explorando
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <a
                  href={`mailto:contato@fernandoquincas.art?subject=${encodeURIComponent(
                    `Dúvida sobre o pedido ${order.code}`
                  )}`}
                  className="text-[10px] font-mono tracking-[0.22em] uppercase text-[#8A82A5] hover:text-[#C8A86B] transition-colors underline underline-offset-4 decoration-[#C8A86B]/40"
                >
                  Falar com o Ateliê
                </a>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
};

function nextStepsFor(order: OrderPublicView): string[] {
  switch (order.paymentStatus) {
    case 'APPROVED':
      return [
        'A confirmação foi registrada e você receberá um resumo por e-mail.',
        'O ateliê entrará em contato pessoalmente em até 24 horas úteis para tratar embalagem, seguro e logística.',
        'Sua obra acompanha certificado de autenticidade assinado por Fernando Quincas.',
      ];
    case 'PENDING':
      return order.paymentMethod === 'PIX'
        ? [
            'Conclua o pagamento pelo aplicativo do seu banco usando o QR Code ou copia-e-cola gerado no checkout.',
            'A confirmação é automática — esta página se atualiza sem que você precise recarregar.',
            'Após a aprovação, o ateliê inicia os preparativos da sua obra.',
          ]
        : [
            'O Mercado Pago está processando a análise da sua operadora.',
            'Assim que houver resposta, o status aqui será atualizado automaticamente.',
            'Em caso de recusa, você pode tentar novamente com outro método.',
          ];
    case 'REJECTED':
      return [
        'A operadora recusou a transação — nenhuma cobrança foi efetivada.',
        'Você pode concluir a aquisição novamente escolhendo outro método de pagamento.',
        'Se o problema persistir, o ateliê pode ajudar pessoalmente.',
      ];
    case 'CANCELLED':
      return [
        'O pedido foi cancelado e nenhuma cobrança permanece ativa.',
        'As obras retornam ao acervo disponível na loja.',
      ];
  }
}
