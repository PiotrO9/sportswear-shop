import { listAdminProductsRepository } from '../../../repositories/admin-products.repository';
import { requireAdmin } from '../../../utils/admin-auth';
import { listAdminProductsQuerySchema } from '../../../validation/admin-products';
import { readValidatedQuery } from '../../../utils/validation';

export default defineEventHandler(async (event) => {
    await requireAdmin(event);
    const query = readValidatedQuery(event, listAdminProductsQuerySchema);
    const response = await listAdminProductsRepository(event, query);

    return response;
});
