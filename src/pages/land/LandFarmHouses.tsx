import { useMemo } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PropertyCard from '@/components/property/PropertyCard';
import { useProperties } from '@/hooks/useProperties';
import { Loader2 } from 'lucide-react';

const LandFarmHouses = () => {
  // Filter by mainCategory='land' first, then filter by landType client-side
  const { properties, loading, error } = useProperties({ 
    mainCategory: 'land',
    categorySlug: 'land-for-sale'
  });

  const filteredProperties = useMemo(() => {
    return properties.filter(
      (property) => property.landType === 'farm-houses'
    );
  }, [properties]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-display text-3xl md:text-4xl text-primary mb-2">
              Farm Houses
            </h1>
            <p className="text-muted-foreground">
              Discover beautiful farm houses for peaceful countryside living
            </p>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-destructive">{error}</p>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No farm houses available at the moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LandFarmHouses;
