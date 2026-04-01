<script setup lang="ts">
import type { AdminProductListItem } from '~/types/admin-product';
import Dialog from '@/components/ui/Dialog.vue';
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
const { t } = useI18n();
const { listProducts, updateProduct } = useAdminProducts();
const { addToast } = useToast();

const publishingProductId = ref<string | null>(null);

const publishDialogOpen = ref(false);
const publishDialogProduct = ref<{ id: string; name: string } | null>(null);

const search = ref('');
const statusFilter = ref<'all' | 'draft' | 'active' | 'archived'>('all');
const page = ref(1);
const pageSize = ref(20);

const items = ref<AdminProductListItem[]>([]);
const totalCount = ref(0);
const isLoading = ref(true);
const loadError = ref('');

let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;

const statusOptions = computed(() => [
    { value: 'all' as const, label: t('adminStatusAll') },
    { value: 'draft' as const, label: t('adminStatusDraft') },
    { value: 'active' as const, label: t('adminStatusActive') },
    { value: 'archived' as const, label: t('adminStatusArchived') },
]);

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
            error instanceof Error ? error.message : t('adminUnknownError');

        loadError.value = t('adminProductsLoadError', { message });
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

function handleOpenPublishConfirmDialog(productId: string): void {
    if (publishingProductId.value !== null || publishDialogOpen.value) {
        return;
    }

    const item = items.value.find((row) => row.id === productId);

    publishDialogProduct.value = {
        id: productId,
        name: item?.name ?? '',
    };
    publishDialogOpen.value = true;
}

async function handlePublishDraftConfirm(): Promise<void> {
    const ctx = publishDialogProduct.value;

    if (!ctx) {
        return;
    }

    if (publishingProductId.value !== null) {
        return;
    }

    publishingProductId.value = ctx.id;

    try {
        await updateProduct(ctx.id, { status: 'active' });
        await loadProducts();
    } catch (error) {
        const message =
            error instanceof Error ? error.message : t('adminUnknownError');

        addToast({
            variant: 'error',
            title: t('adminPublishFailedTitle'),
            description: message,
        });
    } finally {
        publishingProductId.value = null;
        publishDialogProduct.value = null;
    }
}

function handlePublishDraftDialogCancel(): void {
    publishDialogProduct.value = null;
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
        :title="t('adminProductsTitle')"
        :description="t('adminProductsDescription')"
    >
        <Dialog
            v-model:open="publishDialogOpen"
            :title="t('adminPublishDialogTitle')"
            :cancel-text="t('adminCancel')"
            :confirm-text="t('adminPublishConfirm')"
            @confirm="handlePublishDraftConfirm"
            @cancel="handlePublishDraftDialogCancel"
        >
            <template #default>
                <div
                    class="text-secondary-600 dark:text-secondary-400 space-y-3 text-sm"
                >
                    <p id="dialog-message">
                        {{ t('adminPublishDialogPart1') }}
                        <span
                            class="text-secondary-900 dark:text-secondary-100 font-medium"
                            >{{ t('adminStatusDraft') }}</span
                        >
                        {{ t('adminPublishDialogPart2') }}
                        <span
                            class="text-secondary-900 dark:text-secondary-100 font-medium"
                            >{{ t('adminStatusActive') }}</span
                        >
                        {{ t('adminPublishDialogPart3') }}
                    </p>
                    <p
                        class="text-secondary-900 dark:text-secondary-100 border-border border-t pt-2 text-xs font-medium"
                    >
                        {{ publishDialogProduct?.name || '—' }}
                    </p>
                </div>
            </template>
        </Dialog>

        <div
            role="region"
            :aria-label="t('adminProductsFiltersAria')"
            class="border-border bg-card text-card-foreground rounded-xl border p-5 shadow-sm"
        >
            <div class="grid gap-3 md:grid-cols-[1fr_220px]">
                <div class="space-y-2">
                    <label
                        id="adminProductsSearchLabel"
                        for="adminProductsSearch"
                        class="text-foreground text-sm font-medium"
                    >
                        {{ t('adminProductsSearchLabel') }}
                    </label>
                    <input
                        id="adminProductsSearch"
                        v-model="search"
                        type="search"
                        class="border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:outline-none"
                        aria-labelledby="adminProductsSearchLabel"
                        :placeholder="t('adminProductsSearchPlaceholder')"
                    />
                </div>

                <div class="space-y-2">
                    <label
                        id="adminProductsStatusLabel"
                        for="adminProductsStatusTrigger"
                        class="text-foreground text-sm font-medium"
                    >
                        {{ t('adminStatusLabel') }}
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
                            <SelectValue
                                :placeholder="t('adminSelectStatusPlaceholder')"
                            />
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
            :aria-label="t('adminProductsLoadErrorAria')"
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
                :aria-label="t('adminRetryLoadProducts')"
                @click="loadProducts"
            >
                {{ t('adminRetryLoadProducts') }}
            </Button>
        </div>

        <div class="space-y-3">
            <div
                class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            >
                <div>
                    <p class="text-foreground font-semibold">
                        {{ t('adminProductsListHeading') }}
                    </p>
                    <p class="text-muted-foreground mt-1 text-xs">
                        <template v-if="!isLoading">
                            {{
                                t('adminProductsCountInDb', {
                                    count: totalCount,
                                })
                            }}
                        </template>
                        <template v-else>{{ t('adminLoading') }}</template>
                    </p>
                </div>
                <Button class="shrink-0" as-child>
                    <NuxtLink
                        :to="localePath('/admin/products/new')"
                        :aria-label="t('adminAddProductAria')"
                    >
                        {{ t('adminAddProduct') }}
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
                :publishing-product-id="publishingProductId"
                @update:page="handleTablePageChange"
                @update:page-size="handleTablePageSizeChange"
                @publish-draft="handleOpenPublishConfirmDialog"
            />
        </div>
    </AdminPanelShell>
</template>
