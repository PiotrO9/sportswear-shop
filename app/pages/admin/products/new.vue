<script setup lang="ts">
import type { CreateAdminProductInput } from '~/types/admin-product';
import type { ProductCategory, ProductSize } from '~/types/product';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/shadcn/select';
import { normalizeStoredProductDescription } from '~/utils/product-description-html';

definePageMeta({
    middleware: ['admin'],
});

const localePath = useLocalePath();
const { t } = useI18n();
const { addToast } = useToast();
const { createProduct, uploadProductSharedImageToVariants } =
    useAdminProducts();

const isSaving = ref(false);
const formError = ref('');

const frontImageFile = ref<File | null>(null);
const backImageFile = ref<File | null>(null);
const frontPreviewUrl = ref<string | null>(null);
const backPreviewUrl = ref<string | null>(null);
const frontImageInputRef = ref<HTMLInputElement | null>(null);
const backImageInputRef = ref<HTMLInputElement | null>(null);

const name = ref('');
const slug = ref('');
const sku = ref('');
const description = ref('');
const price = ref<number | ''>('');
const category = ref<ProductCategory>('men');
const subcategory = ref('');
const status = ref<'draft' | 'active' | 'archived'>('draft');
const sizes = ref<ProductSize[]>(['M']);

const categoryOptions = computed(() => [
    { value: 'men' as const, label: t('navMen') },
    { value: 'women' as const, label: t('navWomen') },
    { value: 'kids' as const, label: t('navKids') },
    { value: 'sport' as const, label: t('navSport') },
]);

const sizeOptions: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const statusOptions = computed(() => [
    { value: 'draft' as const, label: t('adminStatusDraft') },
    { value: 'active' as const, label: t('adminStatusActive') },
    { value: 'archived' as const, label: t('adminStatusArchived') },
]);

const canSubmit = computed(() => {
    if (!name.value.trim() || !slug.value.trim() || !sku.value.trim()) {
        return false;
    }

    if (price.value === '' || Number(price.value) < 0) {
        return false;
    }

    if (sizes.value.length === 0) {
        return false;
    }

    return true;
});

function handleToggleSize(size: ProductSize): void {
    if (sizes.value.includes(size)) {
        sizes.value = sizes.value.filter((item) => item !== size);

        return;
    }

    sizes.value = [...sizes.value, size];
}

function handleCategorySelect(value: unknown): void {
    if (typeof value !== 'string' || !value) {
        return;
    }

    category.value = value as ProductCategory;
}

function handleStatusSelect(value: unknown): void {
    if (typeof value !== 'string' || !value) {
        return;
    }

    status.value = value as 'draft' | 'active' | 'archived';
}

function formatVariantSku(baseSku: string, sizeValue: ProductSize): string {
    return `${baseSku}-${sizeValue}`.toUpperCase();
}

function buildCreatePayload(): CreateAdminProductInput {
    const normalizedPrice = Number(price.value);
    const variants = sizes.value.map((sizeValue) => ({
        size: sizeValue,
        sku: formatVariantSku(sku.value.trim(), sizeValue),
        isActive: true,
        quantity: 0,
        lowStockThreshold: 3,
    }));

    return {
        name: name.value.trim(),
        slug: slug.value.trim(),
        sku: sku.value.trim().toUpperCase(),
        description: normalizeStoredProductDescription(description.value),
        price: normalizedPrice,
        category: category.value,
        subcategory: subcategory.value.trim() || null,
        status: status.value,
        options: {
            sizes: sizes.value,
        },
        variants,
    };
}

function revokePreview(url: string | null): void {
    if (url) {
        URL.revokeObjectURL(url);
    }
}

function isAcceptedImageFile(file: File): boolean {
    const accepted = ['image/jpeg', 'image/png', 'image/webp'];

    return accepted.includes(file.type);
}

function applyFrontImageFile(file: File | null): void {
    revokePreview(frontPreviewUrl.value);
    frontImageFile.value = file;
    frontPreviewUrl.value = file ? URL.createObjectURL(file) : null;
}

function applyBackImageFile(file: File | null): void {
    revokePreview(backPreviewUrl.value);
    backImageFile.value = file;
    backPreviewUrl.value = file ? URL.createObjectURL(file) : null;
}

function handleFrontImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (file && !isAcceptedImageFile(file)) {
        input.value = '';

        return;
    }

    applyFrontImageFile(file);
}

function handleBackImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (file && !isAcceptedImageFile(file)) {
        input.value = '';

        return;
    }

    applyBackImageFile(file);
}

