'use client';

import { BRAND_NAME } from '@/app/utils/constants';
import Image from 'next/image';
import { motion } from 'framer-motion';
import React from 'react';

interface AuthShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const containerVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' as const },
  },
};

export function AuthShell({ children, title, subtitle }: AuthShellProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-white md:p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md md:bg-white md:rounded-2xl md:shadow-sm md:border md:border-gray-100 md:p-8 p-6 bg-transparent"
      >
        <div className="flex justify-center mb-6">
          <Image
            src="/logos/logo-1.svg"
            alt={BRAND_NAME}
            width={160}
            height={48}
            priority
            className="h-10 w-auto"
          />
        </div>
        {(title || subtitle) && (
          <div className="text-center mb-6">
            {title && (
              <h1 className="text-xl font-bold text-gray-900 mb-1">{title}</h1>
            )}
            {subtitle && (
              <p className="text-sm text-gray-600">{subtitle}</p>
            )}
          </div>
        )}
        {children}
      </motion.div>
    </div>
  );
}
