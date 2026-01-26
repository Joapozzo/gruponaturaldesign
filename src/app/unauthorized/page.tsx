"use client";
import React from 'react';
import { Lock } from 'lucide-react';
import ErrorPageTemplate from '../components/ErrorPageTemplate';

export default function Unauthorized() {
    return (
        <ErrorPageTemplate
            code="403"
            title="Acceso no autorizado"
            description="No tienes permisos para acceder a esta página. Por favor, contacta al administrador si crees que esto es un error."
            icon={Lock}
        />
    );
}

