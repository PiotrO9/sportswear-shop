<script setup lang="ts">
interface HeroCategoryLink {
    to: string;
    label: string;
    ariaLabel: string;
}

const { t } = useI18n();
const localePath = useLocalePath();

usePageMeta({
    title: () => t('homeTitle'),
    description: () => t('homeMetaDescription'),
});

const heroCategoryLinks = computed<HeroCategoryLink[]>(() => [
    {
        to: localePath('/shop/categories?type=rashguard'),
        label: t('navCategoryRashguard'),
        ariaLabel: t('navGoToCategoryRashguard'),
    },
    {
        to: localePath('/shop/categories?type=technical-shirt'),
        label: t('navCategoryTechnicalShirt'),
        ariaLabel: t('navGoToCategoryTechnicalShirt'),
    },
    {
        to: localePath('/shop/categories?type=shorts'),
        label: t('navCategoryShorts'),
        ariaLabel: t('navGoToCategoryShorts'),
    },
    {
        to: localePath('/shop/categories?type=hoodie'),
        label: t('navCategoryHoodie'),
        ariaLabel: t('navGoToCategoryHoodie'),
    },
]);
</script>

<template>
    <div class="space-y-8">
        <section
            class="border-secondary-800 relative overflow-hidden rounded-3xl border"
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

        <section class="space-y-3" :aria-label="t('homeHeroCategoriesTitle')">
            <h2
                class="text-secondary-100 text-sm font-semibold tracking-wide uppercase"
            >
                {{ t('homeHeroCategoriesTitle') }}
            </h2>

            <div class="flex flex-wrap gap-2">
                <NuxtLink
                    v-for="category in heroCategoryLinks"
                    :key="category.to"
                    :to="category.to"
                    class="bg-secondary-900 text-secondary-200 hover:bg-secondary-800 hover:text-secondary-50 focus-visible:ring-primary-400 focus-visible:ring-offset-secondary-950 rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    :aria-label="category.ariaLabel"
                >
                    {{ category.label }}
                </NuxtLink>
            </div>
        </section>
    </div>
</template>
