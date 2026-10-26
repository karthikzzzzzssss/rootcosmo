import { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, ChevronDown, ChevronRight, Menu, X } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import type { TranslationKey } from '../i18n/translations';
import { TREATMENT_NAMES } from '../i18n/dbTranslations';

const NAV_LINKS: { label: TranslationKey; slug: string | null }[] = [
  { label: 'about', slug: null },
  { label: 'dental', slug: 'dental-care' },
  { label: 'skinAesthetics', slug: 'face-aesthetics' },
  { label: 'mediFacials', slug: 'medifacials' },
  { label: 'hair', slug: 'hair-care' },
  { label: 'lipAesthetics', slug: 'lip-aesthetics' },
  { label: 'laser', slug: 'laser-treatment' },
  { label: 'gallery', slug: null },
];

type MenuItem = string | { name: string; children: string[] };
type MenuGroup = { title: string; items: MenuItem[] };

const MENU_GROUPS: Record<string, MenuGroup[]> = {
  about: [
    {
      title: 'Our Clinic',
      items: [
        { name: 'Our Story', children: ['Founder Dr. Neethu Nanda', 'Our Mission', 'Our Vision'] },
        { name: 'Expert Care', children: ['Qualified Specialists', 'Advanced Technology', 'Safety Standards'] },
        { name: 'Why Choose Us?', children: ['Personalized Care', 'Guaranteed Results', 'Premium Products'] },
      ],
    },
    {
      title: 'RootCosmo Promise',
      items: [
        { name: 'Patient Experience', children: ['Comfort First', 'Transparent Pricing', 'Aftercare Support'] },
        { name: 'Quality & Trust', children: ['Certified Clinic', 'Medical-Grade Products', 'Hygiene Protocols'] },
      ],
    },
  ],
  dental: [
    {
      title: 'Popular Dental Care',
      items: [
        { name: 'Smile Designing', children: ['Hollywood Smile', 'Gummy Smile Correction', 'Digital Smile Design'] },
        'Teeth Whitening (Bleaching)',
        { name: 'Root Canal Treatment', children: ['Single Sitting RCT', 'Laser-Assisted RCT', 'Retreatment RCT'] },
        { name: 'Dental Implants', children: ['Single Tooth Implant', 'All-on-4 Implants', 'All-on-6 Implants'] },
      ],
    },
    {
      title: 'Complete Dental Care',
      items: [
        { name: 'Orthodontics (Braces)', children: ['Metal Braces', 'Ceramic Braces', 'Lingual Braces'] },
        'Clear Aligners (Invisalign)',
        { name: 'Porcelain Veneers', children: ['E-Max Veneers', 'Zirconia Veneers', 'Composite Veneers'] },
        { name: 'Tooth Removal (Extraction)', children: ['Simple Extraction', 'Surgical Extraction', 'Wisdom Tooth Removal'] },
      ],
    },
  ],
  skinAesthetics: [
    {
      title: 'Face Aesthetics',
      items: [
        { name: 'Acne Scars Treatment', children: ['Rolling Scars', 'Boxcar Scars', 'Ice Pick Scars'] },
        { name: 'Anti-Aging Treatment', children: ['Thread Lift', 'PRP for Face', 'Collagen Induction'] },
        { name: 'Dermal Fillers', children: ['Cheek Fillers', 'Nasolabial Fillers', 'Under-Eye Fillers'] },
        'Botox / Anti-Wrinkle Treatment',
      ],
    },
    {
      title: 'Skin Renewal',
      items: [
        { name: 'Chemical Peel', children: ['Glycolic Peel', 'Salicylic Peel', 'TCA Peel'] },
        { name: 'Skin Tightening', children: ['Radiofrequency', 'HIFU', 'Ultrasound'] },
        { name: 'Pigmentation Treatment', children: ['Melasma', 'Dark Spots', 'Freckles'] },
        'Under Eye Dark Circle Reduction',
      ],
    },
  ],
  mediFacials: [
    {
      title: 'Signature Facials',
      items: [
        { name: 'Hydrafacial', children: ['Signature Hydrafacial', 'Platinum Hydrafacial', 'Deluxe Hydrafacial'] },
        { name: 'Vampire Facial', children: ['PRP Facial', 'GFC Facial'] },
        { name: 'Oxygeno Facial', children: ['Oxygen Infusion', 'Oxygeno Plus'] },
      ],
    },
    {
      title: 'Skin Treatments',
      items: [
        { name: 'Crystal Microdermabrasion', children: ['Diamond Tip', 'Crystal Tip'] },
        { name: 'Body Polishing', children: ['Full Body Polish', 'Back Polish', 'Neck & Decollete'] },
      ],
    },
  ],
  hair: [
    {
      title: 'Hair Restoration',
      items: [
        { name: 'Hair Loss Treatment', children: ['Male Pattern Baldness', 'Female Hair Loss', 'Alopecia Areata'] },
        { name: 'Hair Transplantation', children: ['FUE Transplant', 'DHI Transplant', 'Bio-FUE'] },
        'GFC (Growth Factor Concentrate) for Hair',
      ],
    },
    {
      title: 'Hair Wellness',
      items: [
        { name: 'Anti-Dandruff Treatment', children: ['Ketoconazole Therapy', 'Salicylic Scalp Treatment'] },
        { name: 'Laser Hair Therapy', children: ['Low-Level Laser', 'LED Light Therapy'] },
        { name: 'Mesotherapy for Hair', children: ['Vitamin Cocktail', 'DHT Blocker Blend'] },
      ],
    },
  ],
  lipAesthetics: [
    {
      title: 'Lip Treatments',
      items: [
        { name: 'Lip Fillers', children: ['Hyaluronic Acid Fillers', 'Subtle Volume', 'Full Volume'] },
        { name: 'Lip Pigmentation', children: ['Dark Lip Neutralization', 'Lip Lightening'] },
        { name: 'Lip Rejuvenation', children: ['Lip Hydration', 'Fine Line Reduction', 'Lip Border Definition'] },
      ],
    },
  ],
  laser: [
    {
      title: 'Laser Treatments',
      items: [
        { name: 'Laser Hair Removal', children: ['Diode Laser', 'Alexandrite Laser', 'Nd:YAG Laser'] },
        { name: 'Laser Skin Resurfacing', children: ['Ablative Resurfacing', 'Non-Ablative Resurfacing'] },
        { name: 'Fractional CO2 Laser', children: ['Acne Scar Resurfacing', 'Stretch Mark Reduction'] },
      ],
    },
    {
      title: 'Precision Care',
      items: [
        { name: 'Q-Switch Laser for Pigmentation', children: ['Tattoo Removal', 'Pigment Reduction'] },
        { name: 'Laser Flap Surgeries', children: ['Periodontal Laser Surgery', 'Gum Contouring'] },
      ],
    },
  ],
  gallery: [
    {
      title: 'Explore RootCosmo',
      items: [
        { name: 'Our Clinic', children: ['Reception', 'Treatment Rooms', 'Sterilization Area'] },
        { name: 'Treatment Results', children: ['Before & After', 'Patient Testimonials', 'Video Gallery'] },
        { name: 'Patient Stories', children: ['Success Stories', 'Reviews'] },
      ],
    },
    {
      title: 'Discover More',
      items: [
        { name: 'Our Products', children: ['Skincare Range', 'Hair Care Range', 'Dental Care Range'] },
        { name: 'Meet Our Experts', children: ['Dr. Neethu Nanda', 'Our Specialists'] },
        'Contact Us',
      ],
    },
  ],
};

