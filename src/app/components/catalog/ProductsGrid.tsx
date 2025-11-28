import React from 'react';
import { motion } from 'framer-motion';
import { GroupedProduct } from '@/app/types/producto';
import ProductCardGrouped from '@/app/components/ProductCardGrouped';

interface ProductsGridProps {
    products: GroupedProduct[];
    expandedSku: string | null;
    onExpandChange: (sku: string | null) => void;
}

const ProductsGrid: React.FC<ProductsGridProps> = ({
    products,
    expandedSku,
    onExpandChange,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-6 items-start"
        >
            {products.map((group, index) => (
                <ProductCardGrouped
                    key={group.skuBase}
                    group={group}
                    index={index}
                    expandedSku={expandedSku}
                    onExpandChange={onExpandChange}
                />
            ))}
        </motion.div>
    );
};

export default ProductsGrid;

