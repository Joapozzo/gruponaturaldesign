"use client";
import { useUser } from '@auth0/nextjs-auth0/client';

export const useUserSession = () => {
    const { user, error, isLoading } = useUser();
    
    return {
        user: user ? {
            email: user.email || null,
            name: user.name || null,
            auth0Id: user.sub || null,
        } : null,
        isLoading,
        isAuthenticated: !!user?.email,
        error,
    };
};

