'use client';

import React from 'react';
import ProductFileUploader from '@/app/components/ProductFileUploader';
import Section from '@/app/components/Section';
import { useProducts } from '@/app/hooks/useProducts';
import { FileSpreadsheet, Download, Trash2 } from 'lucide-react';
import Button from '@/app/components/ui/Button';
import { productsService } from '@/app/services/productsService';

const AdminProductosPage = () => {
    const { allProducts, totalProducts, clearProducts, refetch } = useProducts();

    const handleClearProducts = () => {
        if (confirm('¿Estás seguro de que quieres eliminar todos los productos cargados?')) {
            clearProducts();
        }
    };

    const handleDownloadTemplate = () => {
        // Crear un template básico
        const template = {
            headers: [
                'Codigo',
                'Descripcion',
                'Rubro',
                'Subrubro',
                'Costo x LM',
                'Ult. Actualizacion',
                'Lista Material',
                'Precio Venta',
                'Material'
            ],
            example: [
                'L-OF-REM-GEN1',
                'Remera Gentle Dama NEGRO XS',
                'PRODUCTO OFFICE',
                'REMERA',
                'https://drive.google.com/drive/folders/19wXonPnKkfUz7mO_3mjCEjTDGn0uMpTA',
                'TABLAS DE TALLE CATALOGO SHOP ONLINE NTDS',
                'INDICACIONES PARA BORDADOS',
                '2148',
                'Jersey Peinado 30/1'
            ]
        };

        // Convertir a CSV
        const csv = [
            template.headers.join(','),
            template.example.join(',')
        ].join('\n');

        // Descargar
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'template-productos.csv';
        link.click();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Section
                id="admin-productos"
                className="py-12"
                contentClassName="max-w-6xl mx-auto"
            >
                <div className="space-y-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Administración de Productos
                            </h1>
                            <p className="text-gray-600">
                                Carga productos desde archivos Excel o CSV
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="grayOutline"
                                size="sm"
                                onClick={handleDownloadTemplate}
                                className="inline-flex items-center space-x-2"
                            >
                                <Download size={16} />
                                <span>Descargar Template</span>
                            </Button>
                            {totalProducts > 0 && (
                                <Button
                                    variant="redOutline"
                                    size="sm"
                                    onClick={handleClearProducts}
                                    className="inline-flex items-center space-x-2"
                                >
                                    <Trash2 size={16} />
                                    <span>Limpiar Productos</span>
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Estadísticas */}
                    {totalProducts > 0 && (
                        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <FileSpreadsheet className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Productos cargados</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {totalProducts} productos
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Componente de carga */}
                    <ProductFileUploader />

                    {/* Instrucciones */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h2 className="text-lg font-bold text-blue-900 mb-4">
                            Instrucciones
                        </h2>
                        <div className="space-y-3 text-sm text-blue-800">
                            <div>
                                <p className="font-semibold mb-1">1. Exporta tu Google Sheet:</p>
                                <p>Ve a tu Google Sheet y descarga como Excel (.xlsx) o CSV (.csv)</p>
                            </div>
                            <div>
                                <p className="font-semibold mb-1">2. Estructura del archivo:</p>
                                <ul className="list-disc list-inside space-y-1 ml-2">
                                    <li><strong>Hoja 1:</strong> Productos individuales con códigos y enlaces a Drive</li>
                                    <li><strong>Hoja 2:</strong> Productos agrupados por nombre (con descripciones)</li>
                                </ul>
                            </div>
                            <div>
                                <p className="font-semibold mb-1">3. Columnas importantes:</p>
                                <ul className="list-disc list-inside space-y-1 ml-2">
                                    <li><strong>Costo x LM:</strong> Enlace a carpeta de Drive con fotos del producto</li>
                                    <li><strong>Ult. Actualizacion:</strong> Enlace o texto que indica tabla de talles</li>
                                    <li><strong>Lista Material:</strong> Enlace o texto que indica indicaciones de bordados</li>
                                </ul>
                            </div>
                            <div>
                                <p className="font-semibold mb-1">4. Agrupamiento:</p>
                                <p>Los productos se agrupan automáticamente por nombre base (sin talle/color)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>
        </div>
    );
};

export default AdminProductosPage;

