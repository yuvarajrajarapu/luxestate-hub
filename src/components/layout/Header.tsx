import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, ChevronDown, Search, Home, Building2, Key, Briefcase, Store, Users, Fence, Trees } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [landDropdownOpen, setLandDropdownOpen] = useState(false);
  const [pgDropdownOpen, setPgDropdownOpen] = useState(false);
  const { user, userData, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const landSubItems = [
    { label: 'Plot for Sale', href: '/land/plot', icon: Fence },
    { label: 'Agriculture Land', href: '/land/agricultural', icon: Trees },
    { label: 'Farmhouse for Sale', href: '/land/farm-houses?type=sale', icon: Home },
    { label: 'Farmhouse for Rent', href: '/land/farm-houses?type=rent', icon: Key },
  ];

  const buyItems = [
    { label: 'Flats for Sale', href: '/properties?category=flat-for-sale', icon: Building2 },
    { label: 'Houses for Sale', href: '/properties?category=house-for-sale', icon: Home },
  ];

  const rentItems = [
    { label: 'Flats for Rent', href: '/properties?category=flat-for-rent', icon: Building2 },
    { label: 'Houses for Rent', href: '/properties?category=house-for-rent', icon: Home },
  ];

  const commercialItems = [
    { label: 'Office Spaces', href: '/properties?category=office-for-rent-lease', icon: Briefcase },
    { label: 'Commercial Spaces', href: '/properties?category=commercial-space-for-rent-lease', icon: Store },
  ];

  const pgItems = [
    { label: 'PG for Men', href: '/properties?category=pg-hostel-boys', icon: Users },
    { label: 'PG for Women', href: '/properties?category=pg-hostel-girls', icon: Users },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href.split('?')[0]);
  };

  const isLandActive = () => {
    return location.pathname.startsWith('/land');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-luxury flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-xl">Y</span>
              </div>
              <span className="font-display text-xl font-bold text-primary hidden sm:block">
                Yuva InfraEdge
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
            >
              <Link
                to="/properties?type=sale"
                className={`nav-link text-sm ${
                  location.search.includes('type=sale')
                    ? 'text-primary font-semibold'
                    : 'text-muted-foreground'
                }`}
              >
                Buy
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Link
                to="/properties?type=rent"
                className={`nav-link text-sm ${
                  location.search.includes('type=rent')
                    ? 'text-primary font-semibold'
                    : 'text-muted-foreground'
                }`}
              >
                Rent
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger 
                      className={`nav-link text-sm bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent px-0 ${
                        isLandActive()
                          ? 'text-primary font-semibold'
                          : 'text-muted-foreground'
                      }`}
                    >
                      Land
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="w-40 p-2 bg-card border border-border rounded-lg shadow-lg z-50">
                        {landSubItems.map((item) => (
                          <li key={item.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={item.href}
                                className={`block px-4 py-2 text-sm rounded-md transition-colors hover:bg-muted ${
                                  isActive(item.href)
                                    ? 'text-primary font-medium bg-muted'
                                    : 'text-foreground'
                                }`}
                              >
                                {item.label}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link
                to="/properties?type=lease"
                className={`nav-link text-sm ${
                  location.search.includes('type=lease')
                    ? 'text-primary font-semibold'
                    : 'text-muted-foreground'
                }`}
              >
                Commercial
              </Link>
            </motion.div>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">
                      {userData?.username || user.email?.split('@')[0]}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-card border border-border">
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="btn-luxury" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Search & Mobile Menu Buttons */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <Link
              to="/properties"
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Search properties"
            >
              <Search className="w-5 h-5 text-foreground" />
            </Link>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
            className="lg:hidden bg-card border-t border-border max-h-[80vh] overflow-y-auto"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {/* Buy Section */}
              <p className="px-4 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Buy</p>
              {buyItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                    isActive(item.href)
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}

              {/* Rent Section */}
              <p className="px-4 py-1 mt-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rent</p>
              {rentItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                    isActive(item.href)
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
              
              {/* Land with sub-items */}
              <p className="px-4 py-1 mt-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Land & Farmhouse</p>
              <div className="flex flex-col">
                <button
                  onClick={() => setLandDropdownOpen(!landDropdownOpen)}
                  className={`px-4 py-3 rounded-lg transition-colors flex items-center justify-between ${
                    isLandActive()
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Fence className="w-4 h-4" />
                    Land & Farmhouse
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${landDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {landDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-4 mt-1 flex flex-col gap-1"
                    >
                      {landSubItems.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className={`px-4 py-2 rounded-lg transition-colors text-sm flex items-center gap-3 ${
                            isActive(item.href)
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'hover:bg-muted text-muted-foreground'
                          }`}
                        >
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Commercial Section */}
              <p className="px-4 py-1 mt-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Commercial</p>
              {commercialItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                    isActive(item.href)
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}

              {/* PG Section */}
              <p className="px-4 py-1 mt-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">PG & Hostel</p>
              <div className="flex flex-col">
                <button
                  onClick={() => setPgDropdownOpen(!pgDropdownOpen)}
                  className={`px-4 py-3 rounded-lg transition-colors flex items-center justify-between hover:bg-muted`}
                >
                  <span className="flex items-center gap-3">
                    <Users className="w-4 h-4" />
                    PG Accommodation
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${pgDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {pgDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-4 mt-1 flex flex-col gap-1"
                    >
                      {pgItems.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className={`px-4 py-2 rounded-lg transition-colors text-sm flex items-center gap-3 ${
                            isActive(item.href)
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'hover:bg-muted text-muted-foreground'
                          }`}
                        >
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="border-t border-border my-2" />
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-3 rounded-lg hover:bg-muted flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="px-4 py-3 rounded-lg hover:bg-muted flex items-center gap-2 text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-3 rounded-lg hover:bg-muted"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-3 rounded-lg bg-primary text-primary-foreground text-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
