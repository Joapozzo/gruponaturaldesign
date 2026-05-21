import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { FormFieldSkeleton } from './FormFieldSkeleton';

export function PreciosTabSkeleton() {
  return (
    <>
      <Card>
        <CardHeader>
          <div className="h-5 w-40 rounded bg-gray-200 animate-pulse" />
        </CardHeader>
        <CardBody className="space-y-4">
          <FormFieldSkeleton hint />
          <FormFieldSkeleton hint />
          <FormFieldSkeleton hint />
          <div className="flex flex-wrap gap-2 pt-4">
            <div className="h-10 w-28 rounded-lg bg-gray-200 animate-pulse" />
            <div className="h-10 w-36 rounded-lg bg-gray-200 animate-pulse" />
            <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
          </div>
        </CardBody>
      </Card>
      <Card className="mt-6">
        <CardHeader>
          <div className="h-5 w-24 rounded bg-gray-200 animate-pulse" />
        </CardHeader>
        <CardBody className="space-y-2">
          <div className="h-4 w-48 rounded bg-gray-100 animate-pulse" />
          <div className="h-4 w-56 rounded bg-gray-100 animate-pulse" />
        </CardBody>
      </Card>
    </>
  );
}
