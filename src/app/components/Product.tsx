import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Eye, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ProductWithImage } from '../types/producto';
import { getFirstProductImage, nombreToSlug } from '@/app/(pages)/producto/[id]/helpers/productHelpers';
import { useCart } from './hooks/useCart';

interface ProductProps {
    product: ProductWithImage;
    index: string;
}

const Product: React.FC<ProductProps> = ({ product, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const router = useRouter();
    const { addToCart, isInCart } = useCart();
    
    // Detectar si es mobile
    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    const handleProductClick = () => {
        router.push(`/producto/${product.Codigo}`);
    };

    const handleQuickView = (e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`/producto/${product.Codigo}`);
    };

    // Función helper para convertir Codigo a número
    const getNumericId = (codigo: string): number => {
        return !isNaN(Number(codigo)) 
            ? Number(codigo) 
            : codigo.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsAdding(true);

        const numericId = getNumericId(product.Codigo);

        addToCart({
            id: numericId,
            nombre: product.Descripcion || product.NOMBRE || product.Codigo || '',
            descripcion: product.Descripcion || product.NOMBRE || product.Codigo || '',
            imagen: (Array.isArray(product.imagen) ? product.imagen[0] : product.imagen) || product.imagenes?.[0] || '',
            precio: parseFloat((product.PrecioVenta?.toString() || '0').replace(/[^0-9.-]+/g, '')),
            categoria: product.Rubro || product.Subrubro || '',
        }, 1);

        // Animación de feedback
        setTimeout(() => setIsAdding(false), 1000);
    };

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

    return (
        <motion.div
            initial={!isMobile ? { opacity: 0, y: 50 } : { opacity: 1, y: 0 }}
            whileInView={!isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            transition={!isMobile ? { duration: 0.6, delay: Number(index) * 0.1 } : { duration: 0 }}
            viewport={{ once: true }}
            className={`group relative overflow-hidden bg-white rounded-lg shadow-md transition-all duration-500 cursor-pointer mb-12 md:w-[370px] w-[340px] min-h-[550px] ${!isMobile ? 'hover:shadow-xl hover:scale-[1.02] hover:-translate-y-2' : ''
                }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleProductClick}
        >
            {/* Badge de destacado */}
            {(product as any).destacado && (
                <motion.div
                    className="absolute top-6 left-4 z-10 text-white px-2 py-1 text-xs font-semibold flex items-center space-x-1 rounded-lg"
                    animate={{
                        scale: isHovered ? 1.1 : 1,
                        backgroundColor: isHovered ? "#1f2937" : "#374151"
                    }}
                    transition={{ duration: 0.3 }}
                >
                    <Star size={10} fill="currentColor" />
                    <span>DESTACADO</span>
                </motion.div>
            )}

            {/* Imagen del producto */}
            <div className="relative h-100 overflow-hidden rounded-t-lg">
                <motion.img
                    src={
                        (Array.isArray(product.imagen) ? product.imagen[0] : product.imagen) || 
                        product.imagenes?.[0] || 
                        (product.NOMBRE ? getFirstProductImage(product.NOMBRE) : '') ||
                        (product.Descripcion ? getFirstProductImage(product.Descripcion) : '') ||
                        '/imgs/producto-placeholder.png'
                    }
                    alt={product.Descripcion || product.NOMBRE || product.Codigo || ''}
                    className="w-full h-full object-cover"
                    animate={!isMobile ? {
                        scale: isHovered ? 1.08 : 1,
                        filter: isHovered ? "brightness(0.85)" : "brightness(1)",
                    } : {}}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    onError={(e) => {
                        // Si la imagen no existe, intentar con la primera imagen del producto
                        const target = e.target as HTMLImageElement;
                        const productName = product.NOMBRE || product.Descripcion;
                        if (productName) {
                            target.src = getFirstProductImage(productName);
                        } else {
                            target.src = '/imgs/producto-placeholder.png';
                        }
                    }}
                />

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
                    className="absolute top-5 right-3 w-8 h-8 bg-white/20 rounded-lg backdrop-blur-sm flex items-center justify-center"
                    style={{ overflow: 'visible' }}
                    animate={!isMobile ? {
                        scale: isHovered ? 1.05 : 1, // Cambié de 1.15 a 1.05
                        backgroundColor: isHovered ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.2)",
                        rotate: isHovered ? 10 : 0
                    } : {}}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    onClick={handleQuickView}
                >
                    <Eye className="w-4 h-4 text-white" />
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
                                {product.Rubro || product.Subrubro || ''}
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
                className="p-4 flex flex-col justify-between gap-1"
                animate={!isMobile ? {
                    backgroundColor: isHovered ? "#f9fafb" : "#ffffff"
                } : {}}
                transition={{ duration: 0.4 }}
            >
                <div className="">
                    <motion.span
                        className="text-xs font-medium text-gray-500 uppercase tracking-wide"
                        animate={!isMobile ? {
                            color: isHovered ? "#6b7280" : "#9ca3af",
                            letterSpacing: isHovered ? "0.1em" : "0.05em"
                        } : {}}
                        transition={{ duration: 0.3 }}
                    >
                        {product.Rubro || product.Subrubro || ''}
                    </motion.span>
                </div>
                <motion.h3
                    className="text-sm font-medium text-gray-900 transition-colors w-full"
                    animate={!isMobile ? {
                        color: isHovered ? "#111827" : "#1f2937",
                        scale: isHovered ? 1.02 : 1
                    } : {}}
                    transition={{ duration: 0.3 }}
                >
                    {product.Descripcion || product.NOMBRE || product.Codigo}
                </motion.h3>

                <div className="flex items-center justify-between mt-3 gap-2">
                    {/* <div className="flex flex-col">
                        <span className="text-xs text-gray-500 font-medium">Precio</span>
                        <span className="text-lg font-bold text-gray-900">
                            {product.precio}
                        </span>
                    </div> */}

                    <motion.button
                        className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${isAdding
                                ? 'bg-green-600 text-white'
                                : isInCart(getNumericId(product.Codigo))
                                    ? 'bg-gray-800 text-white'
                                    : 'bg-black text-white hover:bg-gray-800'
                            }`}
                        onClick={handleAddToCart}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        animate={isAdding ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 0.3 }}
                    >
                        <ShoppingCart className="w-4 h-4" />
                        <span>{isAdding ? 'Agregado!' : isInCart(getNumericId(product.Codigo)) ? 'En carrito' : 'Agregar'}</span>
                    </motion.button>
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

export default Product;