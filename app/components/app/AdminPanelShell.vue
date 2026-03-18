<script setup lang="ts">
interface AdminNavItem {
    to: string;
    label: string;
    icon: string;
}

interface Props {
    title: string;
    description: string;
}

const props = defineProps<Props>();
const route = useRoute();
const localePath = useLocalePath();

const navItems = computed<AdminNavItem[]>(() => [
    {
        to: localePath('/admin'),
        label: 'Dashboard',
        icon: 'heroicons:squares-2x2',
    },
    {
        to: localePath('/admin/products'),
        label: 'Produkty',
        icon: 'heroicons:cube',
    },
    {
        to: localePath('/admin/products/new'),
        label: 'Dodaj produkt',
        icon: 'heroicons:plus-circle',
    },
    {
        to: localePath('/admin/inventory'),
        label: 'Magazyn',
        icon: 'heroicons:archive-box',
    },
]);

function getLinkClass(path: string): string {
    const currentPath = route.path.replace(/\/$/, '');
    const targetPath = path.replace(/\/$/, '');
    const isActive =
        currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);

    if (isActive) {
        return 'bg-primary-500 text-white dark:bg-primary-600';
    }

    return 'text-secondary-700 hover:bg-secondary-100 dark:text-secondary-200 dark:hover:bg-secondary-800';
}
</script>

<template>
    <section class="space-y-6">
        <header class="space-y-2">
            <h1
                class="text-secondary-900 dark:text-secondary-50 text-2xl font-bold"
            >
                {{ props.title }}
            </h1>
            <p class="text-secondary-600 dark:text-secondary-300">
                {{ props.description }}
            </p>
        </header>

        <div class="grid gap-4 lg:grid-cols-[260px_1fr]">
            <aside>
                <Card aria-label="Nawigacja panelu administratora">
                    <nav
                        class="flex flex-col gap-1"
                        aria-label="Panel administratora"
                    >
                        <NuxtLink
                            v-for="item in navItems"
                            :key="item.to"
                            :to="item.to"
                            class="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition"
                            :class="getLinkClass(item.to)"
                            :aria-label="`Przejdź do ${item.label}`"
                        >
                            <Icon
                                :name="item.icon"
                                class="size-4"
                                aria-hidden="true"
                            />
                            <span>{{ item.label }}</span>
                        </NuxtLink>
                    </nav>
                </Card>
            </aside>

            <div class="space-y-4">
                <slot />
            </div>
        </div>
    </section>
</template>
