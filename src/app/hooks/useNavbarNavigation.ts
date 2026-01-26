import { usePathname, useRouter } from 'next/navigation';
import { useCallback } from 'react';

export interface MenuItem {
    id: string;
    label: string;
    href: string;
    paths: string[];
}

/**
 * Hook para manejar la lógica de navegación del Navbar
 */
export const useNavbarNavigation = () => {
    const pathname = usePathname();
    const router = useRouter();

    /**
     * Normaliza un rubro antes de navegar
     */
    const normalizeRubroForNavigation = useCallback((rubro: string): string => {
        if (!rubro) return '';
        const rubroUpper = rubro.toUpperCase().trim();
        
        // Si contiene "WORKWEAR", retornar "WORKWEAR"
        if (rubroUpper.includes('WORKWEAR')) {
            return 'WORKWEAR';
        }
        
        // Si contiene "OFFICE", retornar "BASIC"
        if (rubroUpper.includes('OFFICE')) {
            return 'BASIC';
        }
        
        // Si ya es "BASIC" o "WORKWEAR", retornarlo tal cual
        if (rubroUpper === 'BASIC' || rubroUpper === 'WORKWEAR') {
            return rubroUpper;
        }
        
        // Por defecto, retornar el rubro original
        return rubro.trim();
    }, []);

    /**
     * Verifica si un link está activo
     */
    const isLinkActive = useCallback((item: MenuItem): boolean => {
        const currentPath = pathname || '';
        
        // Home
        if (currentPath === '/' && item.id === 'inicio') return true;
        
        // Shop Online (incluye páginas de producto)
        if (item.id === 'shoponline') {
            return currentPath === '/shoponline' || currentPath.startsWith('/producto/');
        }
        
        // Personalizados
        if (currentPath === '/personalizados' && item.id === 'personalizados') return true;
        
        return false;
    }, [pathname]);

    /**
     * Maneja la navegación a un item del menú
     */
    const handleNavigation = useCallback((item: MenuItem) => {
        window.location.href = item.href;
    }, []);

    /**
     * Maneja la navegación con filtros de categoría
     */
    const handleCategoryNavigation = useCallback((
        type: 'rubro' | 'subrubro' | 'genero',
        value: string,
        onNavigate?: () => void
    ) => {
        const params = new URLSearchParams();
        
        if (type === 'rubro') {
            const normalizedRubro = normalizeRubroForNavigation(value);
            params.set('rubro', normalizedRubro);
        } else if (type === 'subrubro') {
            params.set('subrubro', value);
        } else if (type === 'genero') {
            params.set('genero', value.toLowerCase());
        }
        
        router.push(`/shoponline?${params.toString()}`);
        
        if (onNavigate) {
            onNavigate();
        }
    }, [router, normalizeRubroForNavigation]);

    return {
        isLinkActive,
        handleNavigation,
        handleCategoryNavigation,
        normalizeRubroForNavigation,
    };
};

