// Tipos base del producto en el carrito
export interface CartProduct {
    id: number;
    nombre: string;
    descripcion: string;
    categoria: string;
    precio: number; // Mantener por compatibilidad, pero usar precioLista
    precioLista: number; // Precio base (lista)
    precioTransfer?: number | null; // Precio con transferencia (15% desc)
    precioSinImp?: number | null; // Precio sin impuestos
    imagen: string;
    stock?: number;
    um_id?: number;
    lista_precio_id?: number;
    skuBaseSlug?: string; // Slug del producto para navegación (opcional)
}

// Item en el carrito
export interface CartItem {
    product: CartProduct;
    quantity: number;
    subtotal: number; // Subtotal con precio lista
    subtotalTransfer?: number; // Subtotal con precio transfer
    subtotalSinImp?: number; // Subtotal sin impuestos
    especificaciones?: string;
    bordado?: boolean;
}

// Datos del cliente
export interface CustomerData {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    empresa?: string;
    cuit?: string;
    fecha_nacimiento?: string;
    documento?: string;
    tipo_documento?: 'DNI' | 'CUIT' | 'CUIL';
}

// Datos de envío
export interface ShippingData {
    tipo: 'envio' | 'retiro';
    direccion?: string;
    localidad?: string;
    provincia?: string;
    codigo_postal?: string;
    notas?: string;
    fecha_entrega?: string;
}

// Datos de pago
export interface PaymentData {
    metodo: 'whatsapp' | 'transferencia' | 'efectivo' | 'tarjeta';
    notas?: string;
}

// Estado del carrito
export interface CartState {
    items: CartItem[];
    customerData: CustomerData | null;
    shippingData: ShippingData | null;
    paymentData: PaymentData | null;

    itemCount: number;
    subtotal: number; // Subtotal sin impuestos (precio lista)
    subtotalTransfer: number; // Subtotal con precio transfer
    totalLista: number; // Total con precio lista (con IVA)
    totalTransfer: number; // Total con precio transfer (con IVA)
    iva: number;
    total: number; // Mantener por compatibilidad (total con lista)

    // Actions
    addItem: (product: CartProduct, quantity?: number, especificaciones?: string, bordado?: boolean) => void;
    removeItem: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    updateEspecificaciones: (productId: number, especificaciones: string) => void;
    updateBordado: (productId: number, bordado: boolean) => void;
    clearCart: () => void;

    setCustomerData: (data: CustomerData) => void;
    setShippingData: (data: ShippingData) => void;
    setPaymentData: (data: PaymentData) => void;

    generateWhatsAppMessage: () => string;
}