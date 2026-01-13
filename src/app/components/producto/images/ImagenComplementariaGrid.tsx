import React from 'react';
import { Image as ImageIcon, X } from 'lucide-react';

interface ImagenComplementariaGridProps {
  imagenes: string[];
  onUpload: (file: File) => void;
  onRemove: (index: number) => void;
  maxImagenes: number;
}

export const ImagenComplementariaGrid: React.FC<ImagenComplementariaGridProps> = ({
  imagenes,
  onUpload,
  onRemove,
  maxImagenes,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  const canAddMore = imagenes.length < maxImagenes;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Imágenes Complementarias
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {imagenes.map((img, index) => (
          <div key={index} className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden group">
            <img
              src={img}
              alt={`Complementaria ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        {canAddMore && (
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            <ImageIcon className="w-8 h-8 text-gray-400 mb-1" />
            <span className="text-xs text-gray-600">Agregar</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        )}
      </div>
      {imagenes.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          Puedes agregar hasta {maxImagenes} imágenes complementarias
        </p>
      )}
    </div>
  );
};

