'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileSpreadsheet, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { productsService } from '../services/productsService';
import { useProducts } from '../hooks/useProducts';

/**
 * Componente para cargar productos desde archivos CSV/Excel
 * Procesa los datos localmente y extrae enlaces de Drive/Docs
 */
const ProductFileUploader: React.FC = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [uploadedCount, setUploadedCount] = useState<number>(0);
    
    const { uploadProducts, isUploading: isUploadingHook } = useProducts();

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validar tipo de archivo
        const validTypes = [
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/csv',
            'application/csv'
        ];
        
        const validExtensions = ['.xls', '.xlsx', '.csv'];
        const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        
        if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
            setUploadStatus('error');
            setErrorMessage('Por favor, sube un archivo CSV o Excel (.csv, .xls, .xlsx)');
            return;
        }

        setIsUploading(true);
        setUploadStatus('idle');
        setErrorMessage(null);

        try {
            // Procesar el archivo (ya extrae enlaces automáticamente)
            const products = await productsService.parseProductsFile(file);
            
            // Guardar productos
            uploadProducts(file); // Esto guarda en localStorage
            
            setUploadedCount(products.length);
            setUploadStatus('success');
            
            // Resetear después de 3 segundos
            setTimeout(() => {
                setUploadStatus('idle');
            }, 3000);
        } catch (error: any) {
            console.error('Error al procesar archivo:', error);
            setUploadStatus('error');
            setErrorMessage(error.message || 'Error al procesar el archivo');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <div className="flex items-center space-x-3 mb-4">
                <FileSpreadsheet className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">
                    Cargar Productos desde Excel/CSV
                </h2>
            </div>

            <p className="text-sm text-gray-600 mb-6">
                Sube un archivo Excel o CSV con los productos. El sistema procesará los datos
                y extraerá automáticamente los enlaces a fotos, tablas de talles e indicaciones.
            </p>

            <div className="space-y-4">
                {/* Input de archivo */}
                <label className="block">
                    <input
                        type="file"
                        accept=".csv,.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        onChange={handleFileUpload}
                        disabled={isUploading || isUploadingHook}
                        className="hidden"
                        id="product-file-input"
                    />
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`
                            w-full p-8 border-2 border-dashed rounded-lg cursor-pointer
                            transition-all duration-200
                            ${isUploading || isUploadingHook
                                ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                                : uploadStatus === 'success'
                                ? 'border-green-500 bg-green-50'
                                : uploadStatus === 'error'
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-300 bg-gray-50 hover:border-blue-500 hover:bg-blue-50'
                            }
                        `}
                        onClick={() => {
                            if (!isUploading && !isUploadingHook) {
                                document.getElementById('product-file-input')?.click();
                            }
                        }}
                    >
                        <div className="flex flex-col items-center justify-center space-y-4">
                            {isUploading || isUploadingHook ? (
                                <>
                                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                                    <p className="text-gray-700 font-medium">
                                        Procesando archivo...
                                    </p>
                                </>
                            ) : uploadStatus === 'success' ? (
                                <>
                                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                                    <p className="text-green-700 font-medium">
                                        ¡{uploadedCount} productos cargados exitosamente!
                                    </p>
                                </>
                            ) : uploadStatus === 'error' ? (
                                <>
                                    <AlertCircle className="w-12 h-12 text-red-600" />
                                    <p className="text-red-700 font-medium">
                                        {errorMessage || 'Error al procesar el archivo'}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <Upload className="w-12 h-12 text-gray-400" />
                                    <div className="text-center">
                                        <p className="text-gray-700 font-medium mb-1">
                                            Haz clic para seleccionar archivo
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            CSV, XLS o XLSX (máx. 10MB)
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                </label>

                {/* Información adicional */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900 font-medium mb-2">
                        Columnas importantes:
                    </p>
                    <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
                        <li><strong>Codigo:</strong> Código único del producto</li>
                        <li><strong>Descripcion:</strong> Nombre/descripción del producto</li>
                        <li><strong>Costo x LM:</strong> Enlace a carpeta de Drive con fotos</li>
                        <li><strong>Ult. Actualizacion:</strong> Enlace a tabla de talles</li>
                        <li><strong>Lista Material:</strong> Enlace a indicaciones de bordados</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ProductFileUploader;

