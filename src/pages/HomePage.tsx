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
import { MaterialTechnique } from '../components/MaterialTechnique';
import { GardenExperience } from '../components/GardenExperience';
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

      {/* 05: Material & Technique */}
      <MaterialTechnique />

      {/* 06: The Living Garden */}
      <GardenExperience
        onSelectArtwork={(art) => setSelectedArtwork(art)}
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