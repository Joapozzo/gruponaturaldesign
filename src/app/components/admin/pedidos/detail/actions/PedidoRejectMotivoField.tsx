interface PedidoRejectMotivoFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function PedidoRejectMotivoField({ value, onChange }: PedidoRejectMotivoFieldProps) {
  return (
    <div>
      <label className="text-xs font-medium text-neutral-600">Motivo rechazo (opcional)</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="mt-1 w-full border border-neutral-300 rounded-md px-2 py-1.5 text-sm"
        placeholder="Ej: datos incompletos..."
      />
    </div>
  );
}
