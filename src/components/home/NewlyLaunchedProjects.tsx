import { motion } from 'framer-motion';
import { Phone, TrendingUp } from 'lucide-react';

interface NewProject {
  id: string;
  name: string;
  location: string;
  bhk: string;
  priceRange: string;
  appreciation: string;
  image: string;
  isRera: boolean;
}

const mockProjects: NewProject[] = [
  {
    id: '1',
    name: 'Casagrand Evon',
    location: 'Kompally, Hyderabad',
    bhk: '3, 4 BHK Apart..',
    priceRange: '₹1.64 - 2.23 Cr',
    appreciation: '6.5% price increase in last 3 months',
    image: '/placeholder.svg',
    isRera: true
  },
  {
    id: '2',
    name: 'ASBL Landmark',
    location: 'Kukatpally, Hyderabad',
    bhk: '3, 4 BHK Apart..',
    priceRange: '₹1.75 - 3.04 Cr',
    appreciation: '10.9% price increase in last 1 year',
    image: '/placeholder.svg',
    isRera: true
  },
  {
    id: '3',
    name: 'My Home Mangala',
    location: 'Kondapur, Hyderabad',
    bhk: '3, 4 BHK Apart..',
    priceRange: '₹2.10 - 3.50 Cr',
    appreciation: '8.2% price increase in last 6 months',
    image: '/placeholder.svg',
    isRera: true
  }
];

const NewlyLaunchedProjects = () => {
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h2 className="section-title">Newly launched projects</h2>
          <p className="section-subtitle">Limited launch offers available</p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="border border-border rounded-lg overflow-hidden hover:shadow-card-hover transition-shadow"
            >
              {/* Top Section */}
              <div className="flex">
                {/* Image */}
                <div className="w-32 h-28 relative flex-shrink-0">
                  <img 
                    src={project.image} 
                    alt={project.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 badge-new-launch text-[10px]">
                    NEW LAUNCH
                  </span>
                </div>
                
                {/* Info */}
                <div className="p-3 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {project.isRera && (
                      <span className="badge-rera text-[10px]">RERA</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-foreground mb-1 text-sm">
                    {project.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-1">{project.location}</p>
                  <p className="text-sm font-semibold text-foreground">{project.priceRange}</p>
                  <p className="text-xs text-muted-foreground">{project.bhk}</p>
                </div>
              </div>
              
              {/* Appreciation */}
              <div className="px-3 py-2 bg-green-50 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <p className="text-xs text-green-700">{project.appreciation}</p>
              </div>
              
              {/* Actions */}
              <div className="p-3 border-t border-border flex items-center gap-2">
                <button className="flex-1 py-2 border border-primary text-primary text-sm font-medium rounded hover:bg-primary/5 transition-colors flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" />
                  View Number
                </button>
                <button className="flex-1 py-2 bg-accent text-white text-sm font-medium rounded hover:bg-accent/90 transition-colors">
                  Get preferred options
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Get preferred options <span className="text-primary font-medium">@zero brokerage</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewlyLaunchedProjects;
