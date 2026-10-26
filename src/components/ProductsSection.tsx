import { ArrowRight } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';

const px = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800`;

// Four product categories, mirroring rootcosmo.com's "Find Our Best Products
// By Category" section. "Shop Now" takes the visitor to the related services.
const PRODUCT_CATEGORIES = [
  {
    title: 'Dental Care Products',
    desc: 'Smile Bolder, Shine Bolder: Discover Your Dental Care Essentials Today!',
    img: px(8669541),
    slug: 'dental-care',
  },
  {
    title: 'Skin Care Products',
    desc: 'Unveil Your Radiance: Discover Skin Care Secrets for a Glowing You!',
    img: px(9774854),
    slug: 'face-aesthetics',
  },
  {
    title: 'Body Care Products',
    desc: 'Elevate Your Body Ritual: Discover Luxurious Care for Every Inch!',
    img: px(9775219),
    slug: 'medifacials',
  },
  {
    title: 'Hair Care Products',
    desc: 'Nourish, Strengthen, Grow: Embrace Vibrant Hair with Our Hair Care Products!',
    img: px(8484212),
    slug: 'hair-care',
  },
];

export default function ProductsSection({ onNavigate }: { onNavigate: (slug: string) => void }) {
  const { t } = useI18n();

  return (
    <section className="py-12 px-4 bg-white" id="products">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title text-gray-900">{t('findOurBestProducts')}</h2>
          <button
            onClick={() => onNavigate('dental-care')}
            className="text-gray-700 font-bold text-sm tracking-widest hover:text-purple-700 transition-colors uppercase cursor-pointer"
          >
            {t('viewAll')}
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {PRODUCT_CATEGORIES.map((c) => (
            <div
              key={c.title}
              className="group flex flex-col bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="relative overflow-hidden">
                <img
                  src={c.img}
                  alt={c.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="font-bold text-gray-900 text-base mb-1.5">{c.title}</h3>
                <p className="mb-4 flex-1 text-gray-500 text-sm leading-relaxed">{c.desc}</p>
                <button
                  onClick={() => onNavigate(c.slug)}
                  className="mt-auto inline-flex items-center gap-1.5 self-start bg-purple-700 px-5 py-2.5 text-white text-xs font-semibold rounded-full hover:bg-purple-800 transition-colors uppercase tracking-wide"
                >
                  Shop Now <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
