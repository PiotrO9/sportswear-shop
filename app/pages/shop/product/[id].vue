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

const productImages = computed(() => product.value?.images ?? []);
const hasImages = computed(() => productImages.value.length > 0);
const hasMultipleImages = computed(() => productImages.value.length > 1);

const activeImageIndex = ref(0);
const slideDirection = ref<'left' | 'right'>('right');
const isAnimating = ref(false);

const activeImageSrc = computed(
    () => productImages.value[activeImageIndex.value],
);

function handleGoToImage(index: number): void {
    if (index === activeImageIndex.value || isAnimating.value) return;

    slideDirection.value = index > activeImageIndex.value ? 'right' : 'left';
    isAnimating.value = true;
    activeImageIndex.value = index;
}

function handlePrevImage(): void {
    if (!hasMultipleImages.value || isAnimating.value) return;

    slideDirection.value = 'left';
    isAnimating.value = true;
    activeImageIndex.value =
        (activeImageIndex.value - 1 + productImages.value.length) %
        productImages.value.length;
}

function handleNextImage(): void {
    if (!hasMultipleImages.value || isAnimating.value) return;

    slideDirection.value = 'right';
    isAnimating.value = true;
    activeImageIndex.value =
        (activeImageIndex.value + 1) % productImages.value.length;
}

function handleTransitionEnd(): void {
    isAnimating.value = false;
}

function handlePrevKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handlePrevImage();
    }
}

function handleNextKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleNextImage();
    }
}

function handleThumbnailKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleGoToImage(index);
    }
}

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
            <div class="flex flex-col gap-3">
                <div
                    class="bg-secondary-100 dark:bg-secondary-800 relative flex aspect-4/5 items-center justify-center overflow-hidden rounded-xl"
                >
                    <template v-if="hasImages">
                        <Transition
                            :name="
                                slideDirection === 'right'
                                    ? 'slide-right'
                                    : 'slide-left'
                            "
                            mode="out-in"
                            @after-enter="handleTransitionEnd"
                            @after-leave="handleTransitionEnd"
                        >
                            <img
                                :key="activeImageIndex"
                                :src="activeImageSrc"
                                :alt="`${product.name} - ${activeImageIndex + 1}`"
                                class="size-full object-contain"
                            />
                        </Transition>

                        <template v-if="hasMultipleImages">
                            <button
                                type="button"
                                class="bg-white/70 hover:bg-white dark:bg-secondary-900/70 dark:hover:bg-secondary-900 absolute left-3 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full shadow-lg backdrop-blur-sm transition-all hover:scale-110"
                                :aria-label="t('productCardPrevImage')"
                                tabindex="0"
                                @click="handlePrevImage"
                                @keydown="handlePrevKeyDown"
                            >
                                <Icon
                                    name="heroicons:chevron-left"
                                    class="text-secondary-700 dark:text-secondary-200 size-5"
                                    aria-hidden="true"
                                />
                            </button>

                            <button
                                type="button"
                                class="bg-white/70 hover:bg-white dark:bg-secondary-900/70 dark:hover:bg-secondary-900 absolute right-3 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full shadow-lg backdrop-blur-sm transition-all hover:scale-110"
                                :aria-label="t('productCardNextImage')"
                                tabindex="0"
                                @click="handleNextImage"
                                @keydown="handleNextKeyDown"
                            >
                                <Icon
                                    name="heroicons:chevron-right"
                                    class="text-secondary-700 dark:text-secondary-200 size-5"
                                    aria-hidden="true"
                                />
                            </button>

                            <div
                                class="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2"
                                role="tablist"
                                :aria-label="t('productCardImageIndicators')"
                            >
                                <button
                                    v-for="(_, index) in productImages"
                                    :key="index"
                                    type="button"
                                    class="rounded-full transition-all duration-300"
                                    :class="
                                        index === activeImageIndex
                                            ? 'bg-primary-600 dark:bg-primary-400 h-2.5 w-6'
                                            : 'bg-secondary-400/60 hover:bg-secondary-500 dark:bg-secondary-500/60 dark:hover:bg-secondary-400 size-2.5'
                                    "
                                    role="tab"
                                    :aria-selected="
                                        index === activeImageIndex
                                    "
                                    :aria-label="
                                        t('productCardImageDot', {
                                            index: index + 1,
                                        })
                                    "
                                    tabindex="0"
                                    @click="handleGoToImage(index)"
                                    @keydown="
                                        handleThumbnailKeyDown($event, index)
                                    "
                                />
                            </div>
                        </template>
                    </template>

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

                <div
                    v-if="hasMultipleImages"
                    class="flex gap-2"
                    role="tablist"
                    :aria-label="t('productCardImageIndicators')"
                >
                    <button
                        v-for="(image, index) in productImages"
                        :key="index"
                        type="button"
                        class="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg transition-all duration-300"
                        :class="
                            index === activeImageIndex
                                ? 'ring-primary-500 ring-2 ring-offset-2 dark:ring-offset-secondary-900'
                                : 'opacity-60 hover:opacity-100 ring-1 ring-secondary-200 dark:ring-secondary-700'
                        "
                        role="tab"
                        :aria-selected="index === activeImageIndex"
                        :aria-label="
                            t('productCardImageDot', { index: index + 1 })
                        "
                        tabindex="0"
                        @click="handleGoToImage(index)"
                        @keydown="handleThumbnailKeyDown($event, index)"
                    >
                        <img
                            :src="image"
                            :alt="`${product.name} - miniatura ${index + 1}`"
                            class="size-full object-cover"
                            loading="lazy"
                        />
                    </button>
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

<style scoped>
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-right-enter-from {
    opacity: 0;
    transform: translateX(60px) scale(0.97);
}

.slide-right-leave-to {
    opacity: 0;
    transform: translateX(-60px) scale(0.97);
}

.slide-left-enter-from {
    opacity: 0;
    transform: translateX(-60px) scale(0.97);
}

.slide-left-leave-to {
    opacity: 0;
    transform: translateX(60px) scale(0.97);
}
</style>
