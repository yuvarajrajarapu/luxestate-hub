const builders = [
  { name: 'Aparna Constructions', total: 61, city: 55 },
  { name: 'ASBL', total: 7, city: 7 },
  { name: 'My Home Group', total: 28, city: 27 },
  { name: 'Rajapushpa Properties', total: 20, city: 20 },
];

const PopularBuilders = () => (
  <section className="py-8 bg-secondary">
    <div className="container mx-auto px-4">
      <h2 className="section-title mb-6">Popular builders in Hyderabad</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {builders.map((b) => (
          <div key={b.name} className="builder-card">
            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center text-2xl font-bold text-primary">{b.name[0]}</div>
            <h4 className="font-semibold text-sm text-center">{b.name}</h4>
            <p className="text-xs text-muted-foreground">{b.total} Total Projects</p>
            <p className="text-xs text-muted-foreground">{b.city} in this city</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default PopularBuilders;
