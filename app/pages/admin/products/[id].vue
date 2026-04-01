<script setup lang="ts">
import type { AdminProduct } from '~/types/admin-product';
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

const route = useRoute();
const { t } = useI18n();
const { addToast } = useToast();
const { getProductById, updateProduct, uploadVariantImage } =
    useAdminProducts();

const isLoading = ref(true);
const isSaving = ref(false);
const loadError = ref('');
const saveError = ref('');
const uploadingVariantId = ref<string | null>(null);

const productId = computed(() => String(route.params.id));

const form = reactive({
    name: '',
    slug: '',
    sku: '',
    description: '',
    price: 0,
    status: 'draft' as 'draft' | 'active' | 'archived',
});

const productDetail = ref<AdminProduct | null>(null);

const variantsPreview = computed(() => {
    const product = productDetail.value;

    if (!product) {
        return [];
    }

    return product.variants.map((variant) => ({
        id: variant.id,
        size: variant.size,
        sku: variant.sku,
        images: variant.images,
        quantity:
            product.inventory.find(
                (inventoryItem) => inventoryItem.variantId === variant.id,
            )?.quantity ?? 0,
    }));
});

const statusOptions = computed(() => [
    { value: 'draft' as const, label: t('adminStatusDraft') },
    { value: 'active' as const, label: t('adminStatusActive') },
    { value: 'archived' as const, label: t('adminStatusArchived') },
]);

function handleProductStatusSelect(value: unknown): void {
    if (typeof value !== 'string' || !value) {
        return;
    }

    form.status = value as 'draft' | 'active' | 'archived';
}

async function handleLoadProduct(): Promise<void> {
    isLoading.value = true;
    loadError.value = '';

    try {
        const product = await getProductById(productId.value);

        form.name = product.name;
        form.slug = product.slug;
        form.sku = product.sku;
        form.description = product.description ?? '';
        form.price = product.price;
        form.status = product.status;

        productDetail.value = product;
    } catch (error) {
        productDetail.value = null;
        const message =
            error instanceof Error ? error.message : t('adminUnknownError');

        loadError.value = t('adminErrorLoadProduct', { message });
    } finally {
        isLoading.value = false;
    }
}

async function handleSaveProduct(): Promise<void> {
    if (isSaving.value) {
        return;
    }

    isSaving.value = true;
    saveError.value = '';

    try {
        await updateProduct(productId.value, {
            name: form.name,
            slug: form.slug,
            sku: form.sku,
            description: normalizeStoredProductDescription(form.description),
            price: form.price,
            status: form.status,
        });

        addToast({
            title: t('adminToastChangesSaved'),
            description: t('adminToastChangesSavedDesc'),
            variant: 'success',
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : t('adminUnknownError');

        saveError.value = t('adminErrorSaveProduct', { message });
        addToast({
            title: t('adminToastSaveError'),
            description: saveError.value,
            variant: 'error',
        });
    } finally {
        isSaving.value = false;
    }
}

async function handleVariantImageSelected(
    variantId: string,
    event: Event,
): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file || uploadingVariantId.value) {
        return;
    }

    uploadingVariantId.value = variantId;

    try {
        await uploadVariantImage(productId.value, variantId, file);

        addToast({
            title: t('adminToastImageAdded'),
            description: t('adminToastImageAddedDesc'),
            variant: 'success',
        });

        await handleLoadProduct();
    } catch (error) {
        const message =
            error instanceof Error ? error.message : t('adminUnknownError');

        addToast({
            title: t('adminToastUploadError'),
            description: message,
            variant: 'error',
        });
    } finally {
        uploadingVariantId.value = null;
        input.value = '';
    }
}

function handleVariantUploadButtonKeyDown(
    variantId: string,
    event: KeyboardEvent,
): void {
    if (event.key !== 'Enter' && event.key !== ' ') {
        return;
    }

    event.preventDefault();
    document.getElementById(`variant-image-file-${variantId}`)?.click();
}

onMounted(() => {
    handleLoadProduct();
});
</script>

