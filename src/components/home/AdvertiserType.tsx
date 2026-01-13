import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const types = [
  { label: 'Owner', count: '13,000+', href: '/properties?postedBy=owner' },
  { label: 'Dealer', count: '14,000+', href: '/properties?postedBy=dealer' },
  { label: 'Builder', count: '330+', href: '/properties?postedBy=builder' },
];

const AdvertiserType = () => (
  <section className="py-8 bg-white">
    <div className="container mx-auto px-4">
      <h2 className="section-title mb-2">Choose type of advertiser</h2>
      <p className="section-subtitle mb-6">Browse your choice of listing</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {types.map((t) => (
          <Link key={t.label} to={t.href} className="flex items-center justify-between p-4 bg-secondary rounded-lg hover:bg-muted transition-colors">
            <div><h3 className="font-semibold">{t.label}</h3><p className="text-sm text-muted-foreground">{t.count} Properties</p></div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default AdvertiserType;
