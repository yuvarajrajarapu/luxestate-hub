import { useEffect, useRef, useState } from 'react';

interface UseImageLazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
}

/**
 * Hook for lazy loading images with Intersection Observer API
 * Improves performance by deferring image loads until they're near the viewport
 */
export const useImageLazyLoad = (options: UseImageLazyLoadOptions = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '50px'
  } = options;

  const ref = useRef<HTMLImageElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Unobserve once image is loaded to free up resources
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, rootMargin]);

  return { ref, isVisible };
};

/**
 * Hook for preloading critical images before they become visible
 */
export const useImagePreload = (urls: string[]) => {
  useEffect(() => {
    // Preload images using link prefetch
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.as = 'image';
      link.href = url;
      document.head.appendChild(link);
    });
  }, [urls]);
};
