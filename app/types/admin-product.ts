import type {
    ProductCategory,
    ProductMaterial,
    ProductSize,
} from '~/types/product';

export type AdminProductStatus = 'draft' | 'active' | 'archived';

export interface ProductOptionSet {
    sizes: ProductSize[];
}

export interface ProductVariantImage {
    id: string;
    variantId: string;
    url: string;
    alt: string | null;
    isPrimary: boolean;
    order: number;
    createdAt?: string;
}

export interface AdminVariantImageUploadResponse {
    id: string;
    url: string;
    storagePath: string;
    alt: string | null;
    isPrimary: boolean;
    order: number;
}

export interface ProductVariant {
    id: string;
    productId: string;
    size: ProductSize;
    sku: string;
    priceOverride: number | null;
    isActive: boolean;
    images: ProductVariantImage[];
}

export interface InventoryItem {
    variantId: string;
    quantity: number;
    lowStockThreshold: number;
}

export interface InventoryAdjustment {
    variantId: string;
    delta: number;
    reason: string;
}

export interface AdminProductBase {
    id: string;
    name: string;
    slug: string;
    sku: string;
    description: string | null;
    price: number;
    category: ProductCategory;
    subcategory: string | null;
    material: ProductMaterial;
    status: AdminProductStatus;
    updatedAt: string;
}

export interface AdminProductListItem extends AdminProductBase {
    totalStock: number;
    lowStockVariantsCount: number;
    variantsCount: number;
}

export interface AdminProduct extends AdminProductBase {
    options: ProductOptionSet;
    variants: ProductVariant[];
    inventory: InventoryItem[];
}

export interface AdminProductsListResponse {
    items: AdminProductListItem[];
    total: number;
}

export interface AdminProductsQuery {
    page?: number;
    pageSize?: number;
    search?: string;
    category?: ProductCategory | 'all';
    status?: AdminProductStatus | 'all';
    lowStockOnly?: boolean;
}

export interface CreateProductVariantInput {
    size: ProductSize;
    sku: string;
    priceOverride?: number | null;
    isActive?: boolean;
    quantity?: number;
    lowStockThreshold?: number;
}

export interface CreateAdminProductInput {
    name: string;
    slug: string;
    sku: string;
    description?: string | null;
    price: number;
    category: ProductCategory;
    subcategory?: string | null;
    material: ProductMaterial;
    status?: AdminProductStatus;
    options: ProductOptionSet;
    variants: CreateProductVariantInput[];
}

export interface UpdateAdminProductInput {
    name?: string;
    slug?: string;
    sku?: string;
    description?: string | null;
    price?: number;
    category?: ProductCategory;
    subcategory?: string | null;
    material?: ProductMaterial;
    status?: AdminProductStatus;
}

export interface UpdateInventoryInput {
    variantId: string;
    quantity: number;
    lowStockThreshold?: number;
}
