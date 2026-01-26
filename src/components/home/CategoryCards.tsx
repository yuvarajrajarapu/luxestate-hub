import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search, Building2, Home, LandPlot, Key, Briefcase, Store, Users } from 'lucide-react';
import { usePropertyCounts } from '@/hooks/usePropertyCounts';
import property1 from '@/assets/properties/property-1.jpg';
import property2 from '@/assets/properties/property-2.jpg';
import property3 from '@/assets/properties/property-3.jpg';
import property4 from '@/assets/properties/property-4.jpg';
import property5 from '@/assets/properties/property-5.jpg';
import property6 from '@/assets/properties/property-6.jpg';

const categories = [
  {
    id: 'flat-for-sale',
    title: 'Flats for Sale',
    subtitle: 'Apartments & Flats',
    href: '/properties?category=flat-for-sale',
    image: property1,
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    icon: Building2,
  },
  {
    id: 'house-for-sale',
    title: 'Houses for Sale',
    subtitle: 'Villas & Independent Houses',
    href: '/properties?category=house-for-sale',
    image: property3,
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    icon: Home,
  },
  {
    id: 'land-for-sale',
    title: 'Land for Sale',
    subtitle: 'Plots & Agricultural',
    href: '/land/plot',
    image: property2,
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    icon: LandPlot,
  },
  {
    id: 'flat-for-rent',
    title: 'Flats for Rent',
    subtitle: 'Rental Apartments',
    href: '/properties?category=flat-for-rent',
    image: property6,
    bgColor: 'bg-cyan-50 dark:bg-cyan-950/30',
    icon: Key,
  },
  {
    id: 'house-for-rent',
    title: 'Houses for Rent',
    subtitle: 'Rental Villas & Houses',
    href: '/properties?category=house-for-rent',
    image: property4,
    bgColor: 'bg-violet-50 dark:bg-violet-950/30',
    icon: Home,
  },
  {
    id: 'office-for-rent-lease',
    title: 'Office Spaces',
    subtitle: 'For Rent & Lease',
    href: '/properties?category=office-for-rent-lease',
    image: property5,
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    icon: Briefcase,
  },
  {
    id: 'commercial-space-for-rent-lease',
    title: 'Commercial Spaces',
    subtitle: 'Shops & Showrooms',
    href: '/properties?category=commercial-space-for-rent-lease',
    image: property1,
    bgColor: 'bg-rose-50 dark:bg-rose-950/30',
    icon: Store,
  },
  {
    id: 'pg-hostel-boys',
    title: 'PG for Boys',
    subtitle: 'Hostels & PG',
    href: '/properties?category=pg-hostel-boys',
    image: property2,
    bgColor: 'bg-sky-50 dark:bg-sky-950/30',
    icon: Users,
  },
  {
    id: 'pg-hostel-girls',
    title: 'PG for Girls',
    subtitle: 'Hostels & PG',
    href: '/properties?category=pg-hostel-girls',
    image: property3,
    bgColor: 'bg-pink-50 dark:bg-pink-950/30',
    icon: Users,
  },
  {
    id: 'pg-boys',
    title: 'Paying Guest (Boys)',
    subtitle: 'Shared Accommodation',
    href: '/properties?category=pg-boys',
    image: property4,
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/30',
    icon: Users,
  },
  {
    id: 'pg-girls',
    title: 'Paying Guest (Girls)',
    subtitle: 'Shared Accommodation',
    href: '/properties?category=pg-girls',
    image: property5,
    bgColor: 'bg-fuchsia-50 dark:bg-fuchsia-950/30',
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

                    {/* Content */}
                    <div className="p-5 pt-16 relative z-10">
                      <h3 className="text-lg md:text-xl font-bold text-foreground mb-0.5">
                        {category.title}
                      </h3>
                      <p className="text-muted-foreground text-xs mb-2">
                        {category.subtitle}
                      </p>

                      {hasProperties ? (
                        <p className="text-sm">
                          <span className="font-semibold text-foreground/80">
                            {countDisplay}
                          </span>{' '}
                          <span className="text-muted-foreground">Properties</span>
                        </p>
                      ) : (
                        <div className="flex items-center gap-1.5 mt-1">
                          <Search className="w-3 h-3 text-primary" />
                          <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            We are searching more for you
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Image */}
                    <div className="absolute bottom-0 right-0 w-[80%] h-[55%]">
                      <img
                        src={category.image}
                        alt={category.title}
                        className="w-full h-full object-cover rounded-tl-xl group-hover:scale-105 transition-transform duration-500"
                      />
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
