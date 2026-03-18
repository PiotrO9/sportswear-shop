export default defineNuxtRouteMiddleware(async () => {
    const localePath = useLocalePath();
    const { checkAdminAccess } = useAdminSession();

    const hasAccess = await checkAdminAccess();

    if (hasAccess) {
        return;
    }

    return navigateTo(localePath('/login'));
});
