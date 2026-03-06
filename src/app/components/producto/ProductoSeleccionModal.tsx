'use client';

import React, { useState, useEffect } from 'react';
import FormModal from '../modal/FormModal';
import Button from '../ui/Button';
import { Search, Package, Layers } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { productoService } from '@/app/services/producto.service';
import { productosKeys } from '@/app/utils/productosKeys';
import type { ProductoPadreBusqueda } from '@/app/services/producto.service';
import { formatNombreConGenero } from '@/app/components/admin/productos/columns';

interface ProductoSeleccionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSeleccionarCrearProducto: () => void;
  onSeleccionarCrearVariante: (productoPadre: ProductoPadreBusqueda) => void;
}

export const ProductoSeleccionModal: React.FC<ProductoSeleccionModalProps> = ({
  isOpen,
  onClose,
  onSeleccionarCrearProducto,
  onSeleccionarCrearVariante,
}) => {
  const [busqueda, setBusqueda] = useState('');
  const [busquedaDebounced, setBusquedaDebounced] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState<ProductoPadreBusqueda | null>(null);

  // Debounce: esperar 500ms después del último tipeo antes de buscar
  useEffect(() => {
    const timer = setTimeout(() => {
      setBusquedaDebounced(busqueda);
    }, 500);

    return () => clearTimeout(timer);
  }, [busqueda]);

  const { data: productosData, isLoading } = useQuery({
    queryKey: productosKeys.buscarPadre({ nombre: busquedaDebounced, limit: 20 }),
    queryFn: () => {
      // Limpiar la búsqueda: trim y eliminar caracteres especiales
      const busquedaLimpia = busquedaDebounced.trim().replace(/[\t\n\r]/g, '');
      return productoService.buscarProductosPadre({
        nombre: busquedaLimpia || undefined,
        limit: 20,
      });
    },
    enabled: isOpen && busquedaDebounced.trim().length >= 2,
  });

  const handleSeleccionarProducto = (producto: ProductoPadreBusqueda) => {
    setProductoSeleccionado(producto);
  };

  const handleContinuarVariante = () => {
    if (productoSeleccionado) {
      onSeleccionarCrearVariante(productoSeleccionado);
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Crear producto"
      size="lg"
      showCancel={false}
      footerActions={
        <>
          <Button
            type="button"
            variant="grayOutline"
            size="lg"
            onClick={onClose}
            className="tracking-wide h-12"
          >
            Cancelar
          </Button>
        </>
      }
    >
      <div className="space-y-6 px-2 pb-2">
        {/* Opción 1: Crear Producto Nuevo */}
        <div className="border rounded-lg p-6 hover:border-black transition-colors cursor-pointer"
          onClick={onSeleccionarCrearProducto}
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-black rounded-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">Crear producto nuevo</h3>
              <p className="text-gray-600 text-sm">
                Crea un producto completamente nuevo desde cero. Incluye todos los datos de SFactory y locales.
              </p>
            </div>
          </div>
        </div>

        {/* Separador */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">O</span>
          </div>
        </div>

        {/* Opción 2: Crear Variante */}
        <div className="border rounded-lg p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-gray-800 rounded-lg">
              <Layers className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">Crear variante</h3>
              <p className="text-gray-600 text-sm mb-4">
                Crea una nueva variante (talle/color) de un producto existente. Los datos se pre-llenarán desde el producto padre.
              </p>
            </div>
          </div>

          {/* Búsqueda de producto padre */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o código (SKU)..."
                value={busqueda}
                onChange={(e) => {
                  // Limpiar el valor al cambiar: eliminar tabs y otros caracteres de control
                  const valorLimpio = e.target.value.replace(/[\t\n\r]/g, '');
                  setBusqueda(valorLimpio);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            {/* Lista de resultados */}
            {busquedaDebounced.length >= 2 && (
              <div className="border rounded-lg max-h-64 overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 text-center text-gray-500">
                    Buscando...
                  </div>
                ) : productosData?.productos && productosData.productos.length > 0 ? (
                  <div className="divide-y">
                    {productosData.productos.map((producto) => (
                      <div
                        key={producto.id}
                        onClick={() => handleSeleccionarProducto(producto)}
                        className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                          productoSeleccionado?.id === producto.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{formatNombreConGenero(producto.nombre, producto.genero ?? producto.sexo)}</p>
                            <p className="text-sm text-gray-500">
                              {producto.sexo || 'Sin sexo'} • {producto.variantesCount} variante(s) • {producto.codigoAgrupacion}
                            </p>
                          </div>
                          {productoSeleccionado?.id === producto.id && (
                            <div className="text-blue-500">✓</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No se encontraron productos
                  </div>
                )}
              </div>
            )}

            {/* Botón continuar variante */}
            {productoSeleccionado && (
              <Button
                type="button"
                variant="black"
                size="lg"
                fullWidth
                onClick={handleContinuarVariante}
                className="tracking-wide h-12"
              >
                Continuar con &quot;{formatNombreConGenero(productoSeleccionado.nombre, productoSeleccionado.genero ?? productoSeleccionado.sexo)}&quot;
              </Button>
            )}
          </div>
        </div>
      </div>
    </FormModal>
  );
};

export default ProductoSeleccionModal;

