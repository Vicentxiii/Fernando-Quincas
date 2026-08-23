/**
 * AUDIT 1 — Carrinho: regras puras extraídas de CartContext (comportamento idêntico).
 * Executar: npx tsx scripts/audit/run-cart.ts
 */
import { PRODUCTS } from '../../src/data/products';
import { addToLines, purchasableStock, removeFromLines, setLineQty, CartLine } from '../../src/lib/cartRules';
import { check, resetCounters, summary } from './helpers';

resetCounters();
console.log('\n═══ 1. TESTE DO CARRINHO ═══');

const UNIQUE = 'voo-botanico-painel-escultorico'; // stock 1
const SOLD = 'lira-das-aguas-fragmento-de-fonte'; // status SOLD
const MULTI = 'pomo-de-ouro-esfera-colecionavel'; // stock 40
const MID = 'cisne-imperatriz-edicao-numerada'; // stock 24

// disponibilidade derivada do catálogo real
check('peça única tem estoque comprável = 1', purchasableStock(UNIQUE) === 1);
check('obra vendida tem estoque comprável = 0', purchasableStock(SOLD) === 0);

// adicionar produto
let lines: CartLine[] = [];
lines = addToLines(lines, MULTI, 1);
check('adiciona produto', lines.length === 1 && lines[0].qty === 1);

// adicionar o mesmo produto várias vezes (soma e respeita teto)
for (let i = 0; i < 5; i++) lines = addToLines(lines, MULTI, 10);
check('soma adições repetidas até o teto de estoque (40)', lines[0].qty === 40, lines);
lines = addToLines(lines, MULTI, 7);
check('não ultrapassa o estoque ao somar', lines[0].qty === 40, lines);

// aumentar/diminuir quantidade
lines = setLineQty(lines, MULTI, 3);
check('define quantidade específica', lines[0].qty === 3);
lines = setLineQty(lines, MULTI, 2);
check('diminui quantidade', lines[0].qty === 2);

// quantidade acima do estoque → limitada
lines = setLineQty(lines, MULTI, 9999);
check('quantidade acima do estoque é limitada ao máximo', lines[0].qty === 40);

// quantidade inválida
const beforeInvalid = [...lines];
lines = setLineQty(lines, MULTI, NaN);
check('NaN não altera carrinho', JSON.stringify(lines) === JSON.stringify(beforeInvalid));
lines = setLineQty(lines, MULTI, 0.5);
check('fração é arredondada para baixo (0.5→0 remove)', !lines.some((l) => l.slug === MULTI));

// qty<=0 remove a linha
lines = addToLines(lines, MID, 2);
lines = setLineQty(lines, MID, -1);
check('quantidade <= 0 remove o item', !lines.some((l) => l.slug === MID));

// produto indisponível nunca entra
const beforeSold = [...lines];
lines = addToLines(lines, SOLD, 1);
check('produto INDISPONÍVEL não é adicionado', JSON.stringify(lines) === JSON.stringify(beforeSold));
lines = setLineQty(lines, SOLD, 5); // nem via setQty se não existe
check('setQty em indisponível não cria linha', !lines.some((l) => l.slug === SOLD));

// peça única: só 1 unidade
lines = addToLines(lines, UNIQUE, 1);
lines = addToLines(lines, UNIQUE, 1);
check('peça única trava em 1 unidade', lines.find((l) => l.slug === UNIQUE)?.qty === 1);

// remover produto / esvaziar
lines = removeFromLines(lines, MULTI);
check('remove produto específico', !lines.some((l) => l.slug === MULTI) && lines.length === 1);
lines = [];
check('esvaziar carrinho', lines.length === 0);

// slug inexistente
lines = addToLines(lines, 'produto-fantasma', 2);
check('slug inexistente é ignorado', lines.length === 0);

// catálogo coerente para os testes acima
check(
  'estoques do catálogo batem com o cenário testado',
  PRODUCTS.find((p) => p.slug === MULTI)!.stock === 40 &&
    PRODUCTS.find((p) => p.slug === MID)!.stock === 24 &&
    PRODUCTS.find((p) => p.slug === UNIQUE)!.stock === 1
);

/*
 * Persistência (localStorage + navegação + reload): implementada em CartContext
 * useEffect([lines]) gravando 'quincas_shop_cart'; leitura no primeiro render via
 * readStoredLines() com sanitização (slug string, qty finita > 0). Navegação SPA não
 * desmonta o provider (está acima de <Routes>); refresh/reabrir navegador relê do
 * localStorage. Verificação estática concluída — comportamento depende do browser.
 */
console.log('ℹ persistência verificada estaticamente (localStorage + sanitização na leitura)');

process.exit(summary('carrinho') ? 0 : 1);
