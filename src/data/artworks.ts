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
    id: 'le-violoncelle-d-apollon',
    title: 'O Violoncelo de Apolo',
    frenchTitle: 'Sculpture Sonore & Corde Baroques',
    subtitle: 'Instrumento escultural sonoro em cedro entalhado, filigranas douradas e pátina lápis-lazúli',
    category: 'INSTRUMENTS',
    year: 2023,
    dimensions: '185 × 65 × 45 cm',
    weight: '34 kg',
    materials: ['Jacarandá e cedro nobre envelhecido', 'Tampo de ressonância em abeto', 'Voluta entalhada à mão', 'Pigmento lápis-lazúli', 'Folha de ouro 24k'],
    techniques: ['Escultura de alta lutheria', 'Lustro francês tradicional em goma-laca', 'Incrustação em folha de ouro', 'Voluta clássica'],
    finishes: ['Verniz a óleo âmbar', 'Voluta folheada a ouro 24k', 'Incrustações em azul lápis polido'],
    colorPalette: [
      { name: 'Nogueira Quente', hex: '#5C3826' },
      { name: 'Ouro Nobre', hex: '#C8A86B' },
      { name: 'Azul Lápis', hex: '#1E3A68' },
      { name: 'Marfim Antigo', hex: '#FAF8F5' }
    ],
    location: 'Sala de Música do Ateliê Fernando Quincas',
    description: 'Uma escultura musical acústica de concerto. As costas e laterais apresentam entalhes em alto-relevo com figuras da natureza, enquanto a voluta termina na cabeça nobre de um cisne folheado a ouro brunido.',
    curatorNotes: 'Onde a escultura visual e a engenharia acústica se encontram em harmonia.',
    inspiration: 'A harmonia entre as artes plásticas e a música camerística.',
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1600&q=85',
    secondaryImages: [
      'https://images.unsplash.com/photo-1520523839898-5071214878a8?auto=format&fit=crop&w=1200&q=80'
    ],
    availability: 'AVAILABLE',
    edition: 'Série Limitada de 3 Peças (Nº 2/3)',
    priceEstimate: 'Sob Consulta para Dossiê Privado',
    featured: false,
    isMonumental: false
  }
];
