interface PedidoDetailObservacionesSectionProps {
  observaciones: string;
}

export function PedidoDetailObservacionesSection({
  observaciones,
}: PedidoDetailObservacionesSectionProps) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-neutral-900 mb-1">Observaciones</h3>
      <p className="text-sm text-neutral-700 whitespace-pre-wrap">{observaciones}</p>
    </section>
  );
}
