<script setup lang="ts">
const route = useRoute();
const { t } = useI18n();

const categorySlug = computed(() => String(route.params.category ?? ''));
const initialCategory = computed(() =>
    mapCategorySlugToFilter(categorySlug.value),
);

usePageMeta({
    title: () => t('categoriesTitle'),
    description: () => t('categoriesMetaDescription'),
});
</script>

<template>
    <CategoriesCatalog :initial-category="initialCategory" />
</template>
