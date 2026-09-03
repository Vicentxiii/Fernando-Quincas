export interface InstrumentImage {
  src: string;
  alt: string;
  caption?: string;
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
      { src: '/products/lira-instrumento-musical-corda.jpeg', alt: 'Lira de 15 cordas em madeira nobre — vista frontal com coração vazado', caption: 'Vista frontal • Coração vazado central' },
      { src: '/products/lira-traseira-backstage.jpeg', alt: 'Traseira da lira — madeira nobre e acabamento acetinado', caption: 'Traseira • Madeira nobre selecionada' },
      { src: encodeURI('/products/Lira traseira instrumento sendo feito Backstage by fernando quincas.jpeg'), alt: 'Traseira da lira em produção — detalhe do tampo', caption: 'Backstage • Tampo em construção' },
      { src: '/products/lira-bolsa-close.jpeg', alt: 'Close da bolsa porta-lira — tecido e acabamento', caption: 'Bolsa porta-lira • Close do tecido' },
      { src: encodeURI('/products/Close da bolsa porta lira.jpeg'), alt: 'Close da bolsa porta-lira — detalhe da costura', caption: 'Bolsa • Detalhe da costura artesanal' },
      { src: encodeURI('/products/Bols porta Lira instrumento sendo feito Backstage by fernando quincas.jpeg'), alt: 'Bolsa porta-lira sendo confeccionada no ateliê', caption: 'Ateliê • Confecção da bolsa' },
      { src: '/products/lira-bolsa-backstage.jpeg', alt: 'Lira com bolsa porta-lira — conjunto completo', caption: 'Conjunto • Lira + Bolsa' },
      { src: '/products/lira-guia-musical.jpeg', alt: 'Guia musical para toque de lira — partitura didática', caption: 'Guia musical • Toque didático com contas coloridas' },
      { src: encodeURI('/products/Guia musical para toque de lira by Fernando Quincas.jpeg'), alt: 'Guia musical para toque de lira por Fernando Quincas — capa', caption: 'Guia • Capa com instruções de toque' },
      { src: '/products/lira-backstage-01.jpeg', alt: 'Lira em backstage — lateral com cordas e cravelhas', caption: 'Backstage 01 • Cravelhas e cordas de aço' },
      { src: '/products/lira-backstage-02.jpeg', alt: 'Lira em backstage — detalhe do cavalete em latão', caption: 'Backstage 02 • Cavalete em latão dourado' },
      { src: '/products/lira-backstage-03.jpeg', alt: 'Lira em backstage — ângulo superior', caption: 'Backstage 03 • Perspectiva superior' },
      { src: encodeURI('/products/Lira instrumento sendo feito Backstage by fernando quincas.jpeg'), alt: 'Lira sendo feita no ateliê — etapa de montagem', caption: 'Ateliê • Montagem das cordas' },
      { src: encodeURI('/products/Lira instrumento sendo feito Backstage by fernando quincas 2.jpeg'), alt: 'Lira sendo feita — afinando as cordas', caption: 'Ateliê • Afinação manual' },
      { src: encodeURI('/products/Lira instrumento sendo feito Backstage by fernando quincas 3.jpeg'), alt: 'Lira sendo feita — detalhe do acabamento', caption: 'Ateliê • Acabamento acetinado' },
      { src: encodeURI('/products/Lira instrumento musical de corda by fernando quincas,.jpeg'), alt: 'Lira instrumento musical de corda por Fernando Quincas — vista artística', caption: 'Vista artística • Lira completa' },
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
