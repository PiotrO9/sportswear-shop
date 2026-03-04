<script setup lang="ts">
const { t } = useI18n();

usePageMeta({
    title: () => t('navKids'),
});
</script>

<template>
    <div class="py-8">
        <h1 class="text-secondary-900 dark:text-secondary-50 text-2xl font-bold">
            {{ $t('navKids') }}
        </h1>
    </div>
</template>
