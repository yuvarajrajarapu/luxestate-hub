import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search, Building2, Home, LandPlot, Key, Briefcase, Store, Users, Trees, Fence } from 'lucide-react';
import { usePropertyCounts } from '@/hooks/usePropertyCounts';
import { getOptimizedImageUrl } from '@/lib/image-optimization';
import property1 from '@/assets/properties/property-1.jpg';
import property2 from '@/assets/properties/property-2.jpg';
import property3 from '@/assets/properties/property-3.jpg';
import property5 from '@/assets/properties/property-5.jpg';
import flatRent from '@/assets/properties/flat-rent.jpg';
import houseRent from '@/assets/properties/house-rent.jpg';
import plotSale from '@/assets/properties/plot-sale.jpg';
import agricultureLand from '@/assets/properties/agriculture-land.jpg';
import farmhouseSale from '@/assets/properties/farmhouse-sale.jpg';
import farmhouseRent from '@/assets/properties/farmhouse-rent.jpg';

const categories = [
  {
    id: 'flat-for-sale',
    title: 'Flats for Sale',
    subtitle: 'Apartments & Flats',
    href: '/properties?categorySlug=flat-for-sale',
    image: property1,
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    icon: Building2,
  },
  {
    id: 'house-for-sale',
    title: 'Houses for Sale',
    subtitle: 'Villas & Independent Houses',
    href: '/properties?categorySlug=house-for-sale',
    image: property3,
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    icon: Home,
  },
  {
    id: 'plot',
    title: 'Plot for Sale',
    subtitle: 'Residential & Commercial Plots',
    href: '/land/plot',
    image: plotSale,
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    icon: Fence,
  },
  {
    id: 'agricultural',
    title: 'Agriculture Land',
    subtitle: 'Farm & Agricultural Land',
    href: '/land/agricultural',
    image: agricultureLand,
    bgColor: 'bg-lime-50 dark:bg-lime-950/30',
    icon: Trees,
  },
  {
    id: 'farm-houses-sale',
    title: 'Farmhouse for Sale',
    subtitle: 'Luxury Farmhouses',
    href: '/land/farm-houses?type=sale',
    image: farmhouseSale,
    bgColor: 'bg-teal-50 dark:bg-teal-950/30',
    icon: Home,
  },
  {
    id: 'farm-houses-rent',
    title: 'Farmhouse for Rent',
    subtitle: 'Rental Farmhouses',
    href: '/land/farm-houses?type=rent',
    image: farmhouseRent,
    bgColor: 'bg-green-50 dark:bg-green-950/30',
    icon: Key,
  },
  {
    id: 'flat-for-rent',
    title: 'Flats for Rent',
    subtitle: 'Rental Apartments',
    href: '/properties?categorySlug=flat-for-rent',
    image: flatRent,
    bgColor: 'bg-cyan-50 dark:bg-cyan-950/30',
    icon: Key,
  },
  {
    id: 'house-for-rent',
    title: 'Houses for Rent',
    subtitle: 'Rental Villas & Houses',
    href: '/properties?categorySlug=house-for-rent',
    image: houseRent,
    bgColor: 'bg-violet-50 dark:bg-violet-950/30',
    icon: Home,
  },
  {
    id: 'office-for-rent-lease',
    title: 'Office Spaces',
    subtitle: 'For Rent & Lease',
    href: '/properties?categorySlug=office-for-rent-lease',
    image: property5,
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    icon: Briefcase,
  },
  {
    id: 'commercial-space-for-rent-lease',
    title: 'Commercial Spaces',
    subtitle: 'Shops & Showrooms',
    href: '/properties?categorySlug=commercial-space-for-rent-lease',
    image: property1,
    bgColor: 'bg-rose-50 dark:bg-rose-950/30',
    icon: Store,
  },
  {
    id: 'pg-hostel-boys',
    title: 'PG for Men',
    subtitle: 'Hostels & PG',
    href: '/properties?categorySlug=pg-hostel-boys',
    image: property2,
    bgColor: 'bg-sky-50 dark:bg-sky-950/30',
    icon: Users,
  },
  {
    id: 'pg-hostel-girls',
    title: 'PG for Women',
    subtitle: 'Hostels & PG',
    href: '/properties?categorySlug=pg-hostel-girls',
    image: property3,
    bgColor: 'bg-pink-50 dark:bg-pink-950/30',
    icon: Users,
  },
];

const CategoryCards = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { counts, loading } = usePropertyCounts();

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const getCountDisplay = (categoryId: string) => {
    if (loading) return '...';
    const count = counts[categoryId] || 0;
    return count > 0 ? `${count.toLocaleString()}+` : null;
  };

  return (
    <section className="py-10 md:py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6 flex items-end justify-between"
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              Explore Properties
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Find your perfect property across all categories
            </p>
          </div>

          {/* Scroll Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full border border-border hover:bg-muted transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full border border-border hover:bg-muted transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Scrollable Container */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((category, index) => {
              const countDisplay = getCountDisplay(category.id);
              const hasProperties = countDisplay !== null;
              const IconComponent = category.icon;

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  className="flex-shrink-0 w-[260px] md:w-[300px] snap-start"
                >
                  <Link
                    to={category.href}
                    className={`block rounded-xl overflow-hidden ${category.bgColor} hover:shadow-xl transition-all duration-300 group relative h-[280px] md:h-[340px]`}
                  >
                    {/* Icon Badge */}
                    <div className="absolute top-4 left-4 z-20 w-10 h-10 rounded-lg bg-background/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>

                    {/* Content with background for readability */}
                    <div className="p-5 pt-16 pb-6 relative z-10 bg-gradient-to-b from-transparent via-transparent to-background/60">
                      <h3 className="text-lg md:text-xl font-bold text-foreground mb-1">
                        {category.title}
                      </h3>
                      <p className="text-muted-foreground text-xs mb-3">
                        {category.subtitle}
                      </p>

                      {hasProperties ? (
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                          <span className="text-foreground">{countDisplay}</span>
                          <span className="text-muted-foreground">Properties</span>
                        </span>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                          <Search className="w-3.5 h-3.5 text-primary" />
                          <span className="text-xs font-medium text-primary">
                            We are searching more for you
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Image */}
                    <div className="absolute bottom-0 right-0 w-[80%] h-[55%]">
                      <picture>
                        <source srcSet={getOptimizedImageUrl(category.image, 'webp', 75)} type="image/webp" />
                        <img
                          src={category.image}
                          alt={category.title}
                          className="w-full h-full object-cover rounded-tl-xl group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                          decoding="async"
                        />
                      </picture>
                    </div>

                    {/* Hover Arrow */}
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                      <svg
                        className="w-4 h-4 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Gradient Fades */}
          <div className="hidden md:block absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none" />
          <div className="hidden md:block absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </div>

        {/* Mobile Scroll Hint */}
        <p className="text-center text-xs text-muted-foreground mt-2 md:hidden">
          ← Swipe to explore all categories →
        </p>
      </div>
    </section>
  );
};

export default CategoryCards;
