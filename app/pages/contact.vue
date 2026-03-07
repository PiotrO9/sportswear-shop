<script setup lang="ts">
const { t } = useI18n();

usePageMeta({
    title: () => t('contactTitle'),
    description: () => t('contactMetaDescription'),
});

const contactItems = [
    {
        labelKey: 'contactEmailLabel',
        valueKey: 'contactEmail',
        icon: 'heroicons:envelope',
    },
    {
        labelKey: 'contactPhoneLabel',
        valueKey: 'contactPhone',
        icon: 'heroicons:phone',
    },
    {
        labelKey: 'contactAddressLabel',
        valueKey: 'contactAddress',
        icon: 'heroicons:map-pin',
    },
    {
        labelKey: 'contactHoursLabel',
        valueKey: 'contactHours',
        icon: 'heroicons:clock',
    },
    {
        labelKey: 'contactResponseLabel',
        valueKey: 'contactResponse',
        icon: 'heroicons:chat-bubble-left-right',
    },
];
</script>

<template>
    <div class="max-w-3xl py-8">
        <h1
            class="text-secondary-900 dark:text-secondary-50 text-2xl font-bold"
        >
            {{ t('footerHelpContact') }}
        </h1>
        <p class="text-secondary-600 dark:text-secondary-400 mt-4">
            {{ t('contactIntro') }}
        </p>

        <div class="mt-8 space-y-6">
            <div
                v-for="item in contactItems"
                :key="item.valueKey"
                class="border-secondary-200 dark:border-secondary-800 flex gap-4 rounded-lg border p-4"
            >
                <div
                    class="bg-primary-100 dark:bg-primary-900/30 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                >
                    <Icon
                        :name="item.icon"
                        class="text-primary-600 dark:text-primary-400"
                        size="20"
                        aria-hidden="true"
                    />
                </div>
                <div class="min-w-0 flex-1">
                    <p
                        class="text-secondary-500 dark:text-secondary-500 text-sm font-medium"
                    >
                        {{ t(item.labelKey) }}
                    </p>
                    <p
                        class="text-secondary-900 dark:text-secondary-50 mt-1 break-words"
                    >
                        {{ t(item.valueKey) }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
