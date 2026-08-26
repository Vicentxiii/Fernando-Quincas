import { Product, ProductCategory } from '../types';

export const SHOP_FILTERS: { id: ProductCategory | 'ALL'; label: string }[] = [
  { id: 'ALL', label: 'Todas' },
  { id: 'ESCULTURAS', label: 'Esculturas' },
  { id: 'OBRAS', label: 'Obras' },
  { id: 'OBJETOS', label: 'Objetos' },
  { id: 'COLEÇÕES', label: 'Coleções' },
];

// Produtos reais — imagens em /public/products (primeira imagem sempre fundo verde de estúdio)
export const PRODUCTS: Product[] = [
  {
    id: 'p-cisne-imperial-vaso',
    slug: 'cisne-imperial-vaso-escultural',
    name: 'Cisne Imperial — Vaso Escultural',
    category: 'ESCULTURAS',
    shortDescription: 'Vaso escultural em forma de cisne, desenhado para florescer com o jardim — o ícone do ateliê em escala doméstica.',
    description: [
      'O Cisne Imperial traduz a obra monumental do ateliê para a escala do cotidiano. Modelado à mão, seu pescoço em curva sinuosa e o corpo em casco acolhem um generoso berço de plantio, onde folhagens e florais parecem brotar do dorso da ave.',
      'O acabamento em esmalte cerâmico acetinado, branco puro, recebe polimento em três etapas que lhe confere brilho de porcelana e resistência à intempérie. O interior é impermeabilizado para uso com terra e rega direta, sem infiltrar.',
      'Cada peça é assinada na base por Fernando Quincas e acompanha certificado de autenticidade. Ideal para hall de entrada, varanda gourmet ou centro de jardim, sozinho ou em par espelhado.',
    ],
    price: 2850,
    images: [
      '/products/cisne-studio-green.jpeg',
      '/products/cisne-interior.jpeg',
      '/products/cisne-jardim.jpeg',
    ],
    dimensions: '62 × 38 × 42 cm (C × L × A)',
    materials: ['Compósito mineral de alta resistência', 'Esmalte cerâmico branco acetinado', 'Interior impermeabilizado'],
    technique: 'Modelagem manual, esmaltação em estufa e polimento triplo',
    year: 2024,
    weight: '9,5 kg',
    edition: 'Edição aberta do ateliê',
    stock: 12,
    status: 'AVAILABLE',
  },
  {
    id: 'p-coluna-grega-classica',
    slug: 'coluna-grega-classica-com-vaso',
    name: 'Coluna Grega Clássica — com Vaso de Coroa',
    category: 'ESCULTURAS',
    shortDescription: 'Coluna jônica canelada em pedra reconstituída, coroada por vaso medalhão para composição botânica vertical.',
    description: [
      'Inspirada nos templos jônicos, esta coluna de fuste canelado e capitel em toro sustenta um vaso de coroa que transborda verde. A proporção foi estudada para criar verticalidade sem peso — elegante ao lado de portais, lareiras ou como marco de jardim.',
      'A textura levemente porosa da pedra reconstituída revela microcristais ao tato, enquanto a pátina clara, obtida com véus minerais, garante que cada peça envelheça com charme, criando musgo natural nas concavidades com o tempo.',
      'Medida generosa para uso externo e interno. A bacia do vaso é profunda para plantio direto de samambaias, heras e florais pendentes.',
    ],
    price: 3200,
    images: [
      '/products/coluna-grega-studio-green.jpeg',
      '/products/coluna-grega-jardim.jpeg',
      '/products/coluna-grega-detalhe.jpeg',
      '/products/coluna-grega-sala.jpeg',
    ],
    dimensions: 'Altura 98 cm · Base 28 × 28 cm · Taça Ø 26 cm',
    materials: ['Pedra reconstituída de alta densidade', 'Pátina mineral clara', 'Vaso monolítico'],
    technique: 'Moldagem de precisão e pátina mineral em camadas',
    year: 2024,
    weight: '34 kg',
    edition: 'Produção contínua do ateliê',
    stock: 8,
    status: 'AVAILABLE',
  },
  {
    id: 'p-coluna-anjo-guardiao',
    slug: 'coluna-do-anjo-guardiao',
    name: 'Coluna do Anjo Guardião',
    category: 'ESCULTURAS',
    shortDescription: 'Coluna devocional com querubim que sustenta bacia florida — cascata de folhagens de até 75 cm, desenhada pelo ateliê.',
    description: [
      'Uma coluna de presença escultural: no topo, um anjo-menino sustenta com ternura uma ampla bacia de onde desce uma cascata vegetal. O manto de heras e flores de tons lavanda, amarelo e rosa parece fluir do colo do querubim até quase tocar o solo, criando movimento contínuo.',
      'Concebida segundo o desenho técnico original do ateliê (altura total 165 cm, fuste 90 cm, Ø 28 cm), cada peça é fundida em pedra e acabada à mão, com pátina envelhecida que valoriza os relevos do drapeado e das asas.',
      'Pensada para jardins românticos, pátios cobertos e varandas de pé-direito alto. A bacia acolhe forração e a coluna serve como totem botânico — sozinha já compõe um cenário.',
    ],
    price: 4800,
    images: [
      '/products/coluna-anjo-studio-green.jpeg',
      '/products/coluna-anjo-sala.jpeg',
      '/products/coluna-anjo-detalhe.jpeg',
      '/products/coluna-anjo-desenho-tecnico.jpeg',
    ],
    dimensions: 'Altura total 165 cm · Fuste 90 cm · Ø fuste 28 cm · Topo 45 × 45 cm',
    materials: ['Pedra reconstituída', 'Pátina calcária envelhecida', 'Bacia 25 cm Ø'],
    technique: 'Escultura figurativa e moldagem de fuste canelado',
    year: 2024,
    weight: '52 kg',
    edition: 'Edição aberta do ateliê · Desenho técnico incluso',
    stock: 5,
    status: 'AVAILABLE',
  },
  {
    id: 'p-pedestal-amarelo-canario',
    slug: 'pedestal-amarelo-canario-coluna-jonica',
    name: 'Pedestal Amarelo Canário — Coluna Jônica',
    category: 'OBJETOS',
    shortDescription: 'Pedestal escultural jônico em amarelo solar — ponto de cor e arquitetura para elevar vasos, bustos e objetos.',
    description: [
      'Um gesto de cor na tradição clássica. Este pedestal jônico de fuste canelado e capitel em duas faixas recebe um intenso amarelo canário em acabamento mineral texturizado, que vibra sob a luz natural e cria contraste com o verde das plantas.',
      'Versátil por natureza: serve como base para vasos, esculturas menores, ou como mesa de apoio escultural. Sua altura ergonômica eleva o que sustenta à linha do olhar, transformando qualquer canto em vitrine.',
      'Pigmentação mineral resistente ao sol e à chuva, com toque levemente arenado que revela o grão artesanal da modelagem. Leve o suficiente para mover, sólido o suficiente para permanecer.',
    ],
    price: 1950,
    images: [
      '/products/pedestal-amarelo-studio-baixo.jpeg',
      '/products/pedestal-amarelo-jardim-cascalho.jpeg',
      '/products/pedestal-amarelo-sala-moderna.jpeg',
      '/products/pedestal-amarelo-jardim-grama.jpeg',
      '/products/pedestal-amarelo-studio-alto.jpeg',
      '/products/pedestal-amarelo-studio-minimalista.jpeg',
      '/products/pedestal-amarelo-detalhe-fuste.jpeg',
      '/products/pedestal-amarelo-detalhe-base.jpeg',
    ],
    dimensions: 'Altura 78 cm · Topo 34 × 34 cm · Base 30 × 30 cm',
    materials: ['Compósito mineral', 'Pigmento mineral amarelo canário', 'Selante acetinado externo'],
    technique: 'Moldagem canelada e pintura mineral em camadas',
    year: 2024,
    weight: '18 kg',
    edition: 'Paleta exclusiva do ateliê',
    stock: 10,
    status: 'AVAILABLE',
  },
  {
    id: 'p-vaso-ceramico-classico',
    slug: 'vaso-ceramico-classico-guirlanda',
    name: 'Vaso Cerâmico Clássico — Guirlanda',
    category: 'OBJETOS',
    shortDescription: 'Vaso de borda larga com guirlandas em relevo — a cerâmica atemporal do ateliê, pronta para florescer.',
    description: [
      'De perfil tronco-cônico e borda generosa, este vaso traz em seu bojo uma guirlanda contínua em relevo — festões, rosetas e folhagens estilizadas que correm como coroas ao redor da peça. Um clássico que nunca sai de cena.',
      'A massa cerâmica clara, com chamote fino aparente, confere tato pétreo e leveza visual. O interior liso e o fundo com dreno oculto permitem plantio direto com substrato, sem comprometer a peça.',
      'Da sala minimalista ao jardim romântico, ele compõe com naturalidade: sozinho como escultura, ou em uso pleno com samambaias, heras e florais coloridos.',
    ],
    price: 890,
    images: [
      '/products/vaso-ceramico-studio-green.jpeg',
      '/products/vaso-ceramico-jardim.jpeg',
      '/products/vaso-ceramico-sala.jpeg',
      '/products/vaso-ceramico-detalhe.jpeg',
    ],
    dimensions: 'Ø 42 cm · Altura 32 cm',
    materials: ['Cerâmica de alta queima', 'Engobe claro texturizado', 'Relevo de guirlanda modelado à mão'],
    technique: 'Torno e modelagem de relevo, queima a 1.180°C',
    year: 2024,
    weight: '7,2 kg',
    edition: 'Produção contínua do ateliê',
    stock: 22,
    status: 'AVAILABLE',
  },
  {
    id: 'p-mesa-luiz-xv-madeira',
    slug: 'mesa-luiz-xv-madeira-nobre',
    name: 'Mesa Luiz XV — Madeira Nobre',
    category: 'OBJETOS',
    shortDescription: 'Mesa de apoio Luiz XV em madeira maciça, com pernas cabriolé e filigrana entalhada — marcenaria escultural.',
    description: [
      'Uma mesa que é escultura. De tampo quadrado com bordas suavemente arredondadas, apoia-se sobre quatro pernas cabriolé de curva pronunciada, terminando em pés de garra — assinatura da marcenaria Luiz XV reinterpretada pelo ateliê.',
      'Cada perna recebe filigrana em baixo-relevo entalhada à mão, com volutas e folhagens que se revelam conforme a luz. O tampo, em madeira nobre com veios marcantes, recebe verniz acetinado de alta resistência que aprofunda o tom mel e protege o uso diário.',
      'Perfeita como mesa lateral, de cabeceira ou base para vaso e luminária. Estável, elegante e atemporal — um móvel de ateliê para atravessar gerações.',
    ],
    price: 4200,
    images: [
      '/products/mesa-luizxv-studio-green.jpeg',
      '/products/mesa-luizxv-jardim.jpeg',
      '/products/mesa-luizxv-sala.jpeg',
    ],
    dimensions: '54 × 54 × 62 cm (L × P × A)',
    materials: ['Madeira maciça nobre', 'Entalhe manual em pernas cabriolé', 'Verniz acetinado premium'],
    technique: 'Marcenaria tradicional, entalhe manual e acabamento em laca',
    year: 2024,
    weight: '11 kg',
    edition: 'Série limitada do ateliê',
    stock: 6,
    status: 'AVAILABLE',
  },
  {
    id: 'p-fonte-cabeca-leao',
    slug: 'fonte-cabeca-de-leao-bica-barroca',
    name: 'Fonte Cabeça de Leão — Bica Barroca',
    category: 'ESCULTURAS',
    shortDescription: 'Bica de parede em cabeça de leão majestosa, com bacia em mármore reconstituído — água como escultura.',
    description: [
      'Símbolo de força e proteção, este leão de juba volutuosa e focinho expressivo torna-se bica de água: da boca entreaberta jorra o fio que espelha a luz e embala o jardim com som. Sob ele, a concha canelada em mármore reconstituído recolhe e faz dançar o reflexo.',
      'A peça une dois materiais em diálogo — o terracota esmaltado do leão, com brilho profundo que acentua cada mecha da juba, e o branco marmorizado da bacia, com veios suaves e borda perlada.',
      'Para instalação em muro de pedra, pátio interno ou hall de entrada. Acompanha mangueira interna e guia de instalação hidráulica do ateliê.',
    ],
    price: 5600,
    images: [
      '/products/fonte-leao-studio-green.jpeg',
      '/products/fonte-leao-detalhe-rosto.jpeg',
      '/products/fonte-leao-patio.jpeg',
      '/products/fonte-leao-jardim-muro.jpeg',
    ],
    dimensions: 'Altura total 92 cm · Leão 48 × 38 cm · Bacia Ø 42 cm',
    materials: ['Resina terracota esmaltada', 'Mármore reconstituído branco', 'Ferragem de bica em latão'],
    technique: 'Escultura animalista e esmaltação em alta',
    year: 2024,
    weight: '26 kg',
    edition: 'Obra do acervo · Instalação assistida',
    stock: 4,
    status: 'AVAILABLE',
  },
  {
    id: 'p-cervo-jardim-ceramica',
    slug: 'cervo-do-jardim-escultura-ceramica',
    name: 'Cervo do Jardim — Escultura em Cerâmica',
    category: 'ESCULTURAS',
    shortDescription: 'Cervo em salto, esmalte branco brilhante — uma aparição delicada entre canteiros e caminhos.',
    description: [
      'Leveza em movimento congelado. Este cervo jovem, em pleno salto, parece brotar do solo entre lavandas e margaridas. As pernas esticadas e o olhar sereno capturam o instante exato da corrida — pura alegria silvestre.',
      'O esmalte branco de alto brilho, aplicado em camada generosa e queimado em forno, cria superfície espelhada que reflete o céu e a vegetação ao redor, fazendo a peça dialogar com o jardim em cada estação.',
      'Resistente à chuva e ao sol, com base plana para apoio direto sobre terra, pedrisco ou gramado. Um toque poético para jardins, varandas e memória afetiva.',
    ],
    price: 1650,
    images: [
      '/products/cervo-jardim-1.jpeg',
    ],
    dimensions: '48 × 22 × 32 cm (C × L × A)',
    materials: ['Cerâmica esmaltada branca', 'Queima de alto brilho', 'Base plana estável'],
    technique: 'Modelagem animalista e esmaltação espelhada',
    year: 2024,
    weight: '3,1 kg',
    edition: 'Edição aberta do ateliê',
    stock: 18,
    status: 'AVAILABLE',
  },
  {
    id: 'p-galinha-monte-verde-unica',
    slug: 'galinha-de-monte-verde-escultura-1-1',
    name: 'Galinha de Monte Verde — Escultura 1/1',
    category: 'OBRAS',
    categories: ['OBRAS', 'ESCULTURAS'],
    shortDescription: 'Obra única 1/1 — a Galinha da Roça do Restaurante Monte Verde, modelada à mão por Fernando Quincas. Irrepetível mesmo em nova edição.',
    description: [
      'A Galinha de Monte Verde nasceu como obra site-specific para o Restaurante Monte Verde e tornou-se ícone afetivo do lugar. Modelada à mão por Fernando Quincas em escala monumental — 165 cm de altura, 100 cm de envergadura (asa a asa) e 40 kg — ela reúne humor, ternura e maestria animalista: plumagem em volumes generosos, crista altiva e olhar atento que parecem acolher quem chega.',
      'Cada pena, dobra e nuance de cor foi esculpida e pintada manualmente em ateliê ao longo de cerca de um mês e meio (45 dias) de trabalho: núcleo em isopor, expansão e modelagem em poliuretano, regularização em gesso e massa corrida, laminação em resina com fibra de vidro, refinos em massa plástica, preparação com pintura fundo universal e acabamento final em tinta PU automotiva. O resultado é uma escultura de grande impacto — ao mesmo tempo pop e artesanal — pronta para sol e chuva, que transforma jardim, varanda gourmet, hall de fazenda ou coleção particular em cenário.',
      'Trata-se de obra única 1/1: mesmo que o ateliê venha a reproduzir o tema no futuro, nenhuma outra sairá idêntica, pois o gesto manual, a modelagem e a pintura são irrepetíveis. Peça assinada por Fernando Quincas, acompanha certificado de autenticidade com menção “Obra Única 1/1”. Feita para externo — resiste a sol e chuva graças à fibra de vidro e à tinta PU — e também brilha em hall interno. Exposta em Monte Verde, agora disponível para aquisição direta do ateliê.',
    ],
    price: 12800,
    images: [
      '/products/galinha-monte-verde-studio-green.jpeg',
      '/products/galinha-monte-verde-completa.jpeg',
      '/products/galinha-monte-verde-all-white.jpeg',
      '/products/galinha-monte-verde-macro.jpeg',
      '/products/galinha-monte-verde-escala.png',
      '/products/galinha-monte-verde-instalada-1.png',
      '/products/galinha-monte-verde-instalada-2.png',
      '/products/galinha-monte-verde-processo-finalizando.png',
      '/products/galinha-monte-verde-processo-atelier.jpeg',
    ],
    dimensions: 'Altura 165 cm × Envergadura 100 cm (asa a asa) — obra monumental em escala real',
    materials: ['Isopor (núcleo esculpível)', 'Poliuretano', 'Gesso', 'Massa corrida', 'Resina + fibra de vidro (laminação estrutural)', 'Massa plástica', 'Pintura fundo universal', 'Tinta PU automotiva (resistente a sol e chuva)', 'Base estável — pode ficar no externo ou interno'],
    technique: 'Escultura manual em isopor e poliuretano, regularização em gesso e massa corrida, laminação em resina com fibra de vidro, refinos em massa plástica, fundo universal e pintura final em tinta PU — 45 dias de ateliê, acabamento 100% à mão',
    year: 2024,
    weight: '40 kg',
    edition: 'Obra única 1/1 · Assinada · Certificado de autenticidade — irrepetível mesmo em nova edição',
    stock: 1,
    status: 'AVAILABLE',
  },
  {
    id: 'p-lobo-gigante-monumental',
    slug: 'lobo-gigante-escultura-monumental',
    name: 'Lobo Gigante — Escultura Monumental',
    category: 'OBRAS',
    categories: ['OBRAS', 'ESCULTURAS'],
    shortDescription: 'Escultura monumental do Lobo Gigante por Fernando Quincas — obra em fibra de vidro, resina e tinta PU, pronta para sol e chuva. Força e poesia em escala real.',
    description: [
      'O Lobo Gigante nasceu no ateliê de Fernando Quincas como uma obra de presença absoluta: musculatura tensa, olhar atento e pelagem em volumes que capturam luz e sombra. É uma escultura monumental que impõe respeito sem perder ternura — o predador que vira guardião do jardim.',
      'Modelado à mão em isopor e poliuretano, regularizado em gesso e massa corrida, laminado em resina com fibra de vidro, refinado em massa plástica e finalizado com pintura fundo universal e tinta PU automotiva, o Lobo Gigante reúne o mesmo processo consagrado da Galinha de Monte Verde: cerca de 50 dias de ateliê, gesto irrepetível e acabamento que resiste a sol e chuva. Cada pelo, cada dobra do focinho e cada músculo foi esculpido por Fernando Quincas — por isso, mesmo que a obra seja reeditada, nenhuma escultura sairá idêntica.',
      'Obra única para colecionadores que buscam uma escultura de impacto: pode habitar jardim, hall de fazenda, praça, pátio de pousada ou galeria a céu aberto. Assinada por Fernando Quincas, acompanha certificado de autenticidade. Feita para o externo — fibra de vidro e tinta PU garantem longevidade — e imponente também no interno.',
    ],
    price: 8500,
    images: [
      '/products/lobo-gigante-studio-green.jpeg',
      '/products/lobo-gigante-all-white.jpeg',
      '/products/lobo-gigante-tamanho-real.jpeg',
      '/products/lobo-gigante-traseira.jpeg',
      '/products/lobo-gigante-traseira-producao.jpeg',
      '/products/lobo-gigante-producao-1.jpeg',
      '/products/lobo-gigante-macro.jpeg',
      '/products/lobo-gigante-no-colo.jpeg',
      '/products/lobo-gigante-com-crianca.jpeg',
    ],
    dimensions: 'Altura aprox. 115 cm × Compr. 210 cm × Larg. 75 cm — obra monumental em escala real (medidas a confirmar)',
    materials: ['Isopor (núcleo esculpível)', 'Poliuretano', 'Gesso', 'Massa corrida', 'Resina + fibra de vidro (laminação estrutural)', 'Massa plástica', 'Pintura fundo universal', 'Tinta PU automotiva (resistente a sol e chuva)', 'Base estável — pode ficar no externo ou interno'],
    technique: 'Escultura manual em isopor e poliuretano, gesso e massa corrida, laminação em resina com fibra de vidro, refinos em massa plástica, fundo universal e tinta PU — acabamento 100% à mão',
    year: 2024,
    weight: 'Aprox. 65 kg',
    edition: 'Obra única · Assinada · Certificado de autenticidade — escultura monumental para sol e chuva',
    stock: 1,
    status: 'AVAILABLE',
  },
  {
    id: 'p-fonte-pedra-grande-cinza',
    slug: 'fonte-de-pedra-grande-cinza',
    name: 'Fonte de Pedra Grande — Cinza Mineral',
    category: 'COLEÇÕES',
    categories: ['COLEÇÕES', 'ESCULTURAS'],
    shortDescription: 'Fonte escultural em pedra reconstituída — presença clássica com pátina cinza mineral para jardim, pátio e hall. Pronta para água e tempo.',
    description: [
      'A Fonte de Pedra Grande traduz a tradição das fontes clássicas para a linguagem do ateliê de Fernando Quincas: bacia generosa, fuste canelado e taça ampla que acolhe água, luz e reflexos. A pátina cinza mineral revela o grão da pedra e garante que a peça ganhe charme com o tempo, criando musgo natural nas concavidades.',
      'Modelada e moldada com acabamento manual, a fonte é própria para uso com água — bacia profunda, base estável e superfície selada para intempérie. Versátil para jardim, pátio interno, varanda gourmet ou hall de entrada, sozinha já compõe um cenário e, com bomba, torna-se ponto de som e frescor.',
      'Produto do ateliê — não é obra única 1/1. Cada peça é acabada à mão por Fernando Quincas e acompanha certificado do ateliê. Produção contínua, pronta para envio com orientação de instalação hidráulica.',
    ],
    price: 6500,
    images: [
      '/products/fonte-pedra-grande-jardim-cinza.jpeg',
      '/products/fonte-pedra-grande-frente.jpeg',
      '/products/fonte-pedra-grande-macro.jpeg',
    ],
    dimensions: 'Altura aprox. 75 cm · Taça Ø 55 cm · Base 40 × 40 cm (medidas a confirmar)',
    materials: ['Pedra reconstituída de alta densidade', 'Pátina mineral cinza', 'Selante para uso com água'],
    technique: 'Moldagem de precisão, regularização e pátina mineral em camadas — acabamento manual',
    year: 2024,
    weight: 'Aprox. 42 kg',
    edition: 'Produto do ateliê · Produção contínua',
    stock: 6,
    status: 'AVAILABLE',
    featured: true,
  },
  {
    id: 'p-gazebo-tenda-ferro-bambu',
    slug: 'gazebo-tenda-ferro-bambu',
    name: 'Gazebo Tenda — Ferro e Bambu por Fernando Quincas',
    category: 'COLEÇÕES',
    shortDescription: 'Gazebo tenda em ferro e bambu por Fernando Quincas — cobertura elegante para jardim, festas e palco DJ. Sombra, charme e estrutura do ateliê.',
    description: [
      'O Gazebo Tenda de Ferro e Bambu traduz o saber do ateliê de Fernando Quincas para a arquitetura leve do jardim: estrutura em ferro com trama de bambu, cobertura em lona/tecido e presença que transforma qualquer área externa em salão a céu aberto. Nas fotos, a obra de Fernando Quincas aparece como tenda elegante e como gazebo usado como DJ — prova de sua versatilidade para festas, casamentos, feiras e encontros no jardim.',
      'Cada gazebo é pensado como escultura habitável de Fernando Quincas: proporção estudada para criar sombra sem pesar, altura generosa para ventilação e base estável para uso prolongado. A estrutura, assinada por Fernando Quincas, pode abrigar lounge, pista, cerimônia ou palco — uma obra do ateliê que une função e poesia.',
      'Produto do ateliê — não é obra única 1/1. Cada Gazebo Tenda é produzido sob encomenda por Fernando Quincas, com montagem assistida e orientação do ateliê. Materiais em confirmação (ferro e bambu conforme fotos, cobertura e ferragens a detalhar). Ideal para quem busca uma obra de Fernando Quincas para o jardim que seja também escultura e abrigo.',
    ],
    price: 13900,
    images: [
      '/products/gazebo-tenda-ferro-bamboo-principal.jpeg',
      '/products/gazebo-tenda-ferro-bamboo-macro.jpeg',
      '/products/gazebo-dj-tenda-bambu.jpeg',
    ],
    dimensions: 'Ø aprox. 350 cm × Altura 290 cm · Área coberta aprox. 9 m² (medidas a confirmar)',
    materials: ['Estrutura em ferro', 'Trama em bambu natural', 'Cobertura em lona/tecido (a confirmar)', 'Ferragens e acabamento do ateliê (a confirmar)'],
    technique: 'Estruturação em ferro e bambu, trama manual e cobertura tensionada — obra do ateliê Fernando Quincas para jardim (material em confirmação)',
    year: 2024,
    weight: 'A confirmar',
    edition: 'Produto do ateliê · Sob encomenda · Montagem assistida',
    stock: 3,
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

const productHasCategory = (product: Product, category: ProductCategory): boolean =>
  product.category === category || (product.categories?.includes(category) ?? false);

const productMatchesCategoryQuery = (product: Product, q: string): boolean => {
  const cats = [product.category, ...(product.categories ?? [])].map((c) => c.toLowerCase());
  return cats.some((c) => c.includes(q));
};

export const getRelatedProducts = (product: Product, count = 4): Product[] => {
  const sameCategory = PRODUCTS.filter((p) => p.id !== product.id && productHasCategory(p, product.category as ProductCategory));
  // also consider additional categories of the current product for broader relatedness
  const sameAnyCategory = PRODUCTS.filter(
    (p) =>
      p.id !== product.id &&
      !sameCategory.includes(p) &&
      (product.categories ?? [product.category]).some((c) => productHasCategory(p, c))
  );
  const others = PRODUCTS.filter((p) => p.id !== product.id && !sameCategory.includes(p) && !sameAnyCategory.includes(p));
  return [...sameCategory, ...sameAnyCategory, ...others].slice(0, count);
};

export const searchProducts = (query: string): Product[] => {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      productMatchesCategoryQuery(p, q) ||
      p.shortDescription.toLowerCase().includes(q)
  );
};
