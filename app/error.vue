<script setup lang="ts">
import type { NuxtError } from '#app';

const error = useError() as Ref<NuxtError | null>;
const { t } = useI18n();
const localePath = useLocalePath();

const is404 = computed(() => error.value?.statusCode === 404);

const title = computed(() => {
    const statusCode = error.value?.statusCode;

    if (statusCode === 404) return t('errorPageNotFound');

    if (statusCode) return t('errorTitle', { statusCode });

    return t('errorSomethingWentWrong');
});

function handleGoHome() {
    clearError({ redirect: '/' });
}

function handleTryAgain() {
    clearError();
}
</script>

<template>
    <div
        class="from-secondary-50 to-primary-50/30 dark:from-secondary-950 dark:via-secondary-950 dark:to-primary-950/20 relative min-h-dvh overflow-hidden bg-linear-to-br via-white"
    >
        <div
            class="pointer-events-none absolute inset-0 overflow-hidden"
            aria-hidden="true"
        >
            <div
                class="bg-primary-200/40 dark:bg-primary-900/20 absolute -top-1/4 -left-1/4 h-96 w-96 rounded-full blur-3xl"
            />
            <div
                class="bg-primary-300/30 dark:bg-primary-800/15 absolute -right-1/4 -bottom-1/4 h-96 w-96 rounded-full blur-3xl"
            />
            <div
                class="bg-secondary-200/20 dark:bg-secondary-800/30 absolute top-1/3 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full blur-2xl"
            />
        </div>

        <div
            class="relative mx-auto flex min-h-dvh w-full max-w-2xl flex-col items-center justify-center gap-8 px-6 py-16"
        >
            <!-- Duży numer błędu -->
            <div class="relative">
                <span
                    class="text-primary-500/20 dark:text-primary-400/15 block text-[clamp(8rem,25vw,14rem)] leading-none font-extrabold tracking-tighter"
                    aria-hidden="true"
                >
                    {{ error?.statusCode ?? '?' }}
                </span>
            </div>

            <div class="flex flex-col items-center gap-4 text-center">
                <h1
                    class="text-secondary-900 dark:text-secondary-50 text-2xl font-bold tracking-tight sm:text-3xl"
                >
                    {{ title }}
                </h1>
            </div>

            <div class="flex flex-wrap items-center justify-center gap-3">
                <NuxtLink
                    :to="localePath('/')"
                    class="bg-primary-500 hover:bg-primary-600 focus-visible:ring-primary-400 dark:bg-primary-600 dark:hover:bg-primary-500 dark:focus-visible:ring-offset-secondary-950 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    :aria-label="t('errorGoHomeAria')"
                    @click.prevent="handleGoHome"
                >
                    <Icon name="heroicons:home" class="size-5" />
                    {{ t('commonHome') }}
                </NuxtLink>
                <button
                    v-if="!is404"
                    type="button"
                    class="bg-secondary-100 text-secondary-900 hover:bg-secondary-200 focus-visible:ring-primary-400 dark:bg-secondary-800 dark:text-secondary-50 dark:hover:bg-secondary-700 dark:focus-visible:ring-offset-secondary-950 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    :aria-label="t('errorTryAgainAria')"
                    @click="handleTryAgain"
                >
                    <Icon name="heroicons:arrow-path" class="size-5" />
                    {{ t('errorTryAgain') }}
                </button>
            </div>
        </div>
    </div>
</template>
