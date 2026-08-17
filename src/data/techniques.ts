import { Technique } from '../types';

export const TECHNIQUES: Technique[] = [
  {
    id: 'fiberglass',
    name: 'Fibra de Vidro Monumental',
    frenchName: 'Escultura & Compósito de Alta Densidade',
    category: 'COMPÓSITO ESTRUTURAL',
    tagline: 'Libertando a escala monumental do peso excessivo da pedra, mantendo a precisão cirúrgica do entalhe clássico.',
    description: 'Nossa formulação exclusiva em fibra de vidro de alta densidade permite criar balanços de vários metros, penas delicadas e volutas botânicas que resistem ao sol intenso, chuvas torrenciais e maresia por gerações. Cada obra nasce primeiro como uma maquete modelada à mão em argila antes da laminação estrutural.',
    process: [
      'Modelagem inicial à mão em argila especial sobre armadura de aço',
      'Confecção de molde flexível de alta fidelidade para capturar microtexturas',
      'Matriz de fibra de vidro trançada infundida com resinas estáveis a raios UV',
      'Cura térmica e nivelamento micrométrico com abrasivos diamantados'
    ],
    textureImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    processImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    artisanQuote: 'A fibra de vidro não é um atalho; é o material libertador da escultura contemporânea. Ela permite curvas que desafiam a gravidade e que se fragmentariam no mármore.',
    keyMaterials: ['Resina viniléster de grau naval', 'Fibra de vidro de alta gramatura', 'Armadura interna em aço inox 316L']
  },
  {
    id: 'wood',
    name: 'Marcenaria & Entalhe Artístico',
    frenchName: 'Marcenaria de Arte & Escultura em Madeira',
    category: 'MADEIRAS NOBRES',
    tagline: 'Goivas manuais, formões tradicionais e marcenaria de alta precisão encontram as madeiras brasileiras.',
    description: 'Escultura em cedro maciço, nogueira e jacarandá, transformando blocos maciços em curvas orgânicas, guirlandas de acanto e instrumentos acústicos. Cada peça de madeira passa por anos de secagem natural controlada para assegurar estabilidade perfeita.',
    process: [
      'Seleção minuciosa de madeiras nobres de manejo sustentável',
      'Desbaste inicial com plainas e formões de desbaste manuais',
      'Entalhe refinado de alto-relevo com goivas forjadas à mão',
      'Acabamento aveludado e lustro com cera e goma-laca pura'
    ],
    textureImage: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80',
    processImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
    artisanQuote: 'A madeira guarda a memória da floresta. A cada golpe de goiva, revelamos a pulsação oculta em seus veios.',
    keyMaterials: ['Cedro Rosa', 'Nogueira Nobre', 'Jacarandá', 'Óleo de Linhaça Prensado a Frio']
  },
  {
    id: 'gilding',
    name: 'Douração em Folha de Ouro 24k',
    frenchName: 'Douração à Água & Ouro 24 Carates',
    category: 'METAIS PRECIOSOS',
    tagline: 'A alquimia atemporal da douração tradicional, transformando superfícies em piscinas de luz celestial.',
    description: 'Aplicação manual de legítima folha de ouro 24 quilates com espessura microscópica. Utilizando bolo armênio tradicional como base óptica quente, os relevos são brunidos com pedras de ágata natural até obter brilho espelhado, enquanto os recessos guardam um resplendor suave e profundo.',
    process: [
      'Camadas de gesso cré natural com cola pura de pele de coelho',
      'Aplicação cuidadosa de bolo armênio vermelho e amarelo filtrado',
      'Assentamento da folha de ouro a água com pincel de pelos macios',
      'Brunimento manual com pontas de pedra ágata para brilho espelhado'
    ],
    textureImage: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1200&q=80',
    processImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
    artisanQuote: 'O ouro não apenas decora; ele curva a luz, dissipa as sombras e eleva a matéria ao sagrado.',
    keyMaterials: ['Folhas de Ouro 24k', 'Bolo Armênio Tradicional', 'Pedras de Ágata para Brunir', 'Gesso Cré']
  },
  {
    id: 'marble-effect',
    name: 'Scagliola & Efeito Mármore',
    frenchName: 'Estuque Mármore & Scagliola Artística',
    category: 'ILUSÃO MINERAL',
    tagline: 'Resgatando a arte secular da scagliola para criar veios mais dramáticos e expressivos que a pedra bruta.',
    description: 'Técnica magistral que combina pó de mármore de Carrara, gesso selenita puro, óxidos minerais e colas naturais. Sovada e aplicada à mão como uma massa viva, essa matriz cria veios magníficos inspirados em mármores raros, com toque frio e sedoso.',
    process: [
      'Mistura e amassamento manual da massa com pigmentos minerais',
      'Incrustação direta dos veios nas matrizes modeladas',
      'Polimento úmido através de doze lixas d’água diamantadas sucessivas',
      'Selamento com cera de abelha a quente para brilho acetinado histórico'
    ],
    textureImage: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=1200&q=80',
    processImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    artisanQuote: 'A scagliola nos dá o poder de reger o caos da natureza — desenhando veios de mármore como pinceladas sobre a tela.',
    keyMaterials: ['Pó de Mármore de Carrara', 'Gesso Selenita', 'Óxidos Minerais Naturais', 'Cera de Abelha Pura']
  },
  {
    id: 'patina',
    name: 'Pátina Atmosférica & Envelhecimento',
    frenchName: 'Pátinas Vivas & Oxidações Artísticas',
    category: 'MATURAÇÃO DE SUPERFÍCIE',
    tagline: 'Conferindo a passagem do tempo através de oxidações controladas e minerais nobres.',
    description: 'Fórmulas desenvolvidas no ateliê combinando nitratos, sulfatos e argilas minerais aplicadas sob chama branda e umidade serrana. O resultado é uma pátina viva com nuances de verde-gris, tons terrosos e reflexos minerais que amadurecem nobres ao ar livre.',
    process: [
      'Abertura dos microporos da peça com jato de abrasivos suaves',
      'Pátina química a quente com maçaricos de chama suave',
      'Banhos de ácidos naturais para eflorescência nobre de verde-gris',
      'Selamento com cera microcristalina para fixação cromática perfeita'
    ],
    textureImage: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=80',
    processImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    artisanQuote: 'Uma boa pátina não esconde a matéria; é uma conversa harmoniosa entre a escultura, os elementos químicos e o próprio tempo.',
    keyMaterials: ['Nitrato de Cobre', 'Óxido de Ferro', 'Ocres Naturais', 'Cera Microcristalina']
  },
  {
    id: 'hand-painting',
    name: 'Pintura Artística & Policromia',
    frenchName: 'Pintura de Arte & Vidragens Clássicas',
    category: 'PIGMENTOS VIBRANTES',
    tagline: 'Celebrando a vida através de vidragens botânicas, azuis profundos e tons expressivos.',
    description: 'Uso de pigmentos de lápis-lazúli, cinábrio e lacas botânicas aplicados em camadas semitransparentes sucessivas. Cada escultura recebe de dez a vinte vidragens cromáticas, criando uma luminosidade onde a luz viaja e reflete desde o fundo das camadas.',
    process: [
      'Formulação dos aglutinantes com resina damar clarificada e óleos finos',
      'Sobreposição de vidragens translúcidas do tom escuro ao claro',
      'Degradês e pontilhados com pincéis de pelos nobres de marta',
      'Verniz cerâmico cristalino protetor contra raios UV e intempéries'
    ],
    textureImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    processImage: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80',
    artisanQuote: 'A cor na escultura é a emoção tornada visível. Unimos a exuberância viva da flora tropical à precisão técnica dos grandes mestres.',
    keyMaterials: ['Lápis-lazúli Moído', 'Cinábrio Mineral', 'Óleo de Linhaça Clarificado', 'Resina Damar']
  },
  {
    id: 'texture',
    name: 'Microtexturas & Alto-Relevo Tátil',
    frenchName: 'Microtexturas & Acabamentos Sensoriais',
    category: 'ACABAMENTOS TÁTEIS',
    tagline: 'Da suavidade das penas de cisne à textura orgânica das cascas de árvore e pedras polidas.',
    description: 'A escultura é uma arte feita para o toque. Nossos artesãos dedicam centenas de horas à cinzelagem de microtexturas distintas em cada centímetro da obra — garantindo que a ponta dos dedos sinta a diferença entre o mármore liso, as plumas e as folhagens.',
    process: [
      'Punções e goivas sob medida forjadas na própria oficina',
      'Penteado direcional de plumas e estrias em massas finas',
      'Contraste de polimento entre o relevo acetinado e o ouro espelhado',
      'Avaliação sensorial tátil minuciosa antes da liberação da obra'
    ],
    textureImage: 'https://images.unsplash.com/photo-1516570161787-2fd917215a3d?auto=format&fit=crop&w=1200&q=80',
    processImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
    artisanQuote: 'Feche os olhos e toque a escultura. Se suas mãos não sentirem a transição entre o pescoço do cisne e a pétala da flor, nosso trabalho ainda não terminou.',
    keyMaterials: ['Goivas Especiais', 'Lixas Diamantadas', 'Escovas de Crina Natural']
  }
];
