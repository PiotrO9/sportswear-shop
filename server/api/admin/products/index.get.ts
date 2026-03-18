import { listAdminProductsRepository } from '~/server/repositories/admin-products.repository';
import { requireAdmin } from '~/server/utils/admin-auth';
import { listAdminProductsQuerySchema } from '~/server/validation/admin-products';
import { readValidatedQuery } from '~/server/utils/validation';

export default defineEventHandler(async (event) => {
    await requireAdmin(event);
    const query = readValidatedQuery(event, listAdminProductsQuerySchema);
    const response = await listAdminProductsRepository(event, query);

    return response;
});
