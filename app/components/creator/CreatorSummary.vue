<script setup lang="ts">
import type { ConfiguratorStateKey } from '~/types/creator';

interface Props {
    configKeys: ConfiguratorStateKey[];
    summaryFieldKeys: Record<ConfiguratorStateKey, string>;
    getSummaryLabel: (key: ConfiguratorStateKey) => string;
    getSummaryOption: (
        key: ConfiguratorStateKey,
    ) => { colorClass?: string; icon?: string } | undefined;
}

defineProps<Props>();
</script>

<template>
    <div
        class="border-secondary-200 dark:border-secondary-700 dark:bg-secondary-900 rounded-xl border bg-white p-4 sm:rounded-2xl sm:p-6"
    >
        <h3
            class="text-secondary-900 dark:text-secondary-50 mb-3 text-sm font-semibold sm:mb-4 sm:text-base"
        >
            {{ $t('creatorSummaryTitle') }}
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
                    <span>{{ $t(summaryFieldKeys[key]) }}</span>
                </dt>
                <dd
                    class="text-secondary-900 dark:text-secondary-50 text-right font-medium sm:text-left"
                >
                    {{ getSummaryLabel(key) }}
                </dd>
            </div>
        </dl>
        <p class="text-secondary-500 dark:text-secondary-400 mt-4 text-sm">
            {{ $t('creatorSummaryDemoNote') }}
        </p>
    </div>
</template>
