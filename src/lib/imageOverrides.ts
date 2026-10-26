// A distinct, relevant photo per treatment (no image repeats anywhere on the
// site). Used when a treatment row has no image_url of its own.
const px = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800`;

export const TREATMENT_IMAGE_OVERRIDES: Record<string, string> = {
  // Dental Care
  'Teeth Cleaning': px(20301626),
  'Teeth Whitening': px(14235198),
  'Dental Implants': px(11768114),
  // Face Aesthetics
  'Botox Treatment': px(30809944),
  'Dermal Fillers': px(3865548),
  'Chemical Peel': px(6978043),
  // MediFacials
  'HydraFacial': px(7446659),
  'Acne MediFacial': px(37229282),
  // Hair Care
  'PRP Hair Treatment': px(23349910),
  'Hair Growth Therapy': px(38595833),
  // Lip Aesthetics
  'Lip Fillers': px(10816496),
  'Lip Contouring': px(3762434),
  // Laser Treatment
  'Laser Hair Reduction': px(5069499),
  'Laser Skin Resurfacing': px(4586750),
};

export const CATEGORY_IMAGE_OVERRIDES: Record<string, string> = {
  'dental-care': '/images/services/dental-care/img-p-1-1.jpeg',
  'face-aesthetics': '/images/services/face-aesthetics/face-aesthetics.jpg',
  'medifacials': '/images/services/medifacials/medifacials.jpg',
  'hair-care': '/images/services/hair-care/hair-care.webp',
  'lip-aesthetics': '/images/services/lip-aesthetics/lip-aesthetics.jpeg',
  'laser-treatment': '/images/services/laser-treatment.jpeg',
};

// Shown when a database row has no image_url (or its URL fails to load) and
// nothing more specific matches — keeps cards from rendering a broken <img>.
const DEFAULT_IMAGE = '/images/services/dental-care/dental-care.jpg';

function hasValue(v: string | null | undefined): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Local category image for a category name (e.g. "Dental Care") or slug.
export function categoryFallbackImage(categoryNameOrSlug?: string | null): string {
  if (hasValue(categoryNameOrSlug)) {
    const img = CATEGORY_IMAGE_OVERRIDES[slugify(categoryNameOrSlug)];
    if (img) return img;
  }
  return DEFAULT_IMAGE;
}

export function getTreatmentImage(name: string, fallback: string, categoryName?: string | null): string {
  if (TREATMENT_IMAGE_OVERRIDES[name]) return TREATMENT_IMAGE_OVERRIDES[name];
  if (hasValue(fallback)) return fallback;
  return categoryFallbackImage(categoryName);
}

export function getCategoryImage(slug: string, fallback: string): string {
  return CATEGORY_IMAGE_OVERRIDES[slug] ?? (hasValue(fallback) ? fallback : DEFAULT_IMAGE);
}
