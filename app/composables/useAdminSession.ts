export function useAdminSession() {
    const isCheckingAdmin = ref(false);
    const isAdmin = useState<boolean>('is_admin', () => false);
    const adminCheckPromise = ref<Promise<boolean> | null>(null);

    async function checkAdminAccess(): Promise<boolean> {
        if (adminCheckPromise.value) {
            return adminCheckPromise.value;
        }

        const promise = (async () => {
            isCheckingAdmin.value = true;

            try {
                const requestFetch = useRequestFetch();

                await requestFetch('/api/admin/me', {
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
                adminCheckPromise.value = null;
            }
        })();

        adminCheckPromise.value = promise;

        return promise;
    }

    return {
        isAdmin: computed(() => isAdmin.value),
        isCheckingAdmin: computed(() => isCheckingAdmin.value),
        checkAdminAccess,
    };
}
