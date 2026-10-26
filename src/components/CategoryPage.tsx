import { useEffect, useState } from 'react';
import { ArrowLeft, LayoutGrid, List, SlidersHorizontal, Calendar, Sparkles, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Category, Treatment } from '../types';
import { useI18n } from '../i18n/I18nContext';
import { getTreatmentImage, categoryFallbackImage } from '../lib/imageOverrides';

interface CategoryPageProps {
  slug: string;
  categories: Category[];
  onNavigate: (slug: string) => void;
  onBack: () => void;
  onBook: (treatment: Treatment) => void;
}

interface CategoryHero {
  heroImage: string;
  tagline: string;
  description: string;
  highlights: string[];
}

const CATEGORY_META: Record<string, CategoryHero> = {
  'dental-care': {
    heroImage: '/images/services/dental-care/dental-care.jpg',
    tagline: 'Your Perfect Smile Starts Here',
    description:
      'Revitalize your smile at RootCosmo Clinic — from Root Canal to Smile Designing, our expert team is committed to enhancing your oral health and revealing your perfect smile.',
    highlights: ['Smile Designing', 'Dental Implants', 'Root Canal', 'Clear Aligners'],
  },
  'face-aesthetics': {
    heroImage: 'https://images.pexels.com/photos/7581072/pexels-photo-7581072.jpeg?auto=compress&cs=tinysrgb&w=1400',
    tagline: 'Reveal Your Natural Radiance',
    description:
      'Addressing acne to aging, experience Botox rejuvenation, chemical peel transformations, and dermal filler sculpting at RootCosmo. Our skilled team enhances natural beauty with targeted, personalized treatments.',
    highlights: ['Botox', 'Dermal Fillers', 'Chemical Peel', 'Pigmentation'],
  },
  medifacials: {
    heroImage: 'https://images.pexels.com/photos/12115040/pexels-photo-12115040.jpeg?auto=compress&cs=tinysrgb&w=1400',
    tagline: 'Glow From Within',
    description:
      'Revitalize your skin with our Medifacial treatments — from the gentle exfoliation of Body Polishing to the rejuvenating powers of Crystal MDM, Hydrafacial, Oxygeno Facial, and the innovative Vampire Facial.',
    highlights: ['Hydrafacial', 'Vampire Facial', 'Oxygeno Facial', 'Body Polishing'],
  },
  'hair-care': {
    heroImage: 'https://images.pexels.com/photos/28994388/pexels-photo-28994388.jpeg?auto=compress&cs=tinysrgb&w=1400',
    tagline: 'Restore. Regrow. Revive.',
    description:
      'Revitalize your hair with our advanced treatments, from Anti-Dandruff solutions to transformative Hair Transplantation. Explore the latest in technology, including Laser Hair Therapy and GFC treatments.',
    highlights: ['Hair Transplant', 'GFC Therapy', 'Anti-Dandruff', 'Mesotherapy'],
  },
  'lip-aesthetics': {
    heroImage: 'https://images.pexels.com/photos/7290206/pexels-photo-7290206.jpeg?auto=compress&cs=tinysrgb&w=1400',
    tagline: 'Perfect Your Pout',
    description:
      'Revitalize your lips with our Lip Rejuvenation treatments. Achieve the perfect pout with Lip Fillers or enhance your natural lip color with our expert Lip Pigmentation Treatment.',
    highlights: ['Lip Fillers', 'Lip Pigmentation', 'Lip Rejuvenation'],
  },
  'laser-treatment': {
    heroImage: 'https://images.pexels.com/photos/4586726/pexels-photo-4586726.jpeg?auto=compress&cs=tinysrgb&w=1400',
    tagline: 'Precision. Clarity. Confidence.',
    description:
      'Advanced laser technology for permanent hair removal, skin resurfacing, pigmentation correction, and precision surgical procedures at RootCosmo Clinic.',
    highlights: ['Laser Hair Removal', 'CO2 Laser', 'Skin Resurfacing', 'Q-Switch Laser'],
  },
};

type GridSize = 2 | 3 | 4;

