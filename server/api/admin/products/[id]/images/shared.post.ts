import { serverSupabaseClient } from '#supabase/server';
import { readMultipartFormData } from 'h3';
import { z } from 'zod';
import { uploadAdminProductSharedImageToVariantsRepository } from '../../../../../repositories/admin-variant-images.repository';
import { requireAdmin } from '../../../../../utils/admin-auth';
import { readValidatedParams } from '../../../../../utils/validation';
import { productIdParamsSchema } from '../../../../../validation/admin-products';

const variantIdsJsonSchema = z.array(z.string().uuid());

export default defineEventHandler(async (event) => {
    await requireAdmin(event);
    const params = readValidatedParams(event, productIdParamsSchema);

    const parts = await readMultipartFormData(event);

    if (!parts?.length) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Expected multipart body',
        });
    }

    const filePart = parts.find(
        (part) => part.name === 'file' && part.filename && part.data?.length,
    );

    if (!filePart?.data) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing file field',
        });
    }

    const rawType = filePart.type?.trim();

    if (!rawType) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing file content type',
        });
    }

    let alt: string | null = null;
    const altPart = parts.find((part) => part.name === 'alt');

    if (altPart?.data) {
        const text = altPart.data.toString('utf8').trim();

        alt = text.length ? text.slice(0, 500) : null;
    }

    let wantPrimary = false;
    const primaryPart = parts.find((part) => part.name === 'isPrimary');

    if (primaryPart?.data) {
        const value = primaryPart.data.toString('utf8').trim().toLowerCase();

        wantPrimary =
            value === 'true' ||
            value === '1' ||
            value === 'yes' ||
            value === 'on';
    }

    let variantIds: string[] | undefined;
    const variantIdsPart = parts.find((part) => part.name === 'variantIds');

    if (variantIdsPart?.data?.length) {
        const raw = variantIdsPart.data.toString('utf8').trim();

        if (raw.length) {
            let parsedJson: unknown;

            try {
                parsedJson = JSON.parse(raw);
            } catch {
                throw createError({
                    statusCode: 400,
                    statusMessage: 'variantIds must be valid JSON array',
                });
            }

            const parsed = variantIdsJsonSchema.safeParse(parsedJson);

            if (!parsed.success) {
                throw createError({
                    statusCode: 400,
                    statusMessage: 'variantIds must be an array of UUIDs',
                });
            }

            variantIds = parsed.data;
        }
    }

    const client = await serverSupabaseClient(event);

    let resolvedVariantIds = variantIds;

    if (!resolvedVariantIds?.length) {
        const { data: allVariants, error: listError } = await client
            .from('product_variants')
            .select('id')
            .eq('product_id', params.id);

        if (listError) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to list variants',
                data: listError,
            });
        }

        resolvedVariantIds = (allVariants ?? []).map(
            (row: { id: string }) => row.id,
        );
    }

    if (!resolvedVariantIds.length) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Product has no variants to attach images to',
        });
    }

    const result = await uploadAdminProductSharedImageToVariantsRepository(
        event,
        params.id,
        resolvedVariantIds,
        {
            buffer: filePart.data,
            contentType: rawType,
            alt,
            wantPrimary,
        },
    );

    setResponseStatus(event, 201);

    return result;
});
