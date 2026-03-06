"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { Mail, ArrowLeft, CheckCircle, CheckCircle2 } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/app/components/ui/Button';
import { motion } from 'framer-motion';

// Componente que usa useSearchParams - debe estar envuelto en Suspense
function EmailVerificationContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { sessionState, isLoading } = useAuth();
    const message = searchParams.get('message') || 'Verificá tu email para continuar.';
    
    const [isVerified, setIsVerified] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    // Verificar si el email ya está verificado (Firebase + sesión API)
    useEffect(() => {
        if (!isLoading) {
            if (sessionState) {
                const emailVerified = sessionState.emailVerified === true;
                setIsVerified(emailVerified);
                setIsChecking(false);
                
                if (emailVerified) {
                    const timer = setTimeout(() => {
                        router.push('/auth/login');
                    }, 2000);
                    return () => clearTimeout(timer);
                }
            } else {
                setIsChecking(false);
            }
        }
    }, [sessionState, isLoading, router]);

    // Si está verificado, mostrar mensaje de éxito
    if (isVerified) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
                <div className="max-w-md w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="text-center"
                    >
                        {/* Icono de éxito */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, type: "spring" }}
                            className="mb-4 flex justify-center"
                        >
                            <div className="bg-green-50 rounded-full p-4">
                                <CheckCircle2 className="w-12 h-12 text-green-600" />
                            </div>
                        </motion.div>

                        {/* Título */}
                        <h1 className="text-2xl font-bold text-black mb-3">
                            ¡Email Verificado!
                        </h1>

                        {/* Mensaje */}
                        <p className="text-base text-gray-700 mb-6">
                            Tu email ha sido verificado correctamente. Redirigiendo al login...
                        </p>

                        {/* Botón para ir al login inmediatamente */}
                        <Button
                            variant="black"
                            size="md"
                            onClick={() => router.push('/auth/login')}
                            className="w-full"
                        >
                            Ir al Login
                        </Button>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
            <div className="max-w-md w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-center"
                >
                    {/* Icono principal - más pequeño */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="mb-4 flex justify-center"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-red-100 rounded-full opacity-20"></div>
                            <div className="relative bg-red-50 rounded-full p-4">
                                <Mail className="w-10 h-10 text-[#Ed3237]" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Título - más pequeño */}
                    <h1 className="text-xl sm:text-2xl font-bold text-black mb-3">
                        Verificación de Email Requerida
                    </h1>

                    {/* Mensaje personalizado - más compacto */}
                    <p className="text-sm sm:text-base text-gray-700 mb-4">
                        {message}
                    </p>

                    {/* Información adicional - más compacta */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left">
                        <h2 className="text-sm font-semibold text-black mb-3 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Pasos a seguir:
                        </h2>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex items-start gap-2">
                                <span className="text-[#Ed3237] font-bold text-xs mt-0.5">1.</span>
                                <span>Revisá tu bandeja de entrada.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#Ed3237] font-bold text-xs mt-0.5">2.</span>
                                <span>Hacé clic en el enlace de verificación.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#Ed3237] font-bold text-xs mt-0.5">3.</span>
                                <span>Revisá spam si no lo encontrás.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#Ed3237] font-bold text-xs mt-0.5">4.</span>
                                <span>Volvé aquí después de verificar.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Botón de acción */}
                    <div className="flex flex-col gap-3">
                        <Button
                            variant="black"
                            size="md"
                            onClick={() => router.push('/auth/login')}
                            className="w-full inline-flex items-center justify-center space-x-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Volver al Login</span>
                        </Button>
                        
                        {/* Botón para verificar estado */}
                        {!isChecking && (
                            <Button
                                variant="blackOutline"
                                size="sm"
                                onClick={() => {
                                    // Redirigir al login - si el email está verificado, funcionará
                                    // Si no, Auth0 volverá a redirigir aquí
                                    router.push('/auth/login');
                                }}
                                className="w-full text-sm"
                            >
                                Ya verifiqué mi email
                            </Button>
                        )}
                    </div>

                    {/* Mensaje de ayuda adicional - más pequeño */}
                    <p className="text-xs text-gray-500 mt-4">
                        ¿No recibiste el email? Verificá tu dirección o contactá al administrador.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

// Componente de fallback para Suspense
function EmailVerificationFallback() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
            <div className="max-w-md w-full text-center">
                <div className="animate-pulse">
                    <div className="bg-gray-200 rounded-full w-16 h-16 mx-auto mb-4"></div>
                    <div className="bg-gray-200 rounded h-8 w-48 mx-auto mb-2"></div>
                    <div className="bg-gray-200 rounded h-4 w-64 mx-auto"></div>
                </div>
            </div>
        </div>
    );
}

// Componente de página principal que envuelve en Suspense
export default function EmailVerificationRequired() {
    return (
        <Suspense fallback={<EmailVerificationFallback />}>
            <EmailVerificationContent />
        </Suspense>
    );
}
