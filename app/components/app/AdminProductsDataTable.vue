<script setup lang="ts">
import type { ColumnDef } from '@tanstack/vue-table';
import type { AdminProductListItem } from '~/types/admin-product';
import type { ProductCategory } from '~/types/product';
import { FlexRender, getCoreRowModel, useVueTable } from '@tanstack/vue-table';
import {
    Archive,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    CircleDashed,
} from 'lucide-vue-next';
import { computed, h, ref, watch } from 'vue';
import AdminProductsTableRowActions from '~/components/app/AdminProductsTableRowActions.vue';
import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
import { Checkbox } from '@/components/shadcn/checkbox';
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
import { valueUpdater } from '@/lib/utils';

const props = withDefaults(
    defineProps<{
        items: AdminProductListItem[];
        isLoading: boolean;
        page: number;
        pageSize: number;
        totalCount: number;
        totalPages: number;
        /** Id produktu w trakcie publikacji (draft → aktywny), żeby zablokować przycisk */
        publishingProductId?: string | null;
    }>(),
    {
        publishingProductId: null,
    },
);

const emit = defineEmits<{
    'update:page': [page: number];
    'update:pageSize': [size: number];
    'publish-draft': [productId: string];
}>();

const { t, locale } = useI18n();

const rowSelection = ref<Record<string, boolean>>({});

const pageSizeOptions = [10, 20, 50] as const;

function formatCategoryLabel(category: ProductCategory): string {
    const map: Record<ProductCategory, string> = {
        men: t('navMen'),
        women: t('navWomen'),
        kids: t('navKids'),
        sport: t('navSport'),
    };

    return map[category];
}

function formatStatusLabel(status: AdminProductListItem['status']): string {
    if (status === 'draft') return t('adminStatusDraft');

    if (status === 'active') return t('adminStatusActive');

    return t('adminStatusArchived');
}

function formatPrice(value: number): string {
    const tag = String(locale.value).toLowerCase().startsWith('pl')
        ? 'pl-PL'
        : 'en-US';

    return new Intl.NumberFormat(tag, {
        style: 'currency',
        currency: 'PLN',
        minimumFractionDigits: 2,
    }).format(value);
}

function variantNoun(count: number): string {
    if (count === 1) {
        return t('adminVariantSingular');
    }

    if (String(locale.value).toLowerCase().startsWith('pl')) {
        const c = count % 10;
        const c100 = count % 100;

        if (c >= 2 && c <= 4 && (c100 < 12 || c100 > 14)) {
            return t('adminVariantPluralFew');
        }

        return t('adminVariantPluralMany');
    }

    return t('adminVariantPluralMany');
}

function renderStatusCell(row: AdminProductListItem) {
    if (row.status === 'active') {
        return h('div', { class: 'flex items-center gap-2' }, [
            h(CheckCircle2, {
                class: 'size-4 shrink-0 text-emerald-500',
                'aria-hidden': true,
            }),
            h('span', { class: 'text-sm' }, formatStatusLabel('active')),
        ]);
    }

    if (row.status === 'draft') {
        return h('div', { class: 'flex items-center gap-2' }, [
            h(CircleDashed, {
                class: 'text-muted-foreground size-4 shrink-0',
                'aria-hidden': true,
            }),
            h('span', { class: 'text-sm' }, formatStatusLabel('draft')),
        ]);
    }

    return h('div', { class: 'flex items-center gap-2' }, [
        h(Archive, {
            class: 'text-muted-foreground size-4 shrink-0',
            'aria-hidden': true,
        }),
        h('span', { class: 'text-sm' }, formatStatusLabel('archived')),
    ]);
}

