"use client";
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
    CheckCircle2, 
    ArrowLeft, 
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
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                            <Briefcase className="w-6 h-6 text-[#Ed3237]" />
                            <span>¡Hola! Quiero uniformar a mi equipo</span>
                        </h2>
                        <p className="text-gray-700 mb-6">
                            Completá los siguientes datos:
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Nombre y Apellido */}
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="nombre" className="flex text-sm font-semibold text-gray-700 mb-2 items-center gap-2">
                                        <User className="w-4 h-4 text-[#Ed3237]" />
                                        <span>Nombre: *</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="nombre"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#Ed3237] placeholder:text-gray-600 ${
                                            errors.nombre ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Ej: Juan"
                                    />
                                    {errors.nombre && (
                                        <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="apellido" className="flex text-sm font-semibold text-gray-700 mb-2 items-center gap-2">
                                        <User className="w-4 h-4 text-[#Ed3237]" />
                                        <span>Apellido: *</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="apellido"
                                        name="apellido"
                                        value={formData.apellido}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#Ed3237] placeholder:text-gray-600 ${
                                            errors.apellido ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Ej: Pérez"
                                    />
                                    {errors.apellido && (
                                        <p className="text-red-500 text-xs mt-1">{errors.apellido}</p>
                                    )}
                                </div>
                            </div>

                            {/* Email y Teléfono */}
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="mail" className="flex text-sm font-semibold text-gray-700 mb-2 items-center gap-2">
                                        <Mail className="w-4 h-4 text-[#Ed3237]" />
                                        <span>Email: *</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="mail"
                                        name="mail"
                                        value={formData.mail}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#Ed3237] placeholder:text-gray-600 ${
                                            errors.mail ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Ej: juan@empresa.com"
                                    />
                                    {errors.mail && (
                                        <p className="text-red-500 text-xs mt-1">{errors.mail}</p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="telefono" className="flex text-sm font-semibold text-gray-700 mb-2 items-center gap-2">
                                        <Phone className="w-4 h-4 text-[#Ed3237]" />
                                        <span>Teléfono: *</span>
                                    </label>
                                    <input
                                        type="tel"
                                        id="telefono"
                                        name="telefono"
                                        value={formData.telefono}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#Ed3237] placeholder:text-gray-600 ${
                                            errors.telefono ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Ej: +54 9 351 123-4567"
                                    />
                                    {errors.telefono && (
                                        <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>
                                    )}
                                </div>
                            </div>

                            {/* Provincia y Ciudad */}
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="provincia" className="flex text-sm font-semibold text-gray-700 mb-2 items-center gap-2">
                                        <MapPin className="w-4 h-4 text-[#Ed3237]" />
                                        <span>Provincia: *</span>
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
                                    <label htmlFor="ciudad" className="flex text-sm font-semibold text-gray-700 mb-2 items-center gap-2">
                                        <MapPin className="w-4 h-4 text-[#Ed3237]" />
                                        <span>Ciudad: *</span>
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
                                <label htmlFor="cantidad" className="flex text-sm font-semibold text-gray-700 mb-2 items-center gap-2">
                                    <Users className="w-4 h-4 text-[#Ed3237]" />
                                    <span>Cantidad de prendas aproximadas: *</span>
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
                                <label htmlFor="tipoPrendas" className="flex text-sm font-semibold text-gray-700 mb-2 items-center gap-2">
                                    <Shirt className="w-4 h-4 text-[#Ed3237]" />
                                    <span>Tipo de prendas que buscan: *</span>
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
                                <label htmlFor="cuit" className="flex text-sm font-semibold text-gray-700 mb-2 items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-[#Ed3237]" />
                                    <span>CUIT (opcional):</span>
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
                                    aria-label="Enviar formulario de contacto mayorista"
                                >
                                    <span>CONTACTAR CON UN ASESOR</span>
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </Section>
            </div>
        </ErrorBoundary>
    );
}

