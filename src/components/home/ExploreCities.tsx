import { Link } from 'react-router-dom';

const cities = [
  { name: 'Delhi/NCR', count: '180,000+' },
  { name: 'Bangalore', count: '52,000+' },
  { name: 'Pune', count: '38,000+' },
  { name: 'Chennai', count: '36,000+' },
  { name: 'Mumbai', count: '42,000+' },
  { name: 'Hyderabad', count: '29,000+' },
  { name: 'Kolkata', count: '32,000+' },
  { name: 'Ahmedabad', count: '22,000+' },
];

const ExploreCities = () => (
  <section className="py-8 bg-secondary">
    <div className="container mx-auto px-4">
      <h2 className="section-title mb-6">Explore Real Estate in Popular Indian Cities</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cities.map((c) => (
          <Link key={c.name} to={`/properties?city=${c.name}`} className="p-4 bg-white rounded-lg border border-border hover:border-primary transition-colors">
            <h3 className="font-semibold">{c.name}</h3>
            <p className="text-sm text-muted-foreground">{c.count} Properties</p>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default ExploreCities;
