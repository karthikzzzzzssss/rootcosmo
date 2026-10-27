// Full service list per category, mirroring rootcosmo.com's "Find Our Best
// Services By Category" counts (Dental 22, Face 25, MediFacials 5, Hair 7,
// Lip 3, Laser 5). Drives the category-page listings and the home-page service
// counts without requiring database writes.
export const SERVICES_BY_SLUG: Record<string, string[]> = {
  'dental-care': [
    'Dental Apicoectomy',
    'Dental Bridges & Crowns',
    'Dental Cleanings (Prophylaxis)',
    'Dental Fillings (GIC & Composites)',
    'Dental Implants',
    'Dental Inlays and Onlays',
    'Dental Sealants',
    'Dental Veneers',
    'Dentures (Complete or Partial)',
    'Full Mouth Rehabilitation',
    'Gum Disease (Periodontics) Treatment',
    'Impaction (Surgical Removal)',
    'Invisible Braces (Invisalign)',
    'Laser Flap Surgeries',
    'Orthodontic (Braces or Aligners) Treatment',
    'Pediatric Dentistry (Child Dentistry)',
    'Root Canal Treatment (Endodontics)',
    'Smile Designing',
    'Temporomandibular Joint (TMJ) Treatment',
    'Teeth Whitening (Bleaching)',
    'Tooth Removal (Extraction)',
    'Zirconia Crowns',
  ],
  'face-aesthetics': [
    'Acne (Pimples) Treatment',
    'Acne Scars Treatment',
    'Anti-Aging Treatments',
    'Botox (Botulinum Toxin) Injections',
    'Carbon Laser Peel (Hollywood Peel)',
    'Chemical Peels',
    'Dermal Fillers',
    'Double Chin Reduction',
    'Facial Rejuvenation',
    'GFC (Growth Factor Concentration) for Skin',
    'Hyperhidrosis (Excessive Sweating) Treatment',
    'IV Glutathione Treatment',
    'Keloid and Hypertrophic Scar Treatment',
    'Melasma',
    'Microdermabrasion (MDM)',
    'Microneedling (MNRF)',
    'Mole and Skin Tag Removal',
    'Open Pores',
    'Pigmentation',
    'Platelet-Rich Plasma (PRP) Therapy for Skin',
    'Skin Lightening and Brightening',
    'Skin Tightening',
    'Stretch Marks',
    'Thread Lifts',
    'Under Eye Dark Circle Reduction',
  ],
  'medifacials': [
    'Body Polishing',
    'Crystal Microdermabrasion (MDM)',
    'Hydrafacial',
    'Oxygeno Facial',
    'Vampire Facial',
  ],
  'hair-care': [
    'Anti-Dandruff Treatment',
    'GFC for Hair',
    'Hair Loss Treatments',
    'Hair Transplantation',
    'Laser Hair Therapy',
    'Mesotherapy for Hair',
    'PRP Therapy for Hair',
  ],
  'lip-aesthetics': [
    'Lip Fillers',
    'Lip Pigmentation',
    'Lip Rejuvenation',
  ],
  'laser-treatment': [
    'Laser Hair Reduction',
    'Laser Scar Reduction',
    'Laser Skin Resurfacing',
    'Laser Tattoo Removal',
    'Laser Toning',
  ],
};

export function servicesForCategory(slug: string): string[] {
  return SERVICES_BY_SLUG[slug] ?? [];
}

export function serviceCount(slug: string): number {
  return (SERVICES_BY_SLUG[slug] ?? []).length;
}
