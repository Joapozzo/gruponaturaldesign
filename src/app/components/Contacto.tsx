import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contacto = () => {
    return (
        <section id="contacto" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-5xl font-bold text-gray-900 mb-6">
                        CONTACTANOS
                    </h2>
                    <p className="text-xl text-gray-600">
                        Estamos listos para asesorarte en tu próximo proyecto
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-16">
                    {/* Formulario */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="bg-gray-50 p-10"
                    >
                        <h3 className="text-2xl font-bold text-gray-900 mb-8">SOLICITAR COTIZACIÓN</h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-3 tracking-wide">
                                    NOMBRE COMPLETO
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-4 border-2 border-gray-200 focus:border-red-500 outline-none transition-colors bg-white  placeholder-gray-400 text-gray-900"
                                    placeholder="Ej: Juan Carlos Pérez"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-3 tracking-wide">
                                    EMAIL
                                </label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-4 border-2 border-gray-200 focus:border-red-500 outline-none transition-colors bg-white  placeholder-gray-400 text-gray-900"
                                    placeholder="ejemplo@empresa.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-3 tracking-wide">
                                    EMPRESA
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-4 border-2 border-gray-200 focus:border-red-500 outline-none transition-colors bg-white placeholder-gray-400 text-gray-900"
                                    placeholder="Ej: Distribuidora San Martín S.A."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-3 tracking-wide">
                                    TELÉFONO
                                </label>
                                <input
                                    type="tel"
                                    className="w-full px-4 py-4 border-2 border-gray-200 focus:border-red-500 outline-none transition-colors bg-white  placeholder-gray-400 text-gray-900"
                                    placeholder="Ej: 351 123-4567"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-3 tracking-wide">
                                    MENSAJE
                                </label>
                                <textarea
                                    rows={6}
                                    className="w-full px-4 py-4 border-2 border-gray-200 focus:border-red-500 outline-none transition-colors resize-none bg-white placeholder-gray-400 text-gray-900"
                                    placeholder="Necesito cotización para uniformes de trabajo. Somos una empresa de 25 empleados del rubro gastronómico. Me interesa conocer opciones de diseño y tiempos de entrega..."
                                ></textarea>
                            </div>
                            <div className="flex items-start">
                                <input 
                                    type="checkbox" 
                                    className="mr-3 w-4 h-4 text-red-500 mt-1 accent-red-500" 
                                />
                                <span className="text-sm text-gray-600 leading-relaxed">
                                    Acepto las políticas de privacidad y autorizo el tratamiento de mis datos personales para recibir información comercial
                                </span>
                            </div>
                            <button
                                onClick={() => alert('Funcionalidad de envío - En implementación real se enviaría el formulario')}
                                className="w-full bg-red-500 hover:bg-red-600 text-white py-4 font-semibold tracking-wide transition-colors shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
                            >
                                ENVIAR CONSULTA
                            </button>
                        </div>
                    </motion.div>

                    {/* Info de contacto */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div className="bg-gray-50 p-8 hover:shadow-lg transition-shadow">
                            <div className="flex items-center mb-6">
                                <Phone className="text-red-500 mr-4" size={28} />
                                <h4 className="text-xl font-bold text-gray-900">TELÉFONO</h4>
                            </div>
                            <p className="text-lg text-gray-600">351 - 7136316</p>
                            <p className="text-sm text-gray-500 mt-2">Lunes a Viernes de 8:00 a 18:00hs</p>
                        </div>

                        <div className="bg-gray-50 p-8 hover:shadow-lg transition-shadow">
                            <div className="flex items-center mb-6">
                                <Mail className="text-red-500 mr-4" size={28} />
                                <h4 className="text-xl font-bold text-gray-900">EMAIL</h4>
                            </div>
                            <p className="text-lg text-gray-600">info@naturalonline.com.ar</p>
                            <p className="text-sm text-gray-500 mt-2">Respuesta en menos de 24hs</p>
                        </div>

                        <div className="bg-gray-50 p-8 hover:shadow-lg transition-shadow">
                            <div className="flex items-center mb-6">
                                <MapPin className="text-red-500 mr-4" size={28} />
                                <h4 className="text-xl font-bold text-gray-900">UBICACIÓN</h4>
                            </div>
                            <p className="text-lg text-gray-600">
                                Rivera Indarte 2143<br />
                                Córdoba, Argentina
                            </p>
                            <p className="text-sm text-gray-500 mt-2">Showroom con cita previa</p>
                        </div>

                        {/* Imagen de contacto */}
                        <div className="relative h-64 overflow-hidden shadow-lg">
                            <div className="w-full h-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                                <div className="text-center text-white">
                                    <Phone size={48} className="mx-auto mb-4 opacity-80" />
                                    <h3 className="text-2xl font-bold">¿Necesitas ayuda?</h3>
                                    <p className="text-red-100 mt-2">Llamanos ahora</p>
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-red-500/20"></div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default Contacto;