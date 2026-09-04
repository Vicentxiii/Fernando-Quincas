import { MediaArticle } from '../types';

export const MEDIA_ARTICLES: MediaArticle[] = [
  {
    id: 'o-globo-boneca-eva',
    title: 'Sucesso nos anos 1980, boneca Eva está de volta',
    outlet: 'O GLOBO',
    section: 'Brasil / Cultura & Memória Nacional',
    date: 'O Globo Brasil',
    url: 'https://oglobo.globo.com/brasil/sucesso-nos-anos-1980-boneca-eva-esta-de-volta-15186468',
    excerpt: 'A lendária escultura monumental de 45 metros de comprimento, concebida em compósitos de fibra de vidro pelo escultor Fernando Quincas, resgata a memória afetiva de milhões de brasileiros ao apresentar o interior do corpo humano em escala gigante.',
    extendedBody: 'Projetada com 45 metros de extensão e toneladas de compósitos estruturais esculpidos e laminados, a Boneca Eva foi um marco absoluto na história da escultura monumental interativa brasileira. Sucesso inesquecível em grandes parques (Tivoli Parque, Playcenter), a peça foi revitalizada anos depois — intervenção que não passou pelas mãos de Fernando Quincas. A revitalização recebeu muitas críticas do público e da imprensa especializada: comparada ao acabamento original do mestre, a versão revitalizada ficou muito aquém, descaracterizada e sem a alma do original.',
    quote: '"Uma façanha da escultura monumental brasileira: 45 metros de estrutura em fibra de vidro que transcendeu décadas e marcou a imaginação de todo o país."',
    stats: [
      { label: 'Dimensão Monumental', value: '45 Metros' },
      { label: 'Material Estrutural', value: 'Fibra de Vidro & Acrílico' },
      { label: 'Autor da Escultura', value: 'Fernando Quincas' },
      { label: 'Localização Atual', value: 'Teleférico Nova Friburgo — RJ' }
    ],
    tags: ['Escultura Monumental', 'Fibra de Vidro', 'Memória Nacional', '45 Metros', 'O Globo'],
    image: encodeURI('/Eva Original, Playcenter.webp'),
    isMainHeadline: true
  },
  {
    id: 'arquitetura-paisagismo-santuarios',
    title: 'A Nobreza dos Jardins Esculturais e a Fusão da Tradição Rocaille com a Fibra Estrutural',
    outlet: 'REVISTA ARQUITETURA & ARTE',
    section: 'Paisagismo de Prestígio',
    date: 'Caderno de Design & Patrimônio',
    url: '#contact',
    excerpt: 'Como as fontes ornamentais, cisnes majestosos e esculturas sob medida de Fernando Quincas redefinem a paisagem de fazendas históricas e residências de alto padrão no Brasil.',
    extendedBody: 'Ao combinar o requinte do ornamento clássico francês à resistência perene dos compósitos modernos e douração a ouro 24k, o ateliê na Região Serrana converteu-se em referência para colecionadores e arquitetos que buscam obras imponentes integradas à natureza.',
    tags: ['Paisagismo Nobre', 'Fontes Ornamentais', 'Ouro 24k', 'Arquitetura'],
    image: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=1000&q=80',
    isMainHeadline: false
  },
  {
    id: 'jornal-da-serra-talha-douracao',
    title: 'O Renascimento da Douração a Ouro 24k e o Entalhe Escultural na Serra dos Órgãos',
    outlet: 'JORNAL DA SERRA',
    section: 'Artes Plásticas & Saberes Raros',
    date: 'Caderno de Cultura & Tradição',
    url: '#contact',
    excerpt: 'No coração de Minas Gerais, o escultor Fernando Quincas preserva a alquimia ancestral da douração em folha de ouro sobre compósitos esculturais e marcenaria artística fina.',
    extendedBody: 'Cada detalhe curvo é preparado segundo a tradição clássica, recebendo camadas de gesso cré e folha de ouro polida com pedra de ágata, resultando em peças que capturam a luz solar com esplendor incomparável.',
    tags: ['Douração Clássica', 'Folha de Ouro 24k', 'Minas Gerais', 'Artesanato de Luxo'],
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
    isMainHeadline: false
  },
  {
    id: 'critica-belas-artes-compositos',
    title: 'Monumentalidade e Leveza: A Engenharia dos Compósitos na Escultura de Grande Porte',
    outlet: 'PANORAMA DAS ARTES',
    section: 'Crítica Escultórica & Técnica',
    date: 'Ensaio Curatorial',
    url: '#contact',
    excerpt: 'Uma reflexão sobre como Fernando Quincas revolucionou as possibilidades espaciais da escultura ao aliar a leveza da fibra de vidro a geometrias audaciosas que desafiam a gravidade.',
    extendedBody: 'A substituição de toneladas de pedra pesada por compósitos de alta resiliência permitiu a criação de obras com balanços vertiginosos, fontes de múltiplos níveis e esculturas monumentais instaladas em locais de difícil acesso.',
    tags: ['Engenharia Escultórica', 'Crítica de Arte', 'Compósitos Nobres'],
    image: 'https://images.unsplash.com/photo-1516570161787-2fd917215a3d?auto=format&fit=crop&w=1000&q=80',
    isMainHeadline: false
  }
];
