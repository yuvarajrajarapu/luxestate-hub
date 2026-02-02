import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Square, Heart, Share2 } from 'lucide-react';
import type { Property } from '@/types/property';
import { useShortlist } from '@/hooks/useShortlist';
import { useToast } from '@/hooks/use-toast';
import PropertyImage from './PropertyImage';

interface PropertyCardProps {
  property: Property;
  index?: number;
}

const PropertyCard = ({ property, index = 0 }: PropertyCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isShortlisted, toggleShortlist, isAuthenticated } = useShortlist();
  const [isAnimating, setIsAnimating] = useState(false);

  const shortlisted = isShortlisted(property.id);

  const formatPrice = (price: number, priceUnit: string) => {
    if (price >= 10000000) {
      return `${(price / 10000000).toFixed(2).replace(/\.00$/, '')},00,000/-`;
    } else if (price >= 100000) {
      return `${(price / 100000).toFixed(2).replace(/\.00$/, '')},00,000/-`;
    }
    return `${price.toLocaleString('en-IN')}/-`;
  };

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

    const shareUrl = `${window.location.origin}/property/${property.id}`;
    
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
    >
      <Link to={`/property/${property.id}`}>
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
            <motion.button
              onClick={handleShortlistToggle}
              className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all shadow-md"
              whileTap={{ scale: 0.85 }}
              disabled={isAnimating}
            >
              <AnimatePresence mode="wait">
                {shortlisted ? (
                  <motion.div
                    key="filled"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 500, 
                      damping: 15 
                    }}
                  >
                    <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 500, 
                      damping: 15 
                    }}
                  >
                    <Heart className="w-4 h-4 text-gray-700" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Share Icon */}
            <motion.button
              onClick={handleShare}
              className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all shadow-md"
              whileTap={{ scale: 0.9 }}
            >
              <Share2 className="w-4 h-4 text-gray-700" />
            </motion.button>
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
            {formatPrice(property.price, property.priceUnit)}
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
    </motion.div>
  );
};

export default PropertyCard;
