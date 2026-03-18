<script setup lang="ts">
definePageMeta({
    middleware: ['admin'],
});

const localePath = useLocalePath();
const { listProducts } = useAdminProducts();
const { listLowStock } = useAdminInventory();

const isLoading = ref(true);
const productsTotal = ref(0);
const lowStockTotal = ref(0);
const draftProductsTotal = ref(0);
const errorMessage = ref('');

const quickActions = computed(() => [
    {
        to: localePath('/admin/products/new'),
        label: 'Dodaj nowy produkt',
        ariaLabel: 'Przejdź do formularza dodawania produktu',
    },
    {
        to: localePath('/admin/products'),
        label: 'Przejdź do listy produktów',
        ariaLabel: 'Przejdź do listy produktów',
    },
    {
        to: localePath('/admin/inventory'),
        label: 'Sprawdź niski stan magazynowy',
        ariaLabel: 'Przejdź do listy niskich stanów magazynowych',
    },
]);

async function handleLoadDashboard(): Promise<void> {
    isLoading.value = true;
    errorMessage.value = '';

    try {
        const [productsResponse, lowStockResponse] = await Promise.all([
            listProducts({
                page: 1,
                pageSize: 100,
            }),
            listLowStock(),
        ]);

        productsTotal.value = productsResponse.total;
        lowStockTotal.value = lowStockResponse.total;
        draftProductsTotal.value = productsResponse.items.filter(
            (item) => item.status === 'draft',
        ).length;
    } catch (error) {
        const message =
            error instanceof Error ? error.message : 'Nieznany błąd';

        errorMessage.value = `Nie udało się załadować dashboardu: ${message}`;
    } finally {
        isLoading.value = false;
    }
}

onMounted(() => {
    handleLoadDashboard();
});
</script>

<template>
    <AdminPanelShell
        title="Panel administratora"
        description="Szybki podgląd stanu katalogu i magazynu."
    >
        <div class="grid gap-4 md:grid-cols-3">
            <Card aria-label="Liczba produktów">
                <p class="text-secondary-500 dark:text-secondary-400 text-sm">
                    Wszystkie produkty
                </p>
                <p
                    class="text-secondary-900 dark:text-secondary-50 mt-2 text-3xl font-bold"
                >
                    {{ isLoading ? '...' : productsTotal }}
                </p>
            </Card>

            <Card aria-label="Liczba niskich stanów magazynowych">
                <p class="text-secondary-500 dark:text-secondary-400 text-sm">
                    Niskie stany wariantów
                </p>
                <p
                    class="text-secondary-900 dark:text-secondary-50 mt-2 text-3xl font-bold"
                >
                    {{ isLoading ? '...' : lowStockTotal }}
                </p>
            </Card>

            <Card aria-label="Liczba produktów roboczych">
                <p class="text-secondary-500 dark:text-secondary-400 text-sm">
                    Produkty w draft
                </p>
                <p
                    class="text-secondary-900 dark:text-secondary-50 mt-2 text-3xl font-bold"
                >
                    {{ isLoading ? '...' : draftProductsTotal }}
                </p>
            </Card>
        </div>

        <Card aria-label="Szybkie akcje panelu">
            <template #header>
                <p
                    class="text-secondary-900 dark:text-secondary-50 font-semibold"
                >
                    Szybkie akcje
                </p>
            </template>

            <div class="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                <NuxtLink
                    v-for="action in quickActions"
                    :key="action.to"
                    :to="action.to"
                    class="border-secondary-200 dark:border-secondary-700 text-secondary-700 dark:text-secondary-200 hover:bg-secondary-50 dark:hover:bg-secondary-800 rounded-xl border px-4 py-3 text-sm font-medium transition"
                    :aria-label="action.ariaLabel"
                >
                    {{ action.label }}
                </NuxtLink>
            </div>
        </Card>

        <Card v-if="errorMessage" aria-label="Błąd ładowania dashboardu">
            <p class="text-danger-600 dark:text-danger-300 text-sm">
                {{ errorMessage }}
            </p>
            <template #footer>
                <Action
                    aria-label="Ponów ładowanie dashboardu"
                    variant="secondary"
                    @click="handleLoadDashboard"
                >
                    Odśwież
                </Action>
            </template>
        </Card>
    </AdminPanelShell>
</template>
