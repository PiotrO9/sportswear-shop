<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();

usePageMeta({
    title: () => t('homeTitle'),
    titleOnly: true,
    description: () => t('homeMetaDescription'),
});
</script>

<template>
    <div class="space-y-12">
        <section
            class="border-secondary-800 from-secondary-950 to-secondary-900 relative overflow-hidden rounded-3xl border bg-linear-to-br"
            :aria-label="t('homeHeroHeading')"
        >
            <img
                src="/images/hero-image.png"
                :alt="t('homeHeroImageAlt')"
                class="absolute inset-0 h-full w-full object-cover object-right lg:object-contain"
                loading="eager"
            />

            <div
                class="from-secondary-950/95 via-secondary-950/75 to-secondary-950/35 absolute inset-0 bg-linear-to-r"
                aria-hidden="true"
            />

            <div
                class="relative grid min-h-[460px] items-center gap-8 p-8 lg:grid-cols-2 lg:p-12"
            >
                <div class="space-y-6">
                    <p
                        class="text-primary-200 text-sm font-semibold tracking-wide uppercase"
                    >
                        {{ t('homeHeroEyebrow') }}
                    </p>

                    <h1
                        class="text-secondary-50 max-w-xl text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl"
                    >
                        {{ t('homeHeroHeading') }}
                    </h1>

                    <p
                        class="text-secondary-200 max-w-xl text-base leading-relaxed sm:text-lg"
                    >
                        {{ t('homeHeroDescription') }}
                    </p>

                    <div class="flex flex-wrap items-center gap-3">
                        <NuxtLink
                            :to="localePath('/shop/categories')"
                            class="bg-primary-500 text-secondary-50 hover:bg-primary-400 focus-visible:ring-primary-400 focus-visible:ring-offset-secondary-950 inline-flex rounded-xl px-5 py-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                            :aria-label="t('navGoToCategories')"
                        >
                            {{ t('homeHeroPrimaryCta') }}
                        </NuxtLink>

                        <NuxtLink
                            :to="localePath('/shop/creator')"
                            class="bg-secondary-100/10 text-secondary-50 hover:bg-secondary-100/20 focus-visible:ring-primary-400 focus-visible:ring-offset-secondary-950 border-secondary-300/30 inline-flex rounded-xl border px-5 py-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                            :aria-label="t('navGoToCreator')"
                        >
                            {{ t('homeHeroSecondaryCta') }}
                        </NuxtLink>
                    </div>
                </div>

                <div class="hidden lg:block" aria-hidden="true" />
            </div>
        </section>
    </div>
</template>
