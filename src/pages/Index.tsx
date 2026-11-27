import { lazy, Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import CategoryCards from '@/components/home/CategoryCards';
import { useProperties } from '@/hooks/useProperties';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import GoogleOneTap from '@/components/auth/GoogleOneTap';

const PropertyCard = lazy(() => import('@/components/property/PropertyCard'));

const Index = () => {
  // Fetch properties from Firestore, limited to 6 for homepage
  const { properties, loading } = useProperties({ limit: 6, deferUntilLoad: true });

  return (
    <div className="min-h-screen bg-background">
      <GoogleOneTap />
      <Header />

      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Category Cards - 99acres Style */}
        <CategoryCards />

        {/* Featured Properties */}
        <section className="pb-8 pt-4 md:pb-10 md:pt-6">
          <div className="container mx-auto px-4">
            {/* Header with See All */}
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
                Properties
              </h2>
              <Link 
                to="/properties"
                className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-primary/15 bg-white/70 px-4 py-2 text-sm font-medium text-primary shadow-sm backdrop-blur-md transition-all hover:bg-white/90 hover:text-primary/80 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 md:text-base"
              >
                See All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Property Cards */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground mb-4">
                  No properties available yet
                </p>
                <p className="text-sm text-muted-foreground">
                  Check back soon for new listings!
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                <div className="flex gap-3" style={{ width: 'max-content' }}>
                  <Suspense fallback={<div className="flex w-full items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
                    {properties.map((property, index) => (
                      <div key={property.id} className="w-48">
                        <PropertyCard property={property} index={index} />
                      </div>
                    ))}
                  </Suspense>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: '500+', label: 'Properties Listed' },
                { value: '1000+', label: 'Happy Customers' },
                { value: '50+', label: 'Cities Covered' },
                { value: '₹500 Cr+', label: 'Worth Properties Sold' },
              ].map((stat) => (
                <div
                  key={stat.label}
                >
                  <p className="text-3xl md:text-4xl font-display font-bold mb-2">
                    {stat.value}
                  </p>
                  <p className="text-primary-foreground/70 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Property Categories */}
        <section className="pb-16 pt-12 md:pb-24 md:pt-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                Browse by Category
              </h2>
              <p className="text-muted-foreground">
                Find exactly what you're looking for
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { label: 'Flats for Sale', href: '/properties?categorySlug=flat-for-sale', icon: '🏢' },
                { label: 'Houses for Sale', href: '/properties?categorySlug=house-for-sale', icon: '🏠' },
                { label: 'Plot for Sale', href: '/land/plot', icon: '📐' },
                { label: 'Land for Developers', href: '/properties?categorySlug=development-land-for-sale', icon: '🏗️' },
                { label: 'Venture for Marketing', href: '/properties?categorySlug=venture-for-marketing', icon: '🗺️' },
                { label: 'Agriculture Land', href: '/land/agricultural', icon: '🌾' },
                { label: 'Farmhouse for Sale', href: '/land/farm-houses?type=sale', icon: '🏡' },
                { label: 'Farmhouse for Rent', href: '/land/farm-houses?type=rent', icon: '🔑' },
                { label: 'Flats for Rent', href: '/properties?categorySlug=flat-for-rent', icon: '🏨' },
                { label: 'Houses for Rent', href: '/properties?categorySlug=house-for-rent', icon: '🏘️' },
                { label: 'Office Spaces', href: '/properties?categorySlug=office-for-rent-lease', icon: '🏬' },
                { label: 'Commercial', href: '/properties?categorySlug=commercial-space-for-rent-lease', icon: '🏪' },
                { label: 'PG for Men', href: '/properties?categorySlug=pg-hostel-boys', icon: '🛏️' },
                { label: 'PG for Women', href: '/properties?categorySlug=pg-hostel-girls', icon: '🛋️' },
              ].map((category) => (
                <div
                  key={category.label}
                >
                  <Link
                    to={category.href}
                    className="block p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover group"
                  >
                    <span className="text-3xl mb-3 block">{category.icon}</span>
                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {category.label}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
