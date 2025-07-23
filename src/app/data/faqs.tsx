import {
    ChevronDown,
    ShoppingCart,
    Package,
    Clock,
    Ruler,
    Image,
    Palette,
} from 'lucide-react';

export const frequentFaqs = [
    {
        pregunta: "¿Cómo hacer tu pedido?",
        respuesta: "1) Ponete en contacto con nosotros vía mail o WhatsApp. 2) Coordiná una visita a tu empresa o reunión en el showroom, para conocer nuestros productos. 3) Enviá tu pedido especificando talles y cantidades. 4) Con estos datos te enviaremos la cotización vía mail o WhatsApp.",
        icon: ShoppingCart
    },
    {
        pregunta: "¿Cuáles son las cantidades mínimas?",
        respuesta: "Trabajamos de manera mayorista con un mínimo de 30 unidades por artículo. Esto nos permite mantener la calidad y ofrecer los mejores precios del mercado.",
        icon: Package
    },
    {
        pregunta: "¿Cuáles son los tiempos de entrega?",
        respuesta: "Las fechas de entrega se pactan con el vendedor una vez confirmado el pedido con la información solicitada (talles-logos-cantidades) y el pago de la seña correspondiente. Se estipula aproximadamente un máximo de 60 días una vez recibida la información y el pago.",
        icon: Clock
    }
];

export const workProcessFaqs = [
    {
        title: "Toma de medidas y talles",
        content:
            "Tenemos tablas de talles para cada uno de nuestros artículos con medidas reales y estandarizadas. Te enviaremos fichas con medidas de cada producto, compararás las medidas de tu personal con nuestras tablas y para talles especiales desarrollamos productos a medida.",
        icon: Ruler,
        bgColor: "bg-gray-100",
        iconColor: "text-red-600",
    },
    {
        title: "Logos y personalización",
        content:
            "Podrás colocar el logo de tu empresa en todas las prendas. Contamos con servicio de bordado y estampado. Nuestras diseñadoras te asesorarán para elegir la mejor opción según el textil, ubicación y logo de tu empresa.",
        icon: Image,
        bgColor: "bg-gray-100",
        iconColor: "text-red-600",
    },
    {
        title: "Diseño de prendas",
        content:
            "Contamos con un equipo de Diseñadoras de Indumentaria que te asesorarán en el diseño de tus uniformes. Desarrollamos prendas de trabajo que transmitan tu identidad corporativa con gran variedad de textiles y avíos.",
        icon: Palette,
        bgColor: "bg-gray-100",
        iconColor: "text-red-600",
    },
];