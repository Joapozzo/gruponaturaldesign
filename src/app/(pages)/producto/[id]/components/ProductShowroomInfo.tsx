"use client";
import React from 'react';
import { Eye } from 'lucide-react';

export default function ProductShowroomInfo() {
    const whatsappNumber = '5493517136316';
    const whatsappMessage = encodeURIComponent('¡Hola! Me gustaría coordinar una cita para ver productos en el showroom.');
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    return (
        <div className="bg-gray-50 p-3 sm:p-4 lg:p-5 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-1.5 sm:space-x-2 mb-1.5 sm:mb-2">
                <Eye size={14} className="sm:w-[18px] sm:h-[18px] text-[#Ed3237] flex-shrink-0" />
                <span className="font-semibold text-gray-900 text-xs sm:text-sm">
                    ¿Necesitás ver el producto en persona?
                </span>
            </div>
            <p className="text-gray-700 text-xs sm:text-sm">
                Visitá nuestro showroom en Rivera Indarte 2143, Córdoba.{' '}
                <a 
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#Ed3237] hover:underline font-medium"
                >
                    Coordiná tu cita previa por WhatsApp.
                </a>
            </p>
        </div>
    );
}

