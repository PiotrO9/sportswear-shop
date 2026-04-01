export type ProductCategory = 'men' | 'women' | 'kids' | 'sport';

export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export type ProductMaterial = 'cotton' | 'polyester' | 'blend' | 'lycra';

export type ProductColor = 'black' | 'white' | 'grey' | 'navy' | 'red' | 'blue';

export type ProductSort = 'price-asc' | 'price-desc' | 'name-asc';

/** `default` — szare tło katalogowe; `light` — biała galeria; `dark` — ciemna galeria (np. czarny produkt na czarnym tle). */
export type ProductImageContainerTheme = 'default' | 'light' | 'dark';

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
    imageContainerTheme?: ProductImageContainerTheme;
}
