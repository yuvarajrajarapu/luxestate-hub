import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Mic, MapPin, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const tabs = [
  { id: 'buy', label: 'Buy' },
  { id: 'rent', label: 'Rent' },
  { id: 'new-launch', label: 'New Launch' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'plots', label: 'Plots/Land' },
];

const categories = [
  { value: 'all', label: 'All Residential' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa' },
  { value: 'independent-house', label: 'Independent House' },
  { value: 'plot', label: 'Plot' },
];

const SearchBarWidget = () => {
  const [activeTab, setActiveTab] = useState('buy');
  const [category, setCategory] = useState('all');
  const [location, setLocation] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (activeTab === 'buy') params.set('type', 'sale');
    else if (activeTab === 'rent') params.set('type', 'rent');
    else if (activeTab === 'commercial') params.set('type', 'lease');
    else if (activeTab === 'plots') params.set('category', 'land-for-sale');
    
    if (location) params.set('location', location);
    
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="bg-white py-4 border-b border-border">
      <div className="container mx-auto px-4">
        {/* Tabs */}
        <div className="flex items-center gap-1 mb-4 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors rounded-t-md ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
          
          {/* Projects Link */}
          <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground ml-auto whitespace-nowrap">
            Projects
          </button>
          
          {/* Post Property */}
          <button className="px-4 py-2 text-sm font-semibold text-primary whitespace-nowrap">
            Post Property FREE
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-2">
          {/* Category Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="flex items-center gap-2 px-4 py-3 border border-border rounded-lg bg-white min-w-[180px] justify-between"
            >
              <span className="text-sm">
                {categories.find(c => c.value === category)?.label}
              </span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
            
            {showCategoryDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 mt-1 w-full bg-white border border-border rounded-lg shadow-lg z-50"
              >
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => {
                      setCategory(cat.value);
                      setShowCategoryDropdown(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors ${
                      category === cat.value ? 'text-primary font-medium' : ''
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Location Search */}
          <div className="flex-1 flex items-center gap-2 px-4 py-3 border border-border rounded-lg bg-white">
            <Search className="w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder='Search "Flats for rent in Hyderabad"'
              className="flex-1 bg-transparent outline-none text-sm"
            />
            <button className="p-1 hover:bg-muted rounded-full transition-colors">
              <Mic className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="p-1 hover:bg-muted rounded-full transition-colors">
              <MapPin className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="acres-btn-primary px-8"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBarWidget;
