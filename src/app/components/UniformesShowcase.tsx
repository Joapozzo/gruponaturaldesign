'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface Brand {
    id: number;
    name: string;
    image: string;
}

const brands: Brand[] = [
    { id: 1, name: 'Coca Cola', image: '/imgs/products/coca.jpg' },
    { id: 2, name: 'Stellantis', image: '/imgs/products/stellantis.jpg' },
    { id: 3, name: 'Tarjeta Naranja', image: '/imgs/products/naranja.jpg' },
    { id: 4, name: 'Reina Fabiola', image: '/imgs/products/fabiola.jpg' },
    { id: 5, name: 'Horse', image: '/imgs/products/horse.jpg' },
    { id: 6, name: 'CNH', image: '/imgs/products/cnh.jpg' },
];

const UniformesShowcase = () => {
    return (
        <section className="bg-white" id="proyectos-destacados">
            {/* Desktop: 2 rows × 3 cols, cada row 100vh, sin separación. Mobile: 1 col, altura auto. */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:grid-rows-[100vh_100vh]">
                {brands.map((brand, index) => (
                    <motion.div
                        key={brand.id}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="relative group cursor-pointer overflow-hidden min-h-[50vh] lg:min-h-0"
                    >
                        {/* Imagen a full width/height del cell */}
                        <Image
                            src={brand.image}
                            alt={brand.name}
                            fill
                            sizes="(max-width: 1023px) 100vw, 33.33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Overlay sutil solo abajo para leer la marca */}
                        <div
                            className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pt-12 pb-3 pl-3 pr-3
                                       opacity-100 transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100"
                        />
                        {/* Nombre de la marca: abajo a la izquierda, sobre la img */}
                        <div
                            className="absolute bottom-3 left-3 right-3 z-10
                                       opacity-100 transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100"
                        >
                            <span className="text-sm font-semibold text-white tracking-wide drop-shadow-md md:text-base">
                                {brand.name}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default UniformesShowcase;
