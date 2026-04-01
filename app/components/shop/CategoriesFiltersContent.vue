<script setup lang="ts">
import type {
    ProductCategory,
    ProductSize,
    ProductSort,
} from '~/types/product';

interface Props {
    filterCategory: ProductCategory | 'all';
    filterMinPrice: string;
    filterMaxPrice: string;
    filterSize: ProductSize | null;
    filterSort: ProductSort;
    idPrefix?: string;
    compact?: boolean;
    hideTitle?: boolean;
}
withDefaults(defineProps<Props>(), {
    idPrefix: 'filter',
    compact: false,
    hideTitle: false,
});

const emit = defineEmits<{
    'update:filterCategory': [value: ProductCategory | 'all'];
    'update:filterMinPrice': [value: string];
    'update:filterMaxPrice': [value: string];
    'update:filterSize': [value: ProductSize | null];
    'update:filterSort': [value: ProductSort];
    reset: [];
}>();

const { t } = useI18n();
const { isDarkGallery, setIsDarkGallery } = useProductGalleryBackground();

function handleGalleryBackgroundChange(value: boolean): void {
    setIsDarkGallery(value);
}

const categoryOptions: { value: ProductCategory | 'all'; labelKey: string }[] =
    [
        { value: 'all', labelKey: 'categoriesFilterCategoryAll' },
        { value: 'men', labelKey: 'navMen' },
        { value: 'women', labelKey: 'navWomen' },
        { value: 'kids', labelKey: 'navKids' },
        { value: 'sport', labelKey: 'navSport' },
    ];

const sortOptions: { value: ProductSort; labelKey: string }[] = [
    { value: 'price-asc', labelKey: 'categoriesFilterSortPriceAsc' },
    { value: 'price-desc', labelKey: 'categoriesFilterSortPriceDesc' },
    { value: 'name-asc', labelKey: 'categoriesFilterSortName' },
];

const sizeOptions: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const selectClass =
    'block w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-900 shadow-sm transition outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:focus-visible:ring-offset-slate-950';

function handleSizeChange(event: Event) {
    const target = event.target as HTMLSelectElement;

    emit(
        'update:filterSize',
        target.value ? (target.value as ProductSize) : null,
    );
}

function handleResetKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    emit('reset');
}

function handleCategoryChange(event: Event) {
    const target = event.target as HTMLSelectElement;

    emit('update:filterCategory', target.value as ProductCategory | 'all');
}

function handleSortChange(event: Event) {
    const target = event.target as HTMLSelectElement;

    emit('update:filterSort', target.value as ProductSort);
}

function handleCategoryUpdate(value: string | number) {
    emit('update:filterCategory', value as ProductCategory | 'all');
}

function handleMinPriceUpdate(value: string | number) {
    emit('update:filterMinPrice', String(value));
}

function handleMaxPriceUpdate(value: string | number) {
    emit('update:filterMaxPrice', String(value));
}

function handleSortUpdate(value: string | number) {
    emit('update:filterSort', value as ProductSort);
}
</script>

