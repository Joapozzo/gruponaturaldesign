"use client";
import { Mail, MapPin, Instagram } from 'lucide-react';
import Image from 'next/image';
import { WhatsApp } from './logos/WhatsApp';
import { useWhatsApp } from './hooks/useWhatsApp';
import { WHATSAPP_PHONE_NUMBER } from '@/app/utils/constants';

const Footer = () => {
    const { openWhatsApp } = useWhatsApp({ defaultMessage: "¡Hola! Me interesa conocer más sobre los uniformes de NTDS. ¿Te gustaría hablar conmigo?" });
    return (
        <footer className="bg-[var(--black)] text-white pt-12 pb-6">
            <div className="w-full px-4 lg:px-15">
                <div className="grid md:grid-cols-4 gap-8">
                    <div className="md:col-span-2">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-25 h-25 flex items-center justify-center">
                                <Image
                                    src="/logos/logo-2.svg"
                                    alt="Natural Design Logo"
                                    className="object-contain"
                                    width={90}
                                    height={30}
                                    style={{ width: 'auto', height: 'auto' }}
                                />
                            </div>
                        </div>
                        <p className="text-gray-400 mb-4 leading-relaxed text-xs md:text-sm">
                            Natural Design. Calidad y diseño en indumentaria para empresas. Más
                            de 25 años vistiendo empresas con profesionalismo y estilo.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="https://www.instagram.com/naturaldesign.ntds/"
                                className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs md:text-sm"
                            >
                                <Instagram className='w-3.5' />
                                <span className="font-medium">INSTAGRAM</span>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4 text-sm md:text-base">SERVICIOS</h4>
                        <ul className="space-y-2 text-gray-400 text-xs md:text-sm">
                            <li>
                                <a href="/shoponline" className="hover:text-white transition-colors">
                                    Shop Online
                                </a>
                            </li>
                            <li>
                                <a href="/personalizados" className="hover:text-white transition-colors">
                                    Uniformes personalizados
                                </a>
                            </li>
                            <li>
                                <a href="/#nosotros" className="hover:text-white transition-colors">
                                    Nosotros
                                </a>
                            </li>
                            <li>
                                <a href="/#contacto" className="hover:text-white transition-colors">
                                    Contacto
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4 text-sm md:text-base">CONTACTO</h4>
                        <div className="space-y-2 text-gray-400 text-xs md:text-sm">
                            <p className="flex items-center cursor-pointer" onClick={() => openWhatsApp()}>
                                {/* <Phone size={14} className="mr-1.5" /> */}
                                <WhatsApp size={14} className="mr-1.5" />
                                {WHATSAPP_PHONE_NUMBER}
                            </p>
                            <a 
                                href="mailto:ventas@naturalonline.com.ar" 
                                className="flex items-center hover:text-white transition-colors"
                            >
                                <Mail size={14} className="mr-1.5" />
                                ventas@naturalonline.com.ar
                            </a>
                            <p className="flex items-center">
                                <MapPin size={14} className="mr-1.5" />
                                Rivera Indarte 2143, Córdoba
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Línea separadora full width */}
            <div className="w-full border-t border-gray-800 mt-8"></div>

            {/* Copyright con contenedor centrado */}
            <div className="w-full px-4 lg:px-15 pt-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-gray-400">
                    <p className="text-[10px] md:text-xs">&copy; 2025 Natural Design. Todos los derechos reservados.</p>
                    <div className="flex flex-wrap justify-center gap-3 text-[10px] md:text-xs">
                        <a href="/politicas-cambio-devolucion" className="hover:text-white transition-colors">
                            Políticas de cambio y devolución
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;