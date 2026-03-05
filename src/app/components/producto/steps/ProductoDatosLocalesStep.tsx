import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { TextAreaField } from '../fields/TextAreaField';
import { CheckboxField } from '../fields/CheckboxField';

interface ProductoDatosLocalesStepProps {
  datosLocales: {
    descripcionMarketing: string;
    descripcionCorta: string;
    destacado: boolean;
    descripcion?: string;
  };
  modo: 'crear-producto' | 'crear-variante' | 'editar';
  errors: {
    descripcionMarketing?: string;
    descripcionCorta?: string;
  };
  onDescripcionMarketingChange: (value: string) => void;
  onDescripcionCortaChange: (value: string) => void;
  onDescripcionChange?: (value: string) => void;
  onDestacadoChange: (value: boolean) => void;
}

export const ProductoDatosLocalesStep = memo<ProductoDatosLocalesStepProps>(function ProductoDatosLocalesStep({
  datosLocales,
  modo,
  errors,
  onDescripcionMarketingChange,
  onDescripcionCortaChange,
  onDescripcionChange,
  onDestacadoChange,
}) {
  return (
    <motion.div
      key="datos-locales"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 px-2 pb-2"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Datos locales</h3>
        <p className="text-sm text-gray-600">
          Descripción y opciones de visibilidad del producto. Las imágenes se gestionan en el administrador de imágenes del producto.
        </p>
      </div>

      <div className="space-y-4">
        <TextAreaField
          id="descripcionMarketing"
          name="descripcionMarketing"
          label="Descripción Marketing"
          value={datosLocales.descripcionMarketing}
          onChange={(e) => onDescripcionMarketingChange(e.target.value)}
          placeholder="Descripción para marketing y SEO"
          rows={3}
          error={errors.descripcionMarketing}
        />

        <TextAreaField
          id="descripcionCorta"
          name="descripcionCorta"
          label="Descripción Corta"
          value={datosLocales.descripcionCorta}
          onChange={(e) => onDescripcionCortaChange(e.target.value)}
          placeholder="Descripción breve del producto"
          rows={2}
          error={errors.descripcionCorta}
        />

        {onDescripcionChange && (
          <TextAreaField
            id="descripcion"
            name="descripcion"
            label="Descripción Completa"
            value={datosLocales.descripcion || ''}
            onChange={(e) => onDescripcionChange(e.target.value)}
            placeholder="Descripción detallada del producto"
            rows={4}
          />
        )}

        <CheckboxField
          name="destacado"
          label="Destacado"
          checked={datosLocales.destacado}
          onChange={(e) => onDestacadoChange(e.target.checked)}
        />
      </div>
    </motion.div>
  );
});
