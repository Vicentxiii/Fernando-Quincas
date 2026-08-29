import { Artwork } from '../types';

export const ARTWORKS: Artwork[] = [
  {
    id: 'galinha-monte-verde-escultura',
    title: 'Galinha de Monte Verde',
    frenchTitle: 'La Poule de Monte Verde — Sculpture Monumentale 1/1',
    subtitle: 'Escultura monumental 165 cm × 100 cm em fibra de vidro por Fernando Quincas — obra única 1/1 do Restaurante Monte Verde',
    category: 'SCULPTURE',
    year: 2026,
    dimensions: '165 × 100 × 65 cm (Alt × Enverg. × Prof)',
    weight: '40 kg',
    materials: ['Isopor esculpível', 'Poliuretano', 'Gesso e massa corrida', 'Resina + fibra de vidro', 'Massa plástica', 'Tinta PU automotiva'],
    techniques: ['Modelagem manual em isopor e poliuretano', 'Laminação em resina com fibra de vidro', 'Pintura fundo universal e tinta PU'],
    finishes: ['Tinta PU automotiva alto brilho', 'Pátina artesanal plumagem', 'Resistente a sol e chuva'],
    colorPalette: [
      { name: 'Branco Monte Verde', hex: '#F7F5F0' },
      { name: 'Vermelho Crista', hex: '#A92A2A' },
      { name: 'Amarelo Bico', hex: '#D4B376' },
      { name: 'Verde Jardim', hex: '#16251E' }
    ],
    location: 'Ateliê Fernando Quincas — obra criada para o Restaurante Monte Verde',
    description: 'A Galinha de Monte Verde por Fernando Quincas é humor, ternura e maestria animalista em escala monumental — 165 cm de altura por 100 cm de envergadura, 40 kg de fibra de vidro modelada à mão em 45 dias de ateliê. Cada pena, dobra da crista e nuance da pintura foi esculpida por Fernando Quincas para acolher quem chega, transformando jardim ou hall em cenário afetivo.',
    curatorNotes: 'Obra única 1/1: mesmo que o tema seja reeditado, nenhuma outra sairá idêntica — gesto manual irrepetível de Fernando Quincas. Assinada e com certificado de autenticidade.',
    inspiration: 'A galinha caipira como ícone afetivo do interior, elevada à escultura monumental.',
    image: '/products/galinha-monte-verde-studio-green.jpeg',
    secondaryImages: [
      '/products/galinha-monte-verde-completa.jpeg',
      '/products/galinha-monte-verde-macro.jpeg',
      '/products/galinha-monte-verde-instalada-1.png'
    ],
    availability: 'AVAILABLE',
    edition: 'Obra Única 1/1',
    priceEstimate: 'Sob Consulta — R$ 12.800 na loja',
    featured: true,
    isMonumental: true
  },
  {
    id: 'fonte-gigante-paulo-leardi-portal-morumbi',
    title: 'Fonte Gigante Paulo Leardi — Portal do Morumbi',
    frenchTitle: 'Fontaine Géante Paulo Leardi — 10m Monumentale',
    subtitle: 'Fonte monumental 10,00 × 3,00 m em fibra de vidro por Fernando Quincas — mais de 2.000 kg, tanque para peixes e 3 bombas dedicadas no Portal do Morumbi',
    category: 'FOUNTAINS',
    year: 2026,
    dimensions: '10,00 × 3,00 m (Compr. × Profundidade)',
    weight: 'Mais de 2.000 kg',
    materials: ['Fibra de vidro de alta espessura', 'Tanque para peixes com espaço para plantas', '3 bombas dedicadas', 'Selante para calor, chuva, frio e vento'],
    techniques: ['Modelagem manual de rochas em fibra de vidro', 'Laminação estrutural monumental', 'Instalação hidráulica com 3 bombas dedicadas'],
    finishes: ['Pátina pedra natural artesanal', 'Tanque azul para peixes', 'Iluminação de nichos'],
    colorPalette: [
      { name: 'Rocha Arenito', hex: '#B8934E' },
      { name: 'Azul Tanque', hex: '#1E3A68' },
      { name: 'Verde Bromélia', hex: '#16251E' },
      { name: 'Areia Selada', hex: '#E0C995' }
    ],
    location: 'Portal do Morumbi, São Paulo — vista por milhares de pessoas todos os dias',
    description: 'A Fonte Gigante Paulo Leardi por Fernando Quincas é magnitude que não cabe na foto: quase 10 m de fachada por 3 m de profundidade, mais de 2.000 kg de fibra de vidro esculpida em vários meses no ateliê de Fernando Quincas. Tanque para peixes, espaço para plantas e 3 bombas dedicadas criam uma serra à beira da calçada, vista por milhares todos os dias — aguenta calor, chuva, frio e vento sem precisar cuidar toda hora.',
    curatorNotes: 'Obra monumental do ateliê de Fernando Quincas — não é tão interessante remover, mas se puder remover, dá com equipe. Réplica sob encomenda por R$ 50.000.',
    inspiration: 'A paisagem serrana transformada em fachada líquida urbana.',
    image: '/products/fonte-gigante-paulo-leardi-studio-green-casa.jpeg',
    secondaryImages: [
      '/products/fonte-gigante-paulo-leardi-fachada-rua.jpeg',
      '/products/fonte-gigante-paulo-leardi-visao-dentro-01.jpeg',
      '/products/fonte-gigante-paulo-leardi-escala-humana.jpeg'
    ],
    availability: 'AVAILABLE',
    edition: 'Obra Monumental — Réplica sob Encomenda',
    priceEstimate: 'R$ 50.000',
    featured: true,
    isMonumental: true
  },
  {
    id: 'gazebo-tenda-ferro-bambu-garden',
    title: 'Gazebo Tenda 350×200×270 — Ferro, Resina e Lona',
    frenchTitle: 'Tente Gazebo Monumentale — Fer, Résine et Toile',
    subtitle: 'Arquitetura leve 350 × 200 × 270 cm em ferro, resina e lona tensionada por Fernando Quincas — sombra que é escultura',
    category: 'GARDEN',
    year: 2026,
    dimensions: '350 × 200 × 270 cm (C × L × A)',
    weight: 'Estrutura sob consulta',
    materials: ['Estrutura em ferro', 'Resina modelada', 'Lona tensionada', 'Acabamento ateliê Fernando Quincas'],
    techniques: ['Estrutura em ferro soldado', 'Modelagem em resina', 'Cobertura em lona tensionada'],
    finishes: ['Lona tensionada filtro solar', 'Resina acabamento nobre', 'Ferro proteção para externo'],
    colorPalette: [
      { name: 'Ferro Grafite', hex: '#2C2A26' },
      { name: 'Lona Areia', hex: '#E0C995' },
      { name: 'Bambu Natural', hex: '#8A7A52' },
      { name: 'Verde Jardim', hex: '#16251E' }
    ],
    location: 'Jardim do Ateliê Fernando Quincas — para pousadas, festas e varandas gourmet',
    description: 'O Gazebo Tenda 350×200×270 por Fernando Quincas é arquitetura que se habita: 350 × 200 com 270 cm de altura, ferro, resina e lona tensionada que transformam jardim em salão a céu aberto — ora lounge, ora palco DJ, ora capela. Escultura habitável de Fernando Quincas que dá sombra sem pesar, ventila e fotografa bem de dia e de noite.',
    curatorNotes: 'Produto do ateliê — sob encomenda com montagem assistida por Fernando Quincas. Versátil para festas, casamentos, feiras e área gourmet.',
    inspiration: 'A tenda elegante como escultura — abrigo e presença.',
    image: '/products/gazebo-tenda-ferro-bamboo-principal.jpeg',
    secondaryImages: [
      '/products/gazebo-tenda-ferro-bamboo-macro.jpeg',
      '/products/gazebo-dj-tenda-bambu.jpeg'
    ],
    availability: 'AVAILABLE',
    edition: 'Produto do ateliê — Sob Encomenda',
    priceEstimate: 'R$ 13.900',
    featured: true,
    isMonumental: false
  },
  {
    id: 'lira-instrumento-corda-fernando-quincas',
    title: 'Lira — Instrumento de Corda',
    frenchTitle: 'Lyre Artisanale — Bois, Cordes & Cœur',
    subtitle: 'Lira de 15 cordas em madeira nobre por Fernando Quincas — timbre cristalino com bolsa porta-lira e guia musical para toque',
    category: 'INSTRUMENTS',
    year: 2026,
    dimensions: '52 × 38 × 6 cm (C × L × Esp)',
    weight: '1,2 kg',
    materials: ['Madeira nobre selecionada', 'Cordas de aço com cravelhas metálicas', 'Cavalete e pestana em latão dourado', 'Bolsa porta-lira em tecido', 'Guia musical didático para toque'],
    techniques: ['Marcenaria fina e entalhe', 'Calibragem de cordas e afinação', 'Acabamento em verniz acetinado', 'Confecção de bolsa e guia'],
    finishes: ['Verniz natural acetinado', 'Coração vazado central', 'Contas coloridas de marcação', 'Bordas arredondadas'],
    colorPalette: [
      { name: 'Madeira Natural', hex: '#C8A86B' },
      { name: 'Dourado Latão', hex: '#D4B376' },
      { name: 'Azul Corda', hex: '#1E3A68' },
      { name: 'Magenta Corda', hex: '#A92A6B' }
    ],
    location: 'Ateliê Fernando Quincas — instrumentos artesanais',
    description: 'A Lira por Fernando Quincas é instrumento e escultura: 15 cordas sobre tampo em madeira nobre com coração vazado, acabamento acetinado e contas coloridas que guiam o toque. Cada lira é afinada à mão por Fernando Quincas e acompanha bolsa porta-lira e guia musical para toque — pronta para soar, estudar e meditar. Leve, portátil e de sonoridade doce, a lira transforma qualquer canto em sala de música.',
    curatorNotes: 'Instrumento artesanal de Fernando Quincas em nova aba Instrumentos — substitui o Violoncelo de Apolo. Acompanha bolsa porta-lira e guia musical didático. Backstage com etapas de construção, traseira e detalhes disponíveis nas fotos.',
    inspiration: 'A harpa antiga e a luteria intimista — música que se toca com o colo.',
    image: '/products/lira-instrumento-musical-corda.jpeg',
    secondaryImages: [
      '/products/lira-backstage-01.jpeg',
      '/products/lira-traseira-backstage.jpeg',
      '/products/lira-bolsa-close.jpeg',
      '/products/lira-guia-musical.jpeg',
      '/products/lira-backstage-02.jpeg'
    ],
    availability: 'AVAILABLE',
    edition: 'Série Artesanal do Ateliê — com bolsa e guia',
    priceEstimate: 'Sob Consulta',
    featured: true,
    isMonumental: false
  }
];
