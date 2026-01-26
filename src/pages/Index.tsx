import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import CategoryCards from '@/components/home/CategoryCards';
import PropertyCard from '@/components/property/PropertyCard';
import { motion } from 'framer-motion';
import { useProperties } from '@/hooks/useProperties';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';

const Index = () => {
  // Fetch properties from Firestore, limited to 6 for homepage
  const { properties, loading } = useProperties({ limit: 6 });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Category Cards - 99acres Style */}
        <CategoryCards />

        {/* Featured Properties */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                Property Listings
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explore our handpicked selection of premium properties across India's most 
                sought-after locations
              </p>
            </motion.div>

            {/* Property Grid */}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {properties.map((property, index) => (
                  <PropertyCard key={property.id} property={property} index={index} />
                ))}
              </div>
            )}

            {/* View All Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Link to="/properties">
                <Button className="btn-luxury h-12 px-8 flex items-center gap-2 mx-auto">
                  View All Properties
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
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
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <p className="text-3xl md:text-4xl font-display font-bold mb-2">
                    {stat.value}
                  </p>
                  <p className="text-primary-foreground/70 text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Property Categories */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                Browse by Category
              </h2>
              <p className="text-muted-foreground">
                Find exactly what you're looking for
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { label: 'Flats for Sale', href: '/properties?category=flat-for-sale', icon: '🏢' },
                { label: 'Houses for Sale', href: '/properties?category=house-for-sale', icon: '🏠' },
                { label: 'Plot for Sale', href: '/land/plot', icon: '📐' },
                { label: 'Agriculture Land', href: '/land/agricultural', icon: '🌾' },
                { label: 'Farmhouse for Sale', href: '/land/farm-houses?type=sale', icon: '🏡' },
                { label: 'Farmhouse for Rent', href: '/land/farm-houses?type=rent', icon: '🔑' },
                { label: 'Flats for Rent', href: '/properties?category=flat-for-rent', icon: '🏨' },
                { label: 'Houses for Rent', href: '/properties?category=house-for-rent', icon: '🏘️' },
                { label: 'Office Spaces', href: '/properties?category=office-for-rent-lease', icon: '🏬' },
                { label: 'Commercial', href: '/properties?category=commercial-space-for-rent-lease', icon: '🏪' },
                { label: 'PG for Men', href: '/properties?category=pg-hostel-boys', icon: '🛏️' },
                { label: 'PG for Women', href: '/properties?category=pg-hostel-girls', icon: '🛋️' },
              ].map((category, index) => (
                <motion.div
                  key={category.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
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
                </motion.div>
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
