import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { FormFieldSkeleton } from './FormFieldSkeleton';

export function DatosBancariosTabSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-5 w-56 rounded bg-gray-200 animate-pulse" />
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="h-4 w-full max-w-xl rounded bg-gray-100 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="h-4 w-32 rounded bg-gray-200 animate-pulse" />
            <FormFieldSkeleton />
            <FormFieldSkeleton />
            <FormFieldSkeleton />
            <FormFieldSkeleton />
            <FormFieldSkeleton />
          </div>
          <div className="space-y-4 flex flex-col">
            <div className="h-4 w-40 rounded bg-gray-200 animate-pulse" />
            <FormFieldSkeleton />
            <FormFieldSkeleton />
            <FormFieldSkeleton />
            <div className="flex justify-end pt-2 mt-auto">
              <div className="h-10 w-44 rounded-lg bg-gray-200 animate-pulse" />
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
