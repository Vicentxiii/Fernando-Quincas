import { Artwork } from '../types';

export const ARTWORKS: Artwork[] = [
  {
    id: 'le-cygne-imperatrice',
    title: 'O Cisne Imperatriz',
    frenchTitle: 'Le Cygne Impératrice',
    subtitle: 'Cisne monumental em fibra de vidro policromada, acanto dourado e bacia em travertino',
    category: 'ANIMALS',
    year: 2024,
    dimensions: '280 × 190 × 210 cm',
    weight: '320 kg',
    materials: ['Compósito de fibra de vidro de alta densidade', 'Douração em folha de ouro 24k', 'Laca polida à mão', 'Pátina com pó de mármore de Carrara'],
    techniques: ['Escultura direta modelada à mão', 'Repuxo e acanto clássico', 'Douração tradicional a óleo', 'Vidragem policromática'],
    finishes: ['Folha de ouro envelhecida', 'Laca perolizada de penas de cisne', 'Vidragem azul cobalto profundo'],
    colorPalette: [
      { name: 'Ouro Imperial', hex: '#C8A86B' },
      { name: 'Branco Alabastro', hex: '#F7F5F0' },
      { name: 'Azul Cobalto', hex: '#1E3A68' },
      { name: 'Terracota Cinábrio', hex: '#A95337' }
    ],
    location: 'Ateliê Parque Botânico Fernando Quincas, Minas Gerais',
    description: 'Uma síntese soberana entre a nobreza clássica e o volume orgânico monumental. O cisne emerge de ondas estilizadas em folhas de acanto douradas, com pescoço serpentino em postura majestosa. A superfície alterna texturas sedosas de penas polidas à mão e o brilho do ouro 24k que captura a luz natural do jardim.',
    curatorNotes: 'Fernando Quincas une a mitologia clássica à exuberância da flora tropical. O cisne, motivo marcante de sua trajetória, transcende a simples representação animal para se tornar um símbolo de serenidade, pureza e opulência.',
    inspiration: 'A elegância régia dos grandes lagos combinada à tranquilidade da Serra dos Órgãos.',
    image: 'https://images.unsplash.com/photo-1516570161787-2fd917215a3d?auto=format&fit=crop&w=1600&q=85',
    secondaryImages: [
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80'
    ],
    availability: 'AVAILABLE',
    edition: 'Obra Única (1/1)',
    priceEstimate: 'Sob Consulta para Dossiê Privado',
    featured: true,
    isMonumental: true
  },
  {
    id: 'fontaine-des-nymphes-botaniques',
    title: 'Fonte das Ninfas Botânicas',
    frenchTitle: 'Grande Fontaine Rocaille & Flore Tropicale',
    subtitle: 'Cascata hidro-escultural em três níveis com conchas e cisnes dourados',
    category: 'FOUNTAINS',
    year: 2023,
    dimensions: '420 × 340 × 340 cm',
    weight: '1.450 kg',
    materials: ['Fibra de vidro naval de engenharia', 'Bicas e bicos injetores em bronze', 'Matriz de mármore rosa moído', 'Ouro 24k vermeil'],
    techniques: ['Escultura hidrodinâmica', 'Cartelas barrocas entalhadas', 'Pátina atmosférica'],
    finishes: ['Acentos em verde-gris', 'Ouro brunido', 'Mármore rosa pontilhado'],
    colorPalette: [
      { name: 'Sálvia Verde-gris', hex: '#6A7D69' },
      { name: 'Ouro Antigo', hex: '#B8934E' },
      { name: 'Mármore Rosa', hex: '#C28E8E' },
      { name: 'Basalto Carvão', hex: '#2C2A26' }
    ],
    location: 'Propriedade Particular, Região dos Lagos / Serra',
    description: 'Uma fonte arquitetônica monumental que reúne curvas assimétricas rocaille, ninfas aquáticas, bromélias em flor e cisnes no ápice. A água escorre em lâminas perfeitas sobre conchas entalhadas, produzindo uma suave melodia acústica que acalma os sentidos.',
    curatorNotes: 'Construída para resistir à exposição ao ar livre e à umidade constante, preservando a delicadeza de detalhes que remetem à porcelana e à pedra nobre.',
    inspiration: 'Fontes clássicas europeias reinterpretadas sob o prisma da natureza tropical.',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1600&q=85',
    secondaryImages: [
      'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=80'
    ],
    availability: 'COMMISSION_ONLY',
    edition: 'Projeto Arquitetônico sob Encomenda',
    priceEstimate: 'Sob Orçamento para Projeto Exclusivo',
    featured: true,
    isMonumental: true
  },
  {
    id: 'l-arche-des-fleurs-celestes',
    title: 'O Arco das Flores Celestes',
    frenchTitle: 'Arche Monumentale aux Rameaux Dorés',
    subtitle: 'Portal monumental para jardim com volutas botânicas entrelaçadas e fauna em flor',
    category: 'MONUMENTAL',
    year: 2024,
    dimensions: '560 × 480 × 160 cm',
    weight: '980 kg',
    materials: ['Polímero reforçado com fibra de vidro', 'Armadura interna em aço inoxidável', 'Folha de ouro 23.75k', 'Esmalte poliuretânico policromático exterior'],
    techniques: ['Escultura estrutural multieixos', 'Douração tradicional em folha', 'Verniz resistente a intempéries'],
    finishes: ['Ouro luminoso', 'Realces em bordô nobre', 'Tonalidade botânica sálvia'],
    colorPalette: [
      { name: 'Bordô Real', hex: '#6B1D2F' },
      { name: 'Ouro Solar', hex: '#D4B376' },
      { name: 'Verde Botânico', hex: '#16251E' },
      { name: 'Off-White Nobre', hex: '#FAF6EE' }
    ],
    location: 'Jardim de Esculturas, Minas Gerais',
    description: 'Um portal triunfal onde a natureza e a maestria humana se fundem. Com mais de cinco metros de altura, seus ramos arqueados retorcem-se como lianas ancestrais adornadas com orquídeas douradas, maracujás e pássaros esculpidos em pleno voo.',
    curatorNotes: 'Atua tanto como portal de acesso quanto como moldura viva através da qual a paisagem ao redor se transforma em uma pintura atemporal.',
    inspiration: 'A exuberância das trepadeiras nativas da Mata Atlântica associada aos grandes pórticos clássicos.',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1600&q=85',
    secondaryImages: [
      'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1200&q=80'
    ],
    availability: 'PRIVATE_COLLECTION',
    edition: 'Comissão Única',
    priceEstimate: 'Coleção Privada',
    featured: true,
    isMonumental: true
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
  },
  {
    id: 'console-rocaille-flore-tropicale',
    title: 'Console Rocaille Flora Tropical',
    frenchTitle: 'Grande Console Murale en Bois Sculpté et Or',
    subtitle: 'Console de parede em alto-relevo entalhada em cedro maciço com flora brasileira e tampo em mármore scagliola',
    category: 'DECORATIVE ART',
    year: 2024,
    dimensions: '125 × 180 × 55 cm',
    weight: '85 kg',
    materials: ['Cedro maciço selecionado', 'Tampo em scagliola artesanal efeito mármore brecha', 'Douração a água em ouro 24k', 'Policromia bordô'],
    techniques: ['Entalhe direto na madeira com formões e goivas', 'Preparação de gesso cré e bolo armênio', 'Brunimento com pedra de ágata', 'Mármore scagliola'],
    finishes: ['Folha de ouro brunida espelhada', 'Efeito mármore Brecha de Verona', 'Cera nobre de abelha'],
    colorPalette: [
      { name: 'Ouro Brunido', hex: '#C8A86B' },
      { name: 'Vermelho Brecha', hex: '#A95337' },
      { name: 'Marfim Nobre', hex: '#FAF6EE' },
      { name: 'Cedro Escuro', hex: '#3E2723' }
    ],
    location: 'Coleção Privada, São Paulo — SP',
    description: 'Uma peça suntuosa de presença marcante. Os pés em curvas orgânicas transformam-se em folhagens de palmeiras e orquídeas entrelaçadas, sustentando um tampo pesado em scagliola que recria veios nobres de mármore italiano.',
    curatorNotes: 'Mais de 400 horas de entalhe manual contínuo, seguidas de camadas sucessivas de preparação tradicional e douração a água.',
    inspiration: 'O virtuosismo do entalhe rococó clássico enriquecido pela exuberância botânica.',
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1600&q=85',
    secondaryImages: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80'
    ],
    availability: 'LIMITED_EDITION',
    edition: 'Edição de 5 Peças (Nº 3/5 Disponível)',
    priceEstimate: 'Sob Consulta para Dossiê Privado',
    featured: true,
    isMonumental: false
  },
  {
    id: 'les-cygnes-jumeaux-du-bassin',
    title: 'Os Cisnes Gêmeos do Espelho d’Água',
    frenchTitle: 'Paire de Cygnes Sculpturaux pour Parc & Pièce d’Eau',
    subtitle: 'Par de esculturas para jardins e lagos em fibra resistente e pátina de ouro brunido',
    category: 'GARDEN',
    year: 2023,
    dimensions: '165 × 120 × 90 cm cada',
    weight: '95 kg cada',
    materials: ['Fibra de vidro de alto impacto reforçada', 'Camada de resina estável contra raios UV', 'Folha de ouro 23k', 'Selamento cerâmico hidrorrepelente'],
    techniques: ['Modelagem simétrica em contraposição', 'Douração especial para áreas externas', 'Relevo de penas texturizadas'],
    finishes: ['Branco antigo acetinado', 'Biselados em folha de ouro quente', 'Bico com detalhamento em laca negra'],
    colorPalette: [
      { name: 'Branco Antigo', hex: '#FAF8F5' },
      { name: 'Ouro Champanhe', hex: '#D4B376' },
      { name: 'Negro Obsidiana', hex: '#1E1D1A' },
      { name: 'Musgo Sálvia', hex: '#6A7D69' }
    ],
    location: 'Jardins Privados em Minas Gerais',
    description: 'Projetados como guardiões para lagos ornamentais, piscinas naturais ou degraus de jardins. As asas abrem-se suavemente em um arco acolhedor, revelando partes inferiores douradas que cintilam na superfície da água.',
    curatorNotes: 'Possuem câmaras internas de lastro que permitem ancoragem firme e estável em bacias d’água ou sobre bordas de pedra.',
    inspiration: 'A beleza solene dos cisnes régios e sua presença como símbolo de serenidade.',
    image: 'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?auto=format&fit=crop&w=1600&q=85',
    secondaryImages: [
      'https://images.unsplash.com/photo-1516570161787-2fd917215a3d?auto=format&fit=crop&w=1200&q=80'
    ],
    availability: 'AVAILABLE',
    edition: 'Série Limitada 2/8',
    priceEstimate: 'Sob Consulta para Dossiê Privado',
    featured: true,
    isMonumental: false
  },
  {
    id: 'l-oiseau-de-paradis-imperial',
    title: 'A Ave-do-Paraíso Imperial',
    frenchTitle: 'Grande Sculpture Botanique et Faune',
    subtitle: 'Escultura policromada em fibra modelada, penas douradas e pétalas de estrelícia laqueadas',
    category: 'SCULPTURE',
    year: 2024,
    dimensions: '240 × 160 × 140 cm',
    weight: '160 kg',
    materials: ['Compósito de escultura em fibra', 'Laca automotiva de alto brilho e proteção UV', 'Folha de ouro 24k', 'Pigmentos minerais naturais'],
    techniques: ['Modelagem orgânica livre', 'Aerografia em degradê com vidragens manuais', 'Polimento multicamadas'],
    finishes: ['Degradê de cobalto a esmeralda', 'Acentos de ouro espelhado', 'Bordas de pétalas em terracota'],
    colorPalette: [
      { name: 'Azul Cobalto', hex: '#1E3A68' },
      { name: 'Laranja Terracota', hex: '#A95337' },
      { name: 'Esmeralda Botânico', hex: '#16251E' },
      { name: 'Ouro 24k', hex: '#C8A86B' }
    ],
    location: 'Galeria Principal do Ateliê',
    description: 'Uma explosão vibrante de botânica tropical e formas de aves exóticas. Pétalas esculturais de estrelícia abrem-se para o céu como penas estilizadas, arrematadas por bordas nítidas em folha de ouro 24k.',
    curatorNotes: 'Um feito de policromia contemporânea. Fernando Quincas resgata o encanto das cores vivas e celebratórias em diálogo com o design botânico.',
    inspiration: 'A flora tropical brasileira e as cores ricas das matas serranas.',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1600&q=85',
    secondaryImages: [
      'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80'
    ],
    availability: 'AVAILABLE',
    edition: 'Obra Única (1/1)',
    priceEstimate: 'Sob Consulta para Dossiê Privado',
    featured: false,
    isMonumental: false
  },
  {
    id: 'miroir-de-venus-rocaille',
    title: 'Espelho de Vênus Rocaille',
    frenchTitle: 'Grand Miroir d’Apparat en Bois Sculpté et Doré',
    subtitle: 'Espelho monumental de parede com concha assimétrica e guirlandas de folhas de acanto',
    category: 'DECORATIVE ART',
    year: 2023,
    dimensions: '260 × 145 × 25 cm',
    weight: '110 kg',
    materials: ['Madeira nobre entalhada à mão', 'Vidro bisotado artesanal', 'Folha de ouro duplo 24k', 'Base em bolo armênio'],
    techniques: ['Entalhe em alto-relevo', 'Douração a água com brunimento em ágata', 'Lapidação de espelho'],
    finishes: ['Pontos altos brunidos e fundos aveludados', 'Vidro com reflexo suave'],
    colorPalette: [
      { name: 'Ouro Imperial', hex: '#C8A86B' },
      { name: 'Ocre Profundo', hex: '#9C7D3E' },
      { name: 'Alabastro Suave', hex: '#FAF8F5' },
      { name: 'Prata Nobre', hex: '#D8D2C4' }
    ],
    location: 'Exposição Residência Histórica',
    description: 'Uma moldura soberana concebida para capturar e ampliar a luz natural. O topo assimétrico ondula como a crista de uma onda, coroando uma estrutura ornamentada povoada por beija-flores e orquídeas douradas.',
    curatorNotes: 'Executado segundo o rigor da tradição artesanal, exigindo semanas de lixamento preparatório sobre gesso cré antes da douração.',
    inspiration: 'Os grandes salões clássicos enriquecidos pela leveza dos pássaros da serra.',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1600&q=85',
    secondaryImages: [
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80'
    ],
    availability: 'AVAILABLE',
    edition: 'Obra Única (1/1)',
    priceEstimate: 'Sob Consulta para Dossiê Privado',
    featured: false,
    isMonumental: false
  }
];
