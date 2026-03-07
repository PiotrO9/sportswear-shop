<script setup lang="ts">
const { t } = useI18n();

usePageMeta({
    title: () => t('cookiesTitle'),
    description: () => t('cookiesMetaDescription'),
});
</script>

<template>
    <article class="max-w-3xl py-8">
        <h1
            class="text-secondary-900 dark:text-secondary-50 text-2xl font-bold"
        >
            {{ t('footerCompanyCookies') }}
        </h1>
        <p class="text-secondary-600 dark:text-secondary-400 mt-4">
            {{ t('cookiesIntro') }}
        </p>

        <section class="mt-8 space-y-4">
            <h2
                class="text-secondary-900 dark:text-secondary-50 text-xl font-semibold"
            >
                {{ t('cookiesSection1Title') }}
            </h2>
            <p class="text-secondary-600 dark:text-secondary-400">
                {{ t('cookiesSection1P1') }}
            </p>
        </section>

        <section class="mt-8 space-y-4">
            <h2
                class="text-secondary-900 dark:text-secondary-50 text-xl font-semibold"
            >
                {{ t('cookiesSection2Title') }}
            </h2>
            <p class="text-secondary-600 dark:text-secondary-400">
                {{ t('cookiesSection2P1') }}
            </p>
            <p class="text-secondary-600 dark:text-secondary-400">
                {{ t('cookiesSection2P2') }}
            </p>
            <p class="text-secondary-600 dark:text-secondary-400">
                {{ t('cookiesSection2P3') }}
            </p>
            <p class="text-secondary-600 dark:text-secondary-400">
                {{ t('cookiesSection2P4') }}
            </p>
        </section>

        <section class="mt-8 space-y-4">
            <h2
                class="text-secondary-900 dark:text-secondary-50 text-xl font-semibold"
            >
                {{ t('cookiesSection3Title') }}
            </h2>
            <p class="text-secondary-600 dark:text-secondary-400">
                {{ t('cookiesSection3P1') }}
            </p>
            <p class="text-secondary-600 dark:text-secondary-400">
                {{ t('cookiesSection3P2') }}
            </p>
        </section>

        <section class="mt-8 space-y-4">
            <h2
                class="text-secondary-900 dark:text-secondary-50 text-xl font-semibold"
            >
                {{ t('cookiesSection4Title') }}
            </h2>
            <p class="text-secondary-600 dark:text-secondary-400">
                {{ t('cookiesSection4P1') }}
            </p>
        </section>

        <p
            class="text-secondary-500 dark:text-secondary-500 mt-10 text-sm"
        >
            {{ t('cookiesLastUpdate') }}
        </p>
    </article>
</template>
