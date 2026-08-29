import { CheckCircle2 } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import type { TranslationKey } from '../i18n/translations';

interface WhyChooseUsProps {
  onBookAppointment: () => void;
}

export default function WhyChooseUs({ onBookAppointment }: WhyChooseUsProps) {
  const { t } = useI18n();

  const reasons: TranslationKey[] = ['why1', 'why2', 'why3', 'why4'];

  return (
    <section className="py-14 px-4 bg-white" id="why-us">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start gap-12">
        <div className="lg:w-1/2">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8 leading-tight">
            {t('whyChooseUs')}
          </h2>
          <div className="space-y-4 mb-8">
            {reasons.map((reasonKey, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="text-purple-700 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-gray-700 text-sm leading-relaxed">{t(reasonKey)}</p>
              </div>
            ))}
          </div>
          <button
            onClick={onBookAppointment}
            className="bg-purple-700 text-white font-semibold text-sm px-7 py-3 rounded-full hover:bg-purple-800 transition-colors uppercase tracking-wide"
          >
            {t('bookYourAppointmentNow')}
          </button>
        </div>

        <div className="lg:w-1/2">
          <div className="relative rounded-2xl overflow-hidden shadow-xl">
            <img
              src="https://images.pexels.com/photos/3985163/pexels-photo-3985163.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="RootCosmo medical team"
              className="w-full h-80 lg:h-96 object-cover"
            />
            <div
              className="absolute bottom-0 left-0 right-0 p-6"
              style={{ background: 'linear-gradient(to top, rgba(91,15,168,0.8), transparent)' }}
            >
              <div className="flex gap-6 text-white">
                <div>
                  <p className="text-2xl font-extrabold">7+</p>
                  <p className="text-xs text-purple-200 uppercase tracking-wide">{t('yearsExp')}</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold">17k+</p>
                  <p className="text-xs text-purple-200 uppercase tracking-wide">{t('patients')}</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold">33k+</p>
                  <p className="text-xs text-purple-200 uppercase tracking-wide">{t('treatments')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
