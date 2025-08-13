import React from 'react';
import { motion } from 'framer-motion';

// Tipos para las variantes de fondo
type BackgroundVariant = 'white' | 'gray' | 'dark' | 'transparent';

// Tipos para el alineamiento del texto
type TextAlignment = 'left' | 'center' | 'right';

// Tipos para el espaciado
type SpacingSize = 'sm' | 'md' | 'lg' | 'xl' | 'none';

// Interface para las props del componente
interface SectionProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    id?: string;
    background?: BackgroundVariant;
    textAlignment?: TextAlignment;
    padding?: SpacingSize;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | 'full';
    className?: string;
    headerClassName?: string;
    contentClassName?: string;
    animated?: boolean;
    animationDelay?: number;
    noPadding?: boolean;
}

const Section: React.FC<SectionProps> = ({
    children,
    title,
    subtitle,
    id,
    background = 'white',
    textAlignment = 'center',
    padding = 'lg',
    className = '',
    headerClassName = '',
    contentClassName = '',
    animated = true,
    animationDelay = 0,
}) => {
    // Variantes de fondo
    const backgroundVariants: Record<BackgroundVariant, string> = {
        white: 'bg-white',
        gray: 'bg-gray-50',
        dark: 'bg-gray-900 text-white',
        transparent: 'bg-transparent',
    };

    // Variantes de alineamiento
    const alignmentVariants: Record<TextAlignment, string> = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
    };

    // Variantes de espaciado
    const paddingVariants: Record<SpacingSize, string> = {
        none: '',
        sm: 'pt-8',
        md: 'pt-12',
        lg: 'pt-10',
        xl: 'pt-32',
    };

    // Variantes de ancho máximo
    // const maxWidthVariants = {
    //     sm: 'max-w-sm',
    //     md: 'max-w-md',
    //     lg: 'max-w-lg',
    //     xl: 'max-w-xl',
    //     '2xl': 'max-w-2xl',
    //     '4xl': 'max-w-4xl',
    //     '6xl': 'max-w-6xl',
    //     full: 'max-w-full',
    // };

    // Clases del contenedor principal
    const sectionClasses = `
    w-full overflow-hidden
    ${backgroundVariants[background]}
    ${paddingVariants[padding]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

    // Clases del header
    const headerClasses = `
    ${alignmentVariants[textAlignment]}
    ${headerClassName}
  `.trim().replace(/\s+/g, ' ');

    // Clases del contenido
    const contentClasses = `
    w-full

    ${contentClassName}
  `.trim().replace(/\s+/g, ' ');

    const animationProps = animated
        ? {
            initial: { opacity: 0, y: 30 },
            whileInView: { opacity: 1, y: 0 },
            transition: { duration: 0.8, delay: animationDelay },
            viewport: { once: true },
        }
        : {};

    return (
        <section id={id} className={sectionClasses}>
            <div className={contentClasses}>
                {/* Header Section - Solo se renderiza si hay título o subtítulo */}
                {(title || subtitle) && (
                    <motion.div className={headerClasses} {...animationProps}>
                        {title && (
                            <h2 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 font-display leading-tight">
                                {title}
                            </h2>
                        )}
                        {subtitle && (
                            <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12 sm:mb-16 px-5">
                                {subtitle}
                            </p>
                        )}
                    </motion.div>
                )}

                {/* Content Section */}
                <motion.div
                    {...(animated && {
                        initial: { opacity: 0, y: 20 },
                        whileInView: { opacity: 1, y: 0 },
                        transition: { duration: 0.8, delay: animationDelay + 0.2 },
                        viewport: { once: true },
                    })}
                    className='w-full'
                >
                    {children}
                </motion.div>
            </div>
        </section>
    );
};

export default Section;


export type { SectionProps, BackgroundVariant, TextAlignment, SpacingSize };