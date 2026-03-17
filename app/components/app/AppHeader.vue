<script setup lang="ts">
interface NavLink {
    to: string;
    label: string;
    ariaLabel: string;
}

interface ProductCategory {
    to: string;
    title: string;
    ariaLabel: string;
    variants: NavLink[];
}

const route = useRoute();
const { t } = useI18n();
const localePath = useLocalePath();

const headerRef = ref<HTMLElement | null>(null);
const isBurgerOpen = ref(false);
const isProductsMenuOpen = ref(false);

const productCategories = computed<ProductCategory[]>(() => [
    {
        to: localePath('/shop/rashguard'),
        title: t('navCategoryRashguard'),
        ariaLabel: t('navGoToCategoryRashguard'),
        variants: [
            {
                to: localePath('/shop/rashguard/short-sleeve'),
                label: t('navRashguardShortSleeveLabel'),
                ariaLabel: t('navGoToRashguardShortSleeve'),
            },
            {
                to: localePath('/shop/rashguard/long-sleeve'),
                label: t('navSleeveLong'),
                ariaLabel: t('navGoToRashguardLongSleeve'),
            },
        ],
    },
    {
        to: localePath('/shop/technical-shirt'),
        title: t('navCategoryTechnicalShirt'),
        ariaLabel: t('navGoToCategoryTechnicalShirt'),
        variants: [
            {
                to: localePath('/shop/technical-shirt/short-sleeve'),
                label: t('navSleeveShort'),
                ariaLabel: t('navGoToTechnicalShirtShortSleeve'),
            },
            {
                to: localePath('/shop/technical-shirt/long-sleeve'),
                label: t('navSleeveLong'),
                ariaLabel: t('navGoToTechnicalShirtLongSleeve'),
            },
        ],
    },
    {
        to: localePath('/shop/shorts'),
        title: t('navCategoryShorts'),
        ariaLabel: t('navGoToCategoryShorts'),
        variants: [],
    },
    {
        to: localePath('/shop/jerseys'),
        title: t('navCategoryJersey'),
        ariaLabel: t('navGoToCategoryJersey'),
        variants: [],
    },
    {
        to: localePath('/shop/hoodies'),
        title: t('navCategoryHoodie'),
        ariaLabel: t('navGoToCategoryHoodie'),
        variants: [],
    },
]);

const navLinks = computed<NavLink[]>(() => [
    {
        to: localePath('/shop/creator'),
        label: t('footerShopCreator'),
        ariaLabel: t('navGoToCreator'),
    },
]);

function linkClass(to: string): string {
    const path = route.path.replace(/\/$/, '');
    const linkPath = to.replace(/\/$/, '');
    const isActive = path === linkPath || path.startsWith(`${linkPath}/`);

    if (isActive)
        return 'bg-secondary-100 text-secondary-900 dark:bg-secondary-800 dark:text-secondary-50';

    return 'text-secondary-700 hover:bg-secondary-100 hover:text-secondary-900 dark:text-secondary-300 dark:hover:bg-secondary-800 dark:hover:text-secondary-50';
}

function productsButtonClass(): string {
    const path = route.path.replace(/\/$/, '');
    const isActive =
        path.startsWith('/shop') && !path.startsWith('/shop/creator');

    if (isActive || isProductsMenuOpen.value) {
        return 'bg-secondary-100 text-secondary-900 dark:bg-secondary-800 dark:text-secondary-50';
    }

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

function handleOpenProductsMenu() {
    isProductsMenuOpen.value = true;
}

function handleCloseProductsMenu() {
    isProductsMenuOpen.value = false;
}

function handleProductsMenuButtonClick() {
    isProductsMenuOpen.value = !isProductsMenuOpen.value;
}

function handleProductsTriggerHover() {
    handleOpenProductsMenu();
}

function handleHeaderMouseLeave() {
    handleCloseProductsMenu();
}

function handleNavLinkHover() {
    handleCloseProductsMenu();
}

function handleProductsMenuButtonKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
        event.preventDefault();
        handleOpenProductsMenu();

        return;
    }

    if (event.key === 'Escape') {
        event.preventDefault();
        handleCloseProductsMenu();

        return;
    }

    if (!isEnterOrSpaceKey(event)) return;

    event.preventDefault();
    handleProductsMenuButtonClick();
}

function handleProductsMegaMenuKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Escape') return;

    event.preventDefault();
    handleCloseProductsMenu();
}

function handleHeaderFocusOut(event: FocusEvent) {
    const nextTarget = event.relatedTarget as HTMLElement | null;
    const currentTarget = headerRef.value;

    if (!currentTarget) return;

    if (!nextTarget) {
        handleCloseProductsMenu();

        return;
    }

    if (currentTarget.contains(nextTarget)) return;

    handleCloseProductsMenu();
}

function handleProductsMenuLinkClick() {
    handleCloseProductsMenu();
}

watch(
    () => route.path,
    () => {
        handleCloseProductsMenu();
    },
);
</script>

