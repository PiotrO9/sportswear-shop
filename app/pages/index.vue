<script setup lang="ts">
interface HeroCategoryLink {
    to: string;
    label: string;
    ariaLabel: string;
}

interface HomeCategoryCard {
    to: string;
    title: string;
    description: string;
    image: string;
    ariaLabel: string;
}

interface HomeBenefit {
    icon: string;
    title: string;
    description: string;
}

interface HomeStat {
    value: string;
    label: string;
}

const { t, locale } = useI18n();
const localePath = useLocalePath();
const { allProducts } = useCategoriesProducts();

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

const homeCategoryCards = computed<HomeCategoryCard[]>(() => [
    {
        to: localePath('/shop/categories?type=technical-shirt'),
        title: t('homeCategoryCardPerformanceTitle'),
        description: t('homeCategoryCardPerformanceDescription'),
        image: '/images/hero-image.png',
        ariaLabel: t('homeCategoryCardPerformanceAria'),
    },
    {
        to: localePath('/shop/categories?type=rashguard'),
        title: t('homeCategoryCardGymTitle'),
        description: t('homeCategoryCardGymDescription'),
        image: '/images/products/koszulka_1_front.png',
        ariaLabel: t('homeCategoryCardGymAria'),
    },
    {
        to: localePath('/shop/categories?type=shorts'),
        title: t('homeCategoryCardRunTitle'),
        description: t('homeCategoryCardRunDescription'),
        image: '/images/products/koszulka_1_front_biale.webp',
        ariaLabel: t('homeCategoryCardRunAria'),
    },
]);

const homeBenefits = computed<HomeBenefit[]>(() => [
    {
        icon: 'heroicons:sparkles',
        title: t('homeBenefitDesignTitle'),
        description: t('homeBenefitDesignDescription'),
    },
    {
        icon: 'heroicons:bolt',
        title: t('homeBenefitComfortTitle'),
        description: t('homeBenefitComfortDescription'),
    },
    {
        icon: 'heroicons:shield-check',
        title: t('homeBenefitDurabilityTitle'),
        description: t('homeBenefitDurabilityDescription'),
    },
]);

const homeStats = computed<HomeStat[]>(() => [
    {
        value: '4.9/5',
        label: t('homeStatReviews'),
    },
    {
        value: '48h',
        label: t('homeStatShipping'),
    },
    {
        value: '14',
        label: t('homeStatReturnDays'),
    },
]);

const featuredProducts = computed(() => allProducts.slice(0, 3));

