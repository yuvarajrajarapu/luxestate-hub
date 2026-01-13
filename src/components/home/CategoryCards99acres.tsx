import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useRef } from 'react';

interface CategoryCard {
  title: string;
  subtitle?: string;
  count: string;
  image: string;
  href: string;
  bgColor: string;
  textColor: string;
}

const categories: CategoryCard[] = [
  {
    title: 'Residential',
    subtitle: 'Apartment',
    count: '13,000+ Properties',
    image: '/placeholder.svg',
    href: '/properties?category=flat-for-sale',
    bgColor: 'bg-gradient-to-b from-[#e8f4fc] to-[#d0e8f7]',
    textColor: 'text-[#0078db]'
  },
  {
    title: 'Residential',
    subtitle: 'Land',
    count: '9,400+ Properties',
    image: '/placeholder.svg',
    href: '/properties?category=land-for-sale',
    bgColor: 'bg-gradient-to-b from-[#f5ebe0] to-[#e8dccf]',
    textColor: 'text-[#8b6914]'
  },
  {
    title: 'Independent',
    subtitle: 'House/ Villa',
    count: '4,700+ Properties',
    image: '/placeholder.svg',
    href: '/properties?category=house-for-sale',
    bgColor: 'bg-gradient-to-b from-[#e0f5f0] to-[#c7ebe3]',
    textColor: 'text-[#00897b]'
  }
];

const CategoryCards99acres = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="pb-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="relative">
          <div 
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
          >
            {categories.map((category, index) => (
              <motion.div
                key={category.title + category.subtitle}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 w-[220px] md:w-[260px]"
              >
                <Link to={category.href}>
                  <div className={`${category.bgColor} rounded-xl overflow-hidden h-[280px] md:h-[320px] relative group transition-transform hover:-translate-y-1 duration-300`}>
                    {/* Content */}
                    <div className="p-4">
                      <h3 className={`text-xl font-bold ${category.textColor}`}>
                        {category.title}
                      </h3>
                      {category.subtitle && (
                        <h4 className={`text-xl font-bold ${category.textColor}`}>
                          {category.subtitle}
                        </h4>
                      )}
                      <p className="text-sm text-gray-600 mt-2">{category.count}</p>
                    </div>
                    
                    {/* Image at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-[180px]">
                      <img 
                        src={category.image} 
                        alt={category.title}
                        className="w-full h-full object-cover object-bottom"
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Scroll Arrow */}
          <button className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10 hidden md:flex">
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategoryCards99acres;