// NAV_KEY_BY_TREATMENT maps treatment names to their nav section (used for future active-state highlighting)
const NAV_KEY_BY_TREATMENT: Record<string, TranslationKey> = {
  'Smile Designing': 'dental',
  'Teeth Whitening (Bleaching)': 'dental',
  'Root Canal Treatment': 'dental',
  'Dental Implants': 'dental',
  'Orthodontics (Braces)': 'dental',
  'Clear Aligners (Invisalign)': 'dental',
  'Porcelain Veneers': 'dental',
  'Tooth Removal (Extraction)': 'dental',
  'Acne Scars Treatment': 'skinAesthetics',
  'Anti-Aging Treatment': 'skinAesthetics',
  'Dermal Fillers': 'skinAesthetics',
  'Botox / Anti-Wrinkle Treatment': 'skinAesthetics',
  'Chemical Peel': 'skinAesthetics',
  'Skin Tightening': 'skinAesthetics',
  'Pigmentation Treatment': 'skinAesthetics',
  'Under Eye Dark Circle Reduction': 'skinAesthetics',
  'Hydrafacial': 'mediFacials',
  'Vampire Facial': 'mediFacials',
  'Oxygeno Facial': 'mediFacials',
  'Crystal Microdermabrasion': 'mediFacials',
  'Body Polishing': 'mediFacials',
  'Hair Loss Treatment': 'hair',
  'Hair Transplantation': 'hair',
  'GFC (Growth Factor Concentrate) for Hair': 'hair',
  'Anti-Dandruff Treatment': 'hair',
  'Laser Hair Therapy': 'hair',
  'Mesotherapy for Hair': 'hair',
  'Lip Fillers': 'lipAesthetics',
  'Lip Pigmentation': 'lipAesthetics',
  'Lip Rejuvenation': 'lipAesthetics',
  'Laser Hair Removal': 'laser',
  'Laser Skin Resurfacing': 'laser',
  'Fractional CO2 Laser': 'laser',
  'Q-Switch Laser for Pigmentation': 'laser',
  'Laser Flap Surgeries': 'laser',
};

