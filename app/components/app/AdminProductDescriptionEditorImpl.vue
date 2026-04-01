<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3';
import Placeholder from '@tiptap/extension-placeholder';
import StarterKit from '@tiptap/starter-kit';
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Redo2,
    Strikethrough,
    Undo2,
} from 'lucide-vue-next';
import { ref, watch } from 'vue';

const props = withDefaults(
    defineProps<{
        modelValue: string;
        placeholder?: string;
        inputId?: string;
        ariaLabel?: string;
        disabled?: boolean;
    }>(),
    {
        placeholder: 'Opis produktu…',
        inputId: undefined,
        ariaLabel: 'Opis produktu',
        disabled: false,
    },
);

const emit = defineEmits<{
    'update:modelValue': [value: string];
}>();

/** Wymusza odświeżenie stanu przycisków (TipTap nie używa reaktywności Vue). */
const toolbarVersion = ref(0);

const editor = useEditor({
    content: props.modelValue || '',
    extensions: [
        StarterKit,
        Placeholder.configure({
            placeholder: props.placeholder,
        }),
    ],
    editable: !props.disabled,
    editorProps: {
        attributes: {
            role: 'textbox',
            'aria-multiline': 'true',
            'aria-label': props.ariaLabel,
            ...(props.inputId ? { id: props.inputId } : {}),
        },
    },
    onUpdate: ({ editor: ed }) => {
        emit('update:modelValue', ed.getHTML());
    },
});

watch(
    editor,
    (ed, _prev, onCleanup) => {
        if (!ed || ed.isDestroyed) {
            return;
        }

        function bumpToolbar(): void {
            toolbarVersion.value += 1;
        }

        ed.on('selectionUpdate', bumpToolbar);
        ed.on('transaction', bumpToolbar);
        onCleanup(() => {
            ed.off('selectionUpdate', bumpToolbar);
            ed.off('transaction', bumpToolbar);
        });
    },
    { immediate: true },
);

watch(
    () => props.modelValue,
    (next) => {
        const ed = editor.value;

        if (!ed || ed.isDestroyed) {
            return;
        }

        const current = ed.getHTML();

        if (next === current) {
            return;
        }

        ed.commands.setContent(next || '', false);
    },
);

watch(
    () => props.disabled,
    (disabled) => {
        const ed = editor.value;

        if (!ed || ed.isDestroyed) {
            return;
        }

        ed.setEditable(!disabled);
    },
);

watch(
    () => props.ariaLabel,
    (label) => {
        const ed = editor.value;

        if (!ed || ed.isDestroyed) {
            return;
        }

        ed.view.dom.setAttribute('aria-label', label);
    },
);

watch(
    () => props.inputId,
    (id) => {
        const ed = editor.value;

        if (!ed || ed.isDestroyed) {
            return;
        }

        if (id) {
            ed.view.dom.setAttribute('id', id);
        } else {
            ed.view.dom.removeAttribute('id');
        }
    },
);

function handleToolbarKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'ArrowDown') {
        return;
    }

    event.preventDefault();
    editor.value?.chain().focus().run();
}

function handleBoldClick(): void {
    editor.value?.chain().focus().toggleBold().run();
}

function handleItalicClick(): void {
    editor.value?.chain().focus().toggleItalic().run();
}

function handleStrikeClick(): void {
    editor.value?.chain().focus().toggleStrike().run();
}

function handleBulletListClick(): void {
    editor.value?.chain().focus().toggleBulletList().run();
}

function handleOrderedListClick(): void {
    editor.value?.chain().focus().toggleOrderedList().run();
}

function handleUndoClick(): void {
    editor.value?.chain().focus().undo().run();
}

function handleRedoClick(): void {
    editor.value?.chain().focus().redo().run();
}

function isMarkActive(name: string): boolean {
    void toolbarVersion.value;

    return editor.value?.isActive(name) ?? false;
}

function isNodeActive(name: string): boolean {
    void toolbarVersion.value;

    return editor.value?.isActive(name) ?? false;
}

