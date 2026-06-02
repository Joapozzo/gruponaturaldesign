'use client';

import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Button from '@/components/ui/Button';
import ConfirmModal from '@/app/components/modal/ConfirmModal';
import {
  useProductoPadreImages,
  useUploadProductImages,
  useDeleteProductImage,
  useReorderProductImages,
} from '@/app/hooks/useProductImages';
import { Upload, X, Trash2, Image as ImageIcon, Loader2, GripVertical, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { compressImage } from '@/app/utils/compressImage';
import type { ProductImage } from '@/app/services/productImage.service';
import { ProductImage as ProductImageComponent } from '@/app/components/product-card/components/ProductImage';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface VariantesImagesManagerProps {
  productoPadreId: number;
  productoNombre: string;
  coloresDisponibles: string[];
  onSuccess?: () => void;
}

/** Clave API para imágenes sin dimensión de color (solo talle / producto único) */
const SIN_COLOR_KEY = 'sin-color';
const GALERIA_SIN_COLOR_LABEL = 'Producto';

/** Un solo ítem de preview (orden único para drag & drop) */
interface PreviewItem {
  id: string;
  file: File;
  preview: string;
}

function colorLookupKey(color: string): string {
  return color
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');
}

function dedupeProductColors(preferred: string[], extra: string[] = []): string[] {
  const byKey = new Map<string, string>();
  for (const c of preferred) {
    if (!c?.trim()) continue;
    byKey.set(colorLookupKey(c), c);
  }
  for (const c of extra) {
    if (!c?.trim()) continue;
    const key = colorLookupKey(c);
    if (!byKey.has(key)) byKey.set(key, c);
  }
  return Array.from(byKey.values()).sort();
}

function getImagesForColor(
  imagesByColor: Record<string, ProductImage[]> | undefined,
  color: string
): ProductImage[] {
  if (!imagesByColor) return [];
  const direct = imagesByColor[color];
  if (direct?.length) return direct;
  const key = colorLookupKey(color);
  for (const [k, imgs] of Object.entries(imagesByColor)) {
    if (colorLookupKey(k) === key && imgs.length > 0) return imgs;
  }
  return [];
}

// ---------------------------------------------------------------------------
// SortableImageItem — tarjeta individual arrastrable (galería ya subida)
// ---------------------------------------------------------------------------

interface SortableImageItemProps {
  image: ProductImage;
  isPrincipal: boolean;
  isDeleting: boolean;
  onDelete: (id: number) => void;
}

function SortableImageItem({ image, isPrincipal, isDeleting, onDelete }: SortableImageItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: image.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden"
    >
      <ProductImageComponent
        src={image.imagenUrl}
        alt={`imagen orden ${image.orden}`}
        fill
        className="w-full h-full rounded-lg transition-transform duration-200"
        objectFit="contain"
        sizes="(max-width: 768px) 50vw, 20vw"
      />

      {/* Handle de drag */}
      <button
        {...attributes}
        {...listeners}
        className="absolute top-1 left-1 bg-black/50 text-white rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-10"
        aria-label="Arrastrar para reordenar"
      >
        <GripVertical className="h-3 w-3" />
      </button>

      {/* Badge principal */}
      {isPrincipal && (
        <div className="absolute top-1 right-7 bg-amber-400 text-white rounded px-1.5 py-0.5 flex items-center gap-1 z-10">
          <Star className="h-2.5 w-2.5 fill-white" />
          <span className="text-[10px] font-semibold leading-none">Principal</span>
        </div>
      )}

      {/* Botón eliminar */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(image.id);
        }}
        disabled={isDeleting}
        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 z-10"
        aria-label="Eliminar imagen"
      >
        <Trash2 className="h-3 w-3" />
      </button>

      {/* Número de orden */}
      <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded z-10">
        #{image.orden}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SortablePreviewItem — tarjeta de preview arrastrable (antes de subir)
// ---------------------------------------------------------------------------

interface SortablePreviewItemProps {
  id: string;
  preview: string;
  index: number;
  isPrincipal: boolean;
  onRemove: (index: number) => void;
}

function SortablePreviewItem({ id, preview, index, isPrincipal, onRemove }: SortablePreviewItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden"
    >
      <img
        src={preview}
        alt={`Preview ${index + 1}`}
        className="w-full h-full object-contain rounded-lg"
      />

      {/* Handle de drag */}
      <button
        {...attributes}
        {...listeners}
        className="absolute top-1 left-1 bg-black/50 text-white rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-10"
        aria-label="Arrastrar para reordenar"
      >
        <GripVertical className="h-3 w-3" />
      </button>

      {/* Badge principal */}
      {isPrincipal && (
        <div className="absolute top-1 right-7 bg-amber-400 text-white rounded px-1.5 py-0.5 flex items-center gap-1 z-10">
          <Star className="h-2.5 w-2.5 fill-white" />
          <span className="text-[10px] font-semibold leading-none">Principal</span>
        </div>
      )}

      {/* Botón quitar */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(index);
        }}
        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <X className="h-3 w-3" />
      </button>

      <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded z-10">
        #{index + 1}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export function VariantesImagesManager({
  productoPadreId,
  coloresDisponibles,
}: VariantesImagesManagerProps) {
  const esSoloTalle = coloresDisponibles.length === 0;
  const [selectedColor, setSelectedColor] = useState<string>(
    esSoloTalle ? SIN_COLOR_KEY : coloresDisponibles[0] || '',
  );
  /** Un solo estado ordenado: permite reordenar en preview y acumular al elegir más archivos */
  const [previewItems, setPreviewItems] = useState<PreviewItem[]>([]);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [imageIdToDelete, setImageIdToDelete] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: imagesByColor, isLoading, refetch } = useProductoPadreImages(productoPadreId);
  const uploadMutation = useUploadProductImages();
  const deleteMutation = useDeleteProductImage();
  const reorderMutation = useReorderProductImages();

  // Sensores de dnd-kit — requiere 5px de movimiento para activar (evita conflicto con click)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  useEffect(() => {
    if (esSoloTalle) {
      setSelectedColor(SIN_COLOR_KEY);
      return;
    }
    if (!selectedColor.trim() && coloresDisponibles[0]) {
      setSelectedColor(coloresDisponibles[0]);
    }
  }, [esSoloTalle, coloresDisponibles, selectedColor]);

  const colorActivo = esSoloTalle ? SIN_COLOR_KEY : selectedColor;

  const coloresConImagenes = useMemo(() => {
    if (!imagesByColor) return [];
    return Object.keys(imagesByColor).filter(
      (c) => c !== SIN_COLOR_KEY && imagesByColor[c].length > 0,
    );
  }, [imagesByColor]);

  const todosLosColores = useMemo(
    () => dedupeProductColors(coloresDisponibles, coloresConImagenes),
    [coloresDisponibles, coloresConImagenes],
  );

  const seccionesGaleria = useMemo(() => {
    if (!imagesByColor) return [];
    if (esSoloTalle) {
      const images = getImagesForColor(imagesByColor, SIN_COLOR_KEY);
      if (images.length === 0) return [];
      return [{ key: SIN_COLOR_KEY, label: GALERIA_SIN_COLOR_LABEL, images }];
    }
    return [...coloresConImagenes]
      .sort()
      .map((color) => ({
        key: color,
        label: color,
        images: getImagesForColor(imagesByColor, color),
      }))
      .filter((s) => s.images.length > 0);
  }, [imagesByColor, esSoloTalle, coloresConImagenes]);

  const imagenesExistentes = useMemo(
    () => getImagesForColor(imagesByColor, colorActivo).length,
    [imagesByColor, colorActivo],
  );

  const MAX_IMAGENES = 3;
  const puedeSubirMas = imagenesExistentes < MAX_IMAGENES;
  const imagenesDisponibles = MAX_IMAGENES - imagenesExistentes;
  const limiteAlcanzadoMsg = esSoloTalle
    ? `Límite de ${MAX_IMAGENES} imágenes del producto alcanzado`
    : `Límite de ${MAX_IMAGENES} imágenes para este color alcanzado`;

  // -------------------------------------------------------------------------
  // Selección de archivos (acumula con las ya elegidas, respeta límite)
  // -------------------------------------------------------------------------

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const toProcess: File[] = [];
      Array.from(files).forEach((file) => {
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} no es una imagen válida`);
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} es demasiado grande (máx. 5MB)`);
          return;
        }
        toProcess.push(file);
      });
      if (toProcess.length === 0) return;

      try {
        const compressedFiles = await Promise.all(
          toProcess.map((file) => compressImage(file))
        );
        const previewPromises = compressedFiles.map(
          (file) =>
            new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = (e) =>
                e.target?.result ? resolve(e.target.result as string) : reject();
              reader.onerror = reject;
              reader.readAsDataURL(file);
            })
        );
        const newPreviews = await Promise.all(previewPromises);
        setPreviewItems((prev) => {
          const slotsLeft = MAX_IMAGENES - imagenesExistentes - prev.length;
          const toAddCount = Math.min(compressedFiles.length, Math.max(0, slotsLeft));
          if (toAddCount <= 0) {
            toast.error(limiteAlcanzadoMsg);
            return prev;
          }
          const toAddFiles = compressedFiles.slice(0, toAddCount);
          const toAddPreviews = newPreviews.slice(0, toAddCount);
          const base = Date.now();
          const newItems: PreviewItem[] = toAddFiles.map((file, i) => ({
            id: `preview-${base}-${i}`,
            file,
            preview: toAddPreviews[i],
          }));
          return [...prev, ...newItems];
        });
      } catch {
        toast.error('Error al procesar las imágenes');
      }
    },
    [imagenesExistentes, limiteAlcanzadoMsg],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!esSoloTalle && todosLosColores.length > 0 && !selectedColor.trim()) {
        toast.error('⚠️ Debe seleccionar un color antes de seleccionar imágenes');
        return;
      }
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect, esSoloTalle, todosLosColores, selectedColor],
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const removePreview = useCallback((index: number) => {
    setPreviewItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // -------------------------------------------------------------------------
  // Drag & drop en previews (reordenar antes de subir) — un solo setState
  // -------------------------------------------------------------------------

  const handlePreviewDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setPreviewItems((prev) => {
      const oldIndex = prev.findIndex((item) => item.id === active.id);
      const newIndex = prev.findIndex((item) => item.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });
  }, []);

  // -------------------------------------------------------------------------
  // Drag & drop en galería ya subida (reordenar y persistir)
  // -------------------------------------------------------------------------

  const handleGalleryDragEnd = useCallback(
    async (event: DragEndEvent, color: string) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const images = getImagesForColor(imagesByColor, color);
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      const reordered = arrayMove(images, oldIndex, newIndex);
      const payload = reordered.map((img, i) => ({ id: img.id, orden: i + 1 }));

      try {
        await reorderMutation.mutateAsync(payload);
        await refetch();
        toast.success('Orden actualizado');
      } catch {
        toast.error('Error al guardar el orden');
      }
    },
    [imagesByColor, reorderMutation, refetch]
  );

  // -------------------------------------------------------------------------
  // Subir imágenes
  // -------------------------------------------------------------------------

  const handleUpload = useCallback(async () => {
    if (!esSoloTalle && todosLosColores.length > 0 && !selectedColor.trim()) {
      toast.error('⚠️ Debe seleccionar un color antes de seleccionar imágenes');
      return;
    }
    if (previewItems.length === 0) {
      toast.error('Debe seleccionar al menos una imagen');
      return;
    }
    if (!puedeSubirMas) {
      toast.error(limiteAlcanzadoMsg);
      return;
    }
    if (imagenesExistentes + previewItems.length > MAX_IMAGENES) {
      toast.error(
        `Solo podés subir ${imagenesDisponibles} imagen(es) más. Ya tenés ${imagenesExistentes} de ${MAX_IMAGENES} permitidas.`,
      );
      return;
    }

    const filesToUpload = previewItems.map((item) => item.file);
    try {
      await uploadMutation.mutateAsync({
        productoWebId: undefined,
        productoPadreId: productoPadreId,
        color: esSoloTalle ? '' : selectedColor,
        files: filesToUpload,
      });
      toast.success(`${filesToUpload.length} imagen(es) subida(s) exitosamente`);
      setPreviewItems([]);
      await refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al subir imágenes');
    }
  }, [
    esSoloTalle,
    selectedColor,
    previewItems,
    productoPadreId,
    uploadMutation,
    refetch,
    todosLosColores,
    puedeSubirMas,
    imagenesExistentes,
    imagenesDisponibles,
    limiteAlcanzadoMsg,
  ]);

  // -------------------------------------------------------------------------
  // Eliminar imagen
  // -------------------------------------------------------------------------

  const openConfirmDelete = useCallback((imageId: number) => {
    setImageIdToDelete(imageId);
    setConfirmDeleteOpen(true);
  }, []);

  const closeConfirmDelete = useCallback(() => {
    setConfirmDeleteOpen(false);
    setImageIdToDelete(null);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (imageIdToDelete == null) return;
    try {
      await deleteMutation.mutateAsync(imageIdToDelete);
      toast.success('Imagen eliminada exitosamente');
      await refetch();
      closeConfirmDelete();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al eliminar imagen');
    }
  }, [imageIdToDelete, deleteMutation, refetch, closeConfirmDelete]);

  // -------------------------------------------------------------------------
  // Flags de estado
  // -------------------------------------------------------------------------

  const isLoadingImages = isLoading || deleteMutation.isPending;
  const isUploading = uploadMutation.isPending;
  const isReordering = reorderMutation.isPending;
  const mostrarSelectorColor = !esSoloTalle && todosLosColores.length > 0;
  const puedeSubirArchivos = esSoloTalle || selectedColor.trim().length > 0;
  const tieneColorSeleccionado = esSoloTalle || selectedColor.trim().length > 0;

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 xl:gap-6 h-full max-h-[calc(90vh-12rem)] min-h-0 overflow-hidden">
      {/* ------------------------------------------------------------------ */}
      {/* Columna izquierda: subir imágenes                                   */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col min-h-0 overflow-hidden border rounded-lg bg-gray-50/50 xl:max-h-[calc(90vh-12rem)]">
        <div className="p-4 flex-shrink-0 border-b border-gray-200">
          <h3 className="text-base font-medium text-gray-800">Imágenes del producto</h3>
        </div>
        <div className="p-4 flex-1 min-h-0 overflow-y-auto space-y-4">
          {/* Selector de color */}
          {mostrarSelectorColor && (
            <div className="border rounded-lg p-3 bg-white">
              <label className="block text-sm font-medium mb-2">
                Seleccionar color <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {todosLosColores.map((color) => {
                  const isSelected = selectedColor === color;
                  const hasImages = getImagesForColor(imagesByColor, color).length > 0;
                  return (
                    <motion.button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        isSelected
                          ? 'bg-black text-white shadow-md'
                          : hasImages
                          ? 'bg-white border-2 border-gray-300 text-gray-700 hover:border-black'
                          : 'bg-white border border-gray-300 text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      {color}
                      {hasImages && (
                        <span className="ml-1.5 text-xs opacity-75">
                          ({getImagesForColor(imagesByColor, color).length})
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
              {!tieneColorSeleccionado && (
                <p className="mt-2 text-xs text-red-600 font-medium">
                  ⚠️ Debe seleccionar un color antes de seleccionar imágenes
                </p>
              )}
            </div>
          )}

          {!mostrarSelectorColor && esSoloTalle && (
            <div className="border rounded-lg p-3 bg-blue-50 border-blue-200">
              <p className="text-blue-900 text-sm font-medium">Producto sin colores</p>
              <p className="text-xs text-blue-700 mt-1">
                Las imágenes se comparten entre todos los talles (como en la tienda: solo selector de talle).
              </p>
            </div>
          )}

          {/* Área de subida */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {esSoloTalle ? (
                  'Subir imágenes del producto'
                ) : mostrarSelectorColor && tieneColorSeleccionado ? (
                  <>
                    Subir para: <span className="text-blue-600">{selectedColor}</span>
                  </>
                ) : mostrarSelectorColor ? (
                  <span className="text-red-600">Seleccione un color primero</span>
                ) : (
                  'Subir imágenes'
                )}
              </span>
              {puedeSubirArchivos && (
                <span className="text-xs text-gray-500">
                  {imagenesExistentes}/{MAX_IMAGENES}{' '}
                  {imagenesDisponibles > 0
                    ? `(${imagenesDisponibles} disponibles)`
                    : '— Límite alcanzado'}
                </span>
              )}
            </div>

            {mostrarSelectorColor && !tieneColorSeleccionado ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-100 opacity-60 cursor-not-allowed pointer-events-none">
                <Upload className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                <p className="text-gray-500 text-sm font-medium">⚠️ Seleccione un color primero</p>
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-5 text-center hover:border-blue-400 transition-colors cursor-pointer"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                />
                <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                <p className="text-gray-600 text-sm">Arrastra imágenes aquí o haz clic</p>
                <p className="text-xs text-gray-500">JPG, PNG, WEBP (máx. 5MB)</p>
              </div>
            )}

            {/* Previews arrastrables */}
            {previewItems.length > 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handlePreviewDragEnd}
              >
                <SortableContext
                  items={previewItems.map((i) => i.id)}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-3 gap-2">
                    {previewItems.map((item, index) => (
                      <SortablePreviewItem
                        key={item.id}
                        id={item.id}
                        preview={item.preview}
                        index={index}
                        isPrincipal={index === 0}
                        onRemove={removePreview}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}

            {previewItems.length > 1 && (
              <p className="text-xs text-gray-500 text-center">
                Arrastrá las imágenes para cambiar el orden. La primera será la principal.
              </p>
            )}

            <Button
              onClick={handleUpload}
              disabled={
                !puedeSubirArchivos ||
                previewItems.length === 0 ||
                isUploading ||
                !puedeSubirMas ||
                imagenesExistentes + previewItems.length > MAX_IMAGENES
              }
              variant="black"
              size="sm"
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
                  Subir {previewItems.length} imagen(es)
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Columna derecha: galería por color con drag & drop                  */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col min-h-0 overflow-hidden border rounded-lg bg-gray-50/50 xl:max-h-[calc(90vh-12rem)]">
        <div className="p-4 flex-shrink-0 border-b border-gray-200">
          <h3 className="text-base font-medium text-gray-800">
            {esSoloTalle ? 'Galería del producto' : 'Por color'}
          </h3>
          {isReordering && (
            <p className="text-xs text-blue-600 mt-0.5 flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" /> Guardando orden...
            </p>
          )}
        </div>
        <div className="p-4 flex-1 min-h-0 overflow-y-auto">
          {isLoadingImages ? (
            <div className="text-center py-6 text-gray-500">
              <Loader2 className="mx-auto h-6 w-6 animate-spin mb-2" />
              <p className="text-sm">Cargando imágenes...</p>
            </div>
          ) : seccionesGaleria.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <ImageIcon className="mx-auto h-10 w-10 text-gray-300 mb-2" />
              <p className="text-sm">No hay imágenes subidas</p>
            </div>
          ) : (
            <div className="space-y-4">
              {seccionesGaleria.map(({ key, label, images }) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                  >
                    <h4 className="text-sm font-medium text-gray-700">
                      {label}{' '}
                      <span className="text-xs text-gray-500 font-normal">
                        ({images.length} imagen{images.length !== 1 ? 'es' : ''})
                      </span>
                      {images.length > 1 && (
                        <span className="ml-2 text-xs text-gray-400 font-normal">
                          · arrastrá para reordenar
                        </span>
                      )}
                    </h4>
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={(event) => handleGalleryDragEnd(event, key)}
                    >
                      <SortableContext
                        items={images.map((img) => img.id)}
                        strategy={rectSortingStrategy}
                      >
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {images.map((image: ProductImage) => (
                            <SortableImageItem
                              key={image.id}
                              image={image}
                              isPrincipal={image.orden === 1}
                              isDeleting={deleteMutation.isPending}
                              onDelete={openConfirmDelete}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </motion.div>
                ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmDeleteOpen}
        onClose={closeConfirmDelete}
        onConfirm={handleConfirmDelete}
        title="Eliminar imagen"
        message="¿Está seguro de que desea eliminar esta imagen?"
        type="confirm"
        confirmText="Eliminar"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
