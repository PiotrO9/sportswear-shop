export default defineNuxtRouteMiddleware(async () => {
    const localePath = useLocalePath();
    const { isAuthenticated, checkSession } = useAuthSession();
    const { checkAdminAccess } = useAdminSession();

    if (!isAuthenticated.value) {
        const hasSession = await checkSession();

        if (!hasSession) {
            return navigateTo(localePath('/login'));
        }
    }

    const hasAdminAccess = await checkAdminAccess();

    console.log(hasAdminAccess);

    if (hasAdminAccess) {
        return;
    }

    return navigateTo(localePath('/protected'));
});
