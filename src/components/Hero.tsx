import { Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { HERO_DESCRIPTION } from '../i18n/dbTranslations';
import CountUp from './CountUp';

interface HeroProps {
  onBookAppointment: () => void;
  onExplore: () => void;
}

export default function Hero({ onBookAppointment, onExplore }: HeroProps) {
  const { t, lang } = useI18n();
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background:
          'radial-gradient(circle at 75% 25%, rgba(196, 167, 232, 0.45), transparent 38%), linear-gradient(135deg, #4a0e7a 0%, #6d28d9 52%, #3d0a5e 100%)',
        minHeight: '92vh',
      }}
    >
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.5'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 lg:px-6 flex flex-col lg:flex-row items-center min-h-[92vh] py-10 lg:py-0">
        {/* Left content */}
        <div className="lg:w-[54%] z-10 py-8 lg:py-20">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-5">
            <Sparkles size={14} className="text-yellow-300" />
            <p className="text-purple-100 text-xs font-medium tracking-wide">
              {t('heroBadge')}
            </p>
          </div>

          <h1 className="text-white font-extrabold leading-[1.1] mb-6">
            <span className="block text-3xl md:text-4xl lg:text-[2.9rem]">{t('heroTitle1')}</span>
            <span className="block text-3xl md:text-4xl lg:text-[2.9rem]">
              {t('heroTitle2')} <span className="text-yellow-300">{t('heroTitleHighlight')}</span>
            </span>
          </h1>

          <p className="text-purple-100/90 text-sm md:text-[15px] leading-relaxed mb-8 max-w-xl">
            {HERO_DESCRIPTION[lang] ?? HERO_DESCRIPTION.en}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center gap-3 mb-10">
            <button
              onClick={onBookAppointment}
              className="inline-flex items-center gap-2 bg-yellow-400 text-black font-bold text-sm px-6 py-3.5 rounded-full shadow-lg hover:bg-yellow-300 hover:shadow-xl transition-all duration-200 active:scale-95"
            >
              <Calendar size={17} />
              {t('bookAppointment')}
            </button>
            <button
              onClick={onExplore}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/25 text-white font-medium text-sm px-5 sm:px-6 py-3 sm:py-3.5 rounded-full hover:bg-white/20 active:scale-95 active:bg-white/25 transition-all duration-200 touch-manipulation select-none"
            >
              <span className="truncate">{t('exploreTreatments')}</span>
              <ArrowRight size={16} className="flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 md:gap-10">
            <div>
              <p className="text-white text-3xl md:text-4xl font-extrabold leading-none"><CountUp end={7} suffix="+" /></p>
              <p className="text-purple-200/80 text-[11px] font-medium tracking-widest uppercase mt-1.5">{t('yearsExperience')}</p>
            </div>
            <div className="h-12 w-px bg-white/20" />
            <div>
              <p className="text-white text-3xl md:text-4xl font-extrabold leading-none"><CountUp end={17} suffix="k+" /></p>
              <p className="text-purple-200/80 text-[11px] font-medium tracking-widest uppercase mt-1.5">{t('happyPatients')}</p>
            </div>
            <div className="h-12 w-px bg-white/20" />
            <div>
              <p className="text-white text-3xl md:text-4xl font-extrabold leading-none"><CountUp end={33} suffix="k+" /></p>
              <p className="text-purple-200/80 text-[11px] font-medium tracking-widest uppercase mt-1.5">{t('treatments')}</p>
            </div>
          </div>
        </div>

        {/* Right — doctor image, seamlessly blended into the background */}
        <div className="lg:w-[46%] flex justify-center lg:justify-end items-end h-full relative">
          <div className="relative w-full max-w-md lg:max-w-none flex items-end justify-center lg:justify-end">
            {/* Atmospheric glow behind the doctor */}
            <div className="absolute right-[8%] bottom-[12%] w-72 h-72 md:w-[420px] md:h-[420px] rounded-full bg-fuchsia-300/25 blur-3xl" />
            <div className="absolute right-[14%] bottom-[8%] w-[68%] h-[64%] rounded-full bg-white/12 blur-[80px]" />

            <img
              src="/hero-doctor.webp"
              alt="Smiling doctor"
              className="relative z-10 w-full max-w-[480px] h-[400px] lg:h-[92vh] object-contain object-bottom brightness-105 saturate-[0.92] contrast-[0.96]"
              style={{
                filter:
                  'drop-shadow(0 0 22px rgba(255,255,255,0.42)) drop-shadow(0 18px 48px rgba(57,20,92,0.3))',
                maskImage:
                  'radial-gradient(ellipse 58% 64% at 48% 50%, black 62%, rgba(0,0,0,0.7) 78%, transparent 100%)',
                WebkitMaskImage:
                  'radial-gradient(ellipse 58% 64% at 48% 50%, black 62%, rgba(0,0,0,0.7) 78%, transparent 100%)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Decorative plant in bottom-left */}
      <img
        src="/hero-plant.webp"
        alt=""
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-28 md:w-40 lg:w-48 z-0 opacity-90 pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to right, black 70%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, black 70%, transparent 100%)',
        }}
      />
    </section>
  );
}
