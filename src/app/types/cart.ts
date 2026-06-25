import type { CuponAplicado } from './cupones';

// Tipos base del producto en el carrito
export interface CartProduct {
    id: number;
    /** IDs para checkout MP / S-Factory; si faltan, el cliente puede usar `id` como respaldo */
    productoWebId?: number;
    productoPadreId?: number;
    sfactoryItemId?: number;
    codigo?: string;
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
    necesitaFactura?: boolean;
    facturaTipo?: 'A' | 'C' | null;
    facturaRazonSocial?: string;
}

/** Payload alineado con `CheckoutEnvioClientPayload` del API (sin `address`: se arma al iniciar MP). */
export interface CheckoutEnvioSelection {
    provider: 'correo' | 'andreani';
    deliveryType: 'homeDelivery' | 'agency';
    parcel: {
        weightGrams: number;
        height: number;
        width: number;
        depth: number;
        declaredValue: number;
    };
    cpDestino: string;
    clientQuotedAmount: number;
    /** MiCorreo: productType (ej. CP, EP) de la tarifa elegida */
    correoProductType?: string;
    agencyId?: string;
    agencyLabel?: string;
}

// Datos de envío
export interface ShippingData {
    tipo: 'envio' | 'retiro';
    /** @deprecated Derivado de calle + numero */
    direccion?: string;
    calle?: string;
    numero?: string;
    piso?: string;
    depto?: string;
    barrio?: string;
    loteManzana?: string;
    localidad?: string;
    provincia?: string;
    codigo_postal?: string;
    notas?: string;
    fecha_entrega?: string;
    /** Preferencias UI checkout (carrier / modalidad). */
    checkoutProvider?: 'correo' | 'andreani';
    checkoutDelivery?: 'homeDelivery' | 'agency';
    /** Cotización aceptada (servidor la valida de nuevo en MP). */
    checkoutEnvio?: CheckoutEnvioSelection;
}

// Datos de pago
export type MpCheckoutModo = 'transfer' | 'financiado';

export interface PaymentData {
    metodo: 'whatsapp' | 'transferencia' | 'efectivo' | 'tarjeta' | 'mercado_pago';
    /** Solo cuando metodo === mercado_pago: transfer (precio transfer) o financiado (lista + cuotas). */
    mpModo?: MpCheckoutModo;
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

    // Cupón
    cuponAplicado: CuponAplicado | null;
    cuponDescuento: number;

    // Actions
    addItem: (product: CartProduct, quantity?: number, especificaciones?: string, bordado?: boolean) => void;
    removeItem: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    updateEspecificaciones: (productId: number, especificaciones: string) => void;
    updateBordado: (productId: number, bordado: boolean) => void;
    clearCart: () => void;
    /** Limpia cupón y datos de checkout; mantiene ítems del carrito. */
    clearCheckoutSession: () => void;

    setCustomerData: (data: CustomerData) => void;
    setShippingData: (data: ShippingData) => void;
    setPaymentData: (data: PaymentData) => void;

    setCuponAplicado: (cupon: CuponAplicado | null) => void;

    generateWhatsAppMessage: () => string;
}