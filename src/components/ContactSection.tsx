import React, { useState, useEffect } from 'react';
import { InquiryFormData } from '../types';
import { Mail, Phone, Instagram, Send, CheckCircle2 } from 'lucide-react';

interface ContactSectionProps {
  initialConfig?: {
    spaceType?: string;
    motif?: string;
    scale?: string;
    artworkTitle?: string;
  } | null;
  savedArtworksCount: number;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  initialConfig,
  savedArtworksCount,
}) => {
  const [formData, setFormData] = useState<InquiryFormData>({
    name: '',
    email: '',
    phone: '',
    clientType: 'PRIVATE_COLLECTOR',
    projectType: 'MONUMENTAL_COMMISSION',
    preferredMaterials: ['Folha de Ouro 24k', 'Fibra Naval Monumental'],
    estimatedBudget: 'Sob Consulta',
    intendedLocation: '',
    message: '',
    selectedArtworks: [],
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (initialConfig) {
      let customMsg = '';
      if (initialConfig.artworkTitle) {
        customMsg = `Gostaria de receber o dossiê curatorial completo e detalhes de aquisição para a obra: "${initialConfig.artworkTitle}".\n`;
      }
      if (initialConfig.spaceType) {
        customMsg += `Estou planejando um projeto sob medida para ${initialConfig.spaceType}, com motivo escultural inspirado em "${initialConfig.motif}" na escala ${initialConfig.scale}.`;
      }
      if (customMsg) {
        setFormData((prev) => ({
          ...prev,
          message: customMsg,
        }));
      }
    }
  }, [initialConfig]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 sm:py-32 px-6 sm:px-8 md:px-12 bg-[#FAF8F5] text-[#1E1D1A] relative overflow-hidden">
      {/* Editorial Decorative Background */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#F5F2EB] pointer-events-none hidden lg:block" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#C8A86B]/25 pb-8 mb-16">
          <div>
            <span className="text-[10px] sm:text-[11px] tracking-[0.3em] text-[#C8A86B] uppercase font-mono block mb-2">
              CAPÍTULO X • ATENDIMENTO EXCLUSIVO & CONTATO
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#1E1D1A] font-light tracking-tight">
              VAMOS CRIAR ALGO <br />
              <span className="italic font-normal text-[#9C7D3E]">EXTRAORDINÁRIO</span>
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#2C2A26]/80 font-light leading-relaxed">
            Visitas privativas ao Ateliê e Parque de Esculturas em Minas Gerais são agendadas mediante contato prévio.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            {isSubmitted ? (
              <div className="p-10 sm:p-14 rounded-3xl bg-[#FAF6EE] border border-[#C8A86B]/40 text-center space-y-6 animate-fadeIn shadow-xl">
                <div className="w-16 h-16 rounded-full bg-[#16251E] text-[#E0C995] flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-3xl text-[#1E1D1A]">
                  Sua Mensagem foi Recebida
                </h3>
                <p className="text-sm text-[#2C2A26]/80 max-w-md mx-auto font-light leading-relaxed">
                  Agradecemos seu contato, <span className="font-semibold text-[#1E1D1A]">{formData.name}</span>. A equipe do ateliê Fernando Quincas analisará seus apontamentos e responderá em até 24 horas úteis com o dossiê e orientações.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-2.5 rounded-full border border-[#C8A86B]/40 text-xs font-mono tracking-widest hover:bg-[#C8A86B]/10"
                  >
                    ENVIAR NOVA MENSAGEM
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="glass-card p-6 sm:p-10 rounded-3xl border border-[#C8A86B]/30 shadow-2xl bg-[#FAF8F5] space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-[#9C7D3E] uppercase tracking-wider block">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Seu nome ou escritório..."
                      className="w-full px-4 py-3 rounded-xl bg-[#FAF6EE] border border-[#C8A86B]/30 text-xs font-mono text-[#1E1D1A] focus:border-[#1E1D1A] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-[#9C7D3E] uppercase tracking-wider block">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="contato@exemplo.com"
                      className="w-full px-4 py-3 rounded-xl bg-[#FAF6EE] border border-[#C8A86B]/30 text-xs font-mono text-[#1E1D1A] focus:border-[#1E1D1A] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-[#9C7D3E] uppercase tracking-wider block">
                      Telefone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+55 (21) 99999-9999"
                      className="w-full px-4 py-3 rounded-xl bg-[#FAF6EE] border border-[#C8A86B]/30 text-xs font-mono text-[#1E1D1A] focus:border-[#1E1D1A] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-[#9C7D3E] uppercase tracking-wider block">
                      Natureza da Solicitação
                    </label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value as InquiryFormData['projectType'] })}
                      className="w-full px-4 py-3 rounded-xl bg-[#FAF6EE] border border-[#C8A86B]/30 text-xs font-mono text-[#1E1D1A] focus:border-[#1E1D1A] outline-none"
                    >
                      <option value="MONUMENTAL_COMMISSION">Projeto Escultural Monumental</option>
                      <option value="ACQUISITION">Aquisição de Obra da Coleção</option>
                      <option value="GARDEN_INSTALLATION">Instalação em Parque / Jardim</option>
                      <option value="CUSTOM_FOUNTAIN">Fonte Escultural em Cascata</option>
                      <option value="PRIVATE_VIEWING">Agendamento de Visita ao Ateliê</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#9C7D3E] uppercase tracking-wider block">
                    Local do Projeto / Cidade ou País
                  </label>
                  <input
                    type="text"
                    value={formData.intendedLocation}
                    onChange={(e) => setFormData({ ...formData, intendedLocation: e.target.value })}
                    placeholder="Ex.: Residência em Minas Gerais / Fazenda no interior de SP / Projeto no exterior"
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF6EE] border border-[#C8A86B]/30 text-xs font-mono text-[#1E1D1A] focus:border-[#1E1D1A] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#9C7D3E] uppercase tracking-wider block">
                    Mensagem & Detalhes da Visão Espacial *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Descreva sua ideia, preferências de escala, ambiente de destino ou obras que deseja conhecer..."
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF6EE] border border-[#C8A86B]/30 text-xs font-mono text-[#1E1D1A] focus:border-[#1E1D1A] outline-none resize-none"
                  />
                </div>

                {savedArtworksCount > 0 && (
                  <div className="p-3 rounded-xl bg-[#FAF6EE] border border-[#C8A86B]/30 text-xs font-mono text-[#2C2A26] flex items-center justify-between">
                    <span>Inclui {savedArtworksCount} obras salvas em seu Dossiê Privado</span>
                    <span className="text-[#9C7D3E] font-bold">ANEXADO</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-[#1E1D1A] text-[#FAF8F5] hover:bg-[#C8A86B] hover:text-[#1E1D1A] transition-all duration-300 text-xs tracking-[0.2em] font-semibold flex items-center justify-center gap-2 shadow-xl"
                >
                  <Send className="w-4 h-4" />
                  <span>ENVIAR MENSAGEM AO ATELIÊ</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Atelier Coordinates */}
          <div className="lg:col-span-5 space-y-8 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Minas Gerais Sanctuary */}
              <div className="p-6 rounded-2xl bg-[#FAF6EE] border border-[#C8A86B]/30 space-y-2">
                <span className="text-[10px] font-mono tracking-widest text-[#C8A86B] uppercase block">
                  ATELIÊ PRINCIPAL & PARQUE DE ESCULTURAS
                </span>
                <h4 className="font-serif text-xl text-[#1E1D1A]">
                  Ateliê Fernando Quincas
                </h4>
                <p className="text-xs text-[#2C2A26]/80 font-mono leading-relaxed">
                  Região Serrana • Minas Gerais<br />
                </p>
                <div className="text-xs font-mono text-[#8A82A5] pt-2">
                  * Visitas privativas agendadas previamente
                </div>
              </div>

              {/* Direct Liaison */}
              <div className="space-y-3 pt-2 text-xs font-mono text-[#1E1D1A]">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#C8A86B]" />
                  <span>contato@fernandoquincas.art</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#C8A86B]" />
                  <span>+55 11 97585-5263</span>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="pt-6 border-t border-[#C8A86B]/25 flex items-center justify-between">
              <span className="text-xs font-serif italic text-[#8A82A5]">
                Instagram: @fernando_quincas
              </span>
              <a
                href="https://www.instagram.com/fernando_quincas"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-full border border-[#C8A86B]/40 hover:bg-[#C8A86B] hover:text-white transition-colors"
                aria-label="Perfil no Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
