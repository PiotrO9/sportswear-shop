<script setup lang="ts">
definePageMeta({
    middleware: ['admin'],
});

const localePath = useLocalePath();
const { listProducts } = useAdminProducts();

const isLoading = ref(true);
const isRefreshing = ref(false);
const errorMessage = ref('');
const search = ref('');
const statusFilter = ref<'all' | 'draft' | 'active' | 'archived'>('all');
const items = ref<Awaited<ReturnType<typeof listProducts>>['items']>([]);

const statusOptions = [
    { value: 'all', label: 'Wszystkie statusy' },
    { value: 'draft', label: 'Draft' },
    { value: 'active', label: 'Aktywne' },
    { value: 'archived', label: 'Archiwalne' },
] as const;

const filteredItems = computed(() => {
    if (!search.value.trim()) {
        return items.value;
    }

    const term = search.value.trim().toLowerCase();

    return items.value.filter((item) => {
        return (
            item.name.toLowerCase().includes(term) ||
            item.sku.toLowerCase().includes(term) ||
            item.slug.toLowerCase().includes(term)
        );
    });
});

function formatPrice(value: number): string {
    return new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN',
        minimumFractionDigits: 2,
    }).format(value);
}

function getStatusBadgeClass(status: 'draft' | 'active' | 'archived'): string {
    if (status === 'active') {
        return 'bg-success-100 text-success-700 dark:bg-success-950/40 dark:text-success-300';
    }

    if (status === 'archived') {
        return 'bg-secondary-200 text-secondary-700 dark:bg-secondary-700 dark:text-secondary-200';
    }

    return 'bg-warning-100 text-warning-700 dark:bg-warning-950/40 dark:text-warning-300';
}

function getStatusLabel(status: 'draft' | 'active' | 'archived'): string {
    if (status === 'active') {
        return 'Aktywny';
    }

    if (status === 'archived') {
        return 'Archiwalny';
    }

    return 'Draft';
}

async function handleLoadProducts(): Promise<void> {
    isLoading.value = true;
    errorMessage.value = '';

    try {
        const response = await listProducts({
            page: 1,
            pageSize: 100,
            status: statusFilter.value,
        });

        items.value = response.items;
    } catch (error) {
        const message =
            error instanceof Error ? error.message : 'Nieznany błąd';

        errorMessage.value = `Nie udało się pobrać produktów: ${message}`;
    } finally {
        isLoading.value = false;
    }
}

async function handleRefreshProducts(): Promise<void> {
    if (isRefreshing.value) {
        return;
    }

    isRefreshing.value = true;

    try {
        await handleLoadProducts();
    } finally {
        isRefreshing.value = false;
    }
}

watch(
    () => statusFilter.value,
    () => {
        handleLoadProducts();
    },
);

onMounted(() => {
    handleLoadProducts();
});
</script>

