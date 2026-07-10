/** Normaliza textos cortos tipo "48hs" para mostrarlos con contexto en checkout. */
export function formatRetiroDemoraLabel(raw: string): string {
  const text = raw.trim();
  if (!text) return text;

  const isBareDuration =
    text.length <= 20 &&
    /\d/.test(text) &&
    /hs/i.test(text) &&
    !/demora|preparaci|retir|estimad/i.test(text);

  if (isBareDuration) {
    const normalized = text
      .replace(/(\d+)\s*-\s*(\d+)\s*hs\b/gi, '$1 a $2 hs')
      .replace(/(\d+)\s*hs\b/gi, '$1 hs');
    return `Preparación estimada: ${normalized}`;
  }

  return text;
}
