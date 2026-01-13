import { TrendingUp } from 'lucide-react';

const data = [
  { locality: 'Lakdikapul', rate: '₹79,800/sq.ft', yield: '1%', yoy: '62.0%' },
  { locality: 'Kamalaprasad Nagar', rate: '₹6,600/sq.ft', yield: 'NA', yoy: '55.3%' },
  { locality: 'Panjagutta', rate: '₹10,300/sq.ft', yield: 'NA', yoy: '49.3%' },
  { locality: 'Ghatkesar', rate: '₹2,050/sq.ft', yield: 'NA', yoy: '36.7%' },
  { locality: 'Somajiguda', rate: '₹13,650/sq.ft', yield: '1%', yoy: '36.5%' },
];

const TopGainers = () => (
  <section className="py-8 bg-white">
    <div className="container mx-auto px-4">
      <h2 className="section-title mb-6">Top Gainers across Hyderabad</h2>
      <div className="overflow-x-auto">
        <table className="acres-table w-full">
          <thead><tr><th>Locality</th><th>Rate on 99acres</th><th>Rental Yield</th><th>Price Trends</th></tr></thead>
          <tbody>
            {data.map((r) => (
              <tr key={r.locality}>
                <td className="font-medium">{r.locality}</td>
                <td>{r.rate}</td>
                <td>{r.yield}</td>
                <td><span className="flex items-center gap-1 text-green-600"><TrendingUp className="w-4 h-4" />{r.yoy} YoY</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

export default TopGainers;
