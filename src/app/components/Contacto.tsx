import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import Button from './ui/Button';
import { useContactForm } from '../hooks/useContactForm';

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
        <section id="contacto" className="py-20 bg-gray-200 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-6">
                        Contactanos
                    </h2>
                    <p className="text-md md:text-lg text-gray-600">
                        Estamos listos para asesorarte en tu próximo proyecto.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-16">
                    {/* Formulario */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="bg-gray-50 p-6 sm:p-10 rounded-lg"
                    >
                        <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
                            SOLICITAR COTIZACIÓN
                        </h3>

                        {/* Mensajes de estado */}
                        {isSuccess && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center"
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
                                className={`mb-6 p-4 border rounded-lg flex items-start ${!canRetry
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

                        <form onSubmit={handleSubmit(submitForm)} className="space-y-4 sm:space-y-6">
                            {/* Campo honeypot oculto para detectar bots */}
                            <input
                                type="text"
                                name="website"
                                style={{ display: 'none' }}
                                tabIndex={-1}
                                autoComplete="off"
                            />
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3 tracking-wide">
                                    NOMBRE COMPLETO *
                                </label>
                                <input
                                    {...register('nombreCompleto')}
                                    type="text"
                                    className={`w-full px-3 py-3 sm:px-4 sm:py-4 border-2 ${errors.nombreCompleto ? 'border-red-500' : 'border-gray-200'
                                        } focus:border-red-500 outline-none transition-colors bg-white rounded-lg placeholder-gray-400 text-gray-900 text-sm sm:text-base`}
                                    placeholder="Ej: Juan Carlos Pérez"
                                />
                                {errors.nombreCompleto && (
                                    <p className="mt-1 text-sm text-red-600">{errors.nombreCompleto.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3 tracking-wide">
                                    EMAIL *
                                </label>
                                <input
                                    {...register('email')}
                                    type="email"
                                    className={`w-full px-3 py-3 sm:px-4 sm:py-4 border-2 ${errors.email ? 'border-red-500' : 'border-gray-200'
                                        } focus:border-red-500 outline-none transition-colors bg-white rounded-lg placeholder-gray-400 text-gray-900 text-sm sm:text-base`}
                                    placeholder="ejemplo@empresa.com"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3 tracking-wide">
                                    EMPRESA *
                                </label>
                                <input
                                    {...register('empresa')}
                                    type="text"
                                    className={`w-full px-3 py-3 sm:px-4 sm:py-4 border-2 ${errors.empresa ? 'border-red-500' : 'border-gray-200'
                                        } focus:border-red-500 outline-none transition-colors bg-white rounded-lg placeholder-gray-400 text-gray-900 text-sm sm:text-base`}
                                    placeholder="Ej: Distribuidora San Martín S.A."
                                />
                                {errors.empresa && (
                                    <p className="mt-1 text-sm text-red-600">{errors.empresa.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3 tracking-wide">
                                    TELÉFONO *
                                </label>
                                <input
                                    {...register('telefono')}
                                    type="tel"
                                    className={`w-full px-3 py-3 sm:px-4 sm:py-4 border-2 ${errors.telefono ? 'border-red-500' : 'border-gray-200'
                                        } focus:border-red-500 outline-none transition-colors bg-white rounded-lg placeholder-gray-400 text-gray-900 text-sm sm:text-base`}
                                    placeholder="Ej: 351 123-4567"
                                />
                                {errors.telefono && (
                                    <p className="mt-1 text-sm text-red-600">{errors.telefono.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3 tracking-wide">
                                    MENSAJE *
                                </label>
                                <textarea
                                    {...register('mensaje')}
                                    rows={5}
                                    className={`w-full px-3 py-3 sm:px-4 sm:py-4 border-2 ${errors.mensaje ? 'border-red-500' : 'border-gray-200'
                                        } focus:border-red-500 outline-none transition-colors resize-none bg-white rounded-lg placeholder-gray-400 text-gray-900 text-sm sm:text-base`}
                                    placeholder="Necesito cotización para uniformes de trabajo. Me interesa conocer opciones de diseño y tiempos de entrega..."
                                ></textarea>
                                {errors.mensaje && (
                                    <p className="mt-1 text-sm text-red-600">{errors.mensaje.message}</p>
                                )}
                            </div>

                            {/* <div className="flex items-start">
                                <input
                                    {...register('aceptaTerminos')}
                                    type="checkbox"
                                    className={`mr-2 sm:mr-3 w-3 h-3 sm:w-4 sm:h-4 text-red-500 mt-1 accent-red-500 ${errors.aceptaTerminos ? 'border-red-500' : ''
                                        }`}
                                />
                                <div className="flex-1">
                                    <span className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                        Acepto las políticas de privacidad y autorizo el tratamiento de mis datos personales para recibir información comercial *
                                    </span>
                                    {errors.aceptaTerminos && (
                                        <p className="mt-1 text-sm text-red-600">{errors.aceptaTerminos.message}</p>
                                    )}
                                </div>
                            </div> */}

                            <Button
                                type="submit"
                                disabled={isSubmitting || !canRetry}
                                className={`w-full ${!canRetry ? 'opacity-50 cursor-not-allowed' : ''}`}
                                variant="black"
                                size="lg"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="inline-block w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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

                    {/* Info de contacto */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div className="bg-gray-50 p-8 rounded-lg hover:shadow-lg transition-shadow">
                            <div className="flex items-center mb-6">
                                <Phone className="text-red-500 mr-4" size={24} />
                                <h4 className="text-md md:text-xl font-bold text-gray-900">TELÉFONO</h4>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm md:text-lg text-gray-600">
                                    <span className="font-semibold">Ventas:</span> +54 9 3517 13-6316
                                </p>
                                <p className="text-sm md:text-lg text-gray-600">
                                    <span className="font-semibold">Info:</span> +54 9 3516 29-2969
                                </p>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">Lunes a Viernes de 8:00 a 18:00hs</p>
                        </div>

                        <div className="bg-gray-50 p-8 rounded-lg hover:shadow-lg transition-shadow">
                            <div className="flex items-center mb-6">
                                <Mail className="text-red-500 mr-4" size={24} />
                                <h4 className="text-md md:text-xl font-bold text-gray-900">EMAIL</h4>
                            </div>
                            <p className="text-sm md:text-lg text-gray-600">info@naturalonline.com.ar</p>
                            <p className="text-xs text-gray-500 mt-2">Respuesta en menos de 24hs</p>
                        </div>

                        <div className="bg-gray-50 p-8 rounded-lg hover:shadow-lg transition-shadow">
                            <div className="flex items-center mb-6">
                                <MapPin className="text-red-500 mr-4" size={24} />
                                <h4 className="text-md md:text-xl font-bold text-gray-900">UBICACIÓN</h4>
                            </div>
                            <p className="text-sm md:text-lg text-gray-600">
                                Rivera Indarte 2143<br />
                                Córdoba, Argentina
                            </p>
                            <p className="text-sm text-gray-500 mt-2">Showroom con cita previa</p>
                        </div>

                        {/* Mapa */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            viewport={{ once: true }}
                            className="relative h-74 overflow-hidden shadow-lg rounded-lg group"
                        >
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3404.5123456789!2d-64.1835!3d-31.4135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9432a2f3456789ab%3A0x123456789abcdef!2sRivera%20Indarte%202143%2C%20C%C3%B3rdoba%2C%20Argentina!5e0!3m2!1ses!2sar!4v1234567890123!5m2!1ses!2sar"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="grayscale group-hover:grayscale-0 transition-all duration-500"
                                title="Ubicación NTDS - Rivera Indarte 2143, Córdoba"
                            ></iframe>
                            <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            <div className="absolute bottom-4 left-4 bg-white px-3 py-2 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <p className="text-sm font-semibold text-gray-800">📍 Nuestro Showroom</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contacto;