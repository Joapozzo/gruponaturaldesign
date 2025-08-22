"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Package,
    Star,
    ChevronLeft,
    ChevronRight,
    Maximize2,
    X,
    MessageCircle,
    Eye
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { productos } from '@/app/data/productos';
import { ProductType } from '@/app/types/producto';
import { useWhatsApp } from '@/app/components/hooks/useWhatsApp';
import Button from '@/app/components/ui/Button';
import Section from '@/app/components/Section';
import Link from 'next/link';

const ProductDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const productId = parseInt(params.id as string);

    // Estados
    const [product, setProduct] = useState<ProductType | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [relatedProducts, setRelatedProducts] = useState<ProductType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // WhatsApp hook
    const { openWhatsApp } = useWhatsApp({
        defaultMessage: product
            ? `¡Hola! Me interesa el producto "${product.nombre}" de la categoría ${product.categoriaIndumentaria}. ¿Podrían brindarme más información y cotización?`
            : "¡Hola! Me interesa conocer más sobre sus productos."
    });

    // Efectos
    useEffect(() => {
        const foundProduct = productos.find(p => p.id === productId);
        if (foundProduct) {
            setProduct(foundProduct);
            // Obtener productos relacionados (misma categoría, excluyendo el actual)
            const related = productos
                .filter(p => p.categoriaIndumentaria === foundProduct.categoriaIndumentaria && p.id !== foundProduct.id)
                .slice(0, 4);
            setRelatedProducts(related);
        }
        setIsLoading(false);
    }, [productId]);

    // Funciones de navegación de imágenes
    const nextImage = () => {
        if (product) {
            setCurrentImageIndex((prev) =>
                prev === product.imagenes.length - 1 ? 0 : prev + 1
            );
        }
    };

    const prevImage = () => {
        if (product) {
            setCurrentImageIndex((prev) =>
                prev === 0 ? product.imagenes.length - 1 : prev - 1
            );
        }
    };

    // const handleShare = async () => {
    //     if (navigator.share) {
    //         try {
    //             await navigator.share({
    //                 title: product?.nombre,
    //                 text: product?.descripcion,
    //                 url: window.location.href,
    //             });
    //         } catch (error) {
    //             console.log('Error sharing:', error);
    //         }
    //     } else {
    //         // Fallback: copiar al portapapeles
    //         navigator.clipboard.writeText(window.location.href);
    //         // Aquí podrías mostrar un toast de confirmación
    //     }
    // };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 px-5 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-6"></div>
                    <p className="text-gray-600">Cargando producto...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 px-5 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package className="w-12 h-12 text-gray-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Producto no encontrado</h1>
                    <p className="text-gray-600 mb-6">El producto que buscas no existe o ha sido removido.</p>
                    <Button
                        variant="black"
                        size="lg"
                        onClick={() => router.push('/catalogo')}
                        className="inline-flex items-center space-x-2"
                    >
                        <ArrowLeft size={16} />
                        <span>Volver al Catálogo</span>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-5">
            {/* Header */}
            <Section
                id="product-header"
                className="bg-white border-b border-gray-100"
                contentClassName="max-w-7xl mx-auto"
                noPadding
            >
                <div className="py-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
                    >
                        <div className="mb-4 lg:mb-0">
                            {/* Breadcrumb */}
                            <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                                <Link
                                    href="/"
                                    className="hover:text-gray-900 transition-colors"
                                >
                                    Inicio
                                </Link>
                                <span>/</span>
                                <a
                                    href="/catalogo"
                                    className="hover:text-gray-900 transition-colors"
                                >
                                    Catálogo
                                </a>
                                {/* <span>/</span>
                                <span className="text-gray-900 font-medium">
                                    {product.categoriaIndumentaria}
                                </span> */}
                                <span>/</span>
                                <span className="text-gray-900 font-medium truncate max-w-xs">
                                    {product.nombre}
                                </span>
                            </nav>

                            {/* Badge de categoría */}
                            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 mb-2">
                                {product.categoriaIndumentaria}
                            </div>
                        </div>

                        {/* Acciones */}
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="grayOutline"
                                size="sm"
                                onClick={() => router.back()}
                                className="inline-flex items-center space-x-2"
                            >
                                <ArrowLeft size={16} />
                                <span>Volver</span>
                            </Button>

                            {/* <Button
                                variant="grayOutline"
                                size="md"
                                onClick={handleShare}
                                className="inline-flex items-center space-x-2"
                            >
                                <Share2 size={16} />
                                <span className="hidden sm:inline">Compartir</span>
                            </Button> */}
                        </div>
                    </motion.div>
                </div>
            </Section>

            {/* Contenido principal */}
            <Section
                id="product-content"
                className="py-8"
                contentClassName="max-w-7xl mx-auto"
                noPadding
            >
                <div className="grid lg:grid-cols-2 gap-12 mb-16">
                    {/* Galería de imágenes */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-4"
                    >
                        {/* Imagen principal */}
                        <div className="relative group">
                            <div className="aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden">
                                <Image
                                    src={product.imagenes[currentImageIndex]}
                                    alt={`${product.nombre} - Imagen ${currentImageIndex + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    width={600}
                                    height={600}
                                />

                                {/* Overlay con controles */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300">
                                    {/* Botón expandir */}
                                    <button
                                        onClick={() => setIsImageModalOpen(true)}
                                        className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white"
                                    >
                                        <Maximize2 size={16} className="text-gray-700" />
                                    </button>

                                    {/* Controles de navegación */}
                                    {product.imagenes.length > 1 && (
                                        <>
                                            <button
                                                onClick={prevImage}
                                                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white"
                                            >
                                                <ChevronLeft size={16} className="text-gray-700" />
                                            </button>
                                            <button
                                                onClick={nextImage}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white"
                                            >
                                                <ChevronRight size={16} className="text-gray-700" />
                                            </button>
                                        </>
                                    )}
                                </div>

                                {/* Badge de destacado */}
                                {product.destacado && (
                                    <div className="absolute top-4 left-4 flex items-center space-x-1 bg-yellow-500 text-white px-2 py-1 rounded-lg text-sm font-semibold">
                                        <Star size={12} fill="currentColor" />
                                        <span>DESTACADO</span>
                                    </div>
                                )}

                                {/* Indicador de imágenes */}
                                {product.imagenes.length > 1 && (
                                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                        {product.imagenes.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentImageIndex(index)}
                                                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentImageIndex
                                                        ? "bg-white w-6"
                                                        : "bg-white/50 hover:bg-white/75"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Thumbnails */}
                        {product.imagenes.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {product.imagenes.map((imagen, index) => (
                                    <motion.button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-all duration-300 ${index === currentImageIndex
                                                ? "border-gray-900 scale-95"
                                                : "border-transparent hover:border-gray-300"
                                            }`}
                                        whileHover={{ scale: 0.95 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <Image
                                            src={imagen}
                                            alt={`${product.nombre} - Thumbnail ${index + 1}`}
                                            className="w-full h-full object-cover"
                                            width={150}
                                            height={150}
                                        />
                                    </motion.button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Información del producto */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-6"
                    >
                        {/* Título y precio */}
                        <div>
                            <h1 className="text-3xl lg:text-3xl font-medium text-gray-900 mb-2 font-display leading-tight">
                                {product.nombre}
                            </h1>
                            <div className="flex items-center space-x-4 mb-4">
                                <span className="text-lg font-medium text-gray-500">
                                    {product.precio}
                                </span>
                                {product.destacado && (
                                    <span className="inline-flex items-center space-x-1 text-yellow-600 font-medium">
                                        <Star size={16} fill="currentColor" />
                                        <span>Producto Destacado</span>
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Descripción */}
                        <div className="bg-gray-50 rounded-lg">
                            <h3 className="text-md font-medium text-gray-900 mb-3">
                                Descripción
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                                {product.descripcion}
                            </p>
                        </div>

                        {/* Especificaciones */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-lg border border-gray-300">
                                <h4 className="font-medium text-gray-900 mb-2">
                                    Categoría
                                </h4>
                                <p className="text-gray-600">
                                    {product.categoriaIndumentaria}
                                </p>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-gray-300">
                                <h4 className="font-medium text-gray-900 mb-2">Código</h4>
                                <p className="text-gray-600">
                                    #{product.id.toString().padStart(4, "0")}
                                </p>
                            </div>
                        </div>

                        {/* Características destacadas */}
                        <div className="bg-white rounded-lg border border-gray-300 p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Características
                            </h3>
                            <ul className="space-y-2">
                                <li className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                                    <span className="text-gray-700">
                                        Bordado y estampado personalizable
                                    </span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                                    <span className="text-gray-700">
                                        Variedad de talles disponibles
                                    </span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                                    <span className="text-gray-700">
                                        Calidad premium garantizada
                                    </span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                                    <span className="text-gray-700">Diseño profesional</span>
                                </li>
                            </ul>
                        </div>

                        {/* Acciones */}
                        <div className="space-y-4">
                            <Button
                                variant="black"
                                size="lg"
                                onClick={() => openWhatsApp()}
                                className="w-full tracking-wide inline-flex items-center justify-center space-x-3 text-center"
                            >
                                <MessageCircle size={20} />
                                <span>SOLICITAR COTIZACIÓN</span>
                            </Button>

                            <div className="grid grid-cols-2 gap-4">
                                {/* <Button
                                    variant="grayOutline"
                                    size="md"
                                    className="inline-flex items-center justify-center space-x-2"
                                >
                                    <Heart size={16} />
                                    <span>Favoritos</span>
                                </Button> */}
                                {/* <Button
                                    variant="grayOutline"
                                    size="md"
                                    onClick={handleShare}
                                    className="inline-flex items-center justify-center space-x-2"
                                >
                                    <Share2 size={16} />
                                    <span>Compartir</span>
                                </Button> */}
                            </div>
                        </div>

                        {/* Información adicional */}
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <div className="flex items-center space-x-2 mb-2">
                                <Eye size={16} className="text-blue-600" />
                                <span className="font-medium text-blue-900">
                                    ¿Necesitás ver el producto en persona?
                                </span>
                            </div>
                            <p className="text-blue-700 text-sm">
                                Visitá nuestro showroom en Rivera Indarte 2143, Córdoba.
                                Coordiná tu cita previa por WhatsApp.
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Productos relacionados */}
                {relatedProducts.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="mt-16"
                    >
                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8 text-center">
                            Productos Relacionados
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((relatedProduct, index) => (
                                <motion.div
                                    key={relatedProduct.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="group cursor-pointer"
                                    onClick={() =>
                                        router.push(`/producto/${relatedProduct.id}`)
                                    }
                                >
                                    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden min-h-[450px]">
                                        <div className="aspect-square bg-gray-100 overflow-hidden">
                                            <Image
                                                src={relatedProduct.imagenes[0]}
                                                alt={relatedProduct.nombre}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                width={300}
                                                height={300}
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors">
                                                {relatedProduct.nombre}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-2">
                                                {relatedProduct.categoriaIndumentaria}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-gray-900">
                                                    {relatedProduct.precio}
                                                </span>
                                                {relatedProduct.destacado && (
                                                    <Star
                                                        size={16}
                                                        className="text-yellow-500"
                                                        fill="currentColor"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </Section>

            {/* Modal de imagen expandida */}
            <AnimatePresence>
                {isImageModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                        onClick={() => setIsImageModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="relative max-w-4xl max-h-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={product.imagenes[currentImageIndex]}
                                alt={`${product.nombre} - Imagen expandida`}
                                className="max-w-full max-h-full object-contain rounded-lg"
                                width={800}
                                height={800}
                            />

                            {/* Botón cerrar */}
                            <button
                                onClick={() => setIsImageModalOpen(false)}
                                className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                            >
                                <X size={20} />
                            </button>

                            {/* Controles de navegación en modal */}
                            {product.imagenes.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProductDetailPage;