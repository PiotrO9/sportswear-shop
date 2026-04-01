export type ProductCategory = 'men' | 'women' | 'kids' | 'sport';

export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export type ProductMaterial = 'cotton' | 'polyester' | 'blend' | 'lycra';

export type ProductColor = 'black' | 'white' | 'grey' | 'navy' | 'red' | 'blue';

export type ProductSort = 'price-asc' | 'price-desc' | 'name-asc';

export type ProductImageContainerTheme = 'default' | 'light';

export interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    category: ProductCategory;
    subcategory?: string;
    sizes: ProductSize[];
    material: ProductMaterial;
    colors: ProductColor[];
    images?: string[];
    /** Domyślnie białe tło; ustaw `default` dla szarego tła katalogowego. */
    imageContainerTheme?: ProductImageContainerTheme;
}
