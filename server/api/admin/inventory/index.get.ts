import { listInventoryWithDetailsRepository } from '../../../repositories/admin-inventory.repository';
import { requireAdmin } from '../../../utils/admin-auth';

export default defineEventHandler(async (event) => {
    await requireAdmin(event);
    const items = await listInventoryWithDetailsRepository(event);

    return {
        items,
        total: items.length,
    };
});
