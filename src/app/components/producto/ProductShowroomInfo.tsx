"use client";
import React from 'react';
import { Eye } from 'lucide-react';
import { getWhatsAppNumberForUrl } from '@/app/utils/constants';

export default function ProductShowroomInfo() {
    const whatsappNumber = getWhatsAppNumberForUrl();
    const whatsappMessage = encodeURIComponent('¡Hola! Me gustaría coordinar una cita para ver productos en el showroom.');
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    return (
        <div className="bg-gray-50 p-2.5 sm:p-3 rounded-lg border border-gray-200 lg:p-2.5">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                <Eye size={14} className="sm:w-[14px] sm:h-[14px] lg:w-3 lg:h-3 text-[#Ed3237] flex-shrink-0" />
                <span className="font-semibold text-gray-900 text-xs sm:text-sm lg:text-xs">
                    ¿Necesitás ver el producto en persona?
                </span>
            </div>
            <p className="text-gray-700 text-xs sm:text-sm lg:text-xs leading-snug">
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

