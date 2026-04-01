<script setup lang="ts">
definePageMeta({
    middleware: ['admin'],
});
</script>

<template>
    <AdminPanelShell
        title="Magazyn"
        description="Szybka edycja niskich stanów magazynowych dla wariantów."
    >
        <Card aria-label="Niskie stany magazynowe">
            <template #header>
                <p
                    class="text-secondary-900 dark:text-secondary-50 font-semibold"
                >
                    Warianty z niskim stanem
                </p>
            </template>

            <p class="text-secondary-600 dark:text-secondary-300 text-sm">—</p>
        </Card>
    </AdminPanelShell>
</template>
