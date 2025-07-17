import React from 'react';
import { motion } from 'framer-motion';
import { Users, Award, Clock } from 'lucide-react';
import { useNavigation } from '../hooks/useNavigation';
import Image from 'next/image';


const Nosotros = () => {

    const { scrollToSection } = useNavigation();

    return (
        <section id="nosotros" className="py-20 bg-[var(--gray-bg)]" >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-5xl font-bold text-[var(--black)] mb-8">
                            NATURAL DESIGN
                        </h2>
                        <p className="text-xl text-[var(--gray-medium)] mb-8 leading-relaxed">
                            Somos una empresa especializada en uniformes empresariales, ropa de trabajo y prendas promocionales
                            con sede en Córdoba. Más de 25 años de experiencia nos respaldan.
                        </p>
                        <p className="text-lg text-[var(--gray-medium)] mb-10 leading-relaxed">
                            Nuestra principal característica es el asesoramiento integral y el desarrollo de uniformes de diseño,
                            acompañando al cliente desde la selección del tejido hasta el producto final.
                        </p>

                        <div className="grid grid-cols-3 gap-8 mb-10">
                            <div className="text-center">
                                <div className="flex items-center justify-center w-20 h-20 bg-[var(--red)] rounded-full mx-auto mb-4">
                                    <Clock className="text-white" size={32} />
                                </div>
                                <div className="text-3xl font-bold text-[var(--black)]">25+</div>
                                <div className="text-sm text-[var(--gray-medium)] font-medium">AÑOS DE EXPERIENCIA</div>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center w-20 h-20 bg-[var(--red)] rounded-full mx-auto mb-4">
                                    <Users className="text-white" size={32} />
                                </div>
                                <div className="text-3xl font-bold text-[var(--black)]">500+</div>
                                <div className="text-sm text-[var(--gray-medium)] font-medium">CLIENTES SATISFECHOS</div>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center w-20 h-20 bg-[var(--red)] rounded-full mx-auto mb-4">
                                    <Award className="text-white" size={32} />
                                </div>
                                <div className="text-3xl font-bold text-[var(--black)]">100%</div>
                                <div className="text-sm text-[var(--gray-medium)] font-medium">CALIDAD GARANTIZADA</div>
                            </div>
                        </div>

                        <button
                            onClick={() => scrollToSection('contacto')}
                            className="bg-[var(--red)] hover:bg-[var(--red-dark)] text-white px-8 py-4 font-semibold tracking-wide transition-all transform hover:scale-105"
                        >
                            CONOCER MÁS
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <Image
                            src="/imgs/46.png"
                            alt="Equipo NTDS"
                            className="w-full h-96 object-cover shadow-2xl"
                            width={300}
                            height={300}
                        />
                        <div className="absolute -bottom-6 -left-6 bg-[var(--red)] text-white p-8 shadow-xl">
                            <div className="text-2xl font-bold">NATURAL DESIGN</div>
                            <div className="text-sm opacity-90 tracking-wide">CALIDAD Y DISEÑO EN UNIFORMES</div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default Nosotros;