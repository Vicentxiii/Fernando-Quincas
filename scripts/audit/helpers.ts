/** Utilitários de auditoria — executam os handlers REAIS da aplicação. */

export interface MockRes {
  statusCode: number;
  body: any;
  headers: Record<string, string>;
}

export function makeReq(opts: {
  method?: string;
  body?: unknown;
  query?: Record<string, string>;
  url?: string;
  headers?: Record<string, string>;
}): any {
  const query = opts.query ?? {};
  const search = new URLSearchParams(query).toString();
  return {
    method: opts.method ?? 'POST',
    body: opts.body,
    query,
    url: `${opts.url ?? 'https://fernandoquincas.com.br/api/x'}${search ? `?${search}` : ''}`,
    headers: opts.headers ?? {},
  };
}

export function makeRes(): { res: any; store: MockRes } {
  const store: MockRes = { statusCode: 0, body: undefined as any, headers: {} };
  const res: any = {
    setHeader(k: string, v: string) {
      store.headers[k] = v;
      return res;
    },
    status(code: number) {
      store.statusCode = code;
      return {
        json(body: unknown) {
          store.body = body;
          return body;
        },
      };
    },
  };
  return { res, store };
}

let passed = 0;
let failed = 0;
const failures: string[] = [];

export function check(name: string, cond: boolean, detail?: unknown): void {
  if (cond) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    failed++;
    failures.push(name);
    console.error(`  ✗ ${name}`, detail !== undefined ? JSON.stringify(detail) : '');
  }
}

export function summary(suite: string): boolean {
  console.log(`\n[${suite}] ${passed} passaram, ${failed} falharam`);
  if (failed > 0) {
    console.error('Falhas:', failures);
    return false;
  }
  return true;
}

export function resetCounters(): void {
  passed = 0;
  failed = 0;
  failures.length = 0;
}

// ── Stub do gateway Mercado Pago via global.fetch ──

export interface MpStubConfig {
  pixResponse?: { id?: number; withQr?: boolean };
  paymentLookup?: Record<string, { status: string; externalReference?: string }>;
  calls?: { method: string; path: string; auth?: string }[];
}

export function stubMercadoPago(cfg: MpStubConfig): () => void {
  cfg.calls = cfg.calls ?? [];
  const originalFetch = global.fetch;
  global.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const path = url.replace(/^https:\/\/api\.mercadopago\.com/, '');
    const auth = (init?.headers as Record<string, string>)?.Authorization;
    cfg.calls.push({ method: init?.method ?? 'GET', path, auth });

    if (init?.method === 'POST' && path === '/v1/payments') {
      const okPix = cfg.pixResponse?.withQr !== false;
      return new Response(
        JSON.stringify(
          okPix
            ? {
                id: cfg.pixResponse?.id ?? 99001,
                status: 'pending',
                point_of_interaction: {
                  transaction_data: {
                    qr_code: '00020126BR.GOV.BCB.PIX.TESTE-FQ-67890',
                    qr_code_base64: 'VEVTUUtFWV9R Ul9DQURFTkFJUw==',
                    ticket_url: 'https://mp.example/ticket',
                  },
                },
              }
            : { message: 'qr indisponível' }
        ),
        { status: okPix ? 201 : 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (init?.method === 'POST' && path === '/checkout/preferences') {
      return new Response(
        JSON.stringify({ id: 'PREF-123', init_point: 'https://mp.example/checkout/PREF-123' }),
        { status: 201, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (path.startsWith('/v1/payments/') && init?.method === 'GET') {
      const pid = path.split('/').pop()!;
      const info = cfg.paymentLookup?.[pid];
      return new Response(
        JSON.stringify({
          id: Number(pid),
          status: info?.status ?? 'pending',
          external_reference: info?.externalReference,
        }),
        { status: info ? 200 : 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify({ error: 'unrouted' }), { status: 500 });
  }) as typeof fetch;

  return () => {
    global.fetch = originalFetch;
  };
}
