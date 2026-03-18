"use client";

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Button from '@/components/ui/Button';

const HeroMayorista = () => {
    return (
        <section
            id="wholesale-hero"
            className="relative w-full flex flex-col overflow-hidden"
        >
            {/* Mobile: hero-2-mobile 1890×3360 → aspect 9/16, se ve completa */}
            <div className="relative w-full aspect-[9/16] md:hidden">
                <Image
                    src="/imgs/hero-2-mobile.png"
                    alt="Hero mayorista"
                    fill
                    priority
                    quality={90}
                    sizes="100vw"
                    className="object-cover object-center"
                />
            </div>
            {/* Desktop: hero-2, misma dimensión que Hero (aspect 2/1) */}
            <div className="relative w-full aspect-[2/1] hidden md:block">
                <Image
                    src="/imgs/hero-2.png"
                    alt="Hero mayorista"
                    fill
                    priority
                    quality={90}
                    sizes="100vw"
                    className="object-cover object-center"
                />
            </div>

            {/* Botón Volver, debajo del navbar */}
            <div className="absolute left-0 z-10 w-full px-4 lg:px-15 top-6 lg:top-8 md:top-8">
                <Button
                    variant="lightWhiteOutline"
                    size="sm"
                    onClick={() => window.history.back()}
                    className="inline-flex items-center space-x-2"
                >
                    <ArrowLeft size={16} />
                    <span>Volver</span>
                </Button>
            </div>
        </section>
    );
};

export default HeroMayorista;