function handleFrontImageDragOver(event: DragEvent): void {
    event.preventDefault();

    if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'copy';
    }
}

function handleBackImageDragOver(event: DragEvent): void {
    event.preventDefault();

    if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'copy';
    }
}

function handleFrontImageDrop(event: DragEvent): void {
    event.preventDefault();

    if (isSaving.value) {
        return;
    }

    const file = event.dataTransfer?.files?.[0] ?? null;

    if (!file || !isAcceptedImageFile(file)) {
        return;
    }

    applyFrontImageFile(file);

    if (frontImageInputRef.value) {
        frontImageInputRef.value.value = '';
    }
}

function handleBackImageDrop(event: DragEvent): void {
    event.preventDefault();

    if (isSaving.value) {
        return;
    }

    const file = event.dataTransfer?.files?.[0] ?? null;

    if (!file || !isAcceptedImageFile(file)) {
        return;
    }

    applyBackImageFile(file);

    if (backImageInputRef.value) {
        backImageInputRef.value.value = '';
    }
}

function handleClearFrontImage(): void {
    revokePreview(frontPreviewUrl.value);
    frontPreviewUrl.value = null;
    frontImageFile.value = null;

    if (frontImageInputRef.value) {
        frontImageInputRef.value.value = '';
    }
}

function handleClearBackImage(): void {
    revokePreview(backPreviewUrl.value);
    backPreviewUrl.value = null;
    backImageFile.value = null;

    if (backImageInputRef.value) {
        backImageInputRef.value.value = '';
    }
}

function handleNameBlur(): void {
    if (slug.value.trim()) {
        return;
    }

    const nextSlug = name.value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

    slug.value = nextSlug;
}

async function handleSubmit(): Promise<void> {
    if (!canSubmit.value || isSaving.value) {
        return;
    }

    isSaving.value = true;
    formError.value = '';

    try {
        const payload = buildCreatePayload();
        const created = await createProduct(payload);

        const hasProductPhotos =
            frontImageFile.value !== null || backImageFile.value !== null;

        if (hasProductPhotos) {
            if (frontImageFile.value) {
                await uploadProductSharedImageToVariants(
                    created.id,
                    frontImageFile.value,
                    {
                        alt: t('adminImageAltFront'),
                        isPrimary: true,
                    },
                );
            }

            if (backImageFile.value) {
                await uploadProductSharedImageToVariants(
                    created.id,
                    backImageFile.value,
                    {
                        alt: t('adminImageAltBack'),
                        isPrimary: false,
                    },
                );
            }
        }

        addToast({
            title: t('adminToastProductCreated'),
            description: hasProductPhotos
                ? t('adminToastProductCreatedWithPhotos', {
                      count: payload.variants.length,
                  })
                : t('adminToastProductCreatedNoPhotos', {
                      count: payload.variants.length,
                  }),
            variant: 'success',
        });

        await navigateTo(localePath(`/admin/products/${created.id}`));
    } catch (error) {
        const message =
            error instanceof Error ? error.message : t('adminUnknownError');

        formError.value = t('adminErrorCreateProduct', { message });

        addToast({
            title: t('adminToastSaveError'),
            description: formError.value,
            variant: 'error',
        });
    } finally {
        isSaving.value = false;
    }
}

onUnmounted(() => {
    revokePreview(frontPreviewUrl.value);
    revokePreview(backPreviewUrl.value);
});
</script>

