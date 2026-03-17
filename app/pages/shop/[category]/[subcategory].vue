<script setup lang="ts">
const route = useRoute();
const { t } = useI18n();

const categorySlug = computed(() => String(route.params.category ?? ''));
const subcategorySlug = computed(() => String(route.params.subcategory ?? ''));

const initialCategory = computed(() =>
    mapCategorySlugToFilter(categorySlug.value),
);

const initialSubcategory = computed(() => {
    if (!categorySlug.value || !subcategorySlug.value) return null;
    return `${categorySlug.value}-${subcategorySlug.value}`;
});

usePageMeta({
    title: () => t('categoriesTitle'),
    description: () => t('categoriesMetaDescription'),
});
</script>

<template>
    <CategoriesCatalog
        :initial-category="initialCategory"
        :initial-subcategory="initialSubcategory"
    />
</template>
