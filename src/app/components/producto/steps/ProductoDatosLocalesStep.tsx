import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { TextAreaField } from '../fields/TextAreaField';
import { CheckboxField } from '../fields/CheckboxField';
import { SelectField } from '../fields/SelectField';
import { Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProductoDatosLocalesStepProps {
  datosLocales: {
    descripcionMarketing: string;
    descripcionCorta: string;
    destacado: boolean;
    descripcion?: string;
  };
  variante?: {
    talle: string | null;
    color: string | null;
  };
  productoPadreId?: number;
  productoNombre?: string;
  coloresDisponibles?: string[];
  modo: 'crear-producto' | 'crear-variante' | 'editar';
  errors: {
    descripcionMarketing?: string;
    descripcionCorta?: string;
    talle?: string;
    color?: string;
  };
  onDescripcionMarketingChange: (value: string) => void;
  onDescripcionCortaChange: (value: string) => void;
  onDescripcionChange?: (value: string) => void;
  onDestacadoChange: (value: boolean) => void;
  onTalleChange?: (value: string | null) => void;
  onColorChange?: (value: string | null) => void;
  imagenesSeleccionadas?: File[];
  onImagenesChange?: (files: File[]) => void;
}

const TALLE_OPTIONS = [
  { value: '2XS', label: '2XS' },
  { value: 'XS', label: 'XS' },
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
  { value: 'XL', label: 'XL' },
  { value: '2XL', label: '2XL' },
  { value: '3XL', label: '3XL' },
  { value: '4XL', label: '4XL' },
  { value: '34', label: '34' },
  { value: '36', label: '36' },
  { value: '38', label: '38' },
  { value: '40', label: '40' },
  { value: '42', label: '42' },
  { value: '44', label: '44' },
  { value: '46', label: '46' },
  { value: '48', label: '48' },
  { value: '50', label: '50' },
  { value: '52', label: '52' },
];

export const ProductoDatosLocalesStep: React.FC<ProductoDatosLocalesStepProps> = ({
  datosLocales,
  variante,
  productoPadreId,
  productoNombre,
  coloresDisponibles = [],
  modo,
  errors,
  onDescripcionMarketingChange,
  onDescripcionCortaChange,
  onDescripcionChange,
  onDestacadoChange,
  onTalleChange,
  onColorChange,
  imagenesSeleccionadas = [],
  onImagenesChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Mostrar campos de variante si:
  // - Es modo crear-variante
  // - Es modo crear-producto (para crear la primera variante)
  // - Es modo editar y ya hay variante
  const mostrarVariante = modo === 'crear-variante' || 
                         modo === 'crear-producto' || 
                         (modo === 'editar' && variante);
  
  const tieneColor = !!variante?.color;
  const puedeSeleccionarImagenes = mostrarVariante && tieneColor;

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0 || !onImagenesChange) return;

    const validFiles: File[] = [];
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} no es una imagen válida`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} es demasiado grande (máx. 5MB)`);
        return;
      }
      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      onImagenesChange([...imagenesSeleccionadas, ...validFiles].slice(0, 3)); // Máximo 3 imágenes
    }
  };

  const handleRemoveImage = (index: number) => {
    if (onImagenesChange) {
      onImagenesChange(imagenesSeleccionadas.filter((_, i) => i !== index));
    }
  };

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
        <h3 className="text-lg font-semibold mb-2">Datos locales e imágenes</h3>
        <p className="text-sm text-gray-600">
          Completa los datos específicos de nuestra base de datos y gestiona las imágenes del producto.
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

      {mostrarVariante && (
        <div className="border-t pt-6 space-y-4">
          <h4 className="text-md font-semibold mb-4">
            {modo === 'crear-producto' 
              ? 'Crear Primera Variante (Opcional)' 
              : 'Datos de la Variante'}
          </h4>
          
          {modo === 'crear-producto' && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
              <p className="text-sm text-blue-800">
                💡 <strong>Tip:</strong> Crea la primera variante con talle y color para poder subir imágenes inmediatamente. Si no lo haces ahora, podrás crear variantes después.
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {onTalleChange && (
              <SelectField
                id="talle"
                name="talle"
                label="Talle"
                value={variante?.talle || ''}
                onChange={(e) => onTalleChange(e.target.value || null)}
                options={TALLE_OPTIONS}
                placeholder="Seleccionar talle"
                error={errors.talle}
                required={modo === 'crear-variante'}
              />
            )}

            {onColorChange && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color {modo === 'crear-variante' && <span className="text-red-500">*</span>}
                  {modo === 'crear-producto' && coloresDisponibles.length > 0 && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  value={variante?.color || ''}
                  onChange={(e) => onColorChange(e.target.value || null)}
                  placeholder="Ej: Celeste, Negro, Blanco"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                    errors.color ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.color && (
                  <p className="mt-1 text-sm text-red-500">{errors.color}</p>
                )}
                {modo === 'crear-producto' && coloresDisponibles.length > 0 && !variante?.color && (
                  <p className="mt-1 text-sm text-yellow-600">
                    ⚠️ Debe ingresar un color para poder seleccionar imágenes
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Selector de imágenes - Solo si hay color */}
          {puedeSeleccionarImagenes && onImagenesChange && (
            <div className="border-t pt-6 space-y-4">
              <h4 className="text-md font-semibold mb-2">
                Imágenes (Opcional) - Máximo 3
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Las imágenes se subirán automáticamente al finalizar. Puedes seleccionar hasta 3 imágenes.
              </p>

              {/* Área de selección */}
              <div
                onClick={() => imagenesSeleccionadas.length < 3 && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  imagenesSeleccionadas.length >= 3
                    ? 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-60'
                    : 'border-gray-300 hover:border-blue-400 cursor-pointer'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                  disabled={imagenesSeleccionadas.length >= 3}
                />
                <Upload className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                <p className="text-gray-600 mb-1">
                  {imagenesSeleccionadas.length >= 3 
                    ? 'Límite de 3 imágenes alcanzado'
                    : 'Haz clic para seleccionar imágenes'}
                </p>
                <p className="text-sm text-gray-500">
                  {imagenesSeleccionadas.length}/3 imágenes seleccionadas
                </p>
              </div>

              {/* Previews de imágenes seleccionadas */}
              {imagenesSeleccionadas.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {imagenesSeleccionadas.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(index);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Mensaje si no hay color */}
          {mostrarVariante && !tieneColor && onImagenesChange && (
            <div className="border-t pt-6">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  💡 Ingresa un color para poder seleccionar imágenes (opcional)
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

