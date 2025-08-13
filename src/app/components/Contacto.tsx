import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import Button from './ui/Button';

const Contacto = () => {
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
                    <h2 className="text-5xl font-bold text-black mb-6">
                        Contactanos
                    </h2>
                    <p className="text-xl text-gray-600">
                        Estamos listos para asesorarte en tu próximo proyecto
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-16">
                    {/* Formulario */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="bg-gray-50 p-10 rounded-lg"
                    >
                        <h3 className="text-2xl font-bold text-gray-900 mb-8">SOLICITAR COTIZACIÓN</h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-3 tracking-wide">
                                    NOMBRE COMPLETO
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-4 border-2 border-gray-200 focus:border-red-500 outline-none transition-colors bg-white rounded-lg placeholder-gray-400 text-gray-900"
                                    placeholder="Ej: Juan Carlos Pérez"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-3 tracking-wide">
                                    EMAIL
                                </label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-4 border-2 border-gray-200 focus:border-red-500 outline-none transition-colors bg-white rounded-lg placeholder-gray-400 text-gray-900"
                                    placeholder="ejemplo@empresa.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-3 tracking-wide">
                                    EMPRESA
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-4 border-2 border-gray-200 focus:border-red-500 outline-none transition-colors bg-white rounded-lg placeholder-gray-400 text-gray-900"
                                    placeholder="Ej: Distribuidora San Martín S.A."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-3 tracking-wide">
                                    TELÉFONO
                                </label>
                                <input
                                    type="tel"
                                    className="w-full px-4 py-4 border-2 border-gray-200 focus:border-red-500 outline-none transition-colors bg-white rounded-lg placeholder-gray-400 text-gray-900"
                                    placeholder="Ej: 351 123-4567"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-3 tracking-wide">
                                    MENSAJE
                                </label>
                                <textarea
                                    rows={6}
                                    className="w-full px-4 py-4 border-2 border-gray-200 focus:border-red-500 outline-none transition-colors resize-none bg-white rounded-lg placeholder-gray-400 text-gray-900"
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
                            <Button
                                onClick={() => alert('Funcionalidad de envío - En implementación real se enviaría el formulario')}
                                className="w-full"
                                variant="black"
                                size="lg"
                            >
                                ENVIAR CONSULTA
                            </Button>
                        </div>
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
                                <Phone className="text-red-500 mr-4" size={28} />
                                <h4 className="text-xl font-bold text-gray-900">TELÉFONO</h4>
                            </div>
                            <p className="text-lg text-gray-600">351 - 7136316</p>
                            <p className="text-sm text-gray-500 mt-2">Lunes a Viernes de 8:00 a 18:00hs</p>
                        </div>

                        <div className="bg-gray-50 p-8 rounded-lg hover:shadow-lg transition-shadow">
                            <div className="flex items-center mb-6">
                                <Mail className="text-red-500 mr-4" size={28} />
                                <h4 className="text-xl font-bold text-gray-900">EMAIL</h4>
                            </div>
                            <p className="text-lg text-gray-600">info@naturalonline.com.ar</p>
                            <p className="text-sm text-gray-500 mt-2">Respuesta en menos de 24hs</p>
                        </div>

                        <div className="bg-gray-50 p-8 rounded-lg hover:shadow-lg transition-shadow">
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
    )
}

export default Contacto;