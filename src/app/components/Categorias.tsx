import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Plus } from 'lucide-react';

// Definir el tipo para las categorías
type Categoria = {
    id: string;
    nombre: string;
    descripcion: string;
    imagen: string;
    productos: {
        nombre: string;
        imagen: string;
    }[];
};

const categorias: Categoria[] = [
    {
        id: 'administrativo',
        nombre: 'ADMINISTRATIVO',
        descripcion: 'Elegancia corporativa para oficinas',
        imagen: '/imgs/1.png',
        productos: [
            { nombre: 'Camisa Poplin Hombre', imagen: '/imgs/2.png' },
            { nombre: 'Conjunto Sastrero', imagen: '/imgs/3.png' },
            { nombre: 'Blazer Corporativo', imagen: '/imgs/4.png' },
            { nombre: 'Pantalón Formal', imagen: '/imgs/5.png' }
        ]
    },
    {
        id: 'gastronomia',
        nombre: 'GASTRONOMÍA',
        descripcion: 'Uniformes profesionales para chefs',
        imagen: '/imgs/6.png',
        productos: [
            { nombre: 'Delantal Chef', imagen: '/imgs/7.png' },
            { nombre: 'Chaqueta Cocinero', imagen: '/imgs/8.png' },
            { nombre: 'Pantalón Cargo Chef', imagen: '/imgs/9.png' },
            { nombre: 'Mandil Camarero', imagen: '/imgs/10.png' }
        ]
    },
    {
        id: 'industrial',
        nombre: 'INDUSTRIAL',
        descripcion: 'Resistencia y seguridad laboral',
        imagen: '/imgs/11.png',
        productos: [
            { nombre: 'Mameluco Industrial', imagen: '/imgs/12.png' },
            { nombre: 'Camisa Trabajo', imagen: '/imgs/13.png' },
            { nombre: 'Pantalón Cargo', imagen: '/imgs/14.png' },
            { nombre: 'Chaleco Seguridad', imagen: '/imgs/15.png' }
        ]
    },
    {
        id: 'salud',
        nombre: 'SALUD',
        descripcion: 'Comodidad y profesionalismo médico',
        imagen: '/imgs/16.png',
        productos: [
            { nombre: 'Ambo Médico', imagen: '/imgs/17.png' },
            { nombre: 'Bata Laboratorio', imagen: '/imgs/18.png' },
            { nombre: 'Scrub Quirúrgico', imagen: '/imgs/19.png' },
            { nombre: 'Zapatillas Médicas', imagen: '/imgs/20.png' }
        ]
    },
    {
        id: 'casual',
        nombre: 'CASUAL',
        descripcion: 'Estilo relajado para ambientes informales',
        imagen: '/imgs/21.png',
        productos: [
            { nombre: 'Polo Casual', imagen: '/imgs/22.png' },
            { nombre: 'Chomba Micropiqué', imagen: '/imgs/23.png' },
            { nombre: 'Jean Corporativo', imagen: '/imgs/24.png' },
            { nombre: 'Buzo Empresarial', imagen: '/imgs/25.png' }
        ]
    },
    {
        id: 'merchandising',
        nombre: 'MERCHANDISING',
        descripcion: 'Prendas promocionales personalizadas',
        imagen: '/imgs/26.png',
        productos: [
            { nombre: 'Remera Estampada', imagen: '/imgs/27.png' },
            { nombre: 'Hoodie Corporativo', imagen: '/imgs/28.png' },
            { nombre: 'Gorra Promocional', imagen: '/imgs/29.png' },
            { nombre: 'Bolso Empresarial', imagen: '/imgs/30.png' }
        ]
    }
];

