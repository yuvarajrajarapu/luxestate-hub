import { useEffect, useRef, useState } from 'react';
import { isIntersectionObserverSupported } from '@/lib/mobile-optimization';

/**
 * Hook for lazy loading images with IntersectionObserver
 * Improves mobile performance by deferring off-screen image loads
 */
export const useLazyImage = () => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!imageRef.current) return;

    // If IntersectionObserver not supported, load immediately
    if (!isIntersectionObserverSupported()) {
      imageRef.current.loading = 'lazy';
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && imageRef.current) {
          const img = imageRef.current;

          // Load the image
          img.src = img.dataset.src || img.src;
          img.srcset = img.dataset.srcset || img.srcset || '';

          // Handle successful load
          img.onload = () => {
            setIsLoaded(true);
            observer.unobserve(img);
          };

          // Handle error
          img.onerror = () => {
            setHasError(true);
            observer.unobserve(img);
          };
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
      }
    );

    observer.observe(imageRef.current);

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, []);

  return { imageRef, isLoaded, hasError };
};

/**
 * Hook for tracking Core Web Vitals (LCP, FID, CLS)
 * Helps monitor mobile performance
 */
export const useCoreWebVitals = (onReport?: (metric: any) => void) => {
  useEffect(() => {
    // Check if Web Vitals API is available
    if (typeof window === 'undefined') return;

    try {
      // Largest Contentful Paint (LCP)
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (onReport) {
          onReport({
            name: 'LCP',
            value: lastEntry.renderTime || lastEntry.loadTime,
          });
        }
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            if (onReport) {
              onReport({ name: 'CLS', value: clsValue });
            }
          }
        }
      });

      clsObserver.observe({ entryTypes: ['layout-shift'] });

      return () => {
        observer.disconnect();
        clsObserver.disconnect();
      };
    } catch (e) {
      // Silently fail if API not available
      console.warn('Core Web Vitals monitoring not available');
    }
  }, [onReport]);
};

/**
 * Hook for detecting slow network conditions
 * Useful for showing loading states on 3G/4G
 */
export const useNetworkStatus = () => {
  const [isSlowNetwork, setIsSlowNetwork] = useState(false);
  const [effectiveType, setEffectiveType] = useState<
    '4g' | '3g' | '2g' | 'slow-2g' | undefined
  >(undefined);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if navigator.connection exists
    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection;

    if (!connection) return;

    const updateNetworkStatus = () => {
      const type = connection.effectiveType;
      setEffectiveType(type);
      setIsSlowNetwork(type === '3g' || type === '2g' || type === 'slow-2g');
    };

    updateNetworkStatus();
    connection.addEventListener('change', updateNetworkStatus);

    return () => {
      connection.removeEventListener('change', updateNetworkStatus);
    };
  }, []);

  return { isSlowNetwork, effectiveType };
};

/**
 * Hook for tracking page visibility (user on tab/device)
 * Useful for pausing animations/videos when tab is not visible
 */
export const usePageVisibility = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return { isVisible };
};
