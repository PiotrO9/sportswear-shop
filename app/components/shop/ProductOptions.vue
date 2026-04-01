<script setup lang="ts">
import type {
    Product,
    ProductColor,
    ProductMaterial,
    ProductSize,
} from '~/types/product';

interface Props {
    product: Product;
    compact?: boolean;
    showDetailsLink?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    compact: false,
    showDetailsLink: true,
});

const emit = defineEmits<{
    (
        e: 'add-to-cart',
        payload: { product: Product; size: ProductSize; color: ProductColor },
    ): void;
}>();

const { t } = useI18n();

const selectedSize = ref<ProductSize | null>(null);
const selectedColor = ref<ProductColor | null>(null);

const sizeLabelKeyMap: Record<ProductSize, string> = {
    XS: 'creatorOptionXs',
    S: 'creatorOptionS',
    M: 'creatorOptionM',
    L: 'creatorOptionL',
    XL: 'creatorOptionXl',
    XXL: 'creatorOptionXxl',
};

const colorClassMap: Record<ProductColor, string> = {
    black: 'bg-black',
    white: 'bg-white ring-1 ring-secondary-300 dark:ring-secondary-600',
    grey: 'bg-gray-400',
    navy: 'bg-blue-900',
    red: 'bg-red-500',
    blue: 'bg-blue-500',
};

const materialLabelKeyMap: Record<ProductMaterial, string> = {
    cotton: 'creatorOptionCotton',
    polyester: 'creatorOptionPolyester',
    blend: 'creatorOptionBlend',
    lycra: 'creatorOptionLycra',
};

const categoryLabelKeyMap: Record<Product['category'], string> = {
    men: 'navMen',
    women: 'navWomen',
    kids: 'navKids',
    sport: 'navSport',
};

onMounted(() => {
    if (props.product.sizes.length > 0 && !selectedSize.value) {
        selectedSize.value = props.product.sizes[0] ?? null;
    }

    if (props.product.colors.length > 0 && !selectedColor.value) {
        selectedColor.value = props.product.colors[0] ?? null;
    }
});

watch(
    () => props.product,
    (product) => {
        if (
            product.sizes.length > 0 &&
            (selectedSize.value === null ||
                !product.sizes.includes(selectedSize.value))
        ) {
            selectedSize.value = product.sizes[0] ?? null;
        }

        if (
            product.colors.length > 0 &&
            (selectedColor.value === null ||
                !product.colors.includes(selectedColor.value))
        ) {
            selectedColor.value = product.colors[0] ?? null;
        }
    },
    { immediate: true },
);

function handleSizeSelect(size: ProductSize) {
    selectedSize.value = size;
}

function handleSizeKeyDown(event: KeyboardEvent, size: ProductSize) {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    handleSizeSelect(size);
}

function handleColorSelect(color: ProductColor) {
    selectedColor.value = color;
}

function handleColorKeyDown(event: KeyboardEvent, color: ProductColor) {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    handleColorSelect(color);
}

function handleAddToCart() {
    if (!selectedSize.value || !selectedColor.value) return;

    emit('add-to-cart', {
        product: props.product,
        size: selectedSize.value,
        color: selectedColor.value,
    });
}

function handleAddToCartKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    handleAddToCart();
}
</script>

