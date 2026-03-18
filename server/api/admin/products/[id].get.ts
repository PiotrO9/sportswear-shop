import { getAdminProductByIdRepository } from '~/server/repositories/admin-products.repository';
import { requireAdmin } from '~/server/utils/admin-auth';
import { productIdParamsSchema } from '~/server/validation/admin-products';
import { readValidatedParams } from '~/server/utils/validation';

export default defineEventHandler(async (event) => {
    await requireAdmin(event);
    const params = readValidatedParams(event, productIdParamsSchema);
    const product = await getAdminProductByIdRepository(event, params.id);

    if (!product) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Product not found',
        });
    }

    return product;
});
