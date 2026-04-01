<script setup lang="ts">
import type { SelectTriggerProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { ChevronDown } from 'lucide-vue-next';
import { SelectIcon, SelectTrigger, useForwardProps } from 'reka-ui';
import { cn } from '@/lib/utils';

const props = defineProps<
    SelectTriggerProps & { class?: HTMLAttributes['class'] }
>();

const delegatedProps = reactiveOmit(props, 'class');

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
    <SelectTrigger
        v-bind="forwardedProps"
        :class="
            cn(
                'focus-visible:ring-primary-500 flex h-10 w-full items-center justify-between gap-2 rounded-xl border border-slate-300 bg-white px-4 text-start text-sm whitespace-nowrap text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 data-placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:focus-visible:ring-offset-slate-950 dark:data-placeholder:text-slate-400 [&>span]:min-w-0 [&>span]:truncate',
                props.class,
            )
        "
    >
        <slot />
        <SelectIcon as-child>
            <ChevronDown class="h-4 w-4 shrink-0 opacity-50" />
        </SelectIcon>
    </SelectTrigger>
</template>
