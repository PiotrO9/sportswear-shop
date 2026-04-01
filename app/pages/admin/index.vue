<script setup lang="ts">
definePageMeta({
    middleware: ['admin'],
});

const { t } = useI18n();
const localePath = useLocalePath();
const { handleLogout } = useLogout();

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

function handleLogoutClick(): void {
    handleLogout();
}
</script>

<template>
    <AdminPanelShell
        title="Panel administratora"
        description="Szybki podgląd stanu katalogu i magazynu."
    >
        <div class="flex flex-wrap items-center justify-end gap-2">
            <Action
                variant="secondary"
                :aria-label="t('navLogOut')"
                @click="handleLogoutClick"
            >
                {{ t('navLogOut') }}
            </Action>
        </div>

        <div class="grid gap-4 md:grid-cols-3">
            <Card aria-label="Liczba produktów">
                <p class="text-secondary-500 dark:text-secondary-400 text-sm">
                    Wszystkie produkty
                </p>
                <p
                    class="text-secondary-900 dark:text-secondary-50 mt-2 text-3xl font-bold"
                >
                    —
                </p>
            </Card>

            <Card aria-label="Liczba niskich stanów magazynowych">
                <p class="text-secondary-500 dark:text-secondary-400 text-sm">
                    Niskie stany wariantów
                </p>
                <p
                    class="text-secondary-900 dark:text-secondary-50 mt-2 text-3xl font-bold"
                >
                    —
                </p>
            </Card>

            <Card aria-label="Liczba produktów roboczych">
                <p class="text-secondary-500 dark:text-secondary-400 text-sm">
                    Produkty w draft
                </p>
                <p
                    class="text-secondary-900 dark:text-secondary-50 mt-2 text-3xl font-bold"
                >
                    —
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
    </AdminPanelShell>
</template>
