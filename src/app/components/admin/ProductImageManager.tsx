'use client';

import { useState, useCallback, useRef } from 'react';
import {
  useProductImages,
  useProductImagesByColor,
  useUploadProductImages,
  useDeleteProductImage,
} from '../../hooks/useProductImages';
import Button from '../ui/Button';
import { X, Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProductImageManagerProps {
  productoWebId: number;
  productoNombre?: string;
}

export function ProductImageManager({
  productoWebId,
  productoNombre,
}: ProductImageManagerProps) {
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Queries
  const { data: imagesByColor, isLoading: isLoadingImages } =
    useProductImagesByColor(productoWebId);
  const { data: images, isLoading: isLoadingSingle } = useProductImages(
    productoWebId,
    selectedColor || undefined
  );

  // Mutations
  const uploadMutation = useUploadProductImages();
  const deleteMutation = useDeleteProductImage();

  // Manejar selección de archivos
  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const validFiles: File[] = [];
      const validPreviews: string[] = [];

      Array.from(files).forEach((file) => {
        // Validar tipo
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} no es una imagen válida`);
          return;
        }

        // Validar tamaño (5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} es demasiado grande (máx. 5MB)`);
          return;
        }

        validFiles.push(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            validPreviews.push(e.target.result as string);
            setPreviews([...validPreviews]);
          }
        };
        reader.readAsDataURL(file);
      });

      setSelectedFiles(validFiles);
    },
    []
  );

  // Manejar drag & drop
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

  // Subir imágenes
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
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Error al subir imágenes'
      );
    }
  }, [selectedColor, selectedFiles, productoWebId, uploadMutation]);

  // Eliminar imagen
  const handleDelete = useCallback(
    async (imageId: number) => {
      if (!confirm('¿Está seguro de que desea eliminar esta imagen?')) {
        return;
      }

      try {
        await deleteMutation.mutateAsync(imageId);
        toast.success('Imagen eliminada exitosamente');
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Error al eliminar imagen'
        );
      }
    },
    [deleteMutation]
  );

  // Remover preview
  const removePreview = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const isLoading = isLoadingImages || isLoadingSingle;
  const isUploading = uploadMutation.isPending;
  const isDeleting = deleteMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Información del producto */}
      {productoNombre && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-lg">{productoNombre}</h3>
          <p className="text-sm text-gray-600">ID: {productoWebId}</p>
        </div>
      )}

      {/* Sección de subida */}
      <div className="border rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold">Subir Imágenes</h3>

        {/* Selector de color */}
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

        {/* Área de drag & drop */}
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
          <p className="text-gray-600 mb-2">
            Arrastra imágenes aquí o haz clic para seleccionar
          </p>
          <p className="text-sm text-gray-500">
            Formatos: JPG, PNG, WEBP (máx. 5MB por imagen)
          </p>
        </div>

        {/* Previews de imágenes seleccionadas */}
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

        {/* Botón de subir */}
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
        <h3 className="text-lg font-semibold">Imágenes Subidas</h3>

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
                  {color || 'Sin color'} ({images.length} imagen{images.length !== 1 ? 'es' : ''})
                </h4>
                <div className="grid grid-cols-4 gap-4">
                  {images.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.imagenUrl}
                        alt={`${color} - ${image.orden}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => handleDelete(image.id)}
                        disabled={isDeleting}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                        #{image.orden}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

