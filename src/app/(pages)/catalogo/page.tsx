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
        <div className="min-h-screen bg-gray-50 px-5">
            {/* Header */}
            <Section
                id="catalog-header"
                className="bg-white border-b border-gray-100"
                contentClassName="max-w-7xl mx-auto"
                noPadding
            >
                <div className="py-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
                    >
                        <div className="mb-6 lg:mb-0">
                            {/* Breadcrumb */}
                            <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                                <Link href="/" className="hover:text-gray-900 transition-colors">
                                    Inicio
                                </Link>
                                <span>/</span>
                                <span className="text-gray-900 font-medium">Catálogo</span>
                            </nav>

                            {/* Título principal */}
                            <div className="flex items-center space-x-4 mb-2">
                                {/* <div className="p-3 bg-gray-100 rounded-lg">
                                    <Package className="w-6 h-6 text-gray-700" />
                                </div> */}
                                <div>
                                    <h1 className="text-4xl font-bold text-gray-900 font-display">
                                        Catálogo Completo
                                    </h1>
                                    <p className="text-lg text-gray-600 mt-1">
                                        Descubrí toda nuestra colección de uniformes y prendas profesionales
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Acciones */}
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="grayOutline"
                                size="md"
                                onClick={() => window.history.back()}
                                className="inline-flex items-center space-x-2"
                            >
                                <ArrowLeft size={16} />
                                <span>Volver</span>
                            </Button>

                            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                                <Grid3X3 size={16} />
                                <span>{productos.length} productos disponibles</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Estadísticas rápidas */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
                    >
                        {availableCategories.map((category, index) => {
                            const categoryCount = productos.filter(p => p.categoriaIndumentaria === category).length;
                            return (
                                <motion.div
                                    key={category}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4, delay: 0.3 + (index * 0.1) }}
                                    className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                    onClick={() => updateFilter('selectedCategory', category)}
                                >
                                    <div className="text-2xl font-bold text-gray-900">{categoryCount}</div>
                                    <div className="text-sm text-gray-600 font-medium">{category}</div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </Section>

            {/* Contenido principal */}
            <Section
                id="catalog-content"
                className=""
                contentClassName="max-w-7xl mx-auto"
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
                className="bg-gray-900 text-white pb-20"
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
                        Diseñamos uniformes personalizados para tu empresa. Contactanos y te asesoramos sin compromiso.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            variant="slateOutline"
                            size="lg"
                            className="tracking-wide inline-flex items-center space-x-3"
                        >
                            <Package size={20} />
                            <span>SOLICITAR COTIZACIÓN</span>
                        </Button>
                        <Button
                            variant="black"
                            size="lg"
                            className="tracking-wide"
                        >
                            VER DISEÑOS PERSONALIZADOS
                        </Button>
                    </div>
                </motion.div>
            </Section>
        </div>
    );
};

export default CatalogPage;