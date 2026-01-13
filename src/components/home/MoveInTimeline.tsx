import { Link } from 'react-router-dom';

const timelines = [
  { label: 'Ready to Move', count: '2,900+', href: '/properties?possession=ready' },
  { label: 'Possession in 2026', count: '1,000+', href: '/properties?possession=2026' },
  { label: 'Possession in 2027', count: '500+', href: '/properties?possession=2027' },
];

const MoveInTimeline = () => (
  <section className="py-8 bg-secondary">
    <div className="container mx-auto px-4">
      <h2 className="section-title mb-2">Move in now, next year or later</h2>
      <p className="section-subtitle mb-6">Projects based on your preferred possession date</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {timelines.map((t) => (
          <Link key={t.label} to={t.href} className="p-6 bg-white rounded-lg border border-border hover:border-primary transition-colors text-center">
            <h3 className="font-semibold text-lg mb-1">{t.label}</h3>
            <p className="text-sm text-muted-foreground">{t.count} Properties</p>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default MoveInTimeline;
