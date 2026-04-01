import { provideSSRWidth } from '@vueuse/core';

/**
 * Ogranicza rozbieżności hydratacji dla komponentów opartych o viewport (np. sheet/drawer).
 * @see https://shadcn-vue.com/docs/installation/nuxt
 */
export default defineNuxtPlugin((nuxtApp) => {
    provideSSRWidth(1024, nuxtApp.vueApp);
});
