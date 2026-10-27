// Per-treatment images live in the centralized map in treatmentImages.ts —
// one distinct, relevant photo per treatment, no reuse anywhere on the site.
import { getMappedTreatmentImage } from './treatmentImages';

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
  // 1) The curated per-treatment image (covers all menu + database treatments).
  const mapped = getMappedTreatmentImage(name);
  if (mapped) return mapped;
  // 2) A real image_url from the database, if one is set.
  if (hasValue(fallback)) return fallback;
  // 3) The treatment's category image as a last resort.
  return categoryFallbackImage(categoryName);
}

export function getCategoryImage(slug: string, fallback: string): string {
  return CATEGORY_IMAGE_OVERRIDES[slug] ?? (hasValue(fallback) ? fallback : DEFAULT_IMAGE);
}