function canUndo(): boolean {
    void toolbarVersion.value;

    return editor.value?.can().undo() ?? false;
}

function canRedo(): boolean {
    void toolbarVersion.value;

    return editor.value?.can().redo() ?? false;
}
</script>

<template>
    <div
        class="border-input bg-background focus-within:ring-ring rounded-xl border shadow-sm focus-within:ring-2 focus-within:ring-offset-2 focus-within:outline-none"
    >
        <div
            class="border-border flex flex-wrap items-center gap-1 border-b p-2"
            role="toolbar"
            tabindex="0"
            aria-label="Formatowanie opisu produktu"
            @keydown="handleToolbarKeyDown"
        >
            <UiButton
                type="button"
                variant="outline"
                size="icon-sm"
                :disabled="disabled || !editor"
                :aria-pressed="isMarkActive('bold')"
                aria-label="Pogrubienie"
                @click="handleBoldClick"
            >
                <Bold class="size-4" aria-hidden="true" />
            </UiButton>
            <UiButton
                type="button"
                variant="outline"
                size="icon-sm"
                :disabled="disabled || !editor"
                :aria-pressed="isMarkActive('italic')"
                aria-label="Kursywa"
                @click="handleItalicClick"
            >
                <Italic class="size-4" aria-hidden="true" />
            </UiButton>
            <UiButton
                type="button"
                variant="outline"
                size="icon-sm"
                :disabled="disabled || !editor"
                :aria-pressed="isMarkActive('strike')"
                aria-label="Przekreślenie"
                @click="handleStrikeClick"
            >
                <Strikethrough class="size-4" aria-hidden="true" />
            </UiButton>
            <span
                class="bg-border mx-1 hidden h-6 w-px self-center sm:inline-block"
                aria-hidden="true"
            />
            <UiButton
                type="button"
                variant="outline"
                size="icon-sm"
                :disabled="disabled || !editor"
                :aria-pressed="isNodeActive('bulletList')"
                aria-label="Lista wypunktowana"
                @click="handleBulletListClick"
            >
                <List class="size-4" aria-hidden="true" />
            </UiButton>
            <UiButton
                type="button"
                variant="outline"
                size="icon-sm"
                :disabled="disabled || !editor"
                :aria-pressed="isNodeActive('orderedList')"
                aria-label="Lista numerowana"
                @click="handleOrderedListClick"
            >
                <ListOrdered class="size-4" aria-hidden="true" />
            </UiButton>
            <span
                class="bg-border mx-1 hidden h-6 w-px self-center sm:inline-block"
                aria-hidden="true"
            />
            <UiButton
                type="button"
                variant="outline"
                size="icon-sm"
                :disabled="disabled || !editor || !canUndo()"
                aria-label="Cofnij"
                @click="handleUndoClick"
            >
                <Undo2 class="size-4" aria-hidden="true" />
            </UiButton>
            <UiButton
                type="button"
                variant="outline"
                size="icon-sm"
                :disabled="disabled || !editor || !canRedo()"
                aria-label="Ponów"
                @click="handleRedoClick"
            >
                <Redo2 class="size-4" aria-hidden="true" />
            </UiButton>
        </div>
        <EditorContent
            :editor="editor"
            class="[&_.ProseMirror]:text-foreground [&_.ProseMirror_p.is-editor-empty:first-child]:before:text-muted-foreground max-w-none [&_.ProseMirror]:min-h-[120px] [&_.ProseMirror]:px-3 [&_.ProseMirror]:py-2 [&_.ProseMirror]:text-sm [&_.ProseMirror]:outline-none [&_.ProseMirror]:focus-visible:outline-none [&_.ProseMirror_ol]:my-2 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-5 [&_.ProseMirror_p]:my-1 [&_.ProseMirror_p.is-editor-empty:first-child]:before:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child]:before:float-left [&_.ProseMirror_p.is-editor-empty:first-child]:before:h-0 [&_.ProseMirror_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)] [&_.ProseMirror_ul]:my-2 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-5"
        />
    </div>
</template>
