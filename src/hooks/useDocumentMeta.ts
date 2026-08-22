import { useEffect } from 'react';

interface DocumentMeta {
  title: string;
  description?: string;
  image?: string;
}

const SITE_NAME = 'Fernando Quincas';

const setMetaTag = (attr: 'name' | 'property', key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

export const useDocumentMeta = ({ title, description, image }: DocumentMeta) => {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    document.title = fullTitle;
    if (description) setMetaTag('name', 'description', description);
    setMetaTag('property', 'og:title', fullTitle);
    if (description) setMetaTag('property', 'og:description', description);
    if (image) setMetaTag('property', 'og:image', image);
    setMetaTag('property', 'og:url', window.location.href);
  }, [title, description, image]);
};
