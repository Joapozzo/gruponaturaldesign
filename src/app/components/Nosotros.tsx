'use client';

import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Award, Clock, ArrowRight } from 'lucide-react';
import Section from './Section';
import Button from './ui/Button';
import Image from 'next/image';

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
    /** Destacada: rojo o negro para que distinga */
    variant?: 'default' | 'highlight';
}

const StatCard: React.FC<StatCardProps> = ({
    icon: Icon,
    number,
    suffix = '',
    label,
    delay = 0,
    variant = 'default',
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

    const isHighlight = variant === 'highlight';

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4, delay: delay / 1000 }}
            className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-4 transition-all duration-300 ${
                isHighlight
                    ? 'bg-[var(--red)] border border-[var(--red)] hover:bg-[var(--red-dark)] text-white'
                    : 'bg-gray-50 border border-gray-100 hover:border-gray-200 hover:bg-white'
            }`}
        >
            <div className={`flex items-center justify-center w-10 h-10 rounded-xl mb-3 ${
                isHighlight ? 'bg-white/20' : 'bg-white border border-gray-100'
            }`}>
                <Icon className={isHighlight ? 'text-white' : 'text-gray-600'} size={20} />
            </div>
            <span className={`text-2xl font-semibold font-display tabular-nums ${
                isHighlight ? 'text-white' : 'text-gray-900'
            }`}>
                {count}{suffix}
            </span>
            <span className={`text-xs uppercase tracking-wider mt-1 ${
                isHighlight ? 'text-white/90' : 'text-gray-500'
            }`}>
                {label}
            </span>
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
            background="white"
            padding="none"
            contentClassName="w-full px-4 lg:px-15 py-8 lg:py-12"
        >
            {/* Desktop: 2 bloques 50/50, altura según contenido — Mobile: columna */}
            <div className="flex flex-col lg:grid lg:grid-cols-2 lg:items-stretch gap-6 lg:gap-10">
                {/* Bloque 1: Foto con leyenda SOBRE NOSOTROS (misma altura que el texto en desktop) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="relative w-full min-h-[260px] lg:min-h-0 lg:h-full order-1 overflow-hidden rounded-2xl"
                >
                    <Image
                        src="/imgs/nosotros.png"
                        alt="Equipo Natural Design"
                        className="absolute inset-0 w-full h-full object-cover object-top"
                        width={900}
                        height={900}
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-0 left-0 right-0 p-6 lg:p-8">
                        <span className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white font-display tracking-tight">
                            SOBRE NOSOTROS
                        </span>
                    </div>
                </motion.div>

                {/* Bloque 2: Texto + estadísticas en cards */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="flex flex-col justify-center py-4 lg:py-0 lg:px-6 xl:px-8 order-2"
                >
                    <div className="space-y-6">
                        <p className="text-base text-gray-800 leading-relaxed">
                            Especialistas en uniformes empresariales, ropa de trabajo y prendas promocionales en Córdoba. Asesoramiento integral y desarrollo de productos.
                        </p>
                        <p className="text-base text-gray-600 leading-relaxed">
                            Un buen diseño mejora la experiencia de tu equipo y crea un entorno seguro y motivador. Más de 25 años de experiencia nos respaldan. Más de 500 empresas ya nos eligieron.
                        </p>
                    </div>

                    {/* Grilla 3 cuadrados: una stat destacada en rojo */}
                    <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-8">
                        <StatCard
                            icon={Clock}
                            number={25}
                            suffix="+"
                            label="Años"
                            delay={100}
                        />
                        <StatCard
                            icon={Users}
                            number={500}
                            suffix="+"
                            label="Clientes"
                            delay={150}
                            variant="highlight"
                        />
                        <StatCard
                            icon={Award}
                            number={100}
                            suffix="%"
                            label="Calidad"
                            delay={200}
                        />
                    </div>

                    <Button
                        variant="black"
                        size="md"
                        onClick={() => scrollToSection('contacto')}
                        className="tracking-wide inline-flex items-center gap-2 w-fit mt-8"
                    >
                        <span>Contactar</span>
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </motion.div>
            </div>
        </Section>
    );
};

export default Nosotros;
