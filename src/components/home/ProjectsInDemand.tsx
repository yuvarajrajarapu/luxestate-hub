import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { useProperties } from '@/hooks/useProperties';

interface DemandProject {
  id: string;
  name: string;
  bhk: string;
  location: string;
  priceRange: string;
  image: string;
  possession?: string;
  isRera?: boolean;
}

const mockProjects: DemandProject[] = [
  {
    id: '1',
    name: 'R One Diamond Towers',
    bhk: '3, 4 BHK Apartment',
    location: 'Financial District, Hyderabad',
    priceRange: '₹2.85 - 4.41 Cr',
    image: '/placeholder.svg',
    possession: 'Dec 2025',
    isRera: true
  },
  {
    id: '2',
    name: 'Mahaveer Crystal Garden',
    bhk: '3, 4 BHK Apartment',
    location: 'Attapur, Hyderabad',
    priceRange: '₹1.29 - 4.31 Cr',
    image: '/placeholder.svg',
    possession: 'Mar 2026',
    isRera: true
  },
  {
    id: '3',
    name: 'Swar Tattyam',
    bhk: '3, 4 BHK Apartment',
    location: 'Padmarao Nagar, Secunderabad',
    priceRange: '₹1.31 - 2.52 Cr',
    image: '/placeholder.svg',
    possession: 'Ready to Move',
    isRera: true
  },
  {
    id: '4',
    name: 'ASBL Landmark',
    bhk: '3, 4 BHK Apartment',
    location: 'Kukatpally, Hyderabad',
    priceRange: '₹1.75 - 3.04 Cr',
    image: '/placeholder.svg',
    possession: 'Jun 2025',
    isRera: true
  }
];

const ProjectsInDemand = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-8 bg-secondary">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title">Projects in High Demand</h2>
            <p className="section-subtitle">The most explored projects in Hyderabad</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full border border-border bg-white flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full border border-border bg-white flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Projects Scroll */}
        <div 
          ref={scrollRef}
          className="scroll-container"
        >
          {mockProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="w-[300px] bg-white rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-shadow"
            >
              {/* Image */}
              <div className="relative h-40">
                <img 
                  src={project.image} 
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
                {project.isRera && (
                  <span className="absolute top-2 left-2 badge-rera">RERA</span>
                )}
                {project.possession && (
                  <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded">
                    {project.possession}
                  </span>
                )}
              </div>
              
              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-1 truncate">
                  {project.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-1">{project.bhk}</p>
                <p className="text-xs text-muted-foreground mb-2">{project.location}</p>
                <p className="font-semibold text-foreground">{project.priceRange}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsInDemand;
