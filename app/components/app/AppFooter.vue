<script setup lang="ts">
interface FooterLink {
    to: string;
    label: string;
}

interface SocialLink {
    href: string;
    icon: string;
    ariaLabel: string;
    colorClass: string;
}

const { t } = useI18n();
const localePath = useLocalePath();
const currentYear = new Date().getFullYear();

const shopLinks = computed<FooterLink[]>(() => [
    { to: localePath('/shop/categories'), label: t('footerShopCategories') },
    { to: localePath('/shop/creator'), label: t('footerShopCreator') },
]);

const helpLinks = computed<FooterLink[]>(() => [
    { to: localePath('/contact'), label: t('footerHelpContact') },
    { to: localePath('/faq'), label: t('footerHelpFaq') },
    { to: localePath('/complaints'), label: t('footerHelpComplaints') },
]);

const companyLinks = computed<FooterLink[]>(() => [
    { to: localePath('/about'), label: t('footerCompanyAbout') },
    { to: localePath('/terms'), label: t('footerCompanyTerms') },
    { to: localePath('/privacy'), label: t('footerCompanyPrivacy') },
    { to: localePath('/cookies'), label: t('footerCompanyCookies') },
]);

const socialLinks = computed<SocialLink[]>(() => [
    {
        href: 'https://instagram.com',
        icon: 'simple-icons:instagram',
        ariaLabel: t('footerGoToInstagram'),
        colorClass: 'text-[#E4405F] hover:text-[#C13584]',
    },
    {
        href: 'https://facebook.com',
        icon: 'simple-icons:facebook',
        ariaLabel: t('footerGoToFacebook'),
        colorClass: 'text-[#1877F2] hover:text-[#166FE5]',
    },
    {
        href: 'https://youtube.com',
        icon: 'simple-icons:youtube',
        ariaLabel: t('footerGoToYoutube'),
        colorClass: 'text-[#FF0000] hover:text-[#CC0000]',
    },
    {
        href: 'https://wa.me',
        icon: 'simple-icons:whatsapp',
        ariaLabel: t('footerGoToWhatsapp'),
        colorClass: 'text-[#25D366] hover:text-[#20BD5A]',
    },
]);

function handleSocialKeyDown(event: KeyboardEvent, href: string) {
    if (!event) return;

    if (!isEnterOrSpaceKey(event)) return;

    event.preventDefault();
    window.open(href, '_blank', 'noopener,noreferrer');
}
</script>

<template>
    <footer
        class="border-secondary-200 dark:border-secondary-800 border-t"
        role="contentinfo"
    >
        <div
            class="text-secondary-600 dark:text-secondary-400 mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 text-sm lg:px-8"
        >
            <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
                <div class="lg:col-span-2">
                    <NuxtLink
                        :to="localePath('/')"
                        class="text-secondary-900 dark:text-secondary-50 hover:text-primary-600 dark:hover:text-primary-400 focus-visible:ring-primary-500 inline-block rounded-lg text-xl font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                        :aria-label="t('navGoToHome')"
                    >
                        Sportswear Shop
                    </NuxtLink>
                </div>

                <nav class="flex flex-col gap-3" :aria-label="t('footerShop')">
                    <h3
                        class="text-secondary-900 dark:text-secondary-100 font-semibold"
                    >
                        {{ t('footerShop') }}
                    </h3>
                    <NuxtLink
                        v-for="link in shopLinks"
                        :key="link.to"
                        :to="link.to"
                        class="hover:text-primary-600 dark:hover:text-primary-400 focus-visible:ring-primary-500 -mx-1 rounded px-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    >
                        {{ link.label }}
                    </NuxtLink>
                </nav>

                <nav class="flex flex-col gap-3" :aria-label="t('footerHelp')">
                    <h3
                        class="text-secondary-900 dark:text-secondary-100 font-semibold"
                    >
                        {{ t('footerHelp') }}
                    </h3>
                    <NuxtLink
                        v-for="link in helpLinks"
                        :key="link.to"
                        :to="link.to"
                        class="hover:text-primary-600 dark:hover:text-primary-400 focus-visible:ring-primary-500 -mx-1 rounded px-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    >
                        {{ link.label }}
                    </NuxtLink>
                </nav>

                <nav
                    class="flex flex-col gap-3"
                    :aria-label="t('footerCompany')"
                >
                    <h3
                        class="text-secondary-900 dark:text-secondary-100 font-semibold"
                    >
                        {{ t('footerCompany') }}
                    </h3>
                    <NuxtLink
                        v-for="link in companyLinks"
                        :key="link.to"
                        :to="link.to"
                        class="hover:text-primary-600 dark:hover:text-primary-400 focus-visible:ring-primary-500 -mx-1 rounded px-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    >
                        {{ link.label }}
                    </NuxtLink>
                </nav>
            </div>

            <div
                class="border-secondary-200 dark:border-secondary-800 flex flex-col gap-4 border-t pt-8 sm:flex-row sm:items-center sm:justify-between"
            >
                <div
                    class="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6"
                >
                    <div class="flex items-center gap-4">
                        <div class="flex gap-3">
                            <a
                                v-for="social in socialLinks"
                                :key="social.href"
                                :href="social.href"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="focus-visible:ring-primary-500 rounded p-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                                :class="social.colorClass"
                                :aria-label="social.ariaLabel"
                                tabindex="0"
                                @keydown="
                                    handleSocialKeyDown($event, social.href)
                                "
                            >
                                <Icon
                                    :name="social.icon"
                                    size="28"
                                    class="text-inherit"
                                    aria-hidden="true"
                                />
                            </a>
                        </div>
                    </div>
                </div>
                <p class="text-secondary-500 dark:text-secondary-500 text-xs">
                    {{ t('footerCopyright', { year: currentYear }) }}
                </p>
            </div>
        </div>
    </footer>
</template>
