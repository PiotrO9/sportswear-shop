export interface AuthSession {
    token: string;
    userName: string;
    userId?: string;
    email?: string;
    expiresAt?: number;
    role?: 'admin' | 'customer';
}

interface LoginResponse {
    accessToken: string;
    user: {
        id: string;
        userName: string;
        email: string;
    };
}

interface RefreshResponse {
    accessToken: string;
}

interface MeResponse {
    user: {
        id: string;
        userName: string;
        email: string;
    };
    accessToken?: string;
}

const MOCK_ADMIN_EMAIL = 'admin@mock.local';
const MOCK_ADMIN_PASSWORD = 'Admin123!';
const MOCK_ADMIN_COOKIE = 'admin_mock_session';

function createMockAdminSession(): AuthSession {
    return {
        token: `mock_admin_${Date.now()}`,
        userName: 'Admin Demo',
        userId: 'mock-admin',
        email: MOCK_ADMIN_EMAIL,
        role: 'admin',
    };
}

function isMockAdminCredentials(email: string, password: string): boolean {
    if (!email || !password) {
        return false;
    }

    return (
        email.trim().toLowerCase() === MOCK_ADMIN_EMAIL &&
        password.trim() === MOCK_ADMIN_PASSWORD
    );
}

function createSessionFromResponse(
    user: { id: string; userName: string; email: string },
    accessToken?: string,
): AuthSession {
    if (accessToken) {
        const decoded = decodeJwt(accessToken) as JwtPayload;
        const expiresAt = decoded.exp ? decoded.exp * 1000 : undefined;

        return {
            token: accessToken,
            userName: user.userName,
            userId: user.id,
            email: user.email,
            expiresAt,
        };
    }

    return {
        token: 'valid',
        userName: user.userName,
        userId: user.id,
        email: user.email,
    };
}

export function useAuthSession() {
    const config = useRuntimeConfig();
    const apiBase = config.public.apiBase || '/api';
    const isMockEnabled = Boolean(config.public.enableAdminMock);
    const adminMockSessionCookie = useCookie<string | null>(MOCK_ADMIN_COOKIE, {
        sameSite: 'lax',
        path: '/',
    });

    const session = useState<AuthSession | null>('auth_session', () => null);
    const isCheckingSession = ref(false);

    const isAuthenticated = computed(() => {
        if (!session.value?.token) return false;

        if (isTokenExpired(session.value.token)) {
            return false;
        }

        return true;
    });

    async function checkSession(): Promise<boolean> {
        if (isCheckingSession.value) return Boolean(session.value);

        isCheckingSession.value = true;

        try {
            if (isMockEnabled && adminMockSessionCookie.value === '1') {
                session.value = createMockAdminSession();

                return true;
            }

            const response = await $fetch<MeResponse>(`${apiBase}/auth/me`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            session.value = createSessionFromResponse(
                response.user,
                response.accessToken,
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

        if (isMockEnabled && isMockAdminCredentials(email, password)) {
            adminMockSessionCookie.value = '1';
            session.value = createMockAdminSession();

            return;
        }

        const response = await $fetch<LoginResponse>(`${apiBase}/auth/login`, {
            method: 'POST',
            credentials: 'include',
            body: { email, password },
            headers: {
                'Content-Type': 'application/json',
            },
        });

        session.value = createSessionFromResponse(
            response.user,
            response.accessToken,
        );
    }

    async function refreshAccessToken(): Promise<boolean> {
        try {
            const response = await $fetch<RefreshResponse>(
                `${apiBase}/auth/refresh`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );

            const decoded = decodeJwt(response.accessToken) as JwtPayload;
            const expiresAt = decoded.exp ? decoded.exp * 1000 : undefined;

            if (session.value) {
                session.value = {
                    ...session.value,
                    token: response.accessToken,
                    expiresAt,
                };
            }

            return true;
        } catch {
            session.value = null;

            return false;
        }
    }

    async function logout(): Promise<void> {
        adminMockSessionCookie.value = null;

        if (apiBase) {
            try {
                await $fetch(`${apiBase}/auth/logout`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            } catch (error) {
                console.error(error);
            }
        }

        session.value = null;
    }

    function loginDemo(userName: string) {
        if (!userName) return;

        session.value = {
            token: `demo_${Date.now()}`,
            userName,
        };
    }

    return {
        session,
        isAuthenticated,
        isCheckingSession: computed(() => isCheckingSession.value),
        isMockEnabled: computed(() => isMockEnabled),
        mockAdminEmail: MOCK_ADMIN_EMAIL,
        mockAdminPassword: MOCK_ADMIN_PASSWORD,
        login,
        loginDemo,
        logout,
        refreshAccessToken,
        checkSession,
    };
}
