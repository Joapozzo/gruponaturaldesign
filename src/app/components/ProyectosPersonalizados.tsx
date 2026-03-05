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
        hidden: { opacity: 0, y: 12 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.35 }
        }
    };

    return (
        <section className="py-10 bg-gray-50" id="marcas">
            <div className="w-full px-4 lg:px-15">
                {/* Título */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-8"
                >
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 font-display tracking-tight mb-2">
                        Empresas que confían en nosotros
                    </h2>
                    <p className="text-sm text-gray-600">
                        Más de 500 empresas líderes eligen nuestros uniformes personalizados
                    </p>
                </motion.div>

                {/* Grid de todas las marcas */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-30px" }}
                    variants={containerVariants}
                    className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 md:gap-3"
                >
                    {logosClientes.map((cliente) => (
                        <motion.div
                            key={cliente.nombre}
                            variants={itemVariants}
                            whileHover={{
                                y: -2,
                                transition: { duration: 0.2 }
                            }}
                            className="bg-gray-200 rounded-md shadow-sm hover:shadow-md transition-all duration-300 p-2 md:p-3 flex items-center justify-center aspect-square group cursor-pointer"
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

