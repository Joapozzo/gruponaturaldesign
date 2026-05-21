'use client';

interface NewsletterCheckoutOptInProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function NewsletterCheckoutOptIn({
  checked,
  onChange,
}: NewsletterCheckoutOptInProps) {
  return (
    <label className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-black"
      />
      <span>Quiero recibir novedades y ofertas</span>
    </label>
  );
}
