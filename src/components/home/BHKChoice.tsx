import { Link } from 'react-router-dom';

const bhks = [
  { label: '1 RK/1 BHK', count: '610+', href: '/properties?bhk=1' },
  { label: '2 BHK', count: '6,400+', href: '/properties?bhk=2' },
  { label: '3 BHK', count: '8,300+', href: '/properties?bhk=3' },
];

const BHKChoice = () => (
  <section className="py-8 bg-secondary">
    <div className="container mx-auto px-4">
      <h2 className="section-title mb-2">BHK choice in mind?</h2>
      <p className="section-subtitle mb-6">Browse by no. of bedrooms in the house</p>
      <div className="grid grid-cols-3 gap-4">
        {bhks.map((b) => (
          <Link key={b.label} to={b.href} className="p-6 bg-white rounded-lg border border-border hover:border-primary transition-colors text-center">
            <h3 className="font-semibold text-lg mb-1">{b.label}</h3>
            <p className="text-sm text-muted-foreground">{b.count} Properties</p>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default BHKChoice;
