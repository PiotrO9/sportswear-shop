<script setup lang="ts">
import type { AdminProductStatus } from '~/types/admin-product';
import { MoreHorizontal } from 'lucide-vue-next';
import { Button } from '@/components/shadcn/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu';

const props = defineProps<{
    productId: string;
    productName: string;
    editTo: string;
    status: AdminProductStatus;
    /** Blokuje pozycję menu podczas PATCH (draft → aktywny) */
    isPublishing?: boolean;
}>();

const emit = defineEmits<{
    'publish-draft': [productId: string];
}>();

const localePath = useLocalePath();
const { t } = useI18n();

function handlePublishDraftClick(): void {
    if (props.isPublishing) {
        return;
    }

    emit('publish-draft', props.productId);
}
</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button
                variant="ghost"
                class="h-8 w-8 p-0"
                :aria-label="t('adminActionsFor', { name: productName })"
            >
                <span class="sr-only">{{ t('adminOpenActionsMenu') }}</span>
                <MoreHorizontal class="h-4 w-4" aria-hidden="true" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-48">
            <DropdownMenuLabel>{{ t('adminActions') }}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem as-child>
                <NuxtLink :to="localePath(editTo)" class="cursor-pointer">
                    {{ t('adminEdit') }}
                </NuxtLink>
            </DropdownMenuItem>
            <template v-if="status === 'draft'">
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    :disabled="isPublishing"
                    class="cursor-pointer"
                    :aria-busy="isPublishing ? 'true' : undefined"
                    :aria-label="
                        isPublishing
                            ? t('adminPublishingAria', { name: productName })
                            : t('adminPublishActiveAria', {
                                  name: productName,
                              })
                    "
                    @click="handlePublishDraftClick"
                >
                    {{
                        isPublishing
                            ? t('adminPublishing')
                            : t('adminPublishAsActive')
                    }}
                </DropdownMenuItem>
            </template>
        </DropdownMenuContent>
    </DropdownMenu>
</template>
