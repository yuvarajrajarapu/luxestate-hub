import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img
                src="/favicon-clipped.png"
                alt=""
                width={40}
                height={40}
                className="h-10 w-10 rounded-lg bg-white p-1 object-contain"
              />
              <span className="font-display text-xl font-bold">UMY Infra</span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Your trusted partner in finding the perfect property. Explore homes, 
              plots, commercial spaces, and more across India's prime locations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li>
                <Link to="/" className="hover:text-primary-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/properties" className="hover:text-primary-foreground transition-colors">
                  All Properties
                </Link>
              </li>
              <li>
                <Link to="/properties?type=sale" className="hover:text-primary-foreground transition-colors">
                  Properties for Sale
                </Link>
              </li>
              <li>
                <Link to="/properties?type=rent" className="hover:text-primary-foreground transition-colors">
                  Properties for Rent
                </Link>
              </li>
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h4 className="font-semibold mb-4">Property Types</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li>
                <Link to="/properties?category=flat-for-sale" className="hover:text-primary-foreground transition-colors">
                  Flats & Apartments
                </Link>
              </li>
              <li>
                <Link to="/properties?category=house-for-sale" className="hover:text-primary-foreground transition-colors">
                  Houses & Villas
                </Link>
              </li>
              <li>
                <Link to="/properties?category=land-for-sale" className="hover:text-primary-foreground transition-colors">
                  Land & Plots
                </Link>
              </li>
              <li>
                <Link to="/properties?category=commercial-space-for-rent-lease" className="hover:text-primary-foreground transition-colors">
                  Commercial Spaces
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+91 90596 11547</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@umyinfra.in</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>Kakinada, Andhra Pradesh, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center text-sm text-primary-foreground/50">
          <p>© {currentYear} UMY Infra. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
