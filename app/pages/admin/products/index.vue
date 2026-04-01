<script setup lang="ts">
definePageMeta({
    middleware: ['admin'],
});

const localePath = useLocalePath();

const search = ref('');
const statusFilter = ref<'all' | 'draft' | 'active' | 'archived'>('all');

const statusOptions = [
    { value: 'all', label: 'Wszystkie statusy' },
    { value: 'draft', label: 'Draft' },
    { value: 'active', label: 'Aktywne' },
    { value: 'archived', label: 'Archiwalne' },
] as const;
</script>

<template>
    <AdminPanelShell
        title="Produkty"
        description="Zarządzanie katalogiem produktów i ich stanem publikacji."
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

            <div class="overflow-x-auto">
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
                            class="border-secondary-100 dark:border-secondary-800 border-b"
                        >
                            <td
                                class="text-secondary-500 dark:text-secondary-400 px-3 py-6"
                                colspan="6"
                            >
                                —
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </Card>
    </AdminPanelShell>
</template>
