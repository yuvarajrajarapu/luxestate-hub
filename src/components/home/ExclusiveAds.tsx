import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Ad {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  location: string;
  image: string;
  badges: string[];
  reraNo?: string;
}

const mockAds: Ad[] = [
  {
    id: '1',
    title: '3 & 4 BHK SPECTRA',
    subtitle: 'ASBL',
    price: '₹2.9 Cr Onwards',
    location: 'Luxury Living at Financial District, Hyderabad',
    image: '/placeholder.svg',
    badges: ['NO GST', 'NO REGISTRATION', 'IMMEDIATE HANDOVER'],
    reraNo: 'P02400002881'
  },
  {
    id: '2',
    title: '4 & 5 BHK Boutique Villas',
    subtitle: 'Triana',
    price: '₹2.65 Cr',
    location: 'Tukkuguda, Hyderabad',
    image: '/placeholder.svg',
    badges: ['GATED COMMUNITY'],
    reraNo: 'P02400003562'
  },
  {
    id: '3',
    title: 'Premium 3 BHK Apartments',
    subtitle: 'My Home Bhooja',
    price: '₹1.85 Cr',
    location: 'Madhapur, Hyderabad',
    image: '/placeholder.svg',
    badges: ['READY TO MOVE'],
    reraNo: 'P02400001234'
  }
];

const ExclusiveAds = () => {
  const [currentAd, setCurrentAd] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % mockAds.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-6 bg-secondary">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-primary font-semibold">99acres exclusive</span>
          <span className="text-muted-foreground text-sm">Sponsored projects and events</span>
        </div>

        {/* Ad Banner */}
        <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl overflow-hidden h-[200px] md:h-[250px]">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${mockAds[currentAd].image})` }}
          />
          
          {/* Content */}
          <div className="relative h-full flex items-center px-6 md:px-12">
            <div className="text-white max-w-lg">
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                {mockAds[currentAd].badges.map((badge, idx) => (
                  <span key={idx} className="px-2 py-1 bg-primary text-white text-xs font-semibold rounded">
                    {badge}
                  </span>
                ))}
              </div>
              
              <p className="text-xs text-gray-300 mb-2">
                {mockAds[currentAd].reraNo && `Rera: ${mockAds[currentAd].reraNo}`}
              </p>
              
              <h3 className="text-xl md:text-2xl font-bold mb-1">
                {mockAds[currentAd].title}
              </h3>
              <p className="text-gray-300 mb-2">{mockAds[currentAd].subtitle}</p>
              <p className="text-sm text-gray-300 mb-3">{mockAds[currentAd].location}</p>
              <p className="text-lg md:text-xl font-bold mb-4">
                Price Start at: {mockAds[currentAd].price}
              </p>
              
              <button className="acres-btn-primary">
                Enquire Now
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {mockAds.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentAd(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === currentAd ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExclusiveAds;
