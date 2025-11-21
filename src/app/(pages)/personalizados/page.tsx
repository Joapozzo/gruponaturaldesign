"use client";
import React from 'react';
import HeroPersonalizados from '../../components/HeroPersonalizados';
import UniformesShowcase from '../../components/UniformesShowcase';
import ProyectosPersonalizados from '../../components/ProyectosPersonalizados';
import Contacto from '../../components/Contacto';

const PersonalizadosPage = () => {
    return (
        <div className="min-h-screen bg-white">

            {/* CSS Variables */}
            <style jsx global>{`
        :root {
          --red: #Ed3237;
          --red-dark: #A80006;
          --black: #000000;
          --white: #FFFFFF;
          --gray-light: #BDBFC1;
          --gray-medium: #666666;
          --gray-bg: #F5F5F5;
        }
      `}</style>

            <HeroPersonalizados />
            <UniformesShowcase />
            <ProyectosPersonalizados />
            <Contacto />
        </div>
    );
};

export default PersonalizadosPage;

