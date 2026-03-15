<script setup lang="ts">
const { t } = useI18n();

usePageMeta({
    title: () => t('categoriesTitle'),
    description: () => t('categoriesMetaDescription'),
});
</script>

<template>
    <CategoriesCatalog />
</template>
