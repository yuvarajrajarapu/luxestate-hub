import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import property1 from '@/assets/properties/property-1.jpg';
import property2 from '@/assets/properties/property-2.jpg';
import property3 from '@/assets/properties/property-3.jpg';

const categories = [
  {
    title: 'Residential Apartment',
    count: '14,000+',
    label: 'Properties',
    href: '/properties?category=flat-for-sale',
    image: property1,
    bgColor: 'bg-amber-50',
  },
  {
    title: 'Residential Land',
    count: '11,000+',
    label: 'Properties',
    href: '/land/plot',
    image: property2,
    bgColor: 'bg-blue-50',
  },
  {
    title: 'Independent House/ Villa',
    count: '5,600+',
    label: 'Properties',
    href: '/properties?category=house-for-sale',
    image: property3,
    bgColor: 'bg-emerald-50',
  },
];

const CategoryCards = () => {
  return (
    <section className="py-10 md:py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            Apartments, Villas and more
          </h2>
          <p className="text-muted-foreground text-sm mt-1">in India</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Link
                to={category.href}
                className={`block rounded-xl overflow-hidden ${category.bgColor} hover:shadow-xl transition-all duration-300 group relative h-[320px] md:h-[380px]`}
              >
                {/* Content */}
                <div className="p-6 relative z-10">
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-1">
                    {category.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    <span className="font-semibold text-foreground/80">{category.count}</span>
                    {' '}{category.label}
                  </p>
                </div>

                {/* Image */}
                <div className="absolute bottom-0 right-0 w-[85%] h-[65%]">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover rounded-tl-xl group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Hover Arrow */}
                <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCards;
