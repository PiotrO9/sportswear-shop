import { requireAdmin } from '~/server/utils/admin-auth';

export default defineEventHandler(async (event) => {
    const admin = await requireAdmin(event);

    return {
        ok: true,
        userId: admin.userId,
        role: admin.role,
    };
});
