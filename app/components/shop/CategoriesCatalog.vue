<script setup lang="ts">
import ProductCard from '~/components/shop/ProductCard.vue';
import type {
    ProductCategory,
    ProductMaterial,
    ProductSize,
    ProductSort,
} from '~/types/product';

interface Props {
    initialCategory?: ProductCategory | 'all';
    initialSubcategory?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
    initialCategory: 'all',
    initialSubcategory: null,
});

const { t } = useI18n();
const { filterProducts } = useCategoriesProducts();
const { addToast } = useToast();

const filterCategory = ref<ProductCategory | 'all'>(props.initialCategory);
const filterMinPrice = ref<string>('0');
const filterMaxPrice = ref<string>('500');
const filterSize = ref<ProductSize | null>(null);
const filterMaterial = ref<ProductMaterial | 'all'>('all');
const filterSort = ref<ProductSort>('price-asc');
const currentPage = ref(1);
const isFiltersDrawerOpen = ref(false);

const ITEMS_PER_PAGE = 9;

const filteredProducts = computed(() =>
    filterProducts(
        filterCategory.value,
        Number.parseFloat(filterMinPrice.value) || 0,
        Number.parseFloat(filterMaxPrice.value) || 500,
        filterSize.value,
        filterMaterial.value,
        filterSort.value,
        props.initialSubcategory,
    ),
);

const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredProducts.value.length / ITEMS_PER_PAGE)),
);

const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * ITEMS_PER_PAGE;
    return filteredProducts.value.slice(start, start + ITEMS_PER_PAGE);
});

watch(
    () => props.initialCategory,
    (nextCategory) => {
        filterCategory.value = nextCategory;
        currentPage.value = 1;
    },
);

watch(
    [
        filterCategory,
        filterMinPrice,
        filterMaxPrice,
        filterSize,
        filterMaterial,
        filterSort,
    ],
    () => {
        currentPage.value = 1;
    },
);

function handleResetFilters() {
    filterCategory.value = props.initialCategory;
    filterMinPrice.value = '0';
    filterMaxPrice.value = '500';
    filterSize.value = null;
    filterMaterial.value = 'all';
    filterSort.value = 'price-asc';
}

function handleFiltersContentReset() {
    handleResetFilters();
}

function handleToggleFiltersDrawer() {
    isFiltersDrawerOpen.value = !isFiltersDrawerOpen.value;
}

function handleCloseFiltersDrawer() {
    isFiltersDrawerOpen.value = false;
}

function handleFiltersOpenKeyDown(event: KeyboardEvent) {
    if (!isEnterOrSpaceKey(event)) return;

    event.preventDefault();
    handleToggleFiltersDrawer();
}

function handlePageChange(page: number) {
    if (page < 1 || page > totalPages.value) return;
    currentPage.value = page;
}

function handlePrevPage() {
    handlePageChange(currentPage.value - 1);
}

function handleNextPage() {
    handlePageChange(currentPage.value + 1);
}

function handlePageKeyDown(event: KeyboardEvent, page: number) {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    handlePageChange(page);
}

function handlePrevKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    if (currentPage.value <= 1) return;

    event.preventDefault();
    handlePrevPage();
}

function handleNextKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    if (currentPage.value >= totalPages.value) return;

    event.preventDefault();
    handleNextPage();
}

function handleAddToCart(payload: { product: { name: string }; size: string }) {
    addToast({
        title: t('productCardAddedToCart'),
        description: t('productCardAddedToCartDesc', {
            name: payload.product.name,
            size: payload.size,
        }),
        variant: 'success',
    });
}
</script>

