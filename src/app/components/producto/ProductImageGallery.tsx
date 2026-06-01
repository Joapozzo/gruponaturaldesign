"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Maximize2 } from 'lucide-react';
import Image from 'next/image';
import DriveImageGallery from '@/app/components/DriveImageGallery';
import { getStockMessage } from '@/app/services/stockService';
import { ProductWithImage } from '@/app/types/producto';

/** Offset superior de la columna de miniaturas en desktop (top-14). */
const DESKTOP_THUMB_TOP_PX = 56;

interface ProductImageGalleryProps {
    product: ProductWithImage;
    productName: string;
    images: string[];
    currentImageIndex: number;
    onImageChange: (index: number) => void;
    onNext: () => void;
    onPrev: () => void;
    onOpenModal: (validImages?: string[], validIndex?: number) => void;
    isOutOfStock?: boolean;
    stock?: number | null;
    /** Ref al bloque showroom (piso) para alinear miniaturas en desktop. */
    showroomAlignRef?: React.RefObject<HTMLDivElement | null>;
}

export default function ProductImageGallery({
    product,
    productName,
    images,
    currentImageIndex,
    onImageChange,
    onOpenModal,
    isOutOfStock = false,
    stock,
    showroomAlignRef,
}: ProductImageGalleryProps) {
    const showLowStockBadge = getStockMessage(stock) === 'ÚLTIMAS UNIDADES';
    const [validImages, setValidImages] = useState<string[]>([]);
    const [imageLoadStatus, setImageLoadStatus] = useState<{ [key: string]: 'loading' | 'loaded' | 'error' | 'pending' }>({});
    const [imagesKey, setImagesKey] = useState<string>('');
    const [desktopThumbHeight, setDesktopThumbHeight] = useState<number | null>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const galleryWrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const newImagesKey = images.join('|');
        if (newImagesKey === imagesKey) return;

        setImagesKey(newImagesKey);
        setValidImages(images);

        const status: { [key: string]: 'loading' | 'loaded' | 'error' | 'pending' } = {};
        images.forEach((img) => {
            status[img] = 'loading';
        });
        setImageLoadStatus(status);
    }, [images, imagesKey]);

    const validImagesRef = useRef<string[]>([]);
    validImagesRef.current = validImages;

    const handleImageLoad = (imgSrc: string) => {
        setImageLoadStatus(prev => {
            if (prev[imgSrc] === 'loaded') return prev;
            const currentList = validImagesRef.current;
            const newStatus: { [key: string]: 'loading' | 'loaded' | 'error' | 'pending' } = { ...prev, [imgSrc]: 'loaded' };
            const currentIndex = currentList.indexOf(imgSrc);
            if (currentIndex >= 0 && currentIndex < currentList.length - 1) {
                const nextImage = currentList[currentIndex + 1];
                if (newStatus[nextImage] === 'pending') newStatus[nextImage] = 'loading';
            }
            return newStatus;
        });
    };

    const handleImageError = (imgSrc: string) => {
        setImageLoadStatus(prev => {
            const currentList = validImagesRef.current;
            const newStatus: { [key: string]: 'loading' | 'loaded' | 'error' | 'pending' } = { ...prev, [imgSrc]: 'error' };
            const errorIndex = currentList.indexOf(imgSrc);
            if (errorIndex >= 0) {
                for (let i = errorIndex + 1; i < currentList.length; i++) {
                    const nextImg = currentList[i];
                    if (newStatus[nextImg] === 'pending' || newStatus[nextImg] === 'loading') newStatus[nextImg] = 'error';
                }
            }
            return newStatus;
        });
    };

    const displayImages = validImages.filter((img, index) => {
        const status = imageLoadStatus[img];
        if (index > 0) {
            const prevStatus = imageLoadStatus[validImages[index - 1]];
            if (prevStatus === 'error') return false;
        }
        return status === 'loading' || status === 'loaded';
    });

    const adjustedIndex = displayImages.length > 0 && currentImageIndex < displayImages.length
        ? currentImageIndex
        : displayImages.length > 0 ? 0 : 0;

    const selectImage = (img: string, index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const actualIndex = validImages.indexOf(img);
        onImageChange(actualIndex !== -1 ? actualIndex : index);
    };

    const hasMultiple = displayImages.length > 1;
    const thumbnailImages = displayImages.slice(0, 4);
    const topOverlayOffset = hasMultiple ? 'top-10' : 'top-3';

    const LENS_SIZE = 150;
    const ZOOM_FACTOR = 2.5;

    const [zoomLens, setZoomLens] = useState<{
        x: number;
        y: number;
        w: number;
        h: number;
    } | null>(null);

    useEffect(() => {
        setZoomLens(null);
    }, [adjustedIndex, displayImages[adjustedIndex]]);

    useEffect(() => {
        const showroomEl = showroomAlignRef?.current;
        const wrapperEl = galleryWrapperRef.current;
        if (!showroomEl || !wrapperEl || !hasMultiple) {
            setDesktopThumbHeight(null);
            return;
        }

        const updateHeight = () => {
            if (window.matchMedia('(max-width: 1023px)').matches) {
                setDesktopThumbHeight(null);
                return;
            }
            const showroomBottom = showroomEl.getBoundingClientRect().bottom;
            const startTop = wrapperEl.getBoundingClientRect().top + DESKTOP_THUMB_TOP_PX;
            const height = showroomBottom - startTop;
            setDesktopThumbHeight(height > 80 ? height : null);
        };

        updateHeight();
        const observer = new ResizeObserver(updateHeight);
        observer.observe(showroomEl);
        observer.observe(wrapperEl);
        window.addEventListener('resize', updateHeight);
        window.addEventListener('scroll', updateHeight, { passive: true });

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', updateHeight);
            window.removeEventListener('scroll', updateHeight);
        };
    }, [showroomAlignRef, hasMultiple, displayImages.length]);

    const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (typeof window !== 'undefined' && window.innerWidth < 1024) return;
        const rect = e.currentTarget.getBoundingClientRect();
        setZoomLens({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            w: rect.width,
            h: rect.height,
        });
    };

    const handleImageMouseLeave = () => {
        setZoomLens(null);
    };

    const currentImage = displayImages[adjustedIndex];
    const lensHalf = LENS_SIZE / 2;
    const lensLeft = zoomLens
        ? Math.max(0, Math.min(zoomLens.x - lensHalf, zoomLens.w - LENS_SIZE))
        : 0;
    const lensTop = zoomLens
        ? Math.max(0, Math.min(zoomLens.y - lensHalf, zoomLens.h - LENS_SIZE))
        : 0;

    const renderThumbnail = (img: string, index: number, layout: 'mobile' | 'desktop') => {
        const actualIndex = validImages.indexOf(img);
        const isActive = adjustedIndex === actualIndex || adjustedIndex === index;
        const isDesktop = layout === 'desktop';

        return (
            <motion.button
                key={`${layout}-${img}-${index}`}
                type="button"
                onClick={(e) => selectImage(img, index, e)}
                className={`relative overflow-hidden ring-2 transition-all duration-200 cursor-pointer ${
                    isDesktop
                        ? 'flex-1 min-h-0 w-full rounded-lg'
                        : 'flex-1 aspect-[4/5] min-h-[80px] sm:min-h-[96px] rounded-lg'
                } ${
                    isActive
                        ? 'ring-white scale-[1.02] shadow-lg'
                        : 'ring-white/40 opacity-85 hover:opacity-100 hover:ring-white/70'
                }`}
                whileTap={{ scale: 0.98 }}
                aria-label={`Ver imagen ${index + 1}`}
                aria-current={isActive ? 'true' : undefined}
            >
                {imageLoadStatus[img] === 'error' ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300">
                        <Package className="w-5 h-5 text-gray-500" />
                    </div>
                ) : (
                    <Image
                        src={img}
                        alt={`${productName} - Miniatura ${index + 1}`}
                        className="object-cover"
                        fill
                        sizes={isDesktop ? '12vw' : '(max-width: 1024px) 25vw, 12vw'}
                        unoptimized={true}
                        onLoad={() => handleImageLoad(img)}
                        onError={() => handleImageError(img)}
                    />
                )}
            </motion.button>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-auto shrink-0"
        >
            {product.fotosDriveUrl ? (
                <DriveImageGallery
                    driveFolderUrl={product.fotosDriveUrl}
                    productName={productName}
                    isOutOfStock={isOutOfStock}
                    stock={stock}
                />
            ) : (
                <div ref={galleryWrapperRef} className="relative w-full lg:w-auto lg:overflow-visible">
                    <div
                        ref={imageRef}
                        className="relative w-full aspect-[3/4] max-h-[calc(100vh-12rem)] lg:h-[calc(100vh-12rem)] lg:w-[calc((100vh-12rem)*3/4)] lg:max-h-[calc(100vh-12rem)] rounded-2xl overflow-hidden cursor-zoom-in lg:cursor-none"
                        onClick={() => onOpenModal(displayImages, adjustedIndex)}
                        onMouseMove={handleImageMouseMove}
                        onMouseLeave={handleImageMouseLeave}
                    >
                        {displayImages.length > 0 && currentImage ? (
                            <>
                                <Image
                                    src={currentImage}
                                    alt={`${productName} - Imagen ${adjustedIndex + 1}`}
                                    className="object-cover pointer-events-none select-none"
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    unoptimized={true}
                                    draggable={false}
                                    onLoad={() => handleImageLoad(currentImage)}
                                    onError={() => handleImageError(currentImage)}
                                />

                                {/* Zoom óptico circular (desktop) */}
                                {zoomLens && (
                                    <div
                                        className="absolute hidden lg:block rounded-full border-2 border-white/90 shadow-2xl overflow-hidden pointer-events-none z-20"
                                        style={{
                                            width: LENS_SIZE,
                                            height: LENS_SIZE,
                                            left: lensLeft,
                                            top: lensTop,
                                        }}
                                        aria-hidden
                                    >
                                        <div
                                            className="w-full h-full"
                                            style={{
                                                backgroundImage: `url(${currentImage})`,
                                                backgroundRepeat: 'no-repeat',
                                                backgroundSize: `${zoomLens.w * ZOOM_FACTOR}px ${zoomLens.h * ZOOM_FACTOR}px`,
                                                backgroundPosition: `${-(zoomLens.x * ZOOM_FACTOR - lensHalf)}px ${-(zoomLens.y * ZOOM_FACTOR - lensHalf)}px`,
                                            }}
                                        />
                                    </div>
                                )}

                                {/* Barra de progreso — imágenes del color actual */}
                                {hasMultiple && (
                                    <div className="absolute top-3 left-3 right-3 z-30 flex items-center gap-2 pointer-events-auto">
                                        <div className="flex flex-1 gap-1.5">
                                            {displayImages.map((_, i) => (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const img = displayImages[i];
                                                        const actualIndex = validImages.indexOf(img);
                                                        onImageChange(actualIndex !== -1 ? actualIndex : i);
                                                    }}
                                                    className="flex-1 h-1 rounded-full bg-white/40 overflow-hidden"
                                                    aria-label={`Imagen ${i + 1} de ${displayImages.length}`}
                                                >
                                                    <div
                                                        className={`h-full rounded-full bg-white transition-all duration-300 ${
                                                            i === adjustedIndex ? 'w-full' : 'w-0'
                                                        }`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                        <span className="text-[10px] font-medium text-white/90 tabular-nums shrink-0 drop-shadow-sm">
                                            {adjustedIndex + 1}/{displayImages.length}
                                        </span>
                                    </div>
                                )}

                                {/* Expandir */}
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onOpenModal(displayImages, adjustedIndex);
                                    }}
                                    className={`absolute ${topOverlayOffset} right-3 z-30 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full p-1.5 sm:p-2 transition-all duration-300 pointer-events-auto`}
                                    aria-label="Ampliar imagen"
                                >
                                    <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                </button>

                                {/* Badge stock bajo */}
                                {showLowStockBadge && (
                                    <div
                                        className={`absolute ${topOverlayOffset} left-3 z-30 pointer-events-none rounded bg-[var(--red)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-md sm:text-xs`}
                                        aria-label="Últimas unidades disponibles"
                                    >
                                        ÚLTIMAS UNIDADES
                                    </div>
                                )}

                                {/* Miniaturas — mobile: fila abajo dentro de la imagen */}
                                {hasMultiple && (
                                    <>
                                        <div className="absolute inset-x-0 bottom-0 h-36 sm:h-44 bg-gradient-to-t from-black/50 via-black/20 to-transparent pointer-events-none z-20 lg:hidden" />
                                        <div className="absolute bottom-3 left-3 right-3 z-30 flex gap-2 pointer-events-auto lg:hidden">
                                            {thumbnailImages.map((img, index) =>
                                                renderThumbnail(img, index, 'mobile'),
                                            )}
                                        </div>
                                    </>
                                )}

                                {/* Agotado — sobre la imagen */}
                                {isOutOfStock && (
                                    <div
                                        className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none z-40"
                                        aria-hidden
                                    >
                                        <span className="text-white font-bold text-2xl uppercase tracking-wider drop-shadow-md">
                                            Agotado
                                        </span>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                <Package className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400" />
                            </div>
                        )}
                    </div>

                    {/* Desktop: columna de miniaturas alineada al piso del showroom (sin cambiar tamaño de la principal) */}
                    {hasMultiple && desktopThumbHeight != null && (
                        <div
                            className="absolute left-3 z-30 hidden lg:flex w-[32%] max-w-[148px] flex-col gap-2 pointer-events-auto"
                            style={{ top: DESKTOP_THUMB_TOP_PX, height: desktopThumbHeight }}
                        >
                            {thumbnailImages.map((img, index) =>
                                renderThumbnail(img, index, 'desktop'),
                            )}
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
}
