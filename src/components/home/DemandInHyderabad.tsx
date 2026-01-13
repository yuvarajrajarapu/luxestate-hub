import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface LocalityData {
  rank: number;
  name: string;
  searchShare: string;
}

interface DemandCategory {
  title: string;
  subtitle: string;
  localities: LocalityData[];
  href: string;
}

const demandData: DemandCategory[] = [
  {
    title: 'Apartment',
    subtitle: 'Most searched localities for Flat/Apartment',
    localities: [
      { rank: 1, name: 'Old Mumbai Highway', searchShare: '7%' },
      { rank: 2, name: 'Manikonda', searchShare: '5%' },
      { rank: 3, name: 'Narsingi', searchShare: '4%' },
      { rank: 4, name: 'Kokapet', searchShare: '3%' },
      { rank: 5, name: 'Tellapur', searchShare: '3%' },
    ],
    href: '/properties?category=flat-for-sale'
  },
  {
    title: 'Plots',
    subtitle: 'Most searched societies for Plots',
    localities: [
      { rank: 1, name: 'Hayathnagar', searchShare: '2%' },
      { rank: 2, name: 'Narsingi', searchShare: '2%' },
      { rank: 3, name: 'Old Mumbai Highway', searchShare: '2%' },
      { rank: 4, name: 'Shankarpally', searchShare: '2%' },
      { rank: 5, name: 'Kollur', searchShare: '1%' },
    ],
    href: '/properties?category=land-for-sale'
  },
  {
    title: 'Builder Floor',
    subtitle: 'Most searched societies',
    localities: [
      { rank: 1, name: 'Old Mumbai Highway', searchShare: '5%' },
      { rank: 2, name: 'Outer ring road', searchShare: '4%' },
      { rank: 3, name: 'Narsingi', searchShare: '3%' },
      { rank: 4, name: 'Bachupally', searchShare: '3%' },
      { rank: 5, name: 'Kokapet', searchShare: '2%' },
    ],
    href: '/properties?category=house-for-sale'
  }
];

const DemandInHyderabad = () => {
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h2 className="section-title">Demand in Hyderabad</h2>
          <p className="section-subtitle">Where are buyers searching in Hyderabad</p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {demandData.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="border border-border rounded-lg overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 bg-secondary">
                <h3 className="font-semibold text-foreground">{category.title}</h3>
                <p className="text-xs text-muted-foreground">{category.subtitle}</p>
              </div>
              
              {/* Localities List */}
              <div className="p-4">
                {category.localities.map((locality) => (
                  <div key={locality.rank} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">#{locality.rank}</span>
                      <span className="text-sm text-foreground">{locality.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{locality.searchShare} Searches</span>
                  </div>
                ))}
              </div>
              
              {/* View All */}
              <div className="p-4 border-t border-border">
                <Link to={category.href} className="text-sm text-primary font-medium">
                  View all 5 Localities
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feedback */}
        <div className="mt-6 flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Is this helpful?</span>
          <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ThumbsUp className="w-4 h-4" /> Yes
          </button>
          <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ThumbsDown className="w-4 h-4" /> No
          </button>
        </div>
      </div>
    </section>
  );
};

export default DemandInHyderabad;
