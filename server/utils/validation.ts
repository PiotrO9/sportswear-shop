import type { z } from 'zod';

export function readValidatedBody<TSchema extends z.ZodTypeAny>(
    event: Parameters<typeof readBody>[0],
    schema: TSchema,
): Promise<z.infer<TSchema>> {
    return readBody(event).then((body) => {
        const parsed = schema.safeParse(body);

        if (parsed.success) {
            return parsed.data;
        }

        throw createError({
            statusCode: 422,
            statusMessage: 'Validation error',
            data: parsed.error.flatten(),
        });
    });
}

export function readValidatedQuery<TSchema extends z.ZodTypeAny>(
    event: Parameters<typeof getQuery>[0],
    schema: TSchema,
): z.infer<TSchema> {
    const query = getQuery(event);
    const parsed = schema.safeParse(query);

    if (parsed.success) {
        return parsed.data;
    }

    throw createError({
        statusCode: 422,
        statusMessage: 'Validation error',
        data: parsed.error.flatten(),
    });
}

export function readValidatedParams<TSchema extends z.ZodTypeAny>(
    event: Parameters<typeof getRouterParams>[0],
    schema: TSchema,
): z.infer<TSchema> {
    const params = getRouterParams(event);
    const parsed = schema.safeParse(params);

    if (parsed.success) {
        return parsed.data;
    }

    throw createError({
        statusCode: 422,
        statusMessage: 'Validation error',
        data: parsed.error.flatten(),
    });
}
