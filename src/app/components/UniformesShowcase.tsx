import { motion } from 'framer-motion';
import Image from 'next/image';

interface Brand {
    id: number;
    name: string;
    image: string;
}

const UniformesShowcase = () => {
    const brands: Brand[] = [
        {
            id: 1,
            name: "Coca Cola",
            image: "/imgs/products/coca.jpg",
        },
        {
            id: 2,
            name: "Stellantis",
            image: "/imgs/products/stellantis.jpg",
        },
        {
            id: 3,
            name: "Tarjeta Naranja",
            image: "/imgs/products/naranja.jpg",
        },
        {
            id: 4,
            name: "Reina Fabiola",
            image: "/imgs/products/fabiola.jpg",
        },
        {
            id: 5,
            name: "Horse",
            image: "/imgs/products/horse.jpg",
        },
        {
            id: 6,
            name: "CNH",
            image: "/imgs/products/cnh.jpg",
        }
    ];

    return (
        <section className="py-20 px-4 bg-white" id="proyectos-destacados">
            <div className="max-w-7xl mx-auto">
                {/* Título */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Proyectos Destacados
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Empresas líderes que confiaron en nosotros para representar su marca
                    </p>
                </motion.div>

                {/* Grid de catálogo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {brands.map((brand, index) => (
                        <motion.div
                            key={brand.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="relative group cursor-pointer"
                            whileHover={{ scale: 1.02 }}
                        >
                            {/* Imagen del uniforme */}
                            <div className="relative aspect-square bg-gray-200 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-500">
                                <Image
                                    src={brand.image}
                                    alt={`Uniforme para ${brand.name}`}
                                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                                    width={400}
                                    height={400}
                                />
                                {/* Overlay oscuro sutil */}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                                {/* Logo de la marca */}
                                <motion.div
                                    className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <span className="text-sm font-bold text-gray-900 tracking-wide">
                                        {brand.name}
                                    </span>
                                </motion.div>

                                {/* Badge de "Proyecto realizado" */}
                                <motion.div
                                    className="absolute bottom-4 right-4 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs font-medium tracking-wide opacity-0 group-hover:opacity-100 transition-all duration-500"
                                    initial={{ y: 10 }}
                                    whileHover={{ y: 0 }}
                                >
                                    PROYECTO REALIZADO
                                </motion.div>
                            </div>

                            {/* Nombre de la marca debajo */}
                            <motion.div
                                className="text-center mt-4"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                                viewport={{ once: true }}
                            >
                                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                                    {brand.name}
                                </h4>
                                <p className="text-sm text-gray-600">
                                    Uniformes corporativos
                                </p>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default UniformesShowcase;

