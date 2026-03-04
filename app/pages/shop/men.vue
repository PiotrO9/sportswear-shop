<script setup lang="ts">
const { t } = useI18n();

usePageMeta({
    title: () => t('navMen'),
});
</script>

<template>
    <div class="py-8">
        <h1 class="text-secondary-900 dark:text-secondary-50 text-2xl font-bold">
            {{ $t('navMen') }}
        </h1>
    </div>
</template>
