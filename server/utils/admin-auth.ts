import type { H3Event } from 'h3';
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';

interface ProfileRoleRow {
    role: string;
}

interface SupabaseUserLike {
    id?: string;
    sub?: string;
}

export interface AdminContext {
    userId: string;
    role: string;
}

export async function requireAdmin(event: H3Event): Promise<AdminContext> {
    const user = (await serverSupabaseUser(event)) as SupabaseUserLike | null;

    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized',
        });
    }

    const userId = user.id || user.sub;

    if (!userId) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Invalid auth session',
        });
    }

    const client = await serverSupabaseClient(event);
    const { data, error } = await client
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle<ProfileRoleRow>();

    if (error) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Unable to verify user role',
            data: error,
        });
    }

    if (!data?.role || data.role !== 'admin') {
        throw createError({
            statusCode: 403,
            statusMessage: 'Forbidden',
        });
    }

    return {
        userId,
        role: data.role,
    };
}
