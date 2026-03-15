<script setup lang="ts">
import type { Product } from '~/types/product';

interface Props {
    product: Product;
}

interface Emits {
    (
        e: 'add-to-cart',
        payload: { product: Product; size: string; color: string },
    ): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const { t } = useI18n();

function formatPrice(price: number): string {
    return new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN',
        minimumFractionDigits: 2,
    }).format(price);
}

function handleAddToCart(payload: {
    product: Product;
    size: string;
    color: string;
}) {
    emit('add-to-cart', payload);
}
</script>

<template>
    <div
        class="group border-secondary-200 dark:border-secondary-800 dark:bg-secondary-900 focus-within:ring-primary-500 flex flex-col overflow-hidden rounded-xl border bg-white transition-shadow focus-within:ring-2 focus-within:ring-offset-2 hover:shadow-lg"
        role="article"
        :aria-label="t('productCardAria', { name: product.name })"
    >
        <NuxtLink
            :to="`/shop/product/${product.id}`"
            class="flex flex-col outline-none"
            tabindex="0"
            :aria-label="t('productCardViewAria', { name: product.name })"
        >
            <div
                class="bg-secondary-100 dark:bg-secondary-800 group-hover:bg-secondary-200 dark:group-hover:bg-secondary-700 relative flex aspect-4/5 items-center justify-center overflow-hidden transition-colors"
            >
                <img
                    v-if="product.imageUrl"
                    :src="product.imageUrl"
                    :alt="product.name"
                    class="size-full object-cover"
                    loading="lazy"
                />
                <div
                    v-else
                    class="flex size-full items-center justify-center"
                    :aria-label="t('categoriesProductImagePlaceholder')"
                >
                    <Icon
                        name="heroicons:photo"
                        class="text-secondary-400 dark:text-secondary-100 size-16"
                        aria-hidden="true"
                    />
                </div>
            </div>

            <div class="flex flex-col p-4">
                <h3
                    class="text-secondary-900 dark:text-secondary-50 group-hover:text-primary-600 dark:group-hover:text-primary-400 line-clamp-2 font-medium transition-colors"
                >
                    {{ product.name }}
                </h3>
                <p
                    class="text-primary-600 dark:text-primary-400 mt-1 text-lg font-semibold"
                >
                    {{ formatPrice(product.price) }}
                </p>
            </div>
        </NuxtLink>

        <div
            class="border-secondary-200 dark:border-secondary-800 flex flex-col gap-3 border-t px-4 py-3"
        >
            <ProductOptions
                :product="product"
                :compact="true"
                :show-details-link="true"
                @add-to-cart="handleAddToCart"
            />
        </div>
    </div>
</template>
