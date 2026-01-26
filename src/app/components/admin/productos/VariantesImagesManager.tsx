'use client';

import React, { useState, useCallback, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import Button from '@/app/components/ui/Button';
import { useProductoPadreImages, useUploadProductImages, useDeleteProductImage } from '@/app/hooks/useProductImages';
import { Upload, X, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import type { ProductImage } from '@/app/services/productImage.service';
import { ProductImage as ProductImageComponent } from '@/app/components/product-card/components/ProductImage';

interface VariantesImagesManagerProps {
  productoPadreId: number;
  productoNombre: string;
  coloresDisponibles: string[];
  onSuccess?: () => void;
}

export function VariantesImagesManager({
  productoPadreId,
  coloresDisponibles,
  onSuccess,
}: VariantesImagesManagerProps) {
  const [selectedColor, setSelectedColor] = useState<string>(
    coloresDisponibles[0] || ''
  );
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Query para obtener imágenes agrupadas por color
  const { data: imagesByColor, isLoading, refetch } = useProductoPadreImages(productoPadreId);
  
  // Mutation para subir imágenes
  const uploadMutation = useUploadProductImages();
  const deleteMutation = useDeleteProductImage();

  // Colores que tienen imágenes
  const coloresConImagenes = useMemo(() => {
    if (!imagesByColor) return [];
    return Object.keys(imagesByColor).filter(color => imagesByColor[color].length > 0);
  }, [imagesByColor]);

  // Todos los colores (disponibles + con imágenes)
  const todosLosColores = useMemo(() => {
    const set = new Set([...coloresDisponibles, ...coloresConImagenes]);
    return Array.from(set).sort();
  }, [coloresDisponibles, coloresConImagenes]);

  // Manejar selección de archivos
  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const validFiles: File[] = [];
    const previewPromises: Promise<string>[] = [];

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
      
      // Crear promesa para leer el archivo
      const previewPromise = new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            resolve(e.target.result as string);
          } else {
            reject(new Error('Error al leer el archivo'));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      
      previewPromises.push(previewPromise);
    });

    setSelectedFiles(validFiles);
    
    // Esperar a que todos los previews se carguen
    try {
      const previewResults = await Promise.all(previewPromises);
      setPreviews(previewResults);
    } catch {
      toast.error('Error al cargar las previsualizaciones');
    }
  }, []);

  // Manejar drag & drop
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Validar que haya color seleccionado si hay colores disponibles
      if (todosLosColores.length > 0 && !selectedColor.trim()) {
        toast.error('⚠️ Debe seleccionar un color antes de seleccionar imágenes');
        return;
      }
      
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect, todosLosColores, selectedColor]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Contar imágenes existentes para el color seleccionado
  const imagenesExistentes = useMemo(() => {
    if (!imagesByColor) return 0;
    const colorKey = todosLosColores.length > 0 ? selectedColor : 'sin-color';
    return imagesByColor[colorKey]?.length || 0;
  }, [imagesByColor, selectedColor, todosLosColores]);

  // Límite de imágenes por color
  const MAX_IMAGENES_POR_COLOR = 3;
  const puedeSubirMas = imagenesExistentes < MAX_IMAGENES_POR_COLOR;
  const imagenesDisponibles = MAX_IMAGENES_POR_COLOR - imagenesExistentes;

  // Subir imágenes
  const handleUpload = useCallback(async () => {
    // SIEMPRE validar color si hay colores disponibles
    if (todosLosColores.length > 0 && !selectedColor.trim()) {
      toast.error('⚠️ Debe seleccionar un color antes de seleccionar imágenes');
      return;
    }

    // Si no hay colores disponibles, no permitir subir
    if (todosLosColores.length === 0) {
      toast.error('⚠️ No hay colores disponibles. Debe crear una variante con color primero.');
      return;
    }

    if (selectedFiles.length === 0) {
      toast.error('Debe seleccionar al menos una imagen');
      return;
    }

    // Validar límite de imágenes
    if (!puedeSubirMas) {
      toast.error(`Ya has alcanzado el límite de ${MAX_IMAGENES_POR_COLOR} imágenes para este color`);
      return;
    }

    // Validar que no se exceda el límite con las nuevas imágenes
    const totalDespues = imagenesExistentes + selectedFiles.length;
    if (totalDespues > MAX_IMAGENES_POR_COLOR) {
      toast.error(
        `Solo puedes subir ${imagenesDisponibles} imagen(es) más. Ya tienes ${imagenesExistentes} de ${MAX_IMAGENES_POR_COLOR} permitidas.`
      );
      return;
    }

    try {
      // Usar productoPadreId + color (el backend encontrará la variante apropiada)
      // Si no hay colores, enviar color como cadena vacía
      await uploadMutation.mutateAsync({
        productoWebId: undefined, // No proporcionado, usamos productoPadreId
        productoPadreId: productoPadreId,
        color: todosLosColores.length > 0 ? selectedColor : '',
        files: selectedFiles,
      });

      toast.success(`${selectedFiles.length} imagen(es) subida(s) exitosamente`);
      setSelectedFiles([]);
      setPreviews([]);
      await refetch();
      // No llamar onSuccess para no cerrar el modal
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al subir imágenes');
    }
  }, [selectedColor, selectedFiles, productoPadreId, uploadMutation, refetch, todosLosColores, puedeSubirMas, imagenesExistentes, imagenesDisponibles]);

  // Eliminar imagen
  const handleDelete = useCallback(
    async (imageId: number) => {
      if (!confirm('¿Está seguro de que desea eliminar esta imagen?')) {
        return;
      }

      try {
        await deleteMutation.mutateAsync(imageId);
        toast.success('Imagen eliminada exitosamente');
        await refetch();
        onSuccess?.();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Error al eliminar imagen');
      }
    },
    [deleteMutation, refetch, onSuccess]
  );

  const isLoadingImages = isLoading || deleteMutation.isPending;
  const isUploading = uploadMutation.isPending;

  // Solo mostrar selector de color si hay colores disponibles o imágenes por color
  const mostrarSelectorColor = todosLosColores.length > 0;
  const tieneColorSeleccionado = selectedColor.trim().length > 0;

  return (
    <div className="space-y-6">
      {/* Selector de color - SIEMPRE mostrar si hay colores */}
      {mostrarSelectorColor && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <label className="block text-sm font-medium mb-3">
            Seleccionar color <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {todosLosColores.map((color) => {
              const isSelected = selectedColor === color;
              const hasImages = coloresConImagenes.includes(color);
              
              return (
                <motion.button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${isSelected
                      ? 'bg-black text-white shadow-md'
                      : hasImages
                      ? 'bg-white border-2 border-gray-300 text-gray-700 hover:border-black'
                      : 'bg-white border border-gray-300 text-gray-600 hover:border-gray-400'
                    }
                  `}
                >
                  {color}
                  {hasImages && (
                    <span className="ml-2 text-xs opacity-75">
                      ({imagesByColor?.[color]?.length || 0})
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
          {!tieneColorSeleccionado && (
            <p className="mt-3 text-sm text-red-600 font-medium">
              ⚠️ Debe seleccionar un color antes de seleccionar imágenes
            </p>
          )}
        </div>
      )}

      {/* Mensaje cuando no hay colores disponibles */}
      {!mostrarSelectorColor && (
        <div className="border-2 border-red-300 rounded-lg p-4 bg-red-50">
          <p className="text-red-800 font-medium">
            ⚠️ No hay colores disponibles para este producto
          </p>
          <p className="text-sm text-red-600 mt-2">
            Debe crear una variante con color antes de poder subir imágenes.
          </p>
        </div>
      )}

      {/* Sección de upload */}
      <div className="border rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {mostrarSelectorColor ? (
              tieneColorSeleccionado ? (
                <>Subir Imágenes para: <span className="text-blue-600">{selectedColor}</span></>
              ) : (
                <>Subir Imágenes - <span className="text-red-600">Seleccione un color primero</span></>
              )
            ) : (
              <>Subir Imágenes del Producto</>
            )}
          </h3>
          {tieneColorSeleccionado && puedeSubirMas && (
            <span className="text-sm text-gray-600">
              {imagenesExistentes}/{MAX_IMAGENES_POR_COLOR} imágenes ({imagenesDisponibles} disponibles)
            </span>
          )}
          {tieneColorSeleccionado && !puedeSubirMas && (
            <span className="text-sm text-red-600 font-medium">
              Límite alcanzado ({imagenesExistentes}/{MAX_IMAGENES_POR_COLOR})
            </span>
          )}
        </div>

        {/* Mensaje de advertencia si no hay color seleccionado */}
        {mostrarSelectorColor && !tieneColorSeleccionado && (
          <div className="border-2 border-yellow-400 rounded-lg p-4 bg-yellow-50">
            <p className="text-yellow-800 font-medium flex items-center gap-2">
              <span>⚠️</span>
              <span>Debe seleccionar un color antes de seleccionar imágenes</span>
            </p>
          </div>
        )}

        {/* Área de drag & drop */}
        {mostrarSelectorColor && !tieneColorSeleccionado ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-100 opacity-60 cursor-not-allowed pointer-events-none">
            <Upload className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p className="text-gray-500 mb-2 font-medium">
              ⚠️ Seleccione un color primero
            </p>
            <p className="text-sm text-gray-400">
              No se pueden seleccionar imágenes sin seleccionar un color
            </p>
          </div>
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">
              Arrastra imágenes aquí o haz clic para seleccionar
            </p>
            <p className="text-sm text-gray-500">
              Formatos: JPG, PNG, WEBP (máx. 5MB por imagen)
            </p>
          </div>
        )}

        {/* Previews de imágenes seleccionadas */}
        {previews.length > 0 && (
          <div className="grid grid-cols-4 gap-4">
            {previews.map((preview, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group"
              >
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
                    setPreviews(prev => prev.filter((_, i) => i !== index));
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Botón de subir */}
        <Button
          onClick={handleUpload}
          disabled={
            (mostrarSelectorColor && !tieneColorSeleccionado) || 
            (!mostrarSelectorColor && todosLosColores.length === 0) ||
            selectedFiles.length === 0 || 
            isUploading || 
            (tieneColorSeleccionado && !puedeSubirMas) ||
            (tieneColorSeleccionado && imagenesExistentes + selectedFiles.length > MAX_IMAGENES_POR_COLOR)
          }
          variant="black"
          size="md"
          fullWidth
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Subiendo...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Subir {selectedFiles.length} imagen(es)
            </>
          )}
        </Button>
      </div>

      {/* Galería de imágenes por color */}
      <div className="border rounded-lg p-6 space-y-6">
        <h3 className="text-lg font-semibold">Imágenes por Color</h3>

        {isLoadingImages ? (
          <div className="text-center py-8 text-gray-500">
            <Loader2 className="mx-auto h-8 w-8 animate-spin mb-2" />
            <p>Cargando imágenes...</p>
          </div>
        ) : !imagesByColor || Object.keys(imagesByColor).length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p>No hay imágenes subidas</p>
          </div>
        ) : (
          <div className="space-y-8">
            {todosLosColores.map((color) => {
              const images = imagesByColor[color] || [];
              
              if (images.length === 0) return null;

              return (
                <motion.div
                  key={color}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-700 text-base">
                      {color} <span className="text-sm text-gray-500 font-normal">({images.length} imagen{images.length !== 1 ? 'es' : ''})</span>
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {images.map((image: ProductImage) => (
                      <motion.div
                        key={image.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        className="relative group cursor-pointer h-32 w-full"
                      >
                        <ProductImageComponent
                          src={image.imagenUrl}
                          alt={`${color} - ${image.orden}`}
                          fill
                          className="w-full h-full rounded-lg transition-transform duration-200"
                          objectFit="cover"
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                        />
                        <div className="absolute inset-0 rounded-lg transition-opacity duration-200 pointer-events-none" />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(image.id);
                          }}
                          disabled={deleteMutation.isPending}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 z-10"
                          aria-label="Eliminar imagen"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded z-10">
                          #{image.orden}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

