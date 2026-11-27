import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Square, Heart, Share2 } from 'lucide-react';
import type { Property } from '@/types/property';
import { useShortlist } from '@/hooks/useShortlist';
import { useToast } from '@/hooks/use-toast';
import { formatPropertyPrice } from '@/lib/formatPrice';
import PropertyImage from './PropertyImage';

interface PropertyCardProps {
  property: Property;
  index?: number;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isShortlisted, toggleShortlist, isAuthenticated } = useShortlist();
  const [isAnimating, setIsAnimating] = useState(false);

  const shareCode = property.propertyCode || property.id;
  const shortlisted = isShortlisted(property.id);

  const handleShortlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Check authentication
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please log in to save properties to your shortlist',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    // Prevent rapid clicks
    if (isAnimating) return;

    setIsAnimating(true);

    try {
      const isAdded = await toggleShortlist(property.id);
      
      toast({
        title: isAdded ? 'Added to Shortlist' : 'Removed from Shortlist',
        description: isAdded 
          ? 'Property saved to your favorites' 
          : 'Property removed from your favorites',
      });
    } catch (error) {
      console.error('Error toggling shortlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to update shortlist. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareUrl = `${window.location.origin}/api/og?code=${shareCode}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Check out this property: ${property.title}`,
          url: shareUrl,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: 'Link Copied',
        description: 'Property link copied to clipboard',
      });
    }
  };

  return (
    <div
      className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
    >
      <Link to={`/property/${shareCode}`}>
        {/* Image Section */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <PropertyImage 
            images={property.images} 
            title={property.title}
            className="w-full h-full"
          />
          
          {/* Top Right Icons */}
          <div className="absolute top-2 right-2 flex gap-2">
            {/* Heart Icon with Premium Animation */}
            <button
              type="button"
              onClick={handleShortlistToggle}
              className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white active:scale-90 transition-all shadow-md"
              disabled={isAnimating}
            >
              <Heart className={`w-4 h-4 transition-colors ${shortlisted ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
            </button>

            {/* Share Icon */}
            <button
              type="button"
              onClick={handleShare}
              className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white active:scale-90 transition-all shadow-md"
            >
              <Share2 className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-3 space-y-2">
          {/* Title */}
          <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
            {property.title}
          </h4>

          {/* Price */}
          <p className="text-lg font-bold text-gray-900">
            {formatPropertyPrice(property.price)}
          </p>

          {/* Area */}
          <div className="flex items-center gap-1 text-gray-600 text-xs">
            <Square className="w-3 h-3" />
            <span>
              {property.area.toLocaleString('en-IN')} {property.areaUnit}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-gray-500 text-xs">
            <MapPin className="w-3 h-3" />
            <span className="line-clamp-1">{property.location}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;
