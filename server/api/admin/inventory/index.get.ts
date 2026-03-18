import { listLowStockInventoryRepository } from '~/server/repositories/admin-inventory.repository';
import { requireAdmin } from '~/server/utils/admin-auth';

export default defineEventHandler(async (event) => {
    await requireAdmin(event);
    const items = await listLowStockInventoryRepository(event);

    return {
        items,
        total: items.length,
    };
});
