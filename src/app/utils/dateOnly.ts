export const AR_TIMEZONE = 'America/Argentina/Cordoba';

/** Fecha de hoy (YYYY-MM-DD) en Argentina. */
export function todayDateOnlyAR(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: AR_TIMEZONE }).format(now);
}

/** Formatea un ISO de fecha-only (medianoche UTC) como dd/m/yyyy sin corrimiento horario. */
export function formatDateOnlyEsAR(iso: string | null | undefined, emptyLabel = 'Sin límite'): string {
  if (!iso) return emptyLabel;
  const dateOnly = iso.split('T')[0];
  const [y, m, d] = dateOnly.split('-');
  if (!y || !m || !d) return emptyLabel;
  return `${parseInt(d, 10)}/${parseInt(m, 10)}/${y}`;
}

/** Extrae YYYY-MM-DD de un ISO para inputs type="date". */
export function dateOnlyFromIso(iso: string | null | undefined): string | undefined {
  if (!iso) return undefined;
  return iso.split('T')[0] || undefined;
}
