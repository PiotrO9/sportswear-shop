<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';
import { Button } from '@/components/shadcn/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu';

defineProps<{
    productName: string;
}>();

function handleAssignDemo(): void {
    // Rezerwa na przypisanie recenzenta (backend).
}
</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button
                variant="outline"
                size="sm"
                class="h-8 gap-1 px-2 text-xs"
                :aria-label="`Przypisz recenzenta dla ${productName}`"
            >
                Przypisz
                <ChevronDown class="h-3 w-3 opacity-60" aria-hidden="true" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" class="w-48">
            <DropdownMenuItem class="text-xs" @select="handleAssignDemo">
                Jan Kowalski (demo)
            </DropdownMenuItem>
            <DropdownMenuItem class="text-xs" @select="handleAssignDemo">
                Anna Nowak (demo)
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>
