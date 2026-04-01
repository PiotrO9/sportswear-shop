export default defineNuxtRouteMiddleware(async () => {
    const localePath = useLocalePath();
    const { isAuthenticated, checkSession } = useAuthSession();

    if (isAuthenticated.value) {
        return navigateTo(localePath('/admin'));
    }

    const hasSession = await checkSession();

    if (hasSession) {
        return navigateTo(localePath('/admin'));
    }
});
