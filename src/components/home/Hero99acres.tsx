import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Search, Mic, Crosshair } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface BannerSlide {
  id: string;
  image: string;
  projectName: string;
  projectLogo?: string;
  badges: { text: string; color: 'orange' | 'green' }[];
  reraNo: string;
  title: string;
  specs: string;
  price: string;
  location: string;
}

const mockSlides: BannerSlide[] = [
  {
    id: '1',
    image: '/placeholder.svg',
    projectName: 'ASBL SPECTRA',
    badges: [
      { text: 'NO GST', color: 'orange' },
      { text: 'NO REGISTRATION', color: 'orange' },
      { text: 'IMMEDIATE HANDOVER', color: 'green' }
    ],
    reraNo: 'P02400003071',
    title: 'LUXURY 3 BHKS',
    specs: '2220 SQ.FT. (204.38 SQ.M.)',
    price: '₹2.65 CR ALL INCLUSIVE',
    location: 'FINANCIAL DISTRICT'
  },
  {
    id: '2',
    image: '/placeholder.svg',
    projectName: 'MY HOME BHOOJA',
    badges: [
      { text: 'READY TO MOVE', color: 'green' },
      { text: 'GATED COMMUNITY', color: 'orange' }
    ],
    reraNo: 'P02400002156',
    title: '4 BHK PREMIUM APARTMENTS',
    specs: '3200 SQ.FT. (297.29 SQ.M.)',
    price: '₹4.25 CR ONWARDS',
    location: 'MADHAPUR, HYDERABAD'
  }
];

const tabs = [
  { id: 'buy', label: 'Buy', active: true },
  { id: 'rent', label: 'Rent' },
  { id: 'new-launch', label: 'New Launch', badge: true },
  { id: 'commercial', label: 'Commercial' },
  { id: 'plots', label: 'Plots/Land' },
  { id: 'projects', label: 'Projects' },
];

const categories = [
  { value: 'all', label: 'All Residential' },
  { value: 'apartment', label: 'Flat/Apartment' },
  { value: 'house', label: 'House/Villa' },
  { value: 'plot', label: 'Plot' },
];

const Hero99acres = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('buy');
  const [category, setCategory] = useState('all');
  const [location, setLocation] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mockSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % mockSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + mockSlides.length) % mockSlides.length);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (activeTab === 'buy') params.set('type', 'sale');
    else if (activeTab === 'rent') params.set('type', 'rent');
    else if (activeTab === 'commercial') params.set('type', 'lease');
    else if (activeTab === 'plots') params.set('category', 'land-for-sale');
    if (location) params.set('location', location);
    navigate(`/properties?${params.toString()}`);
  };

  const slide = mockSlides[currentSlide];

  return (
    <div className="relative">
      {/* Hero Banner */}
      <div className="relative h-[280px] md:h-[320px] bg-[#0a1929] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a1929] via-[#0d2137] to-[#0a1929]" />
            
            {/* Left - Building Image */}
            <div className="absolute left-0 bottom-0 w-1/3 h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a1929]/80" />
              <img 
                src={slide.image} 
                alt="Property"
                className="h-full w-full object-cover object-bottom opacity-80"
              />
            </div>

            {/* Right Content Area */}
            <div className="absolute right-0 top-0 bottom-0 w-2/3 flex items-center justify-end pr-16 md:pr-24">
              <div className="flex items-center gap-8">
                {/* Badges Stack */}
                <div className="flex flex-col items-center gap-1">
                  {slide.badges.map((badge, idx) => (
                    <span 
                      key={idx}
                      className={`px-3 py-1.5 text-xs font-bold rounded ${
                        badge.color === 'orange' 
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white' 
                          : 'bg-gradient-to-r from-teal-500 to-teal-600 text-white'
                      }`}
                      style={{ 
                        transform: idx === 0 ? 'rotate(-5deg)' : idx === 2 ? 'rotate(5deg)' : 'none',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                      }}
                    >
                      {badge.text}
                    </span>
                  ))}
                </div>

                {/* Project Info Card */}
                <div className="text-white">
                  {/* Logo/Name */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl md:text-3xl font-light tracking-wider">
                      <span className="font-bold">{slide.projectName.split(' ')[0]}</span>{' '}
                      <span className="text-[#7dd3fc]">{slide.projectName.split(' ').slice(1).join(' ')}</span>
                    </div>
                    <div className="text-[10px] text-gray-400 text-right leading-tight">
                      <p>Rera No: {slide.reraNo}</p>
                      <p>http://rera.telangana.gov.in</p>
                    </div>
                  </div>

                  {/* Specs */}
                  <p className="text-sm md:text-base font-semibold mb-1 tracking-wide">
                    {slide.title} | {slide.specs}
                  </p>
                  <p className="text-sm md:text-base font-semibold text-white/90 mb-4">
                    {slide.price} | {slide.location}
                  </p>

                  {/* CTA Button */}
                  <button className="px-6 py-2 border border-white/60 text-white text-sm font-medium rounded hover:bg-white/10 transition-colors flex items-center gap-2">
                    Explore Now
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors z-10"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors z-10"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {mockSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2 h-2 rounded-full transition-colors ${
                idx === currentSlide ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Search Widget - Overlapping */}
      <div className="relative z-20 -mt-16 mx-4 md:mx-8 lg:mx-16">
        <div className="bg-white rounded-lg shadow-xl overflow-visible">
          {/* Tabs Row */}
          <div className="flex items-center border-b border-gray-200 px-4">
            <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-5 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'text-[#0b2239]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    {tab.label}
                    {tab.badge && (
                      <span className="w-2 h-2 bg-red-500 rounded-full" />
                    )}
                  </span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0078db]"
                    />
                  )}
                </button>
              ))}
            </div>
            
            {/* Post Property Button */}
            <div className="ml-auto">
              <Link
                to="/admin/property/new"
                className="inline-flex items-center px-4 py-1.5 bg-[#009587] text-white text-sm font-medium rounded hover:bg-[#00857a] transition-colors"
              >
                Post Property <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded text-[10px]">FREE</span>
              </Link>
            </div>
          </div>

          {/* Search Row */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 p-4">
            {/* Category Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 border-r border-gray-200 min-w-[160px]"
              >
                {categories.find(c => c.value === category)?.label}
                <ChevronDown className="w-4 h-4 ml-auto" />
              </button>
              
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                >
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => {
                        setCategory(cat.value);
                        setShowDropdown(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        category === cat.value ? 'text-[#0078db] font-medium bg-blue-50' : 'text-gray-700'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Search Input */}
            <div className="flex-1 flex items-center gap-3 px-3">
              <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder='Search "Flats for rent in sector 77 Noida"'
                className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                <Crosshair className="w-5 h-5 text-[#0078db]" />
              </button>
              <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                <Mic className="w-5 h-5 text-gray-500" />
              </button>
              <button
                onClick={handleSearch}
                className="px-6 py-2.5 bg-[#0078db] text-white text-sm font-medium rounded hover:bg-[#0066c0] transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero99acres;
