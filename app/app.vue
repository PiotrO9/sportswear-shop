<script setup lang="ts">
useSeoMeta({
    description:
        'Frontend starter template z Nuxt 4, Vue 3, TypeScript i TailwindCSS',
    ogType: 'website',
});

useHead(() => ({
    bodyAttrs: {
        class: 'relative',
    },
    link: [
        {
            rel: 'icon',
            type: 'image/x-icon',
            href: '/favicon.ico',
        },
        {
            rel: 'preconnect',
            href: 'https://fonts.googleapis.com',
        },
        {
            rel: 'preconnect',
            href: 'https://fonts.gstatic.com',
            crossorigin: 'anonymous',
        },
        {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=Anton&display=swap',
        },
    ],
}));
</script>

<template>
    <div class="bg-secondary-950 text-secondary-50 min-h-dvh font-sans">
        <NuxtRouteAnnouncer />
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
        <ToastStack />
    </div>
</template>
