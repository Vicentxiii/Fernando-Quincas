/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Preloader } from './components/Preloader';
import { ShopPreloader } from './components/ShopPreloader';
import { InstrumentsPreloader } from './components/InstrumentsPreloader';
import { ArtworkModal } from './components/ArtworkModal';
import { InquiryDossierDrawer } from './components/InquiryDossierDrawer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { CartProvider } from './context/CartContext';
import { CartDrawer } from './components/shop/CartDrawer';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Artwork } from './types';
import { useDocumentMeta } from './hooks/useDocumentMeta';

// Code-split: Home já é eager para LCP, demais páginas lazy para reduzir bundle inicial
import { HomePage } from './pages/HomePage';
const BlogIndexPage = lazy(() => import('./pages/BlogIndexPage').then(m => ({ default: m.BlogIndexPage })));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage').then(m => ({ default: m.BlogPostPage })));
const ShopPage = lazy(() => import('./pages/ShopPage').then(m => ({ default: m.ShopPage })));
const ProductPage = lazy(() => import('./pages/ProductPage').then(m => ({ default: m.ProductPage })));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const OrderStatusPage = lazy(() => import('./pages/OrderStatusPage').then(m => ({ default: m.OrderStatusPage })));
const InstrumentsPage = lazy(() => import('./pages/InstrumentsPage').then(m => ({ default: m.InstrumentsPage })));
const InstrumentPhotoPage = lazy(() => import('./pages/InstrumentPhotoPage').then(m => ({ default: m.InstrumentPhotoPage })));

// Fallback leve para rotas lazy (não bloqueia LCP da Home)
const PageFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
    <div className="w-6 h-6 border-2 border-[#C8A86B]/30 border-t-[#C8A86B] rounded-full animate-spin" aria-label="Carregando" />
  </div>
);

const SECTION_IDS = ['home', 'artist', 'story', 'works', 'atelier', 'media', 'boutique', 'commissions', 'contact'];

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  useDocumentMeta({
    title: 'Página não encontrada',
    description: 'Página não encontrada no atelier de Fernando Quincas, mestre artesão em fibra de vidro.',
    canonical: 'https://fernandoquincas.com.br/404',
    noindex: true,
  });
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center space-y-6 bg-[#FAF8F5] text-[#1E1D1A]">
      <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#C8A86B]">Erro 404</span>
      <h1 className="font-display text-3xl sm:text-4xl font-semibold">Página não encontrada</h1>
      <p className="font-serif italic text-[#8A82A5] max-w-md">O endereço que você acessou não existe ou foi movido.</p>
      <button
        onClick={() => navigate('/')}
        className="px-6 py-3 rounded-full bg-[#1E1D1A] text-[#FAF8F5] text-xs font-mono tracking-widest uppercase hover:bg-[#C8A86B] hover:text-[#1E1D1A] transition-colors"
      >
        Voltar ao Início
      </button>
    </div>
  );
};

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
  const [isPreloading, setIsPreloading] = useState(true);
  const [isShopPreloading, setIsShopPreloading] = useState(false);
  const [isInstrumentsPreloading, setIsInstrumentsPreloading] = useState(false);
  const prevPathRef = useRef(location.pathname);

  // Elegant curtain preloader when entering the Shop / Instrumentos from another page
  useEffect(() => {
    if (location.pathname === '/loja' && prevPathRef.current !== '/loja') {
      setIsShopPreloading(true);
    }
    if ((location.pathname === '/instrumentos' || location.pathname.startsWith('/instrumentos/')) && !prevPathRef.current.startsWith('/instrumentos')) {
      setIsInstrumentsPreloading(true);
    }
    prevPathRef.current = location.pathname;
  }, [location.pathname]);

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
      {/* Elegant Entry Preloader */}
      {isPreloading && <Preloader onComplete={() => setIsPreloading(false)} />}

      {/* Shop Route Preloader */}
      {isShopPreloading && (
        <ShopPreloader onFinish={() => setIsShopPreloading(false)} />
      )}

      {/* Instrumentos Route Preloader — mesmo elegante da loja */}
      {isInstrumentsPreloading && (
        <InstrumentsPreloader onFinish={() => setIsInstrumentsPreloading(false)} />
      )}

      {/* Floating Glassmorphism Header */}
      <Header
        activeSection={activeSection}
        savedCount={savedArtworkIds.length}
        onOpenDossier={() => setIsDossierOpen(true)}
        onNavigate={handleNavigate}
      />

      <main className="flex-1">
        <Suspense fallback={<PageFallback />}>
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
            <Route path="/loja" element={<ShopPage />} />
            <Route path="/loja/checkout" element={<CheckoutPage />} />
            <Route path="/loja/pedido/:id" element={<OrderStatusPage />} />
            <Route path="/loja/:slug" element={<ProductPage />} />
            <Route path="/instrumentos" element={<InstrumentsPage />} />
            <Route path="/instrumentos/:photoSlug" element={<InstrumentPhotoPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
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

      {/* Shop Cart Drawer (global, accessible across the whole site) */}
      <CartDrawer />

      {/* WhatsApp floating button — canto inferior esquerdo fixo */}
      <WhatsAppButton />

      {/* Detailed Artwork Inspector Modal (from dossier drawer) */}
      <ArtworkModal
        artwork={selectedArtwork}
        onClose={() => setSelectedArtwork(null)}
        onInquire={() => handleNavigate('contact')}
        onToggleSave={handleToggleSave}
        isSaved={selectedArtwork ? savedArtworkIds.includes(selectedArtwork.id) : false}
      />

      <Analytics />
      <SpeedInsights />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </BrowserRouter>
  );
}