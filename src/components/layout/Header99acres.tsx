import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, User, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

const Header99acres = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: 'For Buyers', href: '/properties?type=sale' },
    { label: 'For Tenants', href: '/properties?type=rent' },
    { label: 'For Owners', href: '/admin/property/new' },
    { label: 'For Dealers / Builders', href: '/admin/login' },
    { label: 'Insights', href: '#', badge: 'NEW' },
  ];

  return (
    <header className="bg-[#0b2239] text-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-1">
              <span className="text-2xl font-bold text-white">
                <span className="text-red-500">99</span>acres
              </span>
            </Link>
            
            {/* City Selector */}
            <button className="hidden md:flex items-center gap-1 text-sm text-white/80 hover:text-white">
              Buy in ...
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="text-sm text-white/80 hover:text-white transition-colors flex items-center gap-1"
              >
                {item.label}
                {item.badge && (
                  <span className="px-1.5 py-0.5 bg-red-500 text-[9px] font-bold rounded">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Post Property Button */}
            <Link
              to="/admin/property/new"
              className="hidden md:inline-flex items-center px-4 py-1.5 bg-[#009587] text-white text-sm font-medium rounded hover:bg-[#00857a] transition-colors"
            >
              Post property <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded text-[10px]">FREE</span>
            </Link>

            {/* Help */}
            <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* User */}
            <Link 
              to={user ? "/admin" : "/login"}
              className="flex items-center gap-1 text-sm hover:text-white/80 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <ChevronDown className="w-3 h-3" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden w-8 h-8 flex items-center justify-center"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#0b2239] border-t border-white/10"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center justify-between"
                >
                  {item.label}
                  {item.badge && (
                    <span className="px-1.5 py-0.5 bg-red-500 text-[9px] font-bold rounded">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
              <Link
                to="/admin/property/new"
                onClick={() => setIsMenuOpen(false)}
                className="mt-2 px-4 py-3 bg-[#009587] text-white text-sm font-medium rounded-lg text-center"
              >
                Post property FREE
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header99acres;