<template>
    <header
        ref="headerRef"
        class="border-secondary-200 dark:border-secondary-800 dark:bg-secondary-950/95 sticky top-0 z-40 border-b bg-white/95 backdrop-blur lg:relative"
        @mouseleave="handleHeaderMouseLeave"
        @focusout="handleHeaderFocusOut"
    >
        <div
            class="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-8"
        >
            <div class="flex min-w-0 flex-1 items-center gap-4 lg:flex-initial">
                <NuxtLink
                    :to="localePath('/')"
                    class="text-secondary-900 dark:text-secondary-50 hover:text-primary-600 dark:hover:text-primary-400 focus-visible:ring-primary-400 shrink-0 rounded-lg text-xl font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    :aria-label="t('navGoToHome')"
                >
                    Sportswear Shop
                </NuxtLink>

                <nav
                    class="hidden items-center gap-1 lg:flex"
                    :aria-label="t('navMainNavigation')"
                >
                    <button
                        type="button"
                        tabindex="0"
                        class="focus-visible:ring-primary-400 dark:focus-visible:ring-offset-secondary-950 inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                        :class="productsButtonClass()"
                        :aria-label="t('navProducts')"
                        aria-haspopup="true"
                        :aria-expanded="isProductsMenuOpen"
                        aria-controls="products-mega-menu"
                        @mouseenter="handleProductsTriggerHover"
                        @click="handleProductsMenuButtonClick"
                        @keydown="handleProductsMenuButtonKeyDown"
                        @focus="handleOpenProductsMenu"
                    >
                        {{ t('navProducts') }}
                    </button>

                    <NuxtLink
                        v-for="link in navLinks"
                        :key="link.to"
                        :to="link.to"
                        class="focus-visible:ring-primary-400 dark:focus-visible:ring-offset-secondary-950 rounded-lg px-3 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                        :class="linkClass(link.to)"
                        :aria-label="link.ariaLabel"
                        @mouseenter="handleNavLinkHover"
                    >
                        {{ link.label }}
                    </NuxtLink>
                </nav>
            </div>

            <div class="flex shrink-0 items-center gap-2 sm:gap-4">
                <LanguageSwitcher />

                <button
                    type="button"
                    class="text-secondary-700 hover:text-secondary-900 dark:text-secondary-300 dark:hover:text-secondary-50 focus-visible:ring-primary-400 flex cursor-pointer items-center justify-center rounded-lg p-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 lg:hidden"
                    :aria-label="t('navOpenMenu')"
                    :aria-expanded="isBurgerOpen"
                    tabindex="0"
                    @click="handleToggleBurger"
                    @keydown="handleBurgerKeyDown"
                >
                    <Icon
                        name="heroicons:bars-3"
                        class="size-6"
                        size="24"
                        aria-hidden="true"
                    />
                </button>
            </div>
        </div>

        <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="translate-y-2 opacity-0"
            enter-to-class="translate-y-0 opacity-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="translate-y-0 opacity-100"
            leave-to-class="translate-y-2 opacity-0"
        >
            <section
                v-if="isProductsMenuOpen"
                id="products-mega-menu"
                class="border-secondary-200 dark:border-secondary-800 dark:bg-secondary-950 absolute top-full right-0 left-0 z-50 hidden border-b bg-white lg:block"
                :aria-label="t('navProducts')"
                @keydown="handleProductsMegaMenuKeyDown"
            >
                <div class="mx-auto w-full max-w-7xl px-6 py-6 lg:px-8">
                    <div class="flex flex-wrap items-start gap-8">
                        <section
                            v-for="category in productCategories"
                            :key="category.title"
                            class="min-w-[200px] space-y-2"
                            :aria-label="category.ariaLabel"
                        >
                            <NuxtLink
                                :to="category.to"
                                class="text-secondary-900 dark:text-secondary-50 hover:text-primary-600 dark:hover:text-primary-400 focus-visible:ring-primary-400 dark:focus-visible:ring-offset-secondary-950 inline-block rounded-lg px-2 py-1 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                                :aria-label="category.ariaLabel"
                                @click="handleProductsMenuLinkClick"
                            >
                                {{ category.title }}
                            </NuxtLink>

                            <ul
                                v-if="category.variants.length > 0"
                                class="mt-3 space-y-2"
                            >
                                <li
                                    v-for="variant in category.variants"
                                    :key="variant.to"
                                >
                                    <NuxtLink
                                        :to="variant.to"
                                        class="text-secondary-700 hover:bg-secondary-100 hover:text-secondary-900 dark:text-secondary-300 dark:hover:bg-secondary-800 dark:hover:text-secondary-50 focus-visible:ring-primary-400 dark:focus-visible:ring-offset-secondary-950 block rounded-lg px-3 py-2 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                                        :aria-label="variant.ariaLabel"
                                        @click="handleProductsMenuLinkClick"
                                    >
                                        {{ variant.label }}
                                    </NuxtLink>
                                </li>
                            </ul>
                        </section>
                    </div>
                </div>
            </section>
        </Transition>

        <MobileBurgerMenu :open="isBurgerOpen" @close="handleCloseBurger" />
    </header>
</template>
