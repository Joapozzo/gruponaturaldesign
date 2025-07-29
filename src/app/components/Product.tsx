import React, { useState } from 'react';
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
    const router = useRouter();

    const handleProductClick = () => {
        router.push(`/producto/${product.id}`);
    };

    const handleQuickView = (e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`/producto/${product.id}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer mb-12"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleProductClick}
        >
            {/* Badge de destacado */}
            {product.destacado && (
                <div className="absolute top-3 left-3 z-10 bg-gray-800 text-white px-2 py-1 text-xs font-semibold flex items-center space-x-1 rounded-lg">
                    <Star size={10} fill="currentColor" />
                    <span>DESTACADO</span>
                </div>
            )}

            {/* Imagen del producto */}
            <div className="relative h-56 overflow-hidden rounded-t-lg">
                <motion.img
                    src={product.imagenes ? product.imagenes[0] : product.imagenes}
                    alt={product.nombre}
                    className="w-full h-full object-cover transition-all duration-500"
                    animate={{
                        scale: isHovered ? 1.05 : 1,
                        filter: isHovered ? "brightness(0.9)" : "brightness(1)",
                    }}
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

                {/* Botón de vista rápida */}
                <motion.div
                    className="absolute top-3 right-3 w-8 h-8 bg-white/20 rounded-lg backdrop-blur-sm flex items-center justify-center"
                    animate={{
                        scale: isHovered ? 1.1 : 1,
                        backgroundColor: isHovered ? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.2)",
                    }}
                    transition={{ duration: 0.3 }}
                    onClick={handleQuickView}
                >
                    <Eye className="w-4 h-4 text-white" />
                </motion.div>

                {/* Información overlay en hover */}
                <motion.div
                    className="absolute bottom-3 left-3 right-3 text-white"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                        opacity: isHovered ? 1 : 0,
                        y: isHovered ? 0 : 10,
                    }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg">
                            {product.categoriaIndumentaria || product.categoria}
                        </span>
                        <motion.div
                            className="flex items-center space-x-1 text-xs font-semibold"
                            whileHover={{ x: 3 }}
                        >
                            <span>VER</span>
                            <ArrowRight size={12} />
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Información del producto */}
            <div className="p-4">
                <div className="mb-1">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {product.categoriaIndumentaria || product.categoria}
                    </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors line-clamp-1">
                    {product.nombre}
                </h3>
                <p className="text-gray-600 text-sm mb-3 leading-relaxed line-clamp-2">
                    {product.descripcion}
                </p>
                <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-gray-900">
                        {product.precio}
                    </div>
                    <motion.button
                        className="bg-gray-700 hover:bg-gray-900 text-white px-3 py-2 text-xs font-semibold transition-all duration-300 flex items-center space-x-1 rounded-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleProductClick();
                        }}
                    >
                        <span>VER DETALLE</span>
                        <ArrowRight size={12} />
                    </motion.button>
                </div>
            </div>

            {/* Efecto de brillo en hover */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0 pointer-events-none"
                animate={{
                    x: isHovered ? ["0%", "100%"] : "0%",
                    opacity: isHovered ? [0, 1, 0] : 0,
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
            />
        </motion.div>
    );
};

export default Product;