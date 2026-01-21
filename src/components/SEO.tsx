import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'profile';
}

export function SEO({ title, description, image, url, type = 'website' }: SEOProps) {
  useEffect(() => {
    document.title = title;

    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const attribute = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);

      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }

      element.setAttribute('content', content);
    };

    updateMetaTag('description', description);

    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:type', type, true);

    if (url) {
      updateMetaTag('og:url', url, true);
    }

    if (image) {
      updateMetaTag('og:image', image, true);
      updateMetaTag('twitter:image', image);
    }

    updateMetaTag('twitter:card', image ? 'summary_large_image' : 'summary');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);

    return () => {
      document.title = 'Obsi - Cartes de visite numériques premium';
    };
  }, [title, description, image, url, type]);

  return null;
}
