export interface AuthSession {
    token: string;
    userName: string;
    userId?: string;
    email?: string;
    expiresAt?: number;
    role?: 'admin' | 'customer';
}

interface SupabaseAuthUser {
    id: string;
    email?: string;
    user_metadata?: Record<string, unknown>;
}

function resolveUserName(user: SupabaseAuthUser): string {
    const fullName = user.user_metadata?.full_name;
    const name = user.user_metadata?.name;
    const preferredName = user.user_metadata?.preferred_name;

    if (typeof fullName === 'string' && fullName.trim().length > 0) {
        return fullName.trim();
    }

    if (typeof name === 'string' && name.trim().length > 0) {
        return name.trim();
    }

    if (typeof preferredName === 'string' && preferredName.trim().length > 0) {
        return preferredName.trim();
    }

    if (typeof user.email === 'string' && user.email.trim().length > 0) {
        return user.email.trim();
    }

    return 'User';
}

function createSessionFromSupabase(
    user: SupabaseAuthUser,
    accessToken?: string,
): AuthSession {
    if (accessToken) {
        const decoded = decodeJwt(accessToken);
        const expiresAt = decoded?.exp ? decoded.exp * 1000 : undefined;

        return {
            token: accessToken,
            userName: resolveUserName(user),
            userId: user.id,
            email: user.email,
            expiresAt,
        };
    }

    return {
        token: '',
        userName: resolveUserName(user),
        userId: user.id,
        email: user.email,
    };
}

export function useAuthSession() {
    const supabase = useSupabaseClient();
    const supabaseUser = useSupabaseUser();

    const session = useState<AuthSession | null>('auth_session', () => null);
    const isCheckingSession = ref(false);

    const isAuthenticated = computed(() => {
        if (!session.value?.userId) {
            return false;
        }

        if (!session.value.token) {
            return true;
        }

        if (isTokenExpired(session.value.token)) {
            return false;
        }

        return true;
    });

    async function checkSession(): Promise<boolean> {
        if (isCheckingSession.value) return Boolean(session.value);

        isCheckingSession.value = true;

        try {
            const currentUser = supabaseUser.value as SupabaseAuthUser | null;

            if (currentUser) {
                const { data: sessionData } = await supabase.auth.getSession();

                session.value = createSessionFromSupabase(
                    currentUser,
                    sessionData.session?.access_token,
                );

                return true;
            }

            const { data, error } = await supabase.auth.getUser();

            if (error || !data.user) {
                session.value = null;

                return false;
            }

            const { data: refreshedSession } = await supabase.auth.getSession();

            session.value = createSessionFromSupabase(
                data.user,
                refreshedSession.session?.access_token,
            );

            return true;
        } catch {
            session.value = null;

            return false;
        } finally {
            isCheckingSession.value = false;
        }
    }

    async function login(email: string, password: string): Promise<void> {
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error || !data.user) {
            throw new Error(error?.message || 'Login failed');
        }

        session.value = createSessionFromSupabase(
            data.user,
            data.session?.access_token,
        );
    }

    async function refreshAccessToken(): Promise<boolean> {
        try {
            const { data, error } = await supabase.auth.refreshSession();

            if (error || !data.session?.user) {
                session.value = null;

                return false;
            }

            session.value = createSessionFromSupabase(
                data.session.user,
                data.session.access_token,
            );

            return true;
        } catch {
            session.value = null;

            return false;
        }
    }

    async function logout(): Promise<void> {
        try {
            await supabase.auth.signOut();
        } catch (error) {
            console.error(error);
        } finally {
            session.value = null;
        }
    }

    watch(
        supabaseUser,
        async (value) => {
            const currentUser = value as SupabaseAuthUser | null;

            if (!currentUser) {
                session.value = null;

                return;
            }

            const { data } = await supabase.auth.getSession();

            session.value = createSessionFromSupabase(
                currentUser,
                data.session?.access_token,
            );
        },
        {
            immediate: true,
        },
    );

    return {
        session,
        isAuthenticated,
        isCheckingSession: computed(() => isCheckingSession.value),
        login,
        logout,
        refreshAccessToken,
        checkSession,
    };
}
