# Loja Fernando Quincas — E-commerce Real

A loja `/loja` foi transformada em um e-commerce funcional **sem nenhuma alteração visual**.
Este documento descreve a arquitetura, os fluxos e as configurações necessárias.

## Visão geral

```
Navegador (SPA React — design preservado)
   │  fetch /api/* (mesma origem, sem credenciais)
   ▼
Vercel Serverless Functions (/api)          ← preços/estoque validados AQUI
   │                    │
   │                    ├─ Mercado Pago REST (Pix + Checkout Pro cartão)
   │                    └─ Webhook /api/webhooks/mercadopago (assinatura validada)
   ▼
Postgres serverless (Neon/Vercel)           ← pedidos + eventos
```

## Fluxo de compra

1. Carrinho (`CartContext`) — já existente, persiste em `localStorage`, respeita estoque.
2. Checkout (`/loja/checkout`) — formulário atual, agora com CPF e **revisão obrigatória**
   antes de qualquer cobrança.
3. `POST /api/create-order` — o backend:
   - valida todos os campos (CPF com dígito verificador, CEP, UF…);
   - **recalcula preços pelo catálogo oficial** — nada do frontend é confiado;
   - valida estoque descontando reservas de pedidos PENDING/APPROVED;
   - cria o pagamento no Mercado Pago **antes** de persistir (nenhum pedido órfão);
   - devolve QR Pix (base64 + copia-e-cola) ou `init_point` do Checkout Pro.
4. Cartão → redirecionamento ao ambiente hospedado do MP (dados de cartão nunca tocam
   nossos servidores). Retorno via `back_urls` → página do pedido.
5. Pix → tela elegante no próprio checkout com polling a cada 4s.
6. Confirmação REAL: webhook do MP busca o pagamento direto na API oficial
   (nunca confia no corpo da notificação), aplica transição idempotente e dispara e-mails.

Página pública de acompanhamento: `/loja/pedido/:id` (com `noindex`).

## Segurança implementada

- Preços/totais calculados exclusivamente no backend (`api/lib/catalog.ts`).
- Estoque validado no backend com reservas ativas (evita venda dupla).
- **Criação de pedido atômica**: advisory lock + checagem de disponibilidade em uma
  única instrução SQL → concorrência nunca vende a mesma unidade duas vezes.
- **Reservas expiram em 30 min** (`RESERVATION_TTL_MINUTES`): checkout abandonado libera
  o estoque e o pedido vira `CANCELADO` automaticamente.
- **Transições de pagamento monotônicas**: webhooks fora de ordem não regridem status
  (APPROVED nunca volta para PENDING/REJECTED; apenas APPROVED→CANCELLED é permitido).
- **Produção sem banco bloqueia pedidos** (503 `DATABASE_NOT_CONFIGURED` quando
  `VERCEL=1` sem `DATABASE_URL`). Modo memória existe apenas fora da Vercel (dev local),
  sempre sinalizado com `warnings:['NO_DATABASE']`.
- Idempotência por `cartToken` de sessão (duplo-clique não gera dois pedidos).
- Rate limit simples por IP na criação de pedidos.
- Webhook: validação HMAC-SHA256 (`MERCADOPAGO_WEBHOOK_SECRET`), consulta autoritativa
  ao gateway, transições idempotentes, resposta rápida 200.
- Zero dados de cartão armazenados; CPF nunca retornado integralmente pela API pública.
- Credenciais somente em Environment Variables.

## Auditoria / Testes automatizados

```bash
npm run audit   # 5 suítes contra handlers REAIS (gateway MP simulado via fetch stub)
```

Suítes: carrinho (18), manipulação de preço/ID/qtd (11), estoque corrido/idempotência/
expiração/pedido completo (28), webhook duplicado/regressão/assinatura + estados MP (33),
produção sem banco + varredura de credenciais no bundle. Total: 90 verificações.

## Variáveis de ambiente

Ver `.env.example`. Resumo:

| Variável | Obrigatória p/ produção | Uso |
|---|---|---|
| `DATABASE_URL` | Sim (persistência real) | Postgres Neon/Vercel. Sem ela: modo demonstração em memória (avisado na UI). |
| `MERCADOPAGO_ACCESS_TOKEN` | Sim (cobrança real) | Token privado APP_USR-. Sem ela: checkout retorna indisponível. |
| `MERCADOPAGO_PUBLIC_KEY` | Não ainda | Tokenização futura de cartão no frontend. |
| `MERCADOPAGO_WEBHOOK_SECRET` | Recomendado | Valida assinatura das notificações. |
| `APP_URL` | Sim | back_urls/notification_url. |
| `RESEND_API_KEY`, `EMAIL_FROM`, `ATELIER_EMAIL` | Não | E-mails transacionais (no-op até configurar). |

## Banco de dados

Tabelas criadas automaticamente na primeira execução:

```sql
orders(id uuid pk, code unique, cart_token unique, payment_method, payment_status,
       order_status, mp_payment_id, mp_preference_id, subtotal_cents, shipping_cents,
       total_cents, customer jsonb, address jsonb, items jsonb, created_at, updated_at)

order_events(id bigserial pk, order_id fk→orders, type, payload jsonb, created_at)
```

Valores monetários em **centavos (inteiros)**. Trocar o banco depois = reimplementar
somente `api/lib/db.ts` (a interface usada pelos handlers é estável).

## Configurar o Mercado Pago

1. Credenciais de produção em *Suas integrações → Credenciais*.
2. Definir webhook: `https://SEU_DOMINIO/api/webhooks/mercadopago`
   (eventos: *Pagamentos* e *Pedidos*) e copiar a chave secreta para
   `MERCADOPAGO_WEBHOOK_SECRET`.
3. Em produção use token `APP_USR-`; tokens `TEST-` geram sandbox `init_point`.

## E-mails (futuro)

`api/lib/email.ts` já possui confirmação ao cliente, aviso de venda ao ateliê e
atualizações de status — ativam-se sozinhos quando `RESEND_API_KEY` + `EMAIL_FROM`
existirem; antes disso viram entradas de log.

## Modo demonstração (sem env vars)

O site funciona inteiro, mas cada resposta de criação traz `warnings:['NO_DATABASE']`
e a UI exibe aviso explícito de que o pedido **não é persistente**. Nada é simulado
silenciosamente.

## Desenvolvimento local

```bash
npm install
vercel dev        # sobe SPA + functions lendo .env
# ou apenas:
npm run dev       # somente SPA (APIs responderão indisponível)
npm run build     # build de produção
npm run lint      # typecheck
```
