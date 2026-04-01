<script setup lang="ts">
import type { NuxtError } from '#app';

const error = useError() as Ref<NuxtError | null>;
const { t } = useI18n();
const localePath = useLocalePath();

const is404 = computed(() => error.value?.statusCode === 404);
const statusCode = computed(() => error.value?.statusCode ?? 500);

const title = computed(() => {
    const activeStatusCode = error.value?.statusCode;

    if (activeStatusCode === 404) return t('errorPageNotFound');

    if (activeStatusCode)
        return t('errorTitle', { statusCode: activeStatusCode });

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
        class="bg-secondary-100 dark:bg-secondary-900 flex min-h-dvh items-center justify-center px-6 py-16"
    >
        <div class="w-full max-w-xl text-center">
            <p
                class="text-secondary-700 dark:text-secondary-200 text-[clamp(5rem,20vw,10rem)] leading-none font-extrabold tracking-tight"
                aria-hidden="true"
            >
                {{ statusCode }}
            </p>
            <h1
                class="text-secondary-800 dark:text-secondary-50 mt-5 text-3xl font-semibold sm:text-4xl"
            >
                {{ title }}
            </h1>
            <p
                class="text-secondary-600 dark:text-secondary-300 mt-3 text-base"
            >
                {{
                    is404
                        ? t('error404Description')
                        : t('errorDefaultDescription')
                }}
            </p>
            <div class="mt-8 flex items-center justify-center gap-3">
                <NuxtLink
                    :to="localePath('/')"
                    class="bg-primary-500 hover:bg-primary-400 focus-visible:ring-primary-300 focus-visible:ring-offset-secondary-100 dark:focus-visible:ring-offset-secondary-900 inline-flex items-center rounded-lg px-6 py-3 text-sm font-semibold text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    :aria-label="t('errorGoHomeAria')"
                    @click.prevent="handleGoHome"
                >
                    {{ t('commonHome') }}
                </NuxtLink>
                <button
                    v-if="!is404"
                    type="button"
                    class="bg-secondary-200 text-secondary-800 hover:bg-secondary-300 focus-visible:ring-primary-300 focus-visible:ring-offset-secondary-100 dark:bg-secondary-800 dark:text-secondary-100 dark:hover:bg-secondary-700 dark:focus-visible:ring-offset-secondary-900 inline-flex items-center rounded-lg px-6 py-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    :aria-label="t('errorTryAgainAria')"
                    @click="handleTryAgain"
                >
                    {{ t('errorTryAgain') }}
                </button>
            </div>
        </div>
    </div>
</template>
