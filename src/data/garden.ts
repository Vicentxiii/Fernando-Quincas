import { GardenZone } from '../types';

export const GARDEN_ZONES: GardenZone[] = [
  {
    id: 'zone-swan-pavilion',
    name: 'O Grande Espelho dos Cisnes',
    frenchName: 'Bassin dos Cisnes Régios',
    description: 'Uma lagoa serena emoldurada por salgueiros-chorões e bromélias gigantes. Ao centro, a obra "O Cisne Imperatriz" repousa sobre pedestal submerso em travertino, cercada por cisnes brancos vivos.',
    flora: ['Vitórias-régias', 'Salgueiros-chorões', 'Lótus rosa', 'Lajes de pedra cobertas de musgo'],
    focalPieceId: 'le-cygne-imperatrice',
    focalPieceTitle: 'O Cisne Imperatriz em Ouro e Mármore',
    atmosphere: 'Névoa matinal, canto de pássaros da serra, água suave tocando a pedra esculpida.',
    xPercent: 24,
    yPercent: 38,
    image: 'https://images.unsplash.com/photo-1516570161787-2fd917215a3d?auto=format&fit=crop&w=1200&q=80',
    audioSoundscape: 'Ondulações da água e sons da serra'
  },
  {
    id: 'zone-fountain-cascade',
    name: 'A Cascata das Ninfas',
    frenchName: 'Grande Teatro de Águas & Rocaille',
    description: 'Uma fonte monumental em três níveis de bacias entalhadas encosta acima. A água escorre através de conchas douradas em cascatas harmoniosas integradas à vegetação nativa.',
    flora: ['Samambaias gigantes (Dicksonia)', 'Bambuzais', 'Bromélias aéreas (Tillandsia)', 'Musgo de mata preservada'],
    focalPieceId: 'fontaine-des-nymphes-botaniques',
    focalPieceTitle: 'Fonte das Ninfas Botânicas',
    atmosphere: 'Som contínuo e relaxante de cascata, brisa fresca da mata e ar puro da serra.',
    xPercent: 68,
    yPercent: 28,
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    audioSoundscape: 'Ressonância cristalina de cascatas'
  },
  {
    id: 'zone-monumental-arch',
    name: 'O Pórtico Botânico Triunfal',
    frenchName: 'Arco Celeste & Alameda das Esculturas',
    description: 'O portal cerimonial que conecta os jardins baixos à trilha de esculturas da serra. Volutas douradas erguem-se a seis metros de altura, emoldurando o horizonte das montanhas de Minas Gerais.',
    flora: ['Buganvílias roxas', 'Maracujás silvestres (Passiflora)', 'Orquídeas imperiais', 'Palmeiras nobres'],
    focalPieceId: 'l-arche-des-fleurs-celestes',
    focalPieceTitle: 'O Arco das Flores Celestes',
    atmosphere: 'Luz dourada atravessando os ramos esculturais, perfume de flores ao entardecer.',
    xPercent: 48,
    yPercent: 62,
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
    audioSoundscape: 'Folhagens ao vento e canto dos pássaros'
  },
  {
    id: 'zone-sentinel-lake',
    name: 'A Esplanada dos Cisnes Guardiões',
    frenchName: 'Esplanada dos Cisnes Gêmeos',
    description: 'Um terraço clássico revestido em pedras nobres com topiarias e pérgulas, guardado pelas silhuetas imponentes de "Os Cisnes Gêmeos do Espelho d’Água".',
    flora: ['Topiarias clássicas', 'Cercas vivas de jasmim', 'Lavandas', 'Agapantos brancos'],
    focalPieceId: 'les-cygnes-jumeaux-du-bassin',
    focalPieceTitle: 'Os Cisnes Gêmeos do Espelho d’Água',
    atmosphere: 'Tranquilidade e ordem geométrica em harmonia com a natureza viva.',
    xPercent: 82,
    yPercent: 74,
    image: 'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?auto=format&fit=crop&w=1200&q=80',
    audioSoundscape: 'Gotas de água serenas e brisa suave'
  },
  {
    id: 'zone-bird-of-paradise',
    name: 'A Clareira Tropical Policromada',
    frenchName: 'Clareira das Cores & Estrelícias',
    description: 'Um anfiteatro recolhido entre estrelícias gigantes e folhagens tropicais, centrado na monumental escultura policromada "A Ave-do-Paraíso Imperial".',
    flora: ['Estrelícias gigantes (Ave-do-Paraíso)', 'Helicônias', 'Antúrios selvagens', 'Costelas-de-adão'],
    focalPieceId: 'l-oiseau-de-paradis-imperial',
    focalPieceTitle: 'A Ave-do-Paraíso Imperial',
    atmosphere: 'Vibração de cores tropicais e reflexos dourados sob o sol do meio-dia.',
    xPercent: 18,
    yPercent: 78,
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    audioSoundscape: 'Pássaros nativos e brisa da floresta'
  }
];
