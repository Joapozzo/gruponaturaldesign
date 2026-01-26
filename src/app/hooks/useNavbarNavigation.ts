import { usePathname, useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useNavbarCategoryIds } from './useNavbarCategoryIds';

export interface MenuItem {
    id: string;
    label: string;
    href: string;
    paths: string[];
}

/**
 * Hook para manejar la lógica de navegación del Navbar
 * Sincronizado con useCatalogSearchParams para usar los mismos search params
 */
export const useNavbarNavigation = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { rubros: rubrosMap, subrubros: subrubrosMap } = useNavbarCategoryIds();

    /**
     * Normaliza un rubro para buscar su ID
     */
    const normalizeRubroForId = useCallback((rubro: string): string => {
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
        
        // Por defecto, retornar el rubro original en mayúsculas
        return rubroUpper;
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
     * Usa los search params correctos: rubroId, subrubroId, genero
     * Sincronizado con useCatalogSearchParams
     */
    const handleCategoryNavigation = useCallback((
        type: 'rubro' | 'subrubro' | 'genero',
        value: string,
        onNavigate?: () => void
    ) => {
        const params = new URLSearchParams();
        
        if (type === 'rubro') {
            // Normalizar el nombre del rubro
            const normalizedRubro = normalizeRubroForId(value);
            // Buscar el ID del rubro
            const rubroId = rubrosMap.get(normalizedRubro);
            if (rubroId) {
                params.set('rubroId', String(rubroId));
            }
        } else if (type === 'subrubro') {
            // Buscar el ID del subrubro por nombre
            const subrubroId = subrubrosMap.get(value.toUpperCase());
            if (subrubroId) {
                params.set('subrubroId', String(subrubroId));
            }
        } else if (type === 'genero') {
            // Genero en minúsculas: dama, hombre, unisex
            const generoLower = value.toLowerCase();
            if (['dama', 'hombre', 'unisex'].includes(generoLower)) {
                params.set('genero', generoLower);
            }
        }
        
        // Navegar a /shoponline con los search params
        const url = params.toString() 
            ? `/shoponline?${params.toString()}`
            : '/shoponline';
        
        router.push(url);
        
        if (onNavigate) {
            onNavigate();
        }
    }, [router, normalizeRubroForId, rubrosMap, subrubrosMap]);

    return {
        isLinkActive,
        handleNavigation,
        handleCategoryNavigation,
        normalizeRubroForNavigation: normalizeRubroForId,
    };
};

