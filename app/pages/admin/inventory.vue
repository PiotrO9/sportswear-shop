<script setup lang="ts">
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from 'lucide-vue-next';
import { Button } from '@/components/shadcn/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/shadcn/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/shadcn/table';
import Input from '@/components/ui/Input.vue';
import Dialog from '@/components/ui/Dialog.vue';
import type { AdminInventoryRow } from '~/composables/useAdminInventory';

definePageMeta({
    middleware: ['admin'],
});

const localePath = useLocalePath();
const { t } = useI18n();
const { listInventory, updateVariantInventory } = useAdminInventory();
const { addToast } = useToast();

const items = ref<AdminInventoryRow[]>([]);
const isLoading = ref(true);
const loadError = ref('');
const updatingVariantId = ref<string | null>(null);

const page = ref(1);
const pageSize = ref(20);

const pageSizeOptions = [10, 20, 50] as const;

const totalCount = computed(() => items.value.length);

const totalPages = computed(() =>
    Math.max(1, Math.ceil(totalCount.value / pageSize.value)),
);

const paginatedItems = computed(() => {
    const start = (page.value - 1) * pageSize.value;

    return items.value.slice(start, start + pageSize.value);
});

const inventoryRangeLabel = computed(() => {
    const total = totalCount.value;

    if (total === 0) {
        return '';
    }

    const from = (page.value - 1) * pageSize.value + 1;
    const to = Math.min(page.value * pageSize.value, total);

    return t('adminInventoryRowsRange', { from, to, total });
});

watch(totalPages, (nextTotalPages) => {
    if (page.value > nextTotalPages) {
        page.value = nextTotalPages;
    }
});

interface DeltaContext {
    variantId: string;
    productId: string;
    currentQty: number;
    nextQty: number;
    productLabel: string;
}

const deltaDialogOpen = ref(false);
const deltaContext = ref<DeltaContext | null>(null);

const customDialogOpen = ref(false);
const customRow = ref<AdminInventoryRow | null>(null);
const customAmountInput = ref('');

async function handleLoadInventory(): Promise<void> {
    isLoading.value = true;
    loadError.value = '';

    try {
        const response = await listInventory();

        items.value = response.items;
    } catch (error) {
        const message =
            error instanceof Error ? error.message : t('adminUnknownError');

        loadError.value = t('adminInventoryLoadError', { message });
        items.value = [];
    } finally {
        isLoading.value = false;
    }
}

async function commitQuantity(
    variantId: string,
    productId: string,
    nextQuantity: number,
): Promise<boolean> {
    if (updatingVariantId.value) {
        return false;
    }

    const rowBefore = items.value.find((item) => item.variantId === variantId);
    const productLabel = rowBefore
        ? `${rowBefore.productName} · ${rowBefore.variantSize}`
        : t('adminSelectedVariant');
    const previousQty = rowBefore?.quantity ?? 0;

    updatingVariantId.value = variantId;

    try {
        await updateVariantInventory(productId, {
            variantId,
            quantity: nextQuantity,
        });

        const row = items.value.find((item) => item.variantId === variantId);

        if (row) {
            row.quantity = nextQuantity;
        }

        addToast({
            title: t('adminInventorySavedTitle'),
            description: t('adminInventorySavedDesc', {
                label: productLabel,
                from: previousQty,
                to: nextQuantity,
            }),
            variant: 'success',
        });

        return true;
    } catch (error) {
        const message =
            error instanceof Error ? error.message : t('adminUnknownError');

        addToast({
            title: t('adminInventorySaveFailedTitle'),
            description: `${productLabel} — ${message}`,
            variant: 'error',
        });

        return false;
    } finally {
        updatingVariantId.value = null;
    }
}

function handleOpenDeltaDialog(row: AdminInventoryRow, delta: -1 | 1): void {
    if (delta === -1 && row.quantity < 1) {
        return;
    }

    const nextQty = Math.max(0, row.quantity + delta);

    if (nextQty === row.quantity) {
        return;
    }

    deltaContext.value = {
        variantId: row.variantId,
        productId: row.productId,
        currentQty: row.quantity,
        nextQty: nextQty,
        productLabel: `${row.productName} · ${row.variantSize}`,
    };
    deltaDialogOpen.value = true;
}

async function handleDeltaDialogConfirm(): Promise<void> {
    const ctx = deltaContext.value;

    if (!ctx) {
        return;
    }

    await commitQuantity(ctx.variantId, ctx.productId, ctx.nextQty);
    deltaContext.value = null;
}

