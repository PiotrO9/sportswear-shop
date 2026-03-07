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
        name: 'Koszulka sportowa Pro',
        price: 89.99,
        category: 'men',
        sizes: ['S', 'M', 'L', 'XL'],
        material: 'cotton',
        colors: ['black', 'white', 'navy'],
    },
    {
        id: '2',
        name: 'Bluza z kapturem Essential',
        price: 149.99,
        category: 'men',
        sizes: ['M', 'L', 'XL'],
        material: 'blend',
        colors: ['grey', 'navy', 'black'],
    },
    {
        id: '3',
        name: 'Leginsy Yoga Flow',
        price: 129.99,
        category: 'women',
        sizes: ['XS', 'S', 'M', 'L'],
        material: 'lycra',
        colors: ['black', 'grey', 'navy'],
    },
    {
        id: '4',
        name: 'Top bez rękawów Active',
        price: 79.99,
        category: 'women',
        sizes: ['XS', 'S', 'M', 'L'],
        material: 'polyester',
        colors: ['white', 'black', 'red', 'blue'],
    },
    {
        id: '5',
        name: 'Spodenki biegowe Light',
        price: 99.99,
        category: 'sport',
        sizes: ['S', 'M', 'L', 'XL'],
        material: 'polyester',
        colors: ['black', 'grey', 'blue'],
    },
    {
        id: '6',
        name: 'Kurtka sportowa Wind',
        price: 249.99,
        category: 'sport',
        sizes: ['S', 'M', 'L'],
        material: 'polyester',
        colors: ['black', 'navy', 'grey'],
    },
    {
        id: '7',
        name: 'Bluza dziecięca Junior',
        price: 69.99,
        category: 'kids',
        sizes: ['XS', 'S', 'M'],
        material: 'cotton',
        colors: ['white', 'blue', 'red'],
    },
    {
        id: '8',
        name: 'Spodenki dziecięce Play',
        price: 59.99,
        category: 'kids',
        sizes: ['XS', 'S', 'M'],
        material: 'cotton',
        colors: ['grey', 'navy', 'blue'],
    },
    {
        id: '9',
        name: 'Joggerki Comfort',
        price: 119.99,
        category: 'men',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        material: 'blend',
        colors: ['black', 'grey', 'navy'],
    },
    {
        id: '10',
        name: 'Koszulka damska Run',
        price: 94.99,
        category: 'women',
        sizes: ['XS', 'S', 'M', 'L'],
        material: 'polyester',
        colors: ['white', 'black', 'red'],
    },
    {
        id: '11',
        name: 'Bluza termoactive Winter',
        price: 179.99,
        category: 'men',
        sizes: ['S', 'M', 'L', 'XL'],
        material: 'polyester',
        colors: ['black', 'navy', 'grey'],
    },
    {
        id: '12',
        name: 'Spodnie treningowe Power',
        price: 139.99,
        category: 'women',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        material: 'lycra',
        colors: ['black', 'grey', 'navy', 'blue'],
    },
    {
        id: '13',
        name: 'Koszulka polo Sport',
        price: 109.99,
        category: 'men',
        sizes: ['S', 'M', 'L', 'XL'],
        material: 'cotton',
        colors: ['white', 'black', 'navy', 'red'],
    },
    {
        id: '14',
        name: 'Kamizelka biegowa Reflective',
        price: 119.99,
        category: 'sport',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        material: 'polyester',
        colors: ['black', 'grey', 'navy'],
    },
    {
        id: '15',
        name: 'Sukienka sportowa Move',
        price: 159.99,
        category: 'women',
        sizes: ['XS', 'S', 'M', 'L'],
        material: 'blend',
        colors: ['black', 'navy', 'red'],
    },
    {
        id: '16',
        name: 'Kurtka softshell Trail',
        price: 279.99,
        category: 'sport',
        sizes: ['S', 'M', 'L', 'XL'],
        material: 'polyester',
        colors: ['black', 'navy', 'grey'],
    },
    {
        id: '17',
        name: 'Bluza z nadrukiem Kids',
        price: 74.99,
        category: 'kids',
        sizes: ['XS', 'S', 'M'],
        material: 'cotton',
        colors: ['white', 'blue', 'red', 'grey'],
    },
    {
        id: '18',
        name: 'Getry sportowe Elite',
        price: 49.99,
        category: 'sport',
        sizes: ['S', 'M', 'L'],
        material: 'lycra',
        colors: ['black', 'white', 'grey'],
    },
    {
        id: '19',
        name: 'Koszulka basenowa Aqua',
        price: 84.99,
        category: 'men',
        sizes: ['S', 'M', 'L', 'XL'],
        material: 'polyester',
        colors: ['black', 'navy', 'blue'],
    },
    {
        id: '20',
        name: 'Biustonosz sportowy Support',
        price: 99.99,
        category: 'women',
        sizes: ['XS', 'S', 'M', 'L'],
        material: 'lycra',
        colors: ['black', 'white', 'grey', 'navy'],
    },
    {
        id: '21',
        name: 'Spodenki rowerowe Cycle',
        price: 129.99,
        category: 'sport',
        sizes: ['S', 'M', 'L'],
        material: 'polyester',
        colors: ['black', 'navy', 'blue'],
    },
    {
        id: '22',
        name: 'Czapka z daszkiem Cap',
        price: 44.99,
        category: 'kids',
        sizes: ['XS', 'S', 'M'],
        material: 'cotton',
        colors: ['black', 'white', 'navy', 'red', 'blue'],
    },
    {
        id: '23',
        name: 'Koszulka długi rękaw Base',
        price: 79.99,
        category: 'men',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        material: 'cotton',
        colors: ['white', 'black', 'grey', 'navy'],
    },
    {
        id: '24',
        name: 'Leginsy 7/8 Stretch',
        price: 119.99,
        category: 'women',
        sizes: ['XS', 'S', 'M', 'L'],
        material: 'lycra',
        colors: ['black', 'grey', 'navy', 'blue'],
    },
    {
        id: '25',
        name: 'Rękawiczki biegowe Run',
        price: 39.99,
        category: 'sport',
        sizes: ['S', 'M', 'L'],
        material: 'polyester',
        colors: ['black', 'grey', 'navy'],
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
    ): Product[] {
        let result = allProducts.filter((product) => {
            if (category !== 'all' && product.category !== category) {
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