<template>
    <AdminPanelShell
        :title="t('adminNewProductTitle')"
        :description="t('adminNewProductDescription')"
    >
        <Card :aria-label="t('adminNewProductFormAria')">
            <div class="grid gap-4 md:grid-cols-2">
                <div class="space-y-3 md:col-span-2">
                    <label
                        for="adminNewProductName"
                        class="text-secondary-600 dark:text-secondary-300 text-sm font-medium"
                    >
                        {{ t('adminFormProductName') }}
                    </label>
                    <Input
                        id="adminNewProductName"
                        v-model="name"
                        :aria-label="t('adminFormProductName')"
                        :placeholder="t('adminFormProductNamePlaceholder')"
                        @blur="handleNameBlur"
                    />
                </div>

                <div class="space-y-4">
                    <label
                        for="adminNewProductSlug"
                        class="text-secondary-600 dark:text-secondary-300 text-sm font-medium"
                    >
                        {{ t('adminFormSlug') }}
                    </label>
                    <Input
                        id="adminNewProductSlug"
                        v-model="slug"
                        :aria-label="t('adminFormSlug')"
                        :placeholder="t('adminFormSlugPlaceholder')"
                    />
                </div>

                <div class="space-y-4">
                    <label
                        for="adminNewProductSku"
                        class="text-secondary-600 dark:text-secondary-300 text-sm font-medium"
                    >
                        {{ t('adminFormBaseSku') }}
                    </label>
                    <Input
                        id="adminNewProductSku"
                        v-model="sku"
                        :aria-label="t('adminFormBaseSku')"
                        :placeholder="t('adminFormBaseSkuPlaceholder')"
                    />
                </div>

                <div class="space-y-4">
                    <label
                        for="adminNewProductPrice"
                        class="text-secondary-600 dark:text-secondary-300 text-sm font-medium"
                    >
                        {{ t('adminFormBasePrice') }}
                    </label>
                    <Input
                        id="adminNewProductPrice"
                        v-model="price"
                        type="number"
                        :aria-label="t('adminFormBasePrice')"
                        :placeholder="t('adminFormBasePricePlaceholder')"
                    />
                </div>

                <div class="space-y-4">
                    <label
                        for="adminNewProductSubcategory"
                        class="text-secondary-600 dark:text-secondary-300 text-sm font-medium"
                    >
                        {{ t('adminFormSubcategory') }}
                    </label>
                    <Input
                        id="adminNewProductSubcategory"
                        v-model="subcategory"
                        :aria-label="t('adminFormSubcategory')"
                        :placeholder="t('adminFormSubcategoryPlaceholder')"
                    />
                </div>

                <div class="space-y-4">
                    <label
                        id="adminNewProductCategoryLabel"
                        class="text-secondary-600 dark:text-secondary-300 text-sm font-medium"
                    >
                        {{ t('adminFormCategory') }}
                    </label>
                    <Select
                        :model-value="category"
                        :disabled="isSaving"
                        aria-labelledby="adminNewProductCategoryLabel"
                        @update:model-value="handleCategorySelect"
                    >
                        <SelectTrigger
                            id="adminNewProductCategory"
                            :aria-label="t('adminFormCategoryAria')"
                        >
                            <SelectValue
                                :placeholder="
                                    t('adminFormSelectCategoryPlaceholder')
                                "
                            />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem
                                v-for="option in categoryOptions"
                                :key="option.value"
                                :value="option.value"
                            >
                                {{ option.label }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div class="space-y-4">
                    <label
                        id="adminNewProductStatusLabel"
                        class="text-secondary-600 dark:text-secondary-300 text-sm font-medium"
                    >
                        {{ t('adminFormStatus') }}
                    </label>
                    <Select
                        :model-value="status"
                        :disabled="isSaving"
                        aria-labelledby="adminNewProductStatusLabel"
                        @update:model-value="handleStatusSelect"
                    >
                        <SelectTrigger
                            id="adminNewProductStatus"
                            :aria-label="t('adminFormStatusAria')"
                        >
                            <SelectValue
                                :placeholder="t('adminSelectStatusPlaceholder')"
                            />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem
                                v-for="option in statusOptions"
                                :key="option.value"
                                :value="option.value"
                            >
                                {{ option.label }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div class="space-y-4 md:col-span-2">
                    <label
                        for="adminNewProductDescription"
                        class="text-secondary-600 dark:text-secondary-300 text-sm font-medium"
                    >
                        {{ t('adminFormDescription') }}
                    </label>
                    <AdminProductDescriptionEditor
                        v-model="description"
                        input-id="adminNewProductDescription"
                        :aria-label="t('adminFormDescription')"
                        :disabled="isSaving"
                        :placeholder="t('adminFormDescriptionPlaceholder')"
                    />
                </div>
            </div>
        </Card>

        <Card :aria-label="t('adminProductImagesCardAria')">
            <template #header>
                <div class="space-y-4">
                    <p
                        class="text-secondary-900 dark:text-secondary-50 text-lg font-semibold tracking-tight"
                    >
                        {{ t('adminProductImagesTitle') }}
                    </p>
                    <p
                        class="text-secondary-600 dark:text-secondary-400 max-w-3xl text-sm leading-relaxed"
                    >
                        {{ t('adminProductImagesHint') }}
                    </p>
                </div>
            </template>

            <div class="grid gap-8 sm:grid-cols-2">
                <div
                    class="border-secondary-200 dark:border-secondary-700 bg-secondary-50/70 dark:bg-secondary-950/40 flex flex-col gap-5 rounded-2xl border p-5 sm:p-6"
                >
                    <div class="space-y-1">
                        <p
                            class="text-secondary-900 dark:text-secondary-50 text-base font-semibold"
                        >
                            {{ t('adminProductImageFrontTitle') }}
                        </p>
                        <p
                            class="text-secondary-500 dark:text-secondary-400 text-sm leading-snug"
                        >
                            {{ t('adminProductImageFrontHint') }}
                        </p>
                    </div>

                    <div
                        class="border-secondary-300 dark:border-secondary-600 hover:border-primary-400 dark:hover:border-primary-500 focus-within:border-primary-500 rounded-2xl border-2 border-dashed transition-colors"
                        @dragover="handleFrontImageDragOver"
                        @drop="handleFrontImageDrop"
                    >
                        <input
                            id="adminNewProductImageFront"
                            ref="frontImageInputRef"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            class="sr-only"
                            :disabled="isSaving"
                            aria-describedby="adminNewProductImageFrontHint"
                            @change="handleFrontImageChange"
                        />
                        <label
                            for="adminNewProductImageFront"
                            class="cursor-pointer"
                        >
                            <span
                                class="text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100/80 dark:hover:bg-secondary-800/50 flex min-h-[148px] flex-col items-center justify-center gap-3 rounded-[calc(1rem-2px)] px-4 py-8 text-center transition-colors"
                            >
                                <span
                                    class="bg-primary-500/15 text-primary-600 dark:text-primary-400 flex h-12 w-12 items-center justify-center rounded-2xl"
                                    aria-hidden="true"
                                >
                                    <svg
                                        class="h-6 w-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                </span>
                                <span class="text-sm font-medium">
                                    {{ t('adminDropImageHint') }}
                                </span>
                                <span
                                    id="adminNewProductImageFrontHint"
                                    class="text-secondary-500 dark:text-secondary-400 text-xs leading-relaxed"
                                >
                                    {{ t('adminImageFormatsHint') }}
                                </span>
                            </span>
                        </label>
                    </div>

                    <p
                        v-if="frontImageFile"
                        class="text-secondary-700 dark:text-secondary-300 truncate text-sm"
                        :title="frontImageFile.name"
                    >
                        <span
                            class="text-secondary-500 dark:text-secondary-400"
                        >
                            {{ t('adminSelectedFile') }}
                        </span>
                        {{ frontImageFile.name }}
                    </p>

                    <div
                        v-if="frontPreviewUrl"
                        class="border-secondary-200 dark:border-secondary-700 relative inline-block max-w-full overflow-hidden rounded-xl border"
                    >
                        <img
                            :src="frontPreviewUrl"
                            :alt="t('adminFrontPreviewAlt')"
                            class="h-40 w-full max-w-xs object-cover sm:h-44"
                        />
                        <button
                            type="button"
                            class="bg-secondary-900/85 text-secondary-50 hover:bg-secondary-900 absolute top-2 right-2 rounded-lg px-2.5 py-1 text-xs font-medium shadow-sm"
                            tabindex="0"
                            :aria-label="t('adminRemoveFrontImageAria')"
                            @click="handleClearFrontImage"
                            @keydown.enter.prevent="handleClearFrontImage"
                            @keydown.space.prevent="handleClearFrontImage"
                        >
                            {{ t('adminRemove') }}
                        </button>
                    </div>
                </div>

                <div
                    class="border-secondary-200 dark:border-secondary-700 bg-secondary-50/70 dark:bg-secondary-950/40 flex flex-col gap-5 rounded-2xl border p-5 sm:p-6"
                >
                    <div class="space-y-1">
                        <p
                            class="text-secondary-900 dark:text-secondary-50 text-base font-semibold"
                        >
                            {{ t('adminProductImageBackTitle') }}
                        </p>
                        <p
                            class="text-secondary-500 dark:text-secondary-400 text-sm leading-snug"
                        >
                            {{ t('adminProductImageBackHint') }}
                        </p>
                    </div>

                    <div
                        class="border-secondary-300 dark:border-secondary-600 hover:border-primary-400 dark:hover:border-primary-500 focus-within:border-primary-500 rounded-2xl border-2 border-dashed transition-colors"
                        @dragover="handleBackImageDragOver"
                        @drop="handleBackImageDrop"
                    >
                        <input
                            id="adminNewProductImageBack"
                            ref="backImageInputRef"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            class="sr-only"
                            :disabled="isSaving"
                            aria-describedby="adminNewProductImageBackHint"
                            @change="handleBackImageChange"
                        />
                        <label
                            for="adminNewProductImageBack"
                            class="cursor-pointer"
                        >
                            <span
                                class="text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100/80 dark:hover:bg-secondary-800/50 flex min-h-[148px] flex-col items-center justify-center gap-3 rounded-[calc(1rem-2px)] px-4 py-8 text-center transition-colors"
                            >
                                <span
                                    class="bg-primary-500/15 text-primary-600 dark:text-primary-400 flex h-12 w-12 items-center justify-center rounded-2xl"
                                    aria-hidden="true"
                                >
                                    <svg
                                        class="h-6 w-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                </span>
                                <span class="text-sm font-medium">
                                    {{ t('adminDropImageHint') }}
                                </span>
                                <span
                                    id="adminNewProductImageBackHint"
                                    class="text-secondary-500 dark:text-secondary-400 text-xs leading-relaxed"
                                >
                                    {{ t('adminImageFormatsHint') }}
                                </span>
                            </span>
                        </label>
                    </div>

                    <p
                        v-if="backImageFile"
                        class="text-secondary-700 dark:text-secondary-300 truncate text-sm"
                        :title="backImageFile.name"
                    >
                        <span class="text-secondary-500 dark:text-secondary-400"
                            >{{ t('adminSelectedFile') }}
                        </span>
                        {{ backImageFile.name }}
                    </p>

                    <div
                        v-if="backPreviewUrl"
                        class="border-secondary-200 dark:border-secondary-700 relative inline-block max-w-full overflow-hidden rounded-xl border"
                    >
                        <img
                            :src="backPreviewUrl"
                            :alt="t('adminBackPreviewAlt')"
                            class="h-40 w-full max-w-xs object-cover sm:h-44"
                        />
                        <button
                            type="button"
                            class="bg-secondary-900/85 text-secondary-50 hover:bg-secondary-900 absolute top-2 right-2 rounded-lg px-2.5 py-1 text-xs font-medium shadow-sm"
                            tabindex="0"
                            :aria-label="t('adminRemoveBackImageAria')"
                            @click="handleClearBackImage"
                            @keydown.enter.prevent="handleClearBackImage"
                            @keydown.space.prevent="handleClearBackImage"
                        >
                            {{ t('adminRemove') }}
                        </button>
                    </div>
                </div>
            </div>
        </Card>

        <Card :aria-label="t('adminVariantsConfigAria')">
            <template #header>
                <p
                    class="text-secondary-900 dark:text-secondary-50 font-semibold"
                >
                    {{ t('adminVariantsSizeSection') }}
                </p>
            </template>

            <div class="space-y-3">
                <p
                    class="text-secondary-700 dark:text-secondary-300 text-sm font-medium"
                >
                    {{ t('adminSizesLabel') }}
                </p>
                <div class="flex flex-wrap gap-2">
                    <button
                        v-for="sizeValue in sizeOptions"
                        :key="sizeValue"
                        type="button"
                        class="rounded-lg border px-3 py-1.5 text-sm font-medium transition"
                        :class="
                            sizes.includes(sizeValue)
                                ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-300'
                                : 'border-secondary-300 text-secondary-700 hover:bg-secondary-100 dark:border-secondary-700 dark:text-secondary-300 dark:hover:bg-secondary-800'
                        "
                        :aria-pressed="sizes.includes(sizeValue)"
                        :aria-label="
                            t('adminToggleSizeAria', { size: sizeValue })
                        "
                        @click="handleToggleSize(sizeValue)"
                    >
                        {{ sizeValue }}
                    </button>
                </div>
            </div>
        </Card>

        <Card v-if="formError" :aria-label="t('adminFormErrorAria')">
            <p class="text-danger-600 dark:text-danger-300 text-sm">
                {{ formError }}
            </p>
        </Card>

        <div class="flex flex-wrap gap-2">
            <Action
                :aria-label="t('adminSaveNewProductAria')"
                :is-loading="isSaving"
                :is-disabled="!canSubmit || isSaving"
                @click="handleSubmit"
            >
                {{ t('adminSaveProduct') }}
            </Action>
            <NuxtLink
                :to="localePath('/admin/products')"
                class="text-secondary-700 dark:text-secondary-200 border-secondary-300 dark:border-secondary-700 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-xl border px-4 py-2 text-sm font-semibold transition"
                :aria-label="t('adminCancelBackToListAria')"
            >
                {{ t('adminCancel') }}
            </NuxtLink>
        </div>
    </AdminPanelShell>
</template>
