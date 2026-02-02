import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { MediaItem } from '@/types/property';
import { getCloudinaryUrl } from '@/lib/image-repair';

interface PropertyImageProps {
  images: MediaItem[];
  title: string;
  className?: string;
}

/**
 * PropertyImage Component
 * - Handles image loading with fallbacks
 * - Converts public IDs to full Cloudinary URLs
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

    // Get the URL or public ID
    let url = primaryImage.url || primaryImage.publicId;
    
    if (!url || url.trim() === '') {
      setImageUrl('/placeholder.svg');
      setIsLoading(false);
      return;
    }

    // Convert public ID to full Cloudinary URL if needed
    if (!url.startsWith('https://')) {
      url = getCloudinaryUrl(url);
    }

    setImageUrl(url);
    setIsLoading(false);
  }, [images, title]);

  const handleImageError = () => {
    console.error(`Image failed to load for property: ${title}`, {
      attemptedUrl: imageUrl,
      images: images,
      error: 'CORS or fetch error'
    });
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
