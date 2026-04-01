<script setup lang="ts">
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

defineProps<{
    productName: string;
    editTo: string;
}>();

const localePath = useLocalePath();
</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button
                variant="ghost"
                class="h-8 w-8 p-0"
                :aria-label="`Akcje: ${productName}`"
            >
                <span class="sr-only">Otwórz menu akcji</span>
                <MoreHorizontal class="h-4 w-4" aria-hidden="true" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-48">
            <DropdownMenuLabel>Akcje</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem as-child>
                <NuxtLink :to="localePath(editTo)" class="cursor-pointer">
                    Edytuj
                </NuxtLink>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>
