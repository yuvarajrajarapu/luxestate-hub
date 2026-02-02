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
 * - Handles image loading with fallbacks
 * - Optimizes images using Cloudinary transformations
 * - Shows loading state and error fallback
 * - Implements lazy loading
 */
const PropertyImage = ({ images, title, className = 'w-full h-full' }: PropertyImageProps) => {
  const [imageUrl, setImageUrl] = useState<string>('/placeholder.svg');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
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

    // Optimize Cloudinary images for better performance
    let optimizedUrl = url;
    if (typeof url === 'string' && url.includes('cloudinary.com')) {
      // Add optimization parameters to Cloudinary URL
      optimizedUrl = optimizeCloudinaryUrl(url);
    }

    setImageUrl(optimizedUrl);
    setIsLoading(false);
  }, [images]);

  const optimizeCloudinaryUrl = (url: string): string => {
    // If the URL already has transformations, don't modify it
    if (url.includes('/upload/')) {
      // Insert quality and width optimization before the filename
      return url.replace(
        '/upload/',
        '/upload/c_fill,w_800,q_auto:best,f_auto/'
      );
    }
    return url;
  };

  const handleImageError = () => {
    console.warn(`Failed to load image for property: ${title}`);
    setError(true);
    setImageUrl('/placeholder.svg');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <img
        src={imageUrl}
        alt={title}
        onError={handleImageError}
        loading="lazy"
        className="w-full h-full object-cover"
      />
      
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
      )}
      
      {/* Error Indicator */}
      {error && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Image unavailable</span>
        </div>
      )}
    </motion.div>
  );
};

export default PropertyImage;
