'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Loader2, ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface DriveImageGalleryProps {
    driveFolderUrl: string | null;
    productName?: string;
}

/**
 * Componente que muestra imágenes desde una carpeta pública de Google Drive
 */
const DriveImageGallery: React.FC<DriveImageGalleryProps> = ({ driveFolderUrl, productName = 'Producto' }) => {
    const [images, setImages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Extraer el ID de la carpeta de la URL
    const extractFolderId = (url: string): string | null => {
        if (!url) return null;

        // Patrón 1: https://drive.google.com/drive/folders/FOLDER_ID
        const pattern1 = /drive\.google\.com\/drive\/folders\/([a-zA-Z0-9_-]+)/;
        const match1 = url.match(pattern1);
        if (match1) return match1[1];

        // Patrón 2: https://drive.google.com/open?id=FOLDER_ID
        const pattern2 = /[?&]id=([a-zA-Z0-9_-]+)/;
        const match2 = url.match(pattern2);
        if (match2) return match2[1];

        // Patrón 3: Solo el ID
        if (/^[a-zA-Z0-9_-]{20,}$/.test(url.trim())) {
            return url.trim();
        }

        return null;
    };

    // Obtener imágenes de la carpeta de Drive
    useEffect(() => {
        if (!driveFolderUrl) {
            setImages([]);
            return;
        }

        const folderId = extractFolderId(driveFolderUrl);
        if (!folderId) {
            setError('URL de Drive no válida');
            return;
        }

        setIsLoading(true);
        setError(null);

        // Usar nuestra API route para obtener las imágenes
        fetch(`/api/drive-images?folderUrl=${encodeURIComponent(driveFolderUrl)}`)
            .then(res => res.json())
            .then(data => {
                if (data.images && data.images.length > 0) {
                    // Usar las URLs de las imágenes
                    const imageUrls = data.images.map((img: any) => img.url);
                    setImages(imageUrls);
                } else if (data.error || data.message) {
                    // Si hay error pero tenemos el folderId, mostrar enlace
                    setError(data.error || data.message);
                }
            })
            .catch((err) => {
                console.error('Error al cargar imágenes:', err);
                setError('Error al cargar las imágenes');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [driveFolderUrl]);

    if (!driveFolderUrl) {
        return null;
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400 mr-2" />
                <span className="text-gray-600">Cargando imágenes...</span>
            </div>
        );
    }

    if (error && images.length === 0) {
        return (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 mb-2">
                    No se pudieron cargar las imágenes automáticamente.
                </p>
                <a
                    href={driveFolderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                    Ver imágenes en Drive →
                </a>
            </div>
        );
    }

    if (images.length === 0) {
        return (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                    <ImageIcon className="w-5 h-5 text-gray-400" />
                    <div>
                        <p className="text-sm text-gray-700 font-medium">
                            Ver galería de fotos
                        </p>
                        <a
                            href={driveFolderUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-800 underline"
                        >
                            Abrir carpeta en Drive
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Galería de miniaturas */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                    Galería de Fotos ({images.length})
                </h3>
                
                {/* Imagen principal */}
                <div className="relative aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden group">
                    <Image
                        src={images[currentIndex]}
                        alt={`${productName} - Imagen ${currentIndex + 1}`}
                        fill
                        className="object-cover"
                        unoptimized // Drive URLs pueden no ser optimizables
                    />
                    
                    {/* Controles de navegación */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={() => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={() => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
                            >
                                <ChevronRight size={20} />
                            </button>
                            
                            {/* Indicador de imagen */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-xs">
                                {currentIndex + 1} / {images.length}
                            </div>
                        </>
                    )}
                    
                    {/* Botón para expandir */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-lg flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
                    >
                        <ImageIcon size={20} />
                    </button>
                </div>

                {/* Miniaturas */}
                {images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                        {images.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                                    currentIndex === index
                                        ? 'border-black ring-2 ring-black ring-offset-1'
                                        : 'border-gray-200 hover:border-gray-400'
                                }`}
                            >
                                <Image
                                    src={img}
                                    alt={`${productName} - Miniatura ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal de imagen expandida */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="relative max-w-6xl max-h-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={images[currentIndex]}
                                alt={`${productName} - Imagen expandida`}
                                width={1200}
                                height={1200}
                                className="max-w-full max-h-[90vh] object-contain rounded-lg"
                                unoptimized
                            />
                            
                            {/* Botón cerrar */}
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                            >
                                <X size={20} />
                            </button>
                            
                            {/* Navegación en modal */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={() => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default DriveImageGallery;

