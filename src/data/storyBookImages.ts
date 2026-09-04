/**
 * Acervo histórico StoryBook — imagens reais em public/Book
 * Nomes foram intencionalmente definidos para SEO/GEO
 * Ordem é a ordem do livro (01 -> 51)
 */

export interface StoryBookImage {
  filename: string;
  src: string;
  alt: string;
  title: string;
  caption: string;
  description: string;
  contentUrl: string;
}

const SITE_URL = 'https://fernandoquincas.com.br';

function humanize(filename: string): string {
  // remove extensão e sufixo numérico -01.jpg
  const base = filename.replace(/-\d+\.(jpg|jpeg|png|webp|mp4)$/i, '').replace(/\.(jpg|jpeg|png|webp|mp4)$/i, '');
  // remove prefixo fernando-quincas- para encurtar
  const withoutPrefix = base.replace(/^fernando-quincas-/, '');
  // hífens -> espaços
  return withoutPrefix.replace(/-/g, ' ');
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function toTitleCase(s: string): string {
  return s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

const filenamesInOrder = [
  'fernando-quincas-historia-vasos-colunas-fibra-vidro-feira-antiga-01.webp',
  'fernando-quincas-escultor-atelie-galpao-vasos-colunas-anos-80-02.webp',
  'fernando-quincas-feira-exposicao-esculturas-gigantes-colunas-03.webp',
  'fernando-quincas-galpao-obra-monumental-fibra-vidro-historia-04.webp',
  'fernando-quincas-boneca-eva-gigante-fibra-vidro-playcenter-historia-05.webp',
  'fernando-quincas-papai-noel-gigante-escultura-natal-blumenau-06.webp',
  'fernando-quincas-cisnes-brancos-escultura-monumental-fibra-vidro-07.webp',
  'fernando-quincas-blumenau-centro-decoracao-natal-colunas-08.webp',
  'fernando-quincas-vasos-ornamentais-colunas-gregas-atelie-09.webp',
  'fernando-quincas-fontes-cascatas-jardim-paisagismo-fibra-vidro-10.webp',
  'fernando-quincas-cavalinhos-coloridos-parque-infantil-escultura-11.webp',
  'fernando-quincas-gruta-caverna-bar-escultura-galpao-atelie-12.webp',
  'fernando-quincas-balaustres-colunas-gregas-fibra-vidro-13.webp',
  'fernando-quincas-fonte-cascata-pedra-artificial-jardim-externo-14.webp',
  'fernando-quincas-jardim-cascata-lago-ornamental-paisagismo-15.webp',
  'fernando-quincas-fonte-anjo-escultura-jardim-fibra-vidro-16.webp',
  'fernando-quincas-acervo-historico-feira-antiga-galpao-anos-90-17.webp',
  'fernando-quincas-obra-gigante-fibra-vidro-feira-negocios-18.webp',
  'fernando-quincas-escultura-cavalo-parque-diversao-fibra-vidro-19.webp',
  'fernando-quincas-historia-atelie-jaguari-galpao-fundos-20.webp',
  'fernando-quincas-colunas-capiteis-ornamentais-fibra-vidro-21.webp',
  'fernando-quincas-vasos-grandes-jardim-decoracao-externa-22.webp',
  'fernando-quincas-loja-decoracao-colunas-vasos-feira-23.webp',
  'fernando-quincas-exposicao-feira-vasos-colunas-decorativas-24.webp',
  'fernando-quincas-escultura-gigante-boneca-loira-feiras-brasil-25.webp',
  'fernando-quincas-caminhao-transporte-escultura-gigante-feira-26.webp',
  'fernando-quincas-estrutura-metalica-galpao-fabricacao-fibra-vidro-27.webp',
  'fernando-quincas-bastidores-criacao-esculturas-gigantes-galpao-28.webp',
  'fernando-quincas-historia-decadas-80-90-escultor-brasileiro-29.webp',
  'fernando-quincas-arte-monumental-fibra-vidro-obras-gigantes-30.webp',
  'fernando-quincas-paisagismo-fonte-pedra-cascata-jardim-31.webp',
  'fernando-quincas-jardim-botanico-fonte-lago-escultura-32.webp',
  'fernando-quincas-fontes-ornamentais-jardim-residencial-33.webp',
  'fernando-quincas-escultura-urso-parque-infantil-fibra-vidro-34.webp',
  'fernando-quincas-decoracao-festa-colunas-flores-artificiais-35.webp',
  'fernando-quincas-moldes-fibra-vidro-galpao-producao-artesanal-36.webp',
  'fernando-quincas-atelie-producao-vasos-colunas-pintura-37.webp',
  'fernando-quincas-feira-moveis-decoracao-exposicao-antiga-38.webp',
  'fernando-quincas-esculturas-jardim-externo-fonte-central-39.webp',
  'fernando-quincas-galpao-fabricacao-esculturas-gigantes-historia-40.webp',
  'fernando-quincas-obra-monumental-transporte-caminhao-feira-41.webp',
  'fernando-quincas-escultura-gigante-montagem-feira-evento-42.webp',
  'fernando-quincas-historia-viva-atelie-familia-tradicao-escultor-43.webp',
  'fernando-quincas-acervo-fotografico-livro-historia-esculturas-44.webp',
  'fernando-quincas-escultor-brasileiro-fibra-vidro-blumenau-sc-45.webp',
  'fernando-quincas-obras-historicas-galpao-antigo-feira-46.webp',
  'fernando-quincas-trabalhos-gigantes-transporte-logistica-feira-47.webp',
  'fernando-quincas-feira-internacional-escultura-gigante-exposicao-48.webp',
  'fernando-quincas-galpao-jaguari-historia-atelie-fabricacao-49.webp',
  'fernando-quincas-esculturas-monumentais-brasil-referencia-fibra-vidro-50.webp',
  'fernando-quincas-livro-historia-capa-acervo-fotografico-51.webp',
];

export const STORYBOOK_IMAGES: StoryBookImage[] = filenamesInOrder.map((filename, idx) => {
  const index = idx + 1;
  const human = humanize(filename);
  const titleHuman = toTitleCase(human);
  const alt = `${capitalize(human)} — acervo histórico do escultor Fernando Quincas, página ${String(index).padStart(2, '0')} de ${filenamesInOrder.length}. Livro de feiras antigas, galpões e obras monumentais em fibra de vidro.`;
  const title = `${titleHuman} | Fernando Quincas — Livro Histórico ${String(index).padStart(2,'0')}/${filenamesInOrder.length}`;
  const caption = `${titleHuman} — fotografia do livro histórico de Fernando Quincas (p. ${index})`;
  const description = `Página ${index} do StoryBook de Fernando Quincas: ${human}. Registro do acervo histórico do ateliê — feiras, galpões e esculturas monumentais em fibra de vidro criadas pelo mestre artesão brasileiro ao longo de quatro décadas.`;
  const src = `/Book/${filename}`;
  const contentUrl = `${SITE_URL}/Book/${encodeURIComponent(filename)}`;
  return { filename, src, alt, title, caption, description, contentUrl };
});

export const STORYBOOK_VIDEO = {
  filename: 'fernando-quincas-historia-video-bastidores-atelie-galpao-obra-monumental.mp4',
  src: '/Book/fernando-quincas-historia-video-bastidores-atelie-galpao-obra-monumental.mp4',
  contentUrl: `${SITE_URL}/Book/fernando-quincas-historia-video-bastidores-atelie-galpao-obra-monumental.mp4`,
  title: 'Fernando Quincas — bastidores do ateliê e galpão, obra monumental em produção',
  alt: 'Vídeo dos bastidores do ateliê galpão de Fernando Quincas, mostrando a fabricação de obra monumental em fibra de vidro',
};
