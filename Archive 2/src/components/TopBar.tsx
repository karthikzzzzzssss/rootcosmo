import { useState, useRef, useEffect } from 'react';
import { Phone, Mail, Clock, Facebook, Instagram, Youtube, ChevronDown, Check } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { LANGUAGES, type LangCode } from '../i18n/translations';

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

export default function TopBar() {
  const { lang, setLang, t } = useI18n();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const currentLang = LANGUAGES.find(l => l.code === lang) ?? LANGUAGES[0];

  const handleSelectLang = (code: LangCode) => {
    setLang(code);
    setLangOpen(false);
  };

  return (
    <div className="bg-[#120022] text-white text-xs">
      <div className="max-w-[1400px] mx-auto px-4 flex items-center justify-between h-9 gap-3">
        {/* Left — welcome + hours */}
        <div className="flex items-center gap-4 min-w-0">
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 text-purple-300 flex-shrink-0">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
            </svg>
            <span className="text-gray-300">{t('welcomeTo')} <span className="text-white font-bold">RootCosmo</span></span>
          </span>
          <span className="text-gray-500 hidden sm:block">|</span>
          <span className="hidden sm:flex items-center gap-1.5 whitespace-nowrap text-gray-300">
            <Clock size={11} className="text-purple-300 flex-shrink-0" />
            {t('monSat')}
          </span>
        </div>

        {/* Right — phone, email, language, socials, login */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <a href="tel:+917842370707" className="hidden md:flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors whitespace-nowrap">
            <Phone size={11} className="text-purple-300" />
            {t('phone')}
          </a>
          <a href="mailto:care@rootcosmo.com" className="hidden lg:flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors whitespace-nowrap">
            <Mail size={11} className="text-purple-300" />
            {t('email')}
          </a>

          {/* Language dropdown */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 bg-[#1e0040] border border-purple-800/50 text-white rounded px-2.5 py-0.5 hover:bg-[#2a0050] transition-colors"
            >
              <span>{currentLang.nativeLabel}</span>
              <ChevronDown size={12} className={`text-gray-400 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
            </button>

            {langOpen && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-[#1e0040] border border-purple-700 rounded-lg shadow-xl py-1 z-[60] max-h-80 overflow-y-auto">
                {LANGUAGES.map(l => (
                  <button
                    key={l.code}
                    onClick={() => handleSelectLang(l.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-purple-800/60 transition-colors ${
                      l.code === lang ? 'text-white bg-purple-800/40' : 'text-gray-300'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-sm">{l.nativeLabel}</span>
                      <span className="text-gray-500 text-[10px]">{l.label}</span>
                    </span>
                    {l.code === lang && <Check size={13} className="text-purple-300" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-2 text-gray-400">
            <a href="#" className="hover:text-white transition-colors"><Facebook size={13} /></a>
            <a href="#" className="hover:text-white transition-colors"><Instagram size={13} /></a>
            <a href="#" className="hover:text-white transition-colors"><Youtube size={13} /></a>
            <a href="#" className="hover:text-green-400 transition-colors"><WhatsAppIcon /></a>
          </div>

          {/* Login */}
          <button className="hidden md:flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors whitespace-nowrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            {t('loginRegister')}
          </button>
        </div>
      </div>
    </div>
  );
}
