import { updateInventoryRepository } from '../../../../repositories/admin-inventory.repository';
import { requireAdmin } from '../../../../utils/admin-auth';
import {
    productIdParamsSchema,
    updateInventorySchema,
} from '../../../../validation/admin-products';
import {
    readValidatedBody,
    readValidatedParams,
} from '../../../../utils/validation';

export default defineEventHandler(async (event) => {
    await requireAdmin(event);
    readValidatedParams(event, productIdParamsSchema);
    const body = await readValidatedBody(event, updateInventorySchema);

    await updateInventoryRepository(event, body);

    return {
        ok: true,
    };
});
