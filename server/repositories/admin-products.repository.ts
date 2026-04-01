import { serverSupabaseClient } from '#supabase/server';
import { resolveVariantImagePublicUrl } from '../utils/variant-image-storage';
import type {
    AdminProduct,
    AdminProductListItem,
    AdminProductsListResponse,
    AdminProductsQuery,
    CreateAdminProductInput,
    UpdateAdminProductInput,
} from '~/types/admin-product';

interface ProductRow {
    id: string;
    name: string;
    slug: string;
    sku: string;
    description: string | null;
    price: number;
    category: string;
    subcategory: string | null;
    material: string;
    status: 'draft' | 'active' | 'archived';
    updated_at: string;
}

interface ProductVariantRow {
    id: string;
    product_id: string;
    size: string;
    sku: string;
    price_override: number | null;
    is_active: boolean;
    inventory_items?: Array<{
        variant_id: string;
        quantity: number;
        low_stock_threshold: number;
    }>;
    variant_images?: Array<{
        id: string;
        variant_id: string;
        path: string;
        alt: string | null;
        is_primary: boolean;
        order_index: number;
        created_at: string;
    }>;
}

function mapProductBase(row: ProductRow) {
    return {
        id: row.id,
        name: row.name,
        slug: row.slug,
        sku: row.sku,
        description: row.description,
        price: row.price,
        category: row.category,
        subcategory: row.subcategory,
        material: row.material,
        status: row.status,
        updatedAt: row.updated_at,
    } as const;
}

export async function listAdminProductsRepository(
    event: Parameters<typeof serverSupabaseClient>[0],
    query: AdminProductsQuery,
): Promise<AdminProductsListResponse> {
    const client = await serverSupabaseClient(event);
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let builder = client
        .from('products')
        .select(
            'id,name,slug,sku,description,price,category,subcategory,material,status,updated_at',
            { count: 'exact' },
        )
        .range(from, to)
        .order('updated_at', { ascending: false });

    if (query.search) {
        const term = `%${query.search.trim()}%`;

        builder = builder.or(
            `name.ilike.${term},sku.ilike.${term},slug.ilike.${term}`,
        );
    }

    if (query.category && query.category !== 'all') {
        builder = builder.eq('category', query.category);
    }

    if (query.status && query.status !== 'all') {
        builder = builder.eq('status', query.status);
    }

    const { data, error, count } = await builder.returns<ProductRow[]>();

    if (error) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to load products',
            data: error,
        });
    }

    const productIds = (data ?? []).map((item) => item.id);
    const stockByProductId = await readStockAggregationByProductIds(
        event,
        productIds,
    );

    const items: AdminProductListItem[] = (data ?? []).map((row) => {
        const stockAgg = stockByProductId.get(row.id) ?? {
            totalStock: 0,
            lowStockVariantsCount: 0,
            variantsCount: 0,
        };

        return {
            ...mapProductBase(row),
            totalStock: stockAgg.totalStock,
            lowStockVariantsCount: stockAgg.lowStockVariantsCount,
            variantsCount: stockAgg.variantsCount,
        };
    });

    return {
        items: query.lowStockOnly
            ? items.filter((item) => item.lowStockVariantsCount > 0)
            : items,
        total: count ?? 0,
    };
}

async function readStockAggregationByProductIds(
    event: Parameters<typeof serverSupabaseClient>[0],
    productIds: string[],
): Promise<
    Map<
        string,
        {
            totalStock: number;
            lowStockVariantsCount: number;
            variantsCount: number;
        }
    >
> {
    const result = new Map<
        string,
        {
            totalStock: number;
            lowStockVariantsCount: number;
            variantsCount: number;
        }
    >();

    if (productIds.length === 0) {
        return result;
    }

    const client = await serverSupabaseClient(event);
    const { data, error } = await client
        .from('product_variants')
        .select(
            'id, product_id, inventory_items(quantity, low_stock_threshold)',
        )
        .in('product_id', productIds);

    if (error) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to aggregate stock',
            data: error,
        });
    }

    for (const row of data ?? []) {
        const productId = row.product_id as string;
        const inventory = (row.inventory_items?.[0] ?? {
            quantity: 0,
            low_stock_threshold: 0,
        }) as { quantity: number; low_stock_threshold: number };

        if (!result.has(productId)) {
            result.set(productId, {
                totalStock: 0,
                lowStockVariantsCount: 0,
                variantsCount: 0,
            });
        }

        const current = result.get(productId);

        if (!current) {
            continue;
        }

        current.totalStock += inventory.quantity;
        current.variantsCount += 1;

        if (inventory.quantity <= inventory.low_stock_threshold) {
            current.lowStockVariantsCount += 1;
        }
    }

    return result;
}

