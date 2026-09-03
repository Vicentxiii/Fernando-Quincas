export interface InstrumentImage {
  slug: string;
  src: string;
  alt: string;
  caption?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoCaption?: string;
}

export interface Instrument {
  id: string;
  name: string;
  subtitle: string;
  description: string[];
  priceNote?: string;
  featuredImage: string;
  gallery: InstrumentImage[];
  details: {
    dimensions: string;
    weight: string;
    materials: string[];
    technique: string;
    edition: string;
    includes: string[];
  };
}

// Todas as fotos de instrumentos (liras) encontradas no site — 16 arquivos em /public/products
export const INSTRUMENTS: Instrument[] = [
  {
    id: 'lira-15-cordas',
    name: 'Lira de 15 Cordas',
    subtitle: 'Instrumento de Corda • Madeira Nobre • Timbre Cristalino',
    description: [
      'A Lira por Fernando Quincas é instrumento e escultura: 15 cordas sobre tampo em madeira nobre com coração vazado, acabamento acetinado e contas coloridas que guiam o toque. Cada lira é afinada à mão no ateliê e acompanha bolsa porta-lira e guia musical — pronta para soar, estudar e meditar.',
      'Leve (1,2 kg), portátil e de sonoridade doce, a lira transforma qualquer canto em sala de música. Seu desenho ergonômico abraça o colo, o cavalete em latão dourado sustenta a afinação e o coração vazado central não é só símbolo: é respiro acústico que projeta o som com calor e brilho.',
      'Mais que um instrumento, é um convite à pausa. Em casas, escolas Waldorf, espaços terapêuticos e jardins, a lira de Fernando Quincas embala o cotidiano com timbre cristalino — música que se toca com as mãos e se guarda no peito.',
    ],
    priceNote: 'Série Artesanal do Ateliê — sob consulta',
    featuredImage: '/products/lira-instrumento-musical-corda.jpeg',
    gallery: [
      { slug: 'lira-vista-frontal-coracao-vazado', src: '/products/lira-instrumento-musical-corda.jpeg', alt: 'Lira de 15 cordas em madeira nobre — vista frontal com coração vazado por Fernando Quincas', caption: 'Vista frontal • Coração vazado central', seoTitle: 'Lira Vista Frontal com Coração Vazado — 15 cordas por Fernando Quincas', seoDescription: 'Vista frontal da Lira 15 cordas em madeira nobre com coração vazado central, acabamento acetinado e contas coloridas. Feita à mão por Fernando Quincas.', seoCaption: 'A face mais fotografada da Lira: tampo em madeira nobre, 15 cordas de aço e o coração vazado que dá respiro acústico e símbolo.' },
      { slug: 'lira-traseira-madeira-nobre', src: '/products/lira-traseira-backstage.jpeg', alt: 'Traseira da lira em madeira nobre — acabamento acetinado por Fernando Quincas', caption: 'Traseira • Madeira nobre selecionada', seoTitle: 'Traseira da Lira em Madeira Nobre — Acabamento Acetínado', seoDescription: 'Traseira da Lira artesanal em madeira nobre selecionada com verniz acetinado, bordas arredondadas e construção leve 1,2kg.', seoCaption: 'Traseira lisa em madeira nobre que encosta no colo com conforto e projeta o timbre cristalino.' },
      { slug: 'lira-tampo-em-construcao-backstage', src: encodeURI('/products/Lira traseira instrumento sendo feito Backstage by fernando quincas.jpeg'), alt: 'Tampo da lira em construção no ateliê — backstage por Fernando Quincas', caption: 'Backstage • Tampo em construção', seoTitle: 'Tampo da Lira em Construção — Backstage do Ateliê', seoDescription: 'Etapa de construção do tampo da Lira no ateliê de Fernando Quincas, com madeira nobre e entalhe do coração vazado.', seoCaption: 'No ateliê, o tampo ganha forma antes das cordas: entalhe, lixa e verniz que preparam o som.' },
      { slug: 'lira-bolsa-close-tecido', src: '/products/lira-bolsa-close.jpeg', alt: 'Close da bolsa porta-lira em tecido — acabamento por Fernando Quincas', caption: 'Bolsa porta-lira • Close do tecido', seoTitle: 'Bolsa Porta-Lira — Close do Tecido', seoDescription: 'Close do tecido da bolsa porta-lira que acompanha cada Lira 15 cordas de Fernando Quincas — proteção e portabilidade.', seoCaption: 'A bolsa que protege a Lira no transporte: tecido resistente, costura reforçada e alça prática.' },
      { slug: 'lira-bolsa-costura-artesanal', src: encodeURI('/products/Close da bolsa porta lira.jpeg'), alt: 'Detalhe da costura artesanal da bolsa porta-lira por Fernando Quincas', caption: 'Bolsa • Detalhe da costura artesanal', seoTitle: 'Bolsa Porta-Lira — Costura Artesanal', seoDescription: 'Detalhe da costura artesanal da bolsa porta-lira, feita à mão para acompanhar a Lira 15 cordas do ateliê.', seoCaption: 'Costura artesanal que garante durabilidade: cada ponto da bolsa é feito para acompanhar a Lira por anos.' },
      { slug: 'lira-bolsa-confeccao-atelier', src: encodeURI('/products/Bols porta Lira instrumento sendo feito Backstage by fernando quincas.jpeg'), alt: 'Confecção da bolsa porta-lira no ateliê por Fernando Quincas', caption: 'Ateliê • Confecção da bolsa', seoTitle: 'Confecção da Bolsa Porta-Lira no Ateliê', seoDescription: 'Bolsa porta-lira sendo confeccionada no ateliê de Fernando Quincas — etapa manual que acompanha cada instrumento.', seoCaption: 'Do corte ao acabamento, a bolsa nasce no mesmo ateliê da Lira, com a mesma atenção ao detalhe.' },
      { slug: 'lira-conjunto-completo-bolsa', src: '/products/lira-bolsa-backstage.jpeg', alt: 'Lira com bolsa porta-lira — conjunto completo por Fernando Quincas', caption: 'Conjunto • Lira + Bolsa', seoTitle: 'Conjunto Lira + Bolsa Porta-Lira — Kit Completo', seoDescription: 'Conjunto completo Lira 15 cordas + bolsa porta-lira por Fernando Quincas, pronto para transporte e estudo.', seoCaption: 'Lira e bolsa juntas: instrumento afinado, bolsa protetora e guia musical — kit pronto para tocar.' },
      { slug: 'lira-guia-musical-partitura', src: '/products/lira-guia-musical.jpeg', alt: 'Guia musical para toque de lira com partitura didática e contas coloridas por Fernando Quincas', caption: 'Guia musical • Toque didático com contas coloridas', seoTitle: 'Guia Musical para Toque de Lira — Partitura Didática', seoDescription: 'Guia musical didático com partitura e contas coloridas para aprender a tocar a Lira 15 cordas de Fernando Quincas.', seoCaption: 'O guia que traduz o toque em cores: cada conta corresponde a uma corda, facilitando o aprendizado.' },
      { slug: 'lira-guia-capa-instrucoes', src: encodeURI('/products/Guia musical para toque de lira by Fernando Quincas.jpeg'), alt: 'Capa do guia musical para toque de lira por Fernando Quincas', caption: 'Guia • Capa com instruções de toque', seoTitle: 'Guia Musical — Capa com Instruções de Toque', seoDescription: 'Capa do guia musical incluso na Lira 15 cordas, com instruções passo a passo para iniciantes criadas por Fernando Quincas.', seoCaption: 'Capa do guia que acompanha a Lira: instruções claras para tocar desde o primeiro dia, sem leitura musical prévia.' },
      { slug: 'lira-backstage-01-cravelhas', src: '/products/lira-backstage-01.jpeg', alt: 'Lateral da lira com cordas e cravelhas metálicas — backstage por Fernando Quincas', caption: 'Backstage 01 • Cravelhas e cordas de aço', seoTitle: 'Lira Lateral — Cravelhas e Cordas de Aço', seoDescription: 'Vista lateral da Lira com cravelhas metálicas e cordas de aço, detalhe da afinação manual no ateliê.', seoCaption: 'Cravelhas metálicas que seguram cada uma das 15 cordas com precisão e elegância.' },
      { slug: 'lira-backstage-02-cavalete-latao', src: '/products/lira-backstage-02.jpeg', alt: 'Detalhe do cavalete em latão dourado da lira por Fernando Quincas', caption: 'Backstage 02 • Cavalete em latão dourado', seoTitle: 'Lira Cavalete em Latão Dourado — Detalhe', seoDescription: 'Close do cavalete e pestana em latão dourado da Lira 15 cordas, peça que transmite vibração e sustenta a afinação.', seoCaption: 'Latão dourado no cavalete: brilho discreto que conduz o som da corda à madeira.' },
      { slug: 'lira-backstage-03-perspectiva-superior', src: '/products/lira-backstage-03.jpeg', alt: 'Perspectiva superior da lira — ângulo superior por Fernando Quincas', caption: 'Backstage 03 • Perspectiva superior', seoTitle: 'Lira Perspectiva Superior — Visão do Topo', seoDescription: 'Vista superior da Lira 15 cordas mostrando simetria, espaçamento das cordas e coração vazado central.', seoCaption: 'Vista de cima revela a geometria da Lira: cordas alinhadas, simetria e o coração vazado ao centro.' },
      { slug: 'lira-montagem-cordas-atelier', src: encodeURI('/products/Lira instrumento sendo feito Backstage by fernando quincas.jpeg'), alt: 'Montagem das cordas da lira no ateliê por Fernando Quincas', caption: 'Ateliê • Montagem das cordas', seoTitle: 'Montagem das Cordas da Lira no Ateliê', seoDescription: 'Etapa de montagem das 15 cordas de aço na Lira artesanal, com calibragem manual por Fernando Quincas.', seoCaption: 'Cada corda é posicionada à mão, uma a uma, até o conjunto ganhar tensão harmônica.' },
      { slug: 'lira-afinacao-manual', src: encodeURI('/products/Lira instrumento sendo feito Backstage by fernando quincas 2.jpeg'), alt: 'Afinação manual da lira com cordas por Fernando Quincas', caption: 'Ateliê • Afinação manual', seoTitle: 'Afinação Manual da Lira — Som Cristalino', seoDescription: 'Lira sendo afinada manualmente no ateliê, garantindo timbre cristalino em cada uma das 15 cordas.', seoCaption: 'Afinação manual: o ouvido do artesão ajusta cada corda até o timbre cristalino que define a Lira.' },
      { slug: 'lira-acabamento-acetinado', src: encodeURI('/products/Lira instrumento sendo feito Backstage by fernando quincas 3.jpeg'), alt: 'Detalhe do acabamento acetinado da lira por Fernando Quincas', caption: 'Ateliê • Acabamento acetinado', seoTitle: 'Acabamento Acetinado da Lira — Verniz Manual', seoDescription: 'Close do verniz acetinado da Lira em madeira nobre, acabamento manual que protege e embeleza o instrumento.', seoCaption: 'Verniz acetinado que protege a madeira e deixa o toque suave, pronto para o colo por horas.' },
      { slug: 'lira-vista-artistica-completa', src: encodeURI('/products/Lira instrumento musical de corda by fernando quincas,.jpeg'), alt: 'Vista artística completa da lira 15 cordas por Fernando Quincas', caption: 'Vista artística • Lira completa', seoTitle: 'Vista Artística Completa da Lira 15 Cordas', seoDescription: 'Vista artística da Lira 15 cordas completa por Fernando Quincas, instrumento e escultura em madeira nobre.', seoCaption: 'A Lira como escultura: madeira, cordas e luz que fazem do instrumento também objeto de arte.' },
    ],
    details: {
      dimensions: '52 × 38 × 6 cm (C × L × Esp)',
      weight: '1,2 kg',
      materials: ['Madeira nobre selecionada', 'Cordas de aço com cravelhas metálicas', 'Cavalete e pestana em latão dourado'],
      technique: 'Marcenaria fina, entalhe do coração vazado, calibragem e afinação manual, verniz acetinado',
      edition: 'Série Artesanal do Ateliê — com bolsa porta-lira e guia musical didático',
      includes: ['Bolsa porta-lira em tecido', 'Guia musical didático para toque com contas coloridas', 'Afinação manual no ateliê'],
    },
  },
];

export const getInstrumentById = (id: string) => INSTRUMENTS.find((i) => i.id === id);
export const getFeaturedInstrument = () => INSTRUMENTS[0];
export const getInstrumentImageBySlug = (slug: string) => INSTRUMENTS.flatMap((i) => i.gallery).find((img) => img.slug === slug);
export const getAllInstrumentSlugs = () => INSTRUMENTS.flatMap((i) => i.gallery.map((img) => img.slug));
