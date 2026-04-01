<script setup lang="ts">
import { Button } from '@/components/shadcn/button';

definePageMeta({
    middleware: ['admin'],
});

const localePath = useLocalePath();

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
</script>

<template>
    <AdminPanelShell
        title="Panel administratora"
        description="Szybki podgląd stanu katalogu i magazynu."
    >
        <div class="grid gap-4 md:grid-cols-3">
            <div
                role="region"
                aria-label="Liczba produktów"
                class="border-border bg-card text-card-foreground rounded-xl border p-5 shadow-sm"
            >
                <p class="text-muted-foreground text-sm">Wszystkie produkty</p>
                <p class="text-foreground mt-2 text-3xl font-bold tabular-nums">
                    —
                </p>
            </div>

            <div
                role="region"
                aria-label="Liczba niskich stanów magazynowych"
                class="border-border bg-card text-card-foreground rounded-xl border p-5 shadow-sm"
            >
                <p class="text-muted-foreground text-sm">
                    Niskie stany wariantów
                </p>
                <p class="text-foreground mt-2 text-3xl font-bold tabular-nums">
                    —
                </p>
            </div>

            <div
                role="region"
                aria-label="Liczba produktów roboczych"
                class="border-border bg-card text-card-foreground rounded-xl border p-5 shadow-sm"
            >
                <p class="text-muted-foreground text-sm">Produkty w draft</p>
                <p class="text-foreground mt-2 text-3xl font-bold tabular-nums">
                    —
                </p>
            </div>
        </div>

        <div
            role="region"
            aria-label="Szybkie akcje panelu"
            class="border-border bg-card text-card-foreground rounded-xl border p-5 shadow-sm"
        >
            <p class="text-foreground mb-4 font-semibold">Szybkie akcje</p>

            <div class="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                <Button
                    v-for="action in quickActions"
                    :key="action.to"
                    variant="outline"
                    class="h-auto min-h-10 w-full justify-center py-2 text-center whitespace-normal"
                    as-child
                >
                    <NuxtLink
                        :to="action.to"
                        :aria-label="action.ariaLabel"
                        class="inline-flex items-center justify-center"
                    >
                        {{ action.label }}
                    </NuxtLink>
                </Button>
            </div>
        </div>
    </AdminPanelShell>
</template>
