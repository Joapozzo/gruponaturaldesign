"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import Section from '@/app/components/Section';
import { useRouter } from 'next/navigation';
import WholesaleBanner from '@/app/components/WholesaleBanner';
import { useWhatsApp } from '@/app/components/hooks/useWhatsApp';
import Button from '@/app/components/ui/Button';

export default function MayoristaPage() {
    const router = useRouter();
    const { openWhatsApp } = useWhatsApp({
        phoneNumber: "+5493517136311",
        defaultMessage: ""
    });

    const [formData, setFormData] = useState({
        provincia: '',
        ciudad: '',
        cantidad: '',
        tipoPrendas: '',
        cuit: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const beneficios = [
        'Precios especiales según cantidad',
        'Opciones de pago flexibles',
        'Atención personalizada',
        'Producción programada y logística a medida',
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpiar error al escribir
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.provincia.trim()) {
            newErrors.provincia = 'La provincia es requerida';
        }
        if (!formData.ciudad.trim()) {
            newErrors.ciudad = 'La ciudad es requerida';
        }
        if (!formData.cantidad.trim()) {
            newErrors.cantidad = 'La cantidad aproximada es requerida';
        }
        if (!formData.tipoPrendas.trim()) {
            newErrors.tipoPrendas = 'El tipo de prendas es requerido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Construir mensaje para WhatsApp con el formato solicitado
        let message = "¡Hola! Quiero uniformar a mi equipo 💼👕\n\n";
        message += "Completá los siguientes datos:\n\n";
        message += `📍 Provincia y Ciudad: ${formData.provincia}, ${formData.ciudad}\n`;
        message += `👥 Cantidad de prendas aproximadas: ${formData.cantidad}\n`;
        message += `👔 Tipo de prendas que buscan: ${formData.tipoPrendas}\n`;
        if (formData.cuit) {
            message += `🆔 CUIT: ${formData.cuit}\n`;
        }

        openWhatsApp(message);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Banner Full Screen */}
            <div className="relative">
                <WholesaleBanner fullScreen={true} />
                {/* Botón volver flotante */}
                <motion.button
                    onClick={() => router.back()}
                    className="absolute top-6 left-4 sm:left-6 z-20 flex items-center gap-2 bg-white/90 hover:bg-white text-[#Ed3237] px-4 py-2 rounded-lg font-semibold transition-colors shadow-lg backdrop-blur-sm"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm sm:text-base">Volver</span>
                </motion.button>
            </div>

            {/* Contenido principal */}
            <Section
                id="wholesale-content"
                className="py-8 sm:py-12 lg:py-16"
                contentClassName="max-w-4xl mx-auto"
            >
                <div className="space-y-6 sm:space-y-8">
                    {/* Beneficios */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-white p-6 sm:p-8 rounded-lg border border-gray-200"
                    >
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                            ✔ Beneficios para compras mayoristas:
                        </h2>
                        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                            {beneficios.map((beneficio, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="flex items-start gap-3"
                                >
                                    <CheckCircle2 className="w-5 h-5 text-[#Ed3237] flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700 text-sm sm:text-base">{beneficio}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Formulario de contacto mayorista */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-gray-50 p-6 sm:p-8 rounded-lg border border-gray-200"
                    >
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                            ¡Hola! Quiero uniformar a mi equipo 💼👕
                        </h2>
                        <p className="text-gray-700 mb-6">
                            Completá los siguientes datos:
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Provincia y Ciudad */}
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="provincia" className="block text-sm font-semibold text-gray-700 mb-2">
                                        📍 Provincia: *
                                    </label>
                                    <input
                                        type="text"
                                        id="provincia"
                                        name="provincia"
                                        value={formData.provincia}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#Ed3237] placeholder:text-gray-600 ${
                                            errors.provincia ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Ej: Córdoba"
                                    />
                                    {errors.provincia && (
                                        <p className="text-red-500 text-xs mt-1">{errors.provincia}</p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="ciudad" className="block text-sm font-semibold text-gray-700 mb-2">
                                        📍 Ciudad: *
                                    </label>
                                    <input
                                        type="text"
                                        id="ciudad"
                                        name="ciudad"
                                        value={formData.ciudad}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#Ed3237] placeholder:text-gray-600 ${
                                            errors.ciudad ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Ej: Córdoba Capital"
                                    />
                                    {errors.ciudad && (
                                        <p className="text-red-500 text-xs mt-1">{errors.ciudad}</p>
                                    )}
                                </div>
                            </div>

                            {/* Cantidad */}
                            <div>
                                <label htmlFor="cantidad" className="block text-sm font-semibold text-gray-700 mb-2">
                                    👥 Cantidad de prendas aproximadas: *
                                </label>
                                <input
                                    type="text"
                                    id="cantidad"
                                    name="cantidad"
                                    value={formData.cantidad}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#Ed3237] placeholder:text-gray-600 ${
                                        errors.cantidad ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Ej: 50 prendas"
                                />
                                {errors.cantidad && (
                                    <p className="text-red-500 text-xs mt-1">{errors.cantidad}</p>
                                )}
                            </div>

                            {/* Tipo de prendas */}
                            <div>
                                <label htmlFor="tipoPrendas" className="block text-sm font-semibold text-gray-700 mb-2">
                                    👔 Tipo de prendas que buscan: *
                                </label>
                                <textarea
                                    id="tipoPrendas"
                                    name="tipoPrendas"
                                    value={formData.tipoPrendas}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#Ed3237] placeholder:text-gray-600 ${
                                        errors.tipoPrendas ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Ej: Uniformes, remeras, pantalones..."
                                />
                                {errors.tipoPrendas && (
                                    <p className="text-red-500 text-xs mt-1">{errors.tipoPrendas}</p>
                                )}
                            </div>

                            {/* CUIT (opcional) */}
                            <div>
                                <label htmlFor="cuit" className="block text-sm font-semibold text-gray-700 mb-2">
                                    🆔 CUIT (opcional):
                                </label>
                                <input
                                    type="text"
                                    id="cuit"
                                    name="cuit"
                                    value={formData.cuit}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#Ed3237] placeholder:text-gray-600"
                                    placeholder="Ej: 20-12345678-9"
                                />
                            </div>

                            {/* Botón de envío */}
                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    variant="black"
                                    size="lg"
                                    fullWidth
                                    className="inline-flex items-center justify-center space-x-2"
                                >
                                    <span>CONTACTAR CON UN ASESOR</span>
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </Section>
        </div>
    );
}

