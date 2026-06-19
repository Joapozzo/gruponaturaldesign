'use client';

import React, { useState, useCallback, useRef } from 'react';
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
import {
  useProductImagesByColor,
  useUploadProductImages,
  useDeleteProductImage,
  useDeleteProductImagesBulk,
  useReorderProductImages,
} from '../../hooks/useProductImages';
import { useBulkSelection } from '../../hooks/useBulkSelection';
import { BulkImageActions } from './BulkImageActions';
import Button from '@/components/ui/Button';
import ConfirmModal from '../modal/ConfirmModal';
import {
  X,
  Upload,
  Trash2,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  Star,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { compressImage } from '@/app/utils/compressImage';
import type { ProductImage } from '../../services/productImage.service';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface ProductImageManagerProps {
  productoWebId: number;
  productoNombre?: string;
}

// ---------------------------------------------------------------------------
// SortableImageItem
// ---------------------------------------------------------------------------

interface SortableImageItemProps {
  image: ProductImage;
  isPrincipal: boolean;
  isDeleting: boolean;
  onDelete: (id: number) => void;
  onClick: (id: number) => void;
  selected?: boolean;
  onToggleSelect?: (id: number) => void;
}

function SortableImageItem({
  image,
  isPrincipal,
  isDeleting,
  onDelete,
  onClick,
  selected,
  onToggleSelect,
}: SortableImageItemProps) {
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
      className={`relative group cursor-pointer ${selected ? 'ring-2 ring-blue-500 ring-offset-2 rounded-lg' : ''}`}
      onClick={() => onClick(image.id)}
    >
      <img
        src={image.imagenUrl}
        alt={`imagen orden ${image.orden}`}
        className="w-full h-32 object-cover rounded-lg transition-transform duration-200 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-opacity duration-200" />

      {/* Checkbox selección bulk */}
      {onToggleSelect && (
        <label
          className="absolute bottom-2 right-2 z-10 flex items-center justify-center w-6 h-6 bg-white border-2 border-gray-300 rounded shadow cursor-pointer hover:bg-gray-50 has-[:checked]:bg-blue-500 has-[:checked]:border-blue-500"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="checkbox"
            checked={selected ?? false}
            onChange={(e) => {
              e.stopPropagation();
              onToggleSelect(image.id);
            }}
            onClick={(e) => e.stopPropagation()}
            className="sr-only"
          />
          {selected && (
            <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </label>
      )}

      {/* Handle de drag */}
      <button
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        className="absolute top-2 left-2 bg-black/50 text-white rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-10"
        aria-label="Arrastrar para reordenar"
      >
        <GripVertical className="h-3 w-3" />
      </button>

      {/* Badge principal */}
      {isPrincipal && (
        <div className="absolute top-2 right-8 bg-amber-400 text-white rounded px-1.5 py-0.5 flex items-center gap-1 z-10">
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
        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 z-10"
        aria-label="Eliminar imagen"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded z-10">
        #{image.orden}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export function ProductImageManager({ productoWebId, productoNombre }: ProductImageManagerProps) {
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [imageIdToDelete, setImageIdToDelete] = useState<number | null>(null);
  const [confirmBulkDeleteOpen, setConfirmBulkDeleteOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: imagesByColor, isLoading: isLoadingImages } =
    useProductImagesByColor(productoWebId);
  const uploadMutation = useUploadProductImages();
  const deleteMutation = useDeleteProductImage();
  const deleteBulkMutation = useDeleteProductImagesBulk();
  const reorderMutation = useReorderProductImages();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Array plano de todas las imágenes (lightbox + bulk selection)
  const allImages = React.useMemo(() => {
    return imagesByColor
      ? Object.entries(imagesByColor).flatMap(([color, images]) =>
          images.map((img) => ({ ...img, color }))
        )
      : [];
  }, [imagesByColor]);

  const bulkSelection = useBulkSelection(allImages);

  // -------------------------------------------------------------------------
  // Selección de archivos
  // -------------------------------------------------------------------------

  const handleFileSelect = useCallback(async (files: FileList | null) => {
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
      setSelectedFiles((prev) => [...prev, ...compressedFiles]);
      setPreviews((prev) => [...prev, ...newPreviews]);
    } catch {
      toast.error('Error al procesar las imágenes');
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const removePreview = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // -------------------------------------------------------------------------
  // Subir imágenes
  // -------------------------------------------------------------------------

  const handleUpload = useCallback(async () => {
    if (!selectedColor.trim()) {
      toast.error('Debe seleccionar un color');
      return;
    }
    if (selectedFiles.length === 0) {
      toast.error('Debe seleccionar al menos una imagen');
      return;
    }
    try {
      await uploadMutation.mutateAsync({
        productoWebId,
        color: selectedColor,
        files: selectedFiles,
      });
      toast.success(`${selectedFiles.length} imagen(es) subida(s) exitosamente`);
      setSelectedFiles([]);
      setPreviews([]);
      setSelectedColor('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al subir imágenes');
    }
  }, [selectedColor, selectedFiles, productoWebId, uploadMutation]);

  // -------------------------------------------------------------------------
  // Drag & drop en galería ya subida
  // -------------------------------------------------------------------------

  const handleGalleryDragEnd = useCallback(
    async (event: DragEndEvent, color: string) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const images = imagesByColor?.[color] ?? [];
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      const reordered = arrayMove(images, oldIndex, newIndex);
      const payload = reordered.map((img, i) => ({ id: img.id, orden: i + 1 }));

      try {
        await reorderMutation.mutateAsync(payload);
        toast.success('Orden actualizado');
      } catch {
        toast.error('Error al guardar el orden');
      }
    },
    [imagesByColor, reorderMutation]
  );

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
    const imageId = imageIdToDelete;
    try {
      await deleteMutation.mutateAsync(imageId);
      toast.success('Imagen eliminada exitosamente');
      closeConfirmDelete();
      if (lightboxOpen && allImages[lightboxIndex]?.id === imageId) {
        setLightboxOpen(false);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al eliminar imagen');
    }
  }, [imageIdToDelete, deleteMutation, closeConfirmDelete, lightboxOpen, lightboxIndex, allImages]);

  // -------------------------------------------------------------------------
  // Bulk delete
  // -------------------------------------------------------------------------

  const openConfirmBulkDelete = useCallback(() => {
    setConfirmBulkDeleteOpen(true);
  }, []);

  const closeConfirmBulkDelete = useCallback(() => {
    setConfirmBulkDeleteOpen(false);
  }, []);

  const handleConfirmBulkDelete = useCallback(async () => {
    const ids = Array.from(bulkSelection.selectedIds);
    if (ids.length === 0) {
      closeConfirmBulkDelete();
      return;
    }
    const idsSet = new Set(ids);
    try {
      await deleteBulkMutation.mutateAsync(ids);
      toast.success(`${ids.length} imagen(es) eliminada(s) correctamente`);
      bulkSelection.clearSelection();
      closeConfirmBulkDelete();
      if (lightboxOpen && allImages[lightboxIndex] && idsSet.has(allImages[lightboxIndex].id)) {
        setLightboxOpen(false);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al eliminar imágenes');
    }
  }, [bulkSelection, deleteBulkMutation, closeConfirmBulkDelete, lightboxOpen, lightboxIndex, allImages]);

  // -------------------------------------------------------------------------
  // Lightbox
  // -------------------------------------------------------------------------

  const openLightbox = useCallback(
    (imageId: number) => {
      const index = allImages.findIndex((img) => img.id === imageId);
      if (index !== -1) {
        setLightboxIndex(index);
        setLightboxOpen(true);
      }
    },
    [allImages]
  );

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const goToPrevious = useCallback(() => {
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  }, [allImages.length]);

  const goToNext = useCallback(() => {
    setLightboxIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  }, [allImages.length]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'ArrowLeft') goToPrevious();
      else if (e.key === 'ArrowRight') goToNext();
      else if (e.key === 'Escape') closeLightbox();
    },
    [lightboxOpen, goToPrevious, goToNext, closeLightbox]
  );

  React.useEffect(() => {
    if (lightboxOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [lightboxOpen, handleKeyDown]);

  const isLoading = isLoadingImages;
  const isUploading = uploadMutation.isPending;
  const isDeleting = deleteMutation.isPending;
  const isReordering = reorderMutation.isPending;

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div className="space-y-6">
      {productoNombre && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-lg">{productoNombre}</h3>
          <p className="text-sm text-gray-600">ID: {productoWebId}</p>
        </div>
      )}

      {/* Sección de subida */}
      <div className="border rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold">Subir Imágenes</h3>

        <div>
          <label className="block text-sm font-medium mb-2">
            Color <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            placeholder="Ej: Cemento, Azul marino, Gris topo"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
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
          <p className="text-gray-600 mb-2">Arrastra imágenes aquí o haz clic para seleccionar</p>
          <p className="text-sm text-gray-500">Formatos: JPG, PNG, WEBP (máx. 5MB por imagen)</p>
        </div>

        {previews.length > 0 && (
          <div className="grid grid-cols-4 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removePreview(index);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={!selectedColor || selectedFiles.length === 0 || isUploading}
          className="w-full"
        >
          {isUploading ? (
            <>Subiendo...</>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Subir {selectedFiles.length} imagen(es)
            </>
          )}
        </Button>
      </div>

      {/* Galería de imágenes */}
      <div className="border rounded-lg p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Imágenes Subidas</h3>
            {allImages.length > 0 && (
              <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bulkSelection.selectedCount === allImages.length && allImages.length > 0}
                  onChange={() => bulkSelection.toggleSelectAll()}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Seleccionar todas
              </label>
            )}
          </div>
          {isReordering && (
            <span className="text-xs text-blue-600 flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" /> Guardando orden...
            </span>
          )}
        </div>

        {bulkSelection.selectedCount > 0 && (
          <BulkImageActions
            selectedCount={bulkSelection.selectedCount}
            onBulkDelete={openConfirmBulkDelete}
            onClearSelection={bulkSelection.clearSelection}
            onSelectAll={bulkSelection.toggleSelectAll}
            isBulkDeleting={deleteBulkMutation.isPending}
            totalCount={allImages.length}
          />
        )}

        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Cargando...</div>
        ) : !imagesByColor || Object.keys(imagesByColor).length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p>No hay imágenes subidas</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(imagesByColor).map(([color, images]) => (
              <div key={color} className="space-y-2">
                <h4 className="font-medium text-gray-700">
                  {color || 'Sin color'} ({images.length} imagen
                  {images.length !== 1 ? 'es' : ''})
                  {images.length > 1 && (
                    <span className="ml-2 text-xs text-gray-400 font-normal">
                      · arrastrá para reordenar
                    </span>
                  )}
                </h4>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={(event) => handleGalleryDragEnd(event, color)}
                >
                  <SortableContext
                    items={images.map((img) => img.id)}
                    strategy={rectSortingStrategy}
                  >
                    <div className="grid grid-cols-4 gap-4">
                      {images.map((image) => (
                        <SortableImageItem
                          key={image.id}
                          image={image}
                          isPrincipal={image.orden === 1}
                          isDeleting={isDeleting}
                          onDelete={openConfirmDelete}
                          onClick={openLightbox}
                          selected={bulkSelection.selectedIds.has(image.id)}
                          onToggleSelect={bulkSelection.toggleSelect}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && allImages.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            aria-label="Cerrar"
          >
            <X className="h-8 w-8" />
          </button>

          {allImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full p-3"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
          )}

          <div
            className="relative max-w-7xl max-h-[90vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={allImages[lightboxIndex].imagenUrl}
              alt={`Imagen ${lightboxIndex + 1} de ${allImages.length}`}
              className="max-w-full max-h-[90vh] object-contain rounded-lg select-none"
              draggable={false}
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg text-sm">
              <p>
                {allImages[lightboxIndex].color || 'Sin color'} — Orden: #
                {allImages[lightboxIndex].orden}
                {allImages[lightboxIndex].orden === 1 && (
                  <span className="ml-2 text-amber-300">★ Principal</span>
                )}
              </p>
              <p className="text-xs text-gray-300 mt-1">
                {lightboxIndex + 1} de {allImages.length}
              </p>
            </div>
          </div>

          {allImages.length > 1 && (
            <>
              <div
                className="absolute left-0 top-0 bottom-0 w-1/4 cursor-pointer md:hidden"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                aria-label="Imagen anterior"
              />
              <div
                className="absolute right-0 top-0 bottom-0 w-1/4 cursor-pointer md:hidden"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                aria-label="Imagen siguiente"
              />
            </>
          )}

          {allImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full p-3"
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          )}
        </div>
      )}

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

      <ConfirmModal
        isOpen={confirmBulkDeleteOpen}
        onClose={closeConfirmBulkDelete}
        onConfirm={handleConfirmBulkDelete}
        title="Eliminar imágenes seleccionadas"
        message={`¿Está seguro de que desea eliminar las ${bulkSelection.selectedCount} imagen(es) seleccionada(s)?`}
        type="confirm"
        confirmText="Eliminar todas"
        loading={deleteBulkMutation.isPending}
      />
    </div>
  );
}
