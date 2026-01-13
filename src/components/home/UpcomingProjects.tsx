import { motion } from 'framer-motion';
import { Phone, Play } from 'lucide-react';

interface UpcomingProject {
  id: string;
  name: string;
  builder: string;
  location: string;
  videoUrl?: string;
  image: string;
}

const mockProjects: UpcomingProject[] = [
  {
    id: '1',
    name: 'ASBL Landmark',
    builder: 'ASBL',
    location: 'Kukatpally, Hyderabad',
    image: '/placeholder.svg'
  }
];

const UpcomingProjects = () => {
  return (
    <section className="py-8 bg-secondary">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h2 className="section-title">Upcoming Projects</h2>
          <p className="section-subtitle">Visit these projects and get early bird benefits</p>
        </div>

        {/* Project Card */}
        {mockProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-xl overflow-hidden h-[300px] md:h-[400px]"
          >
            {/* Background Video/Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${project.image})` }}
            />
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <button className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                <Play className="w-8 h-8 text-white" fill="white" />
              </button>
            </div>
            
            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-end justify-between">
                <div className="text-white">
                  <h3 className="text-xl md:text-2xl font-bold mb-1">{project.name}</h3>
                  <p className="text-gray-300">{project.location}</p>
                </div>
                
                <div className="text-right text-white">
                  <p className="text-sm text-gray-300 mb-2">
                    Interested in this project by {project.builder}?
                  </p>
                  <button className="px-6 py-2 bg-white text-foreground font-medium rounded-lg flex items-center gap-2 hover:bg-gray-100 transition-colors">
                    <Phone className="w-4 h-4" />
                    View Number
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default UpcomingProjects;
