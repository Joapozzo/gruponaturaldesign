'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  showPagination?: boolean;
  className?: string;
}

export function TableSkeleton({ 
  rows = 5, 
  columns = 8, 
  showPagination = true,
  className 
}: TableSkeletonProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          {/* Header skeleton */}
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <th
                  key={`header-${colIndex}`}
                  className="px-4 py-3 text-left"
                >
                  <div className="h-4 bg-neutral-200 rounded animate-pulse w-24" />
                </th>
              ))}
            </tr>
          </thead>

          {/* Rows skeleton */}
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr
                key={`row-${rowIndex}`}
                className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
              >
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td
                    key={`cell-${rowIndex}-${colIndex}`}
                    className="px-4 py-3"
                  >
                    <div
                      className={cn(
                        'h-4 bg-neutral-200 rounded animate-pulse',
                        // Variar el ancho de las celdas para un look más realista
                        colIndex === 0 && 'w-12',
                        colIndex === 1 && 'w-20',
                        colIndex === 2 && 'w-32',
                        colIndex === 3 && 'w-24',
                        colIndex === 4 && 'w-16',
                        colIndex >= 5 && 'w-full max-w-24'
                      )}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination skeleton */}
      {showPagination && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-200 bg-neutral-50">
          <div className="flex items-center gap-4">
            <div className="h-4 w-48 bg-neutral-200 rounded animate-pulse" />
            <div className="h-8 w-24 bg-neutral-200 rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-neutral-200 rounded animate-pulse" />
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={`page-${i}`} className="h-8 w-8 bg-neutral-200 rounded animate-pulse" />
              ))}
            </div>
            <div className="h-8 w-8 bg-neutral-200 rounded animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
}

