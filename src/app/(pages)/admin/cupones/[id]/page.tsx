import { CuponForm } from '@/app/components/admin/cupones/CuponForm';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarCuponPage({ params }: PageProps) {
  const { id } = await params;
  return <CuponForm cuponId={parseInt(id, 10)} />;
}