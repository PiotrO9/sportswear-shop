<script setup lang="ts">
const { t } = useI18n();

usePageMeta({
    title: () => t('aboutTitle'),
    description: () => t('aboutMetaDescription'),
});
</script>

<template>
    <div class="py-8">
        <h1
            class="text-secondary-900 dark:text-secondary-50 text-2xl font-bold"
        >
            {{ t('footerCompanyAbout') }}
        </h1>
    </div>
</template>
