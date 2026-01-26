import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Square, Heart, Share2 } from 'lucide-react';
import type { Property } from '@/types/property';

interface PropertyCardProps {
  property: Property;
  index?: number;
}

const PropertyCard = ({ property, index = 0 }: PropertyCardProps) => {

  const formatPrice = (price: number, priceUnit: string) => {
    if (price >= 10000000) {
      return `${(price / 10000000).toFixed(2).replace(/\.00$/, '')},00,000/-`;
    } else if (price >= 100000) {
      return `${(price / 100000).toFixed(2).replace(/\.00$/, '')},00,000/-`;
    }
    return `${price.toLocaleString('en-IN')}/-`;
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
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={property.images[0]?.url || '/placeholder.svg'}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          
          {/* Top Right Icons */}
          <div className="absolute top-2 right-2 flex gap-2">
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition"
            >
              <Heart className="w-4 h-4 text-gray-700" />
            </button>
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition"
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
