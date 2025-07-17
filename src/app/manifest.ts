import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'NTDS Natural Design - Uniformes Empresariales',
        short_name: 'NTDS',
        description: 'Uniformes empresariales, ropa de trabajo y merchandising de diseño en Córdoba. +25 años de experiencia vistiendo empresas.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#Ed3237',
        orientation: 'portrait-primary',
        scope: '/',
        icons: [
            {
                src: '/android-chrome-192x192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/android-chrome-512x512.png',
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