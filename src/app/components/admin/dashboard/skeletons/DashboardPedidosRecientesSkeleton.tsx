export function DashboardPedidosRecientesSkeleton() {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-5">
      <div className="h-4 bg-neutral-200 rounded animate-pulse w-36 mb-4" />
      <table className="w-full">
        <thead>
          <tr className="border-b border-neutral-100">
            <th className="pb-2 text-left"><div className="h-3 bg-neutral-200 rounded animate-pulse w-8" /></th>
            <th className="pb-2 text-left"><div className="h-3 bg-neutral-200 rounded animate-pulse w-24" /></th>
            <th className="pb-2 text-left"><div className="h-3 bg-neutral-200 rounded animate-pulse w-16" /></th>
            <th className="pb-2 text-left"><div className="h-3 bg-neutral-200 rounded animate-pulse w-20" /></th>
            <th className="pb-2 text-left"><div className="h-3 bg-neutral-200 rounded animate-pulse w-24" /></th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5].map((i) => (
            <tr key={i} className="border-b border-neutral-50 last:border-0">
              <td className="py-2"><div className="h-3 bg-neutral-200 rounded animate-pulse w-8" /></td>
              <td className="py-2"><div className="h-3 bg-neutral-200 rounded animate-pulse w-28" /></td>
              <td className="py-2"><div className="h-3 bg-neutral-200 rounded animate-pulse w-14" /></td>
              <td className="py-2"><div className="h-3 bg-neutral-100 rounded animate-pulse w-10" /></td>
              <td className="py-2"><div className="h-3 bg-neutral-100 rounded animate-pulse w-20" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
