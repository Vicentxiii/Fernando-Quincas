import { Product, ProductCategory } from '../types';

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;

export const SHOP_FILTERS: { id: ProductCategory | 'ALL'; label: string }[] = [
  { id: 'ALL', label: 'Todas' },
  { id: 'ESCULTURAS', label: 'Esculturas' },
  { id: 'OBRAS', label: 'Obras' },
  { id: 'EDIÇÕES', label: 'Edições' },
  { id: 'OBJETOS', label: 'Objetos' },
  { id: 'COLEÇÕES', label: 'Coleções' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'p-estudo-cisne-imperatriz',
    slug: 'estudo-do-cisne-imperatriz',
    name: 'Estudo do Cisne Imperatriz',
    category: 'ESCULTURAS',
    shortDescription: 'Estudo escultural em escala de ateliê do icônico Cisne Imperatriz, com pátina de ouro brunido.',
    description: [
      'Esta peça nasce como estudo tridimensional do monumental Cisne Imperatriz e tornou-se obra por direito próprio. Cada curva do pescoço serpentino é modelada à mão no ateliê, preservando a mesma gramática formal da peça original em grande formato.',
      'A superfície alterna texturas sedosas de penas polidas com acentos em folha de ouro envelhecida, aplicados segundo a douração tradicional a óleo. As ondas estilizadas na base evocam os lagos serranos que inspiram o universo do artista.',
      'Acompanha certificado de autenticidade assinado por Fernando Quincas e base em travertino natural.',
    ],
    price: 12400,
    images: [img('photo-1516570161787-2fd917215a3d'), img('photo-1548802673-380ab8ebc7b7'), img('photo-1579783902614-a3fb3927b675')],
    dimensions: '48 × 32 × 40 cm',
    materials: ['Compósito mineral de alta densidade', 'Folha de ouro envelhecida', 'Base em travertino natural'],
    technique: 'Modelagem direta à mão e douração tradicional a óleo',
    year: 2024,
    weight: '6,8 kg',
    edition: 'Série de 8 estudos numerados',
    stock: 3,
    status: 'AVAILABLE',
  },
  {
    id: 'p-voo-botanico-painel',
    slug: 'voo-botanico-painel-escultorico',
    name: 'Voo Botânico — Painel Escultórico',
    category: 'OBRAS',
    shortDescription: 'Painel escultórico policromado onde aves exóticas atravessam uma vegetação dourada em alto-relevo.',
    description: [
      'Um relevo monumental concebido para paredes generosas. Aves estilizadas cruzam camadas sucessivas de folhagens entalhadas, criando um jogo de sombras que se transforma ao longo do dia conforme a luz natural percorre a superfície.',
      'A policromia é executada em vidragens manuais sobre laca polida, técnica que confere profundidade única aos azuis cobalto e verdes botânicos. Os pontos altos recebem ouro espelhado brunido à pedra de ágata.',
      'Obra única (1/1), acompanhada de certificado de autenticidade, dossiê fotográfico de execução e projeto de instalação assinado pelo ateliê.',
    ],
    price: 15800,
    images: [img('photo-1579783900882-c0d3dad7b119'), img('photo-1578328819058-b69f3a3b0f6b'), img('photo-1513519245088-0e12902e5a38')],
    dimensions: '140 × 95 × 12 cm',
    materials: ['Madeira nobre entalhada', 'Laca policromada polida', 'Folha de ouro 24k brunida'],
    technique: 'Entalhe em alto-relevo, vidragem manual e douração a água',
    year: 2024,
    weight: '22 kg',
    edition: 'Obra Única (1/1)',
    stock: 1,
    status: 'AVAILABLE',
    featured: true,
  },
  {
    id: 'p-acanto-centro-mesa',
    slug: 'acanto-dourado-centro-de-mesa',
    name: 'Acanto Dourado — Centro de Mesa',
    category: 'OBJETOS',
    shortDescription: 'Centro de mesa orgânico inspirado nas folhas de acanto dos relevos clássicos, com núcleo dourado.',
    description: [
      'As folhas de acanto que coroam colunas clássicas são aqui reinterpretadas como um centro de mesa de linhas fluidas. Cada pétala é esculpida individualmente antes da montagem, garantindo que nenhuma peça seja idêntica à outra.',
      'O acabamento alterna o branco alabastro acetinado com o interior das folhas em ouro champanhe, criando um contraste discreto e luminoso sobre mesas de madeira ou pedra.',
      'Peça assinada na base e acompanhada de certificado de autenticidade.',
    ],
    price: 3900,
    images: [img('photo-1577083552431-6e5fd01aa342'), img('photo-1532094349884-543bc11b234d'), img('photo-1518998053901-5348d3961a04')],
    dimensions: '58 × 58 × 18 cm',
    materials: ['Compósito mineral', 'Pátina branca alabastro', 'Ouro champanhe'],
    technique: 'Escultura direta e pátina multicamadas',
    year: 2023,
    weight: '4,2 kg',
    edition: 'Produção contínua do ateliê',
    stock: 6,
    status: 'AVAILABLE',
  },
  {
    id: 'p-cisne-imperatriz-edicao',
    slug: 'cisne-imperatriz-edicao-numerada',
    name: 'Cisne Imperatriz — Edição Numerada',
    category: 'EDIÇÕES',
    shortDescription: 'Edição numerada em escala de coleção do cisne-símbolo do ateliê, com acabamento em ouro 23k.',
    description: [
      'Uma edição limitada que traduz o monumento em escala de coleção. Fundida a partir do modelo original do ateliê, cada unidade é acabada à mão por Fernando Quincas e numerada na base.',
      'O pescoço arqueado e as penas em relevo recebem biselados em ouro 23k aplicados pincel a pincel, enquanto o corpo mantém o branco antigo característico das peças de jardim do mestre.',
      'Edição estritamente limitada a 30 unidades. Acompanha certificado numerado, caixa de proteção e luvas de manuseio.',
    ],
    price: 1850,
    images: [img('photo-1544717305-2782549b5136'), img('photo-1516570161787-2fd917215a3d')],
    dimensions: '24 × 14 × 22 cm',
    materials: ['Resina mineral de alta fidelidade', 'Biselados em ouro 23k'],
    technique: 'Fundição de edição e acabamento manual',
    year: 2024,
    weight: '1,9 kg',
    edition: 'Edição de 30 unidades numeradas',
    stock: 24,
    status: 'AVAILABLE',
  },
  {
    id: 'p-lira-das-aguas',
    slug: 'lira-das-aguas-fragmento-de-fonte',
    name: 'Lira das Águas — Fragmento de Fonte',
    category: 'ESCULTURAS',
    shortDescription: 'Fragmento escultural de bica de fonte, entalhado em cartela rocaille com conchas e volutas douradas.',
    description: [
      'Este fragmento nasceu durante a execução de uma grande fonte rocaille e foi concluído como peça autônoma. A cartela central apresenta conchas assimétricas entrelaçadas a volutas de acanto, seguindo o vocabulário barroco que marca o trabalho do artista.',
      'A pátina verde-grís sobre os fundos e o ouro brunido dos pontos altos reproduzem o envelhecimento natural das fontes de jardim europeias — mas com a exuberância tropical que assina o ateliê.',
      'Obra adquirida por colecionador privado. Esta página permanece como parte do acervo documental.',
    ],
    price: 7600,
    images: [img('photo-1538688525198-9b88f6f53126'), img('photo-1582561424760-0321d75e81fa')],
    dimensions: '62 × 38 × 30 cm',
    materials: ['Fibra de vidro modelada', 'Pátina verde-grís', 'Ouro brunido'],
    technique: 'Escultura hidrodinâmica e pátina atmosférica',
    year: 2023,
    weight: '11 kg',
    edition: 'Obra Única (1/1)',
    stock: 0,
    status: 'SOLD',
  },
  {
    id: 'p-serie-sereiais-triptico',
    slug: 'serie-sereiais-triptico-dourado',
    name: 'Série Sereiais — Tríptico Dourado',
    category: 'COLEÇÕES',
    shortDescription: 'Tríptico de máscaras esculturais inspiradas em deidades aquáticas, unificado por filetes de ouro 24k.',
    description: [
      'Três máscaras esculturais concebidas como um único gesto poético: as deidades das águas doces da Mata Atlântica. Cada rosto emerge de um relevo diferente — onda, cachoeira e orvalho — formando uma narrativa contínua quando expostas lado a lado.',
      'Os traços são deliberadamente suaves, quase dissolvidos na matéria, enquanto filetes de ouro 24k percorrem olhos, lábios e correntes de água, costurando as três peças em um só horizonte.',
      'O tríptico é vendido apenas como conjunto. Obra única acompanhada de dossiê de execução e certificado.',
    ],
    price: 21000,
    images: [img('photo-1578328819058-b69f3a3b0f6b'), img('photo-1579783900882-c0d3dad7b119'), img('photo-1520523839898-5071214878a8')],
    dimensions: '3 peças de 45 × 30 × 10 cm',
    materials: ['Compósito entalhado', 'Gesso cré e bolo armênio', 'Folha de ouro 24k'],
    technique: 'Alto-relevo e douração a água brunida',
    year: 2024,
    weight: '14 kg (conjunto)',
    edition: 'Obra Única (1/1)',
    stock: 1,
    status: 'AVAILABLE',
  },
  {
    id: 'p-pomo-de-ouro',
    slug: 'pomo-de-ouro-esfera-colecionavel',
    name: 'Pomo de Ouro — Esfera Colecionável',
    category: 'OBJETOS',
    shortDescription: 'Esfera lapidada com fruto dourado em relevo — o talismã do ateliê em escala de bolso.',
    description: [
      'O pomo é o amuleto pessoal de Fernando Quincas: um fruto idealizado que reúne em si todas as sementes do jardim. Nesta versão colecionável, ele se apresenta sobre uma esfera lapidada que cabe na palma da mão.',
      'Cada unidade é polida e dourada à mão, com micro-variações que tornam exemplares únicos. Perfeito como objeto de estante, peso de papel cerimonial ou primeiro contato com o universo do artista.',
      'Acompanha certificado de autenticidade e estojo de algodão cru.',
    ],
    price: 980,
    images: [img('photo-1532094349884-543bc11b234d'), img('photo-1577083552431-6e5fd01aa342')],
    dimensions: 'Ø 9 cm',
    materials: ['Esfera mineral polida', 'Fruto em relevo com ouro 24k'],
    technique: 'Lapidação manual e douração por pincel',
    year: 2024,
    weight: '0,7 kg',
    edition: 'Produção contínua do ateliê',
    stock: 40,
    status: 'AVAILABLE',
  },
  {
    id: 'p-cartela-rocaille',
    slug: 'cartela-rocaille-relevo-em-gesso',
    name: 'Cartela Rocaille — Relevo em Gesso',
    category: 'EDIÇÕES',
    shortDescription: 'Relevo de parede em gesso patinado, extraído das cartelas desenhadas por Fernando Quincas para suas fontes.',
    description: [
      'As cartelas rocaille desenhadas à mão pelo mestre para suas grandes fontes ganham vida própria nesta edição de parede. Moldada a partir dos modelos originais de ateliê, cada relevo preserva inclusive as marcas de ferramenta do processo criativo.',
      'O gesso de alta densidade recebe patinação em tons de pedra antiga, com véu dourado sutil nos pontos mais altos — uma introdução acessível ao vocabulário ornamental do artista.',
      'Edição aberta, produzida e patinada no ateliê. Assinada no verso.',
    ],
    price: 1450,
    images: [img('photo-1513519245088-0e12902e5a38'), img('photo-1538688525198-9b88f6f53126')],
    dimensions: '52 × 52 × 7 cm',
    materials: ['Gesso de alta densidade', 'Patinação tom pedra', 'Véu de ouro'],
    technique: 'Moldagem de edição e patinação manual',
    year: 2023,
    weight: '5,5 kg',
    edition: 'Edição aberta do ateliê',
    stock: 15,
    status: 'AVAILABLE',
  },
  {
    id: 'p-maquete-violoncelo-apolo',
    slug: 'maquete-do-violoncelo-de-apolo',
    name: 'Maquete do Violoncelo de Apolo',
    category: 'ESCULTURAS',
    shortDescription: 'Maquete de estudo do violoncelo escultural sonoro, em cedro entalhado com filigranas douradas.',
    description: [
      'Antes do Violoncelo de Apolo ganhar tamanho de concerto, existiu esta maquete de estudo — hoje finalizada como objeto de coleção. O corpo reduzido conserva todos os elementos da peça maior: as figuras da natureza em alto-relevo e a voluta coroada pela cabeça do cisne dourado.',
      'Executada em cedro envelhecido com lustro francês à goma-laca, traz incrustações de azul lápis polido nas volutas superiores.',
      'Peça única de estudo, vendida com certificado e relato de processo redigido pelo artista.',
    ],
    price: 8700,
    images: [img('photo-1511192336575-5a79af67a629'), img('photo-1520523839898-5071214878a8')],
    dimensions: '46 × 17 × 12 cm',
    materials: ['Cedro nobre envelhecido', 'Azul lápis polido', 'Folha de ouro 24k'],
    technique: 'Entalhe de alta lutheria e lustro francês',
    year: 2023,
    weight: '1,4 kg',
    edition: 'Estudo Único (1/1)',
    stock: 1,
    status: 'AVAILABLE',
  },
  {
    id: 'p-jardim-suspenso-conjunto',
    slug: 'jardim-suspenso-conjunto-de-vasos',
    name: 'Jardim Suspenso — Conjunto de Vasos',
    category: 'COLEÇÕES',
    shortDescription: 'Conjunto de três vasos esculturais empilháveis, com relevos botânicos e interior vitrificado.',
    description: [
      'Pensados como um pequeno jardim vertical, os três vasos do conjunto empilham-se em composições livres — ou habitam cantos diferentes da casa, conversando à distância.',
      'Os relevos botânicos são derivados diretamente das matrizes das obras monumentais do artista: bromélias, samambaias e frutos nativos aparecem em diferentes estágios de brotamento em cada vaso.',
      'Interior vitrificado e impermeável, aptos para uso real com plantas vivas. Conjunto assinado e numerado.',
    ],
    price: 11300,
    images: [img('photo-1548802673-380ab8ebc7b7'), img('photo-1544717305-2782549b5136'), img('photo-1577083552431-6e5fd01aa342')],
    dimensions: 'Alturas: 42 / 34 / 26 cm · Ø 28 cm',
    materials: ['Compósito mineral vitrificado', 'Relevos botânicos com ouro'],
    technique: 'Escultura em relevo e vitrificação',
    year: 2024,
    weight: '13 kg (conjunto)',
    edition: 'Série de 12 conjuntos numerados',
    stock: 3,
    status: 'AVAILABLE',
  },
  {
    id: 'p-ninfa-do-jardim',
    slug: 'ninfa-do-jardim-busto-botanico',
    name: 'Ninfa do Jardim — Busto Botânico',
    category: 'OBRAS',
    shortDescription: 'Busto escultural feminino cujos cabelos transformam-se em ramos floridos de maracujá silvestre.',
    description: [
      'Entre o retrato clássico e a alegoria botânica, este busto apresenta um rosto sereno cuja cabeleira dissolve-se em ramos de maracujá silvestre em flor — espécie querida pelo artista desde seus primeiros jardins.',
      'A pele polida contrasta com a matéria viva dos ramos, deixando clara a fronteira entre a figura e a natureza que a habita. Pontos de ouro discretamente aplicados iluminam pétalas e olhos.',
      'Obra de exposição do ateliê, agora disponível para aquisição. Acompanha pedestal opcional em travertino e certificado.',
    ],
    price: 9400,
    images: [img('photo-1582561424760-0321d75e81fa'), img('photo-1518998053901-5348d3961a04'), img('photo-1579783900882-c0d3dad7b119')],
    dimensions: '58 × 34 × 30 cm',
    materials: ['Compósito mineral', 'Pátina mármore', 'Pontos de ouro 24k'],
    technique: 'Modelagem direta e vidragem',
    year: 2024,
    weight: '15 kg',
    edition: 'Obra Única (1/1)',
    stock: 2,
    status: 'AVAILABLE',
  },
  {
    id: 'p-medalha-sao-joao',
    slug: 'medalha-fundida-em-bronze',
    name: 'Medalha Fundida em Bronze',
    category: 'EDIÇÕES',
    shortDescription: 'Medalha de mesa fundida em bronze com o orvalho da serra em relevo — primeiro objeto de edição do ateliê.',
    description: [
      'Fundida em bronze maciço no processo de cera perdida, esta medalha registra o motivo do orvalho — gotas da manhã serrana cristalizadas em metal — cercadas pelo monograma FQ entrelaçado a folhas de acanto.',
      'A face reverso traz a inscrição "Arte Escultural × Natureza", lema que atravessa toda a produção do artista. Pátina quente aplicada à mão garante que cada unidade tenha tom próprio.',
      'Ideal como presente de colecionador ou marco de início de uma coleção. Acompanha estojo e certificado numerado.',
    ],
    price: 420,
    images: [img('photo-1581092160607-ee22621dd758'), img('photo-1532094349884-543bc11b234d')],
    dimensions: 'Ø 6,5 cm · esp. 0,8 cm',
    materials: ['Bronze maciço', 'Pátina quente artesanal'],
    technique: 'Fundição por cera perdida',
    year: 2023,
    weight: '0,25 kg',
    edition: 'Edição de 60 unidades numeradas',
    stock: 60,
    status: 'AVAILABLE',
  },
];

export const formatPrice = (value: number): string =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);

export const getProductBySlug = (slug?: string): Product | undefined =>
  PRODUCTS.find((p) => p.slug === slug);

export const getFeaturedProduct = (): Product | undefined =>
  PRODUCTS.find((p) => p.featured && p.status === 'AVAILABLE');

export const isAvailable = (product: Product): boolean =>
  product.status === 'AVAILABLE' && product.stock > 0;

export const getRelatedProducts = (product: Product, count = 4): Product[] => {
  const sameCategory = PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category);
  const others = PRODUCTS.filter((p) => p.id !== product.id && p.category !== product.category);
  return [...sameCategory, ...others].slice(0, count);
};

export const searchProducts = (query: string): Product[] => {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q)
  );
};