<template>
    <div class="flex flex-col gap-4" :class="{ 'gap-3': compact }">
        <div v-if="product.sizes.length > 0" class="flex flex-col gap-1.5">
            <span
                class="text-secondary-600 dark:text-secondary-400 font-medium"
                :class="compact ? 'text-xs' : 'text-sm'"
            >
                {{ t('productCardSize') }}
            </span>
            <div
                class="flex flex-wrap gap-1.5"
                role="group"
                :aria-label="t('productCardSizeAria')"
            >
                <button
                    v-for="size in product.sizes"
                    :key="size"
                    type="button"
                    class="focus-visible:ring-primary-500 cursor-pointer rounded-md border font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    :class="[
                        compact
                            ? 'min-w-8 px-2 py-1 text-xs'
                            : 'min-w-10 px-3 py-2 text-sm',
                        selectedSize === size
                            ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-950/50 dark:text-primary-300 dark:border-primary-600'
                            : 'border-secondary-300 text-secondary-700 hover:border-secondary-400 dark:border-secondary-600 dark:bg-secondary-800 dark:text-secondary-300 dark:hover:border-secondary-500 bg-white',
                    ]"
                    :aria-label="
                        t('productCardSizeOptionAria', {
                            size: t(sizeLabelKeyMap[size]),
                        })
                    "
                    :aria-pressed="selectedSize === size"
                    tabindex="0"
                    @click="handleSizeSelect(size)"
                    @keydown="handleSizeKeyDown($event, size)"
                >
                    {{ size }}
                </button>
            </div>
        </div>

        <div v-if="product.colors.length > 0" class="flex flex-col gap-1.5">
            <span
                class="text-secondary-600 dark:text-secondary-400 font-medium"
                :class="compact ? 'text-xs' : 'text-sm'"
            >
                {{ t('productCardColor') }}
            </span>
            <div
                class="flex flex-wrap gap-2"
                role="group"
                :aria-label="t('productCardColorAria')"
            >
                <button
                    v-for="color in product.colors"
                    :key="color"
                    type="button"
                    class="focus-visible:ring-primary-500 cursor-pointer rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    :class="[
                        compact ? 'size-6' : 'size-8',
                        colorClassMap[color],
                        selectedColor === color
                            ? 'ring-primary-500 dark:ring-primary-400 ring-2 ring-offset-2'
                            : 'ring-secondary-300 hover:ring-secondary-400 dark:ring-secondary-600 dark:hover:ring-secondary-500 ring-1',
                    ]"
                    :aria-label="
                        t('productCardColorOptionAria', {
                            color: t(
                                `creatorOption${color.charAt(0).toUpperCase() + color.slice(1)}`,
                            ),
                        })
                    "
                    :aria-pressed="selectedColor === color"
                    tabindex="0"
                    @click="handleColorSelect(color)"
                    @keydown="handleColorKeyDown($event, color)"
                />
            </div>
        </div>

        <div
            class="text-secondary-500 dark:text-secondary-400 flex flex-wrap gap-x-3 gap-y-1"
            :class="compact ? 'text-xs' : 'text-sm'"
        >
            <span>
                {{ t('productCardCategory') }}:
                {{ t(categoryLabelKeyMap[product.category]) }}
            </span>
        </div>

        <div
            class="flex flex-col gap-2 pt-1"
            :class="compact ? 'sm:flex-row' : 'sm:flex-row sm:gap-3'"
        >
            <NuxtLink
                v-if="showDetailsLink"
                :to="`/shop/product/${product.id}`"
                class="border-primary-500 hover:bg-primary-50 dark:border-primary-600 dark:hover:bg-primary-950/30 inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-3 py-2 font-medium transition"
                :class="
                    compact
                        ? 'text-primary-600 dark:text-primary-400 text-sm'
                        : 'text-base'
                "
                :aria-label="
                    t('productCardViewDetailsAria', { name: product.name })
                "
            >
                {{ t('productCardViewDetails') }}
            </NuxtLink>
            <button
                type="button"
                class="bg-primary-500 hover:bg-primary-600 focus-visible:ring-primary-500 dark:bg-primary-600 dark:hover:bg-primary-700 inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg font-medium text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                :class="compact ? 'px-3 py-2 text-sm' : 'px-4 py-3 text-base'"
                :disabled="!selectedSize || !selectedColor"
                :aria-label="
                    t('productCardAddToCartAria', { name: product.name })
                "
                tabindex="0"
                @click="handleAddToCart"
                @keydown="handleAddToCartKeyDown"
            >
                <Icon
                    name="heroicons:shopping-cart"
                    class="size-4"
                    aria-hidden="true"
                />
            </button>
        </div>
    </div>
</template>
