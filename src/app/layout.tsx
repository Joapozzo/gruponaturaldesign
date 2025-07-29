import type { Metadata } from "next";
import { Poppins, Montserrat } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "./components/WhatsAppButton";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

// Fuentes según el manual de marca NTDS
// Franklin Gothic Heavy no está en Google Fonts, usamos Poppins como fallback principal
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

// Montserrat como alternativa adicional
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  // Título optimizado para SEO
  title: {
    default: "NTDS - Uniformes Empresariales y Escolares de Diseño | Natural Design",
    template: "%s | NTDS Natural Design"
  },

  // Descripción optimizada con keywords
  description: "NTDS Natural Design: Uniformes empresariales, ropa de trabajo y merchandising de diseño en Córdoba. +25 años de experiencia, +500 clientes satisfechos. Calidad y diseño en uniformes profesionales.",

  // Keywords principales
  keywords: [
    "uniformes empresariales",
    "ropa de trabajo",
    "uniformes escolares",
    "merchandising empresarial",
    "uniformes Córdoba",
    "Natural Design",
    "NTDS",
    "uniformes de diseño",
    "ropa corporativa",
    "uniformes profesionales",
    "indumentaria laboral",
    "uniformes administrativos",
    "uniformes gastronomía",
    "uniformes industriales",
    "uniformes salud",
    "textil empresarial"
  ],

  // Información del sitio
  applicationName: "NTDS Natural Design",
  authors: [{ name: "Natural Design", url: "https://naturalonline.com.ar" }],
  creator: "Natural Design",
  publisher: "NTDS Natural Design",

  // Configuración de idioma y región
  alternates: {
    canonical: "https://naturalonline.com.ar",
    languages: {
      "es-AR": "https://naturalonline.com.ar",
    },
  },

  // Open Graph para redes sociales
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://naturalonline.com.ar",
    title: "NTDS - Uniformes Empresariales y Escolares de Diseño",
    description: "Uniformes empresariales, ropa de trabajo y merchandising de diseño en Córdoba. +25 años de experiencia vistiendo empresas con calidad y estilo.",
    siteName: "NTDS Natural Design",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NTDS Natural Design - Uniformes Empresariales",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "NTDS - Uniformes Empresariales de Diseño",
    description: "Uniformes empresariales y ropa de trabajo de calidad en Córdoba. +25 años de experiencia, +500 clientes satisfechos.",
    images: ["/twitter-image.jpg"],
    creator: "@naturaldesign_ntds",
  },

  // Datos estructurados básicos
  other: {
    "business:contact_data:street_address": "Rivera Indarte 2143",
    "business:contact_data:locality": "Córdoba",
    "business:contact_data:region": "Córdoba",
    "business:contact_data:postal_code": "5000",
    "business:contact_data:country_name": "Argentina",
    "business:contact_data:phone_number": "+54 351 7136316",
    "business:contact_data:email": "info@naturalonline.com.ar",
  },

  // Robots y indexación
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Verificación y herramientas
  verification: {
    google: "tu-código-de-verificación-google",
    // yandex: "tu-código-yandex",
    // bing: "tu-código-bing",
  },

  // Categorización
  category: "Business",
  classification: "Uniformes Empresariales, Ropa de Trabajo, Textil",

  // Información adicional
  generator: "Next.js",
  referrer: "origin-when-cross-origin",

  // Configuración de formato
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-AR">
      <head>
        {/* Datos estructurados JSON-LD para SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "NTDS Natural Design",
              "alternateName": "Natural Design",
              "url": "https://naturalonline.com.ar",
              "logo": "https://naturalonline.com.ar/logo.png",
              "image": "https://naturalonline.com.ar/og-image.jpg",
              "description": "Empresa especializada en uniformes empresariales, ropa de trabajo y merchandising de diseño con más de 25 años de experiencia en Córdoba, Argentina.",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Rivera Indarte 2143",
                "addressLocality": "Córdoba",
                "addressRegion": "Córdoba",
                "postalCode": "5000",
                "addressCountry": "AR"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+54-351-7136316",
                "contactType": "customer service",
                "email": "info@naturalonline.com.ar",
                "availableLanguage": "Spanish"
              },
              "sameAs": [
                "https://www.instagram.com/naturaldesign.ntds/"
              ],
              "foundingDate": "1999",
              "numberOfEmployees": "10-50",
              "areaServed": {
                "@type": "Country",
                "name": "Argentina"
              },
              "serviceType": [
                "Uniformes empresariales",
                "Ropa de trabajo",
                "Merchandising textil",
                "Uniformes escolares",
                "Indumentaria corporativa"
              ],
              "knowsAbout": [
                "Diseño de uniformes",
                "Textil empresarial",
                "Ropa corporativa",
                "Merchandising promocional"
              ]
            })
          }}
        />

        {/* Preconnect para optimización de fuentes */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        <link rel="icon" href="/logos/logo-2.svg" type="image/svg+xml" sizes="any" />
        <link rel="icon" href="/logos/logo-2.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logos/logo-2.svg" />
        <link rel="manifest" href="/manifest.json" />

        {/* Optimización de recursos */}
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        <link rel="dns-prefetch" href="//api.placeholder.com" />

        {/* Theme color */}
        <meta name="theme-color" content="#Ed3237" />
        <meta name="msapplication-TileColor" content="#Ed3237" />

        {/* Security headers */}
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      </head>
      <Navbar />
      <body
        className={`${poppins.variable} ${montserrat.variable} antialiased`}
        style={{
          fontFamily: "var(--font-poppins), 'Franklin Gothic Heavy', 'Arial Black', sans-serif"
        }}
      >
        {children}
      </body>
      <Footer />
      <WhatsAppButton />
    </html>
  );
}