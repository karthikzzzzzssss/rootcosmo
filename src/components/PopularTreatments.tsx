import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Treatment } from '../types';
import TreatmentCarousel from './TreatmentCarousel';
import { useI18n } from '../i18n/I18nContext';

interface PopularTreatmentsProps {
  onBook: (treatment: Treatment) => void;
  onBookAppointment: () => void;
  onViewAll: () => void;
}

export default function PopularTreatments({ onBook, onBookAppointment, onViewAll }: PopularTreatmentsProps) {
  const { t } = useI18n();
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('treatments')
      .select('*')
      .eq('is_popular', true)
      .order('created_at')
      .then(({ data, error }) => {
        if (!error && data) setTreatments(data);
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-12 px-4 bg-gray-50 overflow-hidden" id="popular">
      <div className="max-w-7xl mx-auto">
        {/* Book now CTA */}
        <div className="mb-8">
          <button
            onClick={onBookAppointment}
            className="bg-purple-700 text-white font-semibold text-sm px-6 py-3 rounded-full hover:bg-purple-800 transition-colors uppercase tracking-wide"
          >
            {t('bookYourAppointmentNow')}
          </button>
        </div>

        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title text-gray-900">{t('ourMostPopularTreatments')}</h2>
          <button
            onClick={onViewAll}
            className="text-gray-700 font-bold text-sm tracking-widest hover:text-purple-700 transition-colors uppercase cursor-pointer"
          >
            {t('viewAll')}
          </button>
        </div>

        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-[220px] min-w-[220px] flex-none animate-pulse">
                <div className="bg-gray-200 rounded-lg h-44 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
                <div className="h-3 bg-gray-100 rounded w-1/2 mb-2" />
                <div className="h-8 bg-gray-200 rounded-full" />
              </div>
            ))}
          </div>
        ) : (
          <TreatmentCarousel treatments={treatments} onBook={onBook} />
        )}
      </div>
    </section>
  );
}
