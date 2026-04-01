import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    app: {
        head: {
            htmlAttrs: {
                class: 'dark',
            },
        },
    },
    modules: [
        '@nuxtjs/supabase',
        '@nuxt/eslint',
        '@nuxt/icon',
        '@nuxtjs/seo',
        '@nuxtjs/i18n',
    ],
    supabase: {
        redirect: false,
    },
    i18n: {
        locales: [
            {
                code: 'en',
                name: 'English',
                file: 'en.json',
                iso: 'en',
                flag: '🇺🇸',
            },
            {
                code: 'pl',
                name: 'Polski',
                file: 'pl.json',
                iso: 'pl',
                flag: '🇵🇱',
            },
        ],
        defaultLocale: 'en',
        strategy: 'no_prefix',
        langDir: 'locales',
        lazy: true,
    },
    site: {
        url: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        name: 'Frontend Starter',
    },
    runtimeConfig: {
        productImagesBucket:
            process.env.SUPABASE_STORAGE_PRODUCT_BUCKET || 'product-images',
        productImageMaxBytes: Number(
            process.env.SUPABASE_STORAGE_PRODUCT_IMAGE_MAX_BYTES ||
                String(5 * 1024 * 1024),
        ),
        public: {
            apiBase: process.env.NUXT_PUBLIC_API_BASE || '',
            siteUrl:
                process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        },
    },
    components: [
        {
            path: '~/components/app',
            pathPrefix: false,
        },
        {
            path: '~/components/shop',
            pathPrefix: false,
        },
        {
            path: '~/components/ui',
            pathPrefix: false,
        },
    ],
    css: ['~/assets/css/tailwind.css'],
    imports: {
        dirs: ['app/composables', 'app/utils'],
    },
    vite: {
        plugins: [tailwindcss()],
    },
    postcss: {
        plugins: {
            autoprefixer: {},
        },
    },
});
