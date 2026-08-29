export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function categoryPath(slug: string): string {
  return `/categories/${slug}`;
}

export function treatmentPath(name: string, variant?: string): string {
  const basePath = `/treatments/${slugify(name)}`;
  return variant ? `${basePath}/${slugify(variant)}` : basePath;
}

export function deslugify(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
