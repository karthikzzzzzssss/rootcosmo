import { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';
import { useI18n } from '../i18n/I18nContext';

export default function ProductsSection({ onViewAll }: { onViewAll: () => void }) {
  const { t, tt } = useI18n();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .order('created_at')
      .then(({ data, error }) => {
        if (!error && data) setProducts(data);
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-12 px-4 bg-white" id="products">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title text-gray-900">{t('findOurBestProducts')}</h2>
          <button
            onClick={onViewAll}
            className="text-gray-700 font-bold text-sm tracking-widest hover:text-purple-700 transition-colors uppercase cursor-pointer"
          >
            {t('viewAll')}
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-56 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.map(product => (
              <div
                key={product.id}
                className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={tt(product.name)}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded-full">
                      {tt(product.category)}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{tt(product.name)}</h3>
                  <p className="text-purple-700 font-bold text-base mb-3">₹{Number(product.price).toFixed(2)}</p>
                  <button className="w-full flex items-center justify-center gap-2 bg-purple-700 text-white text-xs font-semibold py-2.5 rounded-full hover:bg-purple-800 transition-colors uppercase tracking-wide">
                    <ShoppingCart size={13} />
                    {t('addToCart')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
