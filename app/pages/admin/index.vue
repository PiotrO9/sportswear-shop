<script setup lang="ts">
import { Button } from '@/components/shadcn/button';

definePageMeta({
    middleware: ['admin'],
});

const localePath = useLocalePath();
const { t } = useI18n();

const quickActions = computed(() => [
    {
        to: localePath('/admin/products/new'),
        label: t('adminQuickActionNewProduct'),
        ariaLabel: t('adminQuickActionNewProductAria'),
    },
    {
        to: localePath('/admin/products'),
        label: t('adminQuickActionProductList'),
        ariaLabel: t('adminQuickActionProductListAria'),
    },
    {
        to: localePath('/admin/inventory'),
        label: t('adminQuickActionLowStock'),
        ariaLabel: t('adminQuickActionLowStockAria'),
    },
]);
</script>

<template>
    <AdminPanelShell
        :title="t('adminDashboardTitle')"
        :description="t('adminDashboardDescription')"
    >
        <div class="grid gap-4 md:grid-cols-3">
            <div
                role="region"
                :aria-label="t('adminDashboardStatProductsAria')"
                class="border-border bg-card text-card-foreground rounded-xl border p-5 shadow-sm"
            >
                <p class="text-muted-foreground text-sm">
                    {{ t('adminDashboardStatAllProducts') }}
                </p>
                <p class="text-foreground mt-2 text-3xl font-bold tabular-nums">
                    —
                </p>
            </div>

            <div
                role="region"
                :aria-label="t('adminDashboardStatLowStockAria')"
                class="border-border bg-card text-card-foreground rounded-xl border p-5 shadow-sm"
            >
                <p class="text-muted-foreground text-sm">
                    {{ t('adminDashboardStatLowStock') }}
                </p>
                <p class="text-foreground mt-2 text-3xl font-bold tabular-nums">
                    —
                </p>
            </div>

            <div
                role="region"
                :aria-label="t('adminDashboardStatDraftsAria')"
                class="border-border bg-card text-card-foreground rounded-xl border p-5 shadow-sm"
            >
                <p class="text-muted-foreground text-sm">
                    {{ t('adminDashboardStatDrafts') }}
                </p>
                <p class="text-foreground mt-2 text-3xl font-bold tabular-nums">
                    —
                </p>
            </div>
        </div>

        <div
            role="region"
            :aria-label="t('adminDashboardQuickActionsAria')"
            class="border-border bg-card text-card-foreground rounded-xl border p-5 shadow-sm"
        >
            <p class="text-foreground mb-4 font-semibold">
                {{ t('adminDashboardQuickActionsHeading') }}
            </p>

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