const columns = computed<ColumnDef<AdminProductListItem>[]>(() => [
    {
        id: 'select',
        header: ({ table }) =>
            h('div', { class: 'flex items-center pl-1' }, [
                h(Checkbox, {
                    ariaLabel: t('adminSelectAllRowsAria'),
                    modelValue:
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && 'indeterminate'),
                    'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
                        table.toggleAllPageRowsSelected(!!value),
                }),
            ]),
        cell: ({ row }) =>
            h('div', { class: 'flex items-center' }, [
                h(Checkbox, {
                    ariaLabel: t('adminSelectRowAria', {
                        name: row.original.name,
                    }),
                    modelValue: row.getIsSelected(),
                    'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
                        row.toggleSelected(!!value),
                }),
            ]),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'name',
        header: () =>
            h(
                'span',
                { class: 'font-semibold text-foreground' },
                t('adminColumnName'),
            ),
        cell: ({ row }) =>
            h('div', { class: 'max-w-[240px] sm:max-w-xs' }, [
                h('div', { class: 'truncate font-medium' }, row.original.name),
                h(
                    'div',
                    {
                        class: 'text-muted-foreground mt-0.5 truncate font-mono text-xs',
                    },
                    row.original.sku,
                ),
            ]),
    },
    {
        accessorKey: 'category',
        header: t('adminColumnCategory'),
        cell: ({ row }) =>
            h(Badge, { variant: 'outline', class: 'font-normal' }, () =>
                formatCategoryLabel(row.original.category),
            ),
    },
    {
        accessorKey: 'status',
        header: t('adminColumnStatus'),
        cell: ({ row }) => renderStatusCell(row.original),
    },
    {
        accessorKey: 'price',
        header: () =>
            h(
                'div',
                { class: 'text-right tabular-nums' },
                t('adminColumnPrice'),
            ),
        cell: ({ row }) =>
            h(
                'div',
                { class: 'text-right text-sm tabular-nums' },
                formatPrice(row.original.price),
            ),
    },
    {
        accessorKey: 'totalStock',
        header: () =>
            h(
                'div',
                { class: 'text-right tabular-nums' },
                t('adminColumnStock'),
            ),
        cell: ({ row }) => {
            const p = row.original;
            const variantWord = variantNoun(p.variantsCount);

            return h('div', { class: 'text-right text-sm tabular-nums' }, [
                h('div', {}, [
                    h('span', { class: 'font-medium' }, String(p.totalStock)),
                    h(
                        'span',
                        { class: 'text-muted-foreground ml-1 text-xs' },
                        t('adminPcsSuffix'),
                    ),
                ]),
                h(
                    'div',
                    {
                        class: 'text-muted-foreground mt-0.5 text-xs font-normal',
                    },
                    `${p.variantsCount} ${variantWord}`,
                ),
                p.lowStockVariantsCount > 0
                    ? h(
                          'p',
                          {
                              class: 'mt-1 text-xs font-medium text-amber-600 dark:text-amber-400',
                              role: 'status',
                          },
                          t('adminLowStockShort', {
                              low: p.lowStockVariantsCount,
                              total: p.variantsCount,
                          }),
                      )
                    : null,
            ]);
        },
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) =>
            h(AdminProductsTableRowActions, {
                productId: row.original.id,
                productName: row.original.name,
                editTo: `/admin/products/${row.original.id}`,
                status: row.original.status,
                isPublishing: props.publishingProductId === row.original.id,
                onPublishDraft: (id: string) => emit('publish-draft', id),
            }),
    },
]);

const table = useVueTable({
    data: computed(() => props.items),
    get columns() {
        return columns.value;
    },
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    get pageCount() {
        return props.totalPages;
    },
    onRowSelectionChange: (updater) => valueUpdater(updater, rowSelection),
    state: {
        get rowSelection() {
            return rowSelection.value;
        },
    },
});

watch(
    () => props.page,
    () => {
        rowSelection.value = {};
    },
);

function handlePageSizeChange(value: unknown): void {
    if (typeof value !== 'string') {
        return;
    }

    const next = Number.parseInt(value, 10);

    if (!Number.isFinite(next)) {
        return;
    }

    emit('update:pageSize', next);
}

function handleFirstPage(): void {
    emit('update:page', 1);
}

function handlePrevPage(): void {
    if (props.page <= 1) {
        return;
    }

    emit('update:page', props.page - 1);
}

function handleNextPage(): void {
    if (props.page >= props.totalPages) {
        return;
    }

    emit('update:page', props.page + 1);
}

function handleLastPage(): void {
    emit('update:page', props.totalPages);
}

function handlePaginationButtonKeyDown(
    event: KeyboardEvent,
    action: () => void,
): void {
    if (event.key !== 'Enter' && event.key !== ' ') {
        return;
    }

    event.preventDefault();
    action();
}

const selectedOnPageCount = computed(
    () => table.getSelectedRowModel().rows.length,
);
</script>

