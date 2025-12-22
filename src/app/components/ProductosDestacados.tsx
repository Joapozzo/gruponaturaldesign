'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Section from './Section';
import Button from './ui/Button';
import { useRouter } from 'next/navigation';
import { useProductsV2 } from '../hooks/useProductsV2';
import ProductCardGrouped from './ProductCardGrouped';
import { GroupedProduct, ProductVariant, ProductWithImage } from '../types/producto';
import { GroupedProductV2 } from '../types/producto-v2';

const ProductosDestacados = () => {
    const router = useRouter();
    const [expandedSku, setExpandedSku] = useState<string | null>(null);
    const swiperRef = useRef<SwiperType | null>(null);
    const currentSlideIndexRef = useRef<number>(0);
    const prevButtonRef = useRef<HTMLButtonElement>(null);
    const nextButtonRef = useRef<HTMLButtonElement>(null);
    
    // Usar la misma fuente de datos que ProductsGrid (productos V2 del CSV)
    const { products: productsV2, isLoading } = useProductsV2();
    
    /**
     * Adapta GroupedProductV2 a GroupedProduct para compatibilidad con ProductCardGrouped
     * Misma lógica que ProductsGrid
     */
    const adaptGroupedProductV2ToGroupedProduct = (groupV2: GroupedProductV2): GroupedProduct => {
        // Adaptar displayProduct
        const displayProduct: ProductWithImage = {
            Codigo: groupV2.displayProduct.codigo,
            Tipo: null,
            Descripcion: groupV2.displayProduct.item,
            UM: null,
            Rubro: groupV2.displayProduct.rubro,
            Subrubro: groupV2.displayProduct.subrubro,
            Activo: true,
            Moneda: null,
            PrecioCosto: null,
            UltActualizacion: null,
            CostoXLM: null,
            ListaMaterial: null,
            PrecioUMCompra: null,
            UMCompra: null,
            PrecioVenta: groupV2.displayProduct.precioLista,
            UtilidadP: null,
            UtilidadR: null,
            Base: null,
            Barcode: null,
            EqCodigoContable: null,
            EqCodigoExterno: null,
            ItemDeCompra: null,
            ItemDeVenta: true,
            ItemDeAlquiler: null,
            Fabricar: null,
            APedido: null,
            GrupoGasto: null,
            CTACompras: null,
            CTAVentas: null,
            StockMin: null,
            StockMax: null,
            PesoBruto: null,
            DescripcionCorta: groupV2.displayProduct.nombreBase,
            Observaciones: null,
            ProveedorPorDefecto: null,
            DepositoConsumo: null,
            Ubicacion: null,
            ItemLote: null,
            ItemSerie: null,
            Clase: null,
            Linea: null,
            Material: null,
            ActPrecioXOC: null,
            FlowintSincroEnabled: null,
            Usuario: null,
            FechaAlta: null,
            // Campos extendidos - IMPORTANTE: usar las imágenes del V2
            imagen: groupV2.displayProduct.imagen || null,
            imagenes: groupV2.displayProduct.imagenes || [],
            tablaTallesImage: groupV2.displayProduct.tablaTallesImage || null,
            indicacionesBordadosUrl: groupV2.displayProduct.indicacionesBordadosImage || null,
            NOMBRE: groupV2.displayProduct.nombreBase,
            // Campos de precios adicionales del CSV
            precioTransfer: groupV2.displayProduct.precioTransfer,
            precio3cuotas: groupV2.displayProduct.precio3cuotas,
            precioSImp: groupV2.displayProduct.precioSImp,
            descripcionCompleta: groupV2.displayProduct.descripcion,
            textiles: groupV2.displayProduct.textiles,
        };

        // Adaptar variantes - cada variante tiene su propio producto con su descripción
        const variants: ProductVariant[] = groupV2.variants.map(v => {
            // Crear un ProductWithImage específico para esta variante con su descripción
            const variantProduct: ProductWithImage = {
                ...displayProduct,
                // Usar la descripción del producto de la variante (v.producto.item)
                Descripcion: v.producto.item || displayProduct.Descripcion,
                // Usar el precio de la variante
                PrecioVenta: v.precioLista || displayProduct.PrecioVenta,
                // Usar las imágenes específicas de esta variante si las tiene
                imagenes: v.producto.imagenes || displayProduct.imagenes,
                imagen: v.producto.imagen || displayProduct.imagen,
                // Mantener los nuevos campos de precios y descripción (con fallback al displayProduct)
                precioTransfer: v.producto.precioTransfer || displayProduct.precioTransfer,
                precio3cuotas: v.producto.precio3cuotas || displayProduct.precio3cuotas,
                precioSImp: v.producto.precioSImp || displayProduct.precioSImp,
                descripcionCompleta: v.producto.descripcion || displayProduct.descripcionCompleta,
                textiles: v.producto.textiles || displayProduct.textiles,
            };
            
            return {
                codigo: v.codigo,
                variantNumber: 0, // No tenemos número de variante en V2
                talle: v.talle,
                color: v.color,
                stock: v.stock,
                producto: variantProduct,
            };
        });

        return {
            skuBase: groupV2.skuBase,
            skuBaseSlug: groupV2.skuBaseSlug,
            displayProduct,
            variants,
            totalVariants: groupV2.totalVariants,
            availableColors: groupV2.availableColors,
            availableSizes: groupV2.availableSizes,
        };
    };

    // Adaptar productos V2 a formato compatible (misma lógica que ProductsGrid)
    const groupedProducts = productsV2.map(adaptGroupedProductV2ToGroupedProduct);

    // Mostrar todos los productos en el slider
    const productDestacados = groupedProducts;


    // Pausar/reanudar autoplay cuando un producto está expandido
    useEffect(() => {
        if (swiperRef.current) {
            if (expandedSku) {
                // Guardar el índice del slide actual
                currentSlideIndexRef.current = swiperRef.current.activeIndex;
                
                // Detener el autoplay de manera agresiva
                if (swiperRef.current.autoplay) {
                    swiperRef.current.autoplay.stop();
                    // Limpiar el timer del autoplay
                    if (swiperRef.current.autoplay.running) {
                        swiperRef.current.autoplay.stop();
                    }
                }
                
                // Bloquear completamente el movimiento táctil, pero mantener las flechas funcionales
                swiperRef.current.allowTouchMove = false;
                
                // Forzar que se mantenga en el slide actual
                swiperRef.current.slideTo(currentSlideIndexRef.current, 0);
            } else {
                // Si no hay productos expandidos, reanudar el autoplay
                if (swiperRef.current.autoplay) {
                    swiperRef.current.autoplay.start();
                }
                // Permitir el movimiento del slider
                swiperRef.current.allowTouchMove = true;
            }
        }
        
        // Actualizar estado visual de los botones de navegación
        if (prevButtonRef.current && nextButtonRef.current) {
            if (expandedSku) {
                prevButtonRef.current.disabled = true;
                nextButtonRef.current.disabled = true;
            } else {
                prevButtonRef.current.disabled = false;
                nextButtonRef.current.disabled = false;
            }
        }
    }, [expandedSku]);


    const goToPage = () => {
        router.push(`/shoponline`);
    };

    // Mostrar loading o estado vacío
    if (isLoading) {
        return (
            <Section
                id="productos"
                className="bg-gray-50"
                title='Productos destacados'
                subtitle='Lo mejor de nuestro shop online en diseño, calidad y funcionalidad.'
                contentClassName='max-w-7xl mx-auto px-10'
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="bg-gray-200 rounded-lg h-[550px] w-full"></div>
                        </div>
                    ))}
                </div>
            </Section>
        );
    }

    if (productDestacados.length === 0) {
        return (
            <Section
                id="productos"
                className="bg-gray-50"
                title='Productos destacados'
                subtitle='Lo mejor de nuestro shop online en diseño, calidad y funcionalidad.'
                contentClassName='max-w-7xl mx-auto px-10'
            >
                <div className="text-center py-20 text-gray-500">
                    No hay productos disponibles
                </div>
            </Section>
        );
    }

    return (
        <Section
            id="productos"
            className="bg-gray-50"
            title='Productos destacados'
            subtitle='Lo mejor de nuestro shop online en diseño, calidad y funcionalidad.'
            contentClassName='max-w-7xl mx-auto px-10'
        >
            {/* Slider de productos */}
            <div className="">
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={16}
                    slidesPerView={1}
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                        currentSlideIndexRef.current = swiper.activeIndex;
                    }}
                    onSlideChange={(swiper) => {
                        if (!expandedSku) {
                            currentSlideIndexRef.current = swiper.activeIndex;
                        }
                    }}
                    allowTouchMove={!expandedSku}
                    navigation={{
                        nextEl: '#swiper-button-next-destacados',
                        prevEl: '#swiper-button-prev-destacados',
                    }}
                    pagination={{
                        clickable: true,
                        dynamicBullets: true,
                    }}
                    autoplay={expandedSku ? false : {
                        delay: 4000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    loop={productDestacados.length > 4}
                    loopAdditionalSlides={productDestacados.length > 4 ? 3 : 0}
                    breakpoints={{
                        320: {
                            slidesPerView: 1.5,
                            spaceBetween: 12,
                        },
                        480: {
                            slidesPerView: 2,
                            spaceBetween: 12,
                        },
                        640: {
                            slidesPerView: 2.5,
                            spaceBetween: 14,
                        },
                        768: {
                            slidesPerView: 3,
                            spaceBetween: 16,
                        },
                        1024: {
                            slidesPerView: 4,
                            spaceBetween: 12,
                        },
                        1280: {
                            slidesPerView: 5,
                            spaceBetween: 14,
                        },
                    }}
                    className="pb-12"
                >
                    {productDestacados.map((group, index) => (
                        <SwiperSlide key={group.skuBase} className="mb-5">
                            <ProductCardGrouped 
                                group={group} 
                                index={index}
                                expandedSku={expandedSku}
                                onExpandChange={setExpandedSku}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Navegación personalizada - debajo del Swiper */}
                <div className="flex justify-center items-center space-x-3 mt-4">
                    <button 
                        ref={prevButtonRef}
                        id="swiper-button-prev-destacados"
                        onClick={() => swiperRef.current?.slidePrev()}
                        className="swiper-button-prev-custom w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Anterior"
                    >
                        <ArrowRight className="w-3.5 h-3.5 text-gray-700 rotate-180 group-hover:text-gray-900" />
                    </button>
                    <button 
                        ref={nextButtonRef}
                        id="swiper-button-next-destacados"
                        onClick={() => swiperRef.current?.slideNext()}
                        className="swiper-button-next-custom w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Siguiente"
                    >
                        <ArrowRight className="w-3.5 h-3.5 text-gray-700 group-hover:text-gray-900" />
                    </button>
                </div>

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="text-center mt-10"
                >
                    <Button
                        variant="black"
                        size="sm"
                        className="tracking-wide inline-flex items-center space-x-2 text-xs"
                        onClick={goToPage}
                    >
                        <span>VER SHOP COMPLETO</span>
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </motion.div>
            </div>
        </Section>
    );
};

export default ProductosDestacados;