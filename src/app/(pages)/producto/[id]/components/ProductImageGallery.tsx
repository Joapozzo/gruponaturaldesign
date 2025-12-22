"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import Image from 'next/image';
import DriveImageGallery from '@/app/components/DriveImageGallery';
import { ProductWithImage } from '@/app/types/producto';

interface ProductImageGalleryProps {
    product: ProductWithImage;
    productName: string;
    images: string[];
    currentImageIndex: number;
    onImageChange: (index: number) => void;
    onNext: () => void;
    onPrev: () => void;
    onOpenModal: () => void;
}

export default function ProductImageGallery({
    product,
    productName,
    images,
    currentImageIndex,
    onImageChange,
    onNext,
    onPrev,
    onOpenModal,
}: ProductImageGalleryProps) {
    const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [validImages, setValidImages] = useState<string[]>([]);
    const [imageLoadStatus, setImageLoadStatus] = useState<{ [key: string]: 'loading' | 'loaded' | 'error' | 'pending' }>({});
    const [imagesKey, setImagesKey] = useState<string>('');
    const imageRef = useRef<HTMLDivElement>(null);

    // Filtrar imágenes válidas (que existen)
    // Solo intentar cargar imágenes secuencialmente hasta encontrar un 404
    useEffect(() => {
        // Crear una clave única para comparar el array de imágenes
        const newImagesKey = images.join('|');
        
        // Solo actualizar si las imágenes realmente cambiaron
        if (newImagesKey === imagesKey) {
            return;
        }
        
        setImagesKey(newImagesKey);
        
        // Inicializar todas las imágenes como "no intentadas aún"
        const status: { [key: string]: 'loading' | 'loaded' | 'error' | 'pending' } = {};
        images.forEach((img, index) => {
            // Solo marcar la primera imagen como "loading", las demás como "pending"
            if (index === 0) {
                status[img] = 'loading';
            } else {
                status[img] = 'pending';
            }
        });
        setImageLoadStatus(status);
        setValidImages(images);
    }, [images, imagesKey]); // Depender de images y imagesKey para comparar

    const handleImageLoad = (imgSrc: string) => {
        setImageLoadStatus(prev => {
            // Solo actualizar si el estado cambió
            if (prev[imgSrc] === 'loaded') {
                return prev; // Ya está cargada, no hacer nada
            }
            
            const newStatus: { [key: string]: 'loading' | 'loaded' | 'error' | 'pending' } = { ...prev, [imgSrc]: 'loaded' };
            // Si esta imagen cargó exitosamente, intentar cargar la siguiente SOLO si no hay errores previos
            const currentIndex = validImages.indexOf(imgSrc);
            if (currentIndex >= 0 && currentIndex < validImages.length - 1) {
                const nextImage = validImages[currentIndex + 1];
                // Solo intentar cargar la siguiente si está pendiente
                if (newStatus[nextImage] === 'pending') {
                    newStatus[nextImage] = 'loading';
                }
            }
            return newStatus;
        });
    };

    const handleImageError = (imgSrc: string) => {
        setImageLoadStatus(prev => {
            // Si esta imagen falló, marcar como error y NO intentar cargar las siguientes
            const newStatus: { [key: string]: 'loading' | 'loaded' | 'error' | 'pending' } = { ...prev, [imgSrc]: 'error' };
            
            // Encontrar el índice de la imagen que falló
            const errorIndex = validImages.indexOf(imgSrc);
            
            // Marcar todas las imágenes siguientes como 'error' también para evitar intentos
            if (errorIndex >= 0) {
                for (let i = errorIndex + 1; i < validImages.length; i++) {
                    const nextImg = validImages[i];
                    // Solo marcar como error si aún no se ha intentado cargar
                    if (newStatus[nextImg] === 'pending' || newStatus[nextImg] === 'loading') {
                        newStatus[nextImg] = 'error';
                    }
                }
            }
            
            return newStatus;
        });
    };

    // Filtrar imágenes válidas (mostrar las que están cargando o cargaron exitosamente)
    // Si una imagen falla (404), no mostrar esa ni las siguientes
    const displayImages = validImages.filter((img, index) => {
        const status = imageLoadStatus[img];
        
        // Si una imagen anterior falló, no mostrar las siguientes
        if (index > 0) {
            const prevStatus = imageLoadStatus[validImages[index - 1]];
            if (prevStatus === 'error') {
                return false; // No mostrar si la anterior falló
            }
        }
        
        // Mostrar si está cargando o cargó exitosamente (no mostrar si está en 'error')
        return status === 'loading' || status === 'loaded';
    });

    // Ajustar el índice actual si la imagen actual no existe
    const adjustedIndex = displayImages.length > 0 && currentImageIndex < displayImages.length
        ? currentImageIndex
        : displayImages.length > 0 ? 0 : 0;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imageRef.current) return;
        const rect = imageRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePosition({ x, y });
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        setMousePosition(null);
    };

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-2 sm:space-y-3"
            style={{ overflow: 'visible' }}
        >
            {/* Mostrar imágenes desde Drive si hay URL */}
            {product.fotosDriveUrl ? (
                <DriveImageGallery
                    driveFolderUrl={product.fotosDriveUrl}
                    productName={productName}
                />
            ) : (
                // Fallback: mostrar galería local con imagen grande y miniaturas
                // En mobile: miniaturas abajo, en desktop: miniaturas a la izquierda
                <div className="flex flex-col sm:flex-row gap-0 w-full max-w-lg mx-auto overflow-visible">
                    {/* Miniaturas - En mobile: abajo (horizontal), en desktop: izquierda (vertical) */}
                    {displayImages.length > 1 && (
                        <>
                            {/* Miniaturas verticales a la izquierda - Solo en desktop */}
                            <div className="hidden sm:flex flex-col gap-2 sm:gap-3 flex-shrink-0 mr-3 sm:mr-4 overflow-visible">
                                {displayImages.map((img, index) => {
                                    const actualIndex = validImages.indexOf(img);
                                    const isActive = adjustedIndex === actualIndex;
                                    return (
                                        <motion.button
                                            key={`${img}-${index}`}
                                            onClick={() => {
                                                if (actualIndex !== -1) {
                                                    onImageChange(actualIndex);
                                                } else {
                                                    onImageChange(index);
                                                }
                                            }}
                                            className={`relative w-16 sm:w-20 h-16 sm:h-20 rounded-lg transition-all duration-300 ${
                                                isActive
                                                    ? 'border-2 border-black'
                                                    : 'border-2 border-gray-200 hover:border-gray-400'
                                            }`}
                                            style={{
                                                boxSizing: 'border-box',
                                                overflow: 'visible'
                                            }}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            aria-label={`Ver imagen ${index + 1}`}
                                        >
                                            <div className="w-full h-full rounded-lg overflow-hidden">
                                                {imageLoadStatus[img] === 'error' ? (
                                                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                                        <Package className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                                    </div>
                                                ) : (
                                                    <Image
                                                        src={img}
                                                        alt={`${productName} - Miniatura ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                        width={80}
                                                        height={80}
                                                        unoptimized={true}
                                                        onLoad={() => handleImageLoad(img)}
                                                        onError={() => handleImageError(img)}
                                                    />
                                                )}
                                            </div>
                                            {/* Overlay cuando está seleccionada */}
                                            {isActive && (
                                                <div className="absolute inset-0 bg-black/20" />
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </>
                    )}
                    
                    {/* Imagen principal grande */}
                    <div className="relative group flex-1 flex justify-center w-full">
                        <div
                            ref={imageRef}
                            className="relative aspect-[3/4] bg-white rounded-lg overflow-hidden cursor-zoom-in max-h-[75vh] w-full"
                            onClick={onOpenModal}
                            onMouseMove={handleMouseMove}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                        {displayImages.length > 0 && displayImages[adjustedIndex] ? (
                            <>
                                <Image
                                    src={displayImages[adjustedIndex]}
                                    alt={`${productName} - Imagen ${adjustedIndex + 1}`}
                                    className="w-full h-full object-cover"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    unoptimized={true}
                                    onLoad={() => handleImageLoad(displayImages[adjustedIndex])}
                                    onError={() => {
                                        handleImageError(displayImages[adjustedIndex]);
                                    }}
                                />
                                {/* Efecto de zoom en círculo */}
                                {isHovering && mousePosition && imageRef.current && displayImages[adjustedIndex] && (
                                    <div
                                        className="absolute pointer-events-none z-10 rounded-full border-2 border-white shadow-2xl overflow-hidden"
                                        style={{
                                            width: '150px',
                                            height: '150px',
                                            left: `${mousePosition.x}px`,
                                            top: `${mousePosition.y}px`,
                                            transform: 'translate(-50%, -50%)',
                                        }}
                                    >
                                        <div
                                            className="w-full h-full"
                                            style={{
                                                backgroundImage: `url(${displayImages[adjustedIndex]})`,
                                                backgroundSize: `${(imageRef.current.offsetWidth / 150) * 100}% auto`,
                                                backgroundPosition: `${(mousePosition.x / imageRef.current.offsetWidth) * 100}% ${(mousePosition.y / imageRef.current.offsetHeight) * 100}%`,
                                                backgroundRepeat: 'no-repeat',
                                            }}
                                        />
                                    </div>
                                )}
                                {/* Botón para expandir */}
                                {displayImages.length > 1 && (
                                    <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full p-1.5 sm:p-2 transition-all duration-300 z-20">
                                        <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                    </div>
                                )}
                                {/* Navegación con flechas si hay más de una imagen */}
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onPrev();
                                            }}
                                            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full p-1.5 sm:p-2 transition-all duration-300 opacity-0 group-hover:opacity-100 z-20"
                                            aria-label="Imagen anterior"
                                        >
                                            <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onNext();
                                            }}
                                            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full p-1.5 sm:p-2 transition-all duration-300 opacity-0 group-hover:opacity-100 z-20"
                                            aria-label="Siguiente imagen"
                                        >
                                            <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                                        </button>
                                    </>
                                )}
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                <Package className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400" />
                            </div>
                        )}
                        </div>
                    </div>
                    
                    {/* Miniaturas horizontales abajo - Solo en mobile - 100% del ancho de la imagen principal */}
                    {displayImages.length > 1 && (
                        <div className="sm:hidden mt-3 w-full" style={{ overflow: 'visible', padding: '2px' }}>
                            <div className="grid grid-cols-4 gap-2.5 w-full" style={{ overflow: 'visible' }}>
                                {displayImages.map((img, index) => {
                                    const actualIndex = validImages.indexOf(img);
                                    const isActive = adjustedIndex === actualIndex;
                                    return (
                                        <motion.button
                                            key={`${img}-${index}-mobile`}
                                            onClick={() => {
                                                if (actualIndex !== -1) {
                                                    onImageChange(actualIndex);
                                                } else {
                                                    onImageChange(index);
                                                }
                                            }}
                                            className={`relative w-full aspect-square rounded-lg transition-all duration-300 ${
                                                isActive
                                                    ? 'border-2 border-black'
                                                    : 'border-2 border-gray-200 hover:border-gray-400'
                                            }`}
                                            style={{
                                                boxSizing: 'border-box',
                                                overflow: 'visible'
                                            }}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            aria-label={`Ver imagen ${index + 1}`}
                                        >
                                            <div className="w-full h-full rounded-lg overflow-hidden">
                                                {imageLoadStatus[img] === 'error' ? (
                                                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                                        <Package className="w-4 h-4 text-gray-400" />
                                                    </div>
                                                ) : (
                                                    <Image
                                                        src={img}
                                                        alt={`${productName} - Miniatura ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                        fill
                                                        sizes="25vw"
                                                        unoptimized={true}
                                                        onLoad={() => handleImageLoad(img)}
                                                        onError={() => handleImageError(img)}
                                                    />
                                                )}
                                            </div>
                                            {/* Overlay cuando está seleccionada */}
                                            {isActive && (
                                                <div className="absolute inset-0 bg-black/20 rounded-lg" />
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
}
