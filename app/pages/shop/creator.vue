<script setup lang="ts">
import CreatorFooter from '~/components/creator/CreatorFooter.vue';
import CreatorOptionCard from '~/components/creator/CreatorOptionCard.vue';
import CreatorStepNav from '~/components/creator/CreatorStepNav.vue';
import CreatorSummary from '~/components/creator/CreatorSummary.vue';

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
    isOptionSelected,
    handleSelectOption,
    handleStepClick,
    handleNext,
    handlePrev,
    handleOpenResetModal,
    handleConfirmReset,
    getSummaryLabel,
    getSummaryOption,
} = useCreatorConfigurator();

usePageMeta({
    title: () => t('creatorMetaTitle'),
    description: () => t('creatorMetaDescription'),
});
</script>

<template>
    <ClientOnly>
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
                <p
                    class="text-secondary-500 dark:text-secondary-400 mt-1 text-xs"
                >
                    {{ t('creatorAutoSaveHint') }}
                </p>
            </header>

            <CreatorStepNav
                :steps="steps"
                :current-step-index="currentStepIndex"
                :current-step="currentStep"
                :is-step-accessible="isStepAccessible"
                @step-click="handleStepClick"
            />

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
                    <CreatorOptionCard
                        v-for="option in currentStep?.options ?? []"
                        :key="option.id"
                        :option="option"
                        :is-selected="isOptionSelected(option.id)"
                        @select="handleSelectOption"
                    />
                </div>

                <p
                    v-if="validationError"
                    class="text-danger-600 dark:text-danger-400 text-sm"
                    role="alert"
                >
                    {{ validationError }}
                </p>

                <CreatorSummary
                    v-if="isLastStep"
                    :config-keys="configKeys"
                    :summary-field-keys="summaryFieldKeys"
                    :get-summary-label="getSummaryLabel"
                    :get-summary-option="getSummaryOption"
                />
            </section>

            <CreatorFooter
                :is-first-step="isFirstStep"
                :is-last-step="isLastStep"
                :is-current-step-valid="isCurrentStepValid()"
                :has-any-selection="hasAnySelection"
                @prev="handlePrev"
                @next="handleNext"
                @reset="handleOpenResetModal"
            />

            <Dialog
                v-model:open="isResetModalOpen"
                :title="t('creatorResetModalTitle')"
                :message="t('creatorResetModalMessage')"
                :confirm-text="t('creatorResetModalConfirm')"
                :cancel-text="t('creatorResetModalCancel')"
                @confirm="handleConfirmReset"
            />
        </div>
        <template #fallback>
            <div
                class="mx-auto max-w-2xl space-y-6 px-0 sm:space-y-8 sm:px-0"
                :aria-label="t('creatorLoadingAria')"
            >
                <div
                    class="bg-secondary-200 dark:bg-secondary-700 h-24 animate-pulse rounded-lg"
                />
                <div class="flex gap-2">
                    <div
                        v-for="i in 7"
                        :key="i"
                        class="bg-secondary-200 dark:bg-secondary-700 h-10 flex-1 animate-pulse rounded-lg"
                    />
                </div>
                <div
                    class="bg-secondary-200 dark:bg-secondary-700 h-64 animate-pulse rounded-lg"
                />
            </div>
        </template>
    </ClientOnly>
</template>
