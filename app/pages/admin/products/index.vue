<script setup lang="ts">
import type { AdminProductListItem } from '~/types/admin-product';

definePageMeta({
    middleware: ['admin'],
});

const localePath = useLocalePath();
const { listProducts } = useAdminProducts();

const search = ref('');
const statusFilter = ref<'all' | 'draft' | 'active' | 'archived'>('all');
const page = ref(1);
const pageSize = ref(20);

const items = ref<AdminProductListItem[]>([]);
const totalCount = ref(0);
const isLoading = ref(true);
const loadError = ref('');

let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;

const statusOptions = [
    { value: 'all', label: 'Wszystkie statusy' },
    { value: 'draft', label: 'Draft' },
    { value: 'active', label: 'Aktywne' },
    { value: 'archived', label: 'Archiwalne' },
] as const;

const totalPages = computed(() =>
    Math.max(1, Math.ceil(totalCount.value / pageSize.value)),
);

function formatPrice(value: number): string {
    return new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN',
        minimumFractionDigits: 2,
    }).format(value);
}

function formatStatusLabel(status: AdminProductListItem['status']): string {
    if (status === 'draft') return 'Draft';
    if (status === 'active') return 'Aktywny';
    return 'Archiwalny';
}

async function loadProducts(): Promise<void> {
    isLoading.value = true;
    loadError.value = '';

    try {
        const response = await listProducts({
            page: page.value,
            pageSize: pageSize.value,
            search: search.value.trim() || undefined,
            status: statusFilter.value,
        });

        items.value = response.items;
        totalCount.value = response.total;
    } catch (error) {
        const message =
            error instanceof Error ? error.message : 'Nieznany błąd';

        loadError.value = `Nie udało się wczytać produktów: ${message}`;
        items.value = [];
        totalCount.value = 0;
    } finally {
        isLoading.value = false;
    }
}

function scheduleSearchReload(): void {
    if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer);
    }

    searchDebounceTimer = setTimeout(() => {
        searchDebounceTimer = null;
        page.value = 1;
        loadProducts();
    }, 350);
}

function handleStatusChange(): void {
    page.value = 1;
    loadProducts();
}

function handlePageChange(nextPage: number): void {
    if (nextPage < 1 || nextPage > totalPages.value) {
        return;
    }

    page.value = nextPage;
    loadProducts();
}

function handlePrevPage(): void {
    handlePageChange(page.value - 1);
}

function handleNextPage(): void {
    handlePageChange(page.value + 1);
}

function handlePageKeyDown(event: KeyboardEvent, targetPage: number): void {
    if (event.key !== 'Enter' && event.key !== ' ') {
        return;
    }

    event.preventDefault();
    handlePageChange(targetPage);
}

watch(search, () => {
    scheduleSearchReload();
});

onMounted(() => {
    loadProducts();
});

onUnmounted(() => {
    if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer);
    }
});
</script>

