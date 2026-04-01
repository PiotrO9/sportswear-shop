<script setup lang="ts">
import { Button } from '@/components/shadcn/button';
import { cn } from '@/lib/utils';

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
const { t } = useI18n();
const { handleLogout } = useLogout();

const dashboardPath = computed(() => localePath('/admin'));

const navItems = computed<AdminNavItem[]>(() => [
    {
        to: dashboardPath.value,
        label: t('adminNavDashboard'),
        icon: 'heroicons:squares-2x2',
    },
    {
        to: localePath('/admin/products'),
        label: t('adminNavProducts'),
        icon: 'heroicons:cube',
    },
    {
        to: localePath('/admin/products/new'),
        label: t('adminNavAddProduct'),
        icon: 'heroicons:plus-circle',
    },
    {
        to: localePath('/admin/inventory'),
        label: t('adminNavInventory'),
        icon: 'heroicons:archive-box',
    },
]);

function normalizePath(path: string): string {
    return path.replace(/\/$/, '') || '/';
}

function isNavItemActive(path: string): boolean {
    const currentPath = normalizePath(route.path);
    const targetPath = normalizePath(path);
    const adminHome = normalizePath(dashboardPath.value);

    if (targetPath === adminHome) {
        return currentPath === adminHome;
    }

    return (
        currentPath === targetPath || currentPath.startsWith(`${targetPath}/`)
    );
}

function asidePanelClass(): string {
    return cn(
        'border-border bg-card text-card-foreground rounded-xl border p-3 shadow-sm',
    );
}

function handleLogoutClick(): void {
    handleLogout();
}
</script>

<template>
    <section class="space-y-6">
        <header
            class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6"
        >
            <div class="min-w-0 space-y-2">
                <h1 class="text-foreground text-2xl font-bold tracking-tight">
                    {{ props.title }}
                </h1>
                <p class="text-muted-foreground text-sm sm:text-base">
                    {{ props.description }}
                </p>
            </div>
            <Button
                variant="outline"
                size="sm"
                class="border-border text-foreground shrink-0 self-start"
                type="button"
                :aria-label="t('navLogOut')"
                @click="handleLogoutClick"
            >
                {{ t('navLogOut') }}
            </Button>
        </header>

        <div class="grid gap-4 lg:grid-cols-[260px_1fr] lg:items-start">
            <aside class="lg:sticky lg:top-4">
                <div
                    :class="asidePanelClass()"
                    :aria-label="t('adminNavAsideLabel')"
                >
                    <p
                        class="text-muted-foreground px-2 pb-2 text-xs font-medium tracking-wide uppercase"
                    >
                        {{ t('adminNavMenuHeading') }}
                    </p>
                    <nav
                        class="flex flex-col gap-1"
                        :aria-label="t('adminNavMainLabel')"
                    >
                        <Button
                            v-for="item in navItems"
                            :key="item.to"
                            :variant="
                                isNavItemActive(item.to) ? 'secondary' : 'ghost'
                            "
                            class="h-9 w-full justify-start gap-2 px-3"
                            as-child
                        >
                            <NuxtLink
                                :to="item.to"
                                class="inline-flex items-center"
                                :aria-current="
                                    isNavItemActive(item.to)
                                        ? 'page'
                                        : undefined
                                "
                                :aria-label="
                                    t('adminNavGoTo', { label: item.label })
                                "
                            >
                                <Icon
                                    :name="item.icon"
                                    class="size-4 shrink-0"
                                    aria-hidden="true"
                                />
                                <span>{{ item.label }}</span>
                            </NuxtLink>
                        </Button>
                    </nav>
                </div>
            </aside>

            <div class="min-w-0 space-y-4">
                <slot />
            </div>
        </div>
    </section>
</template>
