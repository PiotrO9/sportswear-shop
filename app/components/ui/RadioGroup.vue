<script setup lang="ts">
import {
    RADIO_GROUP_INJECTION_KEY,
    type RadioGroupContext,
} from './radioGroupContext';

interface Props {
    modelValue: string | number;
    name?: string;
    ariaLabel?: string;
    orientation?: 'horizontal' | 'vertical';
}

interface Emits {
    (e: 'update:modelValue', value: string | number): void;
}

const props = withDefaults(defineProps<Props>(), {
    name: undefined,
    ariaLabel: '',
    orientation: 'vertical',
});

const emit = defineEmits<Emits>();

const groupName = computed(
    () => props.name ?? `radio-group-${Math.random().toString(36).slice(2)}`,
);

const context = computed<RadioGroupContext>(() => ({
    name: groupName.value,
    modelValue: props.modelValue,
    setValue(value: string | number) {
        emit('update:modelValue', value);
    },
}));

provide(RADIO_GROUP_INJECTION_KEY, context);

const groupClass = computed(() => {
    const base = 'flex gap-3';

    return props.orientation === 'horizontal'
        ? `${base} flex-row flex-wrap`
        : `${base} flex-col`;
});
</script>

<template>
    <div role="radiogroup" :aria-label="ariaLabel" :class="groupClass">
        <slot />
    </div>
</template>
