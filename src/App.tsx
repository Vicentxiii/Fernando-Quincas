/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ArtworkModal } from './components/ArtworkModal';
import { InquiryDossierDrawer } from './components/InquiryDossierDrawer';
import { HomePage } from './pages/HomePage';
import { BlogIndexPage } from './pages/BlogIndexPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { Artwork } from './types';

const SECTION_IDS = ['home', 'artist', 'story', 'monumental', 'works', 'techniques', 'garden', 'atelier', 'media', 'boutique', 'commissions', 'contact'];

const AppContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  const [activeSection, setActiveSection] = useState('home');
  const [savedArtworkIds, setSavedArtworkIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('quincas_saved_artworks');
      return saved ? JSON.parse(saved) : ['o-cisne-imperatriz'];
    } catch {
      return ['o-cisne-imperatriz'];
    }
  });
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  // Sync saved artworks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('quincas_saved_artworks', JSON.stringify(savedArtworkIds));
    } catch {
      // ignore
    }
  }, [savedArtworkIds]);

  // Scroll to top on every route change unless a section target was requested
  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (!state?.scrollTo) {
      window.scrollTo({ top: 0 });
    }
  }, [location.pathname]);

  // Section observer to update active navigation item during scroll (home only)
  useEffect(() => {
    if (!isHome) {
      setActiveSection('home');
      return;
    }

    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (let i = SECTION_IDS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTION_IDS[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(SECTION_IDS[i]);
          break;
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  const handleNavigate = (sectionId: string) => {
    if (isHome) {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/', { state: { scrollTo: sectionId } });
    }
  };

  const handleToggleSave = (artworkId: string) => {
    setSavedArtworkIds((prev) =>
      prev.includes(artworkId)
        ? prev.filter((id) => id !== artworkId)
        : [...prev, artworkId]
    );
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

      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                savedArtworkIds={savedArtworkIds}
                onToggleSave={handleToggleSave}
              />
            }
          />
          <Route path="/blog" element={<BlogIndexPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route
            path="*"
            element={
              <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center space-y-6 bg-[#FAF8F5] text-[#1E1D1A]">
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#C8A86B]">
                  Erro 404
                </span>
                <h1 className="font-display text-3xl sm:text-4xl font-semibold">
                  Página não encontrada
                </h1>
                <p className="font-serif italic text-[#8A82A5] max-w-md">
                  O endereço que você acessou não existe ou foi movido.
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-3 rounded-full bg-[#1E1D1A] text-[#FAF8F5] text-xs font-mono tracking-widest uppercase hover:bg-[#C8A86B] hover:text-[#1E1D1A] transition-colors"
                >
                  Voltar ao Início
                </button>
              </div>
            }
          />
        </Routes>
      </main>

      {/* Art Book Closing Page Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Private Curation Dossier Drawer */}
      <InquiryDossierDrawer
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        savedArtworkIds={savedArtworkIds}
        onRemoveArtwork={handleToggleSave}
        onSelectArtwork={setSelectedArtwork}
        onProceedToInquiry={() => handleNavigate('contact')}
      />

      {/* Detailed Artwork Inspector Modal (from dossier drawer) */}
      <ArtworkModal
        artwork={selectedArtwork}
        onClose={() => setSelectedArtwork(null)}
        onInquire={() => handleNavigate('contact')}
        onToggleSave={handleToggleSave}
        isSaved={selectedArtwork ? savedArtworkIds.includes(selectedArtwork.id) : false}
      />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}