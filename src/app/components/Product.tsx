import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ProductType } from '../types/producto';

interface ProductProps {
    product: ProductType;
    index: number;
}

const Product: React.FC<ProductProps> = ({ product, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const router = useRouter();

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
        router.push(`/producto/${product.id}`);
    };

    const handleQuickView = (e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`/producto/${product.id}`);
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
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className={`group relative overflow-hidden bg-white rounded-lg shadow-md transition-all duration-500 cursor-pointer mb-12 w-[370px] min-h-[550px] ${!isMobile ? 'hover:shadow-xl hover:scale-[1.02] hover:-translate-y-2' : ''
                }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleProductClick}
        >
            {/* Badge de destacado */}
            {product.destacado && (
                <motion.div
                    className="absolute top-6 left-4 z-10 text-white px-2 py-1 text-xs font-semibold flex items-center space-x-1 rounded-lg"
                    animate={!isMobile ? {
                        scale: isHovered ? 1.1 : 1,
                        backgroundColor: isHovered ? "#1f2937" : "#374151"
                    } : {}}
                    transition={{ duration: 0.3 }}
                >
                    <Star size={10} fill="currentColor" />
                    <span>DESTACADO</span>
                </motion.div>
            )}

            {/* Imagen del producto */}
            <div className="relative h-100 overflow-hidden rounded-t-lg">
                <motion.img
                    src={product.imagenes ? product.imagenes[0] : product.imagenes}
                    alt={product.nombre}
                    className="w-full h-full object-cover"
                    animate={!isMobile ? {
                        scale: isHovered ? 1.08 : 1,
                        filter: isHovered ? "brightness(0.85)" : "brightness(1)",
                    } : {}}
                    transition={{ duration: 0.5, ease: "easeOut" }}
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
                                {product.categoriaIndumentaria || product.categoria}
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
                        {product.categoriaIndumentaria || product.categoria}
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
                    {product.nombre}
                </motion.h3>

                <div className="flex items-center justify-between mt-2">
                    <motion.button
                        className="text-gray-600 text-sm font-light transition-all duration-300 flex items-center space-x-1 gap-3"
                        animate={!isMobile ? {
                            color: isHovered ? "#374151" : "#6b7280",
                            borderBottom: isHovered ? "1px solid #9ca3af" : "1px solid transparent",
                            paddingBottom: isHovered ? "4px" : "1px"
                        } : {}}
                        transition={{ duration: 0.4 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleProductClick();
                        }}
                    >
                        <motion.span
                            animate={!isMobile ? {
                                scale: isHovered ? 1.05 : 1
                            } : {}}
                            transition={{ duration: 0.3 }}
                        >
                            {product.precio}
                        </motion.span>
                        <motion.div
                            animate={!isMobile ? {
                                x: isHovered ? 3 : 0,
                                rotate: isHovered ? 5 : 0
                            } : {}}
                            transition={{ duration: 0.3 }}
                        >
                            <ArrowRight size={12} />
                        </motion.div>
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