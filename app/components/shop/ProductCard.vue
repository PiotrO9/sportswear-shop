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

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { t } = useI18n();

const productImages = computed(() => props.product.images ?? []);
const hasImages = computed(() => productImages.value.length > 0);
const hasMultipleImages = computed(() => productImages.value.length > 1);
const imageContainerClass = computed(() => {
    if (props.product.imageContainerTheme === 'light') {
        return 'bg-white dark:bg-white group-hover:bg-secondary-50 dark:group-hover:bg-secondary-50';
    }

    return 'bg-secondary-100 dark:bg-secondary-800 group-hover:bg-secondary-200 dark:group-hover:bg-secondary-700';
});
const imageInteractionClass = computed(() => {
    if (!hasMultipleImages.value) return undefined;
    if (isDragging.value) return 'cursor-grabbing select-none';

    return 'cursor-grab';
});
const activeImageSrc = computed(
    () => productImages.value[activeImageIndex.value],
);

const activeImageIndex = ref(0);
const slideDirection = ref<'left' | 'right'>('right');
const isAnimating = ref(false);
const isDragging = ref(false);
const dragStartX = ref(0);
const activePointerId = ref<number | null>(null);

const SWIPE_THRESHOLD_PX = 40;

function showPrevImage(): void {
    if (!hasMultipleImages.value || isAnimating.value) return;

    slideDirection.value = 'left';
    isAnimating.value = true;
    activeImageIndex.value =
        (activeImageIndex.value - 1 + productImages.value.length) %
        productImages.value.length;
}

function showNextImage(): void {
    if (!hasMultipleImages.value || isAnimating.value) return;

    slideDirection.value = 'right';
    isAnimating.value = true;
    activeImageIndex.value =
        (activeImageIndex.value + 1) % productImages.value.length;
}

function handlePrevImage(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    showPrevImage();
}

function handleNextImage(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    showNextImage();
}

function handleDotClick(event: Event, index: number): void {
    event.preventDefault();
    event.stopPropagation();
    if (index === activeImageIndex.value || isAnimating.value) return;

    slideDirection.value = index > activeImageIndex.value ? 'right' : 'left';
    isAnimating.value = true;
    activeImageIndex.value = index;
}

function handleTransitionEnd(): void {
    isAnimating.value = false;
}

function resetPointerState(): void {
    isDragging.value = false;
    activePointerId.value = null;
}

function handleImagePointerDown(event: PointerEvent): void {
    if (!hasMultipleImages.value || isAnimating.value) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    activePointerId.value = event.pointerId;
    dragStartX.value = event.clientX;
    isDragging.value = true;
}

function handleImagePointerUp(event: PointerEvent): void {
    if (!isDragging.value || activePointerId.value !== event.pointerId) return;

    const dragDeltaX = event.clientX - dragStartX.value;
    const isSwipeGesture = Math.abs(dragDeltaX) >= SWIPE_THRESHOLD_PX;

    if (isSwipeGesture) {
        if (dragDeltaX > 0) {
            showPrevImage();
        } else {
            showNextImage();
        }
    }

    resetPointerState();
}

function handleImagePointerCancel(event: PointerEvent): void {
    if (activePointerId.value !== event.pointerId) return;
    resetPointerState();
}

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
        class="group border-secondary-200 dark:border-secondary-800 dark:bg-secondary-900 flex flex-col overflow-hidden rounded-xl border bg-white transition-shadow hover:shadow-lg"
        role="article"
        :aria-label="t('productCardAria', { name: product.name })"
    >
        <div
            class="flex flex-col"
            :aria-label="t('productCardViewAria', { name: product.name })"
        >
            <div
                class="relative flex aspect-4/5 items-center justify-center overflow-hidden transition-colors"
                :class="[imageContainerClass, imageInteractionClass]"
                @pointerdown="handleImagePointerDown"
                @pointerup="handleImagePointerUp"
                @pointercancel="handleImagePointerCancel"
                @pointerleave="handleImagePointerCancel"
                @dragstart.prevent
            >
                <template v-if="hasImages">
                    <Transition
                        :name="
                            slideDirection === 'right'
                                ? 'card-slide-right'
                                : 'card-slide-left'
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
                            loading="lazy"
                            draggable="false"
                        />
                    </Transition>

                    <template v-if="hasMultipleImages">
                        <button
                            type="button"
                            class="dark:bg-secondary-900/70 dark:hover:bg-secondary-900 absolute top-1/2 left-2 z-10 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/70 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white"
                            :aria-label="t('productCardPrevImage')"
                            tabindex="0"
                            @click="handlePrevImage"
                            @keydown.enter="handlePrevImage"
                        >
                            <Icon
                                name="heroicons:chevron-left"
                                class="text-secondary-700 dark:text-secondary-200 size-4"
                                aria-hidden="true"
                            />
                        </button>

                        <button
                            type="button"
                            class="dark:bg-secondary-900/70 dark:hover:bg-secondary-900 absolute top-1/2 right-2 z-10 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/70 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white"
                            :aria-label="t('productCardNextImage')"
                            tabindex="0"
                            @click="handleNextImage"
                            @keydown.enter="handleNextImage"
                        >
                            <Icon
                                name="heroicons:chevron-right"
                                class="text-secondary-700 dark:text-secondary-200 size-4"
                                aria-hidden="true"
                            />
                        </button>

                        <div
                            class="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5"
                            role="tablist"
                            :aria-label="t('productCardImageIndicators')"
                        >
                            <button
                                v-for="(_, index) in productImages"
                                :key="index"
                                type="button"
                                class="cursor-pointer rounded-full transition-all duration-300"
                                :class="
                                    index === activeImageIndex
                                        ? 'bg-primary-600 dark:bg-primary-400 h-2 w-5'
                                        : 'bg-secondary-400/60 hover:bg-secondary-500 dark:bg-secondary-500/60 dark:hover:bg-secondary-400 size-2'
                                "
                                role="tab"
                                :aria-selected="index === activeImageIndex"
                                :aria-label="
                                    t('productCardImageDot', {
                                        index: index + 1,
                                    })
                                "
                                tabindex="0"
                                @click="handleDotClick($event, index)"
                                @keydown.enter="handleDotClick($event, index)"
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
        </div>

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

<style scoped>
.card-slide-right-enter-active,
.card-slide-right-leave-active,
.card-slide-left-enter-active,
.card-slide-left-leave-active {
    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.card-slide-right-enter-from {
    opacity: 0;
    transform: translateX(40px) scale(0.97);
}

.card-slide-right-leave-to {
    opacity: 0;
    transform: translateX(-40px) scale(0.97);
}

.card-slide-left-enter-from {
    opacity: 0;
    transform: translateX(-40px) scale(0.97);
}

.card-slide-left-leave-to {
    opacity: 0;
    transform: translateX(40px) scale(0.97);
}
</style>
