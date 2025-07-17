export const seoConfig = {
    defaultTitle: 'NTDS - Uniformes Empresariales y Escolares de Diseño | Natural Design',
    titleTemplate: '%s | NTDS Natural Design',
    defaultDescription: 'NTDS Natural Design: Uniformes empresariales, ropa de trabajo y merchandising de diseño en Córdoba. +25 años de experiencia, +500 clientes satisfechos.',
    siteUrl: 'https://naturalonline.com.ar',
    siteName: 'NTDS Natural Design',

    // Structured data templates
    organizationSchema: {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'NTDS Natural Design',
        alternateName: 'Natural Design',
        url: 'https://naturalonline.com.ar',
        logo: 'https://naturalonline.com.ar/logo.png',
        description: 'Empresa especializada en uniformes empresariales, ropa de trabajo y merchandising de diseño con más de 25 años de experiencia en Córdoba, Argentina.',
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Rivera Indarte 2143',
            addressLocality: 'Córdoba',
            addressRegion: 'Córdoba',
            postalCode: '5000',
            addressCountry: 'AR'
        },
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+54-351-7136316',
            contactType: 'customer service',
            email: 'info@naturalonline.com.ar',
            availableLanguage: 'Spanish'
        },
        sameAs: [
            'https://www.instagram.com/naturaldesign.ntds/'
        ],
        foundingDate: '1999',
        areaServed: {
            '@type': 'Country',
            name: 'Argentina'
        }
    },

    // Local business schema
    localBusinessSchema: {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        '@id': 'https://naturalonline.com.ar',
        name: 'NTDS Natural Design',
        image: 'https://naturalonline.com.ar/og-image.jpg',
        telephone: '+54-351-7136316',
        email: 'info@naturalonline.com.ar',
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Rivera Indarte 2143',
            addressLocality: 'Córdoba',
            addressRegion: 'Córdoba',
            postalCode: '5000',
            addressCountry: 'AR'
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: -31.4201,
            longitude: -64.1888
        },
        openingHoursSpecification: [
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: '09:00',
                closes: '18:00'
            }
        ],
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            reviewCount: '127'
        },
        priceRange: '$$'
    }
}

// Función para generar metadata dinámica
export function generatePageMetadata(
    title: string,
    description: string,
    path: string = '',
    images?: string[]
) {
    const url = `${seoConfig.siteUrl}${path}`

    return {
        title,
        description,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title,
            description,
            url,
            siteName: seoConfig.siteName,
            images: images || ['/og-image.jpg'],
            locale: 'es_AR',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: images || ['/twitter-image.jpg'],
        },
    }
}