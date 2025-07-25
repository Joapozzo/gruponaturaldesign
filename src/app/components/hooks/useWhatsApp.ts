import { useCallback } from 'react';

interface UseWhatsAppProps {
    phoneNumber?: string;
    defaultMessage?: string;
}

export const useWhatsApp = ({
    phoneNumber = "+549351713-6316",
    defaultMessage = "¡Hola! Me interesa conocer más sobre los uniformes de NTDS. ¿Te gustaría hablar conmigo?"
}: UseWhatsAppProps = {}) => {

    const openWhatsApp = useCallback((customMessage?: string) => {
        const message = customMessage || defaultMessage;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodedMessage}`;

        // Abrir en nueva pestaña
        window.open(whatsappUrl, '_blank');
    }, [phoneNumber, defaultMessage]);

    const getWhatsAppLink = useCallback((customMessage?: string) => {
        const message = customMessage || defaultMessage;
        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodedMessage}`;
    }, [phoneNumber, defaultMessage]);

    return {
        openWhatsApp,
        getWhatsAppLink,
        phoneNumber,
        defaultMessage
    };
};