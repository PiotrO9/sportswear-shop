<script setup lang="ts">
import type { Product } from '~/types/product';

const route = useRoute();
const { t } = useI18n();
const { getProductById } = useCategoriesProducts();
const { addToast } = useToast();

const productId = computed(() => String(route.params.id));
const product = computed<Product | undefined>(() =>
    getProductById(productId.value),
);

usePageMeta({
    title: () =>
        product.value
            ? `${product.value.name} – Sportswear Shop`
            : t('productNotFound'),
    description: () =>
        product.value
            ? t('productMetaDescription', {
                  name: product.value.name,
                  price: formatPrice(product.value.price),
              })
            : '',
});

function formatPrice(price: number): string {
    return new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN',
        minimumFractionDigits: 2,
    }).format(price);
}

function handleAddToCart(payload: {
    product: { name: string };
    size: string;
    color: string;
}) {
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
        <div
            v-if="!product"
            class="text-secondary-600 dark:text-secondary-400 border-secondary-300 dark:border-secondary-700 rounded-xl border border-dashed p-12 text-center"
        >
            <p class="text-lg font-medium">{{ t('productNotFound') }}</p>
            <NuxtLink
                to="/shop/categories"
                class="text-primary-600 dark:text-primary-400 mt-4 inline-block font-medium hover:underline"
            >
                {{ t('productBackToCategories') }}
            </NuxtLink>
        </div>

        <div v-else class="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div
                class="bg-secondary-100 dark:bg-secondary-800 relative flex aspect-4/5 items-center justify-center overflow-hidden rounded-xl"
            >
                <img
                    v-if="product.imageUrl"
                    :src="product.imageUrl"
                    :alt="product.name"
                    class="size-full object-cover"
                />
                <div
                    v-else
                    class="flex size-full items-center justify-center"
                    :aria-label="t('categoriesProductImagePlaceholder')"
                >
                    <Icon
                        name="heroicons:photo"
                        class="text-secondary-400 dark:text-secondary-500 size-24"
                        aria-hidden="true"
                    />
                </div>
            </div>

            <div class="flex flex-col">
                <h1
                    class="text-secondary-900 dark:text-secondary-50 text-2xl font-bold lg:text-3xl"
                >
                    {{ product.name }}
                </h1>
                <p
                    class="text-primary-600 dark:text-primary-400 mt-2 text-2xl font-semibold"
                >
                    {{ formatPrice(product.price) }}
                </p>

                <div class="mt-6">
                    <ProductOptions
                        :product="product"
                        :compact="false"
                        :show-details-link="false"
                        @add-to-cart="handleAddToCart"
                    />
                </div>

                <NuxtLink
                    to="/shop/categories"
                    class="text-primary-600 dark:text-primary-400 mt-8 inline-flex w-fit items-center gap-2 font-medium hover:underline"
                >
                    <Icon name="heroicons:arrow-left" class="size-4" />
                    {{ t('productBackToCategories') }}
                </NuxtLink>
            </div>
        </div>
    </div>
</template>