function handleDeltaDialogCancel(): void {
    deltaContext.value = null;
}

function handleOpenCustomDialog(row: AdminInventoryRow): void {
    customRow.value = row;
    customAmountInput.value = '';
    customDialogOpen.value = true;
}

function handleCustomAmountInput(value: string | number): void {
    customAmountInput.value = String(value);
}

function handleCustomDialogClose(): void {
    customDialogOpen.value = false;
    customRow.value = null;
    customAmountInput.value = '';
}

function handleCustomDialogCancel(): void {
    handleCustomDialogClose();
}

async function handleCustomDialogApply(): Promise<void> {
    const row = customRow.value;

    if (!row) {
        return;
    }

    const trimmed = String(customAmountInput.value).trim();

    if (trimmed === '') {
        addToast({
            title: t('adminInventoryEnterQtyTitle'),
            description: t('adminInventoryEnterQtyDesc'),
            variant: 'error',
        });

        return;
    }

    const amount = Number.parseInt(trimmed, 10);

    if (!Number.isFinite(amount) || amount < 0) {
        addToast({
            title: t('adminInventoryInvalidQtyTitle'),
            description: t('adminInventoryInvalidQtyDesc'),
            variant: 'error',
        });

        return;
    }

    const nextQty = amount;

    if (nextQty === row.quantity) {
        addToast({
            title: t('adminInventoryNoChangeTitle'),
            description: t('adminInventoryNoChangeDesc'),
            variant: 'info',
        });

        return;
    }

    const ok = await commitQuantity(row.variantId, row.productId, nextQty);

    if (ok) {
        handleCustomDialogClose();
    }
}

function isRowBusy(variantId: string): boolean {
    return updatingVariantId.value === variantId;
}

function handleInventoryPageSizeChange(value: unknown): void {
    if (typeof value !== 'string') {
        return;
    }

    const next = Number.parseInt(value, 10);

    if (!Number.isFinite(next)) {
        return;
    }

    pageSize.value = next;
    page.value = 1;
}

function handleInventoryFirstPage(): void {
    page.value = 1;
}

function handleInventoryPrevPage(): void {
    if (page.value <= 1) {
        return;
    }

    page.value = page.value - 1;
}

function handleInventoryNextPage(): void {
    if (page.value >= totalPages.value) {
        return;
    }

    page.value = page.value + 1;
}

function handleInventoryLastPage(): void {
    page.value = totalPages.value;
}

function handleInventoryPaginationButtonKeyDown(
    event: KeyboardEvent,
    action: () => void,
): void {
    if (event.key !== 'Enter' && event.key !== ' ') {
        return;
    }

    event.preventDefault();
    action();
}

onMounted(() => {
    handleLoadInventory();
});
</script>

