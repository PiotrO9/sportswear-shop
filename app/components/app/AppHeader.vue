<script setup lang="ts">
interface NavLink {
    to: string;
    label: string;
    ariaLabel: string;
}

const route = useRoute();
const { t } = useI18n();
const localePath = useLocalePath();

const isBurgerOpen = ref(false);

const navLinks = computed<NavLink[]>(() => [
    {
        to: localePath('/shop/new-arrivals'),
        label: t('navNewArrivals'),
        ariaLabel: t('navGoToNewArrivals'),
    },
    {
        to: localePath('/shop/men'),
        label: t('navMen'),
        ariaLabel: t('navGoToMen'),
    },
    {
        to: localePath('/shop/women'),
        label: t('navWomen'),
        ariaLabel: t('navGoToWomen'),
    },
    {
        to: localePath('/shop/kids'),
        label: t('navKids'),
        ariaLabel: t('navGoToKids'),
    },
    {
        to: localePath('/shop/sport'),
        label: t('navSport'),
        ariaLabel: t('navGoToSport'),
    },
    {
        to: localePath('/design-system'),
        label: t('navDesignSystem'),
        ariaLabel: t('navGoToDesignSystem'),
    },
]);

function linkClass(to: string): string {
    const path = route.path.replace(/\/$/, '');
    const linkPath = to.replace(/\/$/, '');
    const isActive = path === linkPath || path.startsWith(linkPath + '/');

    if (isActive)
        return 'bg-secondary-100 text-secondary-900 dark:bg-secondary-800 dark:text-secondary-50';

    return 'text-secondary-700 hover:bg-secondary-100 hover:text-secondary-900 dark:text-secondary-300 dark:hover:bg-secondary-800 dark:hover:text-secondary-50';
}

function handleToggleBurger() {
    isBurgerOpen.value = !isBurgerOpen.value;
}

function handleCloseBurger() {
    isBurgerOpen.value = false;
}

function handleBurgerKeyDown(event: KeyboardEvent) {
    if (!isEnterOrSpaceKey(event)) return;

    event.preventDefault();
    handleToggleBurger();
}
</script>

<template>
    <header
        class="sticky top-0 z-40 border-b border-secondary-200 bg-white/95 backdrop-blur dark:border-secondary-800 dark:bg-secondary-950/95"
    >
        <div
            class="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-8"
        >
            <div class="flex min-w-0 flex-1 items-center gap-4 lg:flex-initial">
                <NuxtLink
                    :to="localePath('/')"
                    class="text-secondary-900 dark:text-secondary-50 shrink-0 text-xl font-bold transition hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 rounded-lg"
                    :aria-label="t('navGoToHome')"
                >
                    Sportswear Shop
                </NuxtLink>

                <nav
                    class="hidden items-center gap-1 lg:flex"
                    :aria-label="t('navMainNavigation')"
                >
                    <NuxtLink
                        v-for="link in navLinks"
                        :key="link.to"
                        :to="link.to"
                        class="focus-visible:ring-primary-400 dark:focus-visible:ring-offset-secondary-950 rounded-lg px-3 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                        :class="linkClass(link.to)"
                        :aria-label="link.ariaLabel"
                    >
                        {{ link.label }}
                    </NuxtLink>
                </nav>
            </div>

            <div class="flex shrink-0 items-center gap-2 sm:gap-4">
                <LanguageSwitcher />

                <button
                    type="button"
                    class="text-secondary-700 hover:text-secondary-900 dark:text-secondary-300 dark:hover:text-secondary-50 lg:hidden cursor-pointer rounded-lg p-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
                    :aria-label="t('navOpenMenu')"
                    :aria-expanded="isBurgerOpen"
                    tabindex="0"
                    @click="handleToggleBurger"
                    @keydown="handleBurgerKeyDown"
                >
                    <Icon
                        name="heroicons:bars-3"
                        class="size-6"
                        aria-hidden="true"
                    />
                </button>
            </div>
        </div>

        <MobileBurgerMenu :open="isBurgerOpen" @close="handleCloseBurger" />
    </header>
</template>
