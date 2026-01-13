import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BannerSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  sqft: string;
  price: string;
  location: string;
  badges: string[];
  reraNo?: string;
}

const mockSlides: BannerSlide[] = [
  {
    id: '1',
    image: '/placeholder.svg',
    title: 'LUXURY 3 BHKS',
    subtitle: 'ASBL SPECTRA',
    sqft: '2220 SQ.FT.',
    price: '₹2.65 Cr',
    location: 'Financial District',
    badges: ['NO GST', 'NO REGISTRATION', 'IMMEDIATE HANDOVER'],
    reraNo: 'P02400003071'
  },
  {
    id: '2',
    image: '/placeholder.svg',
    title: '4 & 5 BHK Boutique Villas',
    subtitle: 'Premium Living',
    sqft: '3500 SQ.FT.',
    price: '₹4.5 Cr',
    location: 'Tukkuguda, Hyderabad',
    badges: ['GATED COMMUNITY', 'READY TO MOVE'],
    reraNo: 'P02400002881'
  },
  {
    id: '3',
    image: '/placeholder.svg',
    title: '3 & 4 BHK Apartments',
    subtitle: 'Casagrand Evon',
    sqft: '1850 SQ.FT.',
    price: '₹1.64 - 2.23 Cr',
    location: 'Kompally, Hyderabad',
    badges: ['NEW LAUNCH', 'SPECIAL OFFERS'],
    reraNo: 'P02400004521'
  }
];

const HeroBannerSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mockSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % mockSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + mockSlides.length) % mockSlides.length);

  return (
    <div className="relative w-full h-[300px] md:h-[400px] bg-gradient-to-r from-gray-800 to-gray-900 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {/* Background */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%), url(${mockSlides[currentSlide].image})` 
            }}
          />
          
          {/* Content */}
          <div className="relative h-full container mx-auto px-4 flex items-center">
            <div className="max-w-lg text-white">
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {mockSlides[currentSlide].badges.map((badge, idx) => (
                  <span key={idx} className="px-3 py-1 bg-primary text-white text-xs font-semibold rounded">
                    {badge}
                  </span>
                ))}
              </div>
              
              {/* RERA */}
              {mockSlides[currentSlide].reraNo && (
                <p className="text-xs text-gray-300 mb-2">
                  RERA No: {mockSlides[currentSlide].reraNo}
                </p>
              )}
              
              {/* Title */}
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                {mockSlides[currentSlide].title}
              </h2>
              <p className="text-lg text-gray-300 mb-4">
                {mockSlides[currentSlide].subtitle}
              </p>
              
              {/* Details */}
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm">{mockSlides[currentSlide].sqft}</span>
                <span className="text-2xl font-bold text-primary">
                  {mockSlides[currentSlide].price}
                </span>
              </div>
              
              <p className="text-sm text-gray-300 mb-6">
                {mockSlides[currentSlide].location}
              </p>
              
              {/* CTA */}
              <button className="acres-btn-primary">
                Explore Now
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {mockSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-2 h-2 rounded-full transition-colors ${
              idx === currentSlide ? 'bg-white' : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBannerSlider;
