<script setup lang="ts">
const { t } = useI18n();

const {
    steps,
    currentStepIndex,
    isResetModalOpen,
    validationError,
    currentStep,
    isFirstStep,
    isLastStep,
    isCurrentStepValid,
    hasAnySelection,
    configKeys,
    summaryFieldKeys,
    isStepAccessible,
    getCurrentValue,
    handleSelectOption,
    handleStepClick,
    handleNext,
    handlePrev,
    handleOpenResetModal,
    handleConfirmReset,
    handleKeyDown,
    getSummaryLabel,
    getSummaryOption,
} = useCreatorConfigurator();

usePageMeta({
    title: () => t('creatorMetaTitle'),
    description: () => t('creatorMetaDescription'),
});
</script>

<template>
    <div class="mx-auto max-w-2xl space-y-6 px-0 sm:space-y-8 sm:px-0">
        <header class="relative pr-10 text-center sm:pr-12">
            <h1
                class="text-secondary-900 dark:text-secondary-50 text-xl font-bold sm:text-2xl"
            >
                {{ t('creatorTitle') }}
            </h1>
            <p
                class="text-secondary-600 dark:text-secondary-400 mt-2 text-sm sm:text-base"
            >
                {{ t('creatorSubtitle') }}
            </p>
            <p class="text-secondary-500 dark:text-secondary-400 mt-1 text-xs">
                {{ t('creatorAutoSaveHint') }}
            </p>
        </header>

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
                        @keydown.enter="
                            isStepAccessible(index) && handleStepClick(index)
                        "
                        @keydown.space.prevent="
                            isStepAccessible(index) && handleStepClick(index)
                        "
                    >
                        <div
                            class="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors"
                            :class="
                                index < currentStepIndex
                                    ? 'bg-green-500 text-white dark:bg-green-600'
                                    : index === currentStepIndex
                                      ? 'bg-primary-500 dark:bg-primary-600 text-white'
                                      : 'bg-secondary-200 text-secondary-500 dark:bg-secondary-600 dark:text-secondary-400'
                            "
                        >
                            {{ index + 1 }}
                        </div>
                        <span
                            class="max-w-24 shrink-0 text-center text-xs font-medium"
                            :class="
                                index < currentStepIndex
                                    ? 'text-green-600 dark:text-green-400'
                                    : index === currentStepIndex
                                      ? 'text-primary-600 dark:text-primary-400'
                                      : 'text-secondary-400 dark:text-secondary-500'
                            "
                        >
                            {{ t(step.titleKey) }}
                        </span>
                    </button>
                    <!-- Linia łącząca między krokami -->
                    <div
                        v-if="index < steps.length - 1"
                        class="mt-5 h-0.5 min-w-8 flex-1 shrink-0"
                        :class="
                            index < currentStepIndex
                                ? 'bg-green-500 dark:bg-green-600'
                                : index === currentStepIndex
                                  ? 'bg-primary-500 dark:bg-primary-600'
                                  : 'bg-secondary-200 dark:bg-secondary-600'
                        "
                    />
                </template>
            </nav>
        </div>

        <section
            class="space-y-6"
            :aria-label="currentStep ? t(currentStep.titleKey) : ''"
        >
            <div class="flex items-center gap-3">
                <div
                    class="bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400 flex size-10 shrink-0 items-center justify-center rounded-lg sm:size-12 sm:rounded-xl"
                >
                    <Icon
                        :name="currentStep?.icon ?? 'heroicons:cube'"
                        class="size-5 sm:size-6"
                        aria-hidden="true"
                    />
                </div>
                <h2
                    class="text-secondary-900 dark:text-secondary-50 text-base font-semibold sm:text-lg"
                >
                    {{ currentStep ? t(currentStep.titleKey) : '' }}
                </h2>
            </div>

            <div
                v-if="(currentStep?.options?.length ?? 0) > 0"
                class="grid gap-3 sm:grid-cols-2 sm:gap-4"
            >
                <button
                    v-for="option in currentStep?.options ?? []"
                    :key="option.id"
                    type="button"
                    :aria-label="
                        t('creatorSelectAria', { label: t(option.labelKey) })
                    "
                    :aria-pressed="getCurrentValue() === option.id"
                    :tabindex="0"
                    class="focus-visible:ring-primary-400 dark:focus-visible:ring-offset-secondary-950 flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 p-4 text-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:gap-4 sm:rounded-2xl sm:p-6"
                    :class="
                        getCurrentValue() === option.id
                            ? 'border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-950/30'
                            : 'border-secondary-200 hover:border-secondary-300 dark:border-secondary-700 dark:bg-secondary-900 dark:hover:border-secondary-600 bg-white'
                    "
                    @click="handleSelectOption(option.id)"
                    @keydown="(e) => handleKeyDown(e, option.id)"
                >
                    <div
                        v-if="option.colorClass"
                        class="size-12 shrink-0 rounded-full ring-2 ring-offset-2 sm:size-16"
                        :class="[
                            option.colorClass,
                            getCurrentValue() === option.id
                                ? 'ring-primary-500'
                                : 'ring-secondary-200 dark:ring-secondary-600',
                        ]"
                    />
                    <div
                        v-else-if="option.icon"
                        class="flex size-12 shrink-0 items-center justify-center rounded-xl sm:size-16 sm:rounded-2xl"
                        :class="
                            getCurrentValue() === option.id
                                ? 'bg-primary-500 dark:bg-primary-600 text-white'
                                : 'bg-secondary-100 text-secondary-600 dark:bg-secondary-800 dark:text-secondary-400'
                        "
                    >
                        <Icon
                            :name="option.icon"
                            size="36"
                            aria-hidden="true"
                        />
                    </div>
                    <div class="flex flex-col gap-1">
                        <span
                            class="font-semibold"
                            :class="
                                getCurrentValue() === option.id
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
            </div>

            <p
                v-if="validationError"
                class="text-danger-600 dark:text-danger-400 text-sm"
                role="alert"
            >
                {{ validationError }}
            </p>

            <div
                v-if="isLastStep"
                class="border-secondary-200 dark:border-secondary-700 dark:bg-secondary-900 rounded-xl border bg-white p-4 sm:rounded-2xl sm:p-6"
            >
                <h3
                    class="text-secondary-900 dark:text-secondary-50 mb-3 text-sm font-semibold sm:mb-4 sm:text-base"
                >
                    {{ t('creatorSummaryTitle') }}
                </h3>
                <dl class="space-y-3 sm:space-y-4">
                    <div
                        v-for="key in configKeys"
                        :key="key"
                        class="bg-secondary-50 dark:bg-secondary-800/50 flex flex-col gap-2 rounded-lg px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-4"
                    >
                        <dt
                            class="text-secondary-600 dark:text-secondary-400 flex flex-wrap items-center gap-2 sm:gap-3"
                        >
                            <template v-if="getSummaryOption(key)?.colorClass">
                                <span
                                    class="ring-secondary-200 dark:ring-secondary-600 size-8 shrink-0 rounded-full ring-2"
                                    :class="getSummaryOption(key)?.colorClass"
                                />
                            </template>
                            <template v-else-if="getSummaryOption(key)?.icon">
                                <div
                                    class="dark:bg-secondary-700 flex size-8 shrink-0 items-center justify-center rounded-lg bg-white"
                                >
                                    <Icon
                                        :name="getSummaryOption(key)!.icon!"
                                        class="text-secondary-600 dark:text-secondary-400 size-5"
                                        aria-hidden="true"
                                    />
                                </div>
                            </template>
                            <span>{{ t(summaryFieldKeys[key]) }}</span>
                        </dt>
                        <dd
                            class="text-secondary-900 dark:text-secondary-50 text-right font-medium sm:text-left"
                        >
                            {{ getSummaryLabel(key) }}
                        </dd>
                    </div>
                </dl>
                <p
                    class="text-secondary-500 dark:text-secondary-400 mt-4 text-sm"
                >
                    {{ t('creatorSummaryDemoNote') }}
                </p>
            </div>
        </section>

        <footer
            class="border-secondary-200 dark:border-secondary-700 flex flex-col-reverse gap-4 border-t pt-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between"
        >
            <div class="flex items-center gap-3">
                <Action
                    v-if="!isFirstStep"
                    :aria-label="t('creatorNavPrevAria')"
                    variant="secondary"
                    @click="handlePrev"
                >
                    {{ t('creatorNavPrev') }}
                </Action>
                <Action
                    :aria-label="t('creatorResetAria')"
                    variant="secondary"
                    :is-disabled="!hasAnySelection"
                    @click="handleOpenResetModal"
                >
                    {{ t('creatorNavReset') }}
                </Action>
            </div>
            <Action
                v-if="!isLastStep"
                :aria-label="t('creatorNavNextAria')"
                :is-disabled="!isCurrentStepValid()"
                @click="handleNext"
            >
                {{ t('creatorNavNext') }}
            </Action>
            <div v-else />
        </footer>

        <Dialog
            v-model:open="isResetModalOpen"
            :title="t('creatorResetModalTitle')"
            :message="t('creatorResetModalMessage')"
            :confirm-text="t('creatorResetModalConfirm')"
            :cancel-text="t('creatorResetModalCancel')"
            @confirm="handleConfirmReset"
        />
    </div>
</template>
