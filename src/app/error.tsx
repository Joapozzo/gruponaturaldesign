"use client";
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import ErrorPageTemplate from './components/ErrorPageTemplate';
import Button from './components/ui/Button';

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
    return (
        <ErrorPageTemplate
            code="500"
            title="Algo salió mal"
            description="Ocurrió un error inesperado. Por favor, intenta nuevamente o contacta al soporte si el problema persiste."
            icon={AlertTriangle}
            showBackButton={false}
        >
            {/* Botón de reintentar adicional */}
            <div className="flex justify-center">
                <Button
                    variant="black"
                    size="lg"
                    onClick={reset}
                    className="inline-flex items-center space-x-2"
                >
                    <span>Intentar nuevamente</span>
                </Button>
            </div>

            {/* Información del error en desarrollo */}
            {process.env.NODE_ENV === 'development' && error.message && (
                <div className="max-w-2xl mx-auto mt-4">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                        <p className="text-sm font-semibold text-red-800 mb-2">Error details (solo en desarrollo):</p>
                        <p className="text-xs text-red-600 font-mono break-all">{error.message}</p>
                        {error.digest && (
                            <p className="text-xs text-red-500 mt-2">Digest: {error.digest}</p>
                        )}
                    </div>
                </div>
            )}
        </ErrorPageTemplate>
    );
}

