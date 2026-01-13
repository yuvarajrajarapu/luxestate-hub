import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface CategoryCard {
  title: string;
  count: string;
  image: string;
  href: string;
}

const categories: CategoryCard[] = [
  {
    title: 'Residential Apartment',
    count: '9,400+ Properties',
    image: '/placeholder.svg',
    href: '/properties?category=flat-for-sale'
  },
  {
    title: 'Residential Land',
    count: '5,200+ Properties',
    image: '/placeholder.svg',
    href: '/properties?category=land-for-sale'
  },
  {
    title: 'Independent House/ Villa',
    count: '4,700+ Properties',
    image: '/placeholder.svg',
    href: '/properties?category=house-for-sale'
  }
];

const ApartmentsVillasMore = () => {
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={category.href}>
                <div className="category-card relative h-48 rounded-xl overflow-hidden group">
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${category.image})` }}
                  />
                  
                  {/* Overlay */}
                  <div className="category-overlay absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-lg font-semibold mb-1">{category.title}</h3>
                    <p className="text-sm text-white/80">{category.count}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ApartmentsVillasMore;
