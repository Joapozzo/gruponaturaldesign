'use client';

import { useCallback } from 'react';
import { useTiendaConfig } from '@/app/hooks/useTiendaConfig';
import {
  WHATSAPP_PHONE_NUMBER,
  WHATSAPP_DEFAULT_MESSAGE,
  getWhatsAppNumberForUrl,
} from '@/app/utils/constants';

interface UseWhatsAppProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export const useWhatsApp = ({ phoneNumber, defaultMessage }: UseWhatsAppProps = {}) => {
  const tienda = useTiendaConfig();
  const resolvedPhone = phoneNumber ?? tienda.whatsappTelefono ?? WHATSAPP_PHONE_NUMBER;
  const resolvedMessage = defaultMessage ?? tienda.whatsappMensajeDefault ?? WHATSAPP_DEFAULT_MESSAGE;

  const openWhatsApp = useCallback(
    (customMessage?: string) => {
      const message = customMessage || resolvedMessage;
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${getWhatsAppNumberForUrl(resolvedPhone)}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
    },
    [resolvedPhone, resolvedMessage]
  );

  const getWhatsAppLink = useCallback(
    (customMessage?: string) => {
      const message = customMessage || resolvedMessage;
      const encodedMessage = encodeURIComponent(message);
      return `https://wa.me/${getWhatsAppNumberForUrl(resolvedPhone)}?text=${encodedMessage}`;
    },
    [resolvedPhone, resolvedMessage]
  );

  return {
    openWhatsApp,
    getWhatsAppLink,
    phoneNumber: resolvedPhone,
    defaultMessage: resolvedMessage,
  };
};
