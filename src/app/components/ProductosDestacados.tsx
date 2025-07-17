import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Eye } from 'lucide-react';

const productos = [
    {
        id: 1,
        nombre: 'CAMISA EXECUTIVE',
        categoria: 'Administrativo',
        descripcion: 'Elegancia corporativa premium',
        imagen: '/imgs/38.png',
        precio: 'Consultar',
        destacado: true
    },
    {
        id: 2,
        nombre: 'DELANTAL CHEF PRO',
        categoria: 'Gastronomía',
        descripcion: 'Resistencia y estilo profesional',
        imagen: '/imgs/39.png',
        precio: 'Consultar',
        destacado: false
    },
    {
        id: 3,
        nombre: 'MAMELUCO INDUSTRIAL',
        categoria: 'Industrial',
        descripcion: 'Máxima protección y durabilidad',
        imagen: '/imgs/46.png',
        precio: 'Consultar',
        destacado: true
    },
    {
        id: 4,
        nombre: 'AMBO MÉDICO PLUS',
        categoria: 'Salud',
        descripcion: 'Comodidad y profesionalismo',
        imagen: '/imgs/41.png',
        precio: 'Consultar',
        destacado: false
    },
    {
        id: 5,
        nombre: 'POLO CORPORATE',
        categoria: 'Casual',
        descripcion: 'Versatilidad empresarial',
        imagen: '/imgs/42.png',
        precio: 'Consultar',
        destacado: true
    },
    {
        id: 6,
        nombre: 'HOODIE PREMIUM',
        categoria: 'Merchandising',
        descripcion: 'Marca y comodidad unidos',
        imagen: '/imgs/43.png',
        precio: 'Consultar',
        destacado: false
    }
];

const ProductosDestacados = () => {
    const [hoveredProduct, setHoveredProduct] = useState(null);

    return (
        <section id="productos" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 font-display">
                        PRODUCTOS
                        <br />
                        <span className="text-red-500">DESTACADOS</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Lo mejor de nuestro catálogo en diseño, calidad y funcionalidad.
                        Cada prenda diseñada para destacar en su sector.
                    </p>
                </motion.div>

                {/* Grid de productos - 3 columnas para imágenes más grandes */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {productos.map((producto, index) => (
                        <motion.div
                            key={producto.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative overflow-hidden bg-white  shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
                            onMouseEnter={() => setHoveredProduct(producto.id)}
                            onMouseLeave={() => setHoveredProduct(null)}
                        >
                            {/* Badge de destacado */}
                            {producto.destacado && (
                                <div className="absolute top-4 left-4 z-10 bg-red-500 text-white px-3 py-1 text-xs font-semibold flex items-center space-x-1">
                                    <Star size={12} fill="currentColor" />
                                    <span>DESTACADO</span>
                                </div>
                            )}

                            {/* Imagen del producto */}
                            <div className="relative h-80 overflow-hidden">
                                <motion.img
                                    src={producto.imagen}
                                    alt={producto.nombre}
                                    className="w-full h-full object-cover transition-all duration-700"
                                    animate={{
                                        scale: hoveredProduct === producto.id ? 1.1 : 1,
                                        filter:
                                            hoveredProduct === producto.id
                                                ? "brightness(0.8)"
                                                : "brightness(1)",
                                    }}
                                />

                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                                {/* Overlay de color */}
                                <motion.div
                                    className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/20 transition-all duration-500"
                                    animate={{
                                        opacity: hoveredProduct === producto.id ? 1 : 0,
                                    }}
                                />

                                {/* Botón de vista rápida */}
                                <motion.div
                                    className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full backdrop-blur-sm flex items-center justify-center"
                                    animate={{
                                        scale: hoveredProduct === producto.id ? 1.1 : 1,
                                        backgroundColor:
                                            hoveredProduct === producto.id
                                                ? "rgba(239, 68, 68, 0.9)"
                                                : "rgba(255, 255, 255, 0.2)",
                                    }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Eye className="w-5 h-5 text-white" />
                                </motion.div>

                                {/* Información overlay en hover */}
                                <motion.div
                                    className="absolute bottom-4 left-4 right-4 text-white"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{
                                        opacity: hoveredProduct === producto.id ? 1 : 0,
                                        y: hoveredProduct === producto.id ? 0 : 20,
                                    }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold bg-white/20 backdrop-blur-sm px-3 py-1 ">
                                            {producto.categoria}
                                        </span>
                                        <motion.div
                                            className="flex items-center space-x-2 text-sm font-semibold"
                                            whileHover={{ x: 5 }}
                                        >
                                            <span>VER DETALLES</span>
                                            <ArrowRight size={16} />
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Información del producto */}
                            <div className="p-6">
                                <div className="mb-2">
                                    <span className="text-xs font-semibold text-red-500 uppercase tracking-wide">
                                        {producto.categoria}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                                    {producto.nombre}
                                </h3>

                                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                    {producto.descripcion}
                                </p>

                                <div className="flex items-center justify-between">
                                    <div className="text-lg font-bold text-gray-900">
                                        {producto.precio}
                                    </div>

                                    <motion.button
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 text-sm font-semibold transition-all duration-300 flex items-center space-x-2"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <span>COTIZAR</span>
                                        <ArrowRight size={14} />
                                    </motion.button>
                                </div>
                            </div>

                            {/* Efecto de brillo en hover */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0"
                                animate={{
                                    x: hoveredProduct === producto.id ? ["0%", "100%"] : "0%",
                                    opacity: hoveredProduct === producto.id ? [0, 1, 0] : 0,
                                }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="text-center mt-16"
                >
                    <motion.button
                        className="bg-[var(--black)] hover:bg-red-500 text-white px-8 py-4 text-lg font-semibold transition-all duration-300 inline-flex items-center space-x-3 shadow-lg hover:shadow-xl"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span>VER CATÁLOGO COMPLETO</span>
                        <ArrowRight className="w-5 h-5" />
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
};

export default ProductosDestacados;