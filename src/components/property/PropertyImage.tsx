import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { MediaItem } from '@/types/property';

interface PropertyImageProps {
  images: MediaItem[];
  title: string;
  className?: string;
}

/**
 * PropertyImage Component
 * - Preloads images to detect failures before rendering
 * - Implements automatic retry on network failures  
 * - Prevents "Image Unavailable" on first load
 * - Uses eager loading for immediate display
 */
const PropertyImage = ({ images, title, className = 'w-full h-full' }: PropertyImageProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 2;

  useEffect(() => {
    // Reset state when images change
    setError(false);
    setRetryCount(0);
    setImageUrl(null);
    
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

    // Preload the image before setting it as the active URL
    setIsLoading(true);
    const preloadImg = new Image();
    
    preloadImg.onload = () => {
      // Image loaded successfully - safe to display
      setImageUrl(url);
      setIsLoading(false);
      setError(false);
    };
    
    preloadImg.onerror = () => {
      // Image failed - retry if we haven't exceeded max retries
      if (retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1);
        // Wait a bit then retry with cache-busting parameter
        setTimeout(() => {
          preloadImg.src = url + '?retry=' + (retryCount + 1);
        }, 300);
      } else {
        // Max retries exceeded - show placeholder
        console.warn(`Failed to load image for property: ${title} after ${MAX_RETRIES} retries`);
        setError(true);
        setIsLoading(false);
        setImageUrl('/placeholder.svg');
      }
    };
    
    // Start the preload
    preloadImg.src = url;
  }, [images, retryCount, title]);

  const handleImageError = () => {
    // Fallback error handler
    if (!error) {
      console.warn(`Image render failed for property: ${title}`);
      setError(true);
      setImageUrl('/placeholder.svg');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`${className} relative bg-gray-100`}
    >
      {imageUrl && !error && (
        <img
          key={imageUrl}
          src={imageUrl}
          alt={title}
          onError={handleImageError}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          crossOrigin="anonymous"
          className="w-full h-full object-cover"
          style={{ contentVisibility: 'auto', willChange: 'auto' }}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      )}
      
      {error && (
        <img
          src="/placeholder.svg"
          alt={`${title} - unavailable`}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover"
          style={{ contentVisibility: 'auto' }}
        />
      )}
      
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
      )}
    </motion.div>
  );
};

export default PropertyImage;
