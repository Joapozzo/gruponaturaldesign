const IMAGES_BASE_URL =
  process.env.NEXT_PUBLIC_IMAGES_BASE_URL ||
  process.env.NEXT_PUBLIC_FTP_BASE_URL ||
  '';

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

  // Placeholder: devolver ruta relativa para que la sirva la app (evitar 404 en CDN)
  if (path.includes('producto-placeholder')) {
    return path.startsWith('/') ? path : `/${path}`;
  }

  // Asegurar que no empiece con /
  const cleanPath = path.replace(/^\/+/, '');
  const base = IMAGES_BASE_URL.endsWith('/') ? IMAGES_BASE_URL.slice(0, -1) : IMAGES_BASE_URL;

  return base ? `${base}/${cleanPath}` : `/${cleanPath}`;
}
