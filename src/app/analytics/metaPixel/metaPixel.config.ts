const DEFAULT_META_PIXEL_ID = '664659926047255';

export function getMetaPixelId(): string | null {
  const fromEnv = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV === 'production') return DEFAULT_META_PIXEL_ID;
  return null;
}

/** Desactivar en local con NEXT_PUBLIC_META_PIXEL_ENABLED=false */
export function isMetaPixelEnabled(): boolean {
  const flag = process.env.NEXT_PUBLIC_META_PIXEL_ENABLED?.trim().toLowerCase();
  if (flag === 'false' || flag === '0') return false;
  return Boolean(getMetaPixelId());
}
