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
  'fernando-quincas-historia-vasos-colunas-fibra-vidro-feira-antiga-01.jpg',
  'fernando-quincas-escultor-atelie-galpao-vasos-colunas-anos-80-02.jpg',
  'fernando-quincas-feira-exposicao-esculturas-gigantes-colunas-03.jpg',
  'fernando-quincas-galpao-obra-monumental-fibra-vidro-historia-04.jpg',
  'fernando-quincas-boneca-eva-gigante-fibra-vidro-playcenter-historia-05.jpg',
  'fernando-quincas-papai-noel-gigante-escultura-natal-blumenau-06.jpg',
  'fernando-quincas-cisnes-brancos-escultura-monumental-fibra-vidro-07.jpg',
  'fernando-quincas-blumenau-centro-decoracao-natal-colunas-08.jpg',
  'fernando-quincas-vasos-ornamentais-colunas-gregas-atelie-09.jpg',
  'fernando-quincas-fontes-cascatas-jardim-paisagismo-fibra-vidro-10.jpg',
  'fernando-quincas-cavalinhos-coloridos-parque-infantil-escultura-11.jpg',
  'fernando-quincas-gruta-caverna-bar-escultura-galpao-atelie-12.jpg',
  'fernando-quincas-balaustres-colunas-gregas-fibra-vidro-13.jpg',
  'fernando-quincas-fonte-cascata-pedra-artificial-jardim-externo-14.jpg',
  'fernando-quincas-jardim-cascata-lago-ornamental-paisagismo-15.jpg',
  'fernando-quincas-fonte-anjo-escultura-jardim-fibra-vidro-16.jpg',
  'fernando-quincas-acervo-historico-feira-antiga-galpao-anos-90-17.jpg',
  'fernando-quincas-obra-gigante-fibra-vidro-feira-negocios-18.jpg',
  'fernando-quincas-escultura-cavalo-parque-diversao-fibra-vidro-19.jpg',
  'fernando-quincas-historia-atelie-jaguari-galpao-fundos-20.jpg',
  'fernando-quincas-colunas-capiteis-ornamentais-fibra-vidro-21.jpg',
  'fernando-quincas-vasos-grandes-jardim-decoracao-externa-22.jpg',
  'fernando-quincas-loja-decoracao-colunas-vasos-feira-23.jpg',
  'fernando-quincas-exposicao-feira-vasos-colunas-decorativas-24.jpg',
  'fernando-quincas-escultura-gigante-boneca-loira-feiras-brasil-25.jpg',
  'fernando-quincas-caminhao-transporte-escultura-gigante-feira-26.jpg',
  'fernando-quincas-estrutura-metalica-galpao-fabricacao-fibra-vidro-27.jpg',
  'fernando-quincas-bastidores-criacao-esculturas-gigantes-galpao-28.jpg',
  'fernando-quincas-historia-decadas-80-90-escultor-brasileiro-29.jpg',
  'fernando-quincas-arte-monumental-fibra-vidro-obras-gigantes-30.jpg',
  'fernando-quincas-paisagismo-fonte-pedra-cascata-jardim-31.jpg',
  'fernando-quincas-jardim-botanico-fonte-lago-escultura-32.jpg',
  'fernando-quincas-fontes-ornamentais-jardim-residencial-33.jpg',
  'fernando-quincas-escultura-urso-parque-infantil-fibra-vidro-34.jpg',
  'fernando-quincas-decoracao-festa-colunas-flores-artificiais-35.jpg',
  'fernando-quincas-moldes-fibra-vidro-galpao-producao-artesanal-36.jpg',
  'fernando-quincas-atelie-producao-vasos-colunas-pintura-37.jpg',
  'fernando-quincas-feira-moveis-decoracao-exposicao-antiga-38.jpg',
  'fernando-quincas-esculturas-jardim-externo-fonte-central-39.jpg',
  'fernando-quincas-galpao-fabricacao-esculturas-gigantes-historia-40.jpg',
  'fernando-quincas-obra-monumental-transporte-caminhao-feira-41.jpg',
  'fernando-quincas-escultura-gigante-montagem-feira-evento-42.jpg',
  'fernando-quincas-historia-viva-atelie-familia-tradicao-escultor-43.jpg',
  'fernando-quincas-acervo-fotografico-livro-historia-esculturas-44.jpg',
  'fernando-quincas-escultor-brasileiro-fibra-vidro-blumenau-sc-45.jpg',
  'fernando-quincas-obras-historicas-galpao-antigo-feira-46.jpg',
  'fernando-quincas-trabalhos-gigantes-transporte-logistica-feira-47.jpg',
  'fernando-quincas-feira-internacional-escultura-gigante-exposicao-48.jpg',
  'fernando-quincas-galpao-jaguari-historia-atelie-fabricacao-49.jpg',
  'fernando-quincas-esculturas-monumentais-brasil-referencia-fibra-vidro-50.jpg',
  'fernando-quincas-livro-historia-capa-acervo-fotografico-51.jpg',
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
