<script setup lang="ts">
type AvailableLocale = 'en' | 'pl';

interface LocaleOption {
    code: AvailableLocale;
    name: string;
    flagSrc: string;
}

interface Props {
    /** `dropdown` — przycisk z flagą i lista; `switch` — przełącznik EN/PL (np. mobile). */
    layout?: 'dropdown' | 'switch';
}

const props = withDefaults(defineProps<Props>(), {
    layout: 'dropdown',
});

const FLAG_IMAGE_BY_LOCALE: Record<AvailableLocale, string> = {
    en: '/images/us.webp',
    pl: '/images/pl.webp',
};

const i18n = useI18n();

/** Kod języka – jawny computed, żeby szablon zawsze reagował na `setLocale`. */
const activeLocaleCode = computed(() => i18n.locale.value as AvailableLocale);

const isOpen = ref(false);
const triggerRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);

const localeOptions = computed<LocaleOption[]>(() =>
    i18n.locales.value
        .filter((loc) => loc.code in FLAG_IMAGE_BY_LOCALE)
        .map((loc) => ({
            code: loc.code as AvailableLocale,
            name: loc.name ?? loc.code,
            flagSrc: FLAG_IMAGE_BY_LOCALE[loc.code as AvailableLocale],
        })),
);

const currentLocaleOption = computed(
    () =>
        localeOptions.value.find(
            (opt) => opt.code === activeLocaleCode.value,
        ) ?? localeOptions.value[0],
);

const buttonAriaLabel = computed(() => {
    const { t } = useI18n();

    return `${t('commonSwitchLanguage')}: ${currentLocaleOption.value?.name ?? activeLocaleCode.value}`;
});

function handleToggle() {
    isOpen.value = !isOpen.value;
}

async function handleSelectLocale(option: LocaleOption) {
    if (activeLocaleCode.value === option.code) {
        isOpen.value = false;

        return;
    }

    await i18n.setLocale(option.code);
    isOpen.value = false;
}

async function handleSwitchLocaleChange(checked: boolean) {
    const nextLocale: AvailableLocale = checked ? 'pl' : 'en';

    if (activeLocaleCode.value === nextLocale) return;

    await i18n.setLocale(nextLocale);
}

function handleLocaleSwitchClick() {
    void handleSwitchLocaleChange(activeLocaleCode.value !== 'pl');
}

function handleLocaleSwitchKeyDown(event: KeyboardEvent) {
    if (!isEnterOrSpaceKey(event)) return;

    event.preventDefault();
    handleLocaleSwitchClick();
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
            v-if="props.layout === 'switch'"
            type="button"
            role="switch"
            :aria-checked="activeLocaleCode === 'pl'"
            :aria-label="buttonAriaLabel"
            tabindex="0"
            class="bg-secondary-200 focus-visible:ring-primary-400 dark:bg-secondary-700 dark:focus-visible:ring-offset-secondary-950 border-secondary-500/40 dark:border-secondary-600/50 relative inline-flex h-8 w-[4.75rem] shrink-0 cursor-pointer overflow-hidden rounded-full border p-0.5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            @click="handleLocaleSwitchClick"
            @keydown="handleLocaleSwitchKeyDown"
        >
            <span
                class="pointer-events-none absolute top-1/2 left-0.5 z-0 h-[calc(100%-4px)] w-[calc(50%-2px)] -translate-y-1/2 rounded-full bg-white shadow-md ring-1 ring-black/10 transition-transform duration-300 ease-out dark:ring-white/10"
                :class="
                    activeLocaleCode === 'pl'
                        ? 'translate-x-[calc(100%+4px)]'
                        : 'translate-x-0'
                "
                aria-hidden="true"
            />

            <span
                class="relative z-10 flex h-full w-full flex-1 items-center justify-center"
            >
                <span
                    class="flex flex-1 items-center justify-center py-0.5"
                    aria-hidden="true"
                >
                    <img
                        :src="FLAG_IMAGE_BY_LOCALE.en"
                        alt=""
                        width="32"
                        height="20"
                        class="h-4 w-6 shrink-0 rounded-sm object-cover"
                        :class="
                            activeLocaleCode === 'en'
                                ? 'opacity-100'
                                : 'opacity-40'
                        "
                    />
                </span>
                <span
                    class="flex flex-1 items-center justify-center py-0.5"
                    aria-hidden="true"
                >
                    <img
                        :src="FLAG_IMAGE_BY_LOCALE.pl"
                        alt=""
                        width="32"
                        height="20"
                        class="h-4 w-6 shrink-0 rounded-sm object-cover"
                        :class="
                            activeLocaleCode === 'pl'
                                ? 'opacity-100'
                                : 'opacity-40'
                        "
                    />
                </span>
            </span>
        </button>

        <template v-else>
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
        </template>

        <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
        >
            <div
                v-if="isOpen && props.layout === 'dropdown'"
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
                    :aria-current="activeLocaleCode === option.code"
                    tabindex="0"
                    class="focus-visible:ring-primary-400 flex w-full cursor-pointer items-center gap-4 rounded-lg px-3 py-2.5 text-left text-sm font-medium tracking-wide uppercase transition focus:outline-none focus-visible:ring-2 focus-visible:ring-inset"
                    :class="
                        activeLocaleCode === option.code
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
