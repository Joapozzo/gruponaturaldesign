"use client";
import React from 'react';
import { useWhatsApp } from './hooks/useWhatsApp';
import { WhatsApp } from './logos/WhatsApp';

const WhatsAppCommercialButton = () => {
    // Usar número de ventas para WhatsApp comercial
    const { openWhatsApp } = useWhatsApp({
        phoneNumber: "+5493517136311",
        defaultMessage: "¡Hola! Quiero uniformar a mi equipo 💼👕"
    });

    const handleClick = () => {
        openWhatsApp();
    };

    return (
        <button
            onClick={handleClick}
            className="fixed bottom-6 right-6 z-30 w-14 h-14 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center transform hover:scale-110 active:scale-95"
            aria-label="Contactar por WhatsApp comercial"
        >
            <WhatsApp/>
        </button>
    );
};

export default WhatsAppCommercialButton;