export async function getAdminProductByIdRepository(
    event: Parameters<typeof serverSupabaseClient>[0],
    productId: string,
): Promise<AdminProduct | null> {
    const client = await serverSupabaseClient(event);
    const { data: productRow, error: productError } = await client
        .from('products')
        .select(
            'id,name,slug,sku,description,price,category,subcategory,material,status,updated_at',
        )
        .eq('id', productId)
        .maybeSingle<ProductRow>();

    if (productError) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to load product',
            data: productError,
        });
    }

    if (!productRow) {
        return null;
    }

    const { data: variantsRows, error: variantsError } = await client
        .from('product_variants')
        .select(
            'id,product_id,size,sku,price_override,is_active,inventory_items(variant_id,quantity,low_stock_threshold),variant_images(id,variant_id,path,alt,is_primary,order_index,created_at)',
        )
        .eq('product_id', productId)
        .order('created_at', { ascending: true })
        .returns<ProductVariantRow[]>();

    if (variantsError) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to load product variants',
            data: variantsError,
        });
    }

    const variants = (variantsRows ?? []).map((variant) => ({
        id: variant.id,
        productId: variant.product_id,
        size: variant.size,
        sku: variant.sku,
        priceOverride: variant.price_override,
        isActive: variant.is_active,
        images: (variant.variant_images ?? [])
            .sort((a, b) => a.order_index - b.order_index)
            .map((image) => ({
                id: image.id,
                variantId: image.variant_id,
                url: resolveVariantImagePublicUrl(event, client, image.path),
                alt: image.alt,
                isPrimary: image.is_primary,
                order: image.order_index,
                createdAt: image.created_at,
            })),
    }));

    const options = {
        sizes: [...new Set(variants.map((variant) => variant.size))],
    };

    const inventory = (variantsRows ?? []).map((variant) => {
        const firstInventory = variant.inventory_items?.[0];

        return {
            variantId: variant.id,
            quantity: firstInventory?.quantity ?? 0,
            lowStockThreshold: firstInventory?.low_stock_threshold ?? 0,
        };
    });

    return {
        ...mapProductBase(productRow),
        options,
        variants,
        inventory,
    };
}

export async function createAdminProductRepository(
    event: Parameters<typeof serverSupabaseClient>[0],
    input: CreateAdminProductInput,
): Promise<{ id: string }> {
    const client = await serverSupabaseClient(event);
    const { data: productData, error: productError } = await client
        .from('products')
        .insert({
            name: input.name,
            slug: input.slug,
            sku: input.sku,
            description: input.description ?? null,
            price: input.price,
            category: input.category,
            subcategory: input.subcategory ?? null,
            material: input.material,
            status: input.status ?? 'draft',
        })
        .select('id')
        .single<{ id: string }>();

    if (productError || !productData) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to create product',
            data: productError,
        });
    }

    const variantRows = input.variants.map((variant) => ({
        product_id: productData.id,
        size: variant.size,
        sku: variant.sku,
        price_override: variant.priceOverride ?? null,
        is_active: variant.isActive ?? true,
    }));

    const { data: createdVariants, error: variantsError } = await client
        .from('product_variants')
        .insert(variantRows)
        .select('id, sku')
        .returns<Array<{ id: string; sku: string }>>();

    if (variantsError) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to create product variants',
            data: variantsError,
        });
    }

    const quantitiesBySku = new Map(
        input.variants.map((variant) => [variant.sku, variant]),
    );

    const inventoryRows = (createdVariants ?? []).map((variant) => {
        const source = quantitiesBySku.get(variant.sku);

        return {
            variant_id: variant.id,
            quantity: source?.quantity ?? 0,
            low_stock_threshold: source?.lowStockThreshold ?? 3,
        };
    });

    if (inventoryRows.length > 0) {
        const { error: inventoryError } = await client
            .from('inventory_items')
            .insert(inventoryRows);

        if (inventoryError) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to initialize inventory',
                data: inventoryError,
            });
        }
    }

    return { id: productData.id };
}

export async function updateAdminProductRepository(
    event: Parameters<typeof serverSupabaseClient>[0],
    productId: string,
    input: UpdateAdminProductInput,
): Promise<void> {
    const client = await serverSupabaseClient(event);
    const { error } = await client
        .from('products')
        .update({
            ...(input.name !== undefined ? { name: input.name } : {}),
            ...(input.slug !== undefined ? { slug: input.slug } : {}),
            ...(input.sku !== undefined ? { sku: input.sku } : {}),
            ...(input.description !== undefined
                ? { description: input.description }
                : {}),
            ...(input.price !== undefined ? { price: input.price } : {}),
            ...(input.category !== undefined
                ? { category: input.category }
                : {}),
            ...(input.subcategory !== undefined
                ? { subcategory: input.subcategory }
                : {}),
            ...(input.material !== undefined
                ? { material: input.material }
                : {}),
            ...(input.status !== undefined ? { status: input.status } : {}),
        })
        .eq('id', productId);

    if (error) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to update product',
            data: error,
        });
    }
}
