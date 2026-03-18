import type {
    Product,
    ProductCategory,
    ProductColor,
    ProductMaterial,
    ProductSize,
    ProductSort,
} from '~/types/product';

const MOCK_PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'Koszulka sportowa PRO',
        price: 89.99,
        category: 'men',
        subcategory: 'rashguard-short-sleeve',
        sizes: ['S', 'M', 'L', 'XL'],
        material: 'cotton',
        colors: ['black', 'white', 'navy'],
        images: [
            '/images/products/koszulka_1_front.png',
            '/images/products/koszulka_1_plecy.png',
        ],
    },
    {
        id: '2',
        name: 'Koszulka sportowa PRO biała',
        price: 89.99,
        category: 'men',
        subcategory: 'rashguard-short-sleeve',
        sizes: ['S', 'M', 'L', 'XL'],
        material: 'cotton',
        colors: ['black', 'white', 'navy'],
        images: [
            '/images/products/koszulka_1_front_biale.webp',
            '/images/products/koszulka_1_plecy_biale.webp',
        ],
        imageContainerTheme: 'light',
    },
    {
        id: '3',
        name: 'Koszulka sportowa PRO (białe tło)',
        price: 89.99,
        category: 'men',
        subcategory: 'rashguard-short-sleeve',
        sizes: ['S', 'M', 'L', 'XL'],
        material: 'cotton',
        colors: ['black', 'white', 'navy'],
        images: [
            '/images/products/koszulka_1_front.png',
            '/images/products/koszulka_1_plecy.png',
        ],
        imageContainerTheme: 'light',
    },
];

export function useCategoriesProducts() {
    const allProducts = MOCK_PRODUCTS;

    function filterProducts(
        category: ProductCategory | 'all',
        minPrice: number,
        maxPrice: number,
        size: ProductSize | null,
        material: ProductMaterial | 'all',
        color: ProductColor | 'all',
        sort: ProductSort,
        subcategory: string | null = null,
    ): Product[] {
        let result = allProducts.filter((product) => {
            if (subcategory && product.subcategory !== subcategory) {
                return false;
            }

            if (
                !subcategory &&
                category !== 'all' &&
                product.category !== category
            ) {
                return false;
            }

            if (product.price < minPrice || product.price > maxPrice) {
                return false;
            }

            if (size && !product.sizes.includes(size)) {
                return false;
            }

            if (material !== 'all' && product.material !== material) {
                return false;
            }

            if (color !== 'all' && !product.colors.includes(color)) {
                return false;
            }

            return true;
        });

        result = [...result].sort((a, b) => {
            if (sort === 'price-asc') return a.price - b.price;
            if (sort === 'price-desc') return b.price - a.price;
            return a.name.localeCompare(b.name);
        });

        return result;
    }

    function getProductById(id: string): Product | undefined {
        return allProducts.find((p) => p.id === id);
    }

    return {
        allProducts,
        filterProducts,
        getProductById,
    };
}
