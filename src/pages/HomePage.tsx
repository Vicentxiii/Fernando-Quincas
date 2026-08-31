/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { IntroPhilosophy } from '../components/IntroPhilosophy';
import { TheStoryTimeline } from '../components/TheStoryTimeline';
import { WorksGallery } from '../components/WorksGallery';
import { TheAtelier } from '../components/TheAtelier';
import { MediaSection } from '../components/MediaSection';
import { BoutiqueSection } from '../components/BoutiqueSection';
import { CommissionsSection } from '../components/CommissionsSection';
import { ContactSection } from '../components/ContactSection';
import { ArtworkModal } from '../components/ArtworkModal';
import { Artwork } from '../types';

const GlobeFolioSection = lazy(() =>
  import('../components/GlobeFolioSection').then((m) => ({ default: m.GlobeFolioSection }))
);

interface HomePageProps {
  savedArtworkIds: string[];
  onToggleSave: (artworkId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  savedArtworkIds,
  onToggleSave,
}) => {
  const location = useLocation();
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [contactInitialConfig, setContactInitialConfig] = useState<{
    spaceType?: string;
    motif?: string;
    scale?: string;
    artworkTitle?: string;
  } | null>(null);

  // When arriving from another route with a section target, scroll to it.
  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (state?.scrollTo) {
      const id = state.scrollTo;
      window.history.replaceState({}, '');
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }, [location.state]);

  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInquireArtwork = (artwork: Artwork) => {
    setContactInitialConfig({
      artworkTitle: artwork.title,
    });
    handleNavigate('contact');
  };

  const handleStartCommission = (config?: { spaceType: string; motif: string; scale: string }) => {
    if (config) {
      setContactInitialConfig(config);
    }
    handleNavigate('contact');
  };

  // SEO Home - garante title/description/canonical e FAQ para Google e IAs ao navegar via SPA
  useEffect(() => {
    const title = 'Conheça o Atelier de Fernando Quincas — Mestre Artesão em Fibra de Vidro | Esculturas Monumentais';
    const description = 'Conheça o Atelier de Fernando Quincas, mestre artesão em fibra de vidro em Minas Gerais. Esculturas monumentais, fontes, vasos e obras sob medida feitas à mão há 40 anos.';
    const url = 'https://fernandoquincas.com.br/';
    document.title = title;
    const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:type', 'website');
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    // FAQ para IAs citarem — GEO
    const faqLd = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Quem é Fernando Quincas?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Fernando Quincas é mestre artesão em fibra de vidro há 40 anos, criador da Boneca Eva de 45 metros, da Galinha de Monte Verde e de fontes monumentais como a Fonte Gigante Paulo Leardi 10m. Seu atelier fica em Minas Gerais, na Serra dos Órgãos.',
          },
        },
        {
          '@type': 'Question',
          name: 'O que é o Atelier de Fernando Quincas?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'É o atelier de esculturas monumentais em fibra de vidro, douração 24k e pedra reconstituída em Minas Gerais. Produz fontes, vasos, colunas, lobas, galinhas gigantes e obras sob medida para jardins, fazendas, hotéis e praças. Conheça o Atelier de Fernando Quincas, mestre artesão em fibra de vidro.',
          },
        },
        {
          '@type': 'Question',
          name: 'O que é fibra de vidro e por que o atelier usa?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Fibra de vidro é um compósito leve e resistente à chuva, sol e tempo. O atelier de Fernando Quincas domina laminação com resina e fibra, tinta PU automotiva e pátina mineral, criando obras que imitam pedra e bronze mas resistem décadas no externo.',
          },
        },
        {
          '@type': 'Question',
          name: 'Como encomendar uma obra sob medida?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'São 6 etapas: diálogo inicial, conceito e maquete em argila, engenharia e matrizes, escultura direta no atelier, acabamento e douração 24k, e logística especializada com instalação in situ em todo o Brasil.',
          },
        },
      ],
    };
    let script = document.head.querySelector<HTMLScriptElement>('script[data-faq-home="true"]');
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-faq-home', 'true');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(faqLd);
  }, []);

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <Hero
        onExploreCollection={() => handleNavigate('works')}
        onEnterAtelier={() => handleNavigate('atelier')}
        onDiscoverGarden={() => handleNavigate('garden')}
      />

      {/* GlobeFolio — Galeria 3D Interativa */}
      <Suspense fallback={<div className="bg-[#16251E] py-24" aria-hidden="true" />}>
        <GlobeFolioSection />
      </Suspense>

      {/* 01: Introduction & Philosophy */}
      <IntroPhilosophy
        onLearnTechniques={() => handleNavigate('techniques')}
        onExploreStory={() => handleNavigate('story')}
      />

      {/* 02: The Story / A Life in Sculpture Timeline */}
      <TheStoryTimeline />

      {/* 04: Works / The Collection */}
      <WorksGallery
        onSelectArtwork={(art) => setSelectedArtwork(art)}
        onToggleSave={onToggleSave}
        savedArtworkIds={savedArtworkIds}
      />

      {/* 07: The Atelier Documentary */}
      <TheAtelier />

      {/* 08: Media & Press Recognition */}
      <MediaSection
        onContactPress={() => handleNavigate('contact')}
      />

      {/* 09: The Gallery Boutique */}
      <BoutiqueSection
        onSelectArtwork={(art) => setSelectedArtwork(art)}
        onInquireArtwork={handleInquireArtwork}
        onToggleSave={onToggleSave}
        savedArtworkIds={savedArtworkIds}
      />

      {/* 09: Bespoke Commissions */}
      <CommissionsSection
        onStartCommission={handleStartCommission}
      />

      {/* 10: Private Salon Contact */}
      <ContactSection
        initialConfig={contactInitialConfig}
        savedArtworksCount={savedArtworkIds.length}
      />

      {/* Detailed Artwork Inspector Modal */}
      <ArtworkModal
        artwork={selectedArtwork}
        onClose={() => setSelectedArtwork(null)}
        onInquire={handleInquireArtwork}
        onToggleSave={onToggleSave}
        isSaved={selectedArtwork ? savedArtworkIds.includes(selectedArtwork.id) : false}
      />
    </main>
  );
};