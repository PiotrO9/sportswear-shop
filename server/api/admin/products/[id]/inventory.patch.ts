import { updateInventoryRepository } from '~/server/repositories/admin-inventory.repository';
import { requireAdmin } from '~/server/utils/admin-auth';
import {
    productIdParamsSchema,
    updateInventorySchema,
} from '~/server/validation/admin-products';
import {
    readValidatedBody,
    readValidatedParams,
} from '~/server/utils/validation';

export default defineEventHandler(async (event) => {
    await requireAdmin(event);
    readValidatedParams(event, productIdParamsSchema);
    const body = await readValidatedBody(event, updateInventorySchema);

    await updateInventoryRepository(event, body);

    return {
        ok: true,
    };
});
