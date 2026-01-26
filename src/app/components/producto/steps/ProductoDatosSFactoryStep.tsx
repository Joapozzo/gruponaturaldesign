import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { TextField } from '../fields/TextField';
import { TextAreaField } from '../fields/TextAreaField';
import { SelectField } from '../fields/SelectField';
import type { SFactoryItemCreateData } from '@/app/services/producto.service';

interface ProductoDatosSFactoryStepProps {
  datosSFactory: Partial<SFactoryItemCreateData>;
  errors: Record<string, string>;
  onFieldChange: (field: keyof SFactoryItemCreateData, value: string | number | boolean | null) => void;
  bloqueado?: boolean;
  rubros?: Array<{ id: number; nombre: string; sfactoryId: number | null }>;
  subrubros?: Array<{ id: number; nombre: string; sfactoryId: number | null }>;
}

export const ProductoDatosSFactoryStep: React.FC<ProductoDatosSFactoryStepProps> = ({
  datosSFactory,
  errors,
  onFieldChange,
  bloqueado = false,
  rubros = [],
  subrubros = [],
}) => {
  // Inicializar tipo con valor por defecto 'P' si no existe
  useEffect(() => {
    if (!datosSFactory.tipo && !bloqueado) {
      onFieldChange('tipo', 'P');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo al montar el componente
  const rubroOptions = rubros.map((r) => ({
    value: r.sfactoryId?.toString() || '',
    label: r.nombre,
  })).filter((o) => o.value);

  const subrubroOptions = subrubros.map((s) => ({
    value: s.sfactoryId?.toString() || '',
    label: s.nombre,
  })).filter((o) => o.value);

  return (
    <motion.div
      key="datos-sfactory"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="space-y-4 px-2 pb-2"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Datos SFactory</h3>
        <p className="text-sm text-gray-600">
          {bloqueado
            ? 'Los datos de SFactory no se pueden editar después de la creación'
            : 'Completa los datos que se enviarán a SFactory. Los campos marcados con * son obligatorios.'}
        </p>
        {bloqueado && (
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ Este producto ya fue creado en SFactory. Para modificarlo, edítalo directamente desde SFactory.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
          id="tipo"
          name="tipo"
          label="Tipo"
          value={datosSFactory.tipo || 'P'}
          onChange={(e) => onFieldChange('tipo', e.target.value)}
          options={[
            { value: 'P', label: 'Producto (P)' },
            { value: 'S', label: 'Servicio (S)' },
          ]}
          disabled={bloqueado}
          required
          error={errors.tipo}
        />

        <SelectField
          id="stockeable"
          name="stockeable"
          label="Stockeable"
          value={datosSFactory.stockeable?.toString() || '1'}
          onChange={(e) => onFieldChange('stockeable', parseInt(e.target.value))}
          options={[
            { value: '1', label: 'Sí' },
            { value: '0', label: 'No' },
          ]}
          disabled={bloqueado}
        />
      </div>

      <TextField
        id="descrip_corta"
        name="descrip_corta"
        label="Descripción Corta"
        value={datosSFactory.descrip_corta || ''}
        onChange={(e) => onFieldChange('descrip_corta', e.target.value)}
        placeholder="Descripción breve"
        disabled={bloqueado}
      />

      <TextAreaField
        id="detalle"
        name="detalle"
        label="Detalle"
        value={datosSFactory.detalle || ''}
        onChange={(e) => onFieldChange('detalle', e.target.value)}
        placeholder="Detalles adicionales"
        rows={3}
        disabled={bloqueado}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField
          id="precio_costo"
          name="precio_costo"
          label="Precio Costo"
          type="number"
          step="0.01"
          value={datosSFactory.precio_costo?.toString() || ''}
          onChange={(e) => onFieldChange('precio_costo', e.target.value ? parseFloat(e.target.value) : null)}
          placeholder="0.00"
          disabled={bloqueado}
        />

        <TextField
          id="precio_venta"
          name="precio_venta"
          label="Precio Venta"
          type="number"
          step="0.01"
          value={datosSFactory.precio_venta?.toString() || ''}
          onChange={(e) => onFieldChange('precio_venta', e.target.value ? parseFloat(e.target.value) : null)}
          placeholder="0.00"
          disabled={bloqueado}
          required
          error={errors.precio_venta}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TextField
          id="utilidad_planificada"
          name="utilidad_planificada"
          label="Utilidad Planificada (%)"
          type="number"
          step="0.01"
          value={datosSFactory.utilidad_planificada?.toString() || ''}
          onChange={(e) => onFieldChange('utilidad_planificada', e.target.value ? parseFloat(e.target.value) : null)}
          placeholder="0.00"
          disabled={bloqueado}
        />

        <TextField
          id="iva"
          name="iva"
          label="IVA (%)"
          type="number"
          step="0.01"
          value={datosSFactory.iva?.toString() || ''}
          onChange={(e) => onFieldChange('iva', e.target.value ? parseFloat(e.target.value) : null)}
          placeholder="21.00"
          disabled={bloqueado}
        />

        <TextField
          id="moneda_id"
          name="moneda_id"
          label="Moneda ID"
          type="number"
          value={datosSFactory.moneda_id?.toString() || ''}
          onChange={(e) => onFieldChange('moneda_id', e.target.value ? parseInt(e.target.value) : null)}
          placeholder="1"
          disabled={bloqueado}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField
          id="stock_minimo"
          name="stock_minimo"
          label="Stock Mínimo"
          type="number"
          value={datosSFactory.stock_minimo?.toString() || ''}
          onChange={(e) => onFieldChange('stock_minimo', e.target.value ? parseInt(e.target.value) : null)}
          placeholder="0"
          disabled={bloqueado}
        />

        <TextField
          id="stock_maximo"
          name="stock_maximo"
          label="Stock Máximo"
          type="number"
          value={datosSFactory.stock_maximo?.toString() || ''}
          onChange={(e) => onFieldChange('stock_maximo', e.target.value ? parseInt(e.target.value) : null)}
          placeholder="0"
          disabled={bloqueado}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
          id="rubro_id"
          name="rubro_id"
          label="Rubro ID (SFactory)"
          value={datosSFactory.rubro_id?.toString() || ''}
          onChange={(e) => onFieldChange('rubro_id', e.target.value ? parseInt(e.target.value) : null)}
          options={rubroOptions}
          placeholder="Seleccionar rubro"
          disabled={bloqueado}
          required
          error={errors.rubro_id}
        />

        <SelectField
          id="subrubro_id"
          name="subrubro_id"
          label="Subrubro ID (SFactory)"
          value={datosSFactory.subrubro_id?.toString() || ''}
          onChange={(e) => onFieldChange('subrubro_id', e.target.value ? parseInt(e.target.value) : null)}
          options={subrubroOptions}
          placeholder="Seleccionar subrubro"
          disabled={bloqueado}
          required
          error={errors.subrubro_id}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
          id="item_venta"
          name="item_venta"
          label="Item de Venta"
          value={datosSFactory.item_venta?.toString() || '1'}
          onChange={(e) => onFieldChange('item_venta', parseInt(e.target.value))}
          options={[
            { value: '1', label: 'Sí' },
            { value: '0', label: 'No' },
          ]}
          disabled={bloqueado}
        />

        <SelectField
          id="item_compra"
          name="item_compra"
          label="Item de Compra"
          value={datosSFactory.item_compra?.toString() || ''}
          onChange={(e) => onFieldChange('item_compra', e.target.value ? parseInt(e.target.value) : null)}
          options={[
            { value: '1', label: 'Sí' },
            { value: '0', label: 'No' },
          ]}
          disabled={bloqueado}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
          id="usa_lote"
          name="usa_lote"
          label="Usa Lote"
          value={datosSFactory.usa_lote ? 'true' : 'false'}
          onChange={(e) => onFieldChange('usa_lote', e.target.value === 'true')}
          options={[
            { value: 'true', label: 'Sí' },
            { value: 'false', label: 'No' },
          ]}
          disabled={bloqueado}
        />

        <TextField
          id="usa_serie"
          name="usa_serie"
          label="Usa Serie"
          type="number"
          value={datosSFactory.usa_serie?.toString() || '0'}
          onChange={(e) => onFieldChange('usa_serie', parseInt(e.target.value))}
          placeholder="0"
          disabled={bloqueado}
        />
      </div>

      <TextField
        id="barcode"
        name="barcode"
        label="Código de Barras"
        value={datosSFactory.barcode || ''}
        onChange={(e) => onFieldChange('barcode', e.target.value || null)}
        placeholder="Código de barras"
        disabled={bloqueado}
      />
    </motion.div>
  );
};

