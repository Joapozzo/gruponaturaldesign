// src/app/components/AutoProductLoader.tsx
'use client';
import { useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';

const AutoProductLoader = () => {
  const { uploadProducts, totalProducts } = useProducts();

  useEffect(() => {
    const loadProducts = async () => {
      // Si ya hay productos cargados, no hacer nada
      if (totalProducts > 0) return;

      try {
        // Cargar el archivo desde la carpeta public
        const response = await fetch('/data/productos.xls');
        const blob = await response.blob();
        const file = new File([blob], 'productos.xls', {
          type: 'application/vnd.ms-excel',
        });

        uploadProducts(file);
      } catch (error) {
        console.error('Error al cargar productos automáticamente:', error);
      }
    };

    loadProducts();
  }, [uploadProducts, totalProducts]);

  return null; // No renderiza nada
};

export default AutoProductLoader;