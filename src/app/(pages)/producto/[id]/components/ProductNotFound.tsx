"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { Package, ArrowLeft } from 'lucide-react';
import Button from '@/app/components/ui/Button';

export default function ProductNotFound() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-50 px-5 flex items-center justify-center">
            <div className="text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Package className="w-12 h-12 text-gray-400" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Producto no encontrado</h1>
                <p className="text-gray-600 mb-6">El producto que buscas no existe o ha sido removido.</p>
                <Button
                    variant="black"
                    size="lg"
                    onClick={() => router.push('/catalogo')}
                    className="inline-flex items-center space-x-2"
                >
                    <ArrowLeft size={16} />
                    <span>Volver al Shop Online</span>
                </Button>
            </div>
        </div>
    );
}

