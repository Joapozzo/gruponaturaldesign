import React from 'react';
import { motion } from 'framer-motion';
import { ImagenPrincipalUploader } from '../images/ImagenPrincipalUploader';
import { ImagenComplementariaGrid } from '../images/ImagenComplementariaGrid';
import type { ProductoImages } from '@/app/hooks/useProductoImages';

interface ProductoImagenesStepProps {
  imagenes: ProductoImages;
  onPrincipalUpload: (file: File) => Promise<void>;
  onPrincipalRemove: () => void;
  onComplementariaUpload: (file: File) => Promise<void>;
  onComplementariaRemove: (index: number) => void;
  maxComplementarias: number;
}

export const ProductoImagenesStep: React.FC<ProductoImagenesStepProps> = ({
  imagenes,
  onPrincipalUpload,
  onPrincipalRemove,
  onComplementariaUpload,
  onComplementariaRemove,
  maxComplementarias,
}) => {
  return (
    <motion.div
      key="imagenes"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Imagen Principal
        </label>
        <ImagenPrincipalUploader
          imagenUrl={imagenes.principal}
          onUpload={onPrincipalUpload}
          onRemove={onPrincipalRemove}
        />
      </div>

      <ImagenComplementariaGrid
        imagenes={imagenes.complementarias}
        onUpload={onComplementariaUpload}
        onRemove={onComplementariaRemove}
        maxImagenes={maxComplementarias}
      />
    </motion.div>
  );
};

