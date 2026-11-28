import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Building2, ChevronLeft, ChevronRight, MapPin, Store, Trees } from 'lucide-react';
import GoogleOneTap from '@/components/auth/GoogleOneTap';

interface AuthLayoutProps {
  children: ReactNode;
}

const featuredCities = [
  { name: 'Adoni', state: 'Andhra Pradesh' },
  { name: 'Amalapuram', state: 'Andhra Pradesh' },
  { name: 'Amaravati', state: 'Andhra Pradesh — Capital' },
  { name: 'Anantapur', state: 'Andhra Pradesh' },
  { name: 'Bhimavaram', state: 'Andhra Pradesh' },
  { name: 'Chirala', state: 'Andhra Pradesh' },
  { name: 'Chittoor', state: 'Andhra Pradesh' },
  { name: 'Dharmavaram', state: 'Andhra Pradesh' },
  { name: 'Eluru', state: 'Andhra Pradesh' },
  { name: 'Gudivada', state: 'Andhra Pradesh' },
  { name: 'Guntur', state: 'Andhra Pradesh' },
  { name: 'Hindupur', state: 'Andhra Pradesh' },
  { name: 'Hyderabad', state: 'Telangana' },
  { name: 'Kadapa', state: 'Andhra Pradesh' },
  { name: 'Kakinada', state: 'Andhra Pradesh' },
  { name: 'Kurnool', state: 'Andhra Pradesh' },
  { name: 'Machilipatnam', state: 'Andhra Pradesh' },
  { name: 'Madanapalle', state: 'Andhra Pradesh' },
  { name: 'Nandyal', state: 'Andhra Pradesh' },
  { name: 'Nellore', state: 'Andhra Pradesh' },
  { name: 'Ongole', state: 'Andhra Pradesh' },
  { name: 'Proddatur', state: 'Andhra Pradesh' },
  { name: 'Rajamahendravaram', state: 'Andhra Pradesh' },
  { name: 'Srikakulam', state: 'Andhra Pradesh' },
  { name: 'Tadepalligudem', state: 'Andhra Pradesh' },
  { name: 'Tenali', state: 'Andhra Pradesh' },
  { name: 'Tirupati', state: 'Andhra Pradesh' },
  { name: 'Vijayawada', state: 'Andhra Pradesh' },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh' },
  { name: 'Vizianagaram', state: 'Andhra Pradesh' },
];

const categorySlides = [
  { title: 'Homes', types: ['Apartments', 'Houses & Villas', 'PG / Hostels'], icon: Building2 },
  { title: 'Land', types: ['Plots', 'Agricultural Land', 'Farmhouses'], icon: Trees },
  { title: 'Commercial', types: ['Office Spaces', 'Shops & Showrooms', 'Commercial Spaces'], icon: Store },
];

const categorySlideVariants = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 28 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction * -28 }),
};

type FeaturedCity = (typeof featuredCities)[number];

const AnimatedText = ({ value, className }: { value: string; className: string }) => (
  <span className="grid">
    <AnimatePresence initial={false}>
      <motion.span
        key={value}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={`col-start-1 row-start-1 ${className}`}
      >
        {value}
      </motion.span>
    </AnimatePresence>
  </span>
);

