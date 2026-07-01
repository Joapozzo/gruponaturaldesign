'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import Section from './Section';
import Button from '@/components/ui/Button';
import { useContactForm } from '../hooks/useContactForm';
import { WHATSAPP_PHONE_NUMBER } from '@/app/utils/constants';
import { StoreLocationMap } from '@/app/components/StoreLocationMap';

const Contacto = () => {
    const {
        register,
        handleSubmit,
        errors,
        isSubmitting,
        submitForm,
        isSuccess,
        errorMessage,
        canRetry,
        retryAfter
    } = useContactForm();

    return (
        <Section
            id="contacto"
            title="Contactanos"
            subtitle="Estamos listos para asesorarte en tu próximo proyecto."
            background="white"
            padding="none"
            className="bg-gray-200"
            contentClassName="w-full px-4 lg:px-15 py-8 lg:py-12"
        >
            <div className="flex flex-col gap-6 lg:gap-8">
                {/* Row 1: Info de contacto - 3 cols desktop, col mobile */}
                <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 lg:gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="bg-gray-50 p-4 sm:p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center mb-3 sm:mb-4">
                                <Phone className="text-red-500 mr-2 sm:mr-3" size={18} />
                                <h4 className="text-xs sm:text-sm font-bold text-gray-900">TELÉFONO</h4>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] sm:text-xs text-gray-600">
                                    <span className="font-semibold">Ventas:</span> {WHATSAPP_PHONE_NUMBER}
                                </p>
                            </div>
                            <p className="text-[9px] sm:text-[10px] text-gray-500 mt-1">Lunes a Viernes de 8:00 a 18:00hs</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="bg-gray-50 p-4 sm:p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center mb-3 sm:mb-4">
                                <Mail className="text-red-500 mr-2 sm:mr-3" size={18} />
                                <h4 className="text-xs sm:text-sm font-bold text-gray-900">EMAIL</h4>
                            </div>
                            <p className="text-[10px] sm:text-xs text-gray-600">ventas@naturalonline.com.ar</p>
                            <p className="text-[9px] sm:text-[10px] text-gray-500 mt-1">Respuesta en menos de 24hs</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            viewport={{ once: true }}
                            className="bg-gray-50 p-4 sm:p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center mb-3 sm:mb-4">
                                <MapPin className="text-red-500 mr-2 sm:mr-3" size={18} />
                                <h4 className="text-xs sm:text-sm font-bold text-gray-900">UBICACIÓN</h4>
                            </div>
                            <p className="text-[10px] sm:text-xs text-gray-600">
                                Rivera Indarte 2143<br />
                                Córdoba, Argentina
                            </p>
                            <p className="text-[9px] sm:text-[10px] text-gray-500 mt-1">Showroom con cita previa</p>
                        </motion.div>
                    </div>

                {/* Row 2: Form + Map - 2 cols desktop, col mobile */}
                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 lg:gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="bg-gray-50 p-4 sm:p-6"
                        >
                            <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-3 sm:mb-4">
                                SOLICITAR COTIZACIÓN
                            </h3>

                            {/* Mensajes de estado */}
                            {isSuccess && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 flex items-center"
                                    data-success-message
                                >
                                    <CheckCircle className="mr-3" size={20} />
                                    <span>¡Consulta enviada correctamente! Te responderemos a la brevedad.</span>
                                </motion.div>
                            )}

                            {errorMessage && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`mb-6 p-4 border flex items-start ${!canRetry
                                            ? 'bg-yellow-100 border-yellow-400 text-yellow-700'
                                            : 'bg-red-100 border-red-400 text-red-700'
                                        }`}
                                >
                                    <AlertCircle className="mr-3 mt-0.5 flex-shrink-0" size={20} />
                                    <div className="flex-1">
                                        <span>{errorMessage}</span>
                                        {retryAfter && (
                                            <p className="mt-2 text-sm font-medium">
                                                Podrás intentar nuevamente en {Math.ceil(retryAfter / 60000)} minutos.
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit(submitForm)} className="space-y-3 sm:space-y-4">
                                {/* Campo honeypot oculto para detectar bots */}
                                <input
                                    type="text"
                                    name="website"
                                    style={{ display: 'none' }}
                                    tabIndex={-1}
                                    autoComplete="off"
                                />
                                <div>
                                    <label className="block text-[10px] sm:text-xs font-semibold text-gray-900 mb-1.5 sm:mb-2 tracking-wide">
                                        EMAIL *
                                    </label>
                                    <input
                                        {...register('email')}
                                        type="email"
                                        className={`w-full px-2.5 py-2 sm:px-3 sm:py-2.5 border-2 ${errors.email ? 'border-red-500' : 'border-gray-200'
                                            } focus:border-red-500 outline-none transition-colors bg-white placeholder-gray-600 text-gray-900 text-xs sm:text-sm`}
                                        placeholder="ejemplo@empresa.com"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-[10px] sm:text-xs font-semibold text-gray-900 mb-1.5 sm:mb-2 tracking-wide">
                                        EMPRESA *
                                    </label>
                                    <input
                                        {...register('empresa')}
                                        type="text"
                                        className={`w-full px-2.5 py-2 sm:px-3 sm:py-2.5 border-2 ${errors.empresa ? 'border-red-500' : 'border-gray-200'
                                            } focus:border-red-500 outline-none transition-colors bg-white placeholder-gray-600 text-gray-900 text-xs sm:text-sm`}
                                        placeholder="Ej: Distribuidora San Martín S.A."
                                    />
                                    {errors.empresa && (
                                        <p className="mt-1 text-xs text-red-600">{errors.empresa.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-[10px] sm:text-xs font-semibold text-gray-900 mb-1.5 sm:mb-2 tracking-wide">
                                        TELÉFONO *
                                    </label>
                                    <input
                                        {...register('telefono')}
                                        type="tel"
                                        className={`w-full px-2.5 py-2 sm:px-3 sm:py-2.5 border-2 ${errors.telefono ? 'border-red-500' : 'border-gray-200'
                                            } focus:border-red-500 outline-none transition-colors bg-white placeholder-gray-600 text-gray-900 text-xs sm:text-sm`}
                                        placeholder="Ej: 351 123-4567"
                                    />
                                    {errors.telefono && (
                                        <p className="mt-1 text-xs text-red-600">{errors.telefono.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-[10px] sm:text-xs font-semibold text-gray-900 mb-1.5 sm:mb-2 tracking-wide">
                                        MENSAJE *
                                    </label>
                                    <textarea
                                        {...register('mensaje')}
                                        rows={4}
                                        className={`w-full px-2.5 py-2 sm:px-3 sm:py-2.5 border-2 ${errors.mensaje ? 'border-red-500' : 'border-gray-200'
                                            } focus:border-red-500 outline-none transition-colors resize-none bg-white placeholder-gray-600 text-gray-900 text-xs sm:text-sm`}
                                        placeholder="Necesito cotización para uniformes de trabajo. Me interesa conocer opciones de diseño y tiempos de entrega..."
                                    ></textarea>
                                    {errors.mensaje && (
                                        <p className="mt-1 text-xs text-red-600">{errors.mensaje.message}</p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting || !canRetry}
                                    className={`w-full ${!canRetry ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    variant="black"
                                    size="lg"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="inline-block w-4 h-4 mr-2 border-2 border-white border-t-transparent animate-spin"></div>
                                            ENVIANDO...
                                        </>
                                    ) : !canRetry ? (
                                        'LÍMITE ALCANZADO'
                                    ) : (
                                        'ENVIAR CONSULTA'
                                    )}
                                </Button>
                            </form>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <StoreLocationMap
                                minHeightClass="min-h-[240px]"
                                showHoverCaption
                                className="shadow-lg border-0"
                            />
                        </motion.div>
                </div>
            </div>
        </Section>
    );
};

export default Contacto;