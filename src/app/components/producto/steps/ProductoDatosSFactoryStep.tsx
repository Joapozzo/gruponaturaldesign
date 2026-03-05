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
  rubros = [],
  subrubros = [],
}) => {
  // Fijar tipo 'P' (producto) al montar
  useEffect(() => {
    if (!datosSFactory.tipo) {
      onFieldChange('tipo', 'P');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          Completa o modifica los datos que se envían a SFactory (descripción, rubro, etc.). Los precios se gestionan en Gestionar variantes.
        </p>
      </div>

      <TextField
        id="descripcion"
        name="descripcion"
        label="Descripción (SFactory)"
        value={datosSFactory.descripcion ?? ''}
        onChange={(e) => onFieldChange('descripcion', e.target.value)}
        placeholder="Si está vacío se usa el nombre del producto"
        error={errors.descripcion}
      />

      <TextField
        id="descrip_corta"
        name="descrip_corta"
        label="Descripción Corta"
        value={datosSFactory.descrip_corta || ''}
        onChange={(e) => onFieldChange('descrip_corta', e.target.value)}
        placeholder="Descripción breve"
      />

      <TextAreaField
        id="detalle"
        name="detalle"
        label="Detalle"
        value={datosSFactory.detalle || ''}
        onChange={(e) => onFieldChange('detalle', e.target.value)}
        placeholder="Detalles adicionales"
        rows={3}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
          id="rubro_id"
          name="rubro_id"
          label="Rubro (SFactory) *"
          value={datosSFactory.rubro_id != null ? datosSFactory.rubro_id.toString() : ''}
          onChange={(e) => onFieldChange('rubro_id', e.target.value ? parseInt(e.target.value) : null)}
          options={rubroOptions}
          placeholder="Seleccionar rubro"
          required
          error={errors.rubro_id}
        />

        <SelectField
          id="subrubro_id"
          name="subrubro_id"
          label="Subrubro (SFactory) *"
          value={datosSFactory.subrubro_id != null ? datosSFactory.subrubro_id.toString() : ''}
          onChange={(e) => onFieldChange('subrubro_id', e.target.value ? parseInt(e.target.value) : null)}
          options={subrubroOptions}
          placeholder="Seleccionar subrubro"
          required
          error={errors.subrubro_id}
        />
      </div>

      {/* Solo lectura: valores que vienen de SFactory y no se editan aquí */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Solo lectura (desde SFactory)</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            id="stock_minimo"
            name="stock_minimo"
            label="Stock Mínimo"
            type="number"
            value={datosSFactory.stock_minimo != null ? datosSFactory.stock_minimo.toString() : ''}
            onChange={() => {}}
            placeholder="—"
            disabled
          />
          <TextField
            id="stock_maximo"
            name="stock_maximo"
            label="Stock Máximo"
            type="number"
            value={datosSFactory.stock_maximo != null ? datosSFactory.stock_maximo.toString() : ''}
            onChange={() => {}}
            placeholder="—"
            disabled
          />
        </div>
      </div>
    </motion.div>
  );
};
