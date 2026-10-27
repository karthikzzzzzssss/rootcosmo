import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, Clock } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { FOOTER_LINKS, FOOTER_SERVICES } from '../i18n/dbTranslations';

const QUICK_LINK_ACTIONS: Record<string, { type: 'category'; slug: string } | { type: 'scroll'; id: string }> = {
  'About Us':         { type: 'scroll',   id: 'about' },
  'Dental Services':  { type: 'category', slug: 'dental-care' },
  'Skin Aesthetics':  { type: 'category', slug: 'face-aesthetics' },
  'Hair Care':        { type: 'category', slug: 'hair-care' },
  'Lip Aesthetics':   { type: 'category', slug: 'lip-aesthetics' },
  'Laser Treatments': { type: 'category', slug: 'laser-treatment' },
  'MediFacials':      { type: 'category', slug: 'medifacials' },
  // No standalone gallery section exists; point to the visual Premier Treatments showcase.
  'Gallery':          { type: 'scroll',   id: 'premier' },
  // The footer itself carries the contact details (id="contact" below).
  'Contact':          { type: 'scroll',   id: 'contact' },
};

// Official RootCosmo profiles and location (from rootcosmo.com).
const SOCIAL_LINKS = {
  facebook:  'https://www.facebook.com/rootcosmo',
  instagram: 'https://www.instagram.com/rootcosmo',
  youtube:   'https://www.youtube.com/channel/UCv_Ox5OtN952Y4KoqZNrMcQ',
};
const MAPS_URL = 'https://maps.app.goo.gl/q9ew1fuTEh4BnYLE8';

const SERVICE_TREATMENT_NAMES: Record<string, string> = {
  'Laser Flap Surgeries':  'Laser Flap Surgeries',
  'Teeth Whitening':       'Teeth Whitening (Bleaching)',
  'Dental Implants':       'Dental Implants',
  'Lip Rejuvenation':      'Lip Rejuvenation',
  'Hydrafacial':           'Hydrafacial',
  'GFC Treatment':         'GFC (Growth Factor Concentrate) for Hair',
  'Acne Scars Treatment':  'Acne Scars Treatment',
  'Skin Tightening':       'Skin Tightening',
  'Laser Hair Removal':    'Laser Hair Removal',
};

// Full service lists per category, mirroring rootcosmo.com's footer.
const SERVICE_COLUMNS: { title: string; slug: string; items: string[] }[] = [
  { title: 'Dental', slug: 'dental-care', items: ['Apicoectomy', 'Dental Bridges & Crowns', 'Dental Cleanings', 'Dental Fillings', 'Dental Implants', 'Dental Sealants', 'Dental Veneers'] },
  { title: 'Skin Aesthetics', slug: 'face-aesthetics', items: ['Acne (Pimples) Treatment', 'Acne Scars Treatment', 'Anti-Aging Treatment', 'Botox Injections', 'Carbon Peel', 'Chemical Peels', 'Dark Circles'] },
  { title: 'MediFacials', slug: 'medifacials', items: ['Body Polishing', 'Crystal MDM', 'Hydrafacial', 'Oxygen Facial', 'Vampire Facial'] },
  { title: 'Hair Aesthetics', slug: 'hair-care', items: ['Anti-Dandruff Treatment', 'GFC for Hair', 'Hair Transplantation', 'Hair Loss Treatments', 'Laser Hair Therapy', 'Mesotherapy for Hair', 'PRP Therapy for Hair'] },
  { title: 'Lip Aesthetics', slug: 'lip-aesthetics', items: ['Lip Rejuvenation', 'Lip Fillers', 'Lip Pigmentation'] },
  { title: 'Laser Treatment', slug: 'laser-treatment', items: ['Laser Scar Reduction', 'Laser Hair Reduction', 'Laser Skin Resurfacing', 'Laser Tattoo Removal', 'Laser Toning'] },
];

interface FooterProps {
  onNavigate: (slug: string) => void;
  onNavigateTreatment: (name: string) => void;
  onHome: () => void;
}

