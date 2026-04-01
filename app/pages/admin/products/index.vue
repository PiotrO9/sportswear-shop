<script setup lang="ts">
import type { AdminProductListItem } from '~/types/admin-product';
import { Button } from '@/components/shadcn/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/shadcn/select';

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

function handleStatusModelUpdate(value: unknown): void {
    const next = String(value);

    if (
        next !== 'all' &&
        next !== 'draft' &&
        next !== 'active' &&
        next !== 'archived'
    ) {
        return;
    }

    statusFilter.value = next;
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
        <div
            role="region"
            aria-label="Filtry produktów"
            class="border-border bg-card text-card-foreground rounded-xl border p-5 shadow-sm"
        >
            <div class="grid gap-3 md:grid-cols-[1fr_220px]">
                <div class="space-y-2">
                    <label
                        id="adminProductsSearchLabel"
                        for="adminProductsSearch"
                        class="text-foreground text-sm font-medium"
                    >
                        Szukaj po nazwie, SKU lub slug
                    </label>
                    <input
                        id="adminProductsSearch"
                        v-model="search"
                        type="search"
                        class="border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:outline-none"
                        aria-labelledby="adminProductsSearchLabel"
                        placeholder="np. rashguard lub TSHIRT-M…"
                    />
                </div>

                <div class="space-y-2">
                    <label
                        id="adminProductsStatusLabel"
                        for="adminProductsStatusTrigger"
                        class="text-foreground text-sm font-medium"
                    >
                        Status
                    </label>
                    <Select
                        :model-value="statusFilter"
                        @update:model-value="handleStatusModelUpdate"
                    >
                        <SelectTrigger
                            id="adminProductsStatusTrigger"
                            class="border-border w-full"
                            aria-labelledby="adminProductsStatusLabel"
                        >
                            <SelectValue placeholder="Wybierz status" />
                        </SelectTrigger>
                        <SelectContent class="border-border">
                            <SelectItem
                                v-for="option in statusOptions"
                                :key="option.value"
                                :value="option.value"
                                class="text-sm"
                            >
                                {{ option.label }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>

        <div
            v-if="loadError"
            role="alert"
            aria-label="Błąd wczytywania listy produktów"
            class="border-destructive/30 bg-card text-card-foreground rounded-xl border p-5 shadow-sm"
        >
            <p class="text-destructive text-sm">
                {{ loadError }}
            </p>
            <Button
                variant="outline"
                size="sm"
                class="border-destructive/40 text-destructive mt-3"
                type="button"
                aria-label="Ponów wczytanie listy produktów"
                @click="loadProducts"
            >
                Spróbuj ponownie
            </Button>
        </div>

        <div class="space-y-3">
            <div
                class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            >
                <div>
                    <p class="text-foreground font-semibold">Lista produktów</p>
                    <p class="text-muted-foreground mt-1 text-xs">
                        <template v-if="!isLoading">
                            {{ totalCount }} pozycji w bazie
                        </template>
                        <template v-else>Wczytywanie…</template>
                    </p>
                </div>
                <Button class="shrink-0" as-child>
                    <NuxtLink
                        :to="localePath('/admin/products/new')"
                        aria-label="Przejdź do dodawania nowego produktu"
                    >
                        Dodaj produkt
                    </NuxtLink>
                </Button>
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
