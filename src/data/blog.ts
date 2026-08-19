import { BlogCategory, BlogPost } from '../types';

export const BLOG_CATEGORIES: BlogCategory[] = [
  'ATELIER',
  'PROJETOS',
  'MATERIAIS',
  'JARDIM',
  'IMPRENSA',
  'COMUNIDADE',
];

export const BLOG_CATEGORY_LABELS: Record<BlogCategory, string> = {
  ATELIER: 'Ateliê',
  PROJETOS: 'Projetos',
  MATERIAIS: 'Matérias & Técnicas',
  JARDIM: 'O Jardim',
  IMPRENSA: 'Imprensa',
  COMUNIDADE: 'Comunidade',
};

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'a-douracao-ouro-24k',
    slug: 'a-alquimia-da-douracao-ouro-24k',
    title: 'A Alquimia da Douração: Do Gesso Cré à Folha de Ouro 24k',
    subtitle: 'Um mergulho no ritual centenário que transforma superfícies esculturais em luz dourada.',
    category: 'MATERIAIS',
    date: '2026-08-02',
    author: 'Fernando Quincas',
    authorRole: 'Escultor & Mestre Artesão',
    readingTimeMinutes: 6,
    excerpt:
      'Cada curva dourada de uma escultura carrega horas de preparação: camadas de gesso cré, bolo arménio e folha de ouro polida com pedra de ágata. Conheça o processo que confere brilho eterno às obras do ateliê.',
    coverImage:
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1600&q=85',
    tags: ['Douração Clássica', 'Folha de Ouro', 'Saber-Fazer', 'Petrópolis'],
    featured: true,
    blocks: [
      {
        type: 'paragraph',
        text: 'Há mais de quarenta anos, o ateliê de Fernando Quincas preserva uma das técnicas mais raras e exigentes da escultura decorativa: a douração tradicional a folha de ouro. Longe de ser um simples acabamento, trata-se de um processo alquímico que envolve paciência, precisão milimétrica e um profundo respeito pelos materiais.',
      },
      { type: 'heading', text: 'A preparação da superfície' },
      {
        type: 'paragraph',
        text: 'Antes que o brilho apareça, a peça é lixada e recebe camadas sucessivas de gesso cré, um gesso de alta pureza que cria uma base porosa e perfeitamente lisa. Cada camada é seca, lixada e limpa manualmente, até que a superfície se torne tão uniforme quanto porcelana.',
      },
      {
        type: 'paragraph',
        text: 'Sobre essa base, aplica-se o bolo arménio, uma argila ocre avermelhada que dá profundidade ao dourado e permite que a folha assente com aderência perfeita. É essa camada que confere às peças aquele tom cálido e luminoso característico do ouro antigo.',
      },
      {
        type: 'quote',
        text: 'A folha de ouro não cobre a peça: ela a revela. O dourado só existe quando o artesão compreende como a luz vai viajar sobre a forma.',
        attribution: 'Fernando Quincas',
      },
      { type: 'heading', text: 'Aplicação e brunimento' },
      {
        type: 'paragraph',
        text: 'As folhas de ouro 24k, mais finas que um fio de cabelo, são aplicadas uma a uma com pincéis macios, sendo fixadas por leve pressão. O polimento final é feito com pedra de ágata, que comprime e acomoda o metal à textura, criando superfícies espelhadas que capturam e devolvem a luz natural dos jardins.',
      },
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1516570161787-2fd917215a3d?auto=format&fit=crop&w=1600&q=85',
        alt: 'Detalhe de douração com folha de ouro sobre escultura',
        caption: 'Detalhe de superfície dourada polida com pedra de ágata.',
      },
      {
        type: 'list',
        items: [
          'Preparação com gesso cré de alta pureza',
          'Bolo arménio para aderência e profundidade',
          'Aplicação de folha de ouro 24k folha a folha',
          'Brunimento final com pedra de ágata',
        ],
      },
      {
        type: 'paragraph',
        text: 'É este ritual — repetido centenas de vezes em cada obra — que explica por que as esculturas do ateliê mantêm seu esplendor por décadas, mesmo expostas à intempérie da Serra dos Órgãos.',
      },
    ],
  },
  {
    id: 'cisne-imperatriz-processo',
    slug: 'o-cisne-imperatriz-do-modelo-ao-jardim',
    title: 'O Cisne Imperatriz: Do Modelo ao Jardim',
    subtitle: 'Os bastidores da criação de uma das obras mais emblemáticas do ateliê.',
    category: 'PROJETOS',
    date: '2026-07-18',
    author: 'Fernando Quincas',
    authorRole: 'Escultor & Mestre Artesão',
    readingTimeMinutes: 8,
    excerpt:
      'Um cisne monumental em fibra de vidro, acanto dourado e bacia de travertino. Acompanhe o percurso da ideia ao jardim, das primeiras argilas aos últimos toques de ouro 24k.',
    coverImage:
      'https://images.unsplash.com/photo-1516570161787-2fd917215a3d?auto=format&fit=crop&w=1600&q=85',
    tags: ['Cisne Imperatriz', 'Fibra de Vidro', 'Processo Criativo', 'Jardim'],
    featured: false,
    blocks: [
      {
        type: 'paragraph',
        text: 'Toda grande escultura começa pequena. O Cisne Imperatriz nasceu de um bloco de argila sobre a bancada do ateliê, onde o movimento do pescoço serpentino foi estudado dezenas de vezes até encontrar a curva exata entre a serenidade do lago e a imponência do ouro.',
      },
      { type: 'heading', text: 'O modelo e a estrutura' },
      {
        type: 'paragraph',
        text: 'Após a aprovação do modelo em escala, a obra foi ampliada para 280 × 190 × 210 cm. A estrutura interna em aço garante estabilidade, enquanto o compósito de fibra de vidro de alta densidade recebeu a modelagem final à mão, capturando a textura sedosa das penas.',
      },
      {
        type: 'quote',
        text: 'Um cisne não se desenha no papel. Ele se descobre na massa, girando o volume, observando a luz cair sobre cada pena.',
        attribution: 'Fernando Quincas',
      },
      { type: 'heading', text: 'Da douração à instalação' },
      {
        type: 'paragraph',
        text: 'O acanto clássico que envolve a base foi entalhado folha a folha e recebeu douração tradicional. A instalação no jardim foi planejada para que o sol da manhã atravessasse o pescoço do cisne, projetando sombras douradas sobre a bacia de travertino.',
      },
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=1600&q=85',
        alt: 'Cisne monumental instalado em jardim botânico',
        caption: 'O Cisne Imperatriz em seu habitat definitivo, o jardim.',
      },
    ],
  },
  {
    id: 'compositos-fibra-vidro',
    slug: 'por-que-fibra-de-vidro-escultura-monumental',
    title: 'Por Que Fibra de Vidro? A Engenharia por Trás da Monumentalidade',
    subtitle: 'Leveza estrutural, resiliência e liberdade de formas na escultura de grande porte.',
    category: 'MATERIAIS',
    date: '2026-06-30',
    author: 'Fernando Quincas',
    authorRole: 'Escultor & Mestre Artesão',
    readingTimeMinutes: 5,
    excerpt:
      'Da Boneca Eva aos portais de jardins, os compósitos de fibra de vidro permitiram obras com balanços audaciosos e escalas arquitetônicas que a pedra jamais comportaria.',
    coverImage:
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1600&q=85',
    tags: ['Fibra de Vidro', 'Engenharia', 'Obras Monumentais', 'Técnica'],
    featured: false,
    blocks: [
      {
        type: 'paragraph',
        text: 'A escultura monumental sempre enfrentou o mesmo dilema: como criar formas ousadas e imponentes sem que o peso se tornasse um inimigo? A pedra e o bronze impõem limites físicos que a fibra de vidro simplesmente dissolve.',
      },
      { type: 'heading', text: 'Leveza que desafia a gravidade' },
      {
        type: 'paragraph',
        text: 'Com os compósitos reforçados, é possível criar balanços vertiginosos, asas que parecem flutuar e cascatas de vários níveis. Toneladas de pedra dão lugar a estruturas de poucas centenas de quilos, capazes de ser instaladas em telhados, jardins suspensos e locais de difícil acesso.',
      },
      {
        type: 'quote',
        text: 'A fibra de vidro não é um atalho: é uma libertação. Ela permite que a forma obedeça à imaginação, e não ao peso.',
        attribution: 'Fernando Quincas',
      },
      {
        type: 'list',
        items: [
          'Alta resistência a intempéries e umidade',
          'Pintura e douração aplicáveis como na pedra',
          'Instalação simplificada e menor custo estrutural',
          'Preservação de detalhes finos por décadas',
        ],
      },
      {
        type: 'paragraph',
        text: 'Foi com essa técnica que o ateliê realizou a lendária Boneca Eva, de 45 metros de comprimento, um marco na história da escultura interativa brasileira que segue encantando gerações.',
      },
    ],
  },
  {
    id: 'jardim-santuario-botanico',
    slug: 'jardim-santuario-botanico-visita-guiada',
    title: 'O Jardim como Galeria: Uma Visita Guiada ao Santuário Botânico',
    subtitle: 'Fontes, cisnes e esculturas integrados à flora serrana de Petrópolis.',
    category: 'JARDIM',
    date: '2026-06-08',
    author: 'Ateliê Fernando Quincas',
    authorRole: 'Equipe do Ateliê',
    readingTimeMinutes: 7,
    excerpt:
      'Em meio à Serra dos Órgãos, um parque de esculturas onde a arte e a botânica se encontram em equilíbrio. Um passeio pelas zonas do santuário e as obras que as habitam.',
    coverImage:
      'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=1600&q=85',
    tags: ['Jardim', 'Paisagismo', 'Petrópolis', 'Fontes Ornamentais'],
    featured: false,
    blocks: [
      {
        type: 'paragraph',
        text: 'O santuário botânico não é um jardim com esculturas: é uma galeria viva. Cada zona foi desenhada para que uma obra dialogue com determinada flora, umidade e incidência de luz.',
      },
      { type: 'heading', text: 'O lago dos cisnes' },
      {
        type: 'paragraph',
        text: 'No ponto mais sereno do parque, o Cisne Imperatriz emerge de um espelho d’água cercado por agapantos e salgueiros. A bacia de travertino foi esculpida para refletir o céu da serra, criando um quadro que muda a cada hora do dia.',
      },
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1600&q=85',
        alt: 'Lago do santuário botânico com escultura de cisne',
        caption: 'O espelho d’água e o cisne em conversa permanente com a serra.',
      },
      { type: 'heading', text: 'A praça das fontes' },
      {
        type: 'paragraph',
        text: 'Mais adiante, as fontes rocaille de três níveis conduzem a água por conchas entalhadas, produzindo uma melodia acústica constante. Bromélias e costelas-de-adão completam a cena, provando que a arte hidráulica pode ser ao mesmo tempo técnica e poesia.',
      },
    ],
  },
  {
    id: 'boneca-eva-retorno',
    slug: 'boneca-eva-45-metros-retorno-nova-friburgo',
    title: 'Boneca Eva: O Retorno de um Ícone de 45 Metros',
    subtitle: 'A monumental escultura interativa ressurge no Parque do Teleférico em Nova Friburgo.',
    category: 'IMPRENSA',
    date: '2026-05-22',
    author: 'Assessoria de Imprensa',
    authorRole: 'Ateliê Fernando Quincas',
    readingTimeMinutes: 4,
    excerpt:
      'Sucesso nos anos 1980, a boneca gigante em fibra de vidro voltou a receber visitantes, resgatando a memória afetiva de milhões de brasileiros.',
    coverImage:
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1600&q=85',
    tags: ['Boneca Eva', 'Escultura Monumental', 'Fibra de Vidro', 'Memória Nacional'],
    featured: false,
    blocks: [
      {
        type: 'paragraph',
        text: 'Projetada com 45 metros de extensão e toneladas de compósitos estruturais esculpidos e laminados, a Boneca Eva foi um marco absoluto na história da escultura monumental interativa brasileira.',
      },
      {
        type: 'paragraph',
        text: 'Sucesso inesquecível em grandes parques como Tivoli Parque e Playcenter, a atração foi revitalizada e hoje encanta novas e antigas gerações no Parque do Teleférico em Nova Friburgo (RJ).',
      },
      {
        type: 'quote',
        text: 'Uma façanha da escultura monumental brasileira: 45 metros de estrutura em fibra de vidro que transcendeu décadas e marcou a imaginação de todo o país.',
        attribution: 'O Globo',
      },
      {
        type: 'paragraph',
        text: 'O público realiza um percurso imersivo por dentro dos órgãos humanos, celebrando o pioneirismo técnico e volumétrico de Fernando Quincas na escultura em fibra de vidro.',
      },
    ],
  },
  {
    id: 'novos-rumos-atelie',
    slug: 'novos-rumos-do-atelie-2026',
    title: 'Novos Rumos: O Ateliê e a Nova Geração de Artesãos',
    subtitle: 'Como o saber-fazer é transmitido aos próximos mestres da escultura ornamental.',
    category: 'ATELIER',
    date: '2026-04-11',
    author: 'Fernando Quincas',
    authorRole: 'Escultor & Mestre Artesão',
    readingTimeMinutes: 6,
    excerpt:
      'A arte não morre quando é ensinada. Neste artigo, Fernando Quincas reflete sobre a formação de novos artesãos e a continuidade das técnicas clássicas no século XXI.',
    coverImage:
      'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1600&q=85',
    tags: ['Ateliê', 'Formação', 'Saber-Fazer', 'Tradição'],
    featured: false,
    blocks: [
      {
        type: 'paragraph',
        text: 'Um ateliê não é apenas um espaço de produção: é uma escola silenciosa. Cada bancada carrega décadas de experimentação, e cada artesão que ali trabalha carrega um pedaço dessa memória.',
      },
      { type: 'heading', text: 'O mestre e o aprendiz' },
      {
        type: 'paragraph',
        text: 'A transmissão do saber acontece menos em aulas formais e mais na observação diária: no gesto de preparar um gesso, no tempo exato de secagem de uma camada de verniz, na pressão certa da pedra de ágata sobre a folha de ouro.',
      },
      {
        type: 'quote',
        text: 'As mãos aprendem o que a memória não consegue registrar. Por isso ensinar é repetir, corrigir e repetir de novo, até que o gesto se torne intuição.',
        attribution: 'Fernando Quincas',
      },
      { type: 'heading', text: 'O futuro da tradição' },
      {
        type: 'paragraph',
        text: 'Com novos materiais e ferramentas digitais, o ateliê amplia seu repertório sem abandonar a alma clássica das técnicas que o tornaram referência nacional.',
      },
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1600&q=85',
        alt: 'Bancada de ateliê com ferramentas de escultura',
        caption: 'Ferramentas de ofício, guardiãs de um saber que atravessa gerações.',
      },
    ],
  },
];