import { useMemo, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
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
  Play,
  AlertCircle,
  ZoomIn,
  ZoomOut,
  X,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProperty } from '@/hooks/useProperties';
import { formatPropertyPrice } from '@/lib/formatPrice';
import { buildPropertyUrl } from '@/lib/propertyCode';
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/components/ui/dialog';

const PropertyDetail = () => {
  const { propertyCode } = useParams();
  const navigate = useNavigate();
  const { property, loading, error } = useProperty(propertyCode);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);
  const activePointersRef = useRef(new Map<number, { x: number; y: number }>());
  const pinchStartRef = useRef<{ distance: number; scale: number } | null>(null);
  const pinchGestureRef = useRef(false);
  const draggedRef = useRef(false);
  const handledImageTapRef = useRef(false);
  const zoomImageRef = useRef<HTMLImageElement>(null);

  const shareCode = useMemo(() => property?.propertyCode || property?.id || propertyCode || '', [property?.propertyCode, property?.id, propertyCode]);
  const propertyUrl = useMemo(() => (shareCode ? buildPropertyUrl(shareCode) : ''), [shareCode]);

  // Combine images and videos into a single media array
  const allMedia = property ? [...(property.images || []), ...(property.videos || [])] : [];
  const imageIndices = allMedia.flatMap((media, index) => media.type === 'image' ? [index] : []);

  const resetZoom = () => {
    setZoomScale(1);
    setZoomPosition({ x: 0, y: 0 });
    dragRef.current = null;
    activePointersRef.current.clear();
    pinchStartRef.current = null;
    pinchGestureRef.current = false;
    draggedRef.current = false;
    handledImageTapRef.current = false;
  };

  const getZoomAnchor = (clientX: number, clientY: number, bounds: DOMRect) => ({
    x: clientX - bounds.left - bounds.width / 2,
    y: clientY - bounds.top - bounds.height / 2,
  });

  const updateZoom = (scale: number, anchor = { x: 0, y: 0 }) => {
    const nextScale = Math.min(4, Math.max(1, scale));
    setZoomScale(nextScale);
    if (nextScale === 1) {
      setZoomPosition({ x: 0, y: 0 });
    } else if (nextScale !== zoomScale) {
      const zoomRatio = nextScale / zoomScale;
      setZoomPosition((position) => ({
        x: anchor.x + (position.x - anchor.x) * zoomRatio,
        y: anchor.y + (position.y - anchor.y) * zoomRatio,
      }));
    }
  };

  const changeZoomImage = (direction: -1 | 1) => {
    const currentImagePosition = imageIndices.indexOf(currentMediaIndex);
    const nextImagePosition =
      (currentImagePosition + direction + imageIndices.length) % imageIndices.length;
    setCurrentMediaIndex(imageIndices[nextImagePosition]);
    resetZoom();
  };

  const handleZoomPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    activePointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    const pointers = Array.from(activePointersRef.current.values());
    if (pointers.length >= 2) {
      pinchGestureRef.current = true;
      const [first, second] = pointers;
      pinchStartRef.current = {
        distance: Math.hypot(second.x - first.x, second.y - first.y),
        scale: zoomScale,
      };
      dragRef.current = null;
    } else if (zoomScale > 1) {
      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        originX: zoomPosition.x,
        originY: zoomPosition.y,
      };
    }
  };

  const handleZoomPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!activePointersRef.current.has(event.pointerId)) return;
    activePointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    const pointers = Array.from(activePointersRef.current.values());
    if (pointers.length >= 2 && pinchStartRef.current) {
      const [first, second] = pointers;
      const distance = Math.hypot(second.x - first.x, second.y - first.y);
      const midpointX = (first.x + second.x) / 2;
      const midpointY = (first.y + second.y) / 2;
      updateZoom(
        pinchStartRef.current.scale * (distance / pinchStartRef.current.distance),
        getZoomAnchor(midpointX, midpointY, event.currentTarget.getBoundingClientRect()),
      );
      return;
    }

    if (dragRef.current?.pointerId === event.pointerId) {
      if (
        Math.hypot(
          event.clientX - dragRef.current.startX,
          event.clientY - dragRef.current.startY,
        ) > 4
      ) {
        draggedRef.current = true;
      }
      setZoomPosition({
        x: dragRef.current.originX + event.clientX - dragRef.current.startX,
        y: dragRef.current.originY + event.clientY - dragRef.current.startY,
      });
    }
  };

  const handleZoomPointerUp = (
    event: ReactPointerEvent<HTMLDivElement>,
    cancelled = false,
  ) => {
    const pointerWasTracked = activePointersRef.current.has(event.pointerId);
    const wasPinchGesture = pinchGestureRef.current;
    activePointersRef.current.delete(event.pointerId);
    if (activePointersRef.current.size < 2) pinchStartRef.current = null;
    if (dragRef.current?.pointerId === event.pointerId) dragRef.current = null;

    if (activePointersRef.current.size === 1 && zoomScale > 1) {
      const [pointerId, point] = Array.from(activePointersRef.current.entries())[0];
      dragRef.current = {
        pointerId,
        startX: point.x,
        startY: point.y,
        originX: zoomPosition.x,
        originY: zoomPosition.y,
      };
    }

    const imageBounds = zoomImageRef.current?.getBoundingClientRect();
    const pointerIsOverImage =
      imageBounds &&
      event.clientX >= imageBounds.left &&
      event.clientX <= imageBounds.right &&
      event.clientY >= imageBounds.top &&
      event.clientY <= imageBounds.bottom;

    if (
      pointerWasTracked &&
      activePointersRef.current.size === 0 &&
      !cancelled &&
      !wasPinchGesture &&
      !draggedRef.current &&
      pointerIsOverImage
    ) {
      updateZoom(
        zoomScale >= 4 ? 1 : Math.min(zoomScale * 2, 4),
        getZoomAnchor(
          event.clientX,
          event.clientY,
          event.currentTarget.getBoundingClientRect(),
        ),
      );
      handledImageTapRef.current = true;
    }

    if (activePointersRef.current.size === 0) pinchGestureRef.current = false;
  };

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

  const handleWhatsApp = () => {
    const phone = '9059611547';
    const message = `Hello, I am interested in this property: ${property.title}. Please share more details.`;
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:${property.contactPhone}`, '_self');
  };

  const handleShare = async () => {
    if (!shareCode) return;

    const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
      `${property.title} - ${formatPropertyPrice(property.price)}\n📍 ${property.location}\n\n${propertyUrl}`
    )}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `${property.title} - ${formatPropertyPrice(property.price)} | ${property.location}`,
          url: propertyUrl,
        });
        return;
      } catch {
        // Fall back to WhatsApp share URL when native share is dismissed/unavailable
      }
    }

    window.open(whatsappShareUrl || ogShareUrl, '_blank');
  };

  const formatDisplayPrice = (price: number, priceUnit: string) => {
    const basePrice = formatPropertyPrice(price);
    if (priceUnit === 'per-month') return `${basePrice}/mo`;
    if (priceUnit === 'per-year') return `${basePrice}/yr`;
    return basePrice;
  };

  const nextImage = () => {
    if (allMedia.length > 1) {
      setCurrentMediaIndex((prev) => (prev + 1) % allMedia.length);
    }
  };

  const prevImage = () => {
    if (allMedia.length > 1) {
      setCurrentMediaIndex((prev) =>
        prev === 0 ? allMedia.length - 1 : prev - 1
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
                {allMedia.length > 0 ? (
                  <>
                    {allMedia[currentMediaIndex]?.type === 'video' && allMedia[currentMediaIndex]?.url.includes('youtube') ? (
                      <iframe
                        src={allMedia[currentMediaIndex]?.url}
                        className="w-full h-full"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        sandbox="allow-same-origin allow-scripts allow-presentation allow-popups allow-popups-to-escape-sandbox"
                        loading="lazy"
                        referrerPolicy="strict-origin-when-cross-origin"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          resetZoom();
                          setIsZoomOpen(true);
                        }}
                        aria-label="Zoom property photo"
                        className="block h-full w-full cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
                      >
                        <img
                          src={allMedia[currentMediaIndex]?.url || '/placeholder.svg'}
                          alt={property.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.warn(`Failed to load image: ${allMedia[currentMediaIndex]?.url}`);
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                          loading="eager"
                        />
                      </button>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">No images available</p>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                {allMedia.length > 1 && (
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

                {/* Media Counter */}
                <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/50 text-white text-sm">
                  {currentMediaIndex + 1} / {allMedia.length}
                </div>
                {allMedia[currentMediaIndex]?.type === 'image' && (
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 text-sm text-white">
                    <ZoomIn className="h-4 w-4" />
                    <span>Tap to zoom</span>
                  </div>
                )}
              </motion.div>

              {/* Thumbnails */}
              {allMedia.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {allMedia.map((media, index) => {
                    const isYoutube = media.type === 'video' && media.url.includes('youtube');
                    
                    return (
                      <button
                        key={media.id}
                        onClick={() => setCurrentMediaIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden relative ${
                          index === currentMediaIndex ? 'ring-2 ring-primary' : ''
                        }`}
                      >
                        {isYoutube ? (
                          <>
                            <img
                              src={`https://img.youtube.com/vi/${media.url.split('/embed/')[1]}/default.jpg`}
                              alt={`Video thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder.svg';
                              }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition-colors">
                              <Play className="w-6 h-6 text-white" />
                            </div>
                          </>
                        ) : (
                          <img
                            src={media.url || '/placeholder.svg'}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.svg';
                            }}
                            loading="lazy"
                          />
                        )}
                      </button>
                    );
                  })}
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
                      {formatDisplayPrice(property.price, property.priceUnit)}
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

                {/* Contact Agent - Mobile only (above description) */}
                {!property.isSoldOut && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:hidden bg-card rounded-2xl border border-border p-6 space-y-6"
                  >
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
                  </motion.div>
                )}

                {property.isSoldOut && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:hidden bg-card rounded-2xl border border-border p-6 text-center py-4"
                  >
                    <p className="text-muted-foreground mb-4">
                      This property is no longer available
                    </p>
                    <Button variant="outline" className="w-full" onClick={() => navigate('/properties')}>
                      View Similar Listings
                    </Button>
                  </motion.div>
                )}

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

      <Dialog
        open={isZoomOpen}
        onOpenChange={(open) => {
          setIsZoomOpen(open);
          if (!open) resetZoom();
        }}
      >
        <DialogContent
          showCloseButton={false}
          aria-describedby={undefined}
          className="!left-0 !top-0 !h-[100dvh] !w-screen !max-w-none !translate-x-0 !translate-y-0 overflow-hidden rounded-none border-0 bg-black p-0 text-white shadow-none"
          onPointerDown={(event) => {
            handledImageTapRef.current = false;
            if ((event.target as HTMLElement).closest('button')) return;
            handleZoomPointerDown(event);
          }}
          onPointerMove={handleZoomPointerMove}
          onPointerUp={handleZoomPointerUp}
          onPointerCancel={(event) => handleZoomPointerUp(event, true)}
          onClick={(event) => {
            const target = event.target as HTMLElement;
            if (handledImageTapRef.current) {
              handledImageTapRef.current = false;
              return;
            }
            if (draggedRef.current) {
              draggedRef.current = false;
              return;
            }
            if (target.closest('button') || target === zoomImageRef.current) return;

            setIsZoomOpen(false);
          }}
          onWheel={(event) => {
            const bounds = event.currentTarget.getBoundingClientRect();
            updateZoom(
              zoomScale + (event.deltaY < 0 ? 0.25 : -0.25),
              getZoomAnchor(event.clientX, event.clientY, bounds),
            );
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft' && imageIndices.length > 1) {
              changeZoomImage(-1);
            } else if (event.key === 'ArrowRight' && imageIndices.length > 1) {
              changeZoomImage(1);
            } else if (event.key === '+' || event.key === '=') {
              updateZoom(zoomScale + 0.5);
            } else if (event.key === '-') {
              updateZoom(zoomScale - 0.5);
            } else if (event.key === '0') {
              resetZoom();
            }
          }}
        >
          <DialogTitle className="sr-only">Property photo viewer</DialogTitle>

          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent px-4 py-4 pr-16 sm:px-6 sm:py-5 sm:pr-20">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium sm:text-base">{property.title}</p>
              <p className="text-xs text-white/70">
                {imageIndices.indexOf(currentMediaIndex) + 1} / {imageIndices.length}
              </p>
            </div>
            <div className="pointer-events-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateZoom(zoomScale - 0.5)}
                disabled={zoomScale <= 1}
                aria-label="Zoom out"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-black/80 text-white shadow-lg transition hover:bg-black disabled:opacity-70"
              >
                <ZoomOut className="h-5 w-5" />
              </button>
              <span className="min-w-12 rounded-full border border-white/70 bg-black/80 px-2 py-2 text-center text-sm tabular-nums text-white shadow-lg">
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                type="button"
                onClick={() => updateZoom(zoomScale + 0.5)}
                disabled={zoomScale >= 4}
                aria-label="Zoom in"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-black/80 text-white shadow-lg transition hover:bg-black disabled:opacity-70"
              >
                <ZoomIn className="h-5 w-5" />
              </button>
              <DialogClose
                type="button"
                aria-label="Close photo viewer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-black/80 text-white shadow-lg transition hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <X className="h-5 w-5" />
              </DialogClose>
            </div>
          </div>

          <div className="absolute inset-0 flex touch-none items-center justify-center overflow-hidden">
            <img
              ref={zoomImageRef}
              src={allMedia[currentMediaIndex]?.url || '/placeholder.svg'}
              alt={`${property.title} - photo ${imageIndices.indexOf(currentMediaIndex) + 1}`}
              draggable={false}
              role="button"
              tabIndex={0}
              aria-label="Zoom into this part of the photo"
              onKeyDown={(event) => {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
                updateZoom(zoomScale >= 4 ? 1 : Math.min(zoomScale * 2, 4));
              }}
              className={`max-h-[85dvh] max-w-[92vw] select-none object-contain transition-transform duration-150 ease-out ${
                zoomScale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'
              }`}
              style={{
                transform: `translate(${zoomPosition.x}px, ${zoomPosition.y}px) scale(${zoomScale})`,
              }}
            />
          </div>

          {imageIndices.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => changeZoomImage(-1)}
                aria-label="Previous photo"
                className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-black/80 text-white shadow-lg transition hover:bg-black sm:left-6"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={() => changeZoomImage(1)}
                aria-label="Next photo"
                className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-black/80 text-white shadow-lg transition hover:bg-black sm:right-6"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <p className="absolute inset-x-0 bottom-4 z-10 text-center text-xs text-white/70">
            Click or scroll a point to zoom · Pinch to zoom · Drag to move
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PropertyDetail;
