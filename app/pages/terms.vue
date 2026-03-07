<script setup lang="ts">
const { t } = useI18n();

usePageMeta({
    title: () => t('termsTitle'),
    description: () => t('termsMetaDescription'),
});
</script>

<template>
    <article class="max-w-3xl py-8">
        <h1
            class="text-secondary-900 dark:text-secondary-50 text-2xl font-bold"
        >
            {{ t('footerCompanyTerms') }}
        </h1>
        <p class="text-secondary-600 dark:text-secondary-400 mt-4">
            {{ t('termsIntro') }}
        </p>

        <section class="mt-8 space-y-4">
            <h2
                class="text-secondary-900 dark:text-secondary-50 text-xl font-semibold"
            >
                {{ t('termsSection1Title') }}
            </h2>
            <p class="text-secondary-600 dark:text-secondary-400">
                {{ t('termsSection1P1') }}
            </p>
            <p class="text-secondary-600 dark:text-secondary-400">
                {{ t('termsSection1P2') }}
            </p>
        </section>

        <section class="mt-8 space-y-4">
            <h2
                class="text-secondary-900 dark:text-secondary-50 text-xl font-semibold"
            >
                {{ t('termsSection2Title') }}
            </h2>
            <p class="text-secondary-600 dark:text-secondary-400">
                {{ t('termsSection2P1') }}
            </p>
            <p class="text-secondary-600 dark:text-secondary-400">
                {{ t('termsSection2P2') }}
            </p>
        </section>

        <section class="mt-8 space-y-4">
            <h2
                class="text-secondary-900 dark:text-secondary-50 text-xl font-semibold"
            >
                {{ t('termsSection3Title') }}
            </h2>
            <p class="text-secondary-600 dark:text-secondary-400">
                {{ t('termsSection3P1') }}
            </p>
            <p class="text-secondary-600 dark:text-secondary-400">
                {{ t('termsSection3P2') }}
            </p>
        </section>

        <section class="mt-8 space-y-4">
            <h2
                class="text-secondary-900 dark:text-secondary-50 text-xl font-semibold"
            >
                {{ t('termsSection4Title') }}
            </h2>
            <p class="text-secondary-600 dark:text-secondary-400">
                {{ t('termsSection4P1') }}
            </p>
            <p class="text-secondary-600 dark:text-secondary-400">
                {{ t('termsSection4P2') }}
            </p>
        </section>

        <section class="mt-8 space-y-4">
            <h2
                class="text-secondary-900 dark:text-secondary-50 text-xl font-semibold"
            >
                {{ t('termsSection5Title') }}
            </h2>
            <p class="text-secondary-600 dark:text-secondary-400">
                {{ t('termsSection5P1') }}
            </p>
            <p class="text-secondary-600 dark:text-secondary-400">
                {{ t('termsSection5P2') }}
            </p>
        </section>

        <section class="mt-8 space-y-4">
            <h2
                class="text-secondary-900 dark:text-secondary-50 text-xl font-semibold"
            >
                {{ t('termsSection6Title') }}
            </h2>
            <p class="text-secondary-600 dark:text-secondary-400">
                {{ t('termsSection6P1') }}
            </p>
        </section>

        <p class="text-secondary-500 dark:text-secondary-500 mt-10 text-sm">
            {{ t('termsLastUpdate') }}
        </p>
    </article>
</template>
