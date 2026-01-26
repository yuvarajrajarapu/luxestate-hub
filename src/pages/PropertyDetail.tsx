import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Square,
  Phone,
  MessageCircle,
  Share2,
  Heart,
  Check,
  ChevronLeft,
  ChevronRight,
  Building,
  Loader2,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProperty } from '@/hooks/useProperties';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { property, loading, error } = useProperty(id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-lg text-muted-foreground mb-4">
            {error || 'Property not found'}
          </p>
          <Button onClick={() => navigate('/properties')}>
            Browse Properties
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

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

  const handleWhatsApp = () => {
    const phone = '9059611547';
    const message = `Hello, I am interested in this property: ${property.title}. Please share more details.`;
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:${property.contactPhone}`, '_self');
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: property.title,
        text: property.description,
        url: window.location.href,
      });
    }
  };

  const nextImage = () => {
    if (property.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property.images.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  const getListingBadge = () => {
    if (property.isSoldOut) {
      return <Badge className="badge-sold">SOLD OUT</Badge>;
    }
    switch (property.listingType) {
      case 'sale':
        return <Badge className="badge-sale">For Sale</Badge>;
      case 'rent':
        return <Badge className="badge-rent">For Rent</Badge>;
      case 'lease':
        return <Badge className="badge-lease">For Lease</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to listings
          </motion.button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative aspect-video rounded-2xl overflow-hidden bg-muted"
              >
                <img
                  src={property.images[currentImageIndex]?.url || '/placeholder.svg'}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />

                {/* Navigation */}
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {getListingBadge()}
                  {property.isVerified && (
                    <Badge className="badge-verified">
                      <Check className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>

                {/* Actions */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <Heart
                      className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`}
                    />
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/50 text-white text-sm">
                  {currentImageIndex + 1} / {property.images.length}
                </div>
              </motion.div>

              {/* Thumbnails */}
              {property.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {property.images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden ${
                        index === currentImageIndex ? 'ring-2 ring-primary' : ''
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Property Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-6"
              >
                {/* Title & Price */}
                <div>
                  <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{property.location}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <p className="text-3xl font-bold text-foreground">
                      {formatPrice(property.price, property.priceUnit)}
                    </p>
                    {property.pricePerSqft && (
                      <p className="text-sm text-muted-foreground">
                        ₹{property.pricePerSqft.toLocaleString('en-IN')}/sq.ft
                      </p>
                    )}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {property.bedrooms && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-muted">
                      <Bed className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-semibold">{property.bedrooms}</p>
                        <p className="text-xs text-muted-foreground">Bedrooms</p>
                      </div>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-muted">
                      <Bath className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-semibold">{property.bathrooms}</p>
                        <p className="text-xs text-muted-foreground">Bathrooms</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-muted">
                    <Square className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">{property.area.toLocaleString('en-IN')}</p>
                      <p className="text-xs text-muted-foreground">{property.areaUnit}</p>
                    </div>
                  </div>
                  {property.floor && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-muted">
                      <Building className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-semibold">{property.floor}/{property.totalFloors}</p>
                        <p className="text-xs text-muted-foreground">Floor</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <h2 className="text-xl font-semibold mb-3">Description</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {property.description}
                  </p>
                </div>

                {/* Details */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Property Details</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">Property Type</span>
                      <span className="font-medium capitalize">
                        {property.category.replace(/-/g, ' ')}
                      </span>
                    </div>
                    {property.furnishingStatus && (
                      <div className="flex justify-between py-3 border-b border-border">
                        <span className="text-muted-foreground">Furnishing</span>
                        <span className="font-medium capitalize">
                          {property.furnishingStatus.replace(/-/g, ' ')}
                        </span>
                      </div>
                    )}
                    {property.possessionStatus && (
                      <div className="flex justify-between py-3 border-b border-border">
                        <span className="text-muted-foreground">Possession</span>
                        <span className="font-medium capitalize">
                          {property.possessionStatus.replace(/-/g, ' ')}
                        </span>
                      </div>
                    )}
                    {property.facing && (
                      <div className="flex justify-between py-3 border-b border-border">
                        <span className="text-muted-foreground">Facing</span>
                        <span className="font-medium">{property.facing}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">Posted By</span>
                      <span className="font-medium capitalize">{property.postedBy}</span>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                {property.amenities.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Amenities</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {property.amenities.map((amenity) => (
                        <div
                          key={amenity}
                          className="flex items-center gap-2 p-3 rounded-lg bg-muted"
                        >
                          <Check className="w-4 h-4 text-success" />
                          <span className="text-sm">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Sticky Sidebar - Contact */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="bg-card rounded-2xl border border-border p-6 sticky top-24 space-y-6">
                {!property.isSoldOut ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">Contact Agent</h3>
                        <p className="text-muted-foreground text-sm">{property.contactName}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleCall}
                          className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                        >
                          <Phone className="w-5 h-5 text-primary" />
                        </button>
                        <button
                          onClick={handleWhatsApp}
                          className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center hover:bg-green-500/20 transition-colors"
                        >
                          <MessageCircle className="w-5 h-5 text-green-500" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button
                        onClick={handleCall}
                        variant="outline"
                        className="w-full h-12 flex items-center justify-center gap-2"
                      >
                        <Phone className="w-5 h-5" />
                        {property.contactPhone}
                      </Button>
                      <Button
                        onClick={handleWhatsApp}
                        className="w-full h-12 bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="w-5 h-5" />
                        Chat on WhatsApp
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-4">
                      This property is no longer available
                    </p>
                    <Button variant="outline" className="w-full" onClick={() => navigate('/properties')}>
                      View Similar Listings
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PropertyDetail;
