import { serverSupabaseClient } from '#supabase/server';
import type { H3Event } from 'h3';
import { resolveVariantImagePublicUrl } from '../utils/variant-image-storage';

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);

const MIME_TO_EXT: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
};

export interface UploadVariantImageResult {
    id: string;
    url: string;
    storagePath: string;
    alt: string | null;
    isPrimary: boolean;
    order: number;
}

export interface UploadProductSharedImageLinkResult extends UploadVariantImageResult {
    variantId: string;
}

export interface UploadProductSharedImageToVariantsResult {
    storagePath: string;
    linked: UploadProductSharedImageLinkResult[];
}

export async function uploadAdminVariantImageRepository(
    event: H3Event,
    productId: string,
    variantId: string,
    input: {
        buffer: Buffer;
        contentType: string;
        alt: string | null;
        wantPrimary: boolean;
    },
): Promise<UploadVariantImageResult> {
    const normalizedType =
        input.contentType.split(';')[0]?.trim().toLowerCase() ?? '';

    if (!ALLOWED_MIME.has(normalizedType)) {
        throw createError({
            statusCode: 415,
            statusMessage: 'Unsupported image type',
        });
    }

    const client = await serverSupabaseClient(event);
    const config = useRuntimeConfig(event);
    const bucket = String(config.productImagesBucket || 'product-images');
    const maxBytes = Number(config.productImageMaxBytes ?? 5 * 1024 * 1024);

    if (input.buffer.length > maxBytes) {
        throw createError({
            statusCode: 413,
            statusMessage: 'Image too large',
        });
    }

    const { data: variantRow, error: variantError } = await client
        .from('product_variants')
        .select('id')
        .eq('id', variantId)
        .eq('product_id', productId)
        .maybeSingle();

    if (variantError) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to verify variant',
            data: variantError,
        });
    }

    if (!variantRow) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Variant not found for this product',
        });
    }

    const ext = MIME_TO_EXT[normalizedType];
    const objectPath = `${productId}/${variantId}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await client.storage
        .from(bucket)
        .upload(objectPath, input.buffer, {
            contentType: normalizedType,
            upsert: false,
        });

    if (uploadError) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to upload image',
            data: uploadError,
        });
    }

    const { data: orderRows, error: orderError } = await client
        .from('variant_images')
        .select('order_index')
        .eq('variant_id', variantId);

    if (orderError) {
        await client.storage.from(bucket).remove([objectPath]);

        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to read image order',
            data: orderError,
        });
    }

    const rows = orderRows ?? [];
    const existingCount = rows.length;
    const nextOrder = rows.length
        ? Math.max(...rows.map((row) => row.order_index)) + 1
        : 0;

    let isPrimary = input.wantPrimary;

    if (!input.wantPrimary && existingCount === 0) {
        isPrimary = true;
    }

    if (isPrimary) {
        const { error: clearPrimaryError } = await client
            .from('variant_images')
            .update({ is_primary: false })
            .eq('variant_id', variantId);

        if (clearPrimaryError) {
            await client.storage.from(bucket).remove([objectPath]);

            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to update primary image flags',
                data: clearPrimaryError,
            });
        }
    }

    const { data: imageRow, error: insertError } = await client
        .from('variant_images')
        .insert({
            variant_id: variantId,
            path: objectPath,
            alt: input.alt,
            is_primary: isPrimary,
            order_index: nextOrder,
        })
        .select('id, path, alt, is_primary, order_index')
        .single();

    if (insertError || !imageRow) {
        await client.storage.from(bucket).remove([objectPath]);

        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to save image metadata',
            data: insertError,
        });
    }

    const url = resolveVariantImagePublicUrl(event, client, imageRow.path);

    return {
        id: imageRow.id,
        url,
        storagePath: imageRow.path,
        alt: imageRow.alt,
        isPrimary: imageRow.is_primary,
        order: imageRow.order_index,
    };
}

export async function uploadAdminProductSharedImageToVariantsRepository(
    event: H3Event,
    productId: string,
    variantIds: string[],
    input: {
        buffer: Buffer;
        contentType: string;
        alt: string | null;
        wantPrimary: boolean;
    },
): Promise<UploadProductSharedImageToVariantsResult> {
    const normalizedType =
        input.contentType.split(';')[0]?.trim().toLowerCase() ?? '';

    if (!ALLOWED_MIME.has(normalizedType)) {
        throw createError({
            statusCode: 415,
            statusMessage: 'Unsupported image type',
        });
    }

    const client = await serverSupabaseClient(event);
    const config = useRuntimeConfig(event);
    const bucket = String(config.productImagesBucket || 'product-images');
    const maxBytes = Number(config.productImageMaxBytes ?? 5 * 1024 * 1024);

    if (input.buffer.length > maxBytes) {
        throw createError({
            statusCode: 413,
            statusMessage: 'Image too large',
        });
    }

    const uniqueVariantIds = [...new Set(variantIds)];

    if (uniqueVariantIds.length === 0) {
        throw createError({
            statusCode: 400,
            statusMessage: 'At least one variant is required',
        });
    }

    const { data: productRow, error: productError } = await client
        .from('products')
        .select('id')
        .eq('id', productId)
        .maybeSingle();

    if (productError) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to verify product',
            data: productError,
        });
    }

    if (!productRow) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Product not found',
        });
    }

    const { data: variantRows, error: variantsError } = await client
        .from('product_variants')
        .select('id')
        .eq('product_id', productId)
        .in('id', uniqueVariantIds);

    if (variantsError) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to verify variants',
            data: variantsError,
        });
    }

    if (!variantRows || variantRows.length !== uniqueVariantIds.length) {
        throw createError({
            statusCode: 404,
            statusMessage: 'One or more variants not found for this product',
        });
    }

    const ext = MIME_TO_EXT[normalizedType];
    const objectPath = `${productId}/shared/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await client.storage
        .from(bucket)
        .upload(objectPath, input.buffer, {
            contentType: normalizedType,
            upsert: false,
        });

    if (uploadError) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to upload image',
            data: uploadError,
        });
    }

    const insertedIds: string[] = [];
    const linked: UploadProductSharedImageLinkResult[] = [];

    try {
        for (const variantId of uniqueVariantIds) {
            const { data: orderRows, error: orderError } = await client
                .from('variant_images')
                .select('order_index')
                .eq('variant_id', variantId);

            if (orderError) {
                throw createError({
                    statusCode: 500,
                    statusMessage: 'Failed to read image order',
                    data: orderError,
                });
            }

            const rows = orderRows ?? [];
            const nextOrder = rows.length
                ? Math.max(...rows.map((row) => row.order_index)) + 1
                : 0;

            const isPrimary = input.wantPrimary || rows.length === 0;

            if (isPrimary) {
                const { error: clearPrimaryError } = await client
                    .from('variant_images')
                    .update({ is_primary: false })
                    .eq('variant_id', variantId);

                if (clearPrimaryError) {
                    throw createError({
                        statusCode: 500,
                        statusMessage: 'Failed to update primary image flags',
                        data: clearPrimaryError,
                    });
                }
            }

            const { data: imageRow, error: insertError } = await client
                .from('variant_images')
                .insert({
                    variant_id: variantId,
                    path: objectPath,
                    alt: input.alt,
                    is_primary: isPrimary,
                    order_index: nextOrder,
                })
                .select('id, path, alt, is_primary, order_index')
                .single();

            if (insertError || !imageRow) {
                throw createError({
                    statusCode: 500,
                    statusMessage: 'Failed to save image metadata',
                    data: insertError,
                });
            }

            insertedIds.push(imageRow.id);

            const url = resolveVariantImagePublicUrl(
                event,
                client,
                imageRow.path,
            );

            linked.push({
                variantId,
                id: imageRow.id,
                url,
                storagePath: imageRow.path,
                alt: imageRow.alt,
                isPrimary: imageRow.is_primary,
                order: imageRow.order_index,
            });
        }
    } catch (caught) {
        if (insertedIds.length) {
            await client.from('variant_images').delete().in('id', insertedIds);
        }

        await client.storage.from(bucket).remove([objectPath]);

        if (caught && typeof caught === 'object' && 'statusCode' in caught) {
            throw caught;
        }

        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to link shared image to variants',
            data: caught,
        });
    }

    return {
        storagePath: objectPath,
        linked,
    };
}
