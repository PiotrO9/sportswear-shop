import { readMultipartFormData } from 'h3';
import { uploadAdminVariantImageRepository } from '../../../../../../repositories/admin-variant-images.repository';
import { requireAdmin } from '../../../../../../utils/admin-auth';
import { readValidatedParams } from '../../../../../../utils/validation';
import { productVariantImageParamsSchema } from '../../../../../../validation/admin-products';

export default defineEventHandler(async (event) => {
    await requireAdmin(event);
    const params = readValidatedParams(event, productVariantImageParamsSchema);

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

    const result = await uploadAdminVariantImageRepository(
        event,
        params.id,
        params.variantId,
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
