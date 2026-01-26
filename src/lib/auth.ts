import { auth0 } from "@/lib/auth0";

export async function getCurrentSession() {
    const session = await auth0.getSession();

    if (!session) {
        return;
    }

    return {
        auth0Id: session.user?.sub,
        user: session.user,
        email: session.user?.email,
        name: session.user?.name,
    }
}

export async function getAccessToken() {
    const token = await auth0.getAccessToken();
    return token.token ?? null;
}

export async function getRoles(): Promise<string[]> {
    const session = await auth0.getSession();
    
    if (!session || !session.user) {
        return [];
    }

    // Leer los roles directamente del ID Token decodificado
    // porque Auth0Client no mapea los custom claims a session.user
    if (session.tokenSet && typeof session.tokenSet === 'object') {
        const tokenSet = session.tokenSet as unknown as Record<string, unknown>;
        
        if (tokenSet.idToken && typeof tokenSet.idToken === 'string') {
            try {
                // Decodificar el ID Token (JWT)
                const parts = tokenSet.idToken.split('.');
                if (parts.length === 3) {
                    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
                    const roles = payload['https://naturaldesign.com.ar/roles'];
                    
                    if (Array.isArray(roles)) {
                        return roles;
                    }
                }
            } catch (error) {
                console.error('❌ Error decodificando ID Token:', error);
            }
        }
    }

    // Fallback: intentar desde session.user (aunque normalmente no funciona)
    const roles = session.user["https://naturaldesign.com.ar/roles"];
    
    if (Array.isArray(roles)) {
        return roles;
    }
    
    return [];
}