"use client";

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Hero from '@/app/components/Hero';
import Button from '@/components/ui/Button';

const WHOLESALE_DESKTOP = ['/imgs/hero/hero-desktop.jpg'];
const WHOLESALE_MOBILE = ['/imgs/hero/hero-mobile.jpg'];

const HeroMayorista = () => {
    return (
        <Hero
            id="wholesale-hero"
            desktopSlides={WHOLESALE_DESKTOP}
            mobileSlides={WHOLESALE_MOBILE}
            alt="Hero mayorista"
            carousel={false}
            showScrollHint={false}
        >
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
        </Hero>
    );
};

export default HeroMayorista;
