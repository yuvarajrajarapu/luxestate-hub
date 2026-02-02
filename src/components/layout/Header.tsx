import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, ChevronDown, Home, Building2, MapPin, Store, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
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
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleDropdown = (categoryTitle: string) => {
    setOpenDropdowns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryTitle)) {
        newSet.delete(categoryTitle);
      } else {
        newSet.add(categoryTitle);
      }
      return newSet;
    });
  };

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href.split('?')[0]);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const landSubItems = [
    { label: 'Plot for Sale', href: '/land/plot' },
    { label: 'Agriculture Land', href: '/land/agricultural' },
    { label: 'Farmhouse for Sale', href: '/land/farm-houses?type=sale' },
    { label: 'Farmhouse for Rent', href: '/land/farm-houses?type=rent' },
  ];

  const menuCategories = [
    {
      title: 'Buy',
      icon: Home,
      mainLink: '/properties?type=sale',
      items: [
        { label: 'Flats & Apartments', href: '/properties?category=flat-for-sale' },
        { label: 'Houses & Villas', href: '/properties?category=house-for-sale' },
        { label: 'Land & Plots', href: '/properties?category=land-for-sale' },
      ]
    },
    {
      title: 'Rent',
      icon: Building2,
      mainLink: '/properties?type=rent',
      items: [
        { label: 'Flats & Apartments', href: '/properties?category=flat-for-rent' },
        { label: 'Houses', href: '/properties?category=house-for-rent' },
      ]
    },
    {
      title: 'Land',
      icon: MapPin,
      mainLink: '/properties?category=land-for-sale',
      items: [
        { label: 'Plot for Sale', href: '/land/plot' },
        { label: 'Agriculture Land', href: '/land/agricultural' },
        { label: 'Farmhouse for Sale', href: '/land/farm-houses?type=sale' },
        { label: 'Farmhouse for Rent', href: '/land/farm-houses?type=rent' },
      ]
    },
    {
      title: 'Commercial',
      icon: Store,
      mainLink: '/properties?category=commercial-space-for-rent-lease',
      items: [
        { label: 'Office Space', href: '/properties?category=office-for-rent-lease' },
        { label: 'Commercial Space', href: '/properties?category=commercial-space-for-rent-lease' },
      ]
    },
    {
      title: 'PG',
      icon: Users,
      mainLink: '/properties?type=rent&category=pg-boys',
      items: [
        { label: 'Men\'s PG', href: '/properties?category=pg-boys' },
        { label: 'Women\'s PG', href: '/properties?category=pg-girls' },
      ]
    }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="Logo" className="h-12" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              to="/properties?type=sale"
              className={`text-sm transition-colors ${
                location.search.includes('type=sale')
                  ? 'text-gray-900 font-medium'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Buy
            </Link>

            <Link
              to="/properties?type=rent"
              className={`text-sm transition-colors ${
                location.search.includes('type=rent')
                  ? 'text-gray-900 font-medium'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Rent
            </Link>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger 
                    className={`text-sm bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent px-0 h-auto ${
                      location.pathname.startsWith('/land')
                        ? 'text-gray-900 font-medium'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Land
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="w-48 p-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                      {landSubItems.map((item) => (
                        <li key={item.href}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={item.href}
                              className={`block px-4 py-3 text-sm rounded-md transition-colors hover:bg-gray-100 ${
                                isActive(item.href)
                                  ? 'text-gray-900 font-medium'
                                  : 'text-gray-700'
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

            <Link
              to="/properties?category=commercial"
              className={`text-sm transition-colors ${
                location.search.includes('category=commercial')
                  ? 'text-gray-900 font-medium'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Commercial
            </Link>
          </nav>

          {/* Right side - Auth */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Auth Button */}
            {user ? (
              <Link to="/profile">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-9 w-9 rounded-full hover:bg-gray-100"
                >
                  <User className="w-7 h-7 text-gray-900" />
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button className="h-9 px-6 bg-gray-900 hover:bg-gray-800 text-white rounded-full text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Log in
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-900" />
            ) : (
              <Menu className="w-6 h-6 text-gray-900" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 max-h-[calc(100vh-64px)] overflow-y-auto">
            <nav className="flex flex-col gap-1">
              {menuCategories.map((category) => {
                const Icon = category.icon;
                const isDropdownOpen = openDropdowns.has(category.title);
                
                return (
                  <div key={category.title} className="flex flex-col">
                    {/* Category Header - Clickable */}
                    <div className="flex items-center gap-0">
                      <Link
                        to={category.mainLink}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex-1 flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg rounded-r-none transition-colors"
                      >
                        <Icon className="w-5 h-5 text-gray-600" />
                        <span>{category.title}</span>
                      </Link>
                      
                      {/* Dropdown Toggle Button */}
                      <button
                        onClick={() => toggleDropdown(category.title)}
                        className="px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg rounded-l-none border-l border-gray-200 transition-colors"
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                    
                    {/* Dropdown Items */}
                    {isDropdownOpen && (
                      <div className="ml-8 mt-1 flex flex-col gap-1 border-l border-gray-200">
                        {category.items.map((item) => (
                          <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => setIsMenuOpen(false)}
                            className={`px-4 py-2 text-sm transition-colors rounded-lg ${
                              isActive(item.href)
                                ? 'text-gray-900 font-medium bg-gray-100'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              
              <div className="border-t border-gray-200 my-3"></div>
              
              {user ? (
                <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="w-full">
                  <Button className="w-full h-10 bg-gray-900 hover:bg-gray-800 text-white flex items-center gap-2 justify-center rounded-lg">
                    <User className="w-4 h-4" />
                    My Profile
                  </Button>
                </Link>
              ) : (
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full">
                  <Button className="w-full h-10 bg-gray-900 hover:bg-gray-800 text-white flex items-center gap-2 justify-center rounded-lg">
                    <User className="w-4 h-4" />
                    Log in
                  </Button>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
