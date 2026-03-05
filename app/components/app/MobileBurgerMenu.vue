<script setup lang="ts">
interface NavLink {
    to: string;
    label: string;
    ariaLabel: string;
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
