import { Link } from 'react-router-dom';
import { User, MapPin, ChevronRight, Building } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ContinueBrowsing99acres = () => {
  const { user } = useAuth();

  return (
    <section className="py-6 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left - Continue Browsing */}
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-4">Continue browsing...</p>
            
            <div className="flex items-center gap-3 mb-6">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium shadow-sm hover:shadow transition-shadow">
                <Building className="w-4 h-4 text-[#0078db]" />
                Buy in Hyderabad
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-gray-300 transition-colors">
                <MapPin className="w-4 h-4" />
                Explore New City
              </button>
            </div>

            {/* Category Title */}
            <div className="mb-4">
              <h2 className="text-xl font-bold text-[#0b2239]">Apartments, Villas and more</h2>
              <p className="text-sm text-gray-500">in Hyderabad</p>
            </div>
          </div>

          {/* Right - User Card */}
          <div className="lg:w-80">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {/* User Header */}
              <div className="p-4 bg-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <span className="font-medium text-gray-700">Guest User</span>
              </div>
              
              {/* Activity Section */}
              <div className="px-4 py-3 border-t border-gray-100">
                <p className="text-sm text-[#0078db] font-medium mb-2">Your Recent Activity</p>
                <p className="text-sm text-gray-500 mb-4">
                  No activity yet! Start browsing properties and projects and track them from here.
                </p>
                
                {!user && (
                  <Link
                    to="/login"
                    className="block w-full py-2.5 bg-[#0078db] text-white text-sm font-medium text-center rounded hover:bg-[#0066c0] transition-colors"
                  >
                    LOGIN / REGISTER
                  </Link>
                )}
                <p className="text-xs text-center text-gray-400 mt-2">
                  to access all the features on 99acres
                </p>
              </div>
              
              {/* Post Property Banner */}
              <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 border-t border-gray-100 flex items-center gap-3">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-sm">
                    Sell or rent faster at the right price!
                  </p>
                  <p className="text-xs text-gray-600 mb-2">List your property now</p>
                  <Link
                    to="/admin/property/new"
                    className="inline-block px-4 py-2 bg-[#009587] text-white text-xs font-medium rounded hover:bg-[#00857a] transition-colors"
                  >
                    Post Property, It's FREE
                  </Link>
                </div>
                <div className="w-16 h-20 flex-shrink-0">
                  {/* Placeholder for agent illustration */}
                  <div className="w-full h-full bg-orange-200 rounded-lg flex items-center justify-center">
                    <User className="w-8 h-8 text-orange-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContinueBrowsing99acres;
