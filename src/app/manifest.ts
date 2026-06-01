import { BRAND_NAME, BRAND_SHORT } from '@/app/utils/constants';

import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: `${BRAND_NAME} - Uniformes Empresariales`,
        short_name: BRAND_SHORT,
        description: 'Uniformes empresariales, ropa de trabajo y merchandising de diseño en Córdoba. +25 años de experiencia vistiendo empresas.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#Ed3237',
        orientation: 'portrait-primary',
        scope: '/',
        icons: [
            {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
        categories: ['business', 'shopping', 'productivity'],
        lang: 'es-AR',
        dir: 'ltr',
    }
}