<template>
    <div class="py-8">
        <h1
            class="text-secondary-900 dark:text-secondary-50 text-2xl font-bold"
        >
            {{ t('footerShopCategories') }}
        </h1>

        <div class="mt-8 flex flex-col gap-8 lg:flex-row lg:gap-4">
            <button
                type="button"
                class="text-secondary-700 hover:text-secondary-900 dark:text-secondary-300 dark:hover:text-secondary-50 border-secondary-200 dark:border-secondary-800 hover:bg-secondary-100 dark:bg-secondary-900 dark:hover:bg-secondary-800 inline-flex w-fit items-center gap-2 rounded-xl border bg-white px-4 py-2 text-sm font-medium transition lg:hidden"
                :aria-label="t('categoriesFiltersOpen')"
                :aria-expanded="isFiltersDrawerOpen"
                tabindex="0"
                @click="handleToggleFiltersDrawer"
                @keydown="handleFiltersOpenKeyDown"
            >
                <Icon
                    name="heroicons:adjustments-horizontal"
                    class="size-5"
                    aria-hidden="true"
                />
                {{ t('categoriesFilters') }}
            </button>

            <aside
                class="border-secondary-200 dark:border-secondary-800 dark:bg-secondary-900 hidden w-fit max-w-[360px] shrink-0 self-start rounded-lg border bg-white p-2 lg:block"
                :aria-label="t('categoriesFiltersAria')"
            >
                <CategoriesFiltersContent
                    v-model:filter-category="filterCategory"
                    v-model:filter-min-price="filterMinPrice"
                    v-model:filter-max-price="filterMaxPrice"
                    v-model:filter-size="filterSize"
                    v-model:filter-material="filterMaterial"
                    v-model:filter-sort="filterSort"
                    id-prefix="filter-desktop"
                    :compact="true"
                    @reset="handleResetFilters"
                />
            </aside>

            <CategoriesFiltersDrawer
                :open="isFiltersDrawerOpen"
                @close="handleCloseFiltersDrawer"
            >
                <CategoriesFiltersContent
                    v-model:filter-category="filterCategory"
                    v-model:filter-min-price="filterMinPrice"
                    v-model:filter-max-price="filterMaxPrice"
                    v-model:filter-size="filterSize"
                    v-model:filter-material="filterMaterial"
                    v-model:filter-sort="filterSort"
                    id-prefix="filter-mobile"
                    :hide-title="true"
                    @reset="handleFiltersContentReset"
                />
            </CategoriesFiltersDrawer>

            <section
                class="min-w-0 flex-1"
                :aria-label="t('categoriesProductsListAria')"
            >
                <p
                    class="text-secondary-600 dark:text-secondary-400 mb-4 text-sm"
                >
                    {{
                        filteredProducts.length === 1
                            ? t('categoriesProductsCountOne')
                            : t('categoriesProductsCount', {
                                  count: filteredProducts.length,
                              })
                    }}
                </p>

                <div
                    v-if="filteredProducts.length === 0"
                    class="text-secondary-600 dark:text-secondary-400 border-secondary-300 dark:border-secondary-700 rounded-xl border border-dashed p-8 text-center"
                >
                    {{ t('categoriesProductsEmpty') }}
                </div>

                <ClientOnly v-else>
                    <ul
                        class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                        role="list"
                    >
                        <li
                            v-for="product in paginatedProducts"
                            :key="product.id"
                            class="h-full"
                        >
                            <ProductCard
                                :product="product"
                                @add-to-cart="handleAddToCart"
                            />
                        </li>
                    </ul>
                    <template #fallback>
                        <ul
                            class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                            role="list"
                            aria-label="Loading products"
                        >
                            <li
                                v-for="i in 9"
                                :key="i"
                                class="border-secondary-200 dark:border-secondary-800 dark:bg-secondary-900 flex h-full flex-col overflow-hidden rounded-xl border bg-white"
                            >
                                <div
                                    class="bg-secondary-200 dark:bg-secondary-800 aspect-4/5 animate-pulse"
                                />
                                <div class="flex flex-col gap-2 p-4">
                                    <Skeleton
                                        width="80%"
                                        height="1rem"
                                        aria-label="Loading"
                                    />
                                    <Skeleton
                                        width="40%"
                                        height="1.25rem"
                                        aria-label="Loading"
                                    />
                                </div>
                            </li>
                        </ul>
                    </template>
                </ClientOnly>

                <nav
                    v-if="filteredProducts.length > 0 && totalPages > 1"
                    class="mt-6 flex flex-wrap items-center justify-center gap-2"
                    :aria-label="t('categoriesPaginationAria')"
                >
                    <button
                        type="button"
                        class="text-secondary-700 hover:text-secondary-900 dark:text-secondary-300 dark:hover:text-secondary-50 border-secondary-300 hover:bg-secondary-100 dark:border-secondary-700 dark:hover:bg-secondary-800 inline-flex shrink-0 items-center gap-1 rounded-lg border px-2 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent sm:px-3 sm:py-2"
                        :aria-label="t('categoriesPagerPrevAria')"
                        :disabled="currentPage === 1"
                        tabindex="0"
                        @click="handlePrevPage"
                        @keydown="handlePrevKeyDown"
                    >
                        <Icon
                            name="heroicons:chevron-left"
                            class="size-4 shrink-0"
                            size="20"
                            aria-hidden="true"
                        />
                        <span class="hidden sm:inline">{{
                            t('categoriesPagerPrev')
                        }}</span>
                    </button>

                    <div
                        class="flex shrink-0 items-center gap-1"
                        role="group"
                        :aria-label="
                            t('categoriesPagerPage', {
                                current: currentPage,
                                total: totalPages,
                            })
                        "
                    >
                        <button
                            v-for="page in totalPages"
                            :key="page"
                            type="button"
                            class="text-secondary-700 hover:text-secondary-900 dark:text-secondary-300 dark:hover:text-secondary-50 hover:bg-secondary-100 dark:border-secondary-700 dark:hover:bg-secondary-800 min-w-8 rounded-lg border px-2.5 py-1.5 text-sm font-medium transition sm:min-w-9 sm:px-3 sm:py-2"
                            :class="{
                                'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-950/50 dark:text-primary-300 dark:border-primary-600':
                                    page === currentPage,
                                'border-secondary-300 dark:border-secondary-700':
                                    page !== currentPage,
                            }"
                            :aria-label="
                                t('categoriesPagerPageAria', { n: page })
                            "
                            :aria-current="
                                page === currentPage ? 'page' : undefined
                            "
                            tabindex="0"
                            @click="handlePageChange(page)"
                            @keydown="handlePageKeyDown($event, page)"
                        >
                            {{ page }}
                        </button>
                    </div>

                    <button
                        type="button"
                        class="text-secondary-700 hover:text-secondary-900 dark:text-secondary-300 dark:hover:text-secondary-50 border-secondary-300 hover:bg-secondary-100 dark:border-secondary-700 dark:hover:bg-secondary-800 inline-flex shrink-0 items-center gap-1 rounded-lg border px-2 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent sm:px-3 sm:py-2"
                        :aria-label="t('categoriesPagerNextAria')"
                        :disabled="currentPage === totalPages"
                        tabindex="0"
                        @click="handleNextPage"
                        @keydown="handleNextKeyDown"
                    >
                        <span class="hidden sm:inline">{{
                            t('categoriesPagerNext')
                        }}</span>
                        <Icon
                            name="heroicons:chevron-right"
                            class="size-4 shrink-0"
                            size="20"
                            aria-hidden="true"
                        />
                    </button>
                </nav>
            </section>
        </div>
    </div>
</template>
