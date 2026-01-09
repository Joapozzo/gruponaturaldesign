import { TableSkeleton } from '@/components/ui/TableSkeleton';

interface AdminTableSkeletonProps {
  rows?: number;
  columns?: number;
}

/**
 * Skeleton reutilizable para tablas admin
 */
export function AdminTableSkeleton({ rows = 20, columns = 12 }: AdminTableSkeletonProps) {
  return (
    <div className="mt-8">
      <TableSkeleton rows={rows} columns={columns} showPagination={true} />
    </div>
  );
}

