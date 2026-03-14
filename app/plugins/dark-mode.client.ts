export default defineNuxtPlugin(() => {
    if (import.meta.server) return;

    function initDarkMode() {
        const html = document.documentElement;
        html.classList.add('dark');
        localStorage.setItem('dark-mode', 'true');
    }

    initDarkMode();
});
