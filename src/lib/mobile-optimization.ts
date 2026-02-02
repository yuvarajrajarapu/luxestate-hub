/**
 * Mobile Optimization Utilities
 * Provides functions and hooks for optimal mobile performance
 */

/**
 * Optimize image URL for different screen sizes
 * Implements responsive images for better mobile performance
 */
export const getOptimizedImageUrl = (
  imageUrl: string | undefined,
  width: 'mobile' | 'tablet' | 'desktop' = 'mobile'
): string => {
  if (!imageUrl) return '/placeholder.svg';

  // If using Cloudinary, add responsive parameters
  if (imageUrl.includes('cloudinary')) {
    const params = {
      mobile: 'w_500,h_400,c_fill,q_auto,f_auto',
      tablet: 'w_800,h_600,c_fill,q_auto,f_auto',
      desktop: 'w_1200,h_900,c_fill,q_auto,f_auto',
    };
    return imageUrl.includes('upload')
      ? imageUrl.replace('/upload/', `/upload/${params[width]}/`)
      : imageUrl;
  }

  return imageUrl;
};

/**
 * Generate srcset for responsive images
 */
export const getImageSrcSet = (imageUrl: string | undefined): string => {
  if (!imageUrl) return '';

  if (imageUrl.includes('cloudinary')) {
    const baseUrl = imageUrl.includes('upload')
      ? imageUrl.replace('/upload/', '/upload/w_500,h_400,c_fill,q_auto,f_auto/')
      : imageUrl;

    return `${baseUrl} 1x, ${baseUrl.replace('w_500', 'w_1000')} 2x`;
  }

  return imageUrl;
};

/**
 * Detect if device is mobile
 */
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
};

/**
 * Get mobile-optimized dimensions
 */
export const getMobileOptimizedDimensions = () => {
  if (typeof window === 'undefined') return { width: 500, height: 400 };

  const width = window.innerWidth;
  if (width < 640) {
    return { width: 300, height: 240 };
  } else if (width < 768) {
    return { width: 500, height: 400 };
  }
  return { width: 800, height: 600 };
};

/**
 * Format price for better mobile display
 */
export const formatPriceForMobile = (price: number): string => {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(1)}Cr`;
  } else if (price >= 100000) {
    return `₹${(price / 100000).toFixed(1)}L`;
  } else if (price >= 1000) {
    return `₹${(price / 1000).toFixed(1)}K`;
  }
  return `₹${price}`;
};

/**
 * Debounce function for mobile scroll/resize events
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Throttle function for performance-sensitive events
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Check if intersection observer is supported
 */
export const isIntersectionObserverSupported = (): boolean => {
  return typeof window !== 'undefined' && 'IntersectionObserver' in window;
};
