"use client";

import { useUser } from '@auth0/nextjs-auth0/client';

/**
 * Hook para obtener los roles del usuario desde el cliente
 * Extrae los roles del objeto user de Auth0
 */
export const useUserRoles = (): string[] => {
    const { user } = useUser();
    
    if (!user) return [];
    
    const roles: string[] = [];
    
    // Intentar obtener roles desde el custom claim
    // Los roles pueden estar en diferentes lugares dependiendo de la configuración de Auth0
    const customRoles = user['https://naturaldesign.com.ar/roles'];
    if (Array.isArray(customRoles)) {
        roles.push(...customRoles);
    }
    
    // También intentar desde user.roles si existe (formato estándar)
    if (user.roles && Array.isArray(user.roles)) {
        roles.push(...user.roles);
    }
    
    return roles;
};

