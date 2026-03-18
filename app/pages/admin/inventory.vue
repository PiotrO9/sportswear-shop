<script setup lang="ts">
definePageMeta({
    middleware: ['admin'],
});

const { addToast } = useToast();
const { listLowStock, updateVariantInventory } = useAdminInventory();
const { listProducts } = useAdminProducts();

const isLoading = ref(true);
const isSaving = ref(false);
const errorMessage = ref('');

const lowStockItems = ref<
    Array<{
        variantId: string;
        productId: string;
        quantity: number;
        lowStockThreshold: number;
    }>
>([]);

const productsMap = ref<Map<string, string>>(new Map());
const editableQuantity = ref<Record<string, number>>({});

async function handleLoadInventory(): Promise<void> {
    isLoading.value = true;
    errorMessage.value = '';

    try {
        const [lowStockResponse, productsResponse] = await Promise.all([
            listLowStock(),
            listProducts({ page: 1, pageSize: 200 }),
        ]);

        lowStockItems.value = lowStockResponse.items;
        productsMap.value = new Map(
            productsResponse.items.map((item) => [item.id, item.name]),
        );

        const quantityMap: Record<string, number> = {};

        for (const item of lowStockResponse.items) {
            quantityMap[item.variantId] = item.quantity;
        }

        editableQuantity.value = quantityMap;
    } catch (error) {
        const message =
            error instanceof Error ? error.message : 'Nieznany błąd';

        errorMessage.value = `Nie udało się pobrać magazynu: ${message}`;
    } finally {
        isLoading.value = false;
    }
}

function getProductName(productId: string): string {
    return productsMap.value.get(productId) ?? `Produkt ${productId}`;
}

async function handleSaveQuantity(item: {
    variantId: string;
    productId: string;
    quantity: number;
    lowStockThreshold: number;
}): Promise<void> {
    if (isSaving.value) {
        return;
    }

    const nextQuantity = Number(editableQuantity.value[item.variantId]);

    if (!Number.isFinite(nextQuantity) || nextQuantity < 0) {
        addToast({
            title: 'Niepoprawna wartość',
            description: 'Stan magazynowy musi być liczbą większą lub równą 0.',
            variant: 'error',
        });

        return;
    }

    isSaving.value = true;

    try {
        await updateVariantInventory(item.productId, {
            variantId: item.variantId,
            quantity: nextQuantity,
            lowStockThreshold: item.lowStockThreshold,
        });

        item.quantity = nextQuantity;

        addToast({
            title: 'Zapisano stan magazynowy',
            description: 'Zmiana została poprawnie zapisana.',
            variant: 'success',
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : 'Nieznany błąd';

        addToast({
            title: 'Błąd zapisu magazynu',
            description: message,
            variant: 'error',
        });
    } finally {
        isSaving.value = false;
    }
}

onMounted(() => {
    handleLoadInventory();
});
</script>

<template>
    <AdminPanelShell
        title="Magazyn"
        description="Szybka edycja niskich stanów magazynowych dla wariantów."
    >
        <Card aria-label="Niskie stany magazynowe">
            <template #header>
                <div class="flex items-center justify-between gap-2">
                    <p
                        class="text-secondary-900 dark:text-secondary-50 font-semibold"
                    >
                        Warianty z niskim stanem
                    </p>
                    <Action
                        aria-label="Odśwież listę niskich stanów magazynowych"
                        variant="secondary"
                        @click="handleLoadInventory"
                    >
                        Odśwież
                    </Action>
                </div>
            </template>

            <div v-if="isLoading" class="space-y-2">
                <div
                    v-for="n in 4"
                    :key="n"
                    class="bg-secondary-100 dark:bg-secondary-800 h-14 animate-pulse rounded-lg"
                />
            </div>

            <div
                v-else-if="errorMessage"
                class="text-danger-600 dark:text-danger-300 text-sm"
            >
                {{ errorMessage }}
            </div>

            <div
                v-else-if="lowStockItems.length === 0"
                class="text-secondary-600 dark:text-secondary-300 text-sm"
            >
                Brak wariantów z niskim stanem. Wszystko wygląda dobrze.
            </div>

            <div v-else class="space-y-2">
                <div
                    v-for="item in lowStockItems"
                    :key="item.variantId"
                    class="border-secondary-200 dark:border-secondary-700 grid gap-3 rounded-xl border p-3 md:grid-cols-[1fr_120px_120px_auto]"
                >
                    <div>
                        <p
                            class="text-secondary-900 dark:text-secondary-100 font-semibold"
                        >
                            {{ getProductName(item.productId) }}
                        </p>
                        <p
                            class="text-secondary-500 dark:text-secondary-400 text-xs"
                        >
                            Wariant ID: {{ item.variantId }}
                        </p>
                    </div>

                    <div>
                        <p
                            class="text-secondary-500 dark:text-secondary-400 text-xs"
                        >
                            Próg
                        </p>
                        <p
                            class="text-secondary-700 dark:text-secondary-300 font-semibold"
                        >
                            {{ item.lowStockThreshold }}
                        </p>
                    </div>

                    <div class="space-y-1">
                        <label
                            :for="`inventoryQuantity-${item.variantId}`"
                            class="text-secondary-500 dark:text-secondary-400 text-xs"
                        >
                            Ilość
                        </label>
                        <Input
                            :id="`inventoryQuantity-${item.variantId}`"
                            v-model="editableQuantity[item.variantId]"
                            type="number"
                            aria-label="Ilość magazynowa wariantu"
                        />
                    </div>

                    <div class="flex items-end">
                        <Action
                            aria-label="Zapisz ilość magazynową wariantu"
                            :is-disabled="isSaving"
                            :is-loading="isSaving"
                            @click="handleSaveQuantity(item)"
                        >
                            Zapisz
                        </Action>
                    </div>
                </div>
            </div>
        </Card>
    </AdminPanelShell>
</template>
