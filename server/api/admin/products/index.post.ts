import { createAdminProductRepository } from '~/server/repositories/admin-products.repository';
import { requireAdmin } from '~/server/utils/admin-auth';
import { createAdminProductSchema } from '~/server/validation/admin-products';
import { readValidatedBody } from '~/server/utils/validation';

export default defineEventHandler(async (event) => {
    await requireAdmin(event);
    const body = await readValidatedBody(event, createAdminProductSchema);
    const created = await createAdminProductRepository(event, body);

    setResponseStatus(event, 201);

    return created;
});
