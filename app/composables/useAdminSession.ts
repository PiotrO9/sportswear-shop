export function useAdminSession() {
    const isCheckingAdmin = ref(false);
    const isAdmin = useState<boolean>('is_admin', () => false);

    async function checkAdminAccess(): Promise<boolean> {
        if (isCheckingAdmin.value) {
            return isAdmin.value;
        }

        isCheckingAdmin.value = true;

        try {
            await $fetch('/api/admin/me', {
                method: 'GET',
                credentials: 'include',
            });
            isAdmin.value = true;

            return true;
        } catch {
            isAdmin.value = false;

            return false;
        } finally {
            isCheckingAdmin.value = false;
        }
    }

    return {
        isAdmin: computed(() => isAdmin.value),
        isCheckingAdmin: computed(() => isCheckingAdmin.value),
        checkAdminAccess,
    };
}
