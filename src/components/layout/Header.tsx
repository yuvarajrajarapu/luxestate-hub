import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, ChevronDown } from 'lucide-react';
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
  const [landDropdownOpen, setLandDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="font-serif text-2xl font-normal text-gray-900">
              UMY Infra
            </span>
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
                  className="h-9 w-9 rounded-full bg-gray-900 hover:bg-gray-800 text-white"
                >
                  <User className="w-5 h-5" />
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
          <div className="lg:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-4">
              <Link
                to="/properties?type=sale"
                onClick={() => setIsMenuOpen(false)}
                className={`text-sm transition-colors ${
                  location.search.includes('type=sale')
                    ? 'text-gray-900 font-medium'
                    : 'text-gray-600'
                }`}
              >
                Buy
              </Link>

              <Link
                to="/properties?type=rent"
                onClick={() => setIsMenuOpen(false)}
                className={`text-sm transition-colors ${
                  location.search.includes('type=rent')
                    ? 'text-gray-900 font-medium'
                    : 'text-gray-600'
                }`}
              >
                Rent
              </Link>

              <div className="flex flex-col">
                <button
                  onClick={() => setLandDropdownOpen(!landDropdownOpen)}
                  className="flex items-center justify-between text-sm text-gray-600 hover:text-gray-900"
                >
                  Land
                  <ChevronDown className={`w-4 h-4 transition-transform ${landDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {landDropdownOpen && (
                  <div className="ml-4 mt-2 flex flex-col gap-2">
                    {landSubItems.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`text-sm transition-colors ${
                          isActive(item.href)
                            ? 'text-gray-900 font-medium'
                            : 'text-gray-600'
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                to="/properties?category=commercial"
                onClick={() => setIsMenuOpen(false)}
                className={`text-sm transition-colors ${
                  location.search.includes('category=commercial')
                    ? 'text-gray-900 font-medium'
                    : 'text-gray-600'
                }`}
              >
                Commercial
              </Link>
              
              <div className="border-t border-gray-200 my-2"></div>
              
              {user ? (
                <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full h-9 bg-gray-900 hover:bg-gray-800 text-white flex items-center gap-2 justify-center">
                    <User className="w-4 h-4" />
                    My Profile
                  </Button>
                </Link>
              ) : (
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full h-9 bg-gray-900 hover:bg-gray-800 text-white flex items-center gap-2 justify-center">
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
