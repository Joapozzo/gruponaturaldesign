// hooks/useContactForm.ts
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { contactSchema, type ContactFormData } from '../schemas/contactSchema';

interface ApiError {
    success: false;
    message: string;
    errors?: Array<{
        field: string;
        message: string;
    }>;
    retryAfter?: number;
}

interface UseContactFormReturn {
    register: any;
    handleSubmit: any;
    errors: any;
    isSubmitting: boolean;
    submitForm: (data: ContactFormData) => Promise<void>;
    isSuccess: boolean;
    errorMessage: string | null;
    canRetry: boolean;
    retryAfter: number | null;
}

export const useContactForm = (): UseContactFormReturn => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [canRetry, setCanRetry] = useState(true);
    const [retryAfter, setRetryAfter] = useState<number | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setError
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            nombreCompleto: '',
            email: '',
            empresa: '',
            telefono: '',
            mensaje: '',
            aceptaTerminos: true
        }
    });

    const submitForm = async (data: ContactFormData) => {
        setIsSubmitting(true);
        setErrorMessage(null);
        setIsSuccess(false);
        setCanRetry(true);
        setRetryAfter(null);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                const apiError = result as ApiError;

                // Manejar errores específicos
                if (response.status === 429) {
                    // Rate limit excedido
                    setCanRetry(false);
                    setRetryAfter(apiError.retryAfter || 15 * 60 * 1000);
                    setErrorMessage(apiError.message || 'Demasiadas consultas. Intenta más tarde.');
                } else if (response.status === 400 && apiError.errors) {
                    // Errores de validación específicos
                    apiError.errors.forEach(error => {
                        setError(error.field as keyof ContactFormData, {
                            type: 'server',
                            message: error.message
                        });
                    });
                    setErrorMessage('Por favor, corrige los errores en el formulario.');
                } else if (response.status === 503) {
                    // Servicio no disponible
                    setErrorMessage('Servicio temporalmente no disponible. Intenta más tarde.');
                } else {
                    // Error genérico
                    setErrorMessage(apiError.message || 'Error al enviar el formulario');
                }

                throw new Error(apiError.message);
            }

            // Éxito
            setIsSuccess(true);
            reset();

            // Auto-limpiar mensaje de éxito después de 10 segundos
            setTimeout(() => {
                setIsSuccess(false);
            }, 10000);

            // Opcional: scroll al mensaje de éxito
            const successElement = document.querySelector('[data-success-message]');
            if (successElement) {
                successElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

        } catch (error) {
            console.error('Error al enviar formulario:', error);

            // Si no se ha seteado un mensaje específico, usar uno genérico
            if (!errorMessage) {
                if (error instanceof TypeError && error.message.includes('fetch')) {
                    setErrorMessage('Error de conexión. Verifica tu internet e intenta nuevamente.');
                } else {
                    setErrorMessage('Error inesperado. Intenta nuevamente en unos minutos.');
                }
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        register,
        handleSubmit,
        errors,
        isSubmitting,
        submitForm,
        isSuccess,
        errorMessage,
        canRetry,
        retryAfter
    };
};