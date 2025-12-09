import { motion } from 'framer-motion';
import { logosClientes } from '../data/marcas';

const ProyectosPersonalizados = () => {

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.4
            }
        }
    };

    return (
        <section className="py-16 px-4 bg-gray-50" id="marcas">
            <div className="max-w-7xl mx-auto">
                {/* Título */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        Empresas que confían en nosotros
                    </h2>
                    <p className="text-gray-600">
                        Más de 500 empresas líderes eligen nuestros uniformes personalizados
                    </p>
                </motion.div>

                {/* Grid de todas las marcas - Más compacto */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={containerVariants}
                    className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4"
                >
                    {logosClientes.map((cliente) => (
                        <motion.div
                            key={cliente.nombre}
                            variants={itemVariants}
                            whileHover={{ 
                                y: -3,
                                transition: { duration: 0.2 }
                            }}
                            className="bg-gray-200 rounded-md shadow-sm hover:shadow-md transition-all duration-300 p-3 md:p-4 flex items-center justify-center aspect-square group cursor-pointer"
                        >
                            <div className="w-full h-full flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                                {cliente.logo}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default ProyectosPersonalizados;

