/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { IntroPhilosophy } from './components/IntroPhilosophy';
import { TheStoryTimeline } from './components/TheStoryTimeline';
import { MonumentalWorks } from './components/MonumentalWorks';
import { WorksGallery } from './components/WorksGallery';
import { MaterialTechnique } from './components/MaterialTechnique';
import { GardenExperience } from './components/GardenExperience';
import { TheAtelier } from './components/TheAtelier';
import { MediaSection } from './components/MediaSection';
import { BoutiqueSection } from './components/BoutiqueSection';
import { CommissionsSection } from './components/CommissionsSection';
import { ContactSection } from './components/ContactSection';
import { ArtworkModal } from './components/ArtworkModal';
import { InquiryDossierDrawer } from './components/InquiryDossierDrawer';
import { Footer } from './components/Footer';
import { Artwork } from './types';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [savedArtworkIds, setSavedArtworkIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('quincas_saved_artworks');
      return saved ? JSON.parse(saved) : ['o-cisne-imperatriz'];
    } catch {
      return ['o-cisne-imperatriz'];
    }
  });

  const [contactInitialConfig, setContactInitialConfig] = useState<{
    spaceType?: string;
    motif?: string;
    scale?: string;
    artworkTitle?: string;
  } | null>(null);

  // Sync saved artworks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('quincas_saved_artworks', JSON.stringify(savedArtworkIds));
    } catch {
      // ignore
    }
  }, [savedArtworkIds]);

  // Section observer to update active navigation item during scroll
  useEffect(() => {
    const sections = ['home', 'artist', 'story', 'monumental', 'works', 'techniques', 'garden', 'atelier', 'media', 'boutique', 'commissions', 'contact'];
    
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleToggleSave = (artworkId: string) => {
    setSavedArtworkIds((prev) =>
      prev.includes(artworkId)
        ? prev.filter((id) => id !== artworkId)
        : [...prev, artworkId]
    );
  };

  const handleInquireArtwork = (artwork: Artwork) => {
    setContactInitialConfig({
      artworkTitle: artwork.title,
    });
    handleNavigate('contact');
  };

  const handleInquireMonumentalProject = (projectTitle: string) => {
    setContactInitialConfig({
      artworkTitle: `Monumental Case Study: ${projectTitle}`,
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
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E1D1A] flex flex-col selection:bg-[#C8A86B]/25">
      {/* Floating Glassmorphism Header */}
      <Header
        activeSection={activeSection}
        savedCount={savedArtworkIds.length}
        onOpenDossier={() => setIsDossierOpen(true)}
        onNavigate={handleNavigate}
      />

      {/* Main Experience */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onExploreCollection={() => handleNavigate('works')}
          onEnterAtelier={() => handleNavigate('atelier')}
          onDiscoverGarden={() => handleNavigate('garden')}
        />

        {/* 01: Introduction & Philosophy */}
        <IntroPhilosophy
          onLearnTechniques={() => handleNavigate('techniques')}
          onExploreStory={() => handleNavigate('story')}
        />

        {/* 02: The Story / A Life in Sculpture Timeline */}
        <TheStoryTimeline />

        {/* 03: Monumental Works */}
        <MonumentalWorks
          onInquireProject={handleInquireMonumentalProject}
        />

        {/* 04: Works / The Collection */}
        <WorksGallery
          onSelectArtwork={(art) => setSelectedArtwork(art)}
          onToggleSave={handleToggleSave}
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
          onToggleSave={handleToggleSave}
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
      </main>

      {/* Art Book Closing Page Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Detailed Artwork Inspector Modal */}
      <ArtworkModal
        artwork={selectedArtwork}
        onClose={() => setSelectedArtwork(null)}
        onInquire={handleInquireArtwork}
        onToggleSave={handleToggleSave}
        isSaved={selectedArtwork ? savedArtworkIds.includes(selectedArtwork.id) : false}
      />

      {/* Private Curation Dossier Drawer */}
      <InquiryDossierDrawer
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        savedArtworkIds={savedArtworkIds}
        onRemoveArtwork={handleToggleSave}
        onSelectArtwork={(art) => setSelectedArtwork(art)}
        onProceedToInquiry={() => handleNavigate('contact')}
      />
    </div>
  );
}
