import type { serverSupabaseClient } from '#supabase/server';
import type { H3Event } from 'h3';

type SupabaseServerClient = Awaited<ReturnType<typeof serverSupabaseClient>>;

export function resolveVariantImagePublicUrl(
    event: H3Event,
    client: SupabaseServerClient,
    storagePath: string,
): string {
    const bucket = String(
        useRuntimeConfig(event).productImagesBucket || 'product-images',
    );
    const { data } = client.storage.from(bucket).getPublicUrl(storagePath);

    return data.publicUrl;
}
