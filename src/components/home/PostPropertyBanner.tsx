import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

const PostPropertyBanner = () => (
  <section className="py-8 bg-gradient-to-r from-orange-500 to-orange-600">
    <div className="container mx-auto px-4 text-center text-white">
      <h2 className="text-2xl font-bold mb-2">Sell or rent faster at the right price!</h2>
      <p className="mb-6">Your perfect buyer is waiting, list your property now</p>
      <div className="flex items-center justify-center gap-4">
        <Link to="/admin/property/new" className="px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors">
          Post Property, It's FREE
        </Link>
        <button className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors">
          <MessageCircle className="w-5 h-5" /> Post via Whatsapp
        </button>
      </div>
    </div>
  </section>
);

export default PostPropertyBanner;
