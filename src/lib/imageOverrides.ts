export const TREATMENT_IMAGE_OVERRIDES: Record<string, string> = {
  'Lip Fillers': '/images/services/lip-aesthetics/lip-fillers-2.jpeg',
  'Lip Pigmentation': '/images/services/lip-aesthetics/lip-pigmentation.webp',
  'Lip Rejuvenation': '/images/services/lip-aesthetics/lip-rejuvenation.jpg',
};

export const CATEGORY_IMAGE_OVERRIDES: Record<string, string> = {
  'dental-care': '/images/services/dental-care/img-p-1-1.jpeg',
  'face-aesthetics': '/images/services/face-aesthetics/face-aesthetics.jpg',
  'medifacials': '/images/services/medifacials/medifacials.jpg',
  'hair-care': '/images/services/hair-care/hair-care.webp',
  'lip-aesthetics': '/images/services/lip-aesthetics/lip-aesthetics.jpeg',
  'laser-treatment': '/images/services/laser-treatment.jpeg',
};

export function getTreatmentImage(name: string, fallback: string): string {
  return TREATMENT_IMAGE_OVERRIDES[name] ?? fallback;
}

export function getCategoryImage(slug: string, fallback: string): string {
  return CATEGORY_IMAGE_OVERRIDES[slug] ?? fallback;
}
