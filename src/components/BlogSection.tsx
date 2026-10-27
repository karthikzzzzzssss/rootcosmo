import { ArrowRight, Calendar, Tag } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';

const px = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800`;

const BLOG_URL = 'https://rootcosmo.com/';

// Mirrors rootcosmo.com's "Our Recent Blog Posts" section. Full articles live on
// the main site, so the links open there.
const POSTS = [
  {
    title: 'Overview of Prosthodontics',
    img: px(6627524),
    excerpt:
      'Prosthodontics is a specialized field of dentistry that focuses on the diagnosis, treatment planning, and restoration of damaged or missing teeth.',
  },
  {
    title: 'Overview of Periodontics',
    img: px(31786502),
    excerpt:
      'Periodontics is a specialized field of dentistry that focuses on the prevention, diagnosis, and treatment of gum disease and the structures around teeth.',
  },
  {
    title: 'Overview of Pedodontics',
    img: px(8413334),
    excerpt:
      'Pedodontics, also known as pediatric dentistry, is a branch of dentistry that focuses on the dental care and oral health of children.',
  },
  {
    title: 'Overview of Orthodontics',
    img: px(19879741),
    excerpt:
      'Orthodontics is a specialized field of dentistry focused on diagnosing, preventing, and correcting misaligned teeth and jaws.',
  },
];

export default function BlogSection() {
  const { t } = useI18n();

  return (
    <section className="py-12 px-4 bg-gray-50" id="blog">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title text-gray-900">Our Recent Blog Posts</h2>
          <a
            href={BLOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 font-bold text-sm tracking-widest hover:text-purple-700 transition-colors uppercase"
          >
            {t('viewAll')}
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {POSTS.map((post) => (
            <a
              key={post.title}
              href={BLOG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="relative overflow-hidden">
                <img
                  src={post.img}
                  alt={post.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-center gap-3 mb-2 text-[11px] text-gray-500">
                  <span className="inline-flex items-center gap-1"><Tag size={12} className="text-purple-600" /> Dentistry</span>
                  <span className="inline-flex items-center gap-1"><Calendar size={12} className="text-purple-600" /> 15 Oct 2023</span>
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-1.5 group-hover:text-purple-700 transition-colors">
                  {post.title}
                </h3>
                <p className="mb-3 flex-1 text-gray-500 text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
                <span className="mt-auto inline-flex items-center gap-1 text-purple-700 text-xs font-semibold uppercase tracking-wide">
                  Continue reading <ArrowRight size={13} />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
