import { useState, useEffect } from 'react';
import type { ProductoPadreConVariantes } from '@/app/types/producto.types';

export interface ProductoImages {
  principal: string;
  complementarias: string[];
}

const MAX_COMPLEMENTARIAS = 6;

const initialImages: ProductoImages = {
  principal: '',
  complementarias: [],
};

const parseProductoImages = (imagenes: any): ProductoImages => {
  if (!imagenes) return initialImages;

  try {
    const imgData = typeof imagenes === 'string' ? JSON.parse(imagenes) : imagenes;

    if (Array.isArray(imgData) && imgData.length > 0) {
      return {
        principal: imgData[0] || '',
        complementarias: imgData.slice(1) || [],
      };
    }

    if (typeof imgData === 'object' && imgData.principal) {
      return {
        principal: imgData.principal || '',
        complementarias: imgData.complementarias || [],
      };
    }
  } catch (e) {
    // Si no se puede parsear, retornar vacío
  }

  return initialImages;
};

export const useProductoImages = (
  producto: ProductoPadreConVariantes | null | undefined,
  isOpen: boolean
) => {
  const [imagenes, setImagenes] = useState<ProductoImages>(initialImages);

  useEffect(() => {
    if (producto?.imagenes) {
      setImagenes(parseProductoImages(producto.imagenes));
    } else {
      setImagenes(initialImages);
    }
  }, [producto, isOpen]);

  const uploadPrincipal = (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagenes((prev) => ({ ...prev, principal: result }));
        resolve();
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const uploadComplementaria = (file: File): Promise<void> => {
    if (imagenes.complementarias.length >= MAX_COMPLEMENTARIAS) {
      return Promise.reject(new Error('Máximo de imágenes complementarias alcanzado'));
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagenes((prev) => ({
          ...prev,
          complementarias: [...prev.complementarias, result],
        }));
        resolve();
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const removePrincipal = () => {
    setImagenes((prev) => ({ ...prev, principal: '' }));
  };

  const removeComplementaria = (index: number) => {
    setImagenes((prev) => ({
      ...prev,
      complementarias: prev.complementarias.filter((_, i) => i !== index),
    }));
  };

  const canAddComplementaria = imagenes.complementarias.length < MAX_COMPLEMENTARIAS;

  return {
    imagenes,
    setImagenes,
    uploadPrincipal,
    uploadComplementaria,
    removePrincipal,
    removeComplementaria,
    canAddComplementaria,
    maxComplementarias: MAX_COMPLEMENTARIAS,
  };
};

