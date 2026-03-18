import type { H3Event } from 'h3';
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';

interface ProfileRoleRow {
    role: string;
}

export interface AdminContext {
    userId: string;
    role: string;
}

export async function requireAdmin(event: H3Event): Promise<AdminContext> {
    const user = await serverSupabaseUser(event);

    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized',
        });
    }

    const client = await serverSupabaseClient(event);
    const { data, error } = await client
        .from('profiles')
        .select('role')
        .eq('id', user.id)
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
        userId: user.id,
        role: data.role,
    };
}
