'use client';

import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Award, Clock, Briefcase, ArrowRight } from 'lucide-react';
import Section from './Section';
import Button from '@/components/ui/Button';
import Image from 'next/image';

const NOSOTROS_IMAGES = [
    { src: '/imgs/sections/nosotros-1.jpg', alt: 'Equipo Natural Design - 1' },
    { src: '/imgs/sections/nosotros-2.jpg', alt: 'Equipo Natural Design - 2' },
] as const;

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
            className={`min-w-0 flex flex-col items-center justify-center py-4 px-2 transition-all duration-300 ${isHighlight
                    ? 'bg-[var(--red)] border border-[var(--red)] hover:bg-[var(--red-dark)] text-white'
                    : 'bg-gray-50 border border-gray-100 hover:border-gray-200 hover:bg-white'
                }`}
        >
            <div className="flex items-center justify-center w-8 h-8 mb-2">
                <Icon className={isHighlight ? 'text-white' : 'text-gray-600'} size={20} />
            </div>
            <span className={`text-2xl sm:text-3xl font-bold tabular-nums leading-none truncate max-w-full ${isHighlight ? 'text-white' : 'text-gray-900'
                }`}>
                {count}{suffix}
            </span>
            <span className={`text-[10px] sm:text-xs uppercase tracking-wider mt-1.5 text-center ${isHighlight ? 'text-white/90' : 'text-gray-500'
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
            padding="lg"
            animated={false}
            contentClassName="w-full px-4 lg:px-15"
        >
            <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:grid-rows-[auto_auto] lg:items-stretch lg:gap-x-12 lg:gap-y-6 w-full py-8 lg:py-12">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="flex flex-col justify-start gap-6 lg:col-start-2 lg:row-start-1 order-1"
                >
                    <div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 leading-tight">
                            Sobre nosotros
                        </h2>
                        <p className="text-sm md:text-base text-gray-600 leading-relaxed mt-3">
                            Más de 25 años vistiendo equipos con calidad.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <p className="text-base text-gray-800 leading-relaxed">
                            Especialistas en uniformes empresariales, ropa de trabajo y prendas promocionales en Córdoba. Asesoramiento integral y desarrollo de productos.
                        </p>
                        <p className="text-base text-gray-600 leading-relaxed">
                            Un buen diseño mejora la experiencia de tu equipo y crea un entorno seguro y motivador. Más de 25 años de experiencia nos respaldan. Más de 500 empresas ya nos eligieron.
                        </p>
                    </div>

                    <Button
                        variant="black"
                        size="md"
                        onClick={() => scrollToSection('contacto')}
                        className="tracking-wide inline-flex items-center gap-2 w-fit"
                    >
                        <span>Contactar</span>
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-2 gap-3 min-w-0 lg:col-start-2 lg:row-start-2 lg:self-end order-3"
                >
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
                    <StatCard
                        icon={Briefcase}
                        number={120}
                        suffix="+"
                        label="Proyectos"
                        delay={250}
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="flex flex-row w-full aspect-square overflow-hidden order-2 lg:col-start-1 lg:row-start-1 lg:row-span-2 lg:aspect-auto lg:h-full lg:min-h-0"
                >
                    {NOSOTROS_IMAGES.map((img, i) => (
                        <div key={img.src} className="relative flex-1 min-w-0 h-full">
                            <Image
                                src={img.src}
                                alt={img.alt}
                                fill
                                className="object-cover object-center"
                                priority={i === 0}
                                sizes="(min-width: 1024px) 29vw, 50vw"
                            />
                        </div>
                    ))}
                </motion.div>
            </div>
        </Section>
    );
};

export default Nosotros;
