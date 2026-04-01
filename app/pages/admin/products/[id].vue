<script setup lang="ts">
import type { AdminProduct } from '~/types/admin-product';

definePageMeta({
    middleware: ['admin'],
});

const route = useRoute();
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
            error instanceof Error ? error.message : 'Nieznany błąd';

        loadError.value = `Nie udało się załadować produktu: ${message}`;
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
            description: form.description || null,
            price: form.price,
            status: form.status,
        });

        addToast({
            title: 'Zapisano zmiany',
            description: 'Dane podstawowe produktu zostały zaktualizowane.',
            variant: 'success',
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : 'Nieznany błąd';

        saveError.value = `Nie udało się zapisać produktu: ${message}`;
        addToast({
            title: 'Błąd zapisu',
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
            title: 'Dodano zdjęcie',
            description: 'Plik został zapisany w Supabase Storage.',
            variant: 'success',
        });

        await handleLoadProduct();
    } catch (error) {
        const message =
            error instanceof Error ? error.message : 'Nieznany błąd';

        addToast({
            title: 'Błąd wgrywania',
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
        title="Edycja produktu"
        description="Podstawowa edycja danych produktu i podgląd jego wariantów."
    >
        <Card v-if="isLoading" aria-label="Ładowanie produktu">
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

        <Card v-else-if="loadError" aria-label="Błąd ładowania produktu">
            <p class="text-danger-600 dark:text-danger-300 text-sm">
                {{ loadError }}
            </p>
            <template #footer>
                <Action
                    aria-label="Ponów pobranie danych produktu"
                    variant="secondary"
                    @click="handleLoadProduct"
                >
                    Odśwież
                </Action>
            </template>
        </Card>

        <template v-else>
            <Card aria-label="Dane podstawowe produktu">
                <div class="grid gap-4 md:grid-cols-2">
                    <div class="space-y-1 md:col-span-2">
                        <label
                            class="text-secondary-600 dark:text-secondary-300 text-sm font-medium"
                        >
                            Nazwa
                        </label>
                        <Input
                            v-model="form.name"
                            aria-label="Nazwa produktu"
                            placeholder="Nazwa produktu"
                        />
                    </div>

                    <div class="space-y-1">
                        <label
                            class="text-secondary-600 dark:text-secondary-300 text-sm font-medium"
                        >
                            Slug
                        </label>
                        <Input
                            v-model="form.slug"
                            aria-label="Slug produktu"
                            placeholder="slug-produktu"
                        />
                    </div>

                    <div class="space-y-1">
                        <label
                            class="text-secondary-600 dark:text-secondary-300 text-sm font-medium"
                        >
                            SKU
                        </label>
                        <Input
                            v-model="form.sku"
                            aria-label="SKU produktu"
                            placeholder="SKU"
                        />
                    </div>

                    <div class="space-y-1">
                        <label
                            class="text-secondary-600 dark:text-secondary-300 text-sm font-medium"
                        >
                            Cena (PLN)
                        </label>
                        <Input
                            v-model="form.price"
                            type="number"
                            aria-label="Cena produktu"
                            placeholder="Cena"
                        />
                    </div>

                    <div class="space-y-1">
                        <label
                            class="text-secondary-600 dark:text-secondary-300 text-sm font-medium"
                        >
                            Status
                        </label>
                        <select
                            v-model="form.status"
                            aria-label="Status produktu"
                            class="border-secondary-300 dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-50 focus-visible:ring-primary-500 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus-visible:ring-2"
                        >
                            <option value="draft">Draft</option>
                            <option value="active">Aktywny</option>
                            <option value="archived">Archiwalny</option>
                        </select>
                    </div>

                    <div class="space-y-1 md:col-span-2">
                        <label
                            class="text-secondary-600 dark:text-secondary-300 text-sm font-medium"
                        >
                            Opis
                        </label>
                        <textarea
                            v-model="form.description"
                            rows="4"
                            aria-label="Opis produktu"
                            class="border-secondary-300 dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-50 focus-visible:ring-primary-500 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus-visible:ring-2"
                        />
                    </div>
                </div>

                <template #footer>
                    <div class="flex flex-wrap gap-2">
                        <Action
                            aria-label="Zapisz zmiany produktu"
                            :is-loading="isSaving"
                            :is-disabled="isSaving"
                            @click="handleSaveProduct"
                        >
                            Zapisz zmiany
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

            <Card aria-label="Podgląd wariantów produktu">
                <template #header>
                    <p
                        class="text-secondary-900 dark:text-secondary-50 font-semibold"
                    >
                        Warianty produktu
                    </p>
                </template>

                <div
                    v-if="variantsPreview.length === 0"
                    class="text-secondary-600 dark:text-secondary-300 text-sm"
                >
                    Ten produkt nie ma jeszcze wariantów.
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
                                Rozmiar: {{ variant.size }}
                            </p>
                            <span
                                class="text-secondary-500 dark:text-secondary-400 text-xs"
                            >
                                SKU: {{ variant.sku }}
                            </span>
                        </div>
                        <p
                            class="text-secondary-600 dark:text-secondary-300 mt-1 text-xs"
                        >
                            Stan magazynowy: {{ variant.quantity }}
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
                                    'Podgląd zdjęcia wariantu ' + variant.size
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
                            Brak zdjęć dla tego wariantu.
                        </p>

                        <div class="mt-3 flex flex-wrap items-center gap-2">
                            <input
                                :id="'variant-image-file-' + variant.id"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                class="sr-only"
                                :aria-label="
                                    'Wgraj zdjęcie JPEG, PNG lub WebP dla wariantu ' +
                                    variant.size
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
                                        ? 'Wgrywanie…'
                                        : 'Dodaj zdjęcie'
                                }}
                            </button>
                        </div>
                    </div>
                </div>
            </Card>
        </template>
    </AdminPanelShell>
</template>
