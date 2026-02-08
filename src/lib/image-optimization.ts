/**
 * Image Optimization Utilities
 * - Converts JPGs to WebP for production
 * - Provides progressive image loading
 * - Handles fallbacks for older browsers
 */

export const getOptimizedImageUrl = (
  url: string, 
  format: 'webp' | 'jpg' = 'webp',
  quality: number = 80
): string => {
  if (!url) return url;

  // If it's a Cloudinary URL, apply transformations
  if (url.includes('res.cloudinary.com')) {
    // Apply quality optimization
    const [baseUrl, ...rest] = url.split('/upload/');
    if (baseUrl && rest.length > 0) {
      const transforms = `q_${quality},f_${format}`;
      return `${baseUrl}/upload/${transforms}/${rest.join('/upload/')}`;
    }
  }

  // For local assets, return as-is (Vite will optimize)
  return url;
};

export const getResponsiveImageSrcSet = (url: string): string => {
  if (!url.includes('res.cloudinary.com')) return '';
  
  const [baseUrl, ...rest] = url.split('/upload/');
  if (!baseUrl || !rest.length) return '';
  
  const basePath = `${baseUrl}/upload/`;
  const imagePath = rest.join('/upload/');
  
  return [
    `${basePath}w_320,q_75,f_webp/${imagePath} 320w`,
    `${basePath}w_640,q_75,f_webp/${imagePath} 640w`,
    `${basePath}w_1024,q_80,f_webp/${imagePath} 1024w`,
    `${basePath}w_1920,q_85,f_webp/${imagePath} 1920w`,
  ].join(', ');
};

export const getBlurredImageUrl = (url: string): string => {
  if (!url.includes('res.cloudinary.com')) return url;
  
  const [baseUrl, ...rest] = url.split('/upload/');
  if (!baseUrl || !rest.length) return url;
  
  return `${baseUrl}/upload/e_blur:300,q_20,f_auto/w_50/${rest.join('/upload/')}`;
};

export const prefetchImage = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });
};

export const supportsWebP = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  return canvas.toDataURL('image/webp').includes('image/webp');
};
