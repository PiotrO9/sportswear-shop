import { z } from 'zod';

const productCategorySchema = z.enum(['men', 'women', 'kids', 'sport']);
const productSizeSchema = z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL']);
const adminProductStatusSchema = z.enum(['draft', 'active', 'archived']);

export const listAdminProductsQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
    search: z.string().trim().optional(),
    category: productCategorySchema.or(z.literal('all')).optional(),
    status: adminProductStatusSchema.or(z.literal('all')).optional(),
    lowStockOnly: z
        .union([z.literal('true'), z.literal('false')])
        .optional()
        .transform((value) => value === 'true'),
});

export const productIdParamsSchema = z.object({
    id: z.string().uuid(),
});

export const productVariantImageParamsSchema = z.object({
    id: z.string().uuid(),
    variantId: z.string().uuid(),
});

export const createAdminProductSchema = z.object({
    name: z.string().trim().min(1).max(160),
    slug: z
        .string()
        .trim()
        .min(1)
        .max(180)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    sku: z.string().trim().min(1).max(120),
    description: z.string().trim().max(50000).nullable().optional(),
    price: z.number().nonnegative(),
    category: productCategorySchema,
    subcategory: z.string().trim().max(120).nullable().optional(),
    status: adminProductStatusSchema.default('draft'),
    options: z.object({
        sizes: z.array(productSizeSchema).min(1),
    }),
    variants: z
        .array(
            z.object({
                size: productSizeSchema,
                sku: z.string().trim().min(1).max(120),
                priceOverride: z.number().nonnegative().nullable().optional(),
                isActive: z.boolean().optional(),
                quantity: z.number().int().nonnegative().optional(),
                lowStockThreshold: z.number().int().nonnegative().optional(),
            }),
        )
        .min(1),
});

export const updateAdminProductSchema = z
    .object({
        name: z.string().trim().min(1).max(160).optional(),
        slug: z
            .string()
            .trim()
            .min(1)
            .max(180)
            .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
            .optional(),
        sku: z.string().trim().min(1).max(120).optional(),
        description: z.string().trim().max(50000).nullable().optional(),
        price: z.number().nonnegative().optional(),
        category: productCategorySchema.optional(),
        subcategory: z.string().trim().max(120).nullable().optional(),
        status: adminProductStatusSchema.optional(),
    })
    .refine((value) => Object.keys(value).length > 0, {
        message: 'At least one field is required',
    });

export const updateInventorySchema = z.object({
    variantId: z.string().uuid(),
    quantity: z.number().int().nonnegative(),
    lowStockThreshold: z.number().int().nonnegative().optional(),
});
