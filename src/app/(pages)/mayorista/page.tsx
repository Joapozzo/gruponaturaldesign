"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    CheckCircle2,
    MapPin,
    Users,
    Shirt,
    CreditCard,
    User,
    Mail,
    Phone,
    Briefcase
} from 'lucide-react';
import Section from '@/app/components/Section';
import ErrorBoundary from '@/app/components/ErrorBoundary';
import HeroMayorista from '@/app/components/HeroMayorista';
import { useWhatsApp } from '@/app/components/hooks/useWhatsApp';
import Button from '@/app/components/ui/Button';
import Input, { TextArea } from '@/app/components/ui/Input';

export default function MayoristaPage() {
    const { openWhatsApp } = useWhatsApp({
        defaultMessage: ""
    });

    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        mail: '',
        telefono: '',
        provincia: '',
        ciudad: '',
        cantidad: '',
        tipoPrendas: '',
        cuit: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const beneficios = [
        'Hasta 40% OFF',
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

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido';
        }
        if (!formData.apellido.trim()) {
            newErrors.apellido = 'El apellido es requerido';
        }
        if (!formData.mail.trim()) {
            newErrors.mail = 'El email es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.mail)) {
            newErrors.mail = 'El email no es válido';
        }
        if (!formData.telefono.trim()) {
            newErrors.telefono = 'El teléfono es requerido';
        }
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
        let message = "¡Hola! Quiero uniformar a mi equipo\n\n";
        message += "Datos de contacto:\n";
        message += `Nombre: ${formData.nombre}\n`;
        message += `Apellido: ${formData.apellido}\n`;
        message += `Email: ${formData.mail}\n`;
        message += `Teléfono: ${formData.telefono}\n\n`;
        message += "Información del pedido:\n";
        message += `Provincia y Ciudad: ${formData.provincia}, ${formData.ciudad}\n`;
        message += `Cantidad de prendas aproximadas: ${formData.cantidad}\n`;
        message += `Tipo de prendas que buscan: ${formData.tipoPrendas}\n`;
        if (formData.cuit) {
            message += `CUIT: ${formData.cuit}\n`;
        }

        openWhatsApp(message);
    };

    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-white">
                <HeroMayorista />

                {/* Contenido principal: row — beneficios izquierda, form derecha */}
                <Section
                    id="wholesale-content"
                    className="py-6 sm:py-8 lg:py-10"
                    contentClassName="w-full px-4 lg:px-15"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
                        {/* Beneficios — izquierda */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="lg:col-span-5 flex flex-col"
                        >
                            <div className="bg-gray-100 p-5 sm:p-6 rounded-xl border border-gray-200 shadow-inner">
                                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 font-display tracking-tight mb-3 sm:mb-4">
                                    ✔ Beneficios para compras mayoristas
                                </h2>
                                <div className="flex flex-col gap-2 sm:gap-3">
                                    {beneficios.map((beneficio, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                            className="flex items-start gap-2"
                                        >
                                            <CheckCircle2 className="w-4 h-4 text-[#Ed3237] flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700 text-xs sm:text-sm">{beneficio}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Formulario — derecha */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="lg:col-span-7 flex flex-col"
                        >
                            <div className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-md h-full">
                                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 font-display tracking-tight mb-2 sm:mb-4 flex items-center gap-1.5 sm:gap-2">
                                    <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-[#Ed3237]" />
                                    <span>¡Hola! Quiero uniformar a mi equipo</span>
                                </h2>
                        <p className="text-gray-700 text-sm sm:text-sm mb-4 sm:mb-4">
                            Completá los siguientes datos:
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3">
                            {/* Nombre y Apellido */}
                            <div className="grid sm:grid-cols-2 gap-3 sm:gap-3">
                                <div>
                                    <label htmlFor="nombre" className="flex text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2 items-center gap-1.5 sm:gap-2">
                                        <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#Ed3237]" />
                                        <span>Nombre: *</span>
                                    </label>
                                    <Input
                                        type="text"
                                        id="nombre"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleInputChange}
                                        variant={errors.nombre ? 'error' : 'default'}
                                        placeholder="Nombre"
                                    />
                                    {errors.nombre && (
                                        <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="apellido" className="flex text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2 items-center gap-1.5 sm:gap-2">
                                        <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#Ed3237]" />
                                        <span>Apellido: *</span>
                                    </label>
                                    <Input
                                        type="text"
                                        id="apellido"
                                        name="apellido"
                                        value={formData.apellido}
                                        onChange={handleInputChange}
                                        variant={errors.apellido ? 'error' : 'default'}
                                        placeholder="Apellido"
                                    />
                                    {errors.apellido && (
                                        <p className="text-red-500 text-xs mt-1">{errors.apellido}</p>
                                    )}
                                </div>
                            </div>

                            {/* Email y Teléfono */}
                            <div className="grid sm:grid-cols-2 gap-3 sm:gap-3">
                                <div>
                                    <label htmlFor="mail" className="flex text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2 items-center gap-1.5 sm:gap-2">
                                        <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#Ed3237]" />
                                        <span>Email: *</span>
                                    </label>
                                    <Input
                                        type="email"
                                        id="mail"
                                        name="mail"
                                        value={formData.mail}
                                        onChange={handleInputChange}
                                        variant={errors.mail ? 'error' : 'default'}
                                        placeholder="Ej: email@empresa.com"
                                    />
                                    {errors.mail && (
                                        <p className="text-red-500 text-xs mt-1">{errors.mail}</p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="telefono" className="flex text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2 items-center gap-1.5 sm:gap-2">
                                        <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#Ed3237]" />
                                        <span>Teléfono: *</span>
                                    </label>
                                    <Input
                                        type="tel"
                                        id="telefono"
                                        name="telefono"
                                        value={formData.telefono}
                                        onChange={handleInputChange}
                                        variant={errors.telefono ? 'error' : 'default'}
                                        placeholder="Ej: +54 9 351 123-4567"
                                    />
                                    {errors.telefono && (
                                        <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>
                                    )}
                                </div>
                            </div>

                            {/* Provincia y Ciudad */}
                            <div className="grid sm:grid-cols-2 gap-3 sm:gap-3">
                                <div>
                                    <label htmlFor="provincia" className="flex text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2 items-center gap-1.5 sm:gap-2">
                                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#Ed3237]" />
                                        <span>Provincia: *</span>
                                    </label>
                                    <Input
                                        type="text"
                                        id="provincia"
                                        name="provincia"
                                        value={formData.provincia}
                                        onChange={handleInputChange}
                                        variant={errors.provincia ? 'error' : 'default'}
                                        placeholder="Ej: Córdoba"
                                    />
                                    {errors.provincia && (
                                        <p className="text-red-500 text-xs mt-1">{errors.provincia}</p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="ciudad" className="flex text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2 items-center gap-1.5 sm:gap-2">
                                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#Ed3237]" />
                                        <span>Ciudad: *</span>
                                    </label>
                                    <Input
                                        type="text"
                                        id="ciudad"
                                        name="ciudad"
                                        value={formData.ciudad}
                                        onChange={handleInputChange}
                                        variant={errors.ciudad ? 'error' : 'default'}
                                        placeholder="Ej: Córdoba Capital"
                                    />
                                    {errors.ciudad && (
                                        <p className="text-red-500 text-xs mt-1">{errors.ciudad}</p>
                                    )}
                                </div>
                            </div>

                            {/* Cantidad */}
                            <div>
                                <label htmlFor="cantidad" className="flex text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2 items-center gap-1.5 sm:gap-2">
                                    <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#Ed3237]" />
                                    <span>Cantidad de prendas aproximadas: *</span>
                                </label>
                                <Input
                                    type="text"
                                    id="cantidad"
                                    name="cantidad"
                                    value={formData.cantidad}
                                    onChange={handleInputChange}
                                    variant={errors.cantidad ? 'error' : 'default'}
                                    placeholder="Ej: 50 prendas"
                                />
                                {errors.cantidad && (
                                    <p className="text-red-500 text-xs mt-1">{errors.cantidad}</p>
                                )}
                            </div>

                            {/* Tipo de prendas */}
                            <div>
                                <label htmlFor="tipoPrendas" className="flex text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2 items-center gap-1.5 sm:gap-2">
                                    <Shirt className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#Ed3237]" />
                                    <span>Tipo de prendas que buscan: *</span>
                                </label>
                                <TextArea
                                    id="tipoPrendas"
                                    name="tipoPrendas"
                                    value={formData.tipoPrendas}
                                    onChange={handleInputChange}
                                    rows={3}
                                    variant={errors.tipoPrendas ? 'error' : 'default'}
                                    placeholder="Ej: Uniformes, remeras, pantalones..."
                                />
                                {errors.tipoPrendas && (
                                    <p className="text-red-500 text-xs mt-1">{errors.tipoPrendas}</p>
                                )}
                            </div>

                            {/* CUIT (opcional) */}
                            <div>
                                <label htmlFor="cuit" className="flex text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2 items-center gap-1.5 sm:gap-2">
                                    <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#Ed3237]" />
                                    <span>CUIT (opcional):</span>
                                </label>
                                <Input
                                    type="text"
                                    id="cuit"
                                    name="cuit"
                                    value={formData.cuit}
                                    onChange={handleInputChange}
                                    placeholder="Ej: 20-12345678-9"
                                />
                            </div>

                            {/* Botón de envío */}
                            <div className="pt-2 sm:pt-3">
                                <Button
                                    type="submit"
                                    variant="black"
                                    size="lg"
                                    fullWidth
                                    className="inline-flex items-center justify-center space-x-2 text-xs sm:text-sm py-2 sm:py-2.5"
                                    aria-label="Enviar formulario de contacto mayorista"
                                >
                                    <span className="text-xs sm:text-sm">CONTACTAR CON UN ASESOR</span>
                                </Button>
                            </div>
                        </form>
                            </div>
                        </motion.div>
                    </div>
                </Section>
            </div>
        </ErrorBoundary>
    );
}

