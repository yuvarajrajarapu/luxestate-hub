import { useEffect } from 'react';
import { setPropertyMetadata } from '@/lib/og-metadata';

interface UsePropertyMetadataProps {
  propertyId: string;
  title: string;
  address: string;
  description: string;
  imageUrl: string;
}

export const usePropertyMetadata = ({
  propertyId,
  title,
  address,
  description,
  imageUrl,
}: UsePropertyMetadataProps) => {
  useEffect(() => {
    setPropertyMetadata(propertyId, title, address, description, imageUrl);
  }, [propertyId, title, address, description, imageUrl]);
};
