export interface AtelierStory {
  id: string;
  title: string;
  frenchTitle: string;
  stageNumber: string;
  description: string;
  sensoryDetail: string;
  artisanRole: string;
  toolsUsed: string[];
  image: string;
}

export const ATELIER_STORIES: AtelierStory[] = [
  {
    id: 'quintal-chacara',
    title: 'Quintal Chácara — Obras ao Ar Livre',
    frenchTitle: 'Jardin & Plein Air — Tour par le Quintal',
    stageNumber: '01',
    description: 'Algumas obras de Fernando Quincas no seu quintal, chácara — golfinho, cadeiras mole, globo "Arte da Terra" e bancos escultóricos sob a sombra das árvores. Um acervo a céu aberto onde o visitante já entra em obra antes mesmo de chegar ao galpão.',
    sensoryDetail: 'Luz filtrada pelas folhas, cheiro de terra úmida e o brilho da resina sob o sol da chácara.',
    artisanRole: 'Tour pelo Ateliê — Quintal',
    toolsUsed: ['Pátio de exposição', 'Cadeiras Swan', 'Globo Arte da Terra', 'Esculturas em fibra'],
    image: '/products/atelier-quintal-chacara-obras.jpeg'
  },
  {
    id: 'galpao-producao',
    title: 'Galpão — Onde Tudo Nasce',
    frenchTitle: 'Halle de Production — Cœur Battant',
    stageNumber: '02',
    description: 'Galpão do Fernando Quincas, onde ele produzia suas obras — estrutura aberta com vigas, bancadas e moldes em sequência. É aqui que a matéria vira escala, que o isopor vira rocha e a fibra vira fachada.',
    sensoryDetail: 'Barulho de lixadeira ao fundo, poeira fina de gesso e o vão livre que deixa o vento atravessar o fazer.',
    artisanRole: 'Tour pelo Ateliê — Galpão',
    toolsUsed: ['Galpão aberto', 'Bancadas de laminação', 'Moldes de fibra', 'Andaimes'],
    image: '/products/atelier-galpao-producao.jpeg'
  },
  {
    id: 'peca-molde',
    title: 'Peça no Molde — Fibra em Cura',
    frenchTitle: 'Pièce dans le Moule — Fibre en Cure',
    stageNumber: '03',
    description: 'Peça no molde no ateliê Fernando Quincas — coluna/balaústre em resina verde ainda no berço rosa, com fibras aparentes e cura em andamento. O momento exato em que a forma decide permanecer.',
    sensoryDetail: 'Cheiro de resina fresca e o brilho úmido da fibra que ainda respira.',
    artisanRole: 'Tour pelo Ateliê — Moldagem',
    toolsUsed: ['Molde rosa', 'Resina + fibra de vidro', 'Pincel de laminação', 'Bacia de pregos'],
    image: '/products/atelier-peca-molde.jpeg'
  },
  {
    id: 'peca-pronta',
    title: 'Peça Pronta — Acabamento Final',
    frenchTitle: 'Pièce Prête — Finition & Patine',
    stageNumber: '04',
    description: 'Peça pronta no ateliê Fernando Quincas — balaústres dourados com esfera no topo, já com pátina e corrente. Do molde rosa ao ouro envelhecido: a transfiguração completa pelas mãos do ateliê.',
    sensoryDetail: 'O tintim da corrente entre as esferas douradas e o reflexo do sol no ouro escovado.',
    artisanRole: 'Tour pelo Ateliê — Acabamento',
    toolsUsed: ['Pátina ouro velho', 'Esferas de topo', 'Correntes', 'Base metálica'],
    image: '/products/atelier-peca-pronta.jpeg'
  },
  {
    id: 'mestre-01',
    title: 'Mestre Artesão — No Ateliê',
    frenchTitle: 'Maître Artisan — Dans l’Atelier',
    stageNumber: '05',
    description: 'Ateliê Fernando Quincas, escultor mestre artesão em momento de pausa — paredes com matrizes, plantas e obras em fila. O retrato do mestre no seu território, entre barro, fibra e memória.',
    sensoryDetail: 'Silêncio de oficina ao entardecer, com obras encostadas como quem espera a vez.',
    artisanRole: 'Tour pelo Ateliê — Mestre',
    toolsUsed: ['Mesa do mestre', 'Paredes de matriz', 'Obras em espera', 'Luz natural'],
    image: '/products/atelier-mestre-01.jpeg'
  },
  {
    id: 'mestre-02',
    title: 'Mestre Artesão — Detalhe do Ofício 02',
    frenchTitle: 'Atelier — Geste 02',
    stageNumber: '06',
    description: 'Detalhe do ateliê do mestre 02 — bancada com matrizes, ferramentas e o gesto repetido que só o tempo ensina.',
    sensoryDetail: 'Pó de gesso no ar e o traço firme de quem já modelou centenas de metros de rocha.',
    artisanRole: 'Tour pelo Ateliê — Oficina',
    toolsUsed: ['Goivas', 'Espátulas', 'Moldes', 'Bancada'],
    image: '/products/atelier-mestre-02.jpeg'
  },
  {
    id: 'mestre-03',
    title: 'Mestre Artesão — Detalhe do Ofício 03',
    frenchTitle: 'Atelier — Geste 03',
    stageNumber: '07',
    description: 'Detalhe do ateliê do mestre 03 — canto de acabamento com texturas, relevos e pátinas em teste.',
    sensoryDetail: 'Cheiro de tinta e verniz, com amostras lado a lado sob a mesma luz.',
    artisanRole: 'Tour pelo Ateliê — Oficina',
    toolsUsed: ['Amostras de pátina', 'Pincéis', 'Lixas', 'Verniz'],
    image: '/products/atelier-mestre-03.jpeg'
  },
  {
    id: 'mestre-04',
    title: 'Mestre Artesão — Com a Obra 04',
    frenchTitle: 'Maître & Œuvre — 04',
    stageNumber: '08',
    description: 'Mestre com a obra 04 — Fernando Quincas ao lado de esculturas em escala humana, conferindo proporção e luz.',
    sensoryDetail: 'A sombra do escultor ao lado da escultura — mesma altura, mesmo orgulho.',
    artisanRole: 'Tour pelo Ateliê — Presença',
    toolsUsed: ['Escala humana', 'Trilha de luz', 'Fundo do ateliê', 'Olhar do mestre'],
    image: '/products/atelier-mestre-04.jpeg'
  },
  {
    id: 'piano-backstage-01',
    title: 'Piano em Fibra — Backstage 01',
    frenchTitle: 'Piano en Fibre — Coulisses 01',
    stageNumber: '09',
    description: 'Piano em fibra no backstage 01 — caixa monumental em cura, pernas finas e curvatura clássica já definida. A escultura de um piano que ainda não toca, mas já impõe.',
    sensoryDetail: 'Caixa oca reverberando o vento do galpão e o cheiro forte de resina.',
    artisanRole: 'Tour pelo Ateliê — Piano',
    toolsUsed: ['Caixa em fibra', 'Pernas torneadas', 'Molde de piano', 'Lixamento'],
    image: '/products/atelier-piano-backstage-01.jpeg'
  },
  {
    id: 'piano-backstage-02',
    title: 'Piano em Fibra — Backstage 02',
    frenchTitle: 'Piano en Fibre — Coulisses 02',
    stageNumber: '10',
    description: 'Piano backstage 02 — detalhe da borda e do tampo em processo, com camadas de fibra ainda aparentes.',
    sensoryDetail: 'Borda bruta esperando o polimento que vai virar espelho.',
    artisanRole: 'Tour pelo Ateliê — Piano',
    toolsUsed: ['Borda em fibra', 'Tampo', 'Resina', 'Espátula'],
    image: '/products/atelier-piano-backstage-02.jpeg'
  },
  {
    id: 'piano-backstage-03',
    title: 'Piano em Fibra — Estrutura 03',
    frenchTitle: 'Piano en Fibre — Structure 03',
    stageNumber: '11',
    description: 'Piano backstage 03 — vista lateral da estrutura com reforços internos, pronta para receber mecânica e brilho.',
    sensoryDetail: 'Oca e leve, mas já com peso de instrumento.',
    artisanRole: 'Tour pelo Ateliê — Piano',
    toolsUsed: ['Estrutura interna', 'Reforço', 'Caixa', 'Base'],
    image: '/products/atelier-piano-backstage-03.jpeg'
  },
  {
    id: 'piano-backstage-04',
    title: 'Piano em Fibra — Detalhe da Caixa 04',
    frenchTitle: 'Piano en Fibre — Caisse 04',
    stageNumber: '12',
    description: 'Piano backstage 04 — close da caixa e do tampo basculante, com textura de fibra que logo vira laqueado.',
    sensoryDetail: 'Granulação da fibra sob a luz lateral — promessa de piano espelhado.',
    artisanRole: 'Tour pelo Ateliê — Piano',
    toolsUsed: ['Tampo', 'Dobras', 'Fibra', 'Acabamento'],
    image: '/products/atelier-piano-backstage-04.jpeg'
  },
  {
    id: 'toro-backstage-01',
    title: 'Torô Japonês — Backstage 01',
    frenchTitle: 'Torii en Coulisses — 01',
    stageNumber: '13',
    description: 'Torô japonês backstage 01 — estrutura vermelha em montagem, com vigas e travamentos expostos no galpão.',
    sensoryDetail: 'Vermelho vivo cortando o cinza do cimento — portal que já orienta o olhar.',
    artisanRole: 'Tour pelo Ateliê — Torô',
    toolsUsed: ['Vigas do torii', 'Montagem', 'Pintura vermelha', 'Base'],
    image: '/products/atelier-toro-backstage-01.jpeg'
  },
  {
    id: 'toro-backstage-02',
    title: 'Torô Japonês — Backstage 02',
    frenchTitle: 'Torii en Coulisses — 02',
    stageNumber: '14',
    description: 'Torô backstage 02 — detalhe da travessa superior e dos encaixes, com a geometria sagrada já precisa.',
    sensoryDetail: 'Encaixe milimétrico que não precisa de prego — só de olhar.',
    artisanRole: 'Tour pelo Ateliê — Torô',
    toolsUsed: ['Travessa', 'Encaixe', 'Nível', 'Pátina'],
    image: '/products/atelier-toro-backstage-02.jpeg'
  },
  {
    id: 'toro-backstage-03',
    title: 'Torô Japonês — Backstage 03',
    frenchTitle: 'Torii en Coulisses — 03',
    stageNumber: '15',
    description: 'Torô backstage 03 — vista completa do torô em fibra já quase pronto, pronto para seguir para jardim e ganhar lanternas.',
    sensoryDetail: 'Portal em pé, mesmo sem jardim ao redor — já chama.',
    artisanRole: 'Tour pelo Ateliê — Torô',
    toolsUsed: ['Portal completo', 'Vermelho torii', 'Base', 'Acabamento externo'],
    image: '/products/atelier-toro-backstage-03.jpeg'
  }
];
