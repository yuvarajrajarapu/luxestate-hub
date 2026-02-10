import { useEffect } from 'react';
import { fetchAndApplyPropertyMetadata, setPropertyMetadata } from '@/lib/og-metadata';

interface PropertyMetadataOptions {
  propertyId: string;
  title?: string;
  address?: string;
  description?: string;
  imageUrl?: string;
  price?: string;
  propertyType?: string;
}

/**
 * Hook to dynamically update OG metadata for property pages
 * This ensures proper SEO and social sharing previews
 */
export function usePropertyMetadata(options: PropertyMetadataOptions) {
  const { propertyId, title, address, description, imageUrl, price, propertyType } = options;

  useEffect(() => {
    const baseUrl = window.location.origin;

    // If we have all the data, set it immediately
    if (title && address && description) {
      setPropertyMetadata(
        propertyId,
        title,
        address,
        description,
        imageUrl || '',
        price,
        propertyType,
        baseUrl
      );
    } else {
      // Otherwise, fetch from the API
      fetchAndApplyPropertyMetadata(propertyId, baseUrl).catch(error => {
        console.error('Failed to apply property metadata:', error);
      });
    }
  }, [propertyId, title, address, description, imageUrl, price, propertyType]);
}

/**
 * Hook to preload OG image for faster rendering
 */
export function usePreloadOGImage(imageUrl: string) {
  useEffect(() => {
    if (!imageUrl) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = imageUrl;
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, [imageUrl]);
}
