export interface LowStockInventoryItem {
    variantId: string;
    productId: string;
    quantity: number;
    lowStockThreshold: number;
}

export interface LowStockInventoryResponse {
    items: LowStockInventoryItem[];
    total: number;
}

export interface UpdateInventoryPayload {
    variantId: string;
    quantity: number;
    lowStockThreshold?: number;
}

export function useAdminInventory() {
    async function listLowStock(): Promise<LowStockInventoryResponse> {
        return $fetch<LowStockInventoryResponse>('/api/admin/inventory', {
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
        listLowStock,
        updateVariantInventory,
    };
}
