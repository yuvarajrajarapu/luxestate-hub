import { useState } from "react";
import type { MediaItem } from "@/types/property";

interface PropertyImageProps {
  images: MediaItem[];
  title: string;
  className?: string;
}

/**
 * Fast, lightweight PropertyImage Component
 * - Direct image loading without complex transformations
 * - Minimal re-renders
 * - Instant rendering with lazy loading
 */
const PropertyImage = ({ images, title, className = "w-full h-full" }: PropertyImageProps) => {
  const [error, setError] = useState(false);

  // Get image URL directly - no processing
  const imageUrl = images?.[0]?.url || "/placeholder.svg";

  return (
    <div className={className}>
      {error || !imageUrl || imageUrl === "/placeholder.svg" ? (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      ) : (
        <img
          src={imageUrl}
          alt={title}
          onError={() => setError(true)}
          loading="lazy"
          className="w-full h-full object-cover"
          decoding="async"
        />
      )}
    </div>
  );
};

export default PropertyImage;
