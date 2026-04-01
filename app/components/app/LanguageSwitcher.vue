<script setup lang="ts">
type AvailableLocale = 'en' | 'pl';

interface LocaleOption {
    code: AvailableLocale;
    name: string;
    flagSrc: string;
}

const FLAG_IMAGE_BY_LOCALE: Record<AvailableLocale, string> = {
    en: '/images/us.webp',
    pl: '/images/pl.webp',
};

const { locale, locales, setLocale } = useI18n();

const isOpen = ref(false);
const triggerRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);

const localeOptions = computed<LocaleOption[]>(() =>
    locales.value
        .filter((loc) => loc.code in FLAG_IMAGE_BY_LOCALE)
        .map((loc) => ({
            code: loc.code as AvailableLocale,
            name: loc.name ?? loc.code,
            flagSrc: FLAG_IMAGE_BY_LOCALE[loc.code as AvailableLocale],
        })),
);

const currentLocaleOption = computed(
    () =>
        localeOptions.value.find((opt) => opt.code === locale.value) ??
        localeOptions.value[0],
);

const buttonAriaLabel = computed(() => {
    const { t } = useI18n();

    return `${t('commonSwitchLanguage')}: ${currentLocaleOption.value?.name ?? locale}`;
});

function handleToggle() {
    isOpen.value = !isOpen.value;
}

function handleSelectLocale(option: LocaleOption) {
    if (locale.value === option.code) {
        isOpen.value = false;

        return;
    }

    setLocale(option.code);
    isOpen.value = false;
}

function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleToggle();
    }

    if (event.key === 'Escape') {
        isOpen.value = false;
    }
}

function handleItemKeyDown(event: KeyboardEvent, option: LocaleOption) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleSelectLocale(option);
    }
}

function handleClickOutside(event: MouseEvent) {
    const target = event.target as Node;

    if (
        isOpen.value &&
        triggerRef.value &&
        !triggerRef.value.contains(target) &&
        dropdownRef.value &&
        !dropdownRef.value.contains(target)
    ) {
        isOpen.value = false;
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
    <div class="relative">
        <button
            ref="triggerRef"
            type="button"
            :aria-label="buttonAriaLabel"
            :aria-expanded="isOpen"
            :aria-haspopup="true"
            tabindex="0"
            class="focus-visible:ring-primary-400 dark:focus-visible:ring-offset-secondary-950 flex cursor-pointer items-center rounded-sm border-0 bg-transparent p-0 shadow-none transition hover:bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-transparent dark:bg-transparent dark:hover:bg-transparent"
            @click="handleToggle"
            @keydown="handleKeyDown"
        >
            <img
                v-if="currentLocaleOption"
                :src="currentLocaleOption.flagSrc"
                :alt="currentLocaleOption.name"
                class="h-5 w-8 shrink-0 overflow-hidden rounded-sm object-cover"
                width="32"
                height="20"
            />
        </button>

        <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
        >
            <div
                v-if="isOpen"
                ref="dropdownRef"
                role="menu"
                :aria-label="$t('commonSwitchLanguage')"
                class="border-secondary-200 dark:border-secondary-700 dark:bg-secondary-900 absolute top-full right-0 z-50 mt-2 flex min-w-48 flex-col gap-1 rounded-xl border bg-white px-2 py-2 shadow-lg"
            >
                <button
                    v-for="option in localeOptions"
                    :key="option.code"
                    type="button"
                    role="menuitem"
                    :aria-label="option.name"
                    :aria-current="locale === option.code"
                    tabindex="0"
                    class="focus-visible:ring-primary-400 flex w-full cursor-pointer items-center gap-4 rounded-lg px-3 py-2.5 text-left text-sm font-medium tracking-wide uppercase transition focus:outline-none focus-visible:ring-2 focus-visible:ring-inset"
                    :class="
                        locale === option.code
                            ? 'bg-secondary-100 text-secondary-900 dark:bg-secondary-800 dark:text-secondary-50'
                            : 'text-secondary-700 hover:bg-secondary-100 hover:text-secondary-900 dark:text-secondary-300 dark:hover:bg-secondary-800 dark:hover:text-secondary-50'
                    "
                    @click="handleSelectLocale(option)"
                    @keydown="(e) => handleItemKeyDown(e, option)"
                >
                    <img
                        :src="option.flagSrc"
                        :alt="option.name"
                        class="h-5 w-8 shrink-0 overflow-hidden rounded-sm object-cover"
                        width="32"
                        height="20"
                    />
                    <span class="flex-1">{{ option.name }}</span>
                </button>
            </div>
        </Transition>
    </div>
</template>
