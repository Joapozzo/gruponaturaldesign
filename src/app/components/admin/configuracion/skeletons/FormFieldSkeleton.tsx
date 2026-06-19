export function FormFieldSkeleton({ hint = false }: { hint?: boolean }) {
  return (
    <div className="grid gap-2">
      <div className="h-4 w-28 rounded bg-gray-200 animate-pulse" />
      <div className="h-10 w-full rounded-lg bg-gray-200 animate-pulse" />
      {hint ? <div className="h-3 w-3/4 rounded bg-gray-100 animate-pulse" /> : null}
    </div>
  );
}
