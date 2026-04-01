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

function handleTablePageChange(nextPage: number): void {
    handlePageChange(nextPage);
}

function handleTablePageSizeChange(nextSize: number): void {
    pageSize.value = nextSize;
    page.value = 1;
    loadProducts();
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

        <div class="space-y-3">
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
                            {{ totalCount }} pozycji w bazie
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

            <AdminProductsDataTable
                :items="items"
                :is-loading="isLoading"
                :page="page"
                :page-size="pageSize"
                :total-count="totalCount"
                :total-pages="totalPages"
                @update:page="handleTablePageChange"
                @update:page-size="handleTablePageSizeChange"
            />
        </div>
    </AdminPanelShell>
</template>