const Categorias = () => {
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
    // const [selectedCategory, setSelectedCategory] = useState<Categoria | null>(null);

    return (
        <section id="categorias" className="w-full bg-white">
            {/* Header Section */}
            <div className="px-4 sm:px-6 lg:px-12 py-20 text-center bg-gray-50">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-6xl md:text-8xl font-bold text-gray-900 mb-8 font-display">
                        NUESTRAS
                        <br />
                        <span className="text-red-500">CATEGORÍAS</span>
                    </h2>
                    <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                        Uniformes profesionales diseñados específicamente para cada sector, 
                        combinando funcionalidad, comodidad y estilo en cada prenda.
                    </p>
                </motion.div>
            </div>

            {/* Categorías Grid - Masonry Style */}
            <div className="w-full">
                {/* Primera fila - 2 columnas grandes */}
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    {categorias.slice(0, 2).map((categoria, index) => (
                        <motion.div
                            key={categoria.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: index * 0.2 }}
                            viewport={{ once: true }}
                            className="group relative overflow-hidden cursor-pointer"
                            onMouseEnter={() => setHoveredCategory(categoria.id)}
                            onMouseLeave={() => setHoveredCategory(null)}
                            // onClick={() => setSelectedCategory(categoria)}
                        >
                            {/* Imagen de fondo */}
                            <div className="relative h-[70vh] w-full overflow-hidden">
                                <motion.img
                                    src={categoria.imagen}
                                    alt={categoria.nombre}
                                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                                    animate={{
                                        scale: hoveredCategory === categoria.id ? 1.05 : 1,
                                        filter: hoveredCategory === categoria.id ? 'brightness(0.7)' : 'brightness(0.9)'
                                    }}
                                />
                                
                                {/* Overlay gradiente */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-all duration-500"></div>
                                
                                {/* Overlay de color de marca en hover */}
                                <motion.div 
                                    className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/20 transition-all duration-500"
                                    animate={{
                                        opacity: hoveredCategory === categoria.id ? 1 : 0
                                    }}
                                />
                            </div>

                            {/* Contenido de texto */}
                            <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12 text-white">
                                <motion.div
                                    animate={{
                                        y: hoveredCategory === categoria.id ? -10 : 0,
                                        opacity: 1
                                    }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h3 className="text-4xl lg:text-6xl font-bold mb-4 tracking-wider font-display">
                                        {categoria.nombre}
                                    </h3>
                                    <p className="text-lg lg:text-xl opacity-90 mb-6 max-w-md leading-relaxed">
                                        {categoria.descripcion}
                                    </p>
                                    
                                    {/* Botón de acción */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{
                                            opacity: hoveredCategory === categoria.id ? 1 : 0,
                                            x: hoveredCategory === categoria.id ? 0 : -20
                                        }}
                                        transition={{ duration: 0.3, delay: 0.1 }}
                                        className="flex items-center space-x-3"
                                    >
                                        <span className="text-lg font-semibold">EXPLORAR COLECCIÓN</span>
                                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                                    </motion.div>
                                </motion.div>
                            </div>

                            {/* Ícono de expansión */}
                            <motion.div
                                className="absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                                animate={{
                                    scale: hoveredCategory === categoria.id ? 1.1 : 1,
                                    backgroundColor: hoveredCategory === categoria.id ? 'rgba(239, 68, 68, 0.9)' : 'rgba(255, 255, 255, 0.2)'
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                <Plus className="w-6 h-6 text-white" />
                            </motion.div>
                        </motion.div>
                    ))}
                </div>

                {/* Segunda fila - 3 columnas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {categorias.slice(2, 5).map((categoria, index) => (
                        <motion.div
                            key={categoria.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: index * 0.15 }}
                            viewport={{ once: true }}
                            className="group relative overflow-hidden cursor-pointer"
                            onMouseEnter={() => setHoveredCategory(categoria.id)}
                            onMouseLeave={() => setHoveredCategory(null)}
                            // onClick={() => setSelectedCategory(categoria)}
                        >
                            {/* Imagen de fondo */}
                            <div className="relative h-[60vh] w-full overflow-hidden">
                                <motion.img
                                    src={categoria.imagen}
                                    alt={categoria.nombre}
                                    className="w-full h-full object-cover transition-all duration-700"
                                    animate={{
                                        scale: hoveredCategory === categoria.id ? 1.1 : 1,
                                        filter: hoveredCategory === categoria.id ? 'brightness(0.6)' : 'brightness(0.8)'
                                    }}
                                />
                                
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent group-hover:from-black/80 transition-all duration-500"></div>
                                
                                {/* Color overlay */}
                                <motion.div 
                                    className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/15 transition-all duration-500"
                                    animate={{
                                        opacity: hoveredCategory === categoria.id ? 1 : 0
                                    }}
                                />
                            </div>

                            {/* Contenido */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 text-white">
                                <motion.div
                                    animate={{
                                        y: hoveredCategory === categoria.id ? -5 : 0
                                    }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h3 className="text-2xl lg:text-3xl font-bold mb-3 tracking-wide font-display">
                                        {categoria.nombre}
                                    </h3>
                                    <p className="text-sm lg:text-base opacity-90 mb-4 leading-relaxed">
                                        {categoria.descripcion}
                                    </p>
                                    
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{
                                            opacity: hoveredCategory === categoria.id ? 1 : 0,
                                            scale: hoveredCategory === categoria.id ? 1 : 0.9
                                        }}
                                        transition={{ duration: 0.3 }}
                                        className="flex items-center space-x-2"
                                    >
                                        <span className="text-sm font-semibold">VER MÁS</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </motion.div>
                                </motion.div>
                            </div>

                            {/* Pequeño indicador */}
                            <motion.div
                                className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                                animate={{
                                    scale: hoveredCategory === categoria.id ? 1.2 : 1,
                                    backgroundColor: hoveredCategory === categoria.id ? 'rgba(239, 68, 68, 0.8)' : 'rgba(255, 255, 255, 0.2)'
                                }}
                            >
                                <Plus className="w-4 h-4 text-white" />
                            </motion.div>
                        </motion.div>
                    ))}
                </div>

                {/* Tercera fila - 1 columna full width */}
                <div className="w-full">
                    {categorias.slice(5, 6).map((categoria) => (
                        <motion.div
                            key={categoria.id}
                            initial={{ opacity: 0, scale: 0.98 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1 }}
                            viewport={{ once: true }}
                            className="group relative overflow-hidden cursor-pointer"
                            onMouseEnter={() => setHoveredCategory(categoria.id)}
                            onMouseLeave={() => setHoveredCategory(null)}
                            // onClick={() => setSelectedCategory(categoria)}
                        >
                            {/* Imagen de fondo */}
                            <div className="relative h-[50vh] lg:h-[60vh] w-full overflow-hidden">
                                <motion.img
                                    src={categoria.imagen}
                                    alt={categoria.nombre}
                                    className="w-full h-full object-cover transition-all duration-1000"
                                    animate={{
                                        scale: hoveredCategory === categoria.id ? 1.05 : 1,
                                        filter: hoveredCategory === categoria.id ? 'brightness(0.7)' : 'brightness(0.85)'
                                    }}
                                />
                                
                                {/* Overlay con patrón */}
                                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/80 group-hover:from-black/90 group-hover:via-black/50 group-hover:to-black/90 transition-all duration-700"></div>
                                
                                {/* Red overlay */}
                                <motion.div 
                                    className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/25 transition-all duration-700"
                                    animate={{
                                        opacity: hoveredCategory === categoria.id ? 1 : 0
                                    }}
                                />
                            </div>

                            {/* Contenido centrado */}
                            <div className="absolute inset-0 flex items-center justify-center text-white text-center">
                                <motion.div
                                    animate={{
                                        y: hoveredCategory === categoria.id ? -10 : 0,
                                        scale: hoveredCategory === categoria.id ? 1.05 : 1
                                    }}
                                    transition={{ duration: 0.5 }}
                                    className="max-w-4xl px-8"
                                >
                                    <h3 className="text-5xl lg:text-8xl font-bold mb-6 tracking-wider font-display">
                                        {categoria.nombre}
                                    </h3>
                                    <p className="text-xl lg:text-2xl opacity-90 mb-8 leading-relaxed">
                                        {categoria.descripcion}
                                    </p>
                                    
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{
                                            opacity: hoveredCategory === categoria.id ? 1 : 0,
                                            y: hoveredCategory === categoria.id ? 0 : 20
                                        }}
                                        transition={{ duration: 0.4, delay: 0.2 }}
                                        className="flex items-center justify-center space-x-4"
                                    >
                                        <span className="text-xl font-semibold">DESCUBRIR COLECCIÓN</span>
                                        <ArrowRight className="w-8 h-8 group-hover:translate-x-3 transition-transform duration-300" />
                                    </motion.div>
                                </motion.div>
                            </div>

                            {/* Decorative elements */}
                            <motion.div
                                className="absolute top-8 left-8 w-16 h-16 border-2 border-white/30 rounded-full flex items-center justify-center"
                                animate={{
                                    scale: hoveredCategory === categoria.id ? 1.2 : 1,
                                    borderColor: hoveredCategory === categoria.id ? 'rgba(239, 68, 68, 0.8)' : 'rgba(255, 255, 255, 0.3)'
                                }}
                            >
                                <Plus className="w-8 h-8 text-white" />
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gray-900 text-white py-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto px-8"
                >
                    <h3 className="text-4xl lg:text-6xl font-bold mb-6 font-display">
                        ¿NO ENCONTRÁS LO QUE BUSCÁS?
                    </h3>
                    <p className="text-xl mb-8 opacity-90">
                        Diseñamos uniformes personalizados para tu empresa. 
                        Más de 25 años creando soluciones únicas.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-red-500 hover:bg-red-600 text-white px-12 py-4 text-lg font-semibold tracking-wide transition-all duration-300 inline-flex items-center space-x-3"
                    >
                        <span>SOLICITAR DISEÑO PERSONALIZADO</span>
                        <ArrowRight className="w-6 h-6" />
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
};

export default Categorias;