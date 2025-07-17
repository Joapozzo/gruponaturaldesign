// hooks/useScrollToSection.ts
import { useEffect, useState, useCallback } from 'react';

interface UseScrollToSectionProps {
    sections?: string[];
    offset?: number;
    closeMenuCallback?: () => void;
}

export const useScrollToSection = ({
    sections = ['inicio', 'nosotros', 'categorias', 'productos', 'testimonios', 'preguntas', 'contacto'],
    offset = 100,
    closeMenuCallback
}: UseScrollToSectionProps = {}) => {
    const [activeSection, setActiveSection] = useState<string>('inicio');

    // Función para hacer scroll a una sección específica
    const scrollToSection = useCallback((sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            setActiveSection(sectionId);

            // Ejecutar callback si existe (para cerrar menús móviles, etc.)
            if (closeMenuCallback) {
                closeMenuCallback();
            }
        }
    }, [closeMenuCallback]);

    // Detectar sección activa al hacer scroll
    useEffect(() => {
        const handleScroll = () => {
            const current = sections.find(section => {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    return rect.top <= offset && rect.bottom >= offset;
                }
                return false;
            });

            if (current && current !== activeSection) {
                setActiveSection(current);
            }
        };

        // Detectar sección inicial
        handleScroll();

        // Agregar listener de scroll
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Cleanup
        return () => window.removeEventListener('scroll', handleScroll);
    }, [sections, offset, activeSection]);

    // Función para verificar si una sección está activa
    const isActiveSection = useCallback((sectionId: string) => {
        return activeSection === sectionId;
    }, [activeSection]);

    // Función para obtener las clases CSS de una sección
    const getSectionClasses = useCallback((
        sectionId: string,
        activeClasses: string = 'text-[var(--red)] border-b-2 border-[var(--red)] pb-1',
        inactiveClasses: string = 'text-[var(--black)] hover:text-[var(--red)]'
    ) => {
        return isActiveSection(sectionId) ? activeClasses : inactiveClasses;
    }, [isActiveSection]);

    return {
        activeSection,
        scrollToSection,
        isActiveSection,
        getSectionClasses,
        setActiveSection
    };
};

// Hook específico para navegación con menú móvil
export const useNavigation = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navigation = useScrollToSection({
        closeMenuCallback: () => setIsMenuOpen(false)
    });

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return {
        ...navigation,
        isMenuOpen,
        setIsMenuOpen,
        toggleMenu,
        closeMenu
    };
};