export default function Footer({ onNavigate, onNavigateTreatment, onHome }: FooterProps) {
  const { t, lang } = useI18n();

  const englishQuickLinks = FOOTER_LINKS.en;
  const englishServices = FOOTER_SERVICES.en;

  // Scroll to a home-page section. If it isn't in the DOM (we're on a category or
  // treatment page), go home first, then scroll once the section has rendered.
  const scrollToSection = (id: string) => {
    const existing = document.getElementById(id);
    if (existing) {
      existing.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    onHome();
    let tries = 0;
    const tick = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else if (tries++ < 30) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const handleQuickLink = (index: number) => {
    const action = QUICK_LINK_ACTIONS[englishQuickLinks[index]];
    if (!action) return;
    if (action.type === 'category') {
      onNavigate(action.slug);
    } else {
      scrollToSection(action.id);
    }
  };

  const handleService = (index: number) => {
    const treatmentName = SERVICE_TREATMENT_NAMES[englishServices[index]];
    if (treatmentName) onNavigateTreatment(treatmentName);
  };
  return (
    <footer
      id="contact"
      className="text-gray-300 pt-14 pb-6"
      style={{ background: 'linear-gradient(135deg, #1a0030 0%, #2d0060 100%)' }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8">
                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4C14 4 10 9 10 14C10 20 14 24 20 28C26 24 30 20 30 14C30 9 26 4 20 4Z" fill="white" opacity="0.9"/>
                  <path d="M14 14C14 14 16 20 20 24C24 20 26 14 26 14" stroke="#c026d3" strokeWidth="2" fill="none"/>
                  <circle cx="20" cy="14" r="3" fill="#c026d3"/>
                </svg>
              </div>
              <div>
                <span className="text-white font-bold text-lg">Root</span>
                <span className="text-yellow-400 font-bold text-lg">Cosmo</span>
              </div>
            </div>
            <p className="text-purple-300 text-xs tracking-wide mb-4">
              {t('navTagline')}
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('footerDesc')}
            </p>
            <div className="flex gap-3 mt-5">
              <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" aria-label="RootCosmo on Facebook" className="w-8 h-8 rounded-full bg-purple-800 flex items-center justify-center hover:bg-purple-600 transition-colors">
                <Facebook size={15} />
              </a>
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label="RootCosmo on Instagram" className="w-8 h-8 rounded-full bg-purple-800 flex items-center justify-center hover:bg-purple-600 transition-colors">
                <Instagram size={15} />
              </a>
              <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" aria-label="RootCosmo on YouTube" className="w-8 h-8 rounded-full bg-purple-800 flex items-center justify-center hover:bg-purple-600 transition-colors">
                <Youtube size={15} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5 border-b border-purple-700 pb-2">
              {t('quickLinks')}
            </h3>
            <ul className="space-y-2">
              {(FOOTER_LINKS[lang] ?? FOOTER_LINKS.en).map((link, i) => (
                <li key={i}>
                  <button
                    onClick={() => handleQuickLink(i)}
                    className="text-gray-400 text-sm hover:text-yellow-300 transition-colors flex items-center gap-1.5 text-left"
                  >
                    <span className="text-purple-500">&rsaquo;</span>
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5 border-b border-purple-700 pb-2">
              {t('ourServices')}
            </h3>
            <ul className="space-y-2">
              {(FOOTER_SERVICES[lang] ?? FOOTER_SERVICES.en).map((s, i) => (
                <li key={i}>
                  <button
                    onClick={() => handleService(i)}
                    className="text-gray-400 text-sm hover:text-yellow-300 transition-colors flex items-center gap-1.5 text-left"
                  >
                    <span className="text-purple-500">&rsaquo;</span>
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5 border-b border-purple-700 pb-2">
              {t('contactUs')}
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="text-gray-400 text-sm hover:text-yellow-300 transition-colors">{t('hyderabad')}</a>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-yellow-400 flex-shrink-0" />
                <a href="tel:+917842370707" className="text-gray-400 text-sm hover:text-yellow-300 transition-colors">
                  {t('phone')}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-yellow-400 flex-shrink-0" />
                <a href="mailto:care@rootcosmo.com" className="text-gray-400 text-sm hover:text-yellow-300 transition-colors">
                  {t('email')}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-gray-400 text-sm">
                  <p>{t('monSatShort')}</p>
                  <p>{t('sunShort')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services by category — mirrors rootcosmo.com */}
        <div className="border-t border-purple-800/60 pt-10 mb-10">
          <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Explore RootCosmo</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {SERVICE_COLUMNS.map((col) => (
              <div key={col.title}>
                <button
                  onClick={() => onNavigate(col.slug)}
                  className="text-white font-semibold text-sm mb-3 hover:text-yellow-300 transition-colors text-left"
                >
                  {col.title}
                </button>
                <ul className="space-y-1.5">
                  {col.items.map((item) => (
                    <li key={item}>
                      <button
                        onClick={() => onNavigateTreatment(item)}
                        className="text-gray-400 text-xs hover:text-yellow-300 transition-colors text-left"
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      onClick={() => onNavigate(col.slug)}
                      className="mt-1 text-purple-300 text-xs font-semibold hover:text-yellow-300 transition-colors text-left"
                    >
                      View All Services
                    </button>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-purple-800/60 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} {t('allRightsReserved')}</p>
          <div className="flex gap-4">
            <button onClick={() => scrollToSection('about')} className="hover:text-gray-300 transition-colors">{t('privacyPolicy')}</button>
            <button onClick={() => scrollToSection('about')} className="hover:text-gray-300 transition-colors">{t('termsOfService')}</button>
            <button onClick={() => scrollToSection('services')} className="hover:text-gray-300 transition-colors">{t('sitemap')}</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
