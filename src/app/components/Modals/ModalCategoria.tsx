import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

export interface Producto {
    nombre: string;
    imagen: string;
}

export interface Categoria {
    nombre: string;
    productos: Producto[];
}

interface ModalCategoriaProps {
    selectedCategory: Categoria | null;
    onClose: () => void;
}

const ModalCategoria: React.FC<ModalCategoriaProps> = ({ selectedCategory, onClose }) => {
    return (
        <AnimatePresence>
            {selectedCategory && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-3xl font-bold text-[var(--black)]">
                                    {selectedCategory.nombre}
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="text-[var(--gray-medium)] hover:text-[var(--red)] transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {selectedCategory.productos.map((producto, idx) => (
                                    <div key={idx} className="group cursor-pointer">
                                        <div className="relative overflow-hidden bg-gray-100 rounded-lg mb-4">
                                            <Image
                                                src={producto.imagen}
                                                alt={producto.nombre}
                                                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                                                width={300}
                                                height={300}
                                            />
                                        </div>
                                        <h4 className="font-semibold text-[var(--black)] text-center">
                                            {producto.nombre}
                                        </h4>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ModalCategoria;
