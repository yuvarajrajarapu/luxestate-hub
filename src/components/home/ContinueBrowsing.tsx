import { Link } from 'react-router-dom';
import { User, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const cities = [
  { name: 'Hyderabad', active: true },
  { name: 'Bangalore', active: false },
  { name: 'Mumbai', active: false },
  { name: 'Delhi NCR', active: false },
];

const ContinueBrowsing = () => {
  const { user } = useAuth();

  return (
    <section className="py-6 bg-white border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left - City Selection & Activity */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-4">Continue browsing..</h3>
            
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm font-medium">Buy in Hyderabad</span>
              <button className="text-sm text-primary font-medium flex items-center gap-1">
                Explore New City
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            {/* City Pills */}
            <div className="flex flex-wrap gap-2 mb-6">
              {cities.map((city) => (
                <button
                  key={city.name}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    city.active
                      ? 'bg-primary text-white'
                      : 'bg-secondary text-foreground hover:bg-muted'
                  }`}
                >
                  {city.name}
                </button>
              ))}
            </div>
            
            {/* Recent Activity */}
            <div className="bg-secondary rounded-lg p-4">
              <h4 className="font-semibold mb-2">Your Recent Activity</h4>
              <p className="text-sm text-muted-foreground">
                No activity yet! Start browsing properties and projects and track them from here.
              </p>
            </div>
          </div>

          {/* Right - Guest User Card */}
          <div className="lg:w-80">
            <div className="border border-border rounded-lg overflow-hidden">
              {/* User Section */}
              <div className="p-4 bg-white flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">
                    {user ? 'Welcome back!' : 'Guest User'}
                  </p>
                  {!user && (
                    <div className="flex items-center gap-2 mt-1">
                      <Link to="/login" className="text-sm text-primary font-medium">
                        LOGIN
                      </Link>
                      <span className="text-muted-foreground">/</span>
                      <Link to="/signup" className="text-sm text-primary font-medium">
                        REGISTER
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Post Property Banner */}
              <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 border-t border-border">
                <p className="text-sm text-muted-foreground mb-1">
                  Sell or rent faster at the right price!
                </p>
                <p className="text-sm mb-3">List your property now</p>
                <Link
                  to="/admin/property/new"
                  className="inline-block px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
                >
                  Post Property, It's FREE
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContinueBrowsing;