function formatPrice(price: number): string {
    const localeCode = locale.value === 'pl' ? 'pl-PL' : 'en-US';

    return new Intl.NumberFormat(localeCode, {
        style: 'currency',
        currency: 'PLN',
        minimumFractionDigits: 2,
    }).format(price);
}
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

                    <ul class="grid gap-3 pt-2 sm:grid-cols-3">
                        <li
                            v-for="stat in homeStats"
                            :key="stat.label"
                            class="bg-secondary-900/55 border-secondary-600/40 rounded-xl border px-4 py-3 backdrop-blur-sm"
                        >
                            <p class="text-secondary-50 text-lg font-semibold">
                                {{ stat.value }}
                            </p>
                            <p class="text-secondary-200 text-xs">
                                {{ stat.label }}
                            </p>
                        </li>
                    </ul>
                </div>

                <div class="hidden lg:block" aria-hidden="true" />
            </div>
        </section>

        <section class="space-y-5" :aria-label="t('homeHeroCategoriesTitle')">
            <div class="flex flex-wrap items-end justify-between gap-3">
                <div class="space-y-2">
                    <p
                        class="text-primary-300 text-xs font-semibold tracking-[0.2em] uppercase"
                    >
                        {{ t('homeShopByGoalEyebrow') }}
                    </p>
                    <h2 class="text-secondary-50 text-2xl font-bold sm:text-3xl">
                        {{ t('homeShopByGoalHeading') }}
                    </h2>
                </div>

                <NuxtLink
                    :to="localePath('/shop/categories')"
                    class="text-primary-300 hover:text-primary-200 focus-visible:ring-primary-400 focus-visible:ring-offset-secondary-950 inline-flex items-center gap-2 rounded-lg px-1 py-1 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    :aria-label="t('navGoToCategories')"
                >
                    {{ t('homeShopByGoalViewAll') }}
                    <Icon
                        name="heroicons:arrow-right"
                        class="size-4"
                        aria-hidden="true"
                    />
                </NuxtLink>
            </div>

            <div class="grid gap-4 md:grid-cols-3">
                <NuxtLink
                    v-for="category in homeCategoryCards"
                    :key="category.to"
                    :to="category.to"
                    class="group border-secondary-800 bg-secondary-900 relative overflow-hidden rounded-2xl border"
                    :aria-label="category.ariaLabel"
                >
                    <img
                        :src="category.image"
                        :alt="category.title"
                        class="h-60 w-full object-cover transition duration-500 group-hover:scale-105"
                        loading="lazy"
                    />
                    <div
                        class="from-secondary-950/85 to-secondary-950/25 absolute inset-0 bg-linear-to-t"
                        aria-hidden="true"
                    />
                    <div class="relative flex min-h-40 flex-col justify-end gap-2 p-5">
                        <h3 class="text-secondary-50 text-xl font-semibold">
                            {{ category.title }}
                        </h3>
                        <p class="text-secondary-200 text-sm leading-relaxed">
                            {{ category.description }}
                        </p>
                        <p
                            class="text-primary-300 group-hover:text-primary-200 inline-flex items-center gap-2 text-sm font-semibold transition"
                        >
                            {{ t('homeShopByGoalCardCta') }}
                            <Icon
                                name="heroicons:arrow-up-right"
                                class="size-4"
                                aria-hidden="true"
                            />
                        </p>
                    </div>
                </NuxtLink>
            </div>

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

        <section
            class="border-secondary-800 bg-secondary-900/40 rounded-3xl border p-6 sm:p-8"
            :aria-label="t('homeBenefitsHeading')"
        >
            <div class="space-y-2">
                <p
                    class="text-primary-300 text-xs font-semibold tracking-[0.2em] uppercase"
                >
                    {{ t('homeBenefitsEyebrow') }}
                </p>
                <h2 class="text-secondary-50 text-2xl font-bold sm:text-3xl">
                    {{ t('homeBenefitsHeading') }}
                </h2>
            </div>

            <div class="mt-6 grid gap-4 md:grid-cols-3">
                <article
                    v-for="benefit in homeBenefits"
                    :key="benefit.title"
                    class="bg-secondary-950/60 border-secondary-800 rounded-2xl border p-5"
                >
                    <div
                        class="bg-primary-500/20 text-primary-300 inline-flex rounded-lg p-2"
                    >
                        <Icon
                            :name="benefit.icon"
                            class="size-5"
                            aria-hidden="true"
                        />
                    </div>
                    <h3 class="text-secondary-50 mt-4 text-lg font-semibold">
                        {{ benefit.title }}
                    </h3>
                    <p class="text-secondary-200 mt-2 text-sm leading-relaxed">
                        {{ benefit.description }}
                    </p>
                </article>
            </div>
        </section>

        <section class="space-y-5" :aria-label="t('homeFeaturedHeading')">
            <div class="flex flex-wrap items-end justify-between gap-3">
                <div class="space-y-2">
                    <p
                        class="text-primary-300 text-xs font-semibold tracking-[0.2em] uppercase"
                    >
                        {{ t('homeFeaturedEyebrow') }}
                    </p>
                    <h2 class="text-secondary-50 text-2xl font-bold sm:text-3xl">
                        {{ t('homeFeaturedHeading') }}
                    </h2>
                </div>
            </div>

            <div class="grid gap-4 md:grid-cols-3">
                <NuxtLink
                    v-for="product in featuredProducts"
                    :key="product.id"
                    :to="localePath(`/shop/product/${product.id}`)"
                    class="group border-secondary-800 bg-secondary-900/50 hover:bg-secondary-900 rounded-2xl border p-4 transition"
                    :aria-label="t('productCardViewAria', { name: product.name })"
                >
                    <div
                        class="bg-secondary-950/60 border-secondary-800 flex aspect-4/5 items-center justify-center overflow-hidden rounded-xl border"
                    >
                        <img
                            :src="product.images?.[0]"
                            :alt="product.name"
                            class="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                            loading="lazy"
                        />
                    </div>
                    <div class="mt-4 space-y-1">
                        <h3 class="text-secondary-50 line-clamp-2 font-semibold">
                            {{ product.name }}
                        </h3>
                        <p class="text-primary-300 text-lg font-semibold">
                            {{ formatPrice(product.price) }}
                        </p>
                    </div>
                </NuxtLink>
            </div>
        </section>

        <section
            class="from-primary-700/20 via-secondary-900 to-secondary-900 border-secondary-800 rounded-3xl border bg-linear-to-r p-7 sm:p-10"
            :aria-label="t('homeBottomCtaHeading')"
        >
            <div class="max-w-2xl space-y-4">
                <h2 class="text-secondary-50 text-2xl font-bold sm:text-3xl">
                    {{ t('homeBottomCtaHeading') }}
                </h2>
                <p class="text-secondary-200 text-sm leading-relaxed sm:text-base">
                    {{ t('homeBottomCtaDescription') }}
                </p>
                <div class="flex flex-wrap gap-3">
                    <NuxtLink
                        :to="localePath('/shop/categories')"
                        class="bg-primary-500 text-secondary-50 hover:bg-primary-400 focus-visible:ring-primary-300 focus-visible:ring-offset-secondary-900 inline-flex rounded-xl px-5 py-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                        :aria-label="t('navGoToCategories')"
                    >
                        {{ t('homeBottomCtaPrimary') }}
                    </NuxtLink>
                    <NuxtLink
                        :to="localePath('/shop/creator')"
                        class="bg-secondary-100/10 text-secondary-50 hover:bg-secondary-100/20 focus-visible:ring-primary-300 focus-visible:ring-offset-secondary-900 border-secondary-300/30 inline-flex rounded-xl border px-5 py-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                        :aria-label="t('navGoToCreator')"
                    >
                        {{ t('homeBottomCtaSecondary') }}
                    </NuxtLink>
                </div>
            </div>
        </section>
    </div>
</template>
