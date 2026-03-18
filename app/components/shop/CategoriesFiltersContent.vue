<script setup lang="ts">
import type {
    ProductCategory,
    ProductColor,
    ProductMaterial,
    ProductSize,
    ProductSort,
} from '~/types/product';

interface Props {
    filterCategory: ProductCategory | 'all';
    filterMinPrice: string;
    filterMaxPrice: string;
    filterSize: ProductSize | null;
    filterMaterial: ProductMaterial | 'all';
    filterColor: ProductColor | 'all';
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
    'update:filterMaterial': [value: ProductMaterial | 'all'];
    'update:filterColor': [value: ProductColor | 'all'];
    'update:filterSort': [value: ProductSort];
    reset: [];
}>();

const { t } = useI18n();

const categoryOptions: { value: ProductCategory | 'all'; labelKey: string }[] =
    [
        { value: 'all', labelKey: 'categoriesFilterCategoryAll' },
        { value: 'men', labelKey: 'navMen' },
        { value: 'women', labelKey: 'navWomen' },
        { value: 'kids', labelKey: 'navKids' },
        { value: 'sport', labelKey: 'navSport' },
    ];

const materialOptions: { value: ProductMaterial | 'all'; labelKey: string }[] =
    [
        { value: 'all', labelKey: 'categoriesFilterMaterialAll' },
        { value: 'cotton', labelKey: 'creatorOptionCotton' },
        { value: 'polyester', labelKey: 'creatorOptionPolyester' },
        { value: 'blend', labelKey: 'creatorOptionBlend' },
        { value: 'lycra', labelKey: 'creatorOptionLycra' },
    ];

const colorOptions: { value: ProductColor | 'all'; labelKey: string }[] = [
    { value: 'all', labelKey: 'categoriesFilterColorAll' },
    { value: 'black', labelKey: 'creatorOptionBlack' },
    { value: 'white', labelKey: 'creatorOptionWhite' },
    { value: 'grey', labelKey: 'creatorOptionGrey' },
    { value: 'navy', labelKey: 'creatorOptionNavy' },
    { value: 'red', labelKey: 'creatorOptionRed' },
    { value: 'blue', labelKey: 'creatorOptionBlue' },
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

function handleMaterialChange(event: Event) {
    const target = event.target as HTMLSelectElement;

    emit('update:filterMaterial', target.value as ProductMaterial | 'all');
}

function handleColorChange(event: Event) {
    const target = event.target as HTMLSelectElement;

    emit('update:filterColor', target.value as ProductColor | 'all');
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

function handleMaterialUpdate(value: string | number) {
    emit('update:filterMaterial', value as ProductMaterial | 'all');
}

function handleColorUpdate(value: string | number) {
    emit('update:filterColor', value as ProductColor | 'all');
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
                :for="`${idPrefix}-material`"
            >
                {{ t('categoriesFilterMaterial') }}
            </label>
            <select
                v-if="compact"
                :id="`${idPrefix}-material`"
                :value="filterMaterial"
                :class="selectClass"
                :aria-label="t('categoriesFilterMaterial')"
                @change="handleMaterialChange"
            >
                <option
                    v-for="opt in materialOptions"
                    :key="opt.value"
                    :value="opt.value"
                >
                    {{ t(opt.labelKey) }}
                </option>
            </select>
            <RadioGroup
                v-else
                :model-value="filterMaterial"
                :aria-label="t('categoriesFilterMaterial')"
                orientation="vertical"
                @update:model-value="handleMaterialUpdate($event)"
            >
                <Radio
                    v-for="opt in materialOptions"
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
                :for="`${idPrefix}-color`"
            >
                {{ t('categoriesFilterColor') }}
            </label>
            <select
                v-if="compact"
                :id="`${idPrefix}-color`"
                :value="filterColor"
                :class="selectClass"
                :aria-label="t('categoriesFilterColor')"
                @change="handleColorChange"
            >
                <option
                    v-for="opt in colorOptions"
                    :key="opt.value"
                    :value="opt.value"
                >
                    {{ t(opt.labelKey) }}
                </option>
            </select>
            <RadioGroup
                v-else
                :model-value="filterColor"
                :aria-label="t('categoriesFilterColor')"
                orientation="vertical"
                @update:model-value="handleColorUpdate($event)"
            >
                <Radio
                    v-for="opt in colorOptions"
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
