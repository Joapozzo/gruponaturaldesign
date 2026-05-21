'use client';

import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAdminSearch } from '@/app/hooks/useAdminSearch';
import type { AdminSearchResult } from '@/app/types/admin-search.types';

interface AdminSearchDropdownProps {
  query: string;
  open: boolean;
  onClose: () => void;
  onSelect?: () => void;
  className?: string;
}

function ResultRow({
  item,
  onClick,
}: {
  item: AdminSearchResult;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left px-4 py-3 hover:bg-neutral-50 transition-colors border-b border-neutral-100 last:border-b-0"
    >
      <p className="text-sm font-medium text-neutral-900 line-clamp-2">{item.label}</p>
      {item.meta ? (
        <p className="text-xs text-neutral-500 mt-0.5">{item.meta}</p>
      ) : null}
    </button>
  );
}

export function AdminSearchDropdown({
  query,
  open,
  onClose,
  onSelect,
  className,
}: AdminSearchDropdownProps) {
  const router = useRouter();
  const { data: results = [], isLoading, isFetching, isError } = useAdminSearch(query, open);
  const trimmed = query.trim();
  const showPanel = open && trimmed.length >= 2;

  const handleSelect = (item: AdminSearchResult) => {
    onClose();
    onSelect?.();
    router.push(item.href);
  };

  if (!showPanel) return null;

  return (
    <div
      className={cn(
        'absolute left-0 right-0 top-full mt-1 bg-white rounded-lg border border-neutral-200 shadow-lg z-50 overflow-hidden',
        className
      )}
      role="listbox"
    >
      {isLoading || isFetching ? (
        <p className="px-4 py-6 text-center text-sm text-neutral-500">Buscando...</p>
      ) : isError ? (
        <p className="px-4 py-6 text-center text-sm text-red-600">
          No se pudo completar la búsqueda
        </p>
      ) : results.length > 0 ? (
        <ul className="max-h-80 overflow-y-auto">
          {results.map((item) => (
            <li key={item.id}>
              <ResultRow item={item} onClick={() => handleSelect(item)} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-4 py-6 text-center text-sm text-neutral-500">
          Sin resultados para &quot;{trimmed}&quot;
        </p>
      )}
    </div>
  );
}
