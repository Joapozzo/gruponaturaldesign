import React, { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Instagram, ArrowRight } from 'lucide-react';
import Section from './Section';
import Button from './ui/Button';
import Image from 'next/image';

const InstagramCTA = () => {
    const [isHovered, setIsHovered] = useState(false);
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true });

    const handleInstagramClick = () => {
        window.open('https://www.instagram.com/naturaldesign.ntds/', '_blank');
    };

    const mockPosts = [
        { id: 1, likes: '127', image: '/imgs/products/cardigan-tejido-de-dama-1.jpg' },
        { id: 2, likes: '89', image: '/imgs/products/chomba-manga-corta-unisex-cuello-camisa-de-jersey-2.jpg' },
        { id: 3, likes: '156', image: '/imgs/products/remera-base-unisex-2.jpg' },
        { id: 4, likes: '203', image: '/imgs/products/remera-escote-en-v-dama-1.jpg' },
    ];

    return (
        <Section
            id="instagram-cta"
            className="bg-gradient-to-br from-gray-50 via-white to-gray-50 relative px-10" 
            contentClassName="max-w-7xl mx-auto relative z-10 pb-20"
        >
            {/* Elementos decorativos de fondo */}
            <motion.div
                className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full blur-3xl opacity-30"
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            <motion.div
                className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full blur-3xl opacity-30"
                animate={{
                    scale: [1.2, 1, 1.2],
                    rotate: [90, 0, 90],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            <div ref={ref} className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
                {/* Contenido principal */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-8"
                >
                    {/* Header con icono animado */}
                    <motion.div
                        className="flex items-center space-x-4 mb-8"
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <motion.div
                            className="relative p-4 bg-gray-900 rounded-2xl shadow-lg"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Instagram className="w-8 h-8 text-white" />

                            {/* Partículas flotantes */}
                            <motion.div
                                className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"
                                animate={{
                                    scale: [0, 1, 0],
                                    y: [0, -10, -20],
                                    opacity: [0, 1, 0]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: 0.5
                                }}
                            />
                            <motion.div
                                className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-pink-400 rounded-full"
                                animate={{
                                    scale: [0, 1, 0],
                                    y: [0, 10, 20],
                                    opacity: [0, 1, 0]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: 1
                                }}
                            />
                        </motion.div>

                        <div>
                            <motion.div
                                className="flex items-center space-x-2"
                                initial={{ opacity: 0 }}
                                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                <span className="text-sm font-medium text-gray-500 tracking-wide uppercase">Síguenos en</span>
                                {/* <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <Sparkles className="w-4 h-4 text-pink-500" />
                                </motion.div> */}
                            </motion.div>
                            <motion.h3
                                className="text-2xl font-bold text-gray-900 font-display"
                                initial={{ opacity: 0, x: -20 }}
                                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                            >
                                @naturaldesign.ntds
                            </motion.h3>
                        </div>
                    </motion.div>

                    {/* Título principal */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 font-display leading-tight">
                            INSPIRACIÓN
                            <br />
                            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 bg-clip-text text-transparent">
                                DIARIA
                            </span>
                        </h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg"></div>
                    </motion.div>

                    {/* Descripción */}
                    <motion.div
                        className="space-y-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                        <p className="text-xl text-gray-700 leading-relaxed">
                            Descubrí nuestros últimos diseños, proyectos exclusivos y el proceso creativo detrás de cada prenda.
                        </p>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Únete a nuestra comunidad y mantente al día con tendencias, consejos de diseño y contenido exclusivo.
                        </p>
                    </motion.div>

                    {/* Estadísticas de Instagram */}
                    {/* <motion.div
                        className="grid grid-cols-3 gap-6 py-6"
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                    >
                        {[
                            { icon: Camera, number: "500+", label: "POSTS" },
                            { icon: Eye, number: "12K+", label: "SEGUIDORES" },
                            { icon: Heart, number: "25K+", label: "LIKES" }
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                className="text-center group"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.6, delay: 0.8 + (index * 0.1) }}
                                whileHover={{ y: -5 }}
                            >
                                <motion.div
                                    className="flex items-center justify-center w-12 h-12 bg-gray-100 hover:bg-gradient-to-br hover:from-pink-100 hover:to-purple-100 rounded-lg mx-auto mb-3 transition-all duration-300"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                >
                                    <stat.icon className="text-gray-700 group-hover:text-purple-600 transition-colors" size={20} />
                                </motion.div>
                                <div className="text-2xl font-bold text-gray-900 mb-1 font-display">
                                    {stat.number}
                                </div>
                                <div className="text-sm text-gray-500 font-medium tracking-wide">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div> */}

                    {/* Botón de acción */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.8, delay: 0.9 }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <Button
                            variant="black"
                            size="lg"
                            onClick={handleInstagramClick}
                            className="inline-flex items-center space-x-3 border-0 relative overflow-hidden group"
                        >
                            {/* <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                                initial={{ x: '-100%' }}
                                animate={isHovered ? { x: '100%' } : { x: '-100%' }}
                                transition={{ duration: 0.6 }}
                            /> */}
                            <Instagram className="w-5 h-5 relative z-10" />
                            <span className="relative z-10">SEGUIR EN INSTAGRAM</span>
                            <motion.div
                                animate={{ x: isHovered ? 5 : 0 }}
                                transition={{ duration: 0.3 }}
                                className="relative z-10"
                            >
                                <ArrowRight className="w-5 h-5" />
                            </motion.div>
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Mock feed de Instagram */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="relative"
                    onClick={handleInstagramClick}
                >
                    {/* Dispositivo móvil mockup */}
                    <motion.div
                        className="relative mx-auto max-w-sm"
                        whileHover={{ y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Marco del teléfono */}
                        <div className="relative bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
                            <div className="bg-black rounded-[2rem] p-1">
                                <div className="bg-white rounded-[1.5rem] overflow-hidden">
                                    {/* Header de Instagram */}
                                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                                        <div className="flex items-center space-x-3">
                                            <motion.div
                                                className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center"
                                                animate={{ rotate: [0, 360] }}
                                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                            >
                                                <Instagram className="w-4 h-4 text-white" />
                                            </motion.div>
                                            <span className="font-semibold text-gray-900 text-sm">naturaldesign.ntds</span>
                                        </div>
                                        <motion.div
                                            className="w-2 h-2 bg-green-400 rounded-full"
                                            animate={{
                                                scale: [1, 1.3, 1],
                                                opacity: [0.7, 1, 0.7]
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                        />
                                    </div>

                                    {/* Grid de posts */}
                                    <div className="grid grid-cols-2 gap-1 p-2">
                                        {mockPosts.map((post, index) => (
                                            <motion.div
                                                key={post.id}
                                                className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden group cursor-pointer"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                                                transition={{ duration: 0.6, delay: 0.6 + (index * 0.1) }}
                                                whileHover={{ scale: 0.95 }}
                                            >
                                                <Image
                                                    src={post.image}
                                                    alt={`Instagram post ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                    width={200}
                                                    height={200}
                                                />
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Bottom navigation */}
                                    <div className="flex justify-center py-3 border-t border-gray-100">
                                        <motion.div
                                            className="text-xs text-gray-500 text-center"
                                            animate={{ opacity: [0.5, 1, 0.5] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            Ver más contenido
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Elementos decorativos alrededor del teléfono */}
                        <motion.div
                            className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full opacity-60"
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 180, 360]
                            }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />

                        <motion.div
                            className="absolute -bottom-4 -right-4 w-8 h-8 bg-gradient-to-br from-orange-200 to-pink-200 rounded-full opacity-60"
                            animate={{
                                scale: [1.2, 1, 1.2],
                                rotate: [360, 180, 0]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />

                        {/* Partículas flotantes */}
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-2 h-2 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full opacity-40"
                                style={{
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                }}
                                animate={{
                                    y: [0, -20, 0],
                                    opacity: [0.4, 0.8, 0.4],
                                    scale: [0.5, 1, 0.5]
                                }}
                                transition={{
                                    duration: 3 + Math.random() * 2,
                                    repeat: Infinity,
                                    delay: Math.random() * 2,
                                    ease: "easeInOut"
                                }}
                            />
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </Section>
    );
};

export default InstagramCTA;