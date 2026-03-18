<script setup lang="ts">
import type { CreateAdminProductInput } from '~/types/admin-product';
import type {
    ProductCategory,
    ProductColor,
    ProductMaterial,
    ProductSize,
} from '~/types/product';

definePageMeta({
    middleware: ['admin'],
});

const localePath = useLocalePath();
const { addToast } = useToast();
const { createProduct } = useAdminProducts();

const isSaving = ref(false);
const formError = ref('');

const name = ref('');
const slug = ref('');
const sku = ref('');
const description = ref('');
const price = ref<number | ''>('');
const category = ref<ProductCategory>('men');
const subcategory = ref('');
const material = ref<ProductMaterial>('cotton');
const status = ref<'draft' | 'active' | 'archived'>('draft');
const sizes = ref<ProductSize[]>(['M']);
const colors = ref<ProductColor[]>(['black']);

const categoryOptions: Array<{ value: ProductCategory; label: string }> = [
    { value: 'men', label: 'Mężczyźni' },
    { value: 'women', label: 'Kobiety' },
    { value: 'kids', label: 'Dzieci' },
    { value: 'sport', label: 'Sport' },
];

const materialOptions: Array<{ value: ProductMaterial; label: string }> = [
    { value: 'cotton', label: 'Bawełna' },
    { value: 'polyester', label: 'Poliester' },
    { value: 'blend', label: 'Mieszanka' },
    { value: 'lycra', label: 'Lycra' },
];

const sizeOptions: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const colorOptions: ProductColor[] = [
    'black',
    'white',
    'grey',
    'navy',
    'red',
    'blue',
];

const statusOptions: Array<{
    value: 'draft' | 'active' | 'archived';
    label: string;
}> = [
    { value: 'draft', label: 'Draft' },
    { value: 'active', label: 'Aktywny' },
    { value: 'archived', label: 'Archiwalny' },
];

const generatedVariantsCount = computed(
    () => sizes.value.length * colors.value.length,
);
const canSubmit = computed(() => {
    if (!name.value.trim() || !slug.value.trim() || !sku.value.trim()) {
        return false;
    }

    if (price.value === '' || Number(price.value) < 0) {
        return false;
    }

    if (sizes.value.length === 0 || colors.value.length === 0) {
        return false;
    }

    if (generatedVariantsCount.value === 0) {
        return false;
    }

    return true;
});

function handleToggleSize(size: ProductSize): void {
    if (sizes.value.includes(size)) {
        sizes.value = sizes.value.filter((item) => item !== size);

        return;
    }

    sizes.value = [...sizes.value, size];
}

function handleToggleColor(color: ProductColor): void {
    if (colors.value.includes(color)) {
        colors.value = colors.value.filter((item) => item !== color);

        return;
    }

    colors.value = [...colors.value, color];
}

function formatVariantSku(
    baseSku: string,
    sizeValue: ProductSize,
    colorValue: ProductColor,
): string {
    return `${baseSku}-${sizeValue}-${colorValue}`.toUpperCase();
}

function buildCreatePayload(): CreateAdminProductInput {
    const normalizedPrice = Number(price.value);
    const variants = sizes.value.flatMap((sizeValue) =>
        colors.value.map((colorValue) => ({
            size: sizeValue,
            color: colorValue,
            sku: formatVariantSku(sku.value.trim(), sizeValue, colorValue),
            isActive: true,
            quantity: 0,
            lowStockThreshold: 3,
        })),
    );

    return {
        name: name.value.trim(),
        slug: slug.value.trim(),
        sku: sku.value.trim().toUpperCase(),
        description: description.value.trim() || null,
        price: normalizedPrice,
        category: category.value,
        subcategory: subcategory.value.trim() || null,
        material: material.value,
        status: status.value,
        options: {
            sizes: sizes.value,
            colors: colors.value,
        },
        variants,
    };
}

function handleNameBlur(): void {
    if (slug.value.trim()) {
        return;
    }

    const nextSlug = name.value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

    slug.value = nextSlug;
}

