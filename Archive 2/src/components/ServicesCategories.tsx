import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Category } from '../types';
import { useI18n } from '../i18n/I18nContext';
import { getCategoryImage } from '../lib/imageOverrides';

interface ServicesCategoriesProps {
  onNavigate: (slug: string) => void;
}

export default function ServicesCategories({ onNavigate }: ServicesCategoriesProps) {
  const { t, tCategoryName } = useI18n();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .order('created_at')
      .then(({ data, error }) => {
        if (!error && data) setCategories(data);
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-12 px-4 bg-white" id="services">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title text-gray-900">{t('popularCategory')}</h2>
          <button
            onClick={() => onNavigate('dental-care')}
            className="text-gray-700 font-bold text-sm tracking-widest hover:text-purple-700 transition-colors uppercase"
          >
            {t('viewAll')}
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg aspect-square mb-2" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
                <div className="h-3 bg-gray-100 rounded w-1/2 mx-auto mt-1" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => onNavigate(cat.slug)}
                className="group text-center hover:scale-105 transition-transform duration-200"
              >
                <div className="relative overflow-hidden rounded-lg aspect-square mb-3 shadow-sm">
                  <img
                    src={getCategoryImage(cat.slug, cat.image_url)}
                    alt={cat.name}
                    className="w-full h-full object-cover brightness-105 saturate-105 group-hover:scale-110 group-hover:brightness-110 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
                <p className="font-bold text-gray-900 text-xs md:text-sm uppercase tracking-wide">{tCategoryName(cat.slug)}</p>
                <p className="text-gray-500 text-xs mt-0.5">{cat.service_count} {t('services')}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
