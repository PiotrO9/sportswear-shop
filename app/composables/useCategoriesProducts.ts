import type {
    Product,
    ProductCategory,
    ProductColor,
    ProductMaterial,
    ProductSize,
    ProductSort,
} from '~/types/product';

const RASHGUARD_SHORT_SLEEVE_DESCRIPTION = `Męski rashguard z krótkim rękawem

Ten model powstał z myślą o intensywnym treningu i pełnym skupieniu na celu. Sprawdzi się w BJJ, MMA, na siłowni, podczas crossfitu czy w terenie. To koszulka kompresyjna, która trenuje razem z Tobą – niezależnie od tempa i poziomu zaawansowania.

Minimalistyczna grafika nadaje charakteru, ale to funkcjonalność gra tu pierwsze skrzypce. Dopasowany krój i elastyczny materiał tworzą efekt „drugiej skóry”, dzięki czemu możesz poruszać się swobodnie w każdej płaszczyźnie – bez ograniczeń i bez rozpraszania.

⭐ elastyczny materiał odporny na mechacenie i utratę kształtu
⭐ dopasowany krój zapewniający pełną mobilność
⭐ skuteczne odprowadzanie wilgoci – komfort nawet podczas długich sesji
⭐ wsparcie termoregulacji w trakcie intensywnego wysiłku
⭐ trwała grafika, która nie traci jakości mimo częstego prania

Rashguard pozostaje na swoim miejscu nawet podczas dynamicznych przejść, parteru czy pracy z ciężarem. Nie podciąga się, nie rozciąga i nie rozprasza — możesz w pełni skupić się na treningu.

To solidny element garderoby dla mężczyzn, którzy trenują regularnie i oczekują od odzieży realnego wsparcia.`;

/** Slug w nazwie pliku: rashguard-short-sleeve-{slug}-front|back.webp */
interface RashguardShortSleeveMockSpec {
    id: string;
    slug: string;
    titleSuffix: string;
}

const RASHGUARD_TITLE_PREFIX = 'RASHGUARD Z KRÓTKIM RĘKAWEM';

const RASHGUARD_SHORT_SLEEVE_MOCK_SPECS: RashguardShortSleeveMockSpec[] = [
    {
        id: '1',
        slug: 'arctic',
        titleSuffix: 'ARCTIC',
    },
    {
        id: '2',
        slug: 'oldschool',
        titleSuffix: 'OLDSCHOOL',
    },
    {
        id: '3',
        slug: 'warning-black',
        titleSuffix: 'WARNING CZARNY',
    },
    {
        id: '4',
        slug: 'warning-mint',
        titleSuffix: 'WARNING MIĘTOWY',
    },
    {
        id: '5',
        slug: 'warning-yellow',
        titleSuffix: 'WARNING ŻÓŁTY',
    },
    {
        id: '6',
        slug: 'wlepa-bw',
        titleSuffix: 'WLEPA BW',
    },
];

function rashguardShortSleeveMockProduct(
    spec: RashguardShortSleeveMockSpec,
): Product {
    const basePath = '/images/products';
    const prefix = `rashguard-short-sleeve-${spec.slug}`;

    return {
        id: spec.id,
        name: `${RASHGUARD_TITLE_PREFIX} ${spec.titleSuffix}`,
        description: RASHGUARD_SHORT_SLEEVE_DESCRIPTION,
        price: 89.99,
        category: 'men',
        subcategory: 'rashguard-short-sleeve',
        sizes: ['S', 'M', 'L', 'XL'],
        material: 'lycra',
        colors: ['black', 'white', 'navy'],
        images: [
            `${basePath}/${prefix}-front.webp`,
            `${basePath}/${prefix}-back.webp`,
        ],
    };
}

const MOCK_PRODUCTS: Product[] = RASHGUARD_SHORT_SLEEVE_MOCK_SPECS.map(
    rashguardShortSleeveMockProduct,
);

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
