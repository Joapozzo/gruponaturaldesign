/**
 * Servicio para manejo de stock
 * Lógica separada y delicada - NO mostrar stock real al usuario
 */

export interface StockInfo {
    isLowStock: boolean; // true si stock < 5
    canAddMore: boolean; // true si se puede agregar más unidades
    maxQuantity: number; // Cantidad máxima que se puede agregar
}

/**
 * Obtiene información de stock sin revelar el número exacto
 * @param stock Stock disponible (número real)
 * @param currentQuantity Cantidad actual en el carrito/seleccionada
 * @returns Información de stock para mostrar al usuario
 */
export function getStockInfo(stock: number | null | undefined, currentQuantity: number = 0): StockInfo {
    // Si no hay stock definido, permitir agregar (asumir stock ilimitado)
    if (stock === null || stock === undefined || stock < 0) {
        return {
            isLowStock: false,
            canAddMore: true,
            maxQuantity: Infinity,
        };
    }

    const availableStock = Math.max(0, stock);
    const isLowStock = availableStock < 5;
    const canAddMore = currentQuantity < availableStock;
    const maxQuantity = availableStock;

    return {
        isLowStock,
        canAddMore,
        maxQuantity,
    };
}

/**
 * Valida si se puede agregar una cantidad específica de unidades
 * @param stock Stock disponible
 * @param currentQuantity Cantidad actual
 * @param quantityToAdd Cantidad que se quiere agregar
 * @returns true si se puede agregar, false si no
 */
export function canAddQuantity(
    stock: number | null | undefined,
    currentQuantity: number,
    quantityToAdd: number = 1
): boolean {
    if (stock === null || stock === undefined || stock < 0) {
        return true; // Sin stock definido, permitir
    }

    return (currentQuantity + quantityToAdd) <= stock;
}

/**
 * Obtiene el mensaje de stock para mostrar al usuario
 * NO revela el número exacto de stock
 * @param stock Stock disponible
 * @returns Mensaje a mostrar o null si no hay mensaje
 */
export function getStockMessage(stock: number | null | undefined): string | null {
    if (stock === null || stock === undefined || stock < 0) {
        return null;
    }

    if (stock < 5 && stock > 0) {
        return 'ÚLTIMAS UNIDADES';
    }

    if (stock === 0) {
        return 'SIN STOCK';
    }

    return null;
}

/**
 * Obtiene la cantidad máxima que se puede agregar
 * @param stock Stock disponible
 * @param currentQuantity Cantidad actual
 * @returns Cantidad máxima que se puede agregar
 */
export function getMaxAddableQuantity(
    stock: number | null | undefined,
    currentQuantity: number
): number {
    if (stock === null || stock === undefined || stock < 0) {
        return Infinity; // Sin stock definido, permitir cualquier cantidad
    }

    return Math.max(0, stock - currentQuantity);
}