<template>
    <AdminPanelShell
        title="Produkty"
        description="Zarządzanie katalogiem produktów i ich stanem publikacji."
    >
        <Card aria-label="Filtry produktów">
            <div class="grid gap-3 md:grid-cols-[1fr_220px_auto]">
                <div class="space-y-1">
                    <label
                        for="adminProductsSearch"
                        class="text-secondary-600 dark:text-secondary-300 text-sm font-medium"
                    >
                        Szukaj po nazwie, SKU lub slug
                    </label>
                    <Input
                        id="adminProductsSearch"
                        v-model="search"
                        type="search"
                        aria-label="Szukaj po nazwie, SKU lub slug"
                        placeholder="np. rashguard-pro"
                    />
                </div>

                <div class="space-y-1">
                    <label
                        for="adminProductsStatus"
                        class="text-secondary-600 dark:text-secondary-300 text-sm font-medium"
                    >
                        Status
                    </label>
                    <select
                        id="adminProductsStatus"
                        v-model="statusFilter"
                        aria-label="Wybierz status produktów"
                        class="border-secondary-300 dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-50 focus-visible:ring-primary-500 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus-visible:ring-2"
                    >
                        <option
                            v-for="option in statusOptions"
                            :key="option.value"
                            :value="option.value"
                        >
                            {{ option.label }}
                        </option>
                    </select>
                </div>

                <div class="flex items-end">
                    <Action
                        aria-label="Odśwież listę produktów"
                        variant="secondary"
                        :is-loading="isRefreshing"
                        @click="handleRefreshProducts"
                    >
                        Odśwież
                    </Action>
                </div>
            </div>
        </Card>

        <Card aria-label="Lista produktów">
            <template #header>
                <div class="flex items-center justify-between gap-2">
                    <p
                        class="text-secondary-900 dark:text-secondary-50 font-semibold"
                    >
                        Lista produktów
                    </p>
                    <NuxtLink
                        :to="localePath('/admin/products/new')"
                        class="bg-primary-500 hover:bg-primary-400 rounded-xl px-3 py-2 text-sm font-semibold text-white transition"
                        aria-label="Przejdź do dodawania nowego produktu"
                    >
                        Dodaj produkt
                    </NuxtLink>
                </div>
            </template>

            <div v-if="isLoading" class="space-y-2">
                <div
                    v-for="n in 5"
                    :key="n"
                    class="bg-secondary-100 dark:bg-secondary-800 h-12 animate-pulse rounded-lg"
                />
            </div>

            <div
                v-else-if="errorMessage"
                class="text-danger-600 dark:text-danger-300 text-sm"
            >
                {{ errorMessage }}
            </div>

            <div
                v-else-if="filteredItems.length === 0"
                class="text-secondary-600 dark:text-secondary-300 text-sm"
            >
                Brak produktów do wyświetlenia dla wybranych filtrów.
            </div>

            <div v-else class="overflow-x-auto">
                <table class="min-w-full text-left text-sm">
                    <thead>
                        <tr
                            class="text-secondary-500 dark:text-secondary-400 border-secondary-200 dark:border-secondary-700 border-b"
                        >
                            <th class="px-3 py-2 font-semibold">Nazwa</th>
                            <th class="px-3 py-2 font-semibold">SKU</th>
                            <th class="px-3 py-2 font-semibold">Cena</th>
                            <th class="px-3 py-2 font-semibold">Stan</th>
                            <th class="px-3 py-2 font-semibold">Status</th>
                            <th class="px-3 py-2 font-semibold">Akcje</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="item in filteredItems"
                            :key="item.id"
                            class="border-secondary-100 dark:border-secondary-800 border-b"
                        >
                            <td class="px-3 py-3">
                                <p
                                    class="text-secondary-900 dark:text-secondary-100 font-semibold"
                                >
                                    {{ item.name }}
                                </p>
                                <p
                                    class="text-secondary-500 dark:text-secondary-400 text-xs"
                                >
                                    {{ item.slug }}
                                </p>
                            </td>
                            <td class="px-3 py-3">{{ item.sku }}</td>
                            <td class="px-3 py-3">
                                {{ formatPrice(item.price) }}
                            </td>
                            <td class="px-3 py-3">
                                <span
                                    :class="
                                        item.lowStockVariantsCount > 0
                                            ? 'text-warning-700 dark:text-warning-300'
                                            : 'text-secondary-700 dark:text-secondary-300'
                                    "
                                >
                                    {{ item.totalStock }}
                                </span>
                                <p
                                    v-if="item.lowStockVariantsCount > 0"
                                    class="text-warning-700 dark:text-warning-300 text-xs"
                                >
                                    Niski stan: {{ item.lowStockVariantsCount }}
                                </p>
                            </td>
                            <td class="px-3 py-3">
                                <span
                                    class="inline-flex rounded-lg px-2 py-1 text-xs font-semibold"
                                    :class="getStatusBadgeClass(item.status)"
                                >
                                    {{ getStatusLabel(item.status) }}
                                </span>
                            </td>
                            <td class="px-3 py-3">
                                <NuxtLink
                                    :to="
                                        localePath(`/admin/products/${item.id}`)
                                    "
                                    class="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-semibold"
                                    :aria-label="`Edytuj produkt ${item.name}`"
                                >
                                    Edytuj
                                </NuxtLink>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </Card>
    </AdminPanelShell>
</template>
