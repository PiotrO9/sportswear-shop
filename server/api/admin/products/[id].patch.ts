import { updateAdminProductRepository } from '~/server/repositories/admin-products.repository';
import { requireAdmin } from '~/server/utils/admin-auth';
import {
    productIdParamsSchema,
    updateAdminProductSchema,
} from '~/server/validation/admin-products';
import {
    readValidatedBody,
    readValidatedParams,
} from '~/server/utils/validation';

export default defineEventHandler(async (event) => {
    await requireAdmin(event);
    const params = readValidatedParams(event, productIdParamsSchema);
    const body = await readValidatedBody(event, updateAdminProductSchema);

    await updateAdminProductRepository(event, params.id, body);

    return {
        ok: true,
    };
});
