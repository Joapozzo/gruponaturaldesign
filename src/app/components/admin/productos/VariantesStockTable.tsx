'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '@/app/components/ui/Button';
import Select from '@/app/components/ui/Select';
import { useVariantesStock } from '@/app/hooks/useVariantesStock';
import type { ProductoPadreConVariantes, ProductoWebResponse } from '@/app/types/producto.types';
import { formatNombreConGenero } from './columns';
import { Search, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { calcularPreciosDerivados } from '@/app/utils/calcularPreciosDerivados';

interface VariantesStockTableProps {
  producto: ProductoPadreConVariantes;
  variantes: ProductoWebResponse[];
  onSuccess?: () => void;
  onHasChangesChange?: (hasChanges: boolean) => void;
}

interface EditableVariante extends ProductoWebResponse {
  editedStock?: number | null;
  editedPrecio?: number | null;
  precioPersonalizado?: boolean; // Si tiene precio personalizado (no hereda del padre)
}

export function VariantesStockTable({
  producto,
  variantes: initialVariantes,
  onSuccess,
  onHasChangesChange,
}: VariantesStockTableProps) {
  // Calcular precio general inicial (promedio o primer precio no nulo)
  const precioGeneralInicial = useMemo(() => {
    const precios = initialVariantes
      .map(v => v.precioCache)
      .filter(p => p !== null && p !== undefined) as number[];
    if (precios.length === 0) return null;
    return precios[0]; // Usar el primer precio como base
  }, [initialVariantes]);

  const [precioGeneral, setPrecioGeneral] = useState<number | null>(precioGeneralInicial);
  const [precioGeneralChanged, setPrecioGeneralChanged] = useState(false);

  const [variantes, setVariantes] = useState<EditableVariante[]>(
    initialVariantes.map(v => ({
      ...v,
      editedStock: v.stockCache ?? 0,
      editedPrecio: v.precioCache ?? precioGeneralInicial,
      precioPersonalizado: v.precioCache !== null && v.precioCache !== precioGeneralInicial,
    }))
  );

  const [filters, setFilters] = useState({
    color: '',
    talle: '',
    search: '',
  });

  const { updateBulk, isUpdating } = useVariantesStock();

  // Obtener valores únicos para filtros
  const coloresUnicos = useMemo(() => 
    Array.from(new Set(variantes.map(v => v.color).filter(Boolean))).sort() as string[],
    [variantes]
  );
  const tallesUnicos = useMemo(() => 
    Array.from(new Set(variantes.map(v => v.talle).filter(Boolean))).sort() as string[],
    [variantes]
  );

  // Filtrar variantes
  const filteredVariantes = useMemo(() => {
    return variantes.filter(v => {
      if (filters.color && v.color !== filters.color) return false;
      if (filters.talle && v.talle !== filters.talle) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          v.sfactoryCodigo?.toLowerCase().includes(searchLower) ||
          v.color?.toLowerCase().includes(searchLower) ||
          v.talle?.toLowerCase().includes(searchLower) ||
          producto.nombre?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }
      return true;
    });
  }, [variantes, filters, producto.nombre]);

  // Detectar cambios
  const hasChanges = useMemo(() => {
    const variantesChanged = variantes.some(v => 
      v.editedStock !== v.stockCache || 
      (v.precioPersonalizado && v.editedPrecio !== v.precioCache) ||
      (!v.precioPersonalizado && v.editedPrecio !== precioGeneral)
    );
    return variantesChanged || precioGeneralChanged;
  }, [variantes, precioGeneral, precioGeneralChanged]);

  // Notificar cambios al modal
  useEffect(() => {
    onHasChangesChange?.(hasChanges);
  }, [hasChanges, onHasChangesChange]);

  const handleStockChange = (varianteId: number, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    setVariantes(prev => prev.map(v => 
      v.id === varianteId 
        ? { ...v, editedStock: (value === '' || isNaN(numValue)) ? 0 : numValue }
        : v
    ));
  };

  const handlePrecioGeneralChange = (value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    const newPrecio = isNaN(numValue as number) ? null : numValue;
    setPrecioGeneral(newPrecio);
    setPrecioGeneralChanged(newPrecio !== precioGeneralInicial);
    
    // Aplicar a todas las variantes que no tienen precio personalizado
    setVariantes(prev => prev.map(v => {
      if (!v.precioPersonalizado) {
        return { ...v, editedPrecio: newPrecio };
      }
      return v;
    }));
  };

  const handlePrecioChange = (varianteId: number, value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    const newPrecio = isNaN(numValue as number) ? null : numValue;
    
    setVariantes(prev => prev.map(v => {
      if (v.id === varianteId) {
        const precioPersonalizado = newPrecio !== precioGeneral;
        return { 
          ...v, 
          editedPrecio: newPrecio,
          precioPersonalizado,
        };
      }
      return v;
    }));
  };

  const handleSaveAll = async () => {
    // Preparar actualizaciones: incluir todas las variantes con stock o precio modificado
    const updates = variantes
      .filter(v => {
        const stockChanged = v.editedStock !== v.stockCache;
        const precioChanged = v.precioPersonalizado 
          ? v.editedPrecio !== v.precioCache
          : precioGeneralChanged; // Si cambió el precio general, todas las no personalizadas deben actualizarse
        return stockChanged || precioChanged;
      })
      .map(v => ({
        id: v.id,
        stockCache: v.editedStock ?? 0,
        precioCache: v.precioPersonalizado ? v.editedPrecio : precioGeneral,
      }));

    if (updates.length === 0) return;

    try {
      await updateBulk(updates);
      // Actualizar estado local con valores guardados
      // Actualizar todas las variantes sin precio personalizado con el nuevo precio general
      const newPrecioGeneral = precioGeneral;
      setVariantes(prev => prev.map(v => {
        const update = updates.find(u => u.id === v.id);
        if (update) {
          const newPrecio = update.precioCache ?? null;
          return {
            ...v,
            stockCache: update.stockCache ?? 0,
            precioCache: newPrecio,
            editedStock: update.stockCache ?? 0,
            editedPrecio: newPrecio,
            precioPersonalizado: v.precioPersonalizado && newPrecio !== precioGeneral,
          };
        }
        // Si no hay update pero cambió el precio general y no es personalizado, actualizar igual
        if (!v.precioPersonalizado && precioGeneralChanged) {
          return {
            ...v,
            editedPrecio: newPrecioGeneral,
          };
        }
        return v;
      }));
      setPrecioGeneralChanged(false);
      toast.success(`Cambios guardados exitosamente. ${updates.length} variante(s) actualizada(s).`);
    } catch (error) {
      console.error('Error guardando cambios:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al guardar los cambios';
      toast.error(`Error al guardar cambios: ${errorMessage}`);
    }
  };

  const colorOptions = useMemo(
    () => [{ value: '', label: 'Todos los colores' }, ...coloresUnicos.map((c) => ({ value: c, label: c }))],
    [coloresUnicos]
  );
  const talleOptions = useMemo(
    () => [{ value: '', label: 'Todos los talles' }, ...tallesUnicos.map((t) => ({ value: t, label: t }))],
    [tallesUnicos]
  );

  const preciosDerivados = useMemo(
    () => calcularPreciosDerivados(precioGeneral),
    [precioGeneral]
  );

  const formatPrecio = (n: number) =>
    n.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-4 overflow-visible p-2">
      {/* Precio General */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Precio general (se aplica a todas las variantes sin precio personalizado)
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min="0"
            step="0.01"
            value={precioGeneral ?? ''}
            onChange={(e) => handlePrecioGeneralChange(e.target.value)}
            className={`
              w-32 px-3 py-2 border rounded text-right text-sm font-medium
              focus:outline-none focus:ring-2 focus:ring-black
              ${precioGeneralChanged ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}
            `}
            placeholder="0.00"
          />
          <span className="text-sm text-gray-600">
            {precioGeneralChanged && (
              <span className="text-blue-600 font-medium">• Modificado</span>
            )}
          </span>
        </div>
        {precioGeneral != null && precioGeneral > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div>
              <span className="text-gray-500 block">Transferencia (15% desc.)</span>
              <span className="font-medium text-gray-800">
                ${preciosDerivados.precioTransfer != null ? formatPrecio(preciosDerivados.precioTransfer) : '–'}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block">Financiado ({preciosDerivados.cuotas} cuotas)</span>
              <span className="font-medium text-gray-800">
                ${preciosDerivados.precioFinanciado != null ? formatPrecio(preciosDerivados.precioFinanciado) : '–'}
                <span className="text-gray-500 font-normal">/cuota</span>
              </span>
            </div>
            <div>
              <span className="text-gray-500 block">Precio sin imp.</span>
              <span className="font-medium text-gray-800">
                ${preciosDerivados.precioSinImp != null ? formatPrecio(preciosDerivados.precioSinImp) : '–'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Filtros rápidos: padding para que los focus rings no se corten */}
      <div className="flex flex-wrap gap-3 overflow-visible py-1 px-1 -mx-1">
        <div className="relative flex-shrink-0 min-w-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-64 min-w-0 pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1"
          />
        </div>
        <div className="flex-shrink-0 overflow-visible">
          <Select
            options={colorOptions}
            value={filters.color}
            onChange={(e) => setFilters(prev => ({ ...prev, color: e.target.value }))}
            variant="ghost"
            size="sm"
            className="min-w-[140px]"
          />
        </div>
        <div className="flex-shrink-0 overflow-visible">
          <Select
            options={talleOptions}
            value={filters.talle}
            onChange={(e) => setFilters(prev => ({ ...prev, talle: e.target.value }))}
            variant="ghost"
            size="sm"
            className="min-w-[140px]"
          />
        </div>
        <div className="flex items-center justify-end flex-shrink-0 ml-auto">
          <Button
            onClick={handleSaveAll}
            disabled={!hasChanges || isUpdating}
            variant="black"
            size="md"
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar cambios
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Tabla compacta: padding para que focus/active no se corten */}
      <div className="overflow-x-auto overflow-y-visible border border-gray-200 rounded-lg p-px">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">SKU</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Nombre</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Color</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Talle</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">Stock</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">Precio</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredVariantes.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No hay variantes que coincidan con los filtros
                </td>
              </tr>
            ) : (
              filteredVariantes.map((variante, index) => {
                const stockChanged = variante.editedStock !== variante.stockCache;
                const precioChanged = variante.precioPersonalizado
                  ? variante.editedPrecio !== variante.precioCache
                  : (variante.editedPrecio !== precioGeneral);
                const stockValue = variante.editedStock ?? 0;
                const isStockBajo = stockValue > 0 && stockValue < 10;
                const isStockAgotado = stockValue === 0;

                return (
                  <motion.tr
                    key={variante.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className={`
                      hover:bg-gray-50 transition-colors
                      ${stockChanged || precioChanged ? 'bg-blue-50' : ''}
                    `}
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs">{variante.sfactoryCodigo}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-sm">{formatNombreConGenero(producto.nombre, producto.genero)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium">{variante.color || '-'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span>{variante.talle || '-'}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={variante.editedStock ?? 0}
                        onChange={(e) => handleStockChange(variante.id, e.target.value)}
                        className={`
                          w-24 px-2 py-1 border rounded text-right text-sm
                          focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1
                          ${stockChanged ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                          ${isStockBajo ? 'border-orange-300 bg-orange-50' : ''}
                          ${isStockAgotado ? 'border-red-300 bg-red-50' : ''}
                        `}
                      />
                      {(stockChanged || isStockBajo || isStockAgotado) && (
                        <div className="text-xs mt-1">
                          {stockChanged && (
                            <span className="text-blue-600">• Modificado</span>
                          )}
                          {isStockBajo && !stockChanged && (
                            <span className="text-orange-600">• Stock bajo</span>
                          )}
                          {isStockAgotado && !stockChanged && (
                            <span className="text-red-600">• Agotado</span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={variante.editedPrecio ?? ''}
                        onChange={(e) => handlePrecioChange(variante.id, e.target.value)}
                        className={`
                          w-32 px-2 py-1 border rounded text-right text-sm
                          focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1
                          ${precioChanged ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                          ${!variante.precioPersonalizado ? 'bg-gray-50' : ''}
                        `}
                        placeholder={precioGeneral != null && typeof precioGeneral === 'number' ? precioGeneral.toFixed(2) : "0.00"}
                      />
                      {precioChanged && (
                        <div className="text-xs mt-1 text-blue-600">• Modificado</div>
                      )}
                      {!variante.precioPersonalizado && (
                        <div className="text-xs mt-1 text-gray-500">• Hereda del padre</div>
                      )}
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Resumen */}
      <div className="flex justify-between items-center text-sm text-gray-600 pt-2 border-t">
        <span>
          Mostrando {filteredVariantes.length} de {variantes.length} variantes
        </span>
      </div>
    </div>
  );
}

