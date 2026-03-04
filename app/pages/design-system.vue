<script setup lang="ts">
import { z } from 'zod';
import Autoplay from 'embla-carousel-autoplay';
import type { BreadcrumbItem } from '~/components/ui/Breadcrumbs.vue';
import type { NavTreeItem } from '~/components/ui/NavTree.vue';

interface ColorSwatch {
    name: string;
    className: string;
    previewClass: string;
}

interface ColorGroup {
    name: string;
    swatches: ColorSwatch[];
}

const { t } = useI18n();
const localePath = useLocalePath();

usePageMeta({
    title: () => t('designSystemTitle'),
    description: () => t('designSystemMetaDescription'),
});

const { addToast } = useToast();

const isDialogOpen = ref(false);

const formName = ref('');
const formEmail = ref('');
const formMessage = ref('');
const formTopic = ref<'general' | 'support' | 'feedback'>('general');
const formIsConsented = ref(false);

const inputText = ref('');
const inputEmail = ref('');
const inputPassword = ref('');
const inputNumber = ref('');
const inputTel = ref('');
const inputUrl = ref('');
const inputSearch = ref('');

const formDeliveryMethod = ref<'standard' | 'express' | 'pickup'>('standard');
const formNotificationPref = ref<'email' | 'sms' | 'none'>('email');

const navActiveId = ref('dashboard');

const breadcrumbItems = computed<BreadcrumbItem[]>(() => [
    { label: t('navHome'), to: localePath('/') },
    { label: t('designSystemTitle'), to: localePath('/design-system') },
    { label: 'Components' },
]);

const navTreeItems: NavTreeItem[] = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: 'heroicons:home',
    },
    {
        id: 'projects',
        label: 'Projects',
        icon: 'heroicons:folder',
        badge: '5',
        children: [
            {
                id: 'projects-all',
                label: 'All projects',
                icon: 'heroicons:squares-2x2',
            },
            {
                id: 'projects-starred',
                label: 'Starred',
                icon: 'heroicons:star',
                badge: '2',
            },
            {
                id: 'projects-archived',
                label: 'Archived',
                icon: 'heroicons:archive-box',
            },
        ],
    },
    {
        id: 'team',
        label: 'Team',
        icon: 'heroicons:user-group',
        children: [
            {
                id: 'team-members',
                label: 'Members',
                icon: 'heroicons:users',
                children: [
                    {
                        id: 'team-members-active',
                        label: 'Active',
                        icon: 'heroicons:check-circle',
                    },
                    {
                        id: 'team-members-invited',
                        label: 'Invited',
                        icon: 'heroicons:envelope',
                        badge: '3',
                    },
                ],
            },
            {
                id: 'team-roles',
                label: 'Roles & permissions',
                icon: 'heroicons:shield-check',
            },
        ],
    },
    {
        id: 'reports',
        label: 'Reports',
        icon: 'heroicons:chart-bar',
    },
    {
        id: 'settings',
        label: 'Settings',
        icon: 'heroicons:cog-6-tooth',
        children: [
            {
                id: 'settings-general',
                label: 'General',
                icon: 'heroicons:adjustments-horizontal',
            },
            {
                id: 'settings-notifications',
                label: 'Notifications',
                icon: 'heroicons:bell',
            },
            {
                id: 'settings-integrations',
                label: 'Integrations',
                icon: 'heroicons:puzzle-piece',
            },
        ],
    },
];

function handleNavSelect(item: NavTreeItem): void {
    navActiveId.value = item.id;

    addToast({
        title: 'Navigation',
        description: `Wybrano: ${item.label} (${item.id})`,
        variant: 'info',
    });
}

const formControlsSchema = z.object({
    name: z.string().trim().min(1, 'Name is required'),
    email: z
        .string()
        .trim()
        .min(1, 'Email is required')
        .email('Please provide a valid email address'),
    topic: z.enum(['general', 'support', 'feedback']),
    message: z.string().trim().min(1, 'Message is required'),
    isConsented: z.boolean().refine((value) => value === true, {
        message: 'You must accept the terms and privacy policy',
    }),
});

type FormControlsData = z.infer<typeof formControlsSchema>;
type FormControlsErrors = Partial<Record<keyof FormControlsData, string>>;

const formControlsErrors = ref<FormControlsErrors>({});

const formControlsData = computed<FormControlsData>(() => ({
    name: formName.value,
    email: formEmail.value,
    topic: formTopic.value,
    message: formMessage.value,
    isConsented: formIsConsented.value,
}));

const isFormControlsValid = computed(() => {
    const result = formControlsSchema.safeParse(formControlsData.value);

    return result.success;
});

const colorGroups = computed<ColorGroup[]>(() => [
    {
        name: 'Slate',
        swatches: [
            {
                name: 'Background',
                className: 'bg-slate-950',
                previewClass: 'bg-slate-950',
            },
            {
                name: 'Surface',
                className: 'bg-slate-900',
                previewClass: 'bg-slate-900',
            },
            {
                name: 'Border',
                className: 'border-slate-800',
                previewClass: 'bg-slate-950 ring-1 ring-slate-800',
            },
            {
                name: 'Text',
                className: 'text-slate-50',
                previewClass: 'bg-slate-50',
            },
        ],
    },
    {
        name: 'Brand',
        swatches: [
            {
                name: 'Primary',
                className: 'bg-sky-500',
                previewClass: 'bg-sky-500',
            },
            {
                name: 'Primary hover',
                className: 'bg-sky-400',
                previewClass: 'bg-sky-400',
            },
            {
                name: 'Ring',
                className: 'ring-sky-400',
                previewClass: 'bg-slate-950 ring-2 ring-sky-400',
            },
            {
                name: 'Link',
                className: 'text-sky-300',
                previewClass: 'bg-sky-300',
            },
        ],
    },
    {
        name: 'Success',
        swatches: [
            {
                name: 'Border',
                className: 'border-emerald-600/60',
                previewClass: 'bg-emerald-500/80',
            },
            {
                name: 'Text',
                className: 'text-emerald-300',
                previewClass: 'bg-emerald-300',
            },
            {
                name: 'Surface',
                className: 'bg-emerald-950/40',
                previewClass: 'bg-emerald-950/60',
            },
            {
                name: 'Solid',
                className: 'bg-emerald-500',
                previewClass: 'bg-emerald-500',
            },
        ],
    },
    {
        name: 'Warning',
        swatches: [
            {
                name: 'Border',
                className: 'border-amber-600/60',
                previewClass: 'bg-amber-500/80',
            },
            {
                name: 'Text',
                className: 'text-amber-300',
                previewClass: 'bg-amber-300',
            },
            {
                name: 'Surface',
                className: 'bg-amber-950/40',
                previewClass: 'bg-amber-950/60',
            },
            {
                name: 'Solid',
                className: 'bg-amber-500',
                previewClass: 'bg-amber-500',
            },
        ],
    },
    {
        name: 'Danger',
        swatches: [
            {
                name: 'Border',
                className: 'border-rose-600/60',
                previewClass: 'bg-rose-500/80',
            },
            {
                name: 'Text',
                className: 'text-rose-300',
                previewClass: 'bg-rose-300',
            },
            {
                name: 'Surface',
                className: 'bg-rose-950/40',
                previewClass: 'bg-rose-950/60',
            },
            {
                name: 'Solid',
                className: 'bg-rose-600',
                previewClass: 'bg-rose-600',
            },
        ],
    },
]);

