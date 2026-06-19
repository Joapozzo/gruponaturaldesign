/**
 * Tipos compartidos para los componentes del Navbar
 */

export interface MenuItem {
    id: string;
    label: string;
    href: string;
    paths: string[];
}

export interface CategoryData {
    rubros: string[];
    subrubros: string[];
    generos: string[];
}

export interface TextClasses {
    active: string;
    inactive: string;
}

