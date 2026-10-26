import type { Treatment } from '../types';
import { useI18n } from '../i18n/I18nContext';
import { getTreatmentImage, categoryFallbackImage } from '../lib/imageOverrides';

interface TreatmentCardProps {
  treatment: Treatment;
  onBook: (treatment: Treatment) => void;
}

export default function TreatmentCard({ treatment, onBook }: TreatmentCardProps) {
  const { t, tt } = useI18n();
  return (
    <div className="treatment-card flex h-full w-[220px] min-w-[220px] max-w-[220px] flex-none flex-col">
      <div className="relative">
        <img
          src={getTreatmentImage(treatment.name, treatment.image_url, treatment.category_name)}
          alt={tt(treatment.name)}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            const fb = categoryFallbackImage(treatment.category_name);
            if (!e.currentTarget.src.endsWith(fb)) e.currentTarget.src = fb;
          }}
          className="w-full h-44 object-cover brightness-105 saturate-105"
        />
        {/* Info icon */}
        <button className="absolute top-2 right-2 w-6 h-6 rounded-full bg-purple-700 text-white flex items-center justify-center text-xs font-bold hover:bg-purple-800 transition-colors">
          i
        </button>
      </div>
      <div className="flex flex-1 flex-col p-3">
        <h3 className="mb-1 min-h-[40px] font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
          {tt(treatment.name)}
        </h3>
        <p className="mb-2 min-h-[16px] text-gray-500 text-xs">{tt(treatment.category_name)}</p>
        <p className="mb-3 min-h-[20px] text-purple-700 font-bold text-sm">
          ₹{Number(treatment.price).toFixed(2)}
        </p>
        <button
          onClick={() => onBook(treatment)}
          className="mt-auto min-h-[36px] w-full bg-purple-700 px-3 py-2 text-white text-xs font-semibold leading-tight rounded-full hover:bg-purple-800 transition-colors uppercase tracking-wide"
        >
          {t('bookAppointment')}
        </button>
      </div>
    </div>
  );
}
