export interface AdminInventoryRow {
    variantId: string;
    productId: string;
    productName: string;
    variantSize: string;
    variantSku: string;
    quantity: number;
    lowStockThreshold: number;
}

export interface AdminInventoryListResponse {
    items: AdminInventoryRow[];
    total: number;
}

export interface UpdateInventoryPayload {
    variantId: string;
    quantity: number;
    lowStockThreshold?: number;
}

export function useAdminInventory() {
    async function listInventory(): Promise<AdminInventoryListResponse> {
        return $fetch<AdminInventoryListResponse>('/api/admin/inventory', {
            method: 'GET',
            credentials: 'include',
        });
    }

    async function updateVariantInventory(
        productId: string,
        payload: UpdateInventoryPayload,
    ): Promise<{ ok: true }> {
        return $fetch<{ ok: true }>(
            `/api/admin/products/${productId}/inventory`,
            {
                method: 'PATCH',
                credentials: 'include',
                body: payload,
            },
        );
    }

    return {
        listInventory,
        updateVariantInventory,
    };
}
