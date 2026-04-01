import type {
    AdminProduct,
    AdminProductsListResponse,
    AdminProductsQuery,
    AdminVariantImageUploadResponse,
    CreateAdminProductInput,
    UpdateAdminProductInput,
} from '~/types/admin-product';

function buildAdminProductsUrl(query: AdminProductsQuery = {}): string {
    const searchParams = new URLSearchParams();

    if (query.page) {
        searchParams.set('page', String(query.page));
    }

    if (query.pageSize) {
        searchParams.set('pageSize', String(query.pageSize));
    }

    if (query.search) {
        searchParams.set('search', query.search);
    }

    if (query.category) {
        searchParams.set('category', query.category);
    }

    if (query.status) {
        searchParams.set('status', query.status);
    }

    if (query.lowStockOnly !== undefined) {
        searchParams.set('lowStockOnly', String(query.lowStockOnly));
    }

    const serialized = searchParams.toString();

    if (!serialized) {
        return '/api/admin/products';
    }

    return `/api/admin/products?${serialized}`;
}

export function useAdminProducts() {
    async function listProducts(
        query: AdminProductsQuery = {},
    ): Promise<AdminProductsListResponse> {
        return $fetch<AdminProductsListResponse>(buildAdminProductsUrl(query), {
            method: 'GET',
            credentials: 'include',
        });
    }

    async function getProductById(productId: string): Promise<AdminProduct> {
        return $fetch<AdminProduct>(`/api/admin/products/${productId}`, {
            method: 'GET',
            credentials: 'include',
        });
    }

    async function createProduct(payload: CreateAdminProductInput): Promise<{
        id: string;
    }> {
        return $fetch<{ id: string }>('/api/admin/products', {
            method: 'POST',
            credentials: 'include',
            body: payload,
        });
    }

    async function updateProduct(
        productId: string,
        payload: UpdateAdminProductInput,
    ): Promise<{ ok: true }> {
        return $fetch<{ ok: true }>(`/api/admin/products/${productId}`, {
            method: 'PATCH',
            credentials: 'include',
            body: payload,
        });
    }

    async function uploadVariantImage(
        productId: string,
        variantId: string,
        file: File,
        options?: { alt?: string | null; isPrimary?: boolean },
    ): Promise<AdminVariantImageUploadResponse> {
        const formData = new FormData();

        formData.append('file', file);

        if (options?.alt != null && options.alt !== '') {
            formData.append('alt', options.alt);
        }

        if (options?.isPrimary) {
            formData.append('isPrimary', 'true');
        }

        return $fetch<AdminVariantImageUploadResponse>(
            `/api/admin/products/${productId}/variants/${variantId}/images`,
            {
                method: 'POST',
                credentials: 'include',
                body: formData,
            },
        );
    }

    return {
        listProducts,
        getProductById,
        createProduct,
        updateProduct,
        uploadVariantImage,
    };
}
