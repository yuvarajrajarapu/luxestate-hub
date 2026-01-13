import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Home, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import heroBg from '@/assets/hero-bg.jpg';

const HeroSection = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'buy' | 'rent' | 'lease'>('buy');
  const [searchLocation, setSearchLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchLocation) params.set('location', searchLocation);
    if (propertyType) params.set('category', propertyType);
    params.set('type', activeTab === 'buy' ? 'sale' : activeTab);
    navigate(`/properties?${params.toString()}`);
  };

  const tabs = [
    { id: 'buy', label: 'Buy', icon: Home },
    { id: 'rent', label: 'Rent', icon: Building2 },
    { id: 'lease', label: 'Lease', icon: Building2 },
  ] as const;

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Luxury real estate"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-display text-primary-foreground mb-6">
            Find Your Perfect Property
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Explore homes, plots, commercial spaces, and agricultural land across India's prime locations.
          </p>

          {/* Search Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="glass rounded-2xl p-6 md:p-8 max-w-3xl mx-auto"
          >
            {/* Tabs */}
            <div className="flex justify-center mb-6">
              <div className="tab-nav">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`tab-item flex items-center gap-2 ${
                      activeTab === tab.id ? 'active' : ''
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Form */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search location..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="pl-10 h-12 bg-background border-border"
                />
              </div>

              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="h-12 bg-background border-border">
                  <SelectValue placeholder="Property type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flat-for-sale">Flat/Apartment</SelectItem>
                  <SelectItem value="house-for-sale">House/Villa</SelectItem>
                  <SelectItem value="land-for-sale">Land/Plot</SelectItem>
                  <SelectItem value="commercial-space-for-rent-lease">Commercial</SelectItem>
                  <SelectItem value="office-for-rent-lease">Office Space</SelectItem>
                  <SelectItem value="pg-boys">PG/Hostel</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={handleSearch}
                className="btn-luxury h-12 flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                Search Properties
              </Button>
            </div>
          </motion.div>
        </motion.div>

        {/* Breadcrumb */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-primary-foreground/60 mt-8 text-sm"
        >
          Home / Properties in India
        </motion.p>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2"
        >
          <div className="w-1.5 h-3 rounded-full bg-primary-foreground/50" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