async function copyTextToClipboard(text: string): Promise<boolean> {
    if (!text) return false;

    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);

            return true;
        }
    } catch (error) {
        console.error(error);
    }

    try {
        const textarea = document.createElement('textarea');

        textarea.value = text;
        textarea.setAttribute('readonly', 'true');
        textarea.className = 'fixed left-0 top-0 opacity-0 pointer-events-none';
        document.body.appendChild(textarea);
        textarea.select();
        textarea.setSelectionRange(0, textarea.value.length);
        const isCopied = document.execCommand('copy');

        document.body.removeChild(textarea);

        return isCopied;
    } catch {
        return false;
    }
}

interface NavigationMenuItem {
    label: string;
    href?: string;
    children?: NavigationMenuItem[];
}

const navigationMenuItems: NavigationMenuItem[] = [
    {
        label: 'Home',
        href: '/',
    },
    {
        label: 'Products',
        children: [
            { label: 'All Products', href: '/products' },
            {
                label: 'Categories',
                children: [
                    {
                        label: 'Electronics',
                        href: '/products/electronics',
                    },
                    {
                        label: 'Clothing',
                        href: '/products/clothing',
                    },
                    { label: 'Books', href: '/products/books' },
                ],
            },
            { label: 'Featured', href: '/products/featured' },
            { label: 'On Sale', href: '/products/sale' },
        ],
    },
    {
        label: 'Company',
        children: [
            { label: 'About Us', href: '/about' },
            {
                label: 'Team',
                children: [
                    {
                        label: 'Leadership',
                        href: '/team/leadership',
                    },
                    {
                        label: 'Engineering',
                        href: '/team/engineering',
                    },
                    { label: 'Design', href: '/team/design' },
                ],
            },
            { label: 'Careers', href: '/careers' },
            { label: 'Blog', href: '/blog' },
        ],
    },
    {
        label: 'Contact',
        href: '/contact',
    },
];

function handleNavigationSelect(item: NavigationMenuItem) {
    addToast({
        title: 'Nawigacja',
        description: `Przejście do: ${item.label}${item.href ? ` (${item.href})` : ''}`,
        variant: 'info',
    });
}

async function handleCopySwatch(group: ColorGroup, swatch: ColorSwatch) {
    const text = swatch.className;

    const isCopied = await copyTextToClipboard(text);

    if (!isCopied) {
        addToast({
            title: 'Copy failed',
            description: `Could not copy ${group.name} ${swatch.name}.`,
            variant: 'error',
        });

        return;
    }

    addToast({
        title: 'Copied',
        description: `${swatch.name}: ${swatch.className}`,
        variant: 'success',
    });
}

function handleKeyDownCopySwatch(
    event: KeyboardEvent,
    group: ColorGroup,
    swatch: ColorSwatch,
) {
    if (!isEnterOrSpaceKey(event)) return;

    event.preventDefault();
    void handleCopySwatch(group, swatch);
}

function handleToast(variant: ToastVariant) {
    const title =
        variant === 'success'
            ? 'Success'
            : variant === 'warning'
              ? 'Warning'
              : variant === 'error'
                ? 'Error'
                : 'Info';

    addToast({
        title,
        description: 'This is a sample toast.',
        variant,
    });
}

function handleOpenDialog() {
    isDialogOpen.value = true;
}

function handleDialogConfirm() {
    addToast({
        title: 'Confirmed',
        description: 'You confirmed the dialog action.',
        variant: 'success',
    });
}

function handleDialogCancel() {
    addToast({
        title: 'Cancelled',
        description: 'You cancelled the dialog.',
        variant: 'info',
    });
}

function resetFormControlsErrors() {
    formControlsErrors.value = {};
}

function setFormControlsErrorsFromZod(
    result: z.ZodSafeParseError<FormControlsData>,
) {
    resetFormControlsErrors();

    for (const issue of result.error.issues) {
        const fieldKey = issue.path[0];

        if (typeof fieldKey !== 'string') {
            continue;
        }

        const key = fieldKey as keyof FormControlsData;

        if (!formControlsErrors.value[key]) {
            formControlsErrors.value[key] = issue.message;
        }
    }
}

function handleSubmitFormControls(event?: Event) {
    if (event) {
        event.preventDefault();
    }

    const result = formControlsSchema.safeParse(formControlsData.value);

    if (!result.success) {
        setFormControlsErrorsFromZod(result);

        addToast({
            title: 'Form invalid',
            description: 'Please fix the highlighted fields.',
            variant: 'warning',
        });

        return;
    }

    resetFormControlsErrors();

    addToast({
        title: 'Form submitted',
        description: `Preview submitted for ${result.data.name} (${result.data.email}).`,
        variant: 'success',
    });
}
</script>