<template>
    <AdminPanelShell
        :title="t('adminEditProductTitle')"
        :description="t('adminEditProductDescription')"
    >
        <Card v-if="isLoading" :aria-label="t('adminLoadingProductAria')">
            <div class="space-y-2">
                <div
                    class="bg-secondary-100 dark:bg-secondary-800 h-12 animate-pulse rounded-lg"
                />
                <div
                    class="bg-secondary-100 dark:bg-secondary-800 h-12 animate-pulse rounded-lg"
                />
                <div
                    class="bg-secondary-100 dark:bg-secondary-800 h-12 animate-pulse rounded-lg"
                />
            </div>
        </Card>

        <Card
            v-else-if="loadError"
            :aria-label="t('adminLoadProductErrorAria')"
        >
            <p class="text-danger-600 dark:text-danger-300 text-sm">
                {{ loadError }}
            </p>
            <template #footer>
                <Action
                    :aria-label="t('adminRetryLoadProduct')"
                    variant="secondary"
                    @click="handleLoadProduct"
                >
                    {{ t('adminRetryLoadProduct') }}
                </Action>
            </template>
        </Card>

        <template v-else>
            <Card :aria-label="t('adminBasicDataCardAria')">
                <div class="grid gap-4 md:grid-cols-2">
                    <div class="space-y-1 md:col-span-2">
                        <label
                            class="text-secondary-600 dark:text-secondary-300 text-sm font-medium"
                        >
                            {{ t('adminFormNameShort') }}
                        </label>
                        <Input
                            v-model="form.name"
                            :aria-label="t('adminFormNameShort')"
                            :placeholder="t('adminFormNamePlaceholderShort')"
                        />
                    </div>

                    <div class="space-y-1">
                        <label
                            class="text-secondary-600 dark:text-secondary-300 text-sm font-medium"
                        >
                            {{ t('adminFormSlug') }}
                        </label>
                        <Input
                            v-model="form.slug"
                            :aria-label="t('adminFormSlug')"
                            :placeholder="t('adminFormSlugPlaceholder')"
                        />
                    </div>

                    <div class="space-y-1">
                        <label
                            class="text-secondary-600 dark:text-secondary-300 text-sm font-medium"
                        >
                            {{ t('adminFormSkuShort') }}
                        </label>
                        <Input
                            v-model="form.sku"
                            :aria-label="t('adminFormSkuShort')"
                            :placeholder="t('adminFormSkuPlaceholder')"
                        />
                    </div>

                    <div class="space-y-1">
                        <label
                            class="text-secondary-600 dark:text-secondary-300 text-sm font-medium"
                        >
                            {{ t('adminFormPriceShort') }}
                        </label>
                        <Input
                            v-model="form.price"
                            type="number"
                            :aria-label="t('adminFormPriceShort')"
                            :placeholder="t('adminFormPricePlaceholder')"
                        />
                    </div>

                    <div class="space-y-1">
                        <label
                            id="adminEditProductStatusLabel"
                            class="text-secondary-600 dark:text-secondary-300 text-sm font-medium"
                        >
                            {{ t('adminFormStatus') }}
                        </label>
                        <Select
                            :model-value="form.status"
                            :disabled="isSaving"
                            aria-labelledby="adminEditProductStatusLabel"
                            @update:model-value="handleProductStatusSelect"
                        >
                            <SelectTrigger
                                id="adminEditProductStatus"
                                :aria-label="t('adminFormStatusAria')"
                            >
                                <SelectValue
                                    :placeholder="
                                        t('adminSelectStatusPlaceholder')
                                    "
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

                    <div class="space-y-1 md:col-span-2">
                        <label
                            for="adminEditProductDescription"
                            class="text-secondary-600 dark:text-secondary-300 text-sm font-medium"
                        >
                            {{ t('adminFormDescriptionShort') }}
                        </label>
                        <AdminProductDescriptionEditor
                            v-model="form.description"
                            input-id="adminEditProductDescription"
                            :aria-label="t('adminFormDescription')"
                            :disabled="isSaving"
                            :placeholder="t('adminFormDescriptionPlaceholder')"
                        />
                    </div>
                </div>

                <template #footer>
                    <div class="flex flex-wrap gap-2">
                        <Action
                            :aria-label="t('adminSaveChangesAria')"
                            :is-loading="isSaving"
                            :is-disabled="isSaving"
                            @click="handleSaveProduct"
                        >
                            {{ t('adminSaveChanges') }}
                        </Action>
                    </div>
                    <p
                        v-if="saveError"
                        class="text-danger-600 dark:text-danger-300 mt-3 text-sm"
                    >
                        {{ saveError }}
                    </p>
                </template>
            </Card>

            <Card :aria-label="t('adminVariantsPreviewCardAria')">
                <template #header>
                    <p
                        class="text-secondary-900 dark:text-secondary-50 font-semibold"
                    >
                        {{ t('adminVariantsProductTitle') }}
                    </p>
                </template>

                <div
                    v-if="variantsPreview.length === 0"
                    class="text-secondary-600 dark:text-secondary-300 text-sm"
                >
                    {{ t('adminNoVariantsYet') }}
                </div>

                <div v-else class="grid gap-4">
                    <div
                        v-for="variant in variantsPreview"
                        :key="variant.id"
                        class="border-secondary-200 dark:border-secondary-700 rounded-lg border px-3 py-3 text-sm"
                    >
                        <div
                            class="flex flex-wrap items-center justify-between gap-2"
                        >
                            <p
                                class="text-secondary-900 dark:text-secondary-100 font-semibold"
                            >
                                {{
                                    t('adminVariantSizeLabel', {
                                        size: variant.size,
                                    })
                                }}
                            </p>
                            <span
                                class="text-secondary-500 dark:text-secondary-400 text-xs"
                            >
                                {{
                                    t('adminVariantSkuInline', {
                                        sku: variant.sku,
                                    })
                                }}
                            </span>
                        </div>
                        <p
                            class="text-secondary-600 dark:text-secondary-300 mt-1 text-xs"
                        >
                            {{
                                t('adminVariantStockInline', {
                                    quantity: variant.quantity,
                                })
                            }}
                        </p>

                        <div
                            v-if="variant.images.length > 0"
                            class="mt-3 flex flex-wrap gap-2"
                        >
                            <a
                                v-for="image in variant.images"
                                :key="image.id"
                                :href="image.url"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="border-secondary-200 dark:border-secondary-600 block overflow-hidden rounded-md border"
                                :aria-label="
                                    image.alt ||
                                    t('adminVariantImagePreviewAria', {
                                        size: variant.size,
                                    })
                                "
                            >
                                <img
                                    :src="image.url"
                                    :alt="image.alt || ''"
                                    class="h-20 w-20 object-cover"
                                    loading="lazy"
                                />
                            </a>
                        </div>
                        <p
                            v-else
                            class="text-secondary-500 dark:text-secondary-400 mt-2 text-xs"
                        >
                            {{ t('adminVariantNoImages') }}
                        </p>

                        <div class="mt-3 flex flex-wrap items-center gap-2">
                            <input
                                :id="'variant-image-file-' + variant.id"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                class="sr-only"
                                :aria-label="
                                    t('adminVariantUploadAria', {
                                        size: variant.size,
                                    })
                                "
                                :disabled="uploadingVariantId === variant.id"
                                @change="
                                    handleVariantImageSelected(
                                        variant.id,
                                        $event,
                                    )
                                "
                            />
                            <button
                                type="button"
                                tabindex="0"
                                class="border-secondary-300 dark:border-secondary-600 text-secondary-800 dark:text-secondary-100 hover:bg-secondary-100 dark:hover:bg-secondary-800 focus-visible:ring-primary-500 dark:bg-secondary-900 inline-flex items-center rounded-md border bg-white px-3 py-1.5 text-xs font-medium outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
                                :disabled="uploadingVariantId === variant.id"
                                :aria-busy="uploadingVariantId === variant.id"
                                @click="
                                    document
                                        .getElementById(
                                            'variant-image-file-' + variant.id,
                                        )
                                        ?.click()
                                "
                                @keydown="
                                    handleVariantUploadButtonKeyDown(
                                        variant.id,
                                        $event,
                                    )
                                "
                            >
                                {{
                                    uploadingVariantId === variant.id
                                        ? t('adminUploading')
                                        : t('adminAddPhoto')
                                }}
                            </button>
                        </div>
                    </div>
                </div>
            </Card>
        </template>
    </AdminPanelShell>
</template>
