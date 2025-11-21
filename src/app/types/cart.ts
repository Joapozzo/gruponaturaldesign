// Tipos base del producto en el carrito
export interface CartProduct {
    id: number;
    nombre: string;
    descripcion: string;
    categoria: string;
    precio: number;
    imagen: string;
    stock?: number;
    um_id?: number;
    lista_precio_id?: number;
}

// Item en el carrito
export interface CartItem {
    product: CartProduct;
    quantity: number;
    subtotal: number;
    especificaciones?: string;
}

// Datos del cliente
export interface CustomerData {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    empresa?: string;
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
    subtotal: number;
    iva: number;
    total: number;

    // Actions
    addItem: (product: CartProduct, quantity?: number, especificaciones?: string) => void;
    removeItem: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    updateEspecificaciones: (productId: number, especificaciones: string) => void;
    clearCart: () => void;

    setCustomerData: (data: CustomerData) => void;
    setShippingData: (data: ShippingData) => void;
    setPaymentData: (data: PaymentData) => void;

    generateWhatsAppMessage: () => string;
}