<script setup lang="ts">
import type { ConfiguratorOption } from '~/types/creator';

interface Props {
    option: ConfiguratorOption;
    isSelected: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
    select: [optionId: string];
}>();

const { t } = useI18n();

function handleClick(): void {
    emit('select', props.option.id);
}

function handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleClick();
    }
}
</script>

<template>
    <button
        type="button"
        :aria-label="t('creatorSelectAria', { label: t(option.labelKey) })"
        :aria-pressed="isSelected"
        tabindex="0"
        class="focus-visible:ring-primary-400 dark:focus-visible:ring-offset-secondary-950 flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 p-4 text-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:gap-4 sm:rounded-2xl sm:p-6"
        :class="
            isSelected
                ? 'border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-950/30'
                : 'border-secondary-200 hover:border-secondary-300 dark:border-secondary-700 dark:bg-secondary-900 dark:hover:border-secondary-600 bg-white'
        "
        @click="handleClick"
        @keydown="handleKeyDown"
    >
        <div
            v-if="option.colorClass"
            class="size-12 shrink-0 rounded-full ring-2 ring-offset-2 sm:size-16"
            :class="[
                option.colorClass,
                isSelected
                    ? 'ring-primary-500'
                    : 'ring-secondary-200 dark:ring-secondary-600',
            ]"
        />
        <div
            v-else-if="option.icon"
            class="flex size-12 shrink-0 items-center justify-center rounded-xl sm:size-16 sm:rounded-2xl"
            :class="
                isSelected
                    ? 'bg-primary-500 dark:bg-primary-600 text-white'
                    : 'bg-secondary-100 text-secondary-600 dark:bg-secondary-800 dark:text-secondary-400'
            "
        >
            <Icon :name="option.icon" size="36" aria-hidden="true" />
        </div>
        <div class="flex flex-col gap-1">
            <span
                class="font-semibold"
                :class="
                    isSelected
                        ? 'text-primary-700 dark:text-primary-300'
                        : 'text-secondary-900 dark:text-secondary-50'
                "
            >
                {{ t(option.labelKey) }}
            </span>
            <span
                v-if="option.descriptionKey"
                class="text-secondary-500 dark:text-secondary-400 text-sm"
            >
                {{ t(option.descriptionKey) }}
            </span>
        </div>
    </button>
</template>
