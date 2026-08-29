import { useI18n } from '../i18n/I18nContext';

export default function ExpertCare() {
  const { t } = useI18n();
  return (
    <section className="py-14 px-4 bg-white" id="about">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start gap-12">
        <div className="lg:w-1/2">
          <p className="text-purple-700 text-xs font-bold tracking-widest uppercase mb-3">
            {t('expertCare')}
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            {t('expertCareTitle')}
          </h2>
        </div>

        <div className="lg:w-1/2">
          <p className="text-gray-700 text-base leading-relaxed mb-4">
            {t('expertCareDesc')}
          </p>
          <a
            href="#services"
            className="inline-flex items-center gap-1 text-gray-900 font-semibold border-b-2 border-gray-900 pb-0.5 hover:border-purple-700 hover:text-purple-700 transition-colors"
          >
            {t('readMore')} &raquo;
          </a>
        </div>
      </div>
    </section>
  );
}
