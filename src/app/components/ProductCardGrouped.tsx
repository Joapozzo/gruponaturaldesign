'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Eye, ShoppingCart, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { GroupedProduct, ProductVariant } from '../types/producto';
import { useCart } from './hooks/useCart';
import { getFirstProductImage, getProductImagesByColor } from '@/app/(pages)/producto/[id]/helpers/productHelpers';

interface ProductCardGroupedProps {
    group: GroupedProduct;
    index: number;
    expandedSku?: string | null;
    onExpandChange?: (sku: string | null) => void;
}

const ProductCardGrouped: React.FC<ProductCardGroupedProps> = ({ group, index, expandedSku, onExpandChange }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [showVariants, setShowVariants] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(group.variants[0]);
    const [selectedColor, setSelectedColor] = useState<string | null>(
        group.variants[0].color || null
    );
    const [selectedSize, setSelectedSize] = useState<string | null>(
        group.variants[0].talle || null
    );

    // Controlar expansión: si hay un callback, usar estado controlado
    const isExpanded = expandedSku === group.skuBase;
    const handleToggleExpand = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onExpandChange) {
            // Si ya está expandido, cerrarlo; si no, expandirlo y cerrar los demás
            onExpandChange(isExpanded ? null : group.skuBase);
        } else {
            // Fallback a estado local si no hay callback
            setShowVariants(!showVariants);
        }
    };
    const router = useRouter();
    const { addToCart, isInCart, getCartItem } = useCart();

    // Helper para obtener color hexadecimal desde nombre de color
    const getColorHex = (colorName: string): string => {
        const colorMap: Record<string, string> = {
            'NEGRO': '#000000',
            'BLANCO': '#FFFFFF',
            'AZUL': '#0066CC',
            'AZUL MARINO': '#003366',
            'GRIS': '#808080',
            'GRIS PERLA': '#E8E8E8',
            'GRIS MELANGE': '#A0A0A0',
            'GRIS TOPO': '#8B7355',
            'ROJO': '#CC0000',
            'VERDE': '#00CC00',
            'AMARILLO': '#FFCC00',
            'NARANJA': '#FF6600',
            'ROSA': '#FF99CC',
            'VIOLETA': '#9966CC',
            'BEIGE': '#F5F5DC',
            'MARRON': '#8B4513',
            'CELESTE': '#87CEEB',
            'LAVADO OSCURO': '#2C2C2C',
            'LAVADO CLARO': '#D3D3D3',
            'LAVADO MEDIO': '#808080',
        };
        return colorMap[colorName.toUpperCase()] || '#999999';
    };

    // Usar la variante seleccionada para mostrar
    const product = selectedVariant.producto;

    // Obtener imágenes del producto (usar array de imágenes si está disponible)
    const PLACEHOLDER_IMAGE = '/imgs/producto-placeholder.png';
    const productName = product.NOMBRE || group.skuBase;
    const [mainImage, setMainImage] = useState<string>(PLACEHOLDER_IMAGE);
    const [hasValidImage, setHasValidImage] = useState<boolean>(true);
    const [imageLoadAttempts, setImageLoadAttempts] = useState<number>(0);
    
    // Actualizar imagen cuando cambia el color seleccionado o el producto
    useEffect(() => {
        setHasValidImage(true);
        setImageLoadAttempts(0);
        
        // Prioridad 1: Imagen del color seleccionado
        if (selectedColor && productName) {
            const colorImages = getProductImagesByColor(productName, selectedColor);
            if (colorImages.length > 0) {
                setMainImage(colorImages[0]);
                return;
            }
        }
        
        // Prioridad 2: Primera imagen disponible del producto (cualquier color)
        if (productName) {
            setMainImage(getFirstProductImage(productName));
            return;
        }
        
        // Prioridad 3: Imágenes del producto si existen
        const productImages = product.imagenes && product.imagenes.length > 0 
            ? product.imagenes.filter(img => img && img.trim() !== '' && !img.includes('.png'))
            : product.imagen && product.imagen.trim() !== '' && !product.imagen.includes('.png')
                ? [product.imagen] 
                : [];
        if (productImages.length > 0) {
            setMainImage(productImages[0]);
            return;
        }
        
        // Fallback: placeholder
        setMainImage(PLACEHOLDER_IMAGE);
    }, [selectedColor, productName, product.imagen, product.imagenes]);
    
    // Manejar error de carga de imagen
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const target = e.target as HTMLImageElement;
        
        // Intentar con otros colores disponibles
        if (productName && group.availableColors && group.availableColors.length > 0 && imageLoadAttempts < group.availableColors.length) {
            const currentColorIndex = selectedColor 
                ? group.availableColors.indexOf(selectedColor)
                : -1;
            
            // Intentar con el siguiente color
            const nextColorIndex = (currentColorIndex + 1 + imageLoadAttempts) % group.availableColors.length;
            const nextColor = group.availableColors[nextColorIndex];
            
            if (nextColor) {
                const colorImages = getProductImagesByColor(productName, nextColor);
                if (colorImages.length > 0) {
                    setImageLoadAttempts(prev => prev + 1);
                    target.src = colorImages[0];
                    return;
                }
            }
        }
        
        // Si ya intentamos con todos los colores o no hay más opciones, marcar como sin imagen
        if (imageLoadAttempts >= (group.availableColors?.length || 1)) {
            setHasValidImage(false);
        } else {
            setImageLoadAttempts(prev => prev + 1);
        }
    };

    // Detectar si tiene data de color/talle
    const hasColorSizeData = group.variants.some(v => v.color && v.talle);

    // Helper para crear ID único desde código de producto
    const createProductId = (codigo: string): number => {
        let hash = 0;
        for (let i = 0; i < codigo.length; i++) {
            const char = codigo.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    };

    const selectedVariantId = createProductId(selectedVariant.codigo);

    // Crear especificaciones de la variante actual
    const getCurrentSpecs = (): string => {
        if (hasColorSizeData && selectedVariant.color && selectedVariant.talle) {
            return `Color: ${selectedVariant.color} | Talle: ${selectedVariant.talle} | Código: ${selectedVariant.codigo}`;
        }
        return `Código: ${selectedVariant.codigo}`;
    };

    // Verificar si la variante exacta (mismo color y talle) está en el carrito
    const cartItem = getCartItem(selectedVariantId);
    const isExactVariantInCart = cartItem && cartItem.especificaciones === getCurrentSpecs();
    const isInCartGeneric = isInCart(selectedVariantId);

    // Detectar si es mobile
    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    // Sincronizar estado local con estado controlado
    useEffect(() => {
        if (onExpandChange) {
            setShowVariants(isExpanded);
        }
    }, [isExpanded, onExpandChange]);

    // Función para generar slug desde nombre
    const nombreToSlug = (nombre: string): string => {
        return nombre
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    };

    const handleProductClick = () => {
        // Navegar usando el slug del SKU base (URL-friendly)
        const slug = group.skuBaseSlug || nombreToSlug(group.skuBase);
        router.push(`/producto/${slug}`);
    };

    const handleQuickView = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Navegar usando el slug del SKU base (URL-friendly)
        const slug = group.skuBaseSlug || nombreToSlug(group.skuBase);
        router.push(`/producto/${slug}`);
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();

        // Si hay múltiples opciones y no se ha mostrado el selector, mostrarlo
        if (group.totalVariants > 1 && !isExpanded) {
            if (onExpandChange) {
                onExpandChange(group.skuBase);
            } else {
                setShowVariants(true);
            }
            return;
        }

        // Validar que color y talle estén seleccionados cuando hay datos de color/talle
        if (hasColorSizeData) {
            if (!selectedColor || !selectedSize) {
                // Si no están seleccionados, expandir el selector
                if (onExpandChange) {
                    onExpandChange(group.skuBase);
                } else {
                    setShowVariants(true);
                }
                return;
            }
        }

        setIsAdding(true);

        // Crear especificaciones según si tiene data de color/talle
        let specs = `Código: ${selectedVariant.codigo}`;
        if (hasColorSizeData && selectedVariant.color && selectedVariant.talle) {
            specs = `Color: ${selectedVariant.color} | Talle: ${selectedVariant.talle} | Código: ${selectedVariant.codigo}`;
        } else {
            specs = `Código: ${selectedVariant.codigo}`;
        }

        // Agregar la variante seleccionada al carrito con especificaciones
        addToCart(
            {
                id: selectedVariantId,
                nombre: product.Descripcion || product.NOMBRE || 'Sin descripción',
                descripcion: product.DescripcionCorta || product.Descripcion || '',
                imagen: mainImage || '',
                precio: product.PrecioVenta || 0,
                categoria: product.Rubro || 'Sin categoría',
            },
            1,
            specs
        );

        // Animación de feedback
        setTimeout(() => {
            setIsAdding(false);
            if (onExpandChange) {
                onExpandChange(null);
            } else {
                setShowVariants(false);
            }
        }, 1000);
    };

    const handleVariantSelect = (variant: ProductVariant, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedVariant(variant);
    };

    // Handlers para selector de color/talle
    const handleColorSelect = (color: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedColor(color);

        // Resetear talle cuando cambia el color
        setSelectedSize(null);

        // Buscar la primera variante disponible con ese color
        const variantWithColor = group.variants.find(v => v.color === color);
        if (variantWithColor) {
            setSelectedVariant(variantWithColor);
            setSelectedSize(variantWithColor.talle || null);
        }
    };

    const handleSizeSelect = (size: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedSize(size);

        // Buscar la variante que coincida con color y talle seleccionados
        if (selectedColor) {
            const variant = group.variants.find(
                v => v.color === selectedColor && v.talle === size
            );
            if (variant) {
                setSelectedVariant(variant);
            }
        }
    };

    // Obtener talles disponibles para el color seleccionado
    const getAvailableSizesForColor = (color: string): string[] => {
        const sizes = group.variants
            .filter(v => v.color === color && v.talle)
            .map(v => v.talle!);
        return Array.from(new Set(sizes));
    };

    const availableSizes = selectedColor ? getAvailableSizesForColor(selectedColor) : [];

    // Solo permitir hover en desktop
    const handleMouseEnter = () => {
        if (!isMobile) {
            setIsHovered(true);
        }
    };

    const handleMouseLeave = () => {
        if (!isMobile) {
            setIsHovered(false);
        }
    };

    // Formatear precio
    const formattedPrice = product.PrecioVenta
        ? `$${product.PrecioVenta.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`
        : 'Consultar';

    // Si no hay imagen válida después de intentar con todos los colores, no mostrar el producto
    if (!hasValidImage && imageLoadAttempts >= (group.availableColors?.length || 1)) {
        return null;
    }

    return (
        <motion.div
            initial={!isMobile ? { opacity: 0, y: 50 } : { opacity: 1, y: 0 }}
            whileInView={!isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            transition={!isMobile ? { duration: 0.6, delay: index * 0.1 } : { duration: 0 }}
            viewport={{ once: true }}
            className={`group relative bg-white rounded-lg shadow-md transition-all duration-500 h-auto flex flex-col self-start ${
                !isMobile 
                    ? 'w-full mb-6 sm:mb-8 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-2 min-h-[700px]' 
                    : 'w-full mb-3 min-h-[280px]'
            }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Badge de variantes disponibles */}
            {/* {group.totalVariants > 1 && (
                <motion.div
                    className="absolute top-6 left-4 z-10 text-white px-3 py-1.5 text-xs font-semibold flex items-center space-x-1.5 rounded-lg"
                    animate={{
                        scale: isHovered ? 1.1 : 1,
                        backgroundColor: isHovered ? "#1f2937" : "#374151"
                    }}
                    transition={{ duration: 0.3 }}
                >
                    <Package size={12} />
                    <span>{group.totalVariants} variantes</span>
                </motion.div>
            )} */}

            {/* Imagen del producto */}
            <div className={`relative overflow-hidden rounded-t-lg bg-gray-100 cursor-pointer flex-shrink-0 ${
                isMobile ? 'h-[180px]' : 'h-[550px]'
            }`} onClick={handleProductClick}>
                {hasValidImage ? (
                    <motion.img
                        src={mainImage}
                        alt={product.Descripcion || product.NOMBRE || 'Producto'}
                        className="w-full h-full object-cover"
                        animate={!isMobile ? {
                            scale: isHovered ? 1.08 : 1,
                            filter: isHovered ? "brightness(0.85)" : "brightness(1)",
                        } : {}}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        onError={handleImageError}
                        onLoad={() => setHasValidImage(true)}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-400 text-sm">Sin imagen</span>
                    </div>
                )}

                {/* Overlay gradient */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
                    animate={!isMobile ? {
                        opacity: isHovered ? 1 : 0
                    } : { opacity: 0 }}
                    transition={{ duration: 0.4 }}
                />

                {/* Botón de vista rápida */}
                <motion.div
                    className={`absolute bg-white/20 rounded-lg backdrop-blur-sm flex items-center justify-center ${
                        isMobile ? 'top-1 right-1 w-6 h-6' : 'top-5 right-3 w-10 h-10'
                    }`}
                    style={{ overflow: 'visible' }}
                    animate={!isMobile ? {
                        scale: isHovered ? 1.05 : 1,
                        backgroundColor: isHovered ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.2)",
                        rotate: isHovered ? 10 : 0
                    } : {}}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    onClick={handleQuickView}
                >
                    <Eye className={isMobile ? 'w-4 h-4 text-white' : 'w-5 h-5 text-white'} />
                </motion.div>

                {/* Información overlay en hover - Solo desktop */}
                {!isMobile && (
                    <motion.div
                        className="absolute bottom-3 left-3 right-3 text-white"
                        animate={{
                            opacity: isHovered ? 1 : 0,
                            y: isHovered ? 0 : 15,
                        }}
                        transition={{ duration: 0.4, delay: isHovered ? 0.1 : 0 }}
                    >
                        <div className="flex items-center justify-between">
                            <motion.span
                                className="text-xs font-semibold bg-black/50 backdrop-blur-sm px-3 py-1 rounded-lg"
                                animate={{
                                    scale: isHovered ? 1.05 : 1
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                {product.Rubro || 'Sin categoría'}
                            </motion.span>
                            <motion.div
                                className="flex items-center space-x-1 text-xs font-semibold"
                                animate={{
                                    x: isHovered ? 5 : 0
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                <span>VER</span>
                                <ArrowRight size={12} />
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Información del producto */}
            <motion.div
                className={`flex flex-col justify-between gap-1.5 sm:gap-2 flex-1 ${
                    isMobile ? 'p-2' : 'p-3 sm:p-4'
                }`}
                animate={!isMobile ? {
                    backgroundColor: isHovered ? "#f9fafb" : "#ffffff"
                } : {}}
                transition={{ duration: 0.4 }}
            >
                {/* Nombre del producto */}
                <motion.h3
                    className={`font-semibold text-gray-900 transition-colors line-clamp-2 ${
                        isMobile ? 'text-xs mb-1' : 'text-base'
                    }`}
                    animate={!isMobile ? {
                        color: isHovered ? "#111827" : "#1f2937",
                        scale: isHovered ? 1.02 : 1
                    } : {}}
                    transition={{ duration: 0.3 }}
                >
                    {product.NOMBRE || product.Descripcion || 'Sin descripción'}
                </motion.h3>

                {/* Selector de opciones - Estilo E-commerce */}
                {group.totalVariants > 1 && (
                    <div className="space-y-1.5">
                        {/* Mostrar info de selección si tiene color/talle */}
                        {hasColorSizeData ? (
                            <>
                                {selectedColor && selectedSize && (
                                    <div className="text-xs sm:text-sm font-medium text-gray-700">
                                        {/* {selectedColor} - {selectedSize} */}
                                    </div>
                                )}

                                {/* Selector de Color y Talle */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-2 sm:space-y-2.5 overflow-visible"
                                        >
                                            {/* Selector de Colores */}
                                            {group.availableColors && group.availableColors.length > 0 && (
                                                <div className="space-y-1.5">
                                                    <label className={`font-semibold text-gray-700 uppercase tracking-wide ${
                                                        isMobile ? 'text-xs' : 'text-sm'
                                                    }`}>
                                                        Color
                                                    </label>
                                                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                                        {group.availableColors.map((color) => {
                                                            const variantWithColor = group.variants.find(v => v.color === color);
                                                            const colorHex = variantWithColor?.colorHex || getColorHex(color);
                                                            const isSelected = selectedColor === color;

                                                            return (
                                                                <motion.button
                                                                    key={color}
                                                                    onClick={(e) => handleColorSelect(color, e)}
                                                                    className={`
                                                                        relative flex items-center justify-center rounded-full
                                                                        transition-all duration-200
                                                                        ${isMobile ? 'w-8 h-8' : 'w-10 h-10'}
                                                                        ${isSelected
                                                                            ? 'ring-2 ring-black ring-offset-2'
                                                                            : 'hover:ring-2 hover:ring-gray-300 ring-offset-2'
                                                                        }
                                                                    `}
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    title={color}
                                                                >
                                                                    <div
                                                                        className={`rounded-full w-full h-full border-2 ${
                                                                            isSelected ? 'border-white' : 'border-gray-300'
                                                                        }`}
                                                                        style={{ backgroundColor: colorHex }}
                                                                    />
                                                                    {isSelected && (
                                                                        <motion.div
                                                                            className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5"
                                                                            initial={{ scale: 0 }}
                                                                            animate={{ scale: 1 }}
                                                                            transition={{ duration: 0.2 }}
                                                                        >
                                                                            <Check className={isMobile ? 'w-2 h-2' : 'w-2.5 h-2.5'} />
                                                                        </motion.div>
                                                                    )}
                                                                </motion.button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Selector de Talles */}
                                            {selectedColor && availableSizes.length > 0 && (
                                                <div className="space-y-1.5 pt-1">
                                                    <label className={`font-semibold text-gray-700 uppercase tracking-wide ${
                                                        isMobile ? 'text-xs' : 'text-sm'
                                                    }`}>
                                                        Talle
                                                    </label>
                                                    <div className="flex flex-row gap-1.5 sm:gap-2 max-w-full overflow-x-auto overflow-y-visible pb-2 pt-1 -mx-1 px-1 sm:flex-wrap sm:overflow-x-visible">
                                                        {availableSizes.map((size) => {
                                                            const isSelected = selectedSize === size;

                                                            return (
                                                                <motion.button
                                                                    key={size}
                                                                    onClick={(e) => handleSizeSelect(size, e)}
                                                                    className={`
                                                                        relative rounded-lg font-semibold transition-all duration-200 flex-shrink-0
                                                                        min-w-[40px] sm:min-w-[44px] px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm
                                                                        ${isSelected
                                                                            ? 'bg-black text-white ring-1 sm:ring-2 ring-black'
                                                                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                                                        }
                                                                    `}
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                >
                                                                    {size}
                                                                    {isSelected && (
                                                                        <motion.div
                                                                            className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5"
                                                                            initial={{ scale: 0 }}
                                                                            animate={{ scale: 1 }}
                                                                            transition={{ duration: 0.2 }}
                                                                        >
                                                                            <Check className="w-2.5 h-2.5 text-white" />
                                                                        </motion.div>
                                                                    )}
                                                                </motion.button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </>
                        ) : (
                            <>
                                {/* Fallback: Mostrar selector numérico cuando no hay color/talle */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5">
                                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                                        Opción seleccionada: #{selectedVariant.variantNumber}
                                    </span>
                                    <button
                                        onClick={handleToggleExpand}
                                        className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap"
                                    >
                                        {isExpanded ? 'Ocultar' : `Ver ${group.totalVariants} opciones`}
                                    </button>
                                </div>

                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="grid grid-cols-6 gap-1.5 p-2 bg-gray-50 rounded-lg max-h-32 overflow-y-auto">
                                                {group.variants.map((variant) => (
                                                    <motion.button
                                                        key={variant.codigo}
                                                        onClick={(e) => handleVariantSelect(variant, e)}
                                                        className={`
                                                            relative aspect-square rounded-md text-xs font-semibold
                                                            transition-all duration-200 flex items-center justify-center
                                                            ${selectedVariant.codigo === variant.codigo
                                                                ? 'bg-black text-white ring-2 ring-black ring-offset-1'
                                                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                                            }
                                                        `}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        #{variant.variantNumber}
                                                        {selectedVariant.codigo === variant.codigo && (
                                                            <motion.div
                                                                className="absolute -top-0.5 -right-0.5 bg-green-500 rounded-full p-0.5"
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                transition={{ duration: 0.2 }}
                                                            >
                                                                <Check className="w-2 h-2 text-white" />
                                                            </motion.div>
                                                        )}
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </>
                        )}
                    </div>
                )}

                {/* Precio y botón */}
                <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 ${
                    isMobile ? 'gap-1.5 mt-0' : 'mt-1.5'
                }`}>
                    <div className={`flex flex-col ${isMobile ? 'w-full' : ''}`}>
                        {!isMobile && (
                            <span className="text-xs sm:text-sm text-gray-500 font-medium">Precio</span>
                        )}
                        <span className={`font-bold text-gray-900 ${
                            isMobile ? 'text-sm' : 'text-base sm:text-lg'
                        }`}>
                            {formattedPrice}
                        </span>
                    </div>

                    <div className="flex flex-col gap-1 w-full sm:w-auto">
                        {/* Mensaje de error cuando falta seleccionar */}
                        {isExpanded && hasColorSizeData && (!selectedColor || !selectedSize) && (
                            <span className={`text-red-600 font-medium ${
                                isMobile ? 'text-xs' : 'text-xs'
                            }`}>
                                {!selectedColor && !selectedSize 
                                    ? 'Selecciona color y talle'
                                    : !selectedColor 
                                    ? 'Selecciona un color'
                                    : 'Selecciona un talle'
                                }
                            </span>
                        )}
                        
                        <motion.button
                            className={`flex items-center justify-center space-x-2 rounded-lg font-medium transition-all duration-300 ${
                                isMobile 
                                    ? 'w-full px-2 py-1.5 text-xs' 
                                    : 'w-full sm:w-auto px-4 py-2.5 text-sm'
                            } ${
                                isAdding
                                    ? 'bg-green-600 text-white'
                                    : isExactVariantInCart
                                    ? 'bg-red-600 text-white hover:bg-red-700'
                                    : isInCartGeneric
                                    ? 'bg-gray-800 text-white'
                                    : (hasColorSizeData && isExpanded && (!selectedColor || !selectedSize))
                                    ? 'bg-gray-400 text-white cursor-not-allowed opacity-60'
                                    : (hasColorSizeData && (!selectedColor || !selectedSize)) || (group.totalVariants > 1 && !isExpanded)
                                    ? 'bg-black text-white hover:bg-gray-800'
                                    : 'bg-black text-white hover:bg-gray-800'
                            }`}
                            onClick={handleAddToCart}
                            disabled={isExpanded && hasColorSizeData && (!selectedColor || !selectedSize)}
                            whileHover={!(isExpanded && hasColorSizeData && (!selectedColor || !selectedSize)) ? { scale: 1.05 } : {}}
                            whileTap={!(isExpanded && hasColorSizeData && (!selectedColor || !selectedSize)) ? { scale: 0.95 } : {}}
                            animate={isAdding ? { scale: [1, 1.1, 1] } : {}}
                            transition={{ duration: 0.3 }}
                        >
                            <ShoppingCart className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} />
                            <span>
                                {isAdding
                                    ? 'Agregado!'
                                    : isExactVariantInCart
                                    ? 'Sumar'
                                    : isInCartGeneric
                                    ? 'En carrito'
                                    : (hasColorSizeData && isExpanded && (!selectedColor || !selectedSize))
                                    ? 'Selecciona opciones'
                                    : (hasColorSizeData && (!selectedColor || !selectedSize)) || (group.totalVariants > 1 && !isExpanded)
                                    ? 'Elegir'
                                    : 'Agregar'
                                }
                            </span>
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* Efecto de brillo en hover - Solo desktop */}
            {!isMobile && (
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 pointer-events-none"
                    animate={{
                        x: isHovered ? ["0%", "100%"] : "-100%",
                        opacity: isHovered ? [0, 0.8, 0] : 0,
                    }}
                    transition={{
                        duration: isHovered ? 0.8 : 0,
                        ease: "easeInOut",
                        delay: isHovered ? 0.1 : 0
                    }}
                />
            )}

            {/* Borde sutil en hover - Solo desktop */}
            {!isMobile && (
                <motion.div
                    className="absolute inset-0 rounded-lg border-2 border-gray-200 pointer-events-none"
                    animate={{
                        opacity: isHovered ? 1 : 0,
                        borderColor: isHovered ? "#e5e7eb" : "transparent"
                    }}
                    transition={{ duration: 0.4 }}
                />
            )}
        </motion.div>
    );
};

export default ProductCardGrouped;
