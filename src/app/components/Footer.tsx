import { Mail, Phone, MapPin, Instagram } from 'lucide-react';
import Image from 'next/image';
import { WhatsApp } from './logos/WhatsApp';

const Footer = () => {
    return (
        <footer className="bg-[var(--black)] text-white pt-16 pb-8 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-12">
                    <div className="md:col-span-2">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-25 h-25 flex items-center justify-center">
                                <Image
                                    src="/logos/logo-2.svg"
                                    alt="Natural Design Logo"
                                    className="object-contain"
                                    width={90}
                                    height={30}
                                />
                            </div>
                        </div>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Natural Design. Calidad y diseño en uniformes empresariales. Más
                            de 25 años vistiendo empresas con profesionalismo y estilo.
                        </p>
                        <div className="flex space-x-6">
                            <a
                                href="https://www.instagram.com/naturaldesign.ntds/"
                                className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                            >
                                <Instagram className='w-4' />
                                <span className="font-medium">INSTAGRAM</span>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-lg">SERVICIOS</h4>
                        <ul className="space-y-3 text-gray-400">
                            <li className="hover:text-white transition-colors cursor-pointer">
                                Uniformes empresariales
                            </li>
                            <li className="hover:text-white transition-colors cursor-pointer">
                                Merchandising
                            </li>
                            <li className="hover:text-white transition-colors cursor-pointer">
                                Distribución
                            </li>
                            <li className="hover:text-white transition-colors cursor-pointer">
                                Fichas técnicas
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-lg">CONTACTO</h4>
                        <div className="space-y-3 text-gray-400">
                            <p className="flex items-center">
                                {/* <Phone size={16} className="mr-2" /> */}
                                <WhatsApp size={16} className="mr-2" />
                                351 - 7136316
                            </p>
                            <p className="flex items-center">
                                <Mail size={16} className="mr-2" />
                                info@naturalonline.com.ar
                            </p>
                            <p className="flex items-center">
                                <MapPin size={16} className="mr-2" />
                                Rivera Indarte 2143, Córdoba
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Línea separadora full width */}
            <div className="w-full border-t border-gray-800 mt-12"></div>

            {/* Copyright con contenedor centrado */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 text-center text-gray-400">
                <p>&copy; 2025 Natural Design. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
};

export default Footer;