import { useEffect, useState } from 'react';
import FeaturedCityBadge from '@/components/FeaturedCityBadge';
import { featuredCities } from '@/data/featuredCities';
import heroBg from '@/assets/hero-bg.jpg';

const HeroSection = () => {
  const [cityIndex, setCityIndex] = useState(0);
  const city = featuredCities[cityIndex];
  const imagePriorityAttribute = { fetchpriority: 'high' };

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCityIndex((index) => (index + 1) % featuredCities.length);
    }, 3500);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <picture>
          <source srcSet="/hero-bg.avif" type="image/avif" />
          <img
            src={heroBg}
            alt="Luxury real estate"
            width={1600}
            height={900}
            className="w-full h-full object-cover"
            loading="eager"
            decoding="sync"
            {...imagePriorityAttribute}
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-hero" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-20 pb-16 text-center md:pt-12 md:pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex w-full justify-center">
            <FeaturedCityBadge city={city} variant="hero" className="mb-5" />
          </div>
          <h1 className="text-display text-primary-foreground mb-4">
            Find Your Perfect Property
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Explore homes, plots, commercial spaces, and agricultural land across India's prime locations.
          </p>
        </div>

        {/* Breadcrumb */}
        <p className="text-primary-foreground/60 mt-6 text-sm">
          Home / Properties in India
        </p>
      </div>

      {/* Scroll Indicator */}
      <div className="hero-scroll-indicator absolute bottom-6 left-1/2 -translate-x-1/2">
        <div className="hero-scroll-indicator__mouse w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 rounded-full bg-primary-foreground/50" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
