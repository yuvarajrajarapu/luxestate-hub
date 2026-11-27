import { useState, useEffect, useRef } from 'react';
import type { MediaItem } from '@/types/property';
import { getOptimizedImageUrl, getResponsiveImageSrcSet } from '@/lib/image-optimization';

interface PropertyImageProps {
  images: MediaItem[];
  title: string;
  className?: string;
  priority?: 'high' | 'low';
}

/**
 * PropertyImage Component
 * - Uses lazy loading for standard cards and eager loading for prioritized images
 * - Retries network failures before showing a placeholder
 * - Converts JPG to WebP for faster loading
 * - Responsive image sizing
 */
const PropertyImage = ({ images, title, className = 'w-full h-full', priority = 'low' }: PropertyImageProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [webpUrl, setWebpUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 2;

  useEffect(() => {
    // Reset state when images change
    setError(false);
    retryCountRef.current = 0;
    setImageUrl(null);
    setWebpUrl(null);
    
    // Handle empty images array
    if (!images || images.length === 0) {
      setImageUrl('/placeholder.svg');
      setIsLoading(false);
      return;
    }

    const primaryImage = images[0];
    
    if (!primaryImage) {
      setImageUrl('/placeholder.svg');
      setIsLoading(false);
      return;
    }

    // Use the URL from the image object
    const url = primaryImage.url || primaryImage.publicId;
    
    if (!url) {
      setImageUrl('/placeholder.svg');
      setIsLoading(false);
      return;
    }

    // Generate optimized WebP URL for Cloudinary images
    const optimizedWebpUrl = getOptimizedImageUrl(url, 'webp', 80);
    const optimizedJpgUrl = getOptimizedImageUrl(url, 'jpg', 85);

    if (priority === 'low') {
      setWebpUrl(optimizedWebpUrl);
      setImageUrl(optimizedJpgUrl);
      setIsLoading(true);
      return;
    }

    // Preload the WebP image first, fallback to JPG
    setIsLoading(true);
    const preloadImg = new Image();
    
    preloadImg.onload = () => {
      // Image loaded successfully - safe to display
      setWebpUrl(optimizedWebpUrl);
      setImageUrl(optimizedJpgUrl);
      setIsLoading(false);
      setError(false);
    };
    
    preloadImg.onerror = () => {
      // Image failed - retry if we haven't exceeded max retries
      if (retryCountRef.current < MAX_RETRIES) {
        const nextRetry = ++retryCountRef.current;
        // Wait a bit then retry with cache-busting parameter
        setTimeout(() => {
          preloadImg.src = `${optimizedWebpUrl}?retry=${nextRetry}`;
        }, 300);
      } else {
        // Max retries exceeded - show placeholder
        console.warn(`Failed to load image for property: ${title} after ${MAX_RETRIES} retries`);
        setError(true);
        setIsLoading(false);
        setImageUrl('/placeholder.svg');
      }
    };
    
    // Start the preload with WebP
    preloadImg.src = optimizedWebpUrl;
  }, [images, priority, title]);

  const handleImageError = () => {
    if (error) return;

    if (retryCountRef.current < MAX_RETRIES) {
      const nextRetry = ++retryCountRef.current;
      const addRetryParam = (url: string) =>
        `${url}${url.includes('?') ? '&' : '?'}retry=${nextRetry}`;

      setWebpUrl(current => current ? addRetryParam(current) : current);
      setImageUrl(current => current ? addRetryParam(current) : current);
      setIsLoading(true);
      return;
    }

    console.warn(`Image render failed for property: ${title}`);
    setError(true);
    setIsLoading(false);
    setImageUrl('/placeholder.svg');
  };

  const imagePriorityAttribute = { fetchpriority: priority };

  return (
    <div className={`${className} relative bg-gray-100`}>
      {imageUrl && !error && (
        <picture>
          {webpUrl && (
            <source
              srcSet={webpUrl}
              type="image/webp"
            />
          )}
          <img
            key={imageUrl}
            src={imageUrl}
            alt={title}
            onError={handleImageError}
            onLoad={() => setIsLoading(false)}
            loading={priority === 'high' ? 'eager' : 'lazy'}
            {...imagePriorityAttribute}
            className="w-full h-full object-cover"
            decoding="async"
            style={{ contentVisibility: 'auto' }}
            sizes="(max-width: 640px) 320px, (max-width: 1024px) 640px, (max-width: 1920px) 1024px, 1920px"
          />
        </picture>
      )}
      
      {error && (
        <img
          src="/placeholder.svg"
          alt={`${title} - unavailable`}
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover"
          style={{ contentVisibility: 'auto' }}
        />
      )}
      
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
      )}
    </div>
  );
};

export default PropertyImage;