const isNested = (item: MenuItem): item is { name: string; children: string[] } =>
  typeof item === 'object' && item !== null;

interface NavbarProps {
  onBookAppointment: () => void;
  onNavigate: (slug: string) => void;
  onNavigateTreatment: (name: string) => void;
  onHome: () => void;
}

export default function Navbar({ onBookAppointment, onNavigate, onNavigateTreatment, onHome }: NavbarProps) {
  const { t, tt } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [mobileMenu, setMobileMenu] = useState<string | null>(null);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleDocumentPointerDown = (event: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) closeAll();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeAll();
    };

    document.addEventListener('pointerdown', handleDocumentPointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handleDocumentPointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  const closeAll = () => {
    setActiveMenu(null);
    setHoveredItem(null);
    setMobileMenu(null);
    setMobileSubmenu(null);
    setMobileOpen(false);
  };

  const handleNavClick = (slug: string | null) => {
    if (slug) onNavigate(slug);
    closeAll();
  };

  const handleTreatmentClick = (name: string) => {
    onNavigateTreatment(name);
    closeAll();
  };

  const navigateToItem = (itemLabel: string) => {
    handleTreatmentClick(itemLabel);
    closeAll();
  };

  const menuItemsFor = (label: TranslationKey) => MENU_GROUPS[label] ?? [];

  const menuItemLabel = (item: string) => TREATMENT_NAMES[item] ? tt(item) : item;

  // Determine which nav section a treatment belongs to (used for active state)
  const getNavKeyForTreatment = (name: string) => NAV_KEY_BY_TREATMENT[name] ?? null;

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-2xl' : ''}`}
      style={{
        background: 'linear-gradient(180deg, #1e0040 0%, #2d0060 60%, #1a0035 100%)',
      }}
    >
      {/* Diagonal stripe decorative overlay */}
      <div
        className="absolute inset-0 opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(120deg, rgba(255,255,255,0) 0px, rgba(255,255,255,0) 18px, rgba(160,80,255,0.6) 18px, rgba(160,80,255,0.6) 20px)',
        }}
      />

      <div className="relative max-w-[1400px] mx-auto px-4">
        {/* Main nav row */}
        <div className="flex items-center gap-4 h-[68px]">
          {/* Logo — left */}
          <button onClick={onHome} className="flex-shrink-0 flex items-start gap-2 group">
            {/* Tooth-style icon */}
            <div className="w-10 h-10 flex-shrink-0 mt-0.5">
              <svg viewBox="0 0 48 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Outer tooth shape */}
                <path
                  d="M10 6C10 6 6 8 6 16C6 22 8 28 10 34C11 38 12 46 14 46C16 46 16 40 18 38C19.5 36 22 35 24 35C26 35 28.5 36 30 38C32 40 32 46 34 46C36 46 37 38 38 34C40 28 42 22 42 16C42 8 38 6 38 6C34 4 30 3 24 3C18 3 14 4 10 6Z"
                  fill="white"
                />
                {/* Inner accent */}
                <path
                  d="M16 14C16 14 18 10 24 10C30 10 32 14 32 14"
                  stroke="#9333ea"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M18 20C18 20 20 17 24 17C28 17 30 20 30 20"
                  stroke="#9333ea"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </div>
            <div className="flex flex-col items-start leading-none">
              <div className="flex items-baseline">
                <span className="text-white font-extrabold text-[1.6rem] tracking-tight leading-none">Root</span>
                <span className="text-purple-300 font-extrabold text-[1.6rem] tracking-tight leading-none">cosmo</span>
              </div>
              <span className="text-purple-300/70 text-[10px] font-light tracking-widest mt-0.5">
                {t('navTagline')}
              </span>
            </div>
          </button>

          {/* Search bar */}
          <div className="hidden md:flex w-48 lg:w-56 flex-shrink-0">
            <div className="relative w-full">
              <input
                type="text"
                placeholder={t('searchService')}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white text-gray-800 placeholder-gray-500 text-sm px-4 py-2 pr-9 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Nav links with mega menu — centered in remaining space */}
          <nav
            className="hidden xl:flex flex-1 items-center justify-center gap-0.5"
            onMouseLeave={() => { setActiveMenu(null); setHoveredItem(null); }}
          >
            {NAV_LINKS.map(link => {
              const groups = menuItemsFor(link.label);
              const isActive = activeMenu === link.label;
              return (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => { setActiveMenu(link.label); setHoveredItem(null); }}
                >
                  <button
                    onClick={() => {
                      setActiveMenu(isActive ? null : link.label);
                      if (!groups.length) handleNavClick(link.slug);
                    }}
                    aria-expanded={isActive}
                    aria-haspopup={groups.length > 0}
                    className={`flex items-center gap-0.5 text-[13px] font-medium px-3 py-2 transition-colors whitespace-nowrap ${isActive || getNavKeyForTreatment('') === link.label ? 'text-purple-200' : 'text-white hover:text-purple-200'}`}
                  >
                    {t(link.label)}
                    {groups.length > 0 && <ChevronDown size={12} className={`text-purple-300 transition-transform ${isActive ? 'rotate-180' : ''}`} />}
                  </button>

                  {isActive && groups.length > 0 && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-0 z-[70]"
                      onMouseEnter={() => setActiveMenu(link.label)}
                    >
                      <div
                        className="rounded-2xl shadow-2xl border border-purple-200/30 overflow-visible"
                        style={{ background: 'linear-gradient(180deg, #ffffff 0%, #faf5ff 100%)' }}
                      >
                        {/* Arrow */}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-white border-l border-t border-purple-200/30" />
                        <div className="flex gap-0">
                          {groups.map((group, gi) => (
                            <div
                              key={gi}
                              className="p-5 min-w-[260px]"
                              style={gi > 0 ? { borderLeft: '1px solid rgba(147,51,234,0.12)' } : undefined}
                            >
                              <h4 className="text-[11px] font-bold uppercase tracking-wider text-purple-700 mb-3">
                                {group.title}
                              </h4>
                              <ul className="space-y-0.5">
                                {group.items.map(item => {
                                  const itemLabel = isNested(item) ? item.name : item;
                                  const hasChildren = isNested(item);
                                  const isHovered = hoveredItem === itemLabel;

                                  return (
                                    <li
                                      key={itemLabel}
                                      className="relative"
                                      onMouseEnter={() => setHoveredItem(hasChildren ? itemLabel : null)}
                                    >
                                      <div
                                        className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                                          isHovered
                                            ? 'text-purple-700 bg-purple-50'
                                            : 'text-gray-700 hover:text-purple-700 hover:bg-purple-50'
                                        }`}
                                      >
                                        <span className="w-1 h-1 rounded-full bg-purple-300 flex-shrink-0" />
                                        <button
                                          onClick={() => navigateToItem(itemLabel)}
                                          className="flex-1 text-left"
                                        >
                                          {menuItemLabel(itemLabel)}
                                        </button>
                                        {hasChildren && (
                                          <button
                                            onClick={(e) => { e.stopPropagation(); setHoveredItem(current => current === itemLabel ? null : itemLabel); }}
                                            aria-expanded={isHovered}
                                            aria-haspopup
                                            className="flex-shrink-0 p-0.5"
                                          >
                                            <ChevronRight size={14} className={`text-purple-400 transition-transform ${isHovered ? 'translate-x-0.5' : ''}`} />
                                          </button>
                                        )}
                                      </div>

                                      {/* Submenu flyout */}
                                      {hasChildren && isHovered && (
                                        <div className="absolute top-0 left-full ml-1 z-[75]">
                                            <div
                                              className="rounded-xl shadow-2xl border border-purple-200/30 overflow-hidden min-w-[220px]"
                                              style={{ background: 'linear-gradient(180deg, #ffffff 0%, #faf5ff 100%)' }}
                                            >
                                            <div className="px-4 py-2.5 border-b border-purple-100">
                                              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
                                                {menuItemLabel(itemLabel)}
                                              </span>
                                            </div>
                                            <ul className="py-1.5">
                                              {item.children.map(child => {
                                                return (
                                                  <li key={child}>
                                                    <button
                                                      onClick={() => navigateToItem(child)}
                                                      className="w-full text-left text-sm text-gray-600 hover:text-purple-700 hover:bg-purple-50 px-4 py-2 transition-colors flex items-center gap-2"
                                                    >
                                                      <span className="w-1 h-1 rounded-full bg-purple-200 flex-shrink-0" />
                                                      {menuItemLabel(child)}
                                                    </button>
                                                  </li>
                                                );
                                              })}
                                            </ul>
                                          </div>
                                        </div>
                                      )}
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          ))}
                        </div>
                        {/* Footer CTA bar */}
                        <div
                          className="px-5 py-3 flex items-center justify-between"
                          style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)' }}
                        >
                          <span className="text-white text-xs font-medium">{t('bookYourAppointmentNow')}</span>
                          <button
                            onClick={() => { onBookAppointment(); setActiveMenu(null); }}
                            className="text-white text-xs font-bold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-colors"
                          >
                            {t('bookAppointment')}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="hidden xl:block flex-1" />

          {/* Shop at RootCosmo */}
          <a
            href="/#products"
            className="hidden md:flex items-center gap-2 flex-shrink-0 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:opacity-90"
            style={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 50%, #a855f7 100%)',
              boxShadow: '0 2px 16px rgba(147,51,234,0.6)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            <ShoppingCart size={17} className="flex-shrink-0" />
            <span>Shop at RootCosmo</span>
          </a>

          {/* Book Appointment CTA — right */}
          <button
            onClick={onBookAppointment}
            className="hidden md:flex items-center gap-2 flex-shrink-0 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:opacity-90"
            style={{
              background: 'linear-gradient(135deg, #ca8a04 0%, #eab308 100%)',
              boxShadow: '0 2px 12px rgba(234,179,8,0.45)',
            }}
          >
            <ShoppingCart size={16} />
            {t('bookAppointment')}
          </button>

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="xl:hidden text-white p-1 ml-auto" aria-expanded={mobileOpen} aria-label="Menu">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Contact row — centered below main nav */}
        <div className="hidden xl:flex justify-center pb-2 -mt-1">
          <button className="text-white text-[13px] font-medium hover:text-purple-200 transition-colors">
            {t('contact')}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="xl:hidden border-t border-purple-800/50 px-4 py-4 max-h-[85vh] overflow-y-auto"
          style={{ background: '#1e0040' }}
        >
          <div className="mb-3 relative">
            <input
              type="text"
              placeholder={t('searchService')}
              className="w-full bg-white text-gray-800 text-sm px-4 py-2 pr-10 rounded-full focus:outline-none"
            />
            <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <nav className="flex flex-col gap-0">
            {[...NAV_LINKS, { label: 'contact' as TranslationKey, slug: null }].map(link => {
              const groups = menuItemsFor(link.label);
              const isOpen = mobileMenu === link.label;
              return (
                <div key={link.label} className="border-b border-purple-800/40">
                  <button
                    onClick={() => {
                      if (groups.length === 0) {
                        handleNavClick(link.slug);
                      } else {
                        setMobileMenu(isOpen ? null : link.label);
                        setMobileSubmenu(null);
                      }
                    }}
                    aria-expanded={isOpen}
                    aria-haspopup={groups.length > 0}
                    className="w-full text-white text-sm py-3 flex justify-between items-center"
                  >
                    {t(link.label)}
                    {groups.length > 0 && (
                      <ChevronDown size={14} className={`text-purple-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    )}
                  </button>
                  {isOpen && groups.length > 0 && (
                    <div className="pb-3 pl-3">
                      {groups.map((group, gi) => (
                        <div key={gi} className="mb-3">
                          <h4 className="text-[10px] font-bold uppercase tracking-wider text-purple-400 mb-2">
                            {group.title}
                          </h4>
                          <ul className="space-y-0.5">
                            {group.items.map(item => {
                              const itemLabel = isNested(item) ? item.name : item;
                              const hasChildren = isNested(item);
                              const subOpen = mobileSubmenu === itemLabel;

                              return (
                                <li key={itemLabel}>
                                  <div
                                    className="w-full text-left text-sm text-gray-300 hover:text-white px-3 py-2 rounded-lg transition-colors flex items-center gap-2"
                                  >
                                    <span className="w-1 h-1 rounded-full bg-purple-400 flex-shrink-0" />
                                    <button
                                      onClick={() => navigateToItem(itemLabel)}
                                      className="flex-1 text-left hover:text-white"
                                    >
                                      {menuItemLabel(itemLabel)}
                                    </button>
                                    {hasChildren && (
                                      <button
                                        onClick={() => setMobileSubmenu(subOpen ? null : itemLabel)}
                                        aria-expanded={subOpen}
                                        aria-haspopup
                                        className="flex-shrink-0 p-0.5"
                                      >
                                        <ChevronDown size={13} className={`text-purple-400 transition-transform ${subOpen ? 'rotate-180' : ''}`} />
                                      </button>
                                    )}
                                  </div>
                                  {hasChildren && subOpen && (
                                    <ul className="pl-5 pt-1 pb-1 space-y-0.5">
                                      {item.children.map(child => {
                                        return (
                                          <li key={child}>
                                            <button
                                              onClick={() => navigateToItem(child)}
                                              className="w-full text-left text-[13px] text-gray-400 hover:text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2"
                                            >
                                              <span className="w-1 h-1 rounded-full bg-purple-500 flex-shrink-0" />
                                              {menuItemLabel(child)}
                                            </button>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
          <button
            onClick={() => { onBookAppointment(); setMobileOpen(false); }}
            className="mt-4 w-full text-white text-sm font-semibold py-3 rounded-full"
            style={{ background: 'linear-gradient(135deg, #ca8a04 0%, #eab308 100%)' }}
          >
            {t('bookAppointment')}
          </button>
        </div>
      )}
    </header>
  );
}