async function handleSubmit(): Promise<void> {
    if (!canSubmit.value || isSaving.value) {
        return;
    }

    isSaving.value = true;
    formError.value = '';

    try {
        const payload = buildCreatePayload();
        const created = await createProduct(payload);

        addToast({
            title: 'Produkt utworzony',
            description: `Utworzono produkt i ${payload.variants.length} wariantów.`,
            variant: 'success',
        });

        await navigateTo(localePath(`/admin/products/${created.id}`));
    } catch (error) {
        const message =
            error instanceof Error ? error.message : 'Nieznany błąd';

        formError.value = `Nie udało się utworzyć produktu: ${message}`;

        addToast({
            title: 'Błąd zapisu',
            description: formError.value,
            variant: 'error',
        });
    } finally {
        isSaving.value = false;
    }
}
</script>

<template>
    <AdminPanelShell
        title="Dodaj produkt"
        description="Utwórz nowy produkt, wybierz rozmiary i kolory, a system wygeneruje warianty."
    >
        <Card aria-label="Formularz nowego produktu">
            <div class="grid gap-4 md:grid-cols-2">
                <div class="space-y-1 md:col-span-2">
                    <label
                        for="adminNewProductName"
                        class="text-secondary-600 dark:text-secondary-300 text-sm font-medium"
                    >
                        Nazwa produktu
                    </label>
                    <Input
                        id="adminNewProductName"
                        v-model="name"
                        aria-label="Nazwa produktu"
                        placeholder="np. Koszulka treningowa PRO"
                        @blur="handleNameBlur"
                    />
                </div>

                <div class="space-y-1">
                    <label
                        for="adminNewProductSlug"
                        class="text-secondary-600 dark:text-secondary-300 text-sm font-medium"
                    >
                        Slug
                    </label>
                    <Input
                        id="adminNewProductSlug"
                        v-model="slug"
                        aria-label="Slug produktu"
                        placeholder="np. koszulka-treningowa-pro"
                    />
                </div>

                <div class="space-y-1">
                    <label
                        for="adminNewProductSku"
                        class="text-secondary-600 dark:text-secondary-300 text-sm font-medium"
                    >
                        SKU bazowe
                    </label>
                    <Input
                        id="adminNewProductSku"
                        v-model="sku"
                        aria-label="SKU bazowe produktu"
                        placeholder="np. TSHIRT-PRO"
                    />
                </div>

                <div class="space-y-1">
                    <label
                        for="adminNewProductPrice"
                        class="text-secondary-600 dark:text-secondary-300 text-sm font-medium"
                    >
                        Cena bazowa (PLN)
                    </label>
                    <Input
                        id="adminNewProductPrice"
                        v-model="price"
                        type="number"
                        aria-label="Cena bazowa produktu"
                        placeholder="np. 149.99"
                    />
                </div>

                <div class="space-y-1">
                    <label
                        for="adminNewProductSubcategory"
                        class="text-secondary-600 dark:text-secondary-300 text-sm font-medium"
                    >
                        Subkategoria
                    </label>
                    <Input
                        id="adminNewProductSubcategory"
                        v-model="subcategory"
                        aria-label="Subkategoria produktu"
                        placeholder="np. rashguard-short-sleeve"
                    />
                </div>

                <div class="space-y-1">
                    <label
                        for="adminNewProductCategory"
                        class="text-secondary-600 dark:text-secondary-300 text-sm font-medium"
                    >
                        Kategoria
                    </label>
                    <select
                        id="adminNewProductCategory"
                        v-model="category"
                        aria-label="Kategoria produktu"
                        class="border-secondary-300 dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-50 focus-visible:ring-primary-500 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus-visible:ring-2"
                    >
                        <option
                            v-for="option in categoryOptions"
                            :key="option.value"
                            :value="option.value"
                        >
                            {{ option.label }}
                        </option>
                    </select>
                </div>

                <div class="space-y-1">
                    <label
                        for="adminNewProductMaterial"
                        class="text-secondary-600 dark:text-secondary-300 text-sm font-medium"
                    >
                        Materiał
                    </label>
                    <select
                        id="adminNewProductMaterial"
                        v-model="material"
                        aria-label="Materiał produktu"
                        class="border-secondary-300 dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-50 focus-visible:ring-primary-500 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus-visible:ring-2"
                    >
                        <option
                            v-for="option in materialOptions"
                            :key="option.value"
                            :value="option.value"
                        >
                            {{ option.label }}
                        </option>
                    </select>
                </div>

                <div class="space-y-1">
                    <label
                        for="adminNewProductStatus"
                        class="text-secondary-600 dark:text-secondary-300 text-sm font-medium"
                    >
                        Status
                    </label>
                    <select
                        id="adminNewProductStatus"
                        v-model="status"
                        aria-label="Status produktu"
                        class="border-secondary-300 dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-50 focus-visible:ring-primary-500 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus-visible:ring-2"
                    >
                        <option
                            v-for="option in statusOptions"
                            :key="option.value"
                            :value="option.value"
                        >
                            {{ option.label }}
                        </option>
                    </select>
                </div>

                <div class="space-y-1 md:col-span-2">
                    <label
                        for="adminNewProductDescription"
                        class="text-secondary-600 dark:text-secondary-300 text-sm font-medium"
                    >
                        Opis produktu
                    </label>
                    <textarea
                        id="adminNewProductDescription"
                        v-model="description"
                        aria-label="Opis produktu"
                        rows="4"
                        class="border-secondary-300 dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-50 focus-visible:ring-primary-500 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus-visible:ring-2"
                        placeholder="Krótki opis produktu..."
                    />
                </div>
            </div>
        </Card>

        <Card aria-label="Konfiguracja wariantów rozmiar i kolor">
            <template #header>
                <p
                    class="text-secondary-900 dark:text-secondary-50 font-semibold"
                >
                    Warianty (rozmiar i kolor)
                </p>
            </template>

            <div class="grid gap-4 lg:grid-cols-2">
                <div class="space-y-2">
                    <p
                        class="text-secondary-700 dark:text-secondary-300 text-sm font-medium"
                    >
                        Rozmiary
                    </p>
                    <div class="flex flex-wrap gap-2">
                        <button
                            v-for="sizeValue in sizeOptions"
                            :key="sizeValue"
                            type="button"
                            class="rounded-lg border px-3 py-1.5 text-sm font-medium transition"
                            :class="
                                sizes.includes(sizeValue)
                                    ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-300'
                                    : 'border-secondary-300 text-secondary-700 hover:bg-secondary-100 dark:border-secondary-700 dark:text-secondary-300 dark:hover:bg-secondary-800'
                            "
                            :aria-pressed="sizes.includes(sizeValue)"
                            :aria-label="`Przełącz rozmiar ${sizeValue}`"
                            @click="handleToggleSize(sizeValue)"
                        >
                            {{ sizeValue }}
                        </button>
                    </div>
                </div>

                <div class="space-y-2">
                    <p
                        class="text-secondary-700 dark:text-secondary-300 text-sm font-medium"
                    >
                        Kolory
                    </p>
                    <div class="flex flex-wrap gap-2">
                        <button
                            v-for="colorValue in colorOptions"
                            :key="colorValue"
                            type="button"
                            class="rounded-lg border px-3 py-1.5 text-sm font-medium capitalize transition"
                            :class="
                                colors.includes(colorValue)
                                    ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-300'
                                    : 'border-secondary-300 text-secondary-700 hover:bg-secondary-100 dark:border-secondary-700 dark:text-secondary-300 dark:hover:bg-secondary-800'
                            "
                            :aria-pressed="colors.includes(colorValue)"
                            :aria-label="`Przełącz kolor ${colorValue}`"
                            @click="handleToggleColor(colorValue)"
                        >
                            {{ colorValue }}
                        </button>
                    </div>
                </div>
            </div>

            <div
                class="bg-secondary-50 dark:bg-secondary-800/70 text-secondary-700 dark:text-secondary-200 mt-4 rounded-xl p-3 text-sm"
            >
                Wygenerowanych wariantów:
                <strong>{{ generatedVariantsCount }}</strong>
            </div>
        </Card>

        <Card v-if="formError" aria-label="Błąd formularza tworzenia produktu">
            <p class="text-danger-600 dark:text-danger-300 text-sm">
                {{ formError }}
            </p>
        </Card>

        <div class="flex flex-wrap gap-2">
            <Action
                aria-label="Zapisz nowy produkt"
                :is-loading="isSaving"
                :is-disabled="!canSubmit || isSaving"
                @click="handleSubmit"
            >
                Zapisz produkt
            </Action>
            <NuxtLink
                :to="localePath('/admin/products')"
                class="text-secondary-700 dark:text-secondary-200 border-secondary-300 dark:border-secondary-700 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-xl border px-4 py-2 text-sm font-semibold transition"
                aria-label="Anuluj i wróć do listy produktów"
            >
                Anuluj
            </NuxtLink>
        </div>
    </AdminPanelShell>
</template>