export default function CategoryPage({ slug, categories, onNavigate, onBack, onBook }: CategoryPageProps) {
  const { t, tt, tCategoryName, tCategoryDesc } = useI18n();
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [gridSize, setGridSize] = useState<GridSize>(4);
  const [sortBy, setSortBy] = useState('latest');

  const currentCat = categories.find(c => c.slug === slug);

  const slugToCategoryName = (s: string): string => {
    const map: Record<string, string> = {
      'dental-care': 'Dental Care',
      'face-aesthetics': 'Face Aesthetics',
      'medifacials': 'MediFacials',
      'hair-care': 'Hair Care',
      'lip-aesthetics': 'Lip Aesthetics',
      'laser-treatment': 'Laser Treatment',
    };
    return map[s] ?? s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };
  const meta = CATEGORY_META[slug] ?? {
    heroImage: 'https://images.pexels.com/photos/7581072/pexels-photo-7581072.jpeg?auto=compress&cs=tinysrgb&w=1400',
    tagline: '',
    description: '',
    highlights: [],
  };

  useEffect(() => {
    setLoading(true);
    const categoryName = currentCat?.name ?? slugToCategoryName(slug);
    let query = supabase
      .from('treatments')
      .select('*')
      .eq('category_name', categoryName);

    if (sortBy === 'latest') {
      query = query.order('created_at', { ascending: false });
    } else if (sortBy === 'price-asc') {
      query = query.order('price', { ascending: true });
    } else {
      query = query.order('name', { ascending: true });
    }

    query.then(({ data, error }) => {
      if (!error && data) setTreatments(data);
      setLoading(false);
    });
  }, [slug, currentCat?.name, sortBy]);

  const gridColClass =
    gridSize === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : gridSize === 3
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  const heroImg = meta.heroImage;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner — immersive, full-bleed */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            'radial-gradient(circle at 72% 28%, rgba(196,167,232,0.40), transparent 40%), linear-gradient(120deg, #3d0a5e 0%, #5b0fa8 48%, #6d28d9 100%)',
        }}
      >
        {/* Background image — right side, blended */}
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt={currentCat?.name}
            className="absolute right-0 top-0 h-full w-full lg:w-[58%] object-cover object-center brightness-110 saturate-105 contrast-105"
            style={{
              opacity: 0.85,
              maskImage: 'linear-gradient(to left, black 50%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to left, black 50%, transparent 100%)',
            }}
          />
          {/* Dark overlay for text contrast — lighter to let image shine */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#3d0a5e]/85 via-[#3d0a5e]/30 to-transparent" />
        </div>

        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.5'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-6 py-10 md:py-16 lg:py-20 min-h-[440px] flex flex-col justify-center">
          {/* Back button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors text-sm font-medium w-fit"
          >
            <ArrowLeft size={18} />
            <span>Back to Home</span>
          </button>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-5 w-fit">
            <Sparkles size={14} className="text-yellow-300" />
            <p className="text-purple-100 text-xs font-medium tracking-wide">{meta.tagline}</p>
          </div>

          {/* Title */}
          <h1 className="text-white font-extrabold leading-[1.05] mb-5 text-4xl md:text-5xl lg:text-6xl drop-shadow-lg">
            {tCategoryName(slug)}
          </h1>

          {/* Description */}
          <p className="text-purple-100/90 text-sm md:text-base leading-relaxed max-w-2xl mb-7">
            {tCategoryDesc(slug) || meta.description}
          </p>

          {/* Highlights pills */}
          {meta.highlights.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {meta.highlights.map(h => (
                <span
                  key={h}
                  className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/15 text-white text-xs font-medium px-3.5 py-1.5 rounded-full"
                >
                  <ChevronRight size={12} className="text-yellow-300" />
                  {h}
                </span>
              ))}
            </div>
          )}

          {/* CTA + service count */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#treatments"
              className="inline-flex items-center gap-2 bg-yellow-400 text-black font-bold text-sm px-6 py-3.5 rounded-full shadow-lg hover:bg-yellow-300 hover:shadow-xl transition-all duration-200 active:scale-95"
            >
              <Calendar size={17} />
              {t('bookAppointment')}
            </a>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-extrabold text-white">{currentCat?.service_count ?? 0}</span>
                <span className="text-purple-200/80 text-xs uppercase tracking-widest font-medium">{t('services')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade into content */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-purple-50/40 pointer-events-none" />
      </section>

      {/* Main content */}
      <div className="bg-purple-50/40 min-h-screen" id="treatments">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-5 sticky top-24">
              <h3 className="font-bold text-gray-900 text-base mb-1">{t('findServicesByCategory')}</h3>
              <div className="border-b-2 border-dashed border-gray-300 mb-4" />
              <ul className="space-y-2">
                {categories.map(cat => {
                  const isActive = cat.slug === slug;
                  return (
                    <li key={cat.id}>
                      <button
                        onClick={() => onNavigate(cat.slug)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-150 ${
                          isActive
                            ? 'bg-purple-800 text-white'
                            : 'bg-purple-700 text-white hover:bg-purple-800'
                        }`}
                      >
                        <span>{tCategoryName(cat.slug)}</span>
                        <span
                          className={`text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center ${
                            isActive ? 'bg-white text-purple-800' : 'bg-purple-900 text-white'
                          }`}
                        >
                          {cat.service_count}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          {/* Right — treatment grid */}
          <div className="flex-1">
            {/* Controls bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <p className="text-gray-600 text-sm font-medium">
                {loading ? t('loading') : `${t('showingResults')} ${treatments.length}`}
              </p>

              <div className="flex items-center gap-3 flex-wrap">
                {/* Grid layout toggles */}
                <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1 bg-white">
                  <button
                    onClick={() => setGridSize(2)}
                    className={`p-1.5 rounded ${gridSize === 2 ? 'bg-purple-700 text-white' : 'text-gray-500 hover:text-purple-700'}`}
                    title="2 columns"
                  >
                    <List size={16} />
                  </button>
                  <button
                    onClick={() => setGridSize(3)}
                    className={`p-1.5 rounded ${gridSize === 3 ? 'bg-purple-700 text-white' : 'text-gray-500 hover:text-purple-700'}`}
                    title="3 columns"
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button
                    onClick={() => setGridSize(4)}
                    className={`p-1.5 rounded ${gridSize === 4 ? 'bg-purple-700 text-white' : 'text-gray-500 hover:text-purple-700'}`}
                    title="4 columns"
                  >
                    <SlidersHorizontal size={16} />
                  </button>
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="latest">{t('sortByLatest')}</option>
                  <option value="price-asc">{t('priceLowHigh')}</option>
                  <option value="name">{t('nameAZ')}</option>
                </select>
              </div>
            </div>

            {/* Treatment Cards Grid */}
            {loading ? (
              <div className={`grid ${gridColClass} gap-4`}>
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-white rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-gray-200 h-48" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                      <div className="h-3 bg-gray-100 rounded w-1/3" />
                      <div className="h-9 bg-gray-200 rounded-full mt-3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`grid ${gridColClass} gap-4 md:gap-5`}>
                {treatments.map(treatment => (
                  <div
                    key={treatment.id}
                    className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 group flex flex-col"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={getTreatmentImage(treatment.name, treatment.image_url, treatment.category_name)}
                        alt={tt(treatment.name)}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          const fb = categoryFallbackImage(treatment.category_name);
                          if (!e.currentTarget.src.endsWith(fb)) e.currentTarget.src = fb;
                        }}
                        className="w-full h-48 object-cover brightness-105 saturate-105 group-hover:scale-105 group-hover:brightness-110 transition-all duration-300"
                      />
                      <button className="absolute top-2 right-2 w-7 h-7 rounded-full bg-purple-700 text-white flex items-center justify-center text-xs font-bold hover:bg-purple-800 transition-colors shadow">
                        i
                      </button>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1">
                        {tt(treatment.name)}
                      </h3>
                      <p className="text-gray-400 text-xs mb-2">{tt(treatment.category_name)}</p>
                      <p className="text-purple-700 font-bold text-base mb-3">
                        ₹{Number(treatment.price).toFixed(2)}
                      </p>
                      <button
                        onClick={() => onBook(treatment)}
                        className="mt-auto w-full bg-purple-700 text-white text-xs font-bold py-2.5 rounded-full hover:bg-purple-800 transition-colors uppercase tracking-widest"
                      >
                        {t('bookAppointment')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
