<script setup lang="ts">
import type { ConfiguratorStep } from '~/types/creator';

interface Props {
    steps: ConfiguratorStep[];
    currentStepIndex: number;
    currentStep: ConfiguratorStep | undefined;
    isStepAccessible: (index: number) => boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
    stepClick: [index: number];
}>();

const { t } = useI18n();

function getStepStatusClass(index: number): string {
    if (index < props.currentStepIndex) {
        return 'bg-green-500 text-white dark:bg-green-600';
    }

    if (index === props.currentStepIndex) {
        return 'bg-primary-500 dark:bg-primary-600 text-white';
    }

    return 'bg-secondary-200 text-secondary-500 dark:bg-secondary-600 dark:text-secondary-400';
}

function getLabelClass(index: number): string {
    if (index < props.currentStepIndex) {
        return 'text-green-600 dark:text-green-400';
    }

    if (index === props.currentStepIndex) {
        return 'text-primary-600 dark:text-primary-400';
    }

    return 'text-secondary-400 dark:text-secondary-500';
}

function getConnectorClass(index: number): string {
    if (index < props.currentStepIndex) {
        return 'bg-green-500 dark:bg-green-600';
    }

    if (index === props.currentStepIndex) {
        return 'bg-primary-500 dark:bg-primary-600';
    }

    return 'bg-secondary-200 dark:bg-secondary-600';
}

function handleStepClick(index: number): void {
    if (props.isStepAccessible(index)) {
        emit('stepClick', index);
    }
}

function handleKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleStepClick(index);
    }
}
</script>

<template>
    <div
        class="relative left-1/2 flex w-screen -translate-x-1/2 justify-center-safe overflow-x-auto scroll-smooth px-6 pb-2"
    >
        <nav
            class="flex min-w-min shrink-0 touch-pan-x items-start justify-center gap-1 py-1"
            :aria-label="t('creatorStepsAria')"
            role="progressbar"
            :aria-valuenow="currentStepIndex + 1"
            :aria-valuemin="1"
            :aria-valuemax="steps.length"
            :aria-valuetext="
                t('creatorStageAria', {
                    n: currentStepIndex + 1,
                    title: currentStep ? t(currentStep.titleKey) : '',
                })
            "
        >
            <template v-for="(step, index) in steps" :key="step.id">
                <button
                    type="button"
                    class="focus-visible:ring-primary-400 flex shrink-0 flex-col items-center gap-2 rounded-lg p-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    :class="
                        isStepAccessible(index)
                            ? 'cursor-pointer'
                            : 'cursor-not-allowed opacity-50'
                    "
                    :aria-label="
                        t('creatorStageAria', {
                            n: index + 1,
                            title: t(step.titleKey),
                        })
                    "
                    :aria-current="
                        index === currentStepIndex ? 'step' : undefined
                    "
                    :aria-disabled="!isStepAccessible(index)"
                    :tabindex="isStepAccessible(index) ? 0 : -1"
                    :disabled="!isStepAccessible(index)"
                    @click="handleStepClick(index)"
                    @keydown="(e) => handleKeyDown(e, index)"
                >
                    <div
                        class="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors"
                        :class="getStepStatusClass(index)"
                    >
                        {{ index + 1 }}
                    </div>
                    <span
                        class="max-w-24 shrink-0 text-center text-xs font-medium"
                        :class="getLabelClass(index)"
                    >
                        {{ t(step.titleKey) }}
                    </span>
                </button>
                <div
                    v-if="index < steps.length - 1"
                    class="mt-5 h-0.5 min-w-8 flex-1 shrink-0"
                    :class="getConnectorClass(index)"
                />
            </template>
        </nav>
    </div>
</template>
