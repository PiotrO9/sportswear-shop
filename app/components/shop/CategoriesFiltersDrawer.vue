<script setup lang="ts">
interface Props {
    open: boolean;
}

interface Emits {
    (e: 'close'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { t } = useI18n();

function handleClose() {
    emit('close');
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
                class="fixed inset-0 z-50 lg:hidden"
                role="dialog"
                aria-modal="true"
                :aria-label="t('categoriesFilters')"
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
                            class="border-secondary-200 dark:border-secondary-700 flex items-center justify-between border-b px-4 py-4"
                        >
                            <h2
                                class="text-secondary-900 dark:text-secondary-50 text-lg font-semibold"
                            >
                                {{ t('categoriesFilters') }}
                            </h2>
                            <button
                                type="button"
                                tabindex="0"
                                class="text-secondary-700 hover:bg-secondary-100 focus-visible:ring-primary-400 dark:text-secondary-300 dark:hover:bg-secondary-800 cursor-pointer rounded-lg p-3 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                                :aria-label="t('navCloseMenu')"
                                @click="handleClose"
                                @keydown="
                                    (e) => isEnterOrSpaceKey(e) && handleClose()
                                "
                            >
                                <Icon
                                    name="heroicons:x-mark"
                                    class="size-8"
                                    aria-hidden="true"
                                />
                            </button>
                        </div>

                        <div
                            class="flex flex-1 flex-col overflow-y-auto px-4 py-4"
                        >
                            <slot />
                        </div>
                    </aside>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>
