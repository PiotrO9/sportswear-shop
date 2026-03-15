import type { ProductCategory } from '~/types/product';

const CATEGORY_SLUG_TO_FILTER: Record<string, ProductCategory> = {
    rashguard: 'sport',
    'technical-shirt': 'sport',
    shorts: 'sport',
    jerseys: 'sport',
    hoodies: 'men',

    // Backward compatibility for previously generated Polish slugs.
    'koszulka-techniczna': 'sport',
    spodenki: 'sport',
    trykoty: 'sport',
    bluzy: 'men',
};

export function mapCategorySlugToFilter(
    categorySlug: string,
): ProductCategory | 'all' {
    const normalizedSlug = categorySlug.trim().toLowerCase();
    return CATEGORY_SLUG_TO_FILTER[normalizedSlug] ?? 'all';
}
