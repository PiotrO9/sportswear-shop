import { updateAdminProductRepository } from '../../../repositories/admin-products.repository';
import { requireAdmin } from '../../../utils/admin-auth';
import {
    productIdParamsSchema,
    updateAdminProductSchema,
} from '../../../validation/admin-products';
import {
    readValidatedBody,
    readValidatedParams,
} from '../../../utils/validation';

export default defineEventHandler(async (event) => {
    await requireAdmin(event);
    const params = readValidatedParams(event, productIdParamsSchema);
    const body = await readValidatedBody(event, updateAdminProductSchema);

    await updateAdminProductRepository(event, params.id, body);

    return {
        ok: true,
    };
});
