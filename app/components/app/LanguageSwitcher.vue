<script setup lang="ts">
const { locale, locales, setLocale } = useI18n();

function handleLocaleChange(newLocale: string) {
    if (locale.value === newLocale) return;

    setLocale(newLocale);
}

function handleKeyDown(event: KeyboardEvent, localeCode: string) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleLocaleChange(localeCode);
    }
}
</script>

<template>
    <div
        class="border-secondary-200 bg-secondary-100 dark:border-secondary-700 dark:bg-secondary-800 flex items-center gap-0.5 rounded-lg border p-0.5"
        role="group"
        :aria-label="$t('commonSwitchLanguage')"
    >
        <button
            v-for="loc in locales"
            :key="loc.code"
            type="button"
            :aria-label="`${$t('commonSwitchLanguage')}: ${loc.name}`"
            :aria-pressed="locale === loc.code"
            :tabindex="locale === loc.code ? -1 : 0"
            class="focus-visible:ring-primary-400 flex size-8 min-w-8 cursor-pointer items-center justify-center rounded-md text-center text-lg leading-none transition focus:outline-none focus-visible:ring-2"
            :class="
                locale === loc.code
                    ? 'text-secondary-900 dark:bg-secondary-700 dark:text-secondary-50 bg-white shadow-sm'
                    : 'text-secondary-500 hover:bg-secondary-200/50 dark:text-secondary-400 dark:hover:bg-secondary-700/50'
            "
            @click="handleLocaleChange(loc.code)"
            @keydown="(e) => handleKeyDown(e, loc.code)"
        >
            {{ loc.flag || loc.code }}
        </button>
    </div>
</template>
