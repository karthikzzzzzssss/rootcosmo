import { useI18n } from '../i18n/I18nContext';

export default function BrandBanner() {
  const { t } = useI18n();
  const images = [
    'https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg?auto=compress&cs=tinysrgb&w=300',
    'https://images.pexels.com/photos/5069432/pexels-photo-5069432.jpeg?auto=compress&cs=tinysrgb&w=300',
    'https://images.pexels.com/photos/3845457/pexels-photo-3845457.jpeg?auto=compress&cs=tinysrgb&w=300',
  ];

  return (
    <section className="relative overflow-hidden py-10 px-4" style={{ background: '#0a0010' }}>
      {/* Decorative purple waves */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 20% 50%, #6d28d9 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, #7c3aed 0%, transparent 50%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Logo area */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4C14 4 10 9 10 14C10 20 14 24 20 28C26 24 30 20 30 14C30 9 26 4 20 4Z" fill="white" opacity="0.9"/>
                <path d="M14 14C14 14 16 20 20 24C24 20 26 14 26 14" stroke="#c026d3" strokeWidth="2" fill="none"/>
                <circle cx="20" cy="14" r="3" fill="#c026d3"/>
              </svg>
            </div>
            <div>
              <span className="text-white font-bold text-2xl">Root</span>
              <span className="text-purple-400 font-bold text-2xl">Cosmo</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm tracking-widest">
            {t('navTagline')}
          </p>
        </div>

        {/* Circular treatment images */}
        <div className="flex items-center gap-4">
          {images.map((src, i) => (
            <div
              key={i}
              className={`rounded-full overflow-hidden border-2 border-purple-500/50 shadow-lg shadow-purple-900/40 ${
                i === 2 ? 'w-32 h-32 md:w-48 md:h-48' : 'w-24 h-24 md:w-36 md:h-36'
              }`}
            >
              <img src={src} alt="Treatment" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
