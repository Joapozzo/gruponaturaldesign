import React, { useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { GroupedProductV2 } from '@/app/types/producto-v2';
import { GroupedProduct, ProductVariant, ProductWithImage } from '@/app/types/producto';
import ProductCardGrouped from '@/app/components/ProductCardGrouped';

interface ProductsGridProps {
    products: GroupedProductV2[];
    expandedSku: string | null;
    onExpandChange: (sku: string | null) => void;
}

/**
 * Adapta GroupedProductV2 a GroupedProduct para compatibilidad con ProductCardGrouped
 */
const adaptGroupedProductV2ToGroupedProduct = (groupV2: GroupedProductV2): GroupedProduct => {
    // Adaptar displayProduct
    const displayProduct: ProductWithImage = {
        Codigo: groupV2.displayProduct.codigo,
        Tipo: null,
        Descripcion: groupV2.displayProduct.item,
        UM: null,
        Rubro: groupV2.displayProduct.rubro,
        Subrubro: groupV2.displayProduct.subrubro,
        Activo: true,
        Moneda: null,
        PrecioCosto: null,
        UltActualizacion: null,
        CostoXLM: null,
        ListaMaterial: null,
        PrecioUMCompra: null,
        UMCompra: null,
        PrecioVenta: groupV2.displayProduct.precioLista,
        UtilidadP: null,
        UtilidadR: null,
        Base: null,
        Barcode: null,
        EqCodigoContable: null,
        EqCodigoExterno: null,
        ItemDeCompra: null,
        ItemDeVenta: true,
        ItemDeAlquiler: null,
        Fabricar: null,
        APedido: null,
        GrupoGasto: null,
        CTACompras: null,
        CTAVentas: null,
        StockMin: null,
        StockMax: null,
        PesoBruto: null,
        DescripcionCorta: groupV2.displayProduct.nombreBase,
        Observaciones: null,
        ProveedorPorDefecto: null,
        DepositoConsumo: null,
        Ubicacion: null,
        ItemLote: null,
        ItemSerie: null,
        Clase: null,
        Linea: null,
        Material: null,
        ActPrecioXOC: null,
        FlowintSincroEnabled: null,
        Usuario: null,
        FechaAlta: null,
        // Campos extendidos
        imagen: groupV2.displayProduct.imagen || null,
        imagenes: groupV2.displayProduct.imagenes || [],
        tablaTallesImage: groupV2.displayProduct.tablaTallesImage || null,
        indicacionesBordadosUrl: groupV2.displayProduct.indicacionesBordadosImage || null,
        NOMBRE: groupV2.displayProduct.nombreBase,
        // Campos de precios adicionales del CSV
        precioTransfer: groupV2.displayProduct.precioTransfer,
        precio3cuotas: groupV2.displayProduct.precio3cuotas,
        precioSImp: groupV2.displayProduct.precioSImp,
        descripcionCompleta: groupV2.displayProduct.descripcion,
        textiles: groupV2.displayProduct.textiles,
    };

    // Adaptar variantes - cada variante tiene su propio producto con su descripción
    const variants: ProductVariant[] = groupV2.variants.map(v => {
        // Crear un ProductWithImage específico para esta variante con su descripción
        const variantProduct: ProductWithImage = {
            ...displayProduct,
            // Usar la descripción del producto de la variante (v.producto.item)
            Descripcion: v.producto.item || displayProduct.Descripcion,
            // Usar el precio de la variante
            PrecioVenta: v.precioLista || displayProduct.PrecioVenta,
            // Usar las imágenes específicas de esta variante si las tiene
            imagenes: v.producto.imagenes || displayProduct.imagenes,
            imagen: v.producto.imagen || displayProduct.imagen,
            // Mantener los nuevos campos de precios y descripción (con fallback al displayProduct)
            precioTransfer: v.producto.precioTransfer || displayProduct.precioTransfer,
            precio3cuotas: v.producto.precio3cuotas || displayProduct.precio3cuotas,
            precioSImp: v.producto.precioSImp || displayProduct.precioSImp,
            descripcionCompleta: v.producto.descripcion || displayProduct.descripcionCompleta,
            textiles: v.producto.textiles || displayProduct.textiles,
        };
        
        return {
            codigo: v.codigo,
            variantNumber: 0, // No tenemos número de variante en V2
            talle: v.talle,
            color: v.color,
            stock: v.stock,
            producto: variantProduct,
        };
    });

    return {
        skuBase: groupV2.skuBase,
        skuBaseSlug: groupV2.skuBaseSlug,
        displayProduct,
        variants,
        totalVariants: groupV2.totalVariants,
        availableColors: groupV2.availableColors,
        availableSizes: groupV2.availableSizes,
    };
};

const ProductsGrid: React.FC<ProductsGridProps> = ({
    products,
    expandedSku,
    onExpandChange,
}) => {
    // Memoizar la adaptación de productos para evitar recalcular en cada render
    const adaptedProducts = useMemo(() => {
        return products.map(adaptGroupedProductV2ToGroupedProduct);
    }, [products]);

    // Memoizar el handler de expansión para evitar re-renderizados de los hijos
    const handleExpandChange = useCallback((sku: string | null) => {
        onExpandChange(sku);
    }, [onExpandChange]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1 sm:gap-4 items-start"
        >
            {adaptedProducts.map((group, index) => (
                <ProductCardGrouped
                    key={group.skuBase}
                    group={group}
                    index={index}
                    expandedSku={expandedSku}
                    onExpandChange={handleExpandChange}
                />
            ))}
        </motion.div>
    );
};

// Optimizar con React.memo para evitar re-renderizados cuando las props no cambian
export default React.memo(ProductsGrid, (prevProps, nextProps) => {
    // Comparación simple: si las referencias de los arrays son iguales, no re-renderizar
    // También verificar que expandedSku no haya cambiado
    if (prevProps.expandedSku !== nextProps.expandedSku) return false;
    
    // Si los arrays tienen diferente longitud, hay que re-renderizar
    if (prevProps.products.length !== nextProps.products.length) return false;
    
    // Comparar las claves (skuBase) de todos los productos
    // Si las claves son las mismas y en el mismo orden, no re-renderizar
    const prevKeys = prevProps.products.map(p => p.skuBase).join(',');
    const nextKeys = nextProps.products.map(p => p.skuBase).join(',');
    
    return prevKeys === nextKeys;
});

