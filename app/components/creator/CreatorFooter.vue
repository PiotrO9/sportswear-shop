<script setup lang="ts">
interface Props {
    isFirstStep: boolean;
    isLastStep: boolean;
    isCurrentStepValid: boolean;
    hasAnySelection: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
    prev: [];
    next: [];
    reset: [];
}>();
</script>

<template>
    <footer
        class="border-secondary-200 dark:border-secondary-700 flex flex-col-reverse gap-4 border-t pt-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between"
    >
        <div class="flex items-center gap-3">
            <Action
                v-if="!isFirstStep"
                :aria-label="$t('creatorNavPrevAria')"
                variant="secondary"
                @click="emit('prev')"
            >
                {{ $t('creatorNavPrev') }}
            </Action>
            <Action
                :aria-label="$t('creatorResetAria')"
                variant="secondary"
                :is-disabled="!hasAnySelection"
                @click="emit('reset')"
            >
                {{ $t('creatorNavReset') }}
            </Action>
        </div>
        <Action
            v-if="!isLastStep"
            :aria-label="$t('creatorNavNextAria')"
            :is-disabled="!isCurrentStepValid"
            @click="emit('next')"
        >
            {{ $t('creatorNavNext') }}
        </Action>
    </footer>
</template>
