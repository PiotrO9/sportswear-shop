import { serverSupabaseClient } from '#supabase/server';

export async function updateInventoryRepository(
    event: Parameters<typeof serverSupabaseClient>[0],
    input: {
        variantId: string;
        quantity: number;
        lowStockThreshold?: number;
    },
): Promise<void> {
    const client = await serverSupabaseClient(event);

    const payload: Record<string, number> = {
        quantity: input.quantity,
    };

    if (input.lowStockThreshold !== undefined) {
        payload.low_stock_threshold = input.lowStockThreshold;
    }

    const { error } = await client
        .from('inventory_items')
        .update(payload)
        .eq('variant_id', input.variantId);

    if (error) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to update inventory',
            data: error,
        });
    }
}

export async function listLowStockInventoryRepository(
    event: Parameters<typeof serverSupabaseClient>[0],
): Promise<
    Array<{
        variantId: string;
        productId: string;
        quantity: number;
        lowStockThreshold: number;
    }>
> {
    const client = await serverSupabaseClient(event);
    const { data, error } = await client
        .from('inventory_items')
        .select(
            'variant_id,quantity,low_stock_threshold,product_variants!inner(id,product_id)',
        );

    if (error) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to load inventory',
            data: error,
        });
    }

    const rows = (data ?? [])
        .map((row) => {
            const variant = Array.isArray(row.product_variants)
                ? row.product_variants[0]
                : row.product_variants;

            if (!variant?.id || !variant?.product_id) {
                return null;
            }

            return {
                variantId: row.variant_id as string,
                productId: variant.product_id as string,
                quantity: row.quantity as number,
                lowStockThreshold: row.low_stock_threshold as number,
            };
        })
        .filter((value): value is NonNullable<typeof value> => value !== null)
        .filter((item) => item.quantity <= item.lowStockThreshold);

    return rows;
}
