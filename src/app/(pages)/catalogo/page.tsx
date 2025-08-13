"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Grid3X3 } from 'lucide-react';
import { useCatalogFilters } from '@/app/components/hooks/useCatalogFilters';
import { productos } from '@/app/data/productos';
import FilterControls from '@/app/components/FilterControls';
import ProductGrid from '@/app/components/ProductsGrid';
import Pagination from '@/app/components/Pagination';
import Button from '@/app/components/ui/Button';
import Section from '@/app/components/Section';
import Link from 'next/link';

const CatalogPage = () => {
    const {
        filters,
        updateFilter,
        clearFilters,
        paginatedProducts,
        currentPage,
        totalPages,
        goToPage,
        availableCategories,
        totalProducts,
        showingFrom,
        showingTo,
    } = useCatalogFilters({ productos, itemsPerPage: 12 });

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <section
                id="catalog-header"
                className="relative bg-gray-900 border-b border-gray-100 overflow-hidden h-120 flex items-end justify-between w-full"
            >
                {/* Imagen de fondo */}
                <div
                    className="absolute inset-0 bg-cover bg-top bg-no-repeat"
                    style={{ backgroundImage: "url('/imgs/Hero-3.jpg')" }}
                >
                    <div className="absolute inset-0 bg-black/50"></div>
                </div>

                <div className="py-16 relative z-10 w-full">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
                        >
                            {/* Acciones - Móvil: arriba, Desktop: derecha */}
                            <div className="flex flex-col-reverse lg:flex-col lg:order-2 mb-6 lg:mb-0">
                                <div className="flex items-start flex-col lg:items-end gap-4">
                                    <Button
                                        variant="lightWhiteOutline"
                                        size="md"
                                        onClick={() => window.history.back()}
                                        className="inline-flex items-center space-x-2"
                                    >
                                        <ArrowLeft size={16} />
                                        <span>Volver</span>
                                    </Button>
                                    <div className="flex sm:hidden items-center space-x-2 text-sm text-gray-300">
                                        <Grid3X3 size={16} />
                                        <span>{productos.length} productos disponibles</span>
                                    </div>
                                    <div className="hidden sm:flex lg:flex items-center space-x-2 text-sm text-gray-300">
                                        <Grid3X3 size={16} />
                                        <span>{productos.length} productos disponibles</span>
                                    </div>
                                </div>
                            </div>
                            {/* Contenido principal - Móvil: abajo, Desktop: izquierda */}
                            <div className="lg:order-1">
                                {/* Breadcrumb */}
                                <nav className="flex items-center space-x-2 text-sm text-gray-300 mb-4">
                                    <Link
                                        href="/"
                                        className="hover:text-white transition-colors"
                                    >
                                        Inicio
                                    </Link>
                                    <span>/</span>
                                    <span className="text-white font-medium">Catálogo</span>
                                </nav>
                                {/* Título principal */}
                                <div className="flex items-center space-x-4 mb-2">
                                    <div>
                                        <h1 className="text-4xl lg:text-5xl font-bold text-white font-display">
                                            Catálogo Completo
                                        </h1>
                                        <p className="text-lg text-gray-200 mt-1">
                                            Descubrí toda nuestra colección de uniformes y prendas
                                            profesionales
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Contenido principal */}
            <Section
                id="catalog-content"
                className=""
                contentClassName="max-w-7xl mx-auto px-4"
            >
                {/* Controles de filtro */}
                <FilterControls
                    filters={filters}
                    availableCategories={availableCategories}
                    totalProducts={totalProducts}
                    showingFrom={showingFrom}
                    showingTo={showingTo}
                    onUpdateFilter={updateFilter}
                    onClearFilters={clearFilters}
                />

                {/* Grid de productos */}
                <ProductGrid products={paginatedProducts} />

                {/* Paginación */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={goToPage}
                    showingFrom={showingFrom}
                    showingTo={showingTo}
                    totalProducts={totalProducts}
                />

                {/* Botón volver arriba */}
                {currentPage > 1 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="fixed bottom-6 right-6 z-40"
                    >
                        <Button
                            variant="black"
                            size="md"
                            onClick={scrollToTop}
                            className="rounded-full w-12 h-12 p-0 shadow-lg"
                        >
                            ↑
                        </Button>
                    </motion.div>
                )}
            </Section>

            {/* Call to Action */}
            <Section
                id="catalog-cta"
                className="bg-gray-900 text-white pb-20 px-4"
                contentClassName="max-w-4xl mx-auto text-center"
            >
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl lg:text-4xl font-bold mb-6 font-display">
                        ¿No encontrás lo que buscás?
                    </h2>
                    <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                        Diseñamos uniformes personalizados para tu empresa. Contactanos y
                        te asesoramos sin compromiso.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            variant="slateOutline"
                            size="lg"
                            className="tracking-wide inline-flex items-center space-x-3 text-center justify-center"
                        >
                            <Package size={20} />
                            <span>SOLICITAR COTIZACIÓN</span>
                        </Button>
                        <Button
                            variant="black"
                            size="lg"
                            className="tracking-wide uppercase"
                        >
                            Creá tu propio diseño
                        </Button>
                    </div>
                </motion.div>
            </Section>
        </div>
    );
};

export default CatalogPage;