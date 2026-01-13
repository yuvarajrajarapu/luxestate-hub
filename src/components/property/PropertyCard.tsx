import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Square, Phone, MessageCircle, ChevronLeft, ChevronRight, Check, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Property } from '@/types/property';
import { getOptimizedUrl } from '@/lib/cloudinary';

interface PropertyCardProps {
  property: Property;
  index?: number;
}

const PropertyCard = ({ property, index = 0 }: PropertyCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formatPrice = (price: number, priceUnit: string) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    }
    
    if (priceUnit === 'per-month') {
      return `₹${price.toLocaleString('en-IN')}/mo`;
    } else if (priceUnit === 'per-year') {
      return `₹${price.toLocaleString('en-IN')}/yr`;
    }
    
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const getListingBadge = () => {
    if (property.isSoldOut) {
      return <span className="badge-sold">SOLD OUT</span>;
    }
    switch (property.listingType) {
      case 'sale':
        return <span className="badge-sale">For Sale</span>;
      case 'rent':
        return <span className="badge-rent">For Rent</span>;
      case 'lease':
        return <span className="badge-lease">For Lease</span>;
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (property.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (property.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const phone = property.contactWhatsapp || property.contactPhone;
    const message = `Hi, I'm interested in the property: ${property.title}`;
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleCall = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(`tel:${property.contactPhone}`, '_self');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="property-card group"
    >
      <Link to={`/property/${property.id}`}>
        {/* Image Section */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={property.images[currentImageIndex]?.url || '/placeholder.svg'}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {getListingBadge()}
            {property.isFeatured && (
              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                Featured
              </Badge>
            )}
          </div>

          {/* Image Navigation */}
          {property.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              
              {/* Image Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {property.images.slice(0, 5).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      i === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content Section */}
        <div className="p-5 space-y-4">
          {/* Price Row */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-display font-bold text-foreground">
                {formatPrice(property.price, property.priceUnit)}
              </h3>
              {property.pricePerSqft && (
                <p className="text-sm text-muted-foreground">
                  ₹{property.pricePerSqft.toLocaleString('en-IN')}/sq.ft
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{property.location}</span>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {property.bedrooms && (
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                <span>{property.bedrooms} Bedrooms</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                <span>{property.bathrooms} Bathrooms</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Square className="w-4 h-4" />
              <span>
                {property.area.toLocaleString('en-IN')} {property.areaUnit}
              </span>
            </div>
          </div>

          {/* Title */}
          <h4 className="font-semibold text-foreground line-clamp-1">
            {property.title}
          </h4>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {property.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              {property.isVerified && (
                <div className="badge-verified">
                  <Check className="w-3 h-3" />
                  Verified
                </div>
              )}
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                2 days ago
              </div>
            </div>

            {!property.isSoldOut && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCall}
                  className="h-8 px-3"
                >
                  <Phone className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={handleWhatsApp}
                  className="h-8 px-3 bg-green-500 hover:bg-green-600 text-white"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </Button>
              </div>
            )}

            {property.isSoldOut && (
              <Button size="sm" variant="outline" className="h-8">
                View Similar Listings
              </Button>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PropertyCard;
