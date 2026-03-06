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
  onDestacadoChange: (value: boolean) => void;
}

export const ProductoDatosLocalesStep = memo<ProductoDatosLocalesStepProps>(function ProductoDatosLocalesStep({
  datosLocales,
  errors,
  onDescripcionMarketingChange,
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
          Descripción marketing y visibilidad. La descripción corta y el detalle se editan en el paso <strong>Datos SFactory</strong>. Las imágenes se gestionan en el administrador de imágenes del producto.
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
