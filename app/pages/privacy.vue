<script setup lang="ts">
const { t } = useI18n();

usePageMeta({
    title: () => t('privacyTitle'),
    description: () => t('privacyMetaDescription'),
});
</script>

<template>
    <article class="max-w-3xl py-8">
        <h1
            class="text-secondary-900 dark:text-secondary-50 text-2xl font-bold"
        >
            {{ t('footerCompanyPrivacy') }}
        </h1>
        <p class="text-secondary-600 dark:text-secondary-400 mt-4">
            {{ t('privacyIntro') }}
        </p>

        <section class="mt-8 space-y-4">
            <h2
                class="text-secondary-900 dark:text-secondary-50 text-xl font-semibold"
            >
                {{ t('privacySection1Title') }}
            </h2>
            <p class="text-secondary-600 dark:text-secondary-400">
                {{ t('privacySection1P1') }}
            </p>
        </section>

        <section class="mt-8 space-y-4">
            <h2
                class="text-secondary-900 dark:text-secondary-50 text-xl font-semibold"
            >
                {{ t('privacySection2Title') }}
            </h2>
            <p class="text-secondary-600 dark:text-secondary-400">
                {{ t('privacySection2P1') }}
            </p>
            <p class="text-secondary-600 dark:text-secondary-400">
                {{ t('privacySection2P2') }}
            </p>
        </section>

        <section class="mt-8 space-y-4">
            <h2
                class="text-secondary-900 dark:text-secondary-50 text-xl font-semibold"
            >
                {{ t('privacySection3Title') }}
            </h2>
            <p class="text-secondary-600 dark:text-secondary-400">
                {{ t('privacySection3P1') }}
            </p>
            <p class="text-secondary-600 dark:text-secondary-400">
                {{ t('privacySection3P2') }}
            </p>
        </section>

        <section class="mt-8 space-y-4">
            <h2
                class="text-secondary-900 dark:text-secondary-50 text-xl font-semibold"
            >
                {{ t('privacySection4Title') }}
            </h2>
            <p class="text-secondary-600 dark:text-secondary-400">
                {{ t('privacySection4P1') }}
            </p>
            <p class="text-secondary-600 dark:text-secondary-400">
                {{ t('privacySection4P2') }}
            </p>
        </section>

        <section class="mt-8 space-y-4">
            <h2
                class="text-secondary-900 dark:text-secondary-50 text-xl font-semibold"
            >
                {{ t('privacySection5Title') }}
            </h2>
            <p class="text-secondary-600 dark:text-secondary-400">
                {{ t('privacySection5P1') }}
            </p>
            <p class="text-secondary-600 dark:text-secondary-400">
                {{ t('privacySection5P2') }}
            </p>
        </section>

        <section class="mt-8 space-y-4">
            <h2
                class="text-secondary-900 dark:text-secondary-50 text-xl font-semibold"
            >
                {{ t('privacySection6Title') }}
            </h2>
            <p class="text-secondary-600 dark:text-secondary-400">
                {{ t('privacySection6P1') }}
            </p>
        </section>

        <p class="text-secondary-500 dark:text-secondary-500 mt-10 text-sm">
            {{ t('privacyLastUpdate') }}
        </p>
    </article>
</template>
