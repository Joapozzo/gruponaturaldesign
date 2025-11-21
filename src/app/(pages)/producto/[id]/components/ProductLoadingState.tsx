"use client";
import React from 'react';

export default function ProductLoadingState() {
    return (
        <div className="min-h-screen bg-gray-50 px-5 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-6"></div>
                <p className="text-gray-600">Cargando producto...</p>
            </div>
        </div>
    );
}