<template>
    <AdminPanelShell
        :title="t('adminInventoryTitle')"
        :description="t('adminInventoryDescription')"
    >
        <Dialog
            v-model:open="deltaDialogOpen"
            :title="t('adminInventoryDeltaDialogTitle')"
            :cancel-text="t('adminCancel')"
            :confirm-text="t('adminInventoryDeltaConfirm')"
            @confirm="handleDeltaDialogConfirm"
            @cancel="handleDeltaDialogCancel"
        >
            <template #default>
                <div
                    class="text-secondary-600 dark:text-secondary-400 space-y-3 text-sm"
                >
                    <p id="dialog-message">
                        {{ t('adminInventoryDeltaMessage') }}
                    </p>
                    <p class="text-secondary-900 dark:text-secondary-100">
                        <span class="text-muted-foreground">{{
                            t('adminInventoryCurrentQty')
                        }}</span>
                        <span class="ml-1 font-semibold tabular-nums">{{
                            deltaContext?.currentQty ?? '—'
                        }}</span>
                        <span class="text-muted-foreground">
                            {{ ' ' + t('adminInventoryPcsShort') }}</span
                        >
                    </p>
                    <p class="text-secondary-900 dark:text-secondary-100">
                        <span class="text-muted-foreground">{{
                            t('adminInventoryNextQty')
                        }}</span>
                        <span class="ml-1 font-semibold tabular-nums">{{
                            deltaContext?.nextQty ?? '—'
                        }}</span>
                        <span class="text-muted-foreground">
                            {{ ' ' + t('adminInventoryPcsShort') }}</span
                        >
                    </p>
                    <p
                        class="text-secondary-500 dark:text-secondary-500 border-border border-t pt-2 text-xs"
                    >
                        {{ deltaContext?.productLabel }}
                    </p>
                </div>
            </template>
        </Dialog>

        <Dialog
            v-model:open="customDialogOpen"
            :title="t('adminCustomQtyDialogTitle')"
        >
            <template #default>
                <div
                    v-if="customRow"
                    class="text-secondary-600 dark:text-secondary-400 space-y-4 text-sm"
                >
                    <p>
                        <span class="text-muted-foreground">{{
                            t('adminInventoryProductLabel')
                        }}</span>
                        <span
                            class="text-secondary-900 dark:text-secondary-100 ml-1 font-medium"
                        >
                            {{ customRow.productName }} ·
                            {{ customRow.variantSize }}
                        </span>
                    </p>
                    <p>
                        <span class="text-muted-foreground">{{
                            t('adminInventoryCurrentQty')
                        }}</span>
                        <span class="ml-1 font-semibold tabular-nums">{{
                            customRow.quantity
                        }}</span>
                        {{ ' ' + t('adminInventoryPcsShort') }}
                    </p>
                    <p
                        class="text-secondary-500 dark:text-secondary-400 text-xs"
                    >
                        {{ t('adminInventoryCustomHint') }}
                    </p>
                    <div>
                        <label
                            class="text-secondary-900 dark:text-secondary-100 mb-1 block text-sm font-medium"
                            :for="`custom-qty-${customRow.variantId}`"
                        >
                            {{ t('adminInventoryNewQtyLabel') }}
                        </label>
                        <Input
                            :id="`custom-qty-${customRow.variantId}`"
                            :model-value="customAmountInput"
                            type="number"
                            :min="0"
                            step="1"
                            :placeholder="t('adminInventoryNewQtyPlaceholder')"
                            :aria-label="t('adminInventoryNewQtyAria')"
                            :is-disabled="
                                customRow
                                    ? isRowBusy(customRow.variantId)
                                    : false
                            "
                            @update:model-value="handleCustomAmountInput"
                        />
                    </div>
                </div>
            </template>
            <template #footer>
                <div class="flex w-full justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        :aria-label="t('adminCancelQtyChangeAria')"
                        @click="handleCustomDialogCancel"
                    >
                        {{ t('adminCancel') }}
                    </Button>
                    <Button
                        type="button"
                        :disabled="
                            customRow ? isRowBusy(customRow.variantId) : false
                        "
                        :aria-label="t('adminApplyQtyChangeAria')"
                        @click="handleCustomDialogApply"
                    >
                        {{ t('adminApply') }}
                    </Button>
                </div>
            </template>
        </Dialog>

        <div class="space-y-3">
            <div
                class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            >
                <div>
                    <p class="text-foreground font-semibold">
                        {{ t('adminInventoryVariantsHeading') }}
                    </p>
                    <p class="text-muted-foreground mt-1 text-xs">
                        <template v-if="!isLoading">
                            {{
                                t('adminInventoryPositionsCount', {
                                    count: items.length,
                                })
                            }}
                        </template>
                        <template v-else>{{ t('adminLoading') }}</template>
                    </p>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    class="shrink-0"
                    :disabled="isLoading"
                    :aria-label="t('adminRefreshInventoryAria')"
                    @click="handleLoadInventory"
                >
                    {{ t('adminRefresh') }}
                </Button>
            </div>

            <div
                v-if="loadError"
                role="alert"
                :aria-label="t('adminInventoryLoadErrorAria')"
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
                    :aria-label="t('adminRetryLoadInventory')"
                    @click="handleLoadInventory"
                >
                    {{ t('adminRetryLoadInventory') }}
                </Button>
            </div>

            <div
                class="bg-card text-card-foreground border-border w-full overflow-hidden rounded-lg border"
                role="region"
                :aria-label="t('adminInventoryTableAria')"
                :aria-busy="isLoading"
            >
                <Table>
                    <TableHeader>
                        <TableRow class="border-border hover:bg-transparent">
                            <TableHead
                                class="text-muted-foreground border-border bg-muted/30 h-11 border-b px-4 text-xs font-semibold tracking-wide uppercase"
                            >
                                {{ t('adminInventoryColProduct') }}
                            </TableHead>
                            <TableHead
                                class="text-muted-foreground border-border bg-muted/30 h-11 border-b px-4 text-xs font-semibold tracking-wide uppercase"
                            >
                                {{ t('adminInventoryColSize') }}
                            </TableHead>
                            <TableHead
                                class="text-muted-foreground border-border bg-muted/30 h-11 border-b px-4 text-xs font-semibold tracking-wide uppercase"
                            >
                                {{ t('adminInventoryColSku') }}
                            </TableHead>
                            <TableHead
                                class="text-muted-foreground border-border bg-muted/30 h-11 border-b px-4 text-right text-xs font-semibold tracking-wide uppercase tabular-nums"
                            >
                                {{ t('adminInventoryColStock') }}
                            </TableHead>
                            <TableHead
                                class="text-muted-foreground border-border bg-muted/30 h-11 border-b px-4 text-xs font-semibold tracking-wide uppercase"
                            >
                                {{ t('adminInventoryColQuick') }}
                            </TableHead>
                            <TableHead
                                class="text-muted-foreground border-border bg-muted/30 h-11 border-b px-4 text-xs font-semibold tracking-wide uppercase"
                            >
                                {{ t('adminInventoryColCustom') }}
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <template v-if="isLoading">
                            <TableRow>
                                <TableCell
                                    colspan="6"
                                    class="text-muted-foreground border-border h-24 border-b px-4 text-center text-sm"
                                >
                                    {{ t('adminInventoryLoading') }}
                                </TableCell>
                            </TableRow>
                        </template>
                        <template v-else-if="items.length === 0">
                            <TableRow>
                                <TableCell
                                    colspan="6"
                                    class="text-muted-foreground border-border h-24 border-b px-4 text-center text-sm"
                                >
                                    {{ t('adminInventoryEmpty') }}
                                </TableCell>
                            </TableRow>
                        </template>
                        <template v-else>
                            <TableRow
                                v-for="row in paginatedItems"
                                :key="row.variantId"
                                class="border-border hover:bg-muted/40"
                            >
                                <TableCell
                                    class="border-border border-b px-4 py-3 align-middle"
                                >
                                    <NuxtLink
                                        :to="
                                            localePath(
                                                `/admin/products/${row.productId}`,
                                            )
                                        "
                                        class="text-primary focus-visible:ring-primary rounded-sm font-medium hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                                        :aria-label="
                                            t('adminInventoryEditLinkAria', {
                                                name: row.productName,
                                            })
                                        "
                                    >
                                        {{ row.productName }}
                                    </NuxtLink>
                                </TableCell>
                                <TableCell
                                    class="border-border border-b px-4 py-3 align-middle"
                                >
                                    <span class="text-foreground text-sm">{{
                                        row.variantSize
                                    }}</span>
                                </TableCell>
                                <TableCell
                                    class="border-border border-b px-4 py-3 align-middle"
                                >
                                    <span
                                        class="text-muted-foreground font-mono text-xs"
                                        >{{ row.variantSku || '—' }}</span
                                    >
                                </TableCell>
                                <TableCell
                                    class="border-border border-b px-4 py-3 text-right align-middle tabular-nums"
                                >
                                    <span
                                        class="text-foreground text-sm font-medium"
                                        >{{ row.quantity }}</span
                                    >
                                    <span
                                        class="text-muted-foreground ml-1 text-xs"
                                        >{{ t('adminInventoryPcsShort') }}</span
                                    >
                                </TableCell>
                                <TableCell
                                    class="border-border border-b px-4 py-3 align-middle"
                                >
                                    <div
                                        class="flex flex-wrap items-center gap-2"
                                    >
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            class="h-8 min-w-9 px-2"
                                            :disabled="
                                                row.quantity < 1 ||
                                                isRowBusy(row.variantId)
                                            "
                                            :aria-label="
                                                t(
                                                    'adminInventoryMinusOneAria',
                                                    {
                                                        name: row.productName,
                                                        size: row.variantSize,
                                                    },
                                                )
                                            "
                                            @click="
                                                handleOpenDeltaDialog(row, -1)
                                            "
                                        >
                                            −1
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            class="h-8 min-w-9 px-2"
                                            :disabled="isRowBusy(row.variantId)"
                                            :aria-label="
                                                t('adminInventoryPlusOneAria', {
                                                    name: row.productName,
                                                    size: row.variantSize,
                                                })
                                            "
                                            @click="
                                                handleOpenDeltaDialog(row, 1)
                                            "
                                        >
                                            +1
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell
                                    class="border-border border-b px-4 py-3 align-middle"
                                >
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        class="h-8 whitespace-nowrap"
                                        :disabled="isRowBusy(row.variantId)"
                                        :aria-label="
                                            t(
                                                'adminInventoryCustomButtonAria',
                                                {
                                                    name: row.productName,
                                                    size: row.variantSize,
                                                },
                                            )
                                        "
                                        @click="handleOpenCustomDialog(row)"
                                    >
                                        {{ t('adminInventoryCustomButton') }}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        </template>
                    </TableBody>
                </Table>

                <div
                    v-if="!isLoading && items.length > 0"
                    class="border-border flex flex-col gap-4 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                    <p
                        class="text-muted-foreground text-sm tabular-nums"
                        role="status"
                        aria-live="polite"
                    >
                        {{ inventoryRangeLabel }}
                    </p>

                    <div
                        class="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:gap-6"
                    >
                        <div class="flex items-center gap-2">
                            <span
                                id="adminInventoryPageSizeLabel"
                                class="text-muted-foreground text-sm whitespace-nowrap"
                            >
                                {{ t('adminRowsPerPage') }}
                            </span>
                            <Select
                                :model-value="String(pageSize)"
                                @update:model-value="
                                    handleInventoryPageSizeChange
                                "
                            >
                                <SelectTrigger
                                    class="border-border h-8 w-18"
                                    aria-labelledby="adminInventoryPageSizeLabel"
                                >
                                    <SelectValue placeholder="—" />
                                </SelectTrigger>
                                <SelectContent align="end">
                                    <SelectItem
                                        v-for="opt in pageSizeOptions"
                                        :key="opt"
                                        :value="String(opt)"
                                        class="text-sm"
                                    >
                                        {{ opt }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div
                            class="flex items-center justify-between gap-4 sm:justify-end"
                        >
                            <p
                                class="text-muted-foreground text-sm tabular-nums"
                                aria-live="polite"
                            >
                                {{
                                    t('adminPageOf', {
                                        current: page,
                                        total: totalPages,
                                    })
                                }}
                            </p>
                            <div
                                class="flex items-center gap-1"
                                role="navigation"
                                :aria-label="t('adminPaginationInventoryAria')"
                            >
                                <Button
                                    variant="outline"
                                    class="h-8 w-8 p-0"
                                    :disabled="page <= 1 || isLoading"
                                    :aria-label="t('adminFirstPage')"
                                    type="button"
                                    @click="handleInventoryFirstPage"
                                    @keydown="
                                        handleInventoryPaginationButtonKeyDown(
                                            $event,
                                            handleInventoryFirstPage,
                                        )
                                    "
                                >
                                    <ChevronsLeft
                                        class="h-4 w-4"
                                        aria-hidden="true"
                                    />
                                </Button>
                                <Button
                                    variant="outline"
                                    class="h-8 w-8 p-0"
                                    :disabled="page <= 1 || isLoading"
                                    :aria-label="t('adminPrevPage')"
                                    type="button"
                                    @click="handleInventoryPrevPage"
                                    @keydown="
                                        handleInventoryPaginationButtonKeyDown(
                                            $event,
                                            handleInventoryPrevPage,
                                        )
                                    "
                                >
                                    <ChevronLeft
                                        class="h-4 w-4"
                                        aria-hidden="true"
                                    />
                                </Button>
                                <Button
                                    variant="outline"
                                    class="h-8 w-8 p-0"
                                    :disabled="
                                        page >= totalPages ||
                                        isLoading ||
                                        totalPages < 1
                                    "
                                    :aria-label="t('adminNextPage')"
                                    type="button"
                                    @click="handleInventoryNextPage"
                                    @keydown="
                                        handleInventoryPaginationButtonKeyDown(
                                            $event,
                                            handleInventoryNextPage,
                                        )
                                    "
                                >
                                    <ChevronRight
                                        class="h-4 w-4"
                                        aria-hidden="true"
                                    />
                                </Button>
                                <Button
                                    variant="outline"
                                    class="h-8 w-8 p-0"
                                    :disabled="
                                        page >= totalPages ||
                                        isLoading ||
                                        totalPages < 1
                                    "
                                    :aria-label="t('adminLastPage')"
                                    type="button"
                                    @click="handleInventoryLastPage"
                                    @keydown="
                                        handleInventoryPaginationButtonKeyDown(
                                            $event,
                                            handleInventoryLastPage,
                                        )
                                    "
                                >
                                    <ChevronsRight
                                        class="h-4 w-4"
                                        aria-hidden="true"
                                    />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AdminPanelShell>
</template>
