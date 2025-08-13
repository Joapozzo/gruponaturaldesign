import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Award, Clock, ArrowRight } from 'lucide-react';
import Section from './Section';
import Button from './ui/Button';
import Image from 'next/image';
import BrandsSlider from './BrandSlider';

// Hook para animar números
const useCountAnimation = (end: number, duration = 2000, start = 0) => {
    const [count, setCount] = useState(start);
    const [hasAnimated, setHasAnimated] = useState(false);

    const animate = () => {
        if (hasAnimated) return;
        setHasAnimated(true);

        const startTime = Date.now();
        const timer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (end - start) * easeOutQuart);

            setCount(current);

            if (progress >= 1) {
                clearInterval(timer);
                setCount(end);
            }
        }, 16);
    };

    return { count, animate, hasAnimated };
};

interface StatCardProps {
    icon: React.ElementType;
    number: number;
    suffix?: string;
    label: string;
    delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({
    icon: Icon,
    number,
    suffix = "",
    label,
    delay = 0
}) => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true });
    const { count, animate } = useCountAnimation(number);

    useEffect(() => {
        if (isInView) {
            const timer = setTimeout(animate, delay);
            return () => clearTimeout(timer);
        }
    }, [isInView, animate, delay]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: delay / 1000 }}
            className="text-center group"
        >
            <motion.div
                className="relative mb-6"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex items-center justify-center w-16 h-16 bg-gray-100 hover:bg-gray-200 rounded-lg mx-auto mb-4 transition-all duration-300 group-hover:shadow-md">
                    <Icon className="text-gray-700 group-hover:text-gray-900 transition-colors" size={24} />
                </div>
            </motion.div>

            <motion.div
                className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2 font-display"
                animate={isInView ? {
                    scale: [1, 1.05, 1],
                    opacity: [0.7, 1, 1]
                } : {}}
                transition={{ duration: 0.6, delay: (delay / 1000) + 0.4 }}
            >
                {count}{suffix}
            </motion.div>

            <div className="text-sm text-gray-500 font-medium tracking-wide uppercase">
                {label}
            </div>
        </motion.div>
    );
};

const Nosotros = () => {
    const scrollToSection = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <Section
            id="nosotros"
            contentClassName='max-w-7xl mx-auto pb-20 px-10 '
        >
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
                {/* Contenido de texto */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="space-y-8"
                >
                    {/* Título principal */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-display leading-tight">
                            NATURAL DESIGN
                        </h2>
                        <div className="w-20 h-1 bg-gray-300 rounded-lg"></div>
                    </motion.div>

                    {/* Descripción principal */}
                    <motion.p
                        className="text-xl text-gray-700 leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        viewport={{ once: true }}
                    >
                        Somos una empresa especializada en uniformes empresariales, ropa de trabajo y prendas promocionales con sede en Córdoba. Nuestra principal característica es el asesoramiento integral y el desarrollo de productos.
                    </motion.p>

                    {/* Descripción secundaria */}
                    <motion.div
                        className="space-y-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Un buen diseño puede mejorar la experiencia de tu equipo creando un entorno seguro y motivador. Más de 25 años de experiencia nos respaldan.
                        </p>
                        <p className="text-lg text-gray-800 font-medium">
                            ¿Querés ser parte de nuestros clientes satisfechos? Contactanos y descubrí por qué más de 500 empresas ya nos eligieron.
                        </p>
                    </motion.div>

                    {/* Estadísticas */}
                    <motion.div
                        className="grid grid-cols-3 gap-8 py-8"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <StatCard
                            icon={Clock}
                            number={25}
                            suffix="+"
                            label="Años de experiencia"
                            delay={200}
                        />
                        <StatCard
                            icon={Users}
                            number={500}
                            suffix="+"
                            label="Clientes satisfechos"
                            delay={400}
                        />
                        <StatCard
                            icon={Award}
                            number={100}
                            suffix="%"
                            label="Calidad garantizada"
                            delay={600}
                        />
                    </motion.div>

                    {/* Botones de acción */}
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.0 }}
                        viewport={{ once: true }}
                    >
                        <Button
                            variant="black"
                            size="lg"
                            onClick={() => scrollToSection('contacto')}
                            className="tracking-wide inline-flex items-center space-x-3"
                        >
                            <span>CONOCER MÁS</span>
                            <ArrowRight className="w-5 h-5" />
                        </Button>

                        <Button
                            variant="grayOutline"
                            size="lg"
                            onClick={() => scrollToSection('categorias')}
                            className="tracking-wide inline-flex items-center space-x-3"
                        >
                            <span>VER PRODUCTOS</span>
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Imagen */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="relative"
                >
                    <div className="relative group">
                        {/* Imagen principal */}
                        <motion.div
                            className="relative overflow-hidden rounded-lg shadow-xl group-hover:shadow-2xl transition-all duration-500"
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="aspect-[4/5] bg-gray-200">
                                <Image
                                    src="/imgs/nosotros.jpg"
                                    alt="Equipo Natural Design"
                                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                                    width={20000}
                                    height={2000}
                                />
                                {/* Overlay sutil */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                            </div>
                        </motion.div>

                        {/* Badge flotante */}
                        <motion.div
                            className="absolute -bottom-6 -left-6 bg-gray-900 text-white p-6 rounded-lg shadow-xl"
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="text-lg font-bold mb-1 font-display">NATURAL DESIGN</div>
                            <div className="text-sm text-gray-300 tracking-wide">CALIDAD Y DISEÑO</div>

                            {/* Indicador de estado */}
                            <motion.div
                                className="absolute top-3 right-3 w-3 h-3 bg-green-400 rounded-full"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.7, 1, 0.7]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                        </motion.div>

                        {/* Elementos decorativos */}
                        <motion.div
                            className="absolute -top-4 -right-4 w-24 h-24 bg-gray-100 rounded-lg -z-10"
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            viewport={{ once: true }}
                        />

                        <motion.div
                            className="absolute -bottom-4 -right-8 w-16 h-16 bg-gray-200 rounded-lg -z-10"
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.7 }}
                            viewport={{ once: true }}
                        />
                    </div>
                </motion.div>
            </div>
            <BrandsSlider/>
        </Section>
    );
};

export default Nosotros;