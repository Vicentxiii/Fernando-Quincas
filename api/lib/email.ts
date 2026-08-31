import { Order } from './types';

/**
 * Arquitetura de e-mails transacionais — pronta para ativação futura.
 *
 * ENV VARS (opcionais hoje):
 * • RESEND_API_KEY → chave da API Resend (https://resend.com)
 * • EMAIL_FROM     → remetente aprovado, ex.: "Ateliê Fernando Quincas <ateliê@fernandoquincas.com.br>"
 *
 * Sem as credenciais, os envios viram no-op registrados em log — nenhum erro é
 * propagado para o fluxo de compra.
 *
 * Enviados: confirmação ao cliente, aviso de venda ao ateliê, atualizações de status.
 */

const ATELIER_INBOX = process.env.ATELIER_EMAIL || 'byfernandoscenesgarden@gmail.com';

function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  if (!isEmailConfigured()) {
    console.info(`[email:no-op] Para: ${to} | Assunto: ${subject}`);
    return;
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html,
      }),
    });
    if (!res.ok) console.error('[email] falha no envio', res.status, await res.text().catch(() => ''));
  } catch (err) {
    console.error('[email] erro de rede', err);
  }
}

function layout(title: string, bodyHtml: string): string {
  return `<!doctype html>
<html lang="pt-BR"><body style="margin:0;background:#FAF8F5;font-family:Georgia,serif;color:#1E1D1A;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <span style="display:inline-block;width:44px;height:44px;line-height:42px;border:1px solid #C8A86B;border-radius:999px;color:#C8A86B;font-family:Cinzel,serif;">FQ</span>
      <div style="margin-top:12px;letter-spacing:.3em;font-size:10px;text-transform:uppercase;color:#C8A86B;font-family:'Courier New',monospace;">Ateliê Fernando Quincas</div>
    </div>
    <h1 style="font-size:26px;font-weight:400;text-align:center;margin:0 0 24px;">${title}</h1>
    <div style="font-size:15px;line-height:1.7;color:#2C2A26;">${bodyHtml}</div>
    <p style="text-align:center;font-size:11px;color:#8A82A5;margin-top:48px;letter-spacing:.2em;text-transform:uppercase;">Onde a arte encontra a natureza</p>
  </div>
</body></html>`;
}

function itemsTable(order: Order): string {
  const rows = order.items
    .map(
      (i) => `<tr>
        <td style="padding:8px 0;border-bottom:1px solid #EAE5D8;">${i.name} <span style="color:#8A82A5;">× ${i.qty}</span></td>
        <td style="padding:8px 0;border-bottom:1px solid #EAE5D8;text-align:right;white-space:nowrap;">R$ ${(i.unitPriceCents / 100).toLocaleString('pt-BR')}</td>
      </tr>`
    )
    .join('');
  return `<table style="width:100%;border-collapse:collapse;font-size:14px;">
    ${rows}
    <tr><td style="padding-top:12px;"><strong>Total</strong></td>
    <td style="padding-top:12px;text-align:right;"><strong>R$ ${(order.totalCents / 100).toLocaleString('pt-BR')}</strong></td></tr>
  </table>`;
}

export async function sendOrderConfirmationToClient(order: Order): Promise<void> {
  await sendEmail(
    order.customer.email,
    `Pedido ${order.code} recebido — Ateliê Fernando Quincas`,
    layout(
      'Seu pedido foi recebido',
      `<p>Olá, ${order.customer.name.split(' ')[0]}.</p>
       <p>Recebemos seu pedido <strong>${order.code}</strong> e ele está registrado no acervo do ateliê.</p>
       ${itemsTable(order)}
       <p style="margin-top:20px;">Você receberá uma confirmação assim que o pagamento for aprovado. O ateliê entrará em contato pessoalmente para tratar embalagem, seguro e logística de entrega.</p>`
    )
  );
}

export async function sendSaleNoticeToAtelier(order: Order): Promise<void> {
  await sendEmail(
    ATELIER_INBOX,
    `Nova venda — Pedido ${order.code} (${(order.totalCents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})`,
    layout(
      `Nova aquisição: ${order.code}`,
      `<p><strong>${order.customer.name}</strong> (${order.customer.email} · ${order.customer.phone})</p>
       ${itemsTable(order)}
       <p style="margin-top:16px;"><strong>Status do pagamento:</strong> ${order.paymentStatus}<br/>
       <strong>Entrega:</strong> ${order.address.street}, ${order.address.number} — ${order.address.district}, ${order.address.city}/${order.address.state} · CEP ${order.address.cep}</p>`
    )
  );
}

export async function sendPaymentStatusUpdate(order: Order): Promise<void> {
  const messages: Record<string, string> = {
    APPROVED: 'Seu pagamento foi confirmado e o ateliê iniciará os preparativos da sua obra.',
    REJECTED: 'Infelizmente o pagamento não foi autorizado pelo banco emissor.',
    CANCELLED: 'O pedido foi cancelado e nenhuma cobrança permanecerá ativa.',
    PENDING: 'Seu pagamento está em processamento.',
  };
  await sendEmail(
    order.customer.email,
    `Atualização do pedido ${order.code} — Ateliê Fernando Quincas`,
    layout(
      'Atualização do seu pedido',
      `<p>Pedido <strong>${order.code}</strong>: ${messages[order.paymentStatus] ?? order.paymentStatus}.</p>
       ${itemsTable(order)}`
    )
  );
}
