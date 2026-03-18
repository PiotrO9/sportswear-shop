import { createAdminProductRepository } from '../../../repositories/admin-products.repository';
import { requireAdmin } from '../../../utils/admin-auth';
import { createAdminProductSchema } from '../../../validation/admin-products';
import { readValidatedBody } from '../../../utils/validation';

export default defineEventHandler(async (event) => {
    await requireAdmin(event);
    const body = await readValidatedBody(event, createAdminProductSchema);
    const created = await createAdminProductRepository(event, body);

    setResponseStatus(event, 201);

    return created;
});
