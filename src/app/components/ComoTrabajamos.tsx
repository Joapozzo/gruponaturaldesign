'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Section from './Section';
import { workProcessFaqs } from '../data/faqs';

interface WorkProcessCardProps {
    item: (typeof workProcessFaqs)[0];
    index: number;
}

const WorkProcessCard: React.FC<WorkProcessCardProps> = ({ item, index }) => {
    const Icon = item.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group"
        >
            <div className="h-full border border-gray-200/80 bg-white/80 p-6 lg:p-8 transition-all duration-300 hover:border-gray-300 hover:bg-white hover:shadow-sm">
                <div className="flex items-center justify-center w-12 h-12 bg-red-50 text-red-600 mb-5 transition-colors duration-300 group-hover:bg-red-100">
                    <Icon className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    {item.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    {item.content}
                </p>
            </div>
        </motion.div>
    );
};

const ComoTrabajamos: React.FC = () => {
    return (
        <Section
            id="como-trabajamos"
            background="gray"
            title="CÓMO TRABAJAMOS"
            subtitle="Nuestro proceso integral te acompaña desde el diseño hasta la entrega final."
            contentClassName="w-full px-4 lg:px-15 pb-20"
        >
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
            >
                {workProcessFaqs.map((item, index) => (
                    <WorkProcessCard key={index} item={item} index={index} />
                ))}
            </motion.div>
        </Section>
    );
};

export default ComoTrabajamos;
