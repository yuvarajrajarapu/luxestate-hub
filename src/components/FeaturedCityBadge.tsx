import { AnimatePresence, motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import type { FeaturedCity } from '@/data/featuredCities';

interface FeaturedCityBadgeProps {
  city: FeaturedCity;
  variant?: 'auth' | 'hero';
  className?: string;
}

const FeaturedCityBadge = ({
  city,
  variant = 'auth',
  className = '',
}: FeaturedCityBadgeProps) => (
  <motion.div
    layout="size"
    transition={{ layout: { type: 'spring', stiffness: 120, damping: 26, mass: 1 } }}
    aria-label={`Featured location: ${city.name}, ${city.state}`}
    className={`mx-auto flex w-fit max-w-full items-center gap-2 overflow-hidden rounded-full border px-4 py-2 text-sm backdrop-blur-xl ${
      variant === 'hero'
        ? 'border-white/20 bg-slate-950/30 text-primary-foreground shadow-lg'
        : 'border-white/20 bg-white/[0.08] text-slate-100 shadow-[0_8px_32px_rgba(15,23,42,0.28)]'
    } ${className}`}
  >
    <MapPin className="h-4 w-4 shrink-0 text-amber-300" />
    <span className="grid min-w-0">
      <AnimatePresence initial={false}>
        <motion.span
          key={`${city.name}, ${city.state}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="col-start-1 row-start-1 whitespace-nowrap"
        >
          {city.name}, {city.state}
        </motion.span>
      </AnimatePresence>
    </span>
  </motion.div>
);

export default FeaturedCityBadge;