<template>
    <div
        class="bg-card text-card-foreground border-border w-full overflow-hidden rounded-lg border"
        role="region"
        :aria-label="t('adminTableProductsAria')"
    >
        <Table>
            <TableHeader>
                <TableRow
                    v-for="headerGroup in table.getHeaderGroups()"
                    :key="headerGroup.id"
                    class="border-border hover:bg-transparent"
                >
                    <TableHead
                        v-for="header in headerGroup.headers"
                        :key="header.id"
                        class="text-muted-foreground border-border bg-muted/30 h-11 border-b px-4 text-xs font-semibold tracking-wide uppercase"
                    >
                        <FlexRender
                            v-if="!header.isPlaceholder"
                            :render="header.column.columnDef.header"
                            :props="header.getContext()"
                        />
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <template v-if="isLoading">
                    <TableRow>
                        <TableCell
                            colspan="7"
                            class="text-muted-foreground h-24 text-center text-sm"
                        >
                            {{ t('adminTableLoading') }}
                        </TableCell>
                    </TableRow>
                </template>
                <template v-else-if="items.length === 0">
                    <TableRow>
                        <TableCell
                            colspan="7"
                            class="text-muted-foreground h-24 text-center text-sm"
                        >
                            {{ t('adminTableEmpty') }}
                        </TableCell>
                    </TableRow>
                </template>
                <template v-else>
                    <TableRow
                        v-for="row in table.getRowModel().rows"
                        :key="row.id"
                        class="border-border hover:bg-muted/40 data-[state=selected]:bg-muted/60"
                        :data-state="
                            row.getIsSelected() ? 'selected' : undefined
                        "
                    >
                        <TableCell
                            v-for="cell in row.getVisibleCells()"
                            :key="cell.id"
                            class="border-border border-b px-4 py-3 align-middle"
                        >
                            <FlexRender
                                :render="cell.column.columnDef.cell"
                                :props="cell.getContext()"
                            />
                        </TableCell>
                    </TableRow>
                </template>
            </TableBody>
        </Table>

        <div
            class="border-border flex flex-col gap-4 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
        >
            <p class="text-muted-foreground text-sm tabular-nums" role="status">
                {{
                    t('adminTableSelectionStatus', {
                        selected: selectedOnPageCount,
                        total: totalCount,
                    })
                }}
            </p>

            <div
                class="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:gap-6"
            >
                <div class="flex items-center gap-2">
                    <span
                        id="adminProductsPageSizeLabel"
                        class="text-muted-foreground text-sm whitespace-nowrap"
                    >
                        {{ t('adminRowsPerPage') }}
                    </span>
                    <Select
                        :model-value="String(pageSize)"
                        @update:model-value="handlePageSizeChange"
                    >
                        <SelectTrigger
                            class="border-border h-8 w-18"
                            aria-labelledby="adminProductsPageSizeLabel"
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
                        :aria-label="t('adminPaginationProductsAria')"
                    >
                        <Button
                            variant="outline"
                            class="h-8 w-8 p-0"
                            :disabled="page <= 1 || isLoading"
                            :aria-label="t('adminFirstPage')"
                            @click="handleFirstPage"
                            @keydown="
                                handlePaginationButtonKeyDown(
                                    $event,
                                    handleFirstPage,
                                )
                            "
                        >
                            <ChevronsLeft class="h-4 w-4" aria-hidden="true" />
                        </Button>
                        <Button
                            variant="outline"
                            class="h-8 w-8 p-0"
                            :disabled="page <= 1 || isLoading"
                            :aria-label="t('adminPrevPage')"
                            @click="handlePrevPage"
                            @keydown="
                                handlePaginationButtonKeyDown(
                                    $event,
                                    handlePrevPage,
                                )
                            "
                        >
                            <ChevronLeft class="h-4 w-4" aria-hidden="true" />
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
                            @click="handleNextPage"
                            @keydown="
                                handlePaginationButtonKeyDown(
                                    $event,
                                    handleNextPage,
                                )
                            "
                        >
                            <ChevronRight class="h-4 w-4" aria-hidden="true" />
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
                            @click="handleLastPage"
                            @keydown="
                                handlePaginationButtonKeyDown(
                                    $event,
                                    handleLastPage,
                                )
                            "
                        >
                            <ChevronsRight class="h-4 w-4" aria-hidden="true" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
