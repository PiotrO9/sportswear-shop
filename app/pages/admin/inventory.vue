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
        <div
            role="region"
            aria-label="Niskie stany magazynowe"
            class="border-border bg-card text-card-foreground rounded-xl border p-5 shadow-sm"
        >
            <p class="text-foreground mb-3 font-semibold">
                Warianty z niskim stanem
            </p>
            <p class="text-muted-foreground text-sm">—</p>
        </div>
    </AdminPanelShell>
</template>
