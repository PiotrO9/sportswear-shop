<script setup lang="ts">
definePageMeta({
    middleware: ['admin'],
});

const route = useRoute();
const { addToast } = useToast();
const { getProductById, updateProduct } = useAdminProducts();

const isLoading = ref(true);
const isSaving = ref(false);
const loadError = ref('');
const saveError = ref('');

const productId = computed(() => String(route.params.id));

const form = reactive({
    name: '',
    slug: '',
    sku: '',
    description: '',
    price: 0,
    status: 'draft' as 'draft' | 'active' | 'archived',
});

const variantsPreview = ref<
    Array<{
        id: string;
        size: string;
        color: string;
        sku: string;
        imagesCount: number;
        quantity: number;
    }>
>([]);

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

        variantsPreview.value = product.variants.map((variant) => ({
            id: variant.id,
            size: variant.size,
            color: variant.color,
            sku: variant.sku,
            imagesCount: variant.images.length,
            quantity:
                product.inventory.find(
                    (inventoryItem) => inventoryItem.variantId === variant.id,
                )?.quantity ?? 0,
        }));
    } catch (error) {
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

                <div v-else class="grid gap-2">
                    <div
                        v-for="variant in variantsPreview"
                        :key="variant.id"
                        class="border-secondary-200 dark:border-secondary-700 rounded-lg border px-3 py-2 text-sm"
                    >
                        <div
                            class="flex flex-wrap items-center justify-between gap-2"
                        >
                            <p
                                class="text-secondary-900 dark:text-secondary-100 font-semibold"
                            >
                                {{ variant.size }} / {{ variant.color }}
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
                            Zdjęcia: {{ variant.imagesCount }} | Stan
                            magazynowy:
                            {{ variant.quantity }}
                        </p>
                    </div>
                </div>
            </Card>
        </template>
    </AdminPanelShell>
</template>
