import { useEffect } from 'react';

interface DocumentMeta {
  title: string;
  description?: string;
  image?: string;
  canonical?: string;
  noindex?: boolean;
  type?: 'website' | 'article' | 'product';
  keywords?: string;
}

const SITE_NAME = 'Fernando Quincas';
const SITE_URL = 'https://fernandoquincas.com.br';

const setMetaTag = (attr: 'name' | 'property', key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const setCanonical = (href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
};

export const useDocumentMeta = ({ title, description, image, canonical, noindex, type = 'website', keywords }: DocumentMeta) => {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    if (description) setMetaTag('name', 'description', description);
    if (keywords) setMetaTag('name', 'keywords', keywords);

    setMetaTag('property', 'og:title', fullTitle);
    if (description) setMetaTag('property', 'og:description', description);
    if (image) {
      const absImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;
      setMetaTag('property', 'og:image', absImage);
      setMetaTag('name', 'twitter:image', absImage);
      setMetaTag('property', 'og:image:alt', fullTitle);
    }
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:site_name', 'Ateliê Fernando Quincas');
    setMetaTag('property', 'og:locale', 'pt_BR');

    // Canonical absoluto sem query/hash, normalizado sem trailing slash inconsistente
    const rawCanonical = canonical || window.location.href.split('?')[0].split('#')[0];
    const absoluteCanonical = rawCanonical.startsWith('http') ? rawCanonical : `${SITE_URL}${rawCanonical.startsWith('/') ? rawCanonical : `/${rawCanonical}`}`;
    // Normaliza: remove trailing slash exceto para raiz
    const normalizedCanonical = absoluteCanonical !== `${SITE_URL}/` && absoluteCanonical.endsWith('/') ? absoluteCanonical.slice(0, -1) : absoluteCanonical;
    setCanonical(normalizedCanonical);
    setMetaTag('property', 'og:url', normalizedCanonical);

    setMetaTag('name', 'twitter:card', image ? 'summary_large_image' : 'summary');
    setMetaTag('name', 'twitter:title', fullTitle);
    if (description) setMetaTag('name', 'twitter:description', description);

    // Robots: noindex para checkout/pedido, index para demais
    if (noindex) {
      setMetaTag('name', 'robots', 'noindex, nofollow, noarchive');
      setMetaTag('name', 'googlebot', 'noindex, nofollow');
      setMetaTag('name', 'bingbot', 'noindex, nofollow');
    } else {
      setMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
      setMetaTag('name', 'googlebot', 'index, follow, max-image-preview:large');
      setMetaTag('name', 'bingbot', 'index, follow');
    }
  }, [title, description, image, canonical, noindex, type, keywords]);
};
