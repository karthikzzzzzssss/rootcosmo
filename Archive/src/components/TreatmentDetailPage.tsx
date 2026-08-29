import { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Check, Clock, Shield, Star, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Treatment } from '../types';
import { useI18n } from '../i18n/I18nContext';

interface TreatmentDetailPageProps {
  treatmentName: string;
  onBack: () => void;
  onBook: (treatment: Treatment) => void;
  onNavigate: (slug: string) => void;
}

const FALLBACK_IMAGE = '/images/services/face-aesthetics/Image_28-06-26_at_12.57_PM.png';

export default function TreatmentDetailPage({ treatmentName, onBack, onBook, onNavigate }: TreatmentDetailPageProps) {
  const { t, tt, tCategoryName } = useI18n();
  const [treatment, setTreatment] = useState<Treatment | null>(null);
  const [related, setRelated] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTreatment(null);
    setRelated([]);

    supabase
      .from('treatments')
      .select('*')
      .ilike('name', treatmentName)
      .limit(1)
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          const found = data[0];
          setTreatment(found);
          supabase
            .from('treatments')
            .select('*')
            .eq('category_name', found.category_name)
            .neq('id', found.id)
            .limit(4)
            .order('is_popular', { ascending: false })
            .then(({ data: rel }) => {
              if (rel) setRelated(rel);
              setLoading(false);
            });
        } else {
          // Try partial match — the menu child name may be a variant of a DB treatment
          supabase
            .from('treatments')
            .select('*')
            .ilike('name', `%${treatmentName.split(' ')[0]}%`)
            .limit(1)
            .then(({ data: partial }) => {
              if (partial && partial.length > 0) {
                const found = partial[0];
                setTreatment(found);
                supabase
                  .from('treatments')
                  .select('*')
                  .eq('category_name', found.category_name)
                  .neq('id', found.id)
                  .limit(4)
                  .order('is_popular', { ascending: false })
                  .then(({ data: rel2 }) => {
                    if (rel2) setRelated(rel2);
                    setLoading(false);
                  });
              } else {
                // No DB match — create a fallback treatment object from the URL name
                setTreatment({
                  id: '',
                  name: treatmentName,
                  category_id: null,
                  category_name: '',
                  price: 0,
                  image_url: FALLBACK_IMAGE,
                  description: null,
                  is_popular: false,
                  is_premier: false,
                  created_at: '',
                } as Treatment);
                setLoading(false);
              }
            });
        }
      });
  }, [treatmentName]);

  if (loading) {
    return (
      <div className="min-h-screen bg-purple-50/40 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-purple-200 border-t-purple-700 animate-spin" />
          <p className="text-gray-500 text-sm">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!treatment) {
    return (
      <div className="min-h-screen bg-purple-50/40 flex flex-col items-center justify-center gap-6 px-4">
        <p className="text-gray-600 text-lg font-medium">Treatment not found</p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 bg-purple-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-purple-800 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>
      </div>
    );
  }

  const categorySlug = treatment.category_name
    ? treatment.category_name
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    : '';

  const benefits = [
    'Performed by certified specialists',
    'Personalized treatment plan',
    'Advanced medical-grade technology',
    'Comprehensive aftercare support',
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero section */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            'radial-gradient(circle at 72% 28%, rgba(196,167,232,0.40), transparent 40%), linear-gradient(120deg, #3d0a5e 0%, #5b0fa8 48%, #6d28d9 100%)',
        }}
      >
        <div className="absolute inset-0">
          <img
            src={treatment.image_url}
            alt={tt(treatment.name)}
            className="absolute right-0 top-0 h-full w-full lg:w-[50%] object-cover object-center"
            style={{
              opacity: 0.7,
              maskImage: 'linear-gradient(to left, black 40%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to left, black 40%, transparent 100%)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#3d0a5e]/90 via-[#3d0a5e]/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-6 py-10 md:py-16 min-h-[420px] flex flex-col justify-center">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors text-sm font-medium w-fit"
          >
            <ArrowLeft size={18} />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-2 mb-4 text-sm">
            {categorySlug && (
              <>
                <button
                  onClick={() => onNavigate(categorySlug)}
                  className="text-purple-200 hover:text-white transition-colors font-medium"
                >
                  {tCategoryName(categorySlug)}
                </button>
                <ChevronRight size={14} className="text-purple-300/60" />
              </>
            )}
            <span className="text-white/80">{tt(treatment.name)}</span>
          </div>

          <h1 className="text-white font-extrabold leading-[1.05] mb-4 text-3xl md:text-4xl lg:text-5xl drop-shadow-lg max-w-2xl">
            {tt(treatment.name)}
          </h1>

          <p className="text-purple-100/90 text-sm md:text-base leading-relaxed max-w-xl mb-6">
            {treatment.description ?? `Professional ${tt(treatment.name)} at RootCosmo Clinic, delivered by expert specialists using advanced technology.`}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => onBook(treatment)}
              className="inline-flex items-center gap-2 bg-yellow-400 text-black font-bold text-sm px-6 py-3.5 rounded-full shadow-lg hover:bg-yellow-300 hover:shadow-xl transition-all duration-200 active:scale-95"
            >
              <Calendar size={17} />
              {t('bookAppointment')}
            </button>
            {Number(treatment.price) > 0 && (
              <div className="flex items-center gap-1.5 text-white">
                <span className="text-3xl font-extrabold">
                  ₹{Number(treatment.price).toFixed(2)}
                </span>
                <span className="text-purple-200/80 text-xs uppercase tracking-widest font-medium ml-1">
                  starting from
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-purple-50/40 pointer-events-none" />
      </section>

      {/* Content section */}
      <div className="bg-purple-50/40">
        <div className="max-w-7xl mx-auto px-4 py-10 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6 md:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About this treatment</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {treatment.description ?? `Our ${tt(treatment.name)} is a specialized procedure${categorySlug ? ` in our ${tCategoryName(categorySlug)} category` : ''}, designed to deliver safe, effective results. At RootCosmo Clinic, our experienced specialists use state-of-the-art technology to ensure optimal outcomes tailored to your needs.`}
                </p>

                <h3 className="text-base font-bold text-gray-900 mb-3">What's included</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {benefits.map(b => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                        <Check size={12} className="text-green-600" />
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={16} className="text-purple-600" />
                    <span>Consultation included</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield size={16} className="text-purple-600" />
                    <span>Safety-certified protocols</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Star size={16} className="text-purple-600" />
                    <span>Expert specialists</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6 sticky top-24">
                <h3 className="font-bold text-gray-900 text-base mb-1">Book this treatment</h3>
                <p className="text-gray-500 text-xs mb-4">Schedule your appointment with our specialists</p>
                <div className="border-b-2 border-dashed border-gray-200 mb-4" />

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Treatment</span>
                    <span className="text-gray-900 font-medium text-right">{tt(treatment.name)}</span>
                  </div>
                  {categorySlug && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Category</span>
                      <span className="text-gray-900 font-medium">{tCategoryName(categorySlug)}</span>
                    </div>
                  )}
                  {Number(treatment.price) > 0 && (
                    <div className="flex justify-between items-center text-sm pt-3 border-t border-gray-100">
                      <span className="text-gray-500">Starting price</span>
                      <span className="text-purple-700 font-bold text-lg">
                        ₹{Number(treatment.price).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => onBook(treatment)}
                  className="w-full bg-purple-700 text-white text-sm font-bold py-3 rounded-full hover:bg-purple-800 transition-colors uppercase tracking-widest"
                >
                  {t('bookAppointment')}
                </button>

                {categorySlug && (
                  <button
                    onClick={() => onNavigate(categorySlug)}
                    className="w-full mt-3 text-purple-700 text-sm font-medium py-2.5 rounded-full hover:bg-purple-50 transition-colors"
                  >
                    View all {tCategoryName(categorySlug)}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Related treatments */}
          {related.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold text-gray-900 mb-5">Related treatments</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {related.map(r => (
                  <div
                    key={r.id}
                    className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 group"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={r.image_url}
                        alt={tt(r.name)}
                        className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-gray-900 text-xs leading-snug mb-1 line-clamp-2">
                        {tt(r.name)}
                      </h3>
                      <p className="text-purple-700 font-bold text-sm mb-2">
                        ₹{Number(r.price).toFixed(2)}
                      </p>
                      <button
                        onClick={() => onBook(r)}
                        className="w-full bg-purple-700 text-white text-[10px] font-bold py-2 rounded-full hover:bg-purple-800 transition-colors uppercase tracking-widest"
                      >
                        {t('bookAppointment')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
