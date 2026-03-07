<script setup lang="ts">
const { t } = useI18n();

const expandedIndex = ref<number | null>(null);

const faqCount = 8;

function handleToggle(index: number) {
    expandedIndex.value = expandedIndex.value === index ? null : index;
}

function handleFaqKeyDown(event: KeyboardEvent, index: number) {
    if (!event) return;

    if (event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    handleToggle(index);
}
</script>

<template>
    <div class="max-w-3xl py-8">
        <h1
            class="text-secondary-900 dark:text-secondary-50 text-2xl font-bold"
        >
            {{ t('footerHelpFaq') }}
        </h1>
        <p class="text-secondary-600 dark:text-secondary-400 mt-4">
            {{ t('faqIntro') }}
        </p>

        <ul class="mt-8 space-y-2" role="list">
            <li
                v-for="i in faqCount"
                :key="i"
                class="border-secondary-200 dark:border-secondary-800 overflow-hidden rounded-lg border"
            >
                <div>
                    <button
                        :id="`faq-question-${i}`"
                        type="button"
                        class="text-secondary-900 dark:text-secondary-50 hover:bg-secondary-50 dark:hover:bg-secondary-800/50 flex w-full items-center justify-between gap-4 px-4 py-4 text-left font-medium transition"
                        :aria-expanded="expandedIndex === i"
                        :aria-controls="`faq-answer-${i}`"
                        @click="handleToggle(i)"
                        @keydown="handleFaqKeyDown($event, i)"
                    >
                        {{ t(`faq${i}Question`) }}
                        <Icon
                            :name="
                                expandedIndex === i
                                    ? 'heroicons:chevron-up'
                                    : 'heroicons:chevron-down'
                            "
                            class="text-secondary-500 dark:text-secondary-400 shrink-0"
                            size="20"
                            aria-hidden="true"
                        />
                    </button>
                    <div
                        :id="`faq-answer-${i}`"
                        :aria-labelledby="`faq-question-${i}`"
                        role="region"
                        class="border-secondary-200 dark:border-secondary-800 border-t"
                        :class="expandedIndex === i ? 'block' : 'hidden'"
                    >
                        <p
                            class="text-secondary-600 dark:text-secondary-400 px-4 py-4"
                        >
                            {{ t(`faq${i}Answer`) }}
                        </p>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>
