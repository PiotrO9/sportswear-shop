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

interface UtilityLink {
    to: string;
    label: string;
    icon: string;
    ariaLabel: string;
}

interface Props {
    open: boolean;
}

interface Emits {
    (e: 'close'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { t } = useI18n();
const localePath = useLocalePath();

const navLinks = computed<NavLink[]>(() => [
    {
        to: localePath('/shop/creator'),
        label: t('footerShopCreator'),
        ariaLabel: t('navGoToCreator'),
    },
]);

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

const utilityLinks = computed<UtilityLink[]>(() => [
    {
        to: localePath('/contact'),
        label: t('footerHelpContact'),
        icon: 'heroicons:question-mark-circle',
        ariaLabel: t('footerHelpContact'),
    },
]);

function handleClose() {
    emit('close');
}

function handleNavClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const link = target.closest('a');

    if (link) handleClose();
}

function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
        event.preventDefault();
        handleClose();
    }
}

function handleOverlayClick() {
    handleClose();
}

function handleOverlayKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleOverlayClick();
    }
}

watch(
    () => props.open,
    (isOpen) => {
        if (typeof document === 'undefined') return;

        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    },
    { immediate: true },
);

onUnmounted(() => {
    if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
    }
});
</script>

<template>
    <Teleport to="body">
        <Transition
            enter-active-class="transition-opacity duration-300 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-opacity duration-200 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div
                v-if="open"
                class="fixed inset-0 z-50"
                role="dialog"
                aria-modal="true"
                :aria-label="t('navMainNavigation')"
                @keydown="handleKeyDown"
            >
                <div
                    class="absolute inset-0 bg-black/30"
                    aria-hidden="true"
                    tabindex="0"
                    @click="handleOverlayClick"
                    @keydown="handleOverlayKeyDown"
                />

                <Transition
                    enter-active-class="transition-transform duration-300 ease-out"
                    enter-from-class="translate-x-full"
                    enter-to-class="translate-x-0"
                    leave-active-class="transition-transform duration-200 ease-in"
                    leave-from-class="translate-x-0"
                    leave-to-class="translate-x-full"
                >
                    <aside
                        v-if="open"
                        class="dark:bg-secondary-900 absolute top-0 right-0 flex h-full w-[min(320px,85vw)] flex-col bg-white shadow-xl"
                    >
                        <div
                            class="border-secondary-200 dark:border-secondary-700 flex items-center justify-end border-b px-4 py-4"
                        >
                            <button
                                type="button"
                                tabindex="0"
                                class="text-secondary-700 hover:bg-secondary-100 focus-visible:ring-primary-400 dark:text-secondary-300 dark:hover:bg-secondary-800 cursor-pointer rounded-lg p-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                                :aria-label="t('navCloseMenu')"
                                @click="handleClose"
                                @keydown="
                                    (e) => isEnterOrSpaceKey(e) && handleClose()
                                "
                            >
                                <Icon
                                    name="heroicons:x-mark"
                                    class="size-6"
                                    aria-hidden="true"
                                />
                            </button>
                        </div>

                        <div
                            class="flex flex-1 flex-col overflow-y-auto px-4 py-6"
                            @click="handleNavClick"
                        >
                            <nav
                                class="flex flex-col gap-1"
                                :aria-label="t('navMainNavigation')"
                            >
                                <NuxtLink
                                    :to="localePath('/shop/categories')"
                                    class="text-secondary-900 dark:text-secondary-50 hover:bg-secondary-100 dark:hover:bg-secondary-800 flex items-center justify-between rounded-lg px-3 py-3 text-base font-medium transition"
                                    :aria-label="t('navGoToProducts')"
                                >
                                    {{ t('navProducts') }}
                                    <Icon
                                        name="heroicons:chevron-right"
                                        class="text-secondary-400 size-5"
                                        aria-hidden="true"
                                    />
                                </NuxtLink>

                                <div class="mt-2 px-3">
                                    <p
                                        class="text-secondary-500 dark:text-secondary-400 text-xs font-semibold tracking-wide uppercase"
                                    >
                                        {{ t('navProductsSectionCategories') }}
                                    </p>
                                </div>

                                <div class="mt-1 flex flex-col gap-1">
                                    <div
                                        v-for="category in productCategories"
                                        :key="category.to"
                                        class="space-y-1"
                                    >
                                        <NuxtLink
                                            :to="category.to"
                                            class="text-secondary-800 dark:text-secondary-100 hover:bg-secondary-100 dark:hover:bg-secondary-800 flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition"
                                            :aria-label="category.ariaLabel"
                                        >
                                            {{ category.title }}
                                            <Icon
                                                name="heroicons:chevron-right"
                                                class="text-secondary-400 size-4"
                                                aria-hidden="true"
                                            />
                                        </NuxtLink>

                                        <ul
                                            v-if="category.variants.length > 0"
                                            class="flex flex-col gap-1 pl-4"
                                        >
                                            <li
                                                v-for="variant in category.variants"
                                                :key="variant.to"
                                            >
                                                <NuxtLink
                                                    :to="variant.to"
                                                    class="text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800 block rounded-lg px-3 py-2 text-sm transition"
                                                    :aria-label="
                                                        variant.ariaLabel
                                                    "
                                                >
                                                    {{ variant.label }}
                                                </NuxtLink>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <NuxtLink
                                    v-for="link in navLinks"
                                    :key="link.to"
                                    :to="link.to"
                                    class="text-secondary-900 dark:text-secondary-50 hover:bg-secondary-100 dark:hover:bg-secondary-800 flex items-center justify-between rounded-lg px-3 py-3 text-base font-medium transition"
                                    :aria-label="link.ariaLabel"
                                >
                                    {{ link.label }}
                                    <Icon
                                        name="heroicons:chevron-right"
                                        class="text-secondary-400 size-5"
                                        size="24"
                                        aria-hidden="true"
                                    />
                                </NuxtLink>
                            </nav>

                            <nav
                                class="border-secondary-200 dark:border-secondary-700 mt-6 flex flex-col gap-2 border-t pt-6"
                                :aria-label="t('footerHelp')"
                            >
                                <NuxtLink
                                    v-for="util in utilityLinks"
                                    :key="util.to"
                                    :to="util.to"
                                    class="text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition"
                                    :aria-label="util.ariaLabel"
                                    @click="handleClose"
                                >
                                    <Icon
                                        :name="util.icon"
                                        class="size-5 shrink-0"
                                        aria-hidden="true"
                                    />
                                    {{ util.label }}
                                </NuxtLink>
                            </nav>
                        </div>
                    </aside>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>
