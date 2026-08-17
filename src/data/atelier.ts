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
    id: 'clay-maquette',
    title: 'A Centelha & A Maquete em Argila',
    frenchTitle: 'O Esboço em Barro & Proporções',
    stageNumber: '01',
    description: 'Toda escultura monumental nasce no barro vivo e não em telas digitais. Fernando Quincas modela pessoalmente as maquetes em escala reduzida com as próprias mãos, testando a harmonia das curvas e a incidência da luz natural.',
    sensoryDetail: 'O aroma terroso da argila fresca aquecida pelas mãos e pela atmosfera suave da serra.',
    artisanRole: 'Mestre Escultor',
    toolsUsed: ['Espátulas de madeira nobre', 'Estecos de arame', 'Compassos de proporção', 'Argila de modelagem'],
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'structural-composite-lamination',
    title: 'Estruturação & Compósito em Fibra',
    frenchTitle: 'Moldagem & Infusão Estrutural',
    stageNumber: '02',
    description: 'Resinas viniléster de alta densidade e mantas multidirecionais de fibra de vidro são laminadas manualmente em moldes negativos de precisão. Estruturas internas em aço inox 316L garantem resistência para atravessar séculos.',
    sensoryDetail: 'O som ritmado do assentamento das mantas e o corte preciso de ferramentas diamantadas.',
    artisanRole: 'Mestre em Compósitos',
    toolsUsed: ['Matrizes flexíveis de alta densidade', 'Bolsas de vácuo estrutural', 'Microesferas de vidro', 'Resinas nobres'],
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'hand-sculpting-wood-relief',
    title: 'Entalhe Direto & Alto-Relevo',
    frenchTitle: 'A Escultura Direta na Madeira',
    stageNumber: '03',
    description: 'Para as peças em madeira e obras híbridas, blocos selecionados de cedro e nogueira são esculpidos com dezenas de goivas de diferentes raios. Cada entalhe acompanha as linhas naturais de crescimento da árvore.',
    sensoryDetail: 'O perfume marcante das aparas de cedro recém-entalhadas cobrindo o chão do ateliê.',
    artisanRole: 'Mestre Escultor em Madeira',
    toolsUsed: ['Goivas forjadas à mão', 'Maços de madeira pesada', 'Grosas e raspadeiras', 'Lixas finas'],
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'gilding-and-agate-burnish',
    title: 'Douração a Ouro & Brunimento em Ágata',
    frenchTitle: 'Aplicação da Folha de Ouro 24k',
    stageNumber: '04',
    description: 'Na câmara de douração protegida de correntes de ar, a folha de ouro 24k é assentada sobre o bolo armênio vermelho. Em seguida, pedras de ágata natural brunem os pontos de relevo até um brilho reflexivo espelhado.',
    sensoryDetail: 'O deslizar silencioso do pincel de pelos macios e o som cristalino da ágata sobre o ouro.',
    artisanRole: 'Mestre Dourador',
    toolsUsed: ['Almofada e faca de dourador', 'Pincéis de assentamento', 'Pedras naturais de ágata', 'Bolo armênio'],
    image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'polychrome-glaze-and-patina',
    title: 'Policromia, Vidragens & Pátina Final',
    frenchTitle: 'Vidragens Artísticas & Acabamento Nobre',
    stageNumber: '05',
    description: 'Camadas transparentes de vidragens ópticas formuladas com pigmentos de lápis-lazúli, cinábrio e óleos nobres são aplicadas. A peça é inspecionada sob a luz natural do sol e selada com ceras nobres de conservação.',
    sensoryDetail: 'O resplendor profundo dos pigmentos minerais reluzindo à luz dourada do final de tarde na serra.',
    artisanRole: 'Colorista & Finalizador',
    toolsUsed: ['Pincéis especiais de marta', 'Aglutinantes com óleo clarificado', 'Fontes de calor brando', 'Cera pura de carnaúba e abelha'],
    image: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80'
  }
];
