// Centralized treatment → image mapping.
// Each of the ~114 menu treatments (including nested leaves) gets its own
// distinct, contextually relevant, royalty-free photo (Pexels). No image is
// reused for two different treatments anywhere on the site. Images are served
// from Pexels' CDN with sizing params for performance.
const px = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1000`;

export const TREATMENT_IMAGES: Record<string, string> = {
  // ── Dental (26) ──────────────────────────────────────────────
  'Smile Designing': px(6627281),
  'Hollywood Smile': px(6627574),
  'Gummy Smile Correction': px(6627284),
  'Digital Smile Design': px(12934843),
  'Teeth Whitening (Bleaching)': px(5355891),
  'Root Canal Treatment': px(20301626),
  'Single Sitting RCT': px(11768114),
  'Laser-Assisted RCT': px(15771802),
  'Retreatment RCT': px(14235198),
  'Dental Implants': px(6502305),
  'Single Tooth Implant': px(6502340),
  'All-on-4 Implants': px(6502343),
  'All-on-6 Implants': px(6502306),
  'Orthodontics (Braces)': px(5524024),
  'Metal Braces': px(13207278),
  'Ceramic Braces': px(14207516),
  'Lingual Braces': px(6528861),
  'Clear Aligners (Invisalign)': px(19147369),
  'Porcelain Veneers': px(6627571),
  'E-Max Veneers': px(6627564),
  'Zirconia Veneers': px(6627599),
  'Composite Veneers': px(6627278),
  'Tooth Removal (Extraction)': px(6627606),
  'Simple Extraction': px(6529216),
  'Surgical Extraction': px(6528909),
  'Wisdom Tooth Removal': px(6528908),

  // ── Skin Aesthetics (26) ─────────────────────────────────────
  'Acne Scars Treatment': px(9253774),
  'Rolling Scars': px(5587975),
  'Boxcar Scars': px(6337548),
  'Ice Pick Scars': px(5588005),
  'Anti-Aging Treatment': px(36436447),
  'Thread Lift': px(30809943),
  'PRP for Face': px(29648624),
  'Collagen Induction': px(16131210),
  'Dermal Fillers': px(4586708),
  'Cheek Fillers': px(7582560),
  'Nasolabial Fillers': px(27666913),
  'Under-Eye Fillers': px(7581580),
  'Botox / Anti-Wrinkle Treatment': px(7581590),
  'Chemical Peel': px(8406612),
  'Glycolic Peel': px(9775369),
  'Salicylic Peel': px(7161668),
  'TCA Peel': px(6925542),
  'Skin Tightening': px(34775442),
  'Radiofrequency': px(7363189),
  'HIFU': px(30809947),
  'Ultrasound': px(37229299),
  'Pigmentation Treatment': px(6475980),
  'Melasma': px(6476076),
  'Dark Spots': px(6475986),
  'Freckles': px(7588575),
  'Under Eye Dark Circle Reduction': px(6635915),

  // ── MediFacials (17) ─────────────────────────────────────────
  'Hydrafacial': px(18209809),
  'Signature Hydrafacial': px(12556701),
  'Platinum Hydrafacial': px(7446657),
  'Deluxe Hydrafacial': px(7446656),
  'Vampire Facial': px(37229279),
  'PRP Facial': px(7446664),
  'GFC Facial': px(7446659),
  'Oxygeno Facial': px(7755657),
  'Oxygen Infusion': px(5069426),
  'Oxygeno Plus': px(5069612),
  'Crystal Microdermabrasion': px(20683632),
  'Diamond Tip': px(20683634),
  'Crystal Tip': px(29648627),
  'Body Polishing': px(10976267),
  'Full Body Polish': px(27860845),
  'Back Polish': px(5308666),
  'Neck & Decollete': px(7020264),

  // ── Hair Care (18) ───────────────────────────────────────────
  'Hair Loss Treatment': px(23349912),
  'Male Pattern Baldness': px(36963686),
  'Female Hair Loss': px(38020025),
  'Alopecia Areata': px(20845681),
  'Hair Transplantation': px(27138339),
  'FUE Transplant': px(27138340),
  'DHI Transplant': px(27138343),
  'Bio-FUE': px(27138344),
  'GFC (Growth Factor Concentrate) for Hair': px(3993451),
  'Anti-Dandruff Treatment': px(23349891),
  'Ketoconazole Therapy': px(23349908),
  'Salicylic Scalp Treatment': px(23349902),
  'Laser Hair Therapy': px(7755473),
  'Low-Level Laser': px(38595833),
  'LED Light Therapy': px(7755663),
  'Mesotherapy for Hair': px(8834042),
  'Vitamin Cocktail': px(36292486),
  'DHT Blocker Blend': px(8834067),

  // ── Lip Aesthetics (11) ──────────────────────────────────────
  'Lip Fillers': px(10816496),
  'Hyaluronic Acid Fillers': px(31141638),
  'Subtle Volume': px(7290082),
  'Full Volume': px(32179034),
  'Lip Pigmentation': px(7290745),
  'Dark Lip Neutralization': px(38166610),
  'Lip Lightening': px(7479972),
  'Lip Rejuvenation': px(7290642),
  'Lip Hydration': px(7290746),
  'Fine Line Reduction': px(8092977),
  'Lip Border Definition': px(36029722),

  // ── Laser Treatment (16) ─────────────────────────────────────
  'Laser Hair Removal': px(3985356),
  'Diode Laser': px(16032305),
  'Alexandrite Laser': px(36930734),
  'Nd:YAG Laser': px(16032366),
  'Laser Skin Resurfacing': px(5069499),
  'Ablative Resurfacing': px(4586727),
  'Non-Ablative Resurfacing': px(4586750),
  'Fractional CO2 Laser': px(7108227),
  'Acne Scar Resurfacing': px(29021129),
  'Stretch Mark Reduction': px(29021128),
  'Q-Switch Laser for Pigmentation': px(19239114),
  'Tattoo Removal': px(16032298),
  'Pigment Reduction': px(35103885),
  'Laser Flap Surgeries': px(12556700),
  'Periodontal Laser Surgery': px(19239092),
  'Gum Contouring': px(5069611),

  // ── Home-carousel database treatments (names differ from the menu) ──
  'Teeth Cleaning': px(19775904),
  'Teeth Whitening': px(6812500),
  'Botox Treatment': px(30809944),
  'HydraFacial': px(4586746),
  'Acne MediFacial': px(37229282),
  'PRP Hair Treatment': px(23349910),
  'Hair Growth Therapy': px(3757004),
  'Lip Contouring': px(3762434),
  'Laser Hair Reduction': px(3985354),
};

// Full rootcosmo.com service set (67 services) shown on the category pages.
// Distinct image within each category so a category page never repeats a photo.
export const SERVICE_IMAGES: Record<string, string> = {
  // Dental Care (22)
  'Dental Apicoectomy': px(6629364),
  'Dental Bridges & Crowns': px(6502340),
  'Dental Cleanings (Prophylaxis)': px(20301626),
  'Dental Fillings (GIC & Composites)': px(6529216),
  'Dental Implants': px(6502305),
  'Dental Inlays and Onlays': px(4687905),
  'Dental Sealants': px(6502343),
  'Dental Veneers': px(6627571),
  'Dentures (Complete or Partial)': px(6812500),
  'Full Mouth Rehabilitation': px(6502306),
  'Gum Disease (Periodontics) Treatment': px(6528909),
  'Impaction (Surgical Removal)': px(6528908),
  'Invisible Braces (Invisalign)': px(19147369),
  'Laser Flap Surgeries': px(13207323),
  'Orthodontic (Braces or Aligners) Treatment': px(5524024),
  'Pediatric Dentistry (Child Dentistry)': px(19775904),
  'Root Canal Treatment (Endodontics)': px(6627606),
  'Smile Designing': px(6627281),
  'Temporomandibular Joint (TMJ) Treatment': px(6502309),
  'Teeth Whitening (Bleaching)': px(5355891),
  'Tooth Removal (Extraction)': px(7787976),
  'Zirconia Crowns': px(6627564),
  // Face Aesthetics (25)
  'Acne (Pimples) Treatment': px(5588005),
  'Acne Scars Treatment': px(9253774),
  'Anti-Aging Treatments': px(36436447),
  'Botox (Botulinum Toxin) Injections': px(7581590),
  'Carbon Laser Peel (Hollywood Peel)': px(8406612),
  'Chemical Peels': px(6978043),
  'Dermal Fillers': px(4586708),
  'Double Chin Reduction': px(7582560),
  'Facial Rejuvenation': px(37229299),
  'GFC (Growth Factor Concentration) for Skin': px(29648624),
  'Hyperhidrosis (Excessive Sweating) Treatment': px(16131212),
  'IV Glutathione Treatment': px(16131210),
  'Keloid and Hypertrophic Scar Treatment': px(5587975),
  'Melasma': px(6476076),
  'Microdermabrasion (MDM)': px(8076226),
  'Microneedling (MNRF)': px(7363189),
  'Mole and Skin Tag Removal': px(6337548),
  'Open Pores': px(6925542),
  'Pigmentation': px(6475980),
  'Platelet-Rich Plasma (PRP) Therapy for Skin': px(27666913),
  'Skin Lightening and Brightening': px(9775369),
  'Skin Tightening': px(34775442),
  'Stretch Marks': px(7588575),
  'Thread Lifts': px(30809943),
  'Under Eye Dark Circle Reduction': px(6635915),
  // MediFacials (5)
  'Body Polishing': px(10976267),
  'Crystal Microdermabrasion (MDM)': px(20683632),
  'Hydrafacial': px(18209809),
  'Oxygeno Facial': px(7755657),
  'Vampire Facial': px(37229279),
  // Hair Care (7)
  'Anti-Dandruff Treatment': px(23349891),
  'GFC for Hair': px(3993451),
  'Hair Loss Treatments': px(23349912),
  'Hair Transplantation': px(27138339),
  'Laser Hair Therapy': px(7755473),
  'Mesotherapy for Hair': px(8834042),
  'PRP Therapy for Hair': px(23349910),
  // Lip Aesthetics (3)
  'Lip Fillers': px(10816496),
  'Lip Pigmentation': px(7290745),
  'Lip Rejuvenation': px(7290642),
  // Laser Treatment (5)
  'Laser Hair Reduction': px(3985354),
  'Laser Scar Reduction': px(29021129),
  'Laser Skin Resurfacing': px(5069499),
  'Laser Tattoo Removal': px(16032298),
  'Laser Toning': px(35103885),
};

// Slug index so a treatment resolves the same whether it arrives as its exact
// name (menu click) or as a deslugified name from the URL (direct load /
// refresh), e.g. "Nd:YAG Laser" and "Nd Yag Laser" both map to "nd-yag-laser".
function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const SLUG_INDEX: Record<string, string> = {};
for (const [name, url] of [...Object.entries(TREATMENT_IMAGES), ...Object.entries(SERVICE_IMAGES)]) {
  const s = slugify(name);
  if (!(s in SLUG_INDEX)) SLUG_INDEX[s] = url;
}

export function getMappedTreatmentImage(name: string): string | undefined {
  return TREATMENT_IMAGES[name] ?? SERVICE_IMAGES[name] ?? SLUG_INDEX[slugify(name)];
}