const CityBadge = ({ city }: { city: FeaturedCity }) => (
  <motion.div
    layout="size"
    transition={{ layout: { type: 'spring', stiffness: 120, damping: 26, mass: 1 } }}
    className="inline-flex w-fit max-w-full items-center gap-2 overflow-hidden rounded-full border border-white/20 bg-white/[0.08] px-4 py-2 text-sm text-slate-100 shadow-[0_8px_32px_rgba(15,23,42,0.28)] backdrop-blur-xl"
  >
    <MapPin className="h-4 w-4 shrink-0 text-amber-300" />
    <AnimatedText value={`${city.name}, ${city.state}`} className="whitespace-nowrap" />
  </motion.div>
);

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const [cityIndex, setCityIndex] = useState(0);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [categoryDirection, setCategoryDirection] = useState(1);
  const city = featuredCities[cityIndex];
  const category = categorySlides[categoryIndex];

  const navigateCategories = (direction: 1 | -1) => {
    setCategoryDirection(direction);
    setCategoryIndex((index) => (index + direction + categorySlides.length) % categorySlides.length);
  };

  const selectCategory = (index: number) => {
    const forwardSteps = (index - categoryIndex + categorySlides.length) % categorySlides.length;
    setCategoryDirection(forwardSteps <= categorySlides.length / 2 ? 1 : -1);
    setCategoryIndex(index);
  };

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCityIndex((index) => (index + 1) % featuredCities.length);
      setCategoryDirection(1);
      setCategoryIndex((index) => (index + 1) % categorySlides.length);
    }, 3500);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="relative isolate min-h-screen overflow-x-hidden bg-slate-950">
      <GoogleOneTap />

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_18%_22%,rgba(37,89,145,0.42),transparent_48%),linear-gradient(135deg,#071426_0%,#111d33_58%,#091424_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-repeat opacity-40"
        style={{ backgroundImage: "url('/auth-real-estate-pattern.svg')" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-gradient-to-r from-slate-950/35 via-transparent to-slate-950/20"
      />

      <main className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl items-center gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(400px,460px)] lg:gap-16 lg:px-12">
        <motion.aside
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden max-w-xl text-white lg:block"
        >
          <div className="mb-8">
            <CityBadge city={city} />
          </div>

          <h2 className="font-display text-5xl font-bold leading-[1.08] tracking-tight xl:text-6xl">
            Find a place
            <br />
            <span className="text-amber-300">to call yours.</span>
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
            Explore homes, plots, commercial spaces, and agricultural land—all in one place.
          </p>

          <div className="mt-10 max-w-lg">
            <div className="relative overflow-hidden rounded-2xl">
              <AnimatePresence mode="wait" initial={false} custom={categoryDirection}>
                <motion.div
                  key={category.title}
                  custom={categoryDirection}
                  variants={categorySlideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="min-h-36 rounded-2xl border border-white/10 bg-white/[0.06] p-5 shadow-xl backdrop-blur-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-300/10">
                      <category.icon className="h-6 w-6 text-amber-300" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
                        Property types
                      </p>
                      <h3 className="mt-1 font-display text-2xl font-semibold text-white">
                        {category.title}
                      </h3>
                    </div>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {category.types.map((type) => (
                      <span
                        key={type}
                        className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-slate-200"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {categorySlides.map((slide, index) => (
                  <button
                    key={slide.title}
                    type="button"
                    aria-label={`Show ${slide.title} categories`}
                    aria-current={index === categoryIndex ? 'true' : undefined}
                    onClick={() => selectCategory(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === categoryIndex ? 'w-8 bg-amber-300' : 'w-2 bg-white/30 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous category"
                  onClick={() => navigateCategories(-1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white/80 transition-colors hover:bg-white/15 hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next category"
                  onClick={() => navigateCategories(1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white/80 transition-colors hover:bg-white/15 hover:text-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.aside>

        <div className="w-full max-w-md justify-self-center">
          <div className="mb-4 flex justify-center lg:hidden">
            <CityBadge city={city} />
          </div>
          <Link
            to="/"
            className="mx-auto mb-8 flex w-fit items-center justify-center gap-4 text-white"
          >
            <img
              src="/favicon-clipped.png"
              alt=""
              width={72}
              height={72}
              className="h-[4.5rem] w-[4.5rem] rounded-2xl bg-white p-1.5 shadow-[0_8px_28px_rgba(253,208,99,0.2)] ring-1 ring-white/70 object-contain"
            />
            <span className="font-display text-3xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(255,255,255,0.12)]">
              UMY Infra
            </span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
