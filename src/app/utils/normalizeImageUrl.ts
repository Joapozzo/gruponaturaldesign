const IMAGES_BASE_URL = process.env.NEXT_PUBLIC_IMAGES_BASE_URL!;

export function normalizeImageUrl(
  src: string | null | undefined
): string | null {
  if (!src) return null;

  const path = src.trim();
  if (!path) return null;

  // Si ya es absoluta, devolver tal cual
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Asegurar que no empiece con /
  const cleanPath = path.replace(/^\/+/, '');

  return `${IMAGES_BASE_URL}${cleanPath}`;
}
