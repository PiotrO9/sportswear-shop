import { getAdminProductByIdRepository } from '../../../repositories/admin-products.repository';
import { requireAdmin } from '../../../utils/admin-auth';
import { productIdParamsSchema } from '../../../validation/admin-products';
import { readValidatedParams } from '../../../utils/validation';

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
