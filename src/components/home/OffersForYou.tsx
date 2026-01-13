import { motion } from 'framer-motion';

const offers = [
  { id: '1', name: 'Casagrand Evon', type: '3,4 BHK Apartment', price: '₹1.64 - 2.23 Cr', offer: 'Save upto 8.55 L', image: '/placeholder.svg' },
  { id: '2', name: 'Jains Central Park', type: '3 BHK Apartment', price: '₹1.18 - 1.38 Cr', offer: 'Book Now with 6 Lakhs', image: '/placeholder.svg' },
  { id: '3', name: 'Infiniti Counti', type: 'Land', price: '₹30 - 50 Lac', offer: 'Win exciting prizes', image: '/placeholder.svg' },
];

const OffersForYou = () => (
  <section className="py-8 bg-white">
    <div className="container mx-auto px-4">
      <h2 className="section-title mb-6">Offers for you</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {offers.map((offer, i) => (
          <motion.div key={offer.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="border border-border rounded-lg overflow-hidden hover:shadow-card-hover transition-shadow">
            <div className="h-32 bg-muted"><img src={offer.image} alt={offer.name} className="w-full h-full object-cover" /></div>
            <div className="p-4">
              <h3 className="font-semibold">{offer.name}</h3>
              <p className="text-xs text-muted-foreground">{offer.type}</p>
              <p className="font-semibold mt-2">{offer.price}</p>
              <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded">{offer.offer}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default OffersForYou;