<template>
    <h2
        v-if="!hideTitle"
        class="text-secondary-900 dark:text-secondary-50 text-sm font-semibold"
        :class="compact ? 'mb-1.5' : 'mb-4'"
    >
        {{ t('categoriesFilters') }}
    </h2>

    <div :class="[compact ? 'space-y-2' : 'space-y-5', hideTitle && 'pt-0']">
        <div
            class="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/50"
            :class="compact ? 'py-1.5' : 'py-2.5'"
        >
            <div class="min-w-0 flex-1 pr-2">
                <p
                    class="text-sm font-medium text-slate-800 dark:text-slate-100"
                >
                    {{ t('categoriesFilterGalleryBackgroundLabel') }}
                </p>
                <p
                    class="text-secondary-600 dark:text-secondary-400 mt-0.5 text-xs"
                >
                    {{ t('categoriesFilterGalleryBackgroundHint') }}
                </p>
            </div>
            <div class="flex shrink-0 self-center">
                <Switch
                    :checked="isDarkGallery"
                    :accessible-label="
                        t('categoriesFilterGalleryBackgroundSwitchAria')
                    "
                    @update:checked="handleGalleryBackgroundChange"
                />
            </div>
        </div>

        <div :class="compact ? 'space-y-1' : 'space-y-2'">
            <label
                class="block text-base font-medium text-slate-700 dark:text-slate-300"
                :for="`${idPrefix}-category`"
            >
                {{ t('categoriesFilterCategory') }}
            </label>
            <select
                v-if="compact"
                :id="`${idPrefix}-category`"
                :value="filterCategory"
                :class="selectClass"
                :aria-label="t('categoriesFilterCategory')"
                @change="handleCategoryChange"
            >
                <option
                    v-for="opt in categoryOptions"
                    :key="opt.value"
                    :value="opt.value"
                >
                    {{ t(opt.labelKey) }}
                </option>
            </select>
            <RadioGroup
                v-else
                :model-value="filterCategory"
                :aria-label="t('categoriesFilterCategory')"
                orientation="vertical"
                @update:model-value="handleCategoryUpdate($event)"
            >
                <Radio
                    v-for="opt in categoryOptions"
                    :key="opt.value"
                    :value="opt.value"
                    :aria-label="t(opt.labelKey)"
                >
                    {{ t(opt.labelKey) }}
                </Radio>
            </RadioGroup>
        </div>

        <div :class="compact ? 'space-y-1' : 'space-y-2'">
            <label
                class="block text-base font-medium text-slate-700 dark:text-slate-300"
                :for="`${idPrefix}-min-price`"
            >
                {{ t('categoriesFilterPrice') }}
            </label>
            <div class="flex gap-2">
                <Input
                    :id="`${idPrefix}-min-price`"
                    :model-value="filterMinPrice"
                    type="number"
                    :placeholder="t('categoriesFilterPriceMin')"
                    :aria-label="t('categoriesFilterPriceMin')"
                    @update:model-value="handleMinPriceUpdate($event)"
                />
                <Input
                    :id="`${idPrefix}-max-price`"
                    :model-value="filterMaxPrice"
                    type="number"
                    :placeholder="t('categoriesFilterPriceMax')"
                    :aria-label="t('categoriesFilterPriceMax')"
                    @update:model-value="handleMaxPriceUpdate($event)"
                />
            </div>
        </div>

        <div :class="compact ? 'space-y-1' : 'space-y-2'">
            <label
                class="block text-base font-medium text-slate-700 dark:text-slate-300"
                :for="`${idPrefix}-size`"
            >
                {{ t('categoriesFilterSize') }}
            </label>
            <select
                :id="`${idPrefix}-size`"
                :value="filterSize ?? ''"
                :class="selectClass"
                :aria-label="t('categoriesFilterSize')"
                @change="handleSizeChange"
            >
                <option value="">
                    {{ t('categoriesFilterSizePlaceholder') }}
                </option>
                <option v-for="size in sizeOptions" :key="size" :value="size">
                    {{ size }}
                </option>
            </select>
        </div>

        <div :class="compact ? 'space-y-1' : 'space-y-2'">
            <label
                class="block text-base font-medium text-slate-700 dark:text-slate-300"
                :for="`${idPrefix}-sort`"
            >
                {{ t('categoriesFilterSort') }}
            </label>
            <select
                v-if="compact"
                :id="`${idPrefix}-sort`"
                :value="filterSort"
                :class="selectClass"
                :aria-label="t('categoriesFilterSort')"
                @change="handleSortChange"
            >
                <option
                    v-for="opt in sortOptions"
                    :key="opt.value"
                    :value="opt.value"
                >
                    {{ t(opt.labelKey) }}
                </option>
            </select>
            <RadioGroup
                v-else
                :model-value="filterSort"
                :aria-label="t('categoriesFilterSort')"
                orientation="vertical"
                @update:model-value="handleSortUpdate($event)"
            >
                <Radio
                    v-for="opt in sortOptions"
                    :key="opt.value"
                    :value="opt.value"
                    :aria-label="t(opt.labelKey)"
                >
                    {{ t(opt.labelKey) }}
                </Radio>
            </RadioGroup>
        </div>

        <button
            type="button"
            class="text-secondary-700 hover:text-secondary-900 dark:text-secondary-300 dark:hover:text-secondary-50 border-secondary-300 hover:bg-secondary-100 dark:border-secondary-700 dark:hover:bg-secondary-800 w-full rounded-lg border px-3 text-sm font-medium transition"
            :class="compact ? 'py-1' : 'py-2'"
            :aria-label="t('categoriesFilterReset')"
            tabindex="0"
            @click="emit('reset')"
            @keydown="handleResetKeyDown"
        >
            {{ t('categoriesFilterReset') }}
        </button>
    </div>
</template>
