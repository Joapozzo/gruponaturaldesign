"use client";
import React from 'react';
import { Eye } from 'lucide-react';
import { getWhatsAppNumberForUrl } from '@/app/utils/constants';

export default function ProductShowroomInfo() {
    const whatsappNumber = getWhatsAppNumberForUrl();
    const whatsappMessage = encodeURIComponent('¡Hola! Me gustaría coordinar una cita para ver productos en el showroom.');
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    return (
        <div className="bg-gray-50 p-1.5 sm:p-2 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-1 sm:space-x-1.5 mb-0.5 sm:mb-1">
                <Eye size={10} className="sm:w-3 sm:h-3 text-[#Ed3237] flex-shrink-0" />
                <span className="font-semibold text-gray-900 text-[9px] sm:text-[10px]">
                    ¿Necesitás ver el producto en persona?
                </span>
            </div>
            <p className="text-gray-700 text-[9px] sm:text-[10px] leading-tight">
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