<template>
    <div class="space-y-8">
        <section class="space-y-2">
            <h1 class="text-3xl font-extrabold tracking-tight">
                Design system
            </h1>
            <p class="max-w-3xl text-slate-700 dark:text-slate-300">
                A single place to preview the Tailwind palette and the UI
                building blocks used in this starter.
            </p>
        </section>

        <section aria-label="Colors" class="space-y-4">
            <div
                class="flex flex-col gap-2 md:flex-row md:items-end md:justify-between"
            >
                <div class="space-y-1">
                    <h2 class="text-xl font-bold tracking-tight">Colors</h2>
                    <p class="text-sm text-slate-600 dark:text-slate-400">
                        These are example tokens based on Tailwind utility
                        classes.
                    </p>
                </div>
            </div>

            <div class="grid gap-4 md:grid-cols-2">
                <Card
                    v-for="group in colorGroups"
                    :key="group.name"
                    :aria-label="`Color group: ${group.name}`"
                >
                    <template #header>
                        <div class="flex items-center justify-between gap-3">
                            <p
                                class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                            >
                                {{ group.name }}
                            </p>
                        </div>
                    </template>

                    <div class="grid gap-3 sm:grid-cols-2">
                        <button
                            v-for="swatch in group.swatches"
                            :key="swatch.name"
                            type="button"
                            tabindex="0"
                            class="group flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/70 p-3 text-left transition hover:border-slate-300 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-slate-800 dark:bg-slate-800/70 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-950"
                            :aria-label="`Copy ${group.name} ${swatch.name}: ${swatch.className}`"
                            @click="handleCopySwatch(group, swatch)"
                            @keydown="
                                handleKeyDownCopySwatch($event, group, swatch)
                            "
                        >
                            <div class="flex min-w-0 items-center gap-3">
                                <div
                                    class="h-10 w-10 flex-none rounded-xl border border-slate-200 dark:border-slate-700"
                                    :class="swatch.previewClass"
                                    :aria-label="`Color preview ${swatch.name}`"
                                    role="img"
                                />
                                <div class="min-w-0">
                                    <p
                                        class="truncate text-sm font-semibold text-slate-900 dark:text-slate-50"
                                    >
                                        {{ swatch.name }}
                                    </p>
                                    <p
                                        class="truncate font-mono text-xs text-slate-600 dark:text-slate-400"
                                    >
                                        {{ swatch.className }}
                                    </p>
                                </div>
                            </div>
                        </button>
                    </div>
                </Card>
            </div>
        </section>

        <section aria-label="Components" class="space-y-4">
            <h2 class="text-xl font-bold tracking-tight">Components</h2>

            <div class="grid gap-4 lg:grid-cols-2">
                <Card aria-label="Card: Actions">
                    <template #header>
                        <p
                            class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                        >
                            Actions
                        </p>
                    </template>

                    <div class="space-y-6">
                        <div class="space-y-3">
                            <p
                                class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                            >
                                Primary
                            </p>
                            <div class="flex flex-wrap gap-3">
                                <Action aria-label="Primary normal"
                                    >Normal</Action
                                >
                                <Action
                                    aria-label="Primary loading"
                                    :is-loading="true"
                                >
                                    Submit
                                </Action>
                                <Action
                                    aria-label="Primary disabled"
                                    :is-disabled="true"
                                >
                                    Disabled
                                </Action>
                            </div>
                        </div>

                        <div class="space-y-3">
                            <p
                                class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                            >
                                Secondary
                            </p>
                            <div class="flex flex-wrap gap-3">
                                <Action
                                    aria-label="Secondary normal"
                                    variant="secondary"
                                >
                                    Normal
                                </Action>
                                <Action
                                    aria-label="Secondary loading"
                                    variant="secondary"
                                    :is-loading="true"
                                >
                                    Save
                                </Action>
                                <Action
                                    aria-label="Secondary disabled"
                                    variant="secondary"
                                    :is-disabled="true"
                                >
                                    Disabled
                                </Action>
                            </div>
                        </div>

                        <div class="space-y-3">
                            <p
                                class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                            >
                                Circle
                            </p>
                            <div class="flex flex-wrap items-center gap-3">
                                <Action
                                    aria-label="Circle primary"
                                    :circle="true"
                                >
                                    <Icon
                                        name="heroicons:plus"
                                        class="size-5"
                                        aria-hidden="true"
                                    />
                                </Action>
                                <Action
                                    aria-label="Circle secondary"
                                    variant="secondary"
                                    :circle="true"
                                >
                                    <Icon
                                        name="heroicons:plus"
                                        class="size-5"
                                        aria-hidden="true"
                                    />
                                </Action>
                                <Action
                                    aria-label="Circle loading"
                                    :circle="true"
                                    :is-loading="true"
                                >
                                    <Icon
                                        name="heroicons:plus"
                                        class="size-5"
                                        aria-hidden="true"
                                    />
                                </Action>
                                <Action
                                    aria-label="Circle disabled"
                                    :circle="true"
                                    :is-disabled="true"
                                >
                                    <Icon
                                        name="heroicons:plus"
                                        class="size-5"
                                        aria-hidden="true"
                                    />
                                </Action>
                                <Action
                                    aria-label="Circle z tekstem"
                                    :circle="true"
                                >
                                    A
                                </Action>
                                <Action
                                    aria-label="Circle z emoji"
                                    variant="secondary"
                                    :circle="true"
                                >
                                    ❤️
                                </Action>
                            </div>
                        </div>

                        <div class="space-y-3">
                            <p
                                class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                            >
                                Different tags
                            </p>
                            <div class="flex flex-wrap gap-3">
                                <Action
                                    aria-label="Action as button"
                                    tag="button"
                                >
                                    Button
                                </Action>
                                <Action
                                    aria-label="Action as link"
                                    tag="a"
                                    href="#"
                                    variant="secondary"
                                >
                                    Link
                                </Action>
                                <Action
                                    aria-label="Action as div"
                                    tag="div"
                                    variant="secondary"
                                >
                                    Div
                                </Action>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card aria-label="Card: Form controls">
                    <template #header>
                        <p
                            class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                        >
                            Form controls
                        </p>
                    </template>

                    <div class="space-y-6">
                        <section
                            aria-label="Input types preview"
                            class="space-y-3"
                        >
                            <p
                                class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                            >
                                Input types
                            </p>
                            <div class="grid gap-4 md:grid-cols-2">
                                <div class="space-y-2">
                                    <label
                                        class="block text-xs font-medium tracking-wide text-slate-600 uppercase dark:text-slate-400"
                                        for="inputTextDemo"
                                    >
                                        Text
                                    </label>
                                    <Input
                                        id="inputTextDemo"
                                        v-model="inputText"
                                        type="text"
                                        placeholder="Text input"
                                        aria-label="Text input example"
                                    />
                                </div>

                                <div class="space-y-2">
                                    <label
                                        class="block text-xs font-medium tracking-wide text-slate-600 uppercase dark:text-slate-400"
                                        for="inputEmailDemo"
                                    >
                                        Email
                                    </label>
                                    <Input
                                        id="inputEmailDemo"
                                        v-model="inputEmail"
                                        type="email"
                                        placeholder="name@example.com"
                                        aria-label="Email input example"
                                    />
                                </div>

                                <div class="space-y-2">
                                    <label
                                        class="block text-xs font-medium tracking-wide text-slate-600 uppercase dark:text-slate-400"
                                        for="inputPasswordDemo"
                                    >
                                        Password
                                    </label>
                                    <Input
                                        id="inputPasswordDemo"
                                        v-model="inputPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        aria-label="Password input example"
                                    />
                                </div>

                                <div class="space-y-2">
                                    <label
                                        class="block text-xs font-medium tracking-wide text-slate-600 uppercase dark:text-slate-400"
                                        for="inputNumberDemo"
                                    >
                                        Number
                                    </label>
                                    <Input
                                        id="inputNumberDemo"
                                        v-model="inputNumber"
                                        type="number"
                                        placeholder="123"
                                        aria-label="Number input example"
                                    />
                                </div>

                                <div class="space-y-2">
                                    <label
                                        class="block text-xs font-medium tracking-wide text-slate-600 uppercase dark:text-slate-400"
                                        for="inputTelDemo"
                                    >
                                        Tel
                                    </label>
                                    <Input
                                        id="inputTelDemo"
                                        v-model="inputTel"
                                        type="tel"
                                        placeholder="+48 123 456 789"
                                        aria-label="Telephone input example"
                                    />
                                </div>

                                <div class="space-y-2">
                                    <label
                                        class="block text-xs font-medium tracking-wide text-slate-600 uppercase dark:text-slate-400"
                                        for="inputUrlDemo"
                                    >
                                        URL
                                    </label>
                                    <Input
                                        id="inputUrlDemo"
                                        v-model="inputUrl"
                                        type="url"
                                        placeholder="https://example.com"
                                        aria-label="URL input example"
                                    />
                                </div>

                                <div class="space-y-2 md:col-span-2">
                                    <label
                                        class="block text-xs font-medium tracking-wide text-slate-600 uppercase dark:text-slate-400"
                                        for="inputSearchDemo"
                                    >
                                        Search
                                    </label>
                                    <Input
                                        id="inputSearchDemo"
                                        v-model="inputSearch"
                                        type="search"
                                        placeholder="Search..."
                                        aria-label="Search input example"
                                    />
                                </div>
                            </div>
                        </section>

                        <section
                            aria-label="Radio and RadioGroup preview"
                            class="space-y-4"
                        >
                            <p
                                class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                            >
                                Radio & RadioGroup
                            </p>
                            <div class="grid gap-6 md:grid-cols-2">
                                <div class="space-y-2">
                                    <label
                                        class="block text-xs font-medium tracking-wide text-slate-600 uppercase dark:text-slate-400"
                                    >
                                        Delivery method (RadioGroup)
                                    </label>
                                    <RadioGroup
                                        v-model="formDeliveryMethod"
                                        aria-label="Select delivery method"
                                        orientation="vertical"
                                    >
                                        <Radio
                                            value="standard"
                                            aria-label="Standard delivery"
                                        >
                                            Standard (3–5 days)
                                        </Radio>
                                        <Radio
                                            value="express"
                                            aria-label="Express delivery"
                                        >
                                            Express (1–2 days)
                                        </Radio>
                                        <Radio
                                            value="pickup"
                                            aria-label="Store pickup"
                                        >
                                            Store pickup
                                        </Radio>
                                    </RadioGroup>
                                </div>
                                <div class="space-y-2">
                                    <label
                                        class="block text-xs font-medium tracking-wide text-slate-600 uppercase dark:text-slate-400"
                                    >
                                        Notification preference (horizontal)
                                    </label>
                                    <RadioGroup
                                        v-model="formNotificationPref"
                                        aria-label="Select notification preference"
                                        orientation="horizontal"
                                    >
                                        <Radio
                                            value="email"
                                            aria-label="Email notifications"
                                        >
                                            Email
                                        </Radio>
                                        <Radio
                                            value="sms"
                                            aria-label="SMS notifications"
                                        >
                                            SMS
                                        </Radio>
                                        <Radio
                                            value="none"
                                            aria-label="No notifications"
                                            :is-disabled="true"
                                        >
                                            None (disabled)
                                        </Radio>
                                    </RadioGroup>
                                </div>
                            </div>
                        </section>

                        <section
                            aria-label="Select, textarea and checkbox preview"
                            class="space-y-4"
                        >
                            <p
                                class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                            >
                                Select, textarea & checkbox
                            </p>

                            <form
                                class="space-y-4"
                                aria-label="Sample form controls preview"
                                @submit.prevent="handleSubmitFormControls"
                            >
                                <div class="space-y-2">
                                    <label
                                        class="block text-sm font-medium text-slate-700 dark:text-slate-300"
                                        for="formNameInput"
                                    >
                                        Name
                                    </label>
                                    <Input
                                        id="formNameInput"
                                        v-model="formName"
                                        type="text"
                                        placeholder="e.g. John Doe"
                                        aria-label="Enter name"
                                    />
                                    <p
                                        v-if="formControlsErrors.name"
                                        class="text-xs text-rose-500 dark:text-rose-400"
                                    >
                                        {{ formControlsErrors.name }}
                                    </p>
                                </div>

                                <div class="space-y-2">
                                    <label
                                        class="block text-sm font-medium text-slate-700 dark:text-slate-300"
                                        for="formEmailInput"
                                    >
                                        Email
                                    </label>
                                    <Input
                                        id="formEmailInput"
                                        v-model="formEmail"
                                        type="email"
                                        placeholder="e.g. john@example.com"
                                        aria-label="Enter email"
                                    />
                                    <p
                                        v-if="formControlsErrors.email"
                                        class="text-xs text-rose-500 dark:text-rose-400"
                                    >
                                        {{ formControlsErrors.email }}
                                    </p>
                                </div>

                                <div class="space-y-2">
                                    <label
                                        class="block text-sm font-medium text-slate-700 dark:text-slate-300"
                                        for="formTopicSelect"
                                    >
                                        Topic (select)
                                    </label>
                                    <select
                                        id="formTopicSelect"
                                        v-model="formTopic"
                                        class="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:ring-offset-slate-950"
                                        aria-label="Select topic"
                                    >
                                        <option value="general">
                                            General question
                                        </option>
                                        <option value="support">Support</option>
                                        <option value="feedback">
                                            Feedback
                                        </option>
                                    </select>
                                    <p
                                        v-if="formControlsErrors.topic"
                                        class="text-xs text-rose-500 dark:text-rose-400"
                                    >
                                        {{ formControlsErrors.topic }}
                                    </p>
                                </div>

                                <div class="space-y-2">
                                    <label
                                        class="block text-sm font-medium text-slate-700 dark:text-slate-300"
                                        for="formMessageTextarea"
                                    >
                                        Message (textarea)
                                    </label>
                                    <textarea
                                        id="formMessageTextarea"
                                        v-model="formMessage"
                                        rows="4"
                                        class="block w-full resize-none rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:ring-offset-slate-950"
                                        placeholder="Write your message..."
                                        aria-label="Enter message"
                                    />
                                    <p
                                        v-if="formControlsErrors.message"
                                        class="text-xs text-rose-500 dark:text-rose-400"
                                    >
                                        {{ formControlsErrors.message }}
                                    </p>
                                </div>

                                <div class="flex items-start gap-2">
                                    <label
                                        class="inline-flex cursor-pointer items-start gap-2"
                                        for="formConsentCheckbox"
                                    >
                                        <input
                                            id="formConsentCheckbox"
                                            v-model="formIsConsented"
                                            type="checkbox"
                                            class="mt-0.5 h-4 w-4 rounded border-slate-300 text-sky-500 shadow-sm focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-white focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:ring-offset-slate-950"
                                            aria-label="Accept terms and privacy policy"
                                        />
                                        <span
                                            class="text-sm text-slate-700 dark:text-slate-300"
                                        >
                                            I accept the terms and privacy
                                            policy.
                                        </span>
                                    </label>
                                </div>

                                <p
                                    v-if="formControlsErrors.isConsented"
                                    class="text-xs text-rose-500 dark:text-rose-400"
                                >
                                    {{ formControlsErrors.isConsented }}
                                </p>

                                <div class="flex items-center gap-3">
                                    <Action
                                        type="submit"
                                        aria-label="Submit form preview"
                                        :is-disabled="!isFormControlsValid"
                                    >
                                        Submit
                                    </Action>
                                    <p
                                        class="text-xs text-slate-500 dark:text-slate-400"
                                    >
                                        This is only a preview – data is not
                                        sent.
                                    </p>
                                </div>
                            </form>
                        </section>
                    </div>
                </Card>

                <Card aria-label="Card: Toasts">
                    <template #header>
                        <p
                            class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                        >
                            Toasts
                        </p>
                    </template>

                    <p class="text-sm text-slate-600 dark:text-slate-400">
                        Toasts render in the top-right via
                        <code
                            class="font-mono text-slate-900 dark:text-slate-50"
                            >ToastStack</code
                        >.
                    </p>

                    <div class="mt-4 flex flex-wrap gap-2">
                        <Action
                            aria-label="Show success toast"
                            @click="handleToast('success')"
                        >
                            Success
                        </Action>
                        <Action
                            aria-label="Show info toast"
                            variant="secondary"
                            @click="handleToast('info')"
                        >
                            Info
                        </Action>
                        <Action
                            aria-label="Show warning toast"
                            variant="secondary"
                            @click="handleToast('warning')"
                        >
                            Warning
                        </Action>
                        <Action
                            aria-label="Show error toast"
                            variant="secondary"
                            @click="handleToast('error')"
                        >
                            Error
                        </Action>
                    </div>
                </Card>

                <Card aria-label="Card: Dialog">
                    <template #header>
                        <p
                            class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                        >
                            Dialog
                        </p>
                    </template>

                    <p class="text-sm text-slate-600 dark:text-slate-400">
                        Demo of
                        <code
                            class="font-mono text-slate-900 dark:text-slate-50"
                            >Dialog</code
                        >
                        (native
                        <code
                            class="font-mono text-slate-900 dark:text-slate-50"
                            >&lt;dialog&gt;</code
                        >
                        + Teleport).
                    </p>

                    <div class="mt-4 flex flex-wrap gap-2">
                        <Action
                            aria-label="Open dialog"
                            @click="handleOpenDialog"
                        >
                            Open dialog
                        </Action>
                    </div>
                </Card>

                <Card aria-label="Card: Cards">
                    <template #header>
                        <p
                            class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                        >
                            Cards
                        </p>
                    </template>

                    <Card aria-label="Nested card preview">
                        <template #header>
                            <p
                                class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                            >
                                Nested example
                            </p>
                        </template>
                        <p class="text-sm text-slate-600 dark:text-slate-400">
                            Cards are great for grouping content and actions.
                        </p>
                        <template #footer>
                            <div class="flex flex-wrap gap-2">
                                <Action
                                    aria-label="Card primary action"
                                    @click="handleToast('info')"
                                >
                                    Action
                                </Action>
                                <Action
                                    aria-label="Card secondary action"
                                    variant="secondary"
                                    @click="handleToast('success')"
                                >
                                    Secondary
                                </Action>
                            </div>
                        </template>
                    </Card>
                </Card>

                <Card aria-label="Card: Breadcrumbs">
                    <template #header>
                        <p
                            class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                        >
                            Breadcrumbs
                        </p>
                    </template>

                    <div class="space-y-6">
                        <div class="space-y-3">
                            <p
                                class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                            >
                                Example
                            </p>
                            <Breadcrumbs
                                :items="breadcrumbItems"
                                aria-label="Breadcrumb"
                            />
                        </div>
                    </div>
                </Card>

                <Card aria-label="Card: Badge">
                    <template #header>
                        <p
                            class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                        >
                            Badge
                        </p>
                    </template>

                    <div class="space-y-6">
                        <div class="space-y-3">
                            <p
                                class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                            >
                                Variants
                            </p>
                            <div class="flex flex-wrap items-center gap-3">
                                <Badge variant="primary">Primary</Badge>
                                <Badge variant="secondary">Secondary</Badge>
                                <Badge variant="success">Success</Badge>
                                <Badge variant="warning">Warning</Badge>
                                <Badge variant="danger">Danger</Badge>
                                <Badge variant="info">Info</Badge>
                            </div>
                        </div>

                        <div class="space-y-3">
                            <p
                                class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                            >
                                Sizes
                            </p>
                            <div class="flex flex-wrap items-center gap-3">
                                <Badge size="sm" variant="primary">Small</Badge>
                                <Badge size="md" variant="primary"
                                    >Medium</Badge
                                >
                                <Badge size="lg" variant="primary">Large</Badge>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card aria-label="Card: Skeleton">
                    <template #header>
                        <p
                            class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                        >
                            Skeleton
                        </p>
                    </template>

                    <div class="space-y-6">
                        <div class="space-y-3">
                            <p
                                class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                            >
                                Variants
                            </p>
                            <div class="space-y-2">
                                <Skeleton variant="pulse" />
                                <Skeleton variant="wave" />
                                <Skeleton variant="default" />
                            </div>
                        </div>

                        <div class="space-y-3">
                            <p
                                class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                            >
                                Different shapes
                            </p>
                            <div class="space-y-2">
                                <Skeleton
                                    rounded="none"
                                    width="100%"
                                    height="1rem"
                                />
                                <Skeleton
                                    rounded="sm"
                                    width="80%"
                                    height="1rem"
                                />
                                <Skeleton
                                    rounded="md"
                                    width="60%"
                                    height="1rem"
                                />
                                <Skeleton
                                    rounded="lg"
                                    width="40%"
                                    height="1rem"
                                />
                                <Skeleton
                                    rounded="full"
                                    width="2rem"
                                    height="2rem"
                                />
                            </div>
                        </div>

                        <div class="space-y-3">
                            <p
                                class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                            >
                                Card example
                            </p>
                            <div
                                class="space-y-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
                            >
                                <div class="flex items-center gap-3">
                                    <Skeleton
                                        rounded="full"
                                        width="3rem"
                                        height="3rem"
                                    />
                                    <div class="flex-1 space-y-2">
                                        <Skeleton width="60%" height="1rem" />
                                        <Skeleton
                                            width="40%"
                                            height="0.875rem"
                                        />
                                    </div>
                                </div>
                                <Skeleton width="100%" height="1rem" />
                                <Skeleton width="90%" height="1rem" />
                            </div>
                        </div>
                    </div>
                </Card>

                <Card aria-label="Card: Spinner">
                    <template #header>
                        <p
                            class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                        >
                            Spinner
                        </p>
                    </template>

                    <div class="space-y-6">
                        <div class="space-y-3">
                            <p
                                class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                            >
                                Sizes
                            </p>
                            <div class="flex flex-wrap items-center gap-6">
                                <div class="flex flex-col items-center gap-2">
                                    <Spinner size="sm" />
                                    <span
                                        class="text-xs text-slate-600 dark:text-slate-400"
                                        >Small</span
                                    >
                                </div>
                                <div class="flex flex-col items-center gap-2">
                                    <Spinner size="md" />
                                    <span
                                        class="text-xs text-slate-600 dark:text-slate-400"
                                        >Medium</span
                                    >
                                </div>
                                <div class="flex flex-col items-center gap-2">
                                    <Spinner size="lg" />
                                    <span
                                        class="text-xs text-slate-600 dark:text-slate-400"
                                        >Large</span
                                    >
                                </div>
                                <div class="flex flex-col items-center gap-2">
                                    <Spinner size="xl" />
                                    <span
                                        class="text-xs text-slate-600 dark:text-slate-400"
                                        >Extra large</span
                                    >
                                </div>
                            </div>
                        </div>

                        <div class="space-y-3">
                            <p
                                class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                            >
                                Variants
                            </p>
                            <div class="flex flex-wrap items-center gap-6">
                                <div class="flex flex-col items-center gap-2">
                                    <Spinner variant="primary" />
                                    <span
                                        class="text-xs text-slate-600 dark:text-slate-400"
                                        >Primary</span
                                    >
                                </div>
                                <div class="flex flex-col items-center gap-2">
                                    <Spinner variant="secondary" />
                                    <span
                                        class="text-xs text-slate-600 dark:text-slate-400"
                                        >Secondary</span
                                    >
                                </div>
                                <div class="flex flex-col items-center gap-2">
                                    <div
                                        class="rounded-lg bg-slate-900 p-3 dark:bg-slate-50"
                                    >
                                        <Spinner variant="white" />
                                    </div>
                                    <span
                                        class="text-xs text-slate-600 dark:text-slate-400"
                                        >White</span
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card aria-label="Card: Navigation">
                    <template #header>
                        <p
                            class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                        >
                            Navigation (NavTree)
                        </p>
                    </template>

                    <div class="space-y-6">
                        <p class="text-sm text-slate-600 dark:text-slate-400">
                            Recursive, collapsible tree navigation following the
                            <a
                                href="https://www.w3.org/WAI/ARIA/apg/patterns/treeview/"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="font-medium text-sky-500 underline hover:text-sky-400"
                                aria-label="WAI-ARIA Tree View Pattern (opens in new tab)"
                            >
                                WAI-ARIA Tree View Pattern</a
                            >. Supports nested items, icons, badges, roving
                            tabindex, and full keyboard navigation. Tab focus
                            never enters collapsed sections.
                        </p>

                        <div class="space-y-3">
                            <p
                                class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                            >
                                Expanded by default
                            </p>
                            <div
                                class="rounded-xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-800/50"
                            >
                                <NavTree
                                    :items="navTreeItems"
                                    :active-id="navActiveId"
                                    :default-expanded-ids="[
                                        'projects',
                                        'team',
                                        'team-members',
                                    ]"
                                    @select="handleNavSelect"
                                />
                            </div>
                        </div>

                        <div class="space-y-3">
                            <p
                                class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                            >
                                All collapsed
                            </p>
                            <div
                                class="rounded-xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-800/50"
                            >
                                <NavTree
                                    :items="navTreeItems"
                                    :active-id="navActiveId"
                                    @select="handleNavSelect"
                                />
                            </div>
                        </div>

                        <div class="space-y-2">
                            <p
                                class="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400"
                            >
                                Keyboard shortcuts
                            </p>
                            <div
                                class="grid gap-x-6 gap-y-1.5 text-xs text-slate-600 sm:grid-cols-2 dark:text-slate-400"
                            >
                                <div class="flex items-center gap-2">
                                    <kbd
                                        class="rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] dark:border-slate-600 dark:bg-slate-800"
                                        >↓</kbd
                                    >
                                    <kbd
                                        class="rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] dark:border-slate-600 dark:bg-slate-800"
                                        >↑</kbd
                                    >
                                    Next / previous item
                                </div>
                                <div class="flex items-center gap-2">
                                    <kbd
                                        class="rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] dark:border-slate-600 dark:bg-slate-800"
                                        >→</kbd
                                    >
                                    Expand / focus first child
                                </div>
                                <div class="flex items-center gap-2">
                                    <kbd
                                        class="rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] dark:border-slate-600 dark:bg-slate-800"
                                        >←</kbd
                                    >
                                    Collapse / focus parent
                                </div>
                                <div class="flex items-center gap-2">
                                    <kbd
                                        class="rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] dark:border-slate-600 dark:bg-slate-800"
                                        >Enter</kbd
                                    >
                                    <kbd
                                        class="rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] dark:border-slate-600 dark:bg-slate-800"
                                        >Space</kbd
                                    >
                                    Activate / toggle expand
                                </div>
                                <div class="flex items-center gap-2">
                                    <kbd
                                        class="rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] dark:border-slate-600 dark:bg-slate-800"
                                        >Home</kbd
                                    >
                                    <kbd
                                        class="rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] dark:border-slate-600 dark:bg-slate-800"
                                        >End</kbd
                                    >
                                    First / last item
                                </div>
                                <div class="flex items-center gap-2">
                                    <kbd
                                        class="rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] dark:border-slate-600 dark:bg-slate-800"
                                        >A–Z</kbd
                                    >
                                    Jump to item by first letter
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card
                    class="lg:col-span-2"
                    aria-label="Card: Navigation Menubar"
                >
                    <template #header>
                        <p
                            class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                        >
                            Navigation Menubar
                        </p>
                    </template>

                    <div class="space-y-4">
                        <p class="text-sm text-slate-600 dark:text-slate-400">
                            Fully accessible menubar navigation following the
                            <a
                                href="https://www.w3.org/WAI/ARIA/apg/patterns/menubar/"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="font-medium text-sky-500 underline hover:text-sky-400"
                                aria-label="WAI-ARIA Menubar Pattern (opens in new tab)"
                            >
                                WAI-ARIA Menubar Pattern</a
                            >. Supports nested submenus, roving tabindex, and
                            full keyboard navigation (Arrow keys, Home, End,
                            Escape, Enter, Space, character search).
                        </p>

                        <NavigationMenubar
                            :items="navigationMenuItems"
                            aria-label="Demo navigation menubar"
                            @select="handleNavigationSelect"
                        />

                        <div class="space-y-2">
                            <p
                                class="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400"
                            >
                                Keyboard shortcuts
                            </p>
                            <div
                                class="grid gap-x-6 gap-y-1.5 text-xs text-slate-600 sm:grid-cols-2 dark:text-slate-400"
                            >
                                <div class="flex items-center gap-2">
                                    <kbd
                                        class="rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] dark:border-slate-600 dark:bg-slate-800"
                                        >←</kbd
                                    >
                                    <kbd
                                        class="rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] dark:border-slate-600 dark:bg-slate-800"
                                        >→</kbd
                                    >
                                    Navigate between menubar items
                                </div>
                                <div class="flex items-center gap-2">
                                    <kbd
                                        class="rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] dark:border-slate-600 dark:bg-slate-800"
                                        >↓</kbd
                                    >
                                    <kbd
                                        class="rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] dark:border-slate-600 dark:bg-slate-800"
                                        >↑</kbd
                                    >
                                    Open submenu / navigate items
                                </div>
                                <div class="flex items-center gap-2">
                                    <kbd
                                        class="rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] dark:border-slate-600 dark:bg-slate-800"
                                        >Enter</kbd
                                    >
                                    <kbd
                                        class="rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] dark:border-slate-600 dark:bg-slate-800"
                                        >Space</kbd
                                    >
                                    Activate item / toggle submenu
                                </div>
                                <div class="flex items-center gap-2">
                                    <kbd
                                        class="rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] dark:border-slate-600 dark:bg-slate-800"
                                        >Esc</kbd
                                    >
                                    Close submenu
                                </div>
                                <div class="flex items-center gap-2">
                                    <kbd
                                        class="rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] dark:border-slate-600 dark:bg-slate-800"
                                        >Home</kbd
                                    >
                                    <kbd
                                        class="rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] dark:border-slate-600 dark:bg-slate-800"
                                        >End</kbd
                                    >
                                    First / last item
                                </div>
                                <div class="flex items-center gap-2">
                                    <kbd
                                        class="rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] dark:border-slate-600 dark:bg-slate-800"
                                        >A–Z</kbd
                                    >
                                    Jump to item by first letter
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card class="lg:col-span-2" aria-label="Card: Slider">
                    <template #header>
                        <p
                            class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                        >
                            Slider
                        </p>
                    </template>

                    <div class="space-y-8">
                        <div class="space-y-3">
                            <p
                                class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                            >
                                Basic (single slide)
                            </p>
                            <Slider
                                :options="{ loop: true }"
                                :show-dots="true"
                                aria-label="Basic carousel"
                            >
                                <div
                                    v-for="n in 5"
                                    :key="`basic-${n}`"
                                    role="listitem"
                                    aria-roledescription="slide"
                                    :aria-label="`Slajd ${n} z 5`"
                                    class="flex min-w-0 flex-[0_0_100%] items-center justify-center rounded-xl bg-linear-to-br from-sky-500 to-indigo-600 p-12 text-2xl font-bold text-white select-none"
                                >
                                    Slide {{ n }}
                                </div>
                            </Slider>
                        </div>

                        <div class="space-y-3">
                            <p
                                class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                            >
                                Multi-slide (3 per view)
                            </p>
                            <Slider
                                :options="{
                                    loop: false,
                                    align: 'start',
                                    slidesToScroll: 1,
                                }"
                                :show-dots="true"
                                variant="compact"
                                slide-class="gap-4"
                                aria-label="Multi slide carousel"
                            >
                                <div
                                    v-for="n in 8"
                                    :key="`multi-${n}`"
                                    role="listitem"
                                    aria-roledescription="slide"
                                    :aria-label="`Karta ${n} z 8`"
                                    class="flex min-w-0 flex-[0_0_calc(33.333%-11px)] items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-8 text-lg font-semibold text-slate-700 select-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                >
                                    Card {{ n }}
                                </div>
                            </Slider>
                        </div>

                        <div class="space-y-3">
                            <p
                                class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                            >
                                Variable widths
                            </p>
                            <Slider
                                :options="{
                                    loop: true,
                                    align: 'center',
                                    dragFree: true,
                                }"
                                :show-arrows="true"
                                :show-dots="false"
                                slide-class="gap-3"
                                aria-label="Variable width carousel"
                            >
                                <div
                                    v-for="(item, index) in [
                                        {
                                            w: 'flex-[0_0_40%]',
                                            color: 'from-rose-500 to-pink-600',
                                            label: 'Wide',
                                        },
                                        {
                                            w: 'flex-[0_0_25%]',
                                            color: 'from-amber-400 to-orange-500',
                                            label: 'Narrow',
                                        },
                                        {
                                            w: 'flex-[0_0_35%]',
                                            color: 'from-emerald-500 to-teal-600',
                                            label: 'Medium',
                                        },
                                        {
                                            w: 'flex-[0_0_20%]',
                                            color: 'from-violet-500 to-purple-600',
                                            label: 'Small',
                                        },
                                        {
                                            w: 'flex-[0_0_45%]',
                                            color: 'from-cyan-500 to-blue-600',
                                            label: 'Extra wide',
                                        },
                                        {
                                            w: 'flex-[0_0_30%]',
                                            color: 'from-fuchsia-500 to-pink-500',
                                            label: 'Regular',
                                        },
                                    ]"
                                    :key="`var-${index}`"
                                    role="listitem"
                                    aria-roledescription="slide"
                                    :aria-label="`${item.label} — slajd ${index + 1} z 6`"
                                    :class="[
                                        item.w,
                                        'flex min-w-0 items-center justify-center rounded-xl bg-linear-to-br p-6 text-sm font-semibold text-white select-none',
                                        item.color,
                                    ]"
                                >
                                    {{ item.label }}
                                </div>
                            </Slider>
                        </div>

                        <div class="space-y-3">
                            <p
                                class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                            >
                                Testimonials (no arrows, dots only)
                            </p>
                            <Slider
                                :options="{ loop: true }"
                                :show-arrows="false"
                                :show-dots="true"
                                aria-label="Testimonials carousel"
                            >
                                <div
                                    v-for="(testimonial, index) in [
                                        {
                                            text: 'This starter kit saved me days of setup. Everything just works out of the box!',
                                            author: 'Anna K.',
                                            role: 'Frontend developer',
                                        },
                                        {
                                            text: 'The design system is clean and well-organized. A great foundation for any project.',
                                            author: 'Marek P.',
                                            role: 'Tech lead',
                                        },
                                        {
                                            text: 'Beautiful defaults and very easy to customize. Highly recommended!',
                                            author: 'Julia W.',
                                            role: 'UI designer',
                                        },
                                    ]"
                                    :key="`test-${index}`"
                                    role="listitem"
                                    aria-roledescription="slide"
                                    :aria-label="`Opinia ${testimonial.author} — slajd ${index + 1} z 3`"
                                    class="flex min-w-0 flex-[0_0_100%] flex-col items-center justify-center gap-4 rounded-xl border border-slate-200 bg-slate-50 px-8 py-10 text-center select-none dark:border-slate-700 dark:bg-slate-800"
                                >
                                    <p
                                        class="max-w-xl text-lg leading-relaxed text-slate-700 italic dark:text-slate-300"
                                    >
                                        "{{ testimonial.text }}"
                                    </p>
                                    <div>
                                        <p
                                            class="font-semibold text-slate-900 dark:text-slate-50"
                                        >
                                            {{ testimonial.author }}
                                        </p>
                                        <p
                                            class="text-sm text-slate-500 dark:text-slate-400"
                                        >
                                            {{ testimonial.role }}
                                        </p>
                                    </div>
                                </div>
                            </Slider>
                        </div>

                        <div class="space-y-3">
                            <p
                                class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                            >
                                Autoplay (loop + progress bar)
                            </p>
                            <Slider
                                :options="{ loop: true }"
                                :plugins="[
                                    Autoplay({
                                        delay: 3000,
                                        stopOnInteraction: false,
                                        stopOnMouseEnter: true,
                                    }),
                                ]"
                                :show-arrows="true"
                                :show-dots="true"
                                aria-label="Autoplay carousel"
                            >
                                <div
                                    v-for="(slide, index) in [
                                        {
                                            title: 'Performance',
                                            description:
                                                'Lightweight core with zero dependencies.',
                                            icon: 'heroicons:bolt',
                                            gradient:
                                                'from-amber-500 to-orange-600',
                                        },
                                        {
                                            title: 'Accessible',
                                            description:
                                                'Keyboard navigation and screen reader support.',
                                            icon: 'heroicons:eye',
                                            gradient:
                                                'from-emerald-500 to-teal-600',
                                        },
                                        {
                                            title: 'Responsive',
                                            description:
                                                'Works great on any screen size and device.',
                                            icon: 'heroicons:device-phone-mobile',
                                            gradient:
                                                'from-violet-500 to-purple-600',
                                        },
                                        {
                                            title: 'Extensible',
                                            description:
                                                'Rich plugin system for autoplay, fade, and more.',
                                            icon: 'heroicons:puzzle-piece',
                                            gradient:
                                                'from-sky-500 to-indigo-600',
                                        },
                                    ]"
                                    :key="`auto-${index}`"
                                    role="listitem"
                                    aria-roledescription="slide"
                                    :aria-label="`${slide.title} — slajd ${index + 1} z 4`"
                                    class="flex min-w-0 flex-[0_0_100%] flex-col items-center justify-center gap-4 rounded-xl bg-linear-to-br p-12 text-center text-white select-none"
                                    :class="slide.gradient"
                                >
                                    <Icon
                                        :name="slide.icon"
                                        class="size-12 opacity-90"
                                        aria-hidden="true"
                                    />
                                    <p class="text-2xl font-bold">
                                        {{ slide.title }}
                                    </p>
                                    <p class="max-w-md text-base text-white/80">
                                        {{ slide.description }}
                                    </p>
                                </div>
                            </Slider>
                        </div>
                    </div>
                </Card>

                <Card aria-label="Card: Loader">
                    <template #header>
                        <p
                            class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                        >
                            Loader
                        </p>
                    </template>

                    <div class="space-y-6">
                        <p class="text-sm text-slate-600 dark:text-slate-400">
                            Advanced loader with SVG animations, ideal for
                            displaying during module loading or larger sections
                            of the application.
                        </p>

                        <div class="space-y-3">
                            <p
                                class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                            >
                                Animation variants
                            </p>
                            <div class="grid grid-cols-2 gap-6 md:grid-cols-3">
                                <div class="flex flex-col items-center gap-2">
                                    <Loader variant="circles" size="md" />
                                    <span
                                        class="text-xs text-slate-600 dark:text-slate-400"
                                        >Circles</span
                                    >
                                </div>
                                <div class="flex flex-col items-center gap-2">
                                    <Loader variant="pulse" size="md" />
                                    <span
                                        class="text-xs text-slate-600 dark:text-slate-400"
                                        >Pulse</span
                                    >
                                </div>
                                <div class="flex flex-col items-center gap-2">
                                    <Loader variant="dots" size="md" />
                                    <span
                                        class="text-xs text-slate-600 dark:text-slate-400"
                                        >Dots</span
                                    >
                                </div>
                                <div class="flex flex-col items-center gap-2">
                                    <Loader variant="wave" size="md" />
                                    <span
                                        class="text-xs text-slate-600 dark:text-slate-400"
                                        >Wave</span
                                    >
                                </div>
                                <div class="flex flex-col items-center gap-2">
                                    <Loader variant="orbit" size="md" />
                                    <span
                                        class="text-xs text-slate-600 dark:text-slate-400"
                                        >Orbit</span
                                    >
                                </div>
                                <div class="flex flex-col items-center gap-2">
                                    <Loader variant="spinner" size="md" />
                                    <span
                                        class="text-xs text-slate-600 dark:text-slate-400"
                                        >Spinner</span
                                    >
                                </div>
                            </div>
                        </div>

                        <div class="space-y-3">
                            <p
                                class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                            >
                                Sizes
                            </p>
                            <div class="flex flex-wrap items-center gap-6">
                                <div class="flex flex-col items-center gap-2">
                                    <Loader variant="circles" size="sm" />
                                    <span
                                        class="text-xs text-slate-600 dark:text-slate-400"
                                        >Small</span
                                    >
                                </div>
                                <div class="flex flex-col items-center gap-2">
                                    <Loader variant="circles" size="md" />
                                    <span
                                        class="text-xs text-slate-600 dark:text-slate-400"
                                        >Medium</span
                                    >
                                </div>
                                <div class="flex flex-col items-center gap-2">
                                    <Loader variant="circles" size="lg" />
                                    <span
                                        class="text-xs text-slate-600 dark:text-slate-400"
                                        >Large</span
                                    >
                                </div>
                                <div class="flex flex-col items-center gap-2">
                                    <Loader variant="circles" size="xl" />
                                    <span
                                        class="text-xs text-slate-600 dark:text-slate-400"
                                        >Extra large</span
                                    >
                                </div>
                            </div>
                        </div>

                        <div class="space-y-3">
                            <p
                                class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                            >
                                Z tekstem
                            </p>
                            <div class="flex flex-col items-center gap-4">
                                <Loader
                                    variant="circles"
                                    size="lg"
                                    text="Loading data..."
                                />
                                <Loader
                                    variant="pulse"
                                    size="md"
                                    text="Please wait..."
                                />
                            </div>
                        </div>

                        <div class="space-y-3">
                            <p
                                class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                            >
                                Usage example in section
                            </p>
                            <div
                                class="relative min-h-[200px] rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                            >
                                <Loader
                                    variant="orbit"
                                    size="lg"
                                    text="Loading module..."
                                    :centered="true"
                                />
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </section>

        <Dialog
            v-model:open="isDialogOpen"
            cancel-text="Cancel"
            confirm-text="Confirm"
            message="This is a demo dialog. Press Escape or click outside to close."
            title="Confirm action"
            @cancel="handleDialogCancel"
            @confirm="handleDialogConfirm"
        />
    </div>
</template>
