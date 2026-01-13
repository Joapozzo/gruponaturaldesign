import React from 'react';
import { TableColumn } from '@/components/ui/Table';
import type { ProductoPadreConVariantes } from '@/app/types/producto.types';
import { CheckSquare, Square, Edit, Eye, EyeOff, Star, StarOff, Loader2 } from 'lucide-react';

interface GetProductosColumnsParams {
  selectedIds: Set<number>;
  onToggleSelect: (id: number) => void;
  onToggleSelectAll: () => void;
  onEdit: (producto: ProductoPadreConVariantes) => void;
  onTogglePublicado: (producto: ProductoPadreConVariantes) => void;
  onToggleDestacado: (producto: ProductoPadreConVariantes) => void;
  isUpdatingDestacado: boolean;
  isUpdatingPublicado: boolean;
  productosCount: number;
}

/**
 * Genera las columnas de la tabla de productos
 */
export function getProductosColumns({
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onEdit,
  onTogglePublicado,
  onToggleDestacado,
  isUpdatingDestacado,
  isUpdatingPublicado,
  productosCount,
}: GetProductosColumnsParams): TableColumn<ProductoPadreConVariantes & { variante?: import('@/app/types/producto.types').ProductoWebResponse }>[] {
  return [
    {
      id: 'select',
      header: () => (
        <button
          onClick={onToggleSelectAll}
          className="flex items-center justify-center"
          title="Seleccionar todos"
        >
          {selectedIds.size === productosCount && productosCount > 0 ? (
            <CheckSquare className="w-5 h-5 text-black" />
          ) : (
            <Square className="w-5 h-5 text-gray-400" />
          )}
        </button>
      ),
      cell: ({ row }) => {
        const productoPadre = row.original as ProductoPadreConVariantes;
        const isSelected = selectedIds.has(productoPadre.id);
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSelect(productoPadre.id);
            }}
            className="flex items-center justify-center"
          >
            {isSelected ? (
              <CheckSquare className="w-5 h-5 text-black" />
            ) : (
              <Square className="w-5 h-5 text-gray-400" />
            )}
          </button>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: 'sfactoryCodigo',
      header: 'Código SKU',
      cell: ({ row }) => (
        <div>
          <span className="font-mono text-sm font-semibold">
            {row.original.variante?.sfactoryCodigo || row.original.codigoAgrupacion}
          </span>
          {row.original.variante && (
            <div className="text-xs text-neutral-500 mt-0.5">
              Agrupación: {row.original.codigoAgrupacion}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'nombre',
      header: 'Nombre',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.nombre}</div>
          {row.original.descripcionCorta && (
            <div className="text-xs text-neutral-500 mt-1">
              {row.original.descripcionCorta}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'rubro',
      header: 'Rubro',
      cell: ({ row }) => (
        <span className="text-sm">
          {row.original.rubro?.nombre || '-'}
        </span>
      ),
    },
    {
      accessorKey: 'subrubro',
      header: 'Subrubro',
      cell: ({ row }) => (
        <span className="text-sm">
          {row.original.subrubro?.nombre || '-'}
        </span>
      ),
    },
    {
      accessorKey: 'sexo',
      header: 'Sexo',
      cell: ({ row }) => (
        <span className="text-sm">
          {row.original.variante?.sexo || '-'}
        </span>
      ),
    },
    {
      accessorKey: 'color',
      header: 'Color',
      cell: ({ row }) => (
        <span className="text-sm">
          {row.original.variante?.color || '-'}
        </span>
      ),
    },
    {
      accessorKey: 'talle',
      header: 'Talle',
      cell: ({ row }) => (
        <span className="text-sm">
          {row.original.variante?.talle || '-'}
        </span>
      ),
    },
    {
      accessorKey: 'stock',
      header: 'Stock',
      cell: ({ row }) => {
        const stock = row.original.variante?.stockCache;
        return (
          <span
            className={`text-sm font-medium ${
              stock === null || stock === undefined
                ? 'text-neutral-400'
                : stock > 0
                ? 'text-green-600'
                : 'text-red-600'
            }`}
          >
            {stock !== null && stock !== undefined ? stock : '-'}
          </span>
        );
      },
    },
    {
      accessorKey: 'publicado',
      header: 'Estado',
      cell: ({ row }) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.original.publicado
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {row.original.publicado ? 'Publicado' : 'No publicado'}
        </span>
      ),
    },
    {
      accessorKey: 'destacado',
      header: 'Destacado',
      cell: ({ row }) => {
        const productoPadre = row.original as ProductoPadreConVariantes;
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleDestacado(productoPadre);
            }}
            disabled={isUpdatingDestacado}
            className="flex items-center justify-center"
          >
            {isUpdatingDestacado ? (
              <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
            ) : productoPadre.destacado ? (
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            ) : (
              <StarOff className="w-5 h-5 text-neutral-400" />
            )}
          </button>
        );
      },
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const productoPadre = row.original as ProductoPadreConVariantes;
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(productoPadre);
              }}
              className="p-1.5 text-neutral-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="Editar"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTogglePublicado(productoPadre);
              }}
              disabled={isUpdatingPublicado}
              className={`p-1.5 rounded transition-colors disabled:opacity-50 ${
                productoPadre.publicado
                  ? 'text-neutral-600 hover:text-orange-600 hover:bg-orange-50'
                  : 'text-neutral-600 hover:text-green-600 hover:bg-green-50'
              }`}
              title={productoPadre.publicado ? 'Despublicar' : 'Publicar'}
            >
              {isUpdatingPublicado ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : productoPadre.publicado ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        );
      },
    },
  ];
}

