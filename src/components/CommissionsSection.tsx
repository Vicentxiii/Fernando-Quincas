import React, { useState, useEffect } from 'react';
import { COMMISSION_STEPS } from '../data/commissions';
import { ArrowRight, CheckCircle2, X, MapPin, Sparkles } from 'lucide-react';

interface CommissionsSectionProps {
  onStartCommission: (config?: { spaceType: string; motif: string; scale: string }) => void;
}

type Destino = {
  title: string;
  shortDesc: string;
  image: string;
  fullDesc: string;
  oQueE: string;
  inclui: string[];
  idealPara: string;
  exemploReal: string;
  spaceTypeValue: string;
  motifValue: string;
};

export const CommissionsSection: React.FC<CommissionsSectionProps> = ({ onStartCommission }) => {
  const [activeStep, setActiveStep] = useState(0);

  // Interactive Bespoke Configurator State
  const [spaceType, setSpaceType] = useState('Parque ou Jardim Botânico Privado');
  const [motif, setMotif] = useState('Cisne Monumental & Conchas Ornamentais');
  const [scale, setScale] = useState('Monumental (3 a 6+ metros)');

  const [selectedDestino, setSelectedDestino] = useState<number | null>(null);

  const projectEnvironments: Destino[] = [
    {
      title: 'Residências & Fazendas Históricas',
      shortDesc: 'Consolos entalhados, espelhos com moldura dourada e peças centrais exclusivas.',
      image: encodeURI('/Coluna grega com vaso By fernando Quincas.jpeg'),
      fullDesc:
        'Este destino é a alma clássica da casa. Fernando Quincas devolve à residência e à fazenda histórica o vocabulário da arquitetura nobre — consolos cantoneira entalhados à mão, espelhos com moldura dourada em folha 24k, colunas jônicas caneladas com vaso-coroa, mesas Luiz XV cabriolé e vasos guirlanda — tudo em fibra de vidro/pedra reconstituída com pátina mineral resistente a sol e chuva.',
      oQueE:
        'O card DESTINO 01 representa encomendas para interiores e alamedas residenciais: peças que elevam hall, varanda gourmet, lareira e corredores a galeria particular. Cada obra é modelada manualmente no ateliê em Minas, com acabamento que envelhece com charme e cria musgo natural nas concavidades quando desejado.',
      inclui: [
        'Consolo cantoneira entalhado com filigrana e volutas (ex.: Cantoneira by Fernando Quincas)',
        'Espelhos com moldura dourada e consoles clássicos',
        'Coluna Grega Clássica 98 cm + Vaso Guirlanda Ø 42 cm com borda em relevo',
        'Mesa Luiz XV cabriolé 54×62 cm — tampo nobre e pés de garra',
        'Pedestal Amarelo Canário jônico — ponto de cor arquitetônico',
      ],
      idealPara: 'Hall de entrada, sala de estar, varanda gourmet, alameda de fazenda, corredor nobre ou lareira.',
      exemploReal: 'Coluna Grega 98cm, Vaso Guirlanda, Mesa Luiz XV, Pedestal Amarelo e Coluna do Anjo Guardião 165cm — todas já no acervo da Loja.',
      spaceTypeValue: 'Fazenda Histórica ou Propriedade Rural',
      motifValue: 'Consolo Entalhado & Dourado a Ouro',
    },
    {
      title: 'Jardins Botânicos & Parques',
      shortDesc: 'Cisnes monumentais em fibra naval, fontes com cascata e pórticos botânicos.',
      image: encodeURI('/Fonte com Cisnes by Fernando Quincas .jpeg'),
      fullDesc:
        'O jardim como galeria a céu aberto. Neste destino, o ateliê cria esculturas que organizam o verde: cisnes imperiais que viram vaso, cervos em salto, fontes com cascata em degraus, pórticos botânicos com orquídeas e maracujás dourados e torôs japoneses luminosos.',
      oQueE:
        'O card DESTINO 02 é para quem quer transformar canteiros, lagos e trilhas em percurso escultural. São obras feitas para intempérie — fibra naval, resina e pedra reconstituída seladas, sem criar limo estrutural, com som de água e reflexo que fotografam bem de dia e de noite.',
      inclui: [
        'Cisne Imperial 62×42 cm — vaso escultural ícone do ateliê',
        'Cervo do Jardim 48 cm — fibra branca brilhante para canteiros',
        'Fonte Cabeça de Leão com bacia em mármore reconstituído',
        'Fonte de Pedra Grande 1,80×1,70 com bomba inclusa e instalação',
        'Arco Botânico Triunfal 7,8 m + Gazebo Tenda 350×200×270 em ferro/resina/lona',
        'Torô Japonês garden — lanterna dia e noite à beira de lagos',
      ],
      idealPara: 'Lagos, espelhos d’água, alamedas, canteiros de entrada, trilhas botânicas e praças privadas.',
      exemploReal: 'Fonte com Cisnes monumental (Santuário Botânico MG) e Arco Botânico — estudos de caso em OBRAS MONUMENTAIS.',
      spaceTypeValue: 'Parque ou Jardim Botânico Privado',
      motifValue: 'Cisne Monumental & Conchas Ornamentais',
    },
    {
      title: 'Hotéis de Luxo & Spas',
      shortDesc: 'Fontes centrais para pátios nobres, portais de entrada monumentais e esculturas acústicas.',
      image: encodeURI('/Fonte Paulo LEARDI fernando Quincas.png'),
      fullDesc:
        'Hospitalidade que vira monumento. Hotéis, pousadas e spas ganham fontes centrais que viram cartão-postal, portais de entrada que marcam chegada e esculturas acústicas (lira) que embalam o lobby com timbre cristalino.',
      oQueE:
        'O card DESTINO 03 representa projetos de alto impacto visual e sensorial: presença de 2,50 m a 10 m de fachada, bomba automática integrada, 3 bombas dedicadas em obras gigantes, estrutura leve/desmontável em fibra que imita pedra tratada — sem peso de pedra natural e sem musgo. Tudo fotografável, com som de água constante e microclima de frescor.',
      inclui: [
        'Fonte de Pedra Tratada 2,50×2,50×1,50 m — 150–200 kg desmontável, bomba automática dentro',
        'Fonte Gigante Paulo Leardi 10×3 m — 2.000 kg, tanque para peixes, 3 bombas, vista por milhares/dia no Portal do Morumbi',
        'Gazebo Tenda 350×200×270 — ferro + resina + lona tensionada (vira lounge, palco DJ ou capela)',
        'Pórtico Botânico Escultural e portais de entrada dourados',
        'Lira 15 cordas — escultura acústica para spa e hall',
      ],
      idealPara: 'Pátio nobre, fachada de hotel, piscina, spa, portal de entrada e lounge externo.',
      exemploReal: 'Fonte Paulo Leardi 10m (Portal do Morumbi, SP) — obra que transformou fachada em monumento urbano por R$ 50.000.',
      spaceTypeValue: 'Pátio de Hotel de Luxo ou Spa',
      motifValue: 'Fonte Esculpida em Cascata',
    },
    {
      title: 'Salões Nobres & Alta Gastronomia',
      shortDesc: 'Painéis murais em relevo escultural, revestimentos clássicos e composições policromáticas.',
      image: encodeURI('/Espaço Tematico com Bambu e Fontes Angulo Aberto by Fernando Quincas.png'),
      fullDesc:
        'Cenografia que vira experiência gastronômica. Salões, restaurantes, capelas e espaços de evento recebem painéis murais em relevo, revestimentos clássicos, composições policromáticas e personagens esculturais que contam história.',
      oQueE:
        'O card DESTINO 04 é o destino afetivo e instagramável: da Galinha de Monte Verde 1/1 (165 cm, 40 kg, 45 dias de ateliê) que acolhe na entrada do restaurante, às Bonecas Alice e Lua 60 cm na porta da cozinha, à Loba 1,20 m guardiã do salão. Inclui também iglus de concreto 4×4 m para criar novos salões no jardim.',
      inclui: [
        'Galinha de Monte Verde 165×100 cm — obra única 1/1, fibra + tinta PU, sol e chuva',
        'Bonecas Cozinheiras Alice e Lua 60 cm — par em fibra com tinta automotiva para porta de restaurante',
        'Loba Artesanal 1,20×0,80 m — 50 dias de ateliê, pelagem em volumes',
        'Torô Japonês + Painéis murais em relevo e altares (ex.: Altar Igreja Universal)',
        'Iglu de Concreto 4×4 m com clarabóia — novo salão/quarto no jardim, ideal para expandir restaurante/pousada',
        'Espaços temáticos em bambu, lona e fontes — cenografia completa',
      ],
      idealPara: 'Restaurante temático, salão de festas, capela, hall de pousada, espaço gourmet e área de eventos.',
      exemploReal: 'Galinha de Monte Verde (Restaurante Monte Verde) e Bonecas Alice e Lua — obras que viraram mascotes e aumentam tempo de permanência e fotos de clientes.',
      spaceTypeValue: 'Salão Nobre / Hall de Entrada',
      motifValue: 'Pórtico Botânico Escultural',
    },
  ];

  const handleLaunchBespoke = () => {
    onStartCommission({ spaceType, motif, scale });
  };

  // Fechar modal com ESC e travar scroll
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedDestino(null);
    };
    if (selectedDestino !== null) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [selectedDestino]);

  const activeDestino = selectedDestino !== null ? projectEnvironments[selectedDestino] : null;

  return (
    <section id="commissions" className="py-24 sm:py-32 px-6 sm:px-8 md:px-12 bg-[#16251E] text-[#FAF8F5] relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0D1713]/50 to-[#0D1713] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#C8A86B]/30 pb-8 mb-16">
          <div>
            <span className="text-[10px] sm:text-[11px] tracking-[0.3em] text-[#C8A86B] uppercase font-mono block mb-2">
              CAPÍTULO IX • PROJETOS ESPECIAIS & ENCOMENDAS
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#FAF8F5] font-light tracking-tight">
              CRIE ALGO <br />
              <span className="italic font-normal text-[#E0C995]">EXTRAORDINÁRIO</span>
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#FAF8F5]/80 font-light leading-relaxed">
            De peças exclusivas para interiores a fontes monumentais para parques e fazendas. Trabalhamos diretamente com colecionadores, paisagistas e arquitetos.
          </p>
        </div>

        {/* Suitable Environments Cards — clicáveis com modal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {projectEnvironments.map((env, i) => (
            <button
              key={i}
              onClick={() => setSelectedDestino(i)}
              className="group text-left p-6 rounded-2xl bg-[#0D1713] border border-[#C8A86B]/25 flex flex-col justify-between hover:border-[#E0C995] hover:bg-[#0D1713]/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E0C995]/60"
              aria-label={`Abrir detalhes de ${env.title}`}
            >
              <div>
                <span className="text-[10px] font-mono text-[#E0C995] tracking-widest block mb-2">DESTINO 0{i + 1}</span>
                <h4 className="font-serif text-lg text-[#FAF8F5] mb-2 group-hover:text-[#E0C995] transition-colors">{env.title}</h4>
                <p className="text-xs text-[#FAF8F5]/70 leading-relaxed font-light">{env.shortDesc}</p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-mono tracking-[0.18em] uppercase text-[#E0C995]/80 group-hover:text-[#E0C995] group-hover:gap-2 transition-all">
                Ver detalhes <ArrowRight className="w-3 h-3" />
              </span>
            </button>
          ))}
        </div>

        {/* 6-Step Process Display */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#C8A86B] uppercase block mb-2">O MÉTODO</span>
            <h3 className="font-serif text-2xl sm:text-4xl text-[#FAF8F5] font-light">As 6 Etapas de uma Obra sob Medida</h3>
          </div>

          {/* Steps Navigation Carousel */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            {COMMISSION_STEPS.map((step, idx) => {
              const isSelected = activeStep === idx;
              return (
                <button
                  key={step.number}
                  onClick={() => setActiveStep(idx)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#FAF8F5] text-[#16251E] border-[#FAF8F5] shadow-xl scale-[1.02]'
                      : 'bg-[#0D1713] text-[#FAF8F5] border-[#C8A86B]/20 hover:border-[#C8A86B]'
                  }`}
                >
                  <span className={`text-[10px] font-mono font-bold tracking-widest ${isSelected ? 'text-[#9C7D3E]' : 'text-[#E0C995]'}`}>{step.number}</span>
                  <h5 className="font-serif text-sm font-semibold mt-2 line-clamp-2">{step.title.split('&')[0]}</h5>
                  <span className={`text-[9px] font-mono mt-3 ${isSelected ? 'text-[#16251E]/60' : 'text-[#FAF8F5]/50'}`}>{step.duration}</span>
                </button>
              );
            })}
          </div>

          {/* Active Step Detailed Card */}
          {(() => {
            const currentStep = COMMISSION_STEPS[activeStep];
            return (
              <div className="glass-card rounded-3xl p-6 sm:p-10 border border-[#C8A86B]/40 text-[#1E1D1A] shadow-2xl bg-[#FAF8F5]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-5 rounded-2xl overflow-hidden aspect-[4/3] border border-[#C8A86B]/30 shadow-md">
                    <img src={currentStep.image} alt={currentStep.title} className="w-full h-full object-cover" />
                  </div>

                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center gap-3 text-xs font-mono text-[#9C7D3E]">
                      <span className="px-2.5 py-1 rounded-full bg-[#C8A86B]/20 font-bold">ETAPA {currentStep.number}</span>
                      <span>•</span>
                      <span>{currentStep.duration}</span>
                    </div>

                    <h4 className="font-serif text-2xl sm:text-3xl text-[#1E1D1A]">{currentStep.title}</h4>

                    <p className="text-sm text-[#2C2A26]/85 leading-relaxed font-light">{currentStep.description}</p>

                    <div className="pt-3 border-t border-[#C8A86B]/20">
                      <span className="text-[10px] font-mono tracking-wider uppercase text-[#C8A86B] block mb-2">ENTREGÁVEIS & GARANTIAS AO CLIENTE:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {currentStep.deliverables.map((del, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-[#2C2A26]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#C8A86B] shrink-0" />
                            <span>{del}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Interactive Bespoke Project Configurator Banner */}
        <div className="rounded-3xl p-8 sm:p-12 border border-[#C8A86B]/40 bg-[#0D1713] shadow-2xl">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#E0C995] uppercase block mb-2">CONFIGURADOR DE PROJETO SOB MEDIDA</span>
            <h3 className="font-serif text-2xl sm:text-4xl text-[#FAF8F5] font-light">Configure Sua Visão Espacial</h3>
            <p className="text-xs sm:text-sm text-[#FAF8F5]/70 mt-2 font-light">Selecione os parâmetros iniciais para dialogar diretamente com o ateliê e receber um estudo de viabilidade.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Space Type Selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-[#E0C995] uppercase block">01 • Ambiente Previsto</label>
              <select
                value={spaceType}
                onChange={(e) => setSpaceType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#16251E] border border-[#C8A86B]/30 text-[#FAF8F5] text-xs font-mono focus:border-[#E0C995] outline-none"
              >
                <option value="Parque ou Jardim Botânico Privado">Parque ou Jardim Botânico Privado</option>
                <option value="Pátio de Hotel de Luxo ou Spa">Pátio de Hotel de Luxo ou Spa</option>
                <option value="Fazenda Histórica ou Propriedade Rural">Fazenda Histórica ou Propriedade Rural</option>
                <option value="Salão Nobre / Hall de Entrada">Salão Nobre / Hall de Entrada</option>
                <option value="Praça ou Espaço Institucional">Praça ou Espaço Institucional</option>
              </select>
            </div>

            {/* Motif Selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-[#E0C995] uppercase block">02 • Motivo Escultural</label>
              <select
                value={motif}
                onChange={(e) => setMotif(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#16251E] border border-[#C8A86B]/30 text-[#FAF8F5] text-xs font-mono focus:border-[#E0C995] outline-none"
              >
                <option value="Cisne Monumental & Conchas Ornamentais">Cisne Monumental & Conchas Ornamentais</option>
                <option value="Fonte Esculpida em Cascata">Fonte Esculpida em Cascata</option>
                <option value="Pórtico Botânico Escultural">Pórtico Botânico Escultural</option>
                <option value="Consolo Entalhado & Dourado a Ouro">Consolo Entalhado & Dourado a Ouro</option>
                <option value="Escultura Acústica / Instrumento Nobre">Escultura Acústica / Instrumento Nobre</option>
              </select>
            </div>

            {/* Scale Selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-[#E0C995] uppercase block">03 • Escala & Dimensões</label>
              <select
                value={scale}
                onChange={(e) => setScale(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#16251E] border border-[#C8A86B]/30 text-[#FAF8F5] text-xs font-mono focus:border-[#E0C995] outline-none"
              >
                <option value="Monumental (3 a 6+ metros)">Monumental (3 a 6+ metros)</option>
                <option value="Destaque de Jardim (1.5 a 3 metros)">Destaque de Jardim (1.5 a 3 metros)</option>
                <option value="Escala para Interiores (1 a 2 metros)">Escala para Interiores (1 a 2 metros)</option>
                <option value="Peça de Coleção (&lt; 1 metro)">Peça de Coleção (&lt; 1 metro)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#FAF8F5]/10">
            <div className="text-xs text-[#FAF8F5]/70 font-mono">
              Selecionado: <span className="text-[#E0C995]">{spaceType}</span> • <span className="text-[#FAF8F5]">{motif}</span>
            </div>
            <button
              onClick={handleLaunchBespoke}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#FAF8F5] text-[#16251E] hover:bg-[#E0C995] transition-all text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 shadow-2xl"
            >
              <span>INICIAR UM PROJETO</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Destino — foto demonstrativa + explicação exata do card */}
      {activeDestino && selectedDestino !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-md animate-fadeIn" onClick={() => setSelectedDestino(null)} role="dialog" aria-modal="true" aria-label={`Detalhes ${activeDestino.title}`}>
          <div
            className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#FAF8F5] text-[#1E1D1A] border border-[#C8A86B]/40 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setSelectedDestino(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2.5 rounded-full border border-[#C8A86B]/30 hover:bg-[#1E1D1A] hover:text-white transition-colors z-20 bg-[#FAF8F5]"
              aria-label="Fechar modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Hero foto demonstrativa */}
            <div className="relative h-[260px] sm:h-[380px] w-full overflow-hidden">
              <img src={activeDestino.image} alt={activeDestino.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E1D1A]/75 via-[#1E1D1A]/10 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6 sm:bottom-6 sm:left-8 sm:right-8 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF8F5]/95 border border-[#C8A86B]/30 text-[10px] font-mono tracking-widest text-[#9C7D3E] uppercase">
                    <Sparkles className="w-3 h-3" /> DESTINO 0{selectedDestino + 1} • FOTO DEMONSTRATIVA
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-white mt-2 drop-shadow-lg">{activeDestino.title}</h3>
                  <p className="text-xs sm:text-sm text-white/85 font-light mt-1 max-w-xl line-clamp-2">{activeDestino.shortDesc}</p>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-white/80">
                  <MapPin className="w-3.5 h-3.5" /> Ateliê Fernando Quincas • Minas Gerais
                </span>
              </div>
            </div>

            {/* Conteúdo explicativo */}
            <div className="p-6 sm:p-8 md:p-10 space-y-8">
              {/* Header modal */}
              <div className="border-b border-[#C8A86B]/20 pb-6">
                <span className="text-[10px] tracking-[0.3em] uppercase font-mono text-[#C8A86B] block mb-2">O QUE É ESTE CARD — EXPLICAÇÃO EXATA</span>
                <h4 className="font-serif text-xl sm:text-2xl text-[#1E1D1A] leading-tight">{activeDestino.title}</h4>
                <p className="text-sm text-[#2C2A26]/80 font-light leading-relaxed mt-3">{activeDestino.fullDesc}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 space-y-5">
                  <div>
                    <h5 className="text-xs font-mono tracking-[0.2em] uppercase text-[#9C7D3E] mb-2">O que significa este destino?</h5>
                    <p className="text-sm text-[#2C2A26]/85 leading-relaxed font-light bg-[#FAF6EE] border border-[#C8A86B]/20 rounded-2xl p-4">{activeDestino.oQueE}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAF6EE] border border-[#C8A86B]/20">
                    <span className="text-[10px] font-mono tracking-wider uppercase text-[#C8A86B] block mb-3">O que está incluso neste destino:</span>
                    <ul className="space-y-2">
                      {activeDestino.inclui.map((item, idx) => (
                        <li key={idx} className="flex gap-2.5 text-xs sm:text-sm text-[#2C2A26] leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-[#C8A86B] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-4">
                  <div className="rounded-2xl overflow-hidden border border-[#C8A86B]/20 aspect-[4/3] bg-[#EAE5D8]">
                    <img src={activeDestino.image} alt={`Detalhe ${activeDestino.title}`} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-3 text-xs leading-relaxed">
                    <div className="p-3 rounded-xl bg-[#F5F2EB] border border-[#C8A86B]/20">
                      <span className="font-mono font-bold text-[#9C7D3E] tracking-widest text-[10px] uppercase block mb-1">Ideal para</span>
                      <span className="text-[#2C2A26]">{activeDestino.idealPara}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#0D1713] border border-[#C8A86B]/20 text-[#FAF8F5]">
                      <span className="font-mono font-bold text-[#E0C995] tracking-widest text-[10px] uppercase block mb-1">Exemplo real do ateliê</span>
                      <span className="font-light text-[#FAF8F5]/90">{activeDestino.exemploReal}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA modal */}
              <div className="pt-6 border-t border-[#C8A86B]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs font-mono text-[#8A82A5]">Dica: clique para já configurar seu projeto neste destino</span>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button onClick={() => setSelectedDestino(null)} className="flex-1 sm:flex-none px-6 py-3 rounded-full border border-[#C8A86B]/40 text-[#1E1D1A] hover:bg-[#C8A86B]/10 transition-colors text-xs font-mono tracking-widest uppercase">
                    Fechar
                  </button>
                  <button
                    onClick={() => {
                      const destino = activeDestino;
                      setSelectedDestino(null);
                      onStartCommission({ spaceType: destino.spaceTypeValue, motif: destino.motifValue, scale });
                    }}
                    className="flex-1 sm:flex-none px-6 py-3.5 rounded-full bg-[#1E1D1A] text-[#FAF8F5] hover:bg-[#C8A86B] hover:text-[#1E1D1A] transition-all text-xs font-semibold tracking-[0.18em] uppercase flex items-center justify-center gap-2 shadow-lg"
                  >
                    <span>Encomendar para {activeDestino.title.split(' &')[0]}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
