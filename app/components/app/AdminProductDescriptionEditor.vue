<script setup lang="ts">
withDefaults(
    defineProps<{
        placeholder?: string;
        inputId?: string;
        ariaLabel?: string;
        disabled?: boolean;
    }>(),
    {
        placeholder: 'Krótki opis produktu — nagłówki, listy, pogrubienie…',
        inputId: undefined,
        ariaLabel: 'Opis produktu',
        disabled: false,
    },
);

const modelValue = defineModel<string>({ default: '' });
</script>

<template>
    <ClientOnly>
        <AdminProductDescriptionEditorImpl
            v-model="modelValue"
            :placeholder="placeholder"
            :input-id="inputId"
            :aria-label="ariaLabel"
            :disabled="disabled"
        />
        <template #fallback>
            <div
                class="border-input bg-muted/30 rounded-xl border px-3 py-8 text-center text-sm"
                role="status"
                aria-live="polite"
            >
                Ładowanie edytora…
            </div>
        </template>
    </ClientOnly>
</template>
