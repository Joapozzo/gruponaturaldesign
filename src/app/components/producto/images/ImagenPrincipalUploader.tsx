import React from 'react';
import { Upload, X } from 'lucide-react';

interface ImagenPrincipalUploaderProps {
  imagenUrl: string;
  onUpload: (file: File) => void;
  onRemove: () => void;
}

export const ImagenPrincipalUploader: React.FC<ImagenPrincipalUploaderProps> = ({
  imagenUrl,
  onUpload,
  onRemove,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  if (imagenUrl) {
    return (
      <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden group">
        <img
          src={imagenUrl}
          alt="Imagen principal"
          className="w-full h-full object-cover"
        />
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
      <Upload className="w-12 h-12 text-gray-400 mb-2" />
      <span className="text-sm text-gray-600">Haz clic para subir imagen principal</span>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </label>
  );
};

