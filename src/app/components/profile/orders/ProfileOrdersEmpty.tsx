'use client';

interface ProfileOrdersEmptyProps {
  message?: string;
  /** Sin caja propia cuando va dentro de un panel contenedor. */
  embedded?: boolean;
}

export function ProfileOrdersEmpty({
  message = 'Aún no tenés pedidos.',
  embedded = false,
}: ProfileOrdersEmptyProps) {
  return (
    <div
      className={
        embedded
          ? 'py-8 text-center'
          : 'bg-white rounded-lg border border-gray-200 p-8 text-center'
      }
    >
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  );
}