<template>
    <AdminPanelShell
        title="Produkty"
        description="Zarządzanie katalogiem produktów i stanem magazynowym (suma sztuk po wariantach)."
    >
        <Card aria-label="Filtry produktów">
            <div class="grid gap-3 md:grid-cols-[1fr_220px]">
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
                        placeholder="np. rashguard lub TSHIRT-M…"
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
                        @change="handleStatusChange"
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
            </div>
        </Card>

        <Card v-if="loadError" aria-label="Błąd wczytywania listy produktów">
            <p class="text-danger-600 dark:text-danger-300 text-sm">
                {{ loadError }}
            </p>
            <button
                type="button"
                class="text-primary-600 dark:text-primary-400 mt-3 text-sm font-semibold underline"
                tabindex="0"
                aria-label="Ponów wczytanie listy produktów"
                @click="loadProducts"
                @keydown.enter.prevent="loadProducts"
            >
                Spróbuj ponownie
            </button>
        </Card>

        <Card aria-label="Lista produktów">
            <template #header>
                <div
                    class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                >
                    <div>
                        <p
                            class="text-secondary-900 dark:text-secondary-50 font-semibold"
                        >
                            Lista produktów
                        </p>
                        <p
                            class="text-secondary-500 dark:text-secondary-400 mt-1 text-xs"
                        >
                            <template v-if="!isLoading">
                                {{ totalCount }} pozycji w bazie (strona
                                {{ page }} / {{ totalPages }})
                            </template>
                            <template v-else>Wczytywanie…</template>
                        </p>
                    </div>
                    <NuxtLink
                        :to="localePath('/admin/products/new')"
                        class="bg-primary-500 hover:bg-primary-400 inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold text-white transition"
                        aria-label="Przejdź do dodawania nowego produktu"
                    >
                        Dodaj produkt
                    </NuxtLink>
                </div>
            </template>

            <div class="overflow-x-auto">
                <table class="min-w-full text-left text-sm">
                    <thead>
                        <tr
                            class="text-secondary-500 dark:text-secondary-400 border-secondary-200 dark:border-secondary-700 border-b"
                        >
                            <th class="px-3 py-2 font-semibold">Nazwa</th>
                            <th class="px-3 py-2 font-semibold">SKU</th>
                            <th class="px-3 py-2 font-semibold">Cena</th>
                            <th class="px-3 py-2 font-semibold">
                                Stan magazynowy
                            </th>
                            <th class="px-3 py-2 font-semibold">Status</th>
                            <th class="px-3 py-2 font-semibold">Akcje</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="isLoading">
                            <td
                                class="text-secondary-500 dark:text-secondary-400 px-3 py-8"
                                colspan="6"
                            >
                                Wczytywanie produktów…
                            </td>
                        </tr>
                        <tr
                            v-else-if="items.length === 0"
                            class="border-secondary-100 dark:border-secondary-800 border-b"
                        >
                            <td
                                class="text-secondary-500 dark:text-secondary-400 px-3 py-8"
                                colspan="6"
                            >
                                Brak produktów do wyświetlenia. Dodaj pierwszy
                                produkt lub zmień filtry.
                            </td>
                        </tr>
                        <tr
                            v-for="product in items"
                            :key="product.id"
                            class="border-secondary-100 dark:border-secondary-800 border-b"
                        >
                            <td
                                class="text-secondary-900 dark:text-secondary-50 px-3 py-3 font-medium"
                            >
                                {{ product.name }}
                            </td>
                            <td
                                class="text-secondary-600 dark:text-secondary-300 px-3 py-3 font-mono text-xs"
                            >
                                {{ product.sku }}
                            </td>
                            <td
                                class="text-secondary-800 dark:text-secondary-200 px-3 py-3"
                            >
                                {{ formatPrice(product.price) }}
                            </td>
                            <td class="px-3 py-3">
                                <div
                                    class="text-secondary-800 dark:text-secondary-200"
                                >
                                    <span class="font-semibold">
                                        {{ product.totalStock }}
                                    </span>
                                    szt. łącznie
                                </div>
                                <div
                                    class="text-secondary-500 dark:text-secondary-400 mt-0.5 text-xs"
                                >
                                    {{ product.variantsCount }}
                                    {{
                                        product.variantsCount === 1
                                            ? 'wariant'
                                            : product.variantsCount < 5
                                              ? 'warianty'
                                              : 'wariantów'
                                    }}
                                </div>
                                <p
                                    v-if="product.lowStockVariantsCount > 0"
                                    class="text-warning-600 dark:text-warning-400 mt-1 text-xs font-medium"
                                    role="status"
                                >
                                    Niski stan:
                                    {{ product.lowStockVariantsCount }}
                                    /
                                    {{ product.variantsCount }}
                                    wariantów przy progu
                                </p>
                            </td>
                            <td class="px-3 py-3">
                                <span
                                    class="inline-flex rounded-full px-2 py-0.5 text-xs font-medium"
                                    :class="{
                                        'bg-secondary-200 text-secondary-800 dark:bg-secondary-700 dark:text-secondary-100':
                                            product.status === 'draft',
                                        'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200':
                                            product.status === 'active',
                                        'bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-100':
                                            product.status === 'archived',
                                    }"
                                >
                                    {{ formatStatusLabel(product.status) }}
                                </span>
                            </td>
                            <td class="px-3 py-3">
                                <NuxtLink
                                    :to="
                                        localePath(
                                            `/admin/products/${product.id}`,
                                        )
                                    "
                                    class="text-primary-600 dark:text-primary-400 font-semibold hover:underline"
                                    :aria-label="`Edytuj produkt ${product.name}`"
                                >
                                    Edytuj
                                </NuxtLink>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div
                v-if="!isLoading && totalPages > 1"
                class="border-secondary-200 dark:border-secondary-700 mt-4 flex flex-wrap items-center justify-center gap-2 border-t pt-4"
                role="navigation"
                aria-label="Paginacja listy produktów"
            >
                <button
                    type="button"
                    class="border-secondary-300 text-secondary-800 hover:bg-secondary-100 dark:border-secondary-600 dark:text-secondary-100 dark:hover:bg-secondary-800 rounded-lg border px-3 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
                    :disabled="page <= 1"
                    :aria-label="'Poprzednia strona, obecna ' + page"
                    tabindex="0"
                    @click="handlePrevPage"
                    @keydown.enter.prevent="handlePrevPage"
                    @keydown.space.prevent="handlePrevPage"
                >
                    ← Poprzednia
                </button>
                <button
                    v-for="p in totalPages"
                    :key="p"
                    type="button"
                    class="min-w-9 rounded-lg border px-2 py-1.5 text-sm font-medium transition"
                    :class="
                        p === page
                            ? 'border-primary-500 bg-primary-50 text-primary-800 dark:bg-primary-950/50 dark:text-primary-200 dark:border-primary-600'
                            : 'border-secondary-300 text-secondary-700 hover:bg-secondary-100 dark:border-secondary-600 dark:text-secondary-200 dark:hover:bg-secondary-800'
                    "
                    :aria-current="p === page ? 'page' : undefined"
                    :aria-label="'Strona ' + p"
                    tabindex="0"
                    @click="handlePageChange(p)"
                    @keydown="handlePageKeyDown($event, p)"
                >
                    {{ p }}
                </button>
                <button
                    type="button"
                    class="border-secondary-300 text-secondary-800 hover:bg-secondary-100 dark:border-secondary-600 dark:text-secondary-100 dark:hover:bg-secondary-800 rounded-lg border px-3 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
                    :disabled="page >= totalPages"
                    :aria-label="'Następna strona, obecna ' + page"
                    tabindex="0"
                    @click="handleNextPage"
                    @keydown.enter.prevent="handleNextPage"
                    @keydown.space.prevent="handleNextPage"
                >
                    Następna →
                </button>
            </div>
        </Card>
    </AdminPanelShell>
</template>
