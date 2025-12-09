'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  breadcrumbs?: Breadcrumb[];
}

export default function PageHeader({
  title,
  description,
  action,
  breadcrumbs,
}: PageHeaderProps) {
  return (
    <div className="space-y-4 pb-6 border-b border-neutral-200">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2 text-sm text-neutral-600">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              )}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="hover:text-neutral-900 transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-neutral-900 font-medium">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Title and Action */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">{title}</h1>
          {description && (
            <p className="text-neutral-600 text-base">{description}</p>
          )}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  );
}
