import imageCompression from 'browser-image-compression';

export interface CompressImageOptions {
  /** Tamaño máximo en MB (por defecto 1.8 para estar bajo límite Vercel) */
  maxSizeMB?: number;
  /** Lado máximo en px (por defecto 1920) */
  maxWidthOrHeight?: number;
  /** Calidad inicial 0-1 (por defecto 0.85) */
  initialQuality?: number;
}

const DEFAULT_OPTIONS: CompressImageOptions = {
  maxSizeMB: 1.8,
  maxWidthOrHeight: 1920,
  initialQuality: 0.85,
};

/**
 * Comprime una imagen en el cliente para reducir el payload antes de subir.
 * Si el archivo no es una imagen (ej. PDF), lo devuelve sin modificar.
 */
export async function compressImage(
  file: File,
  options?: CompressImageOptions
): Promise<File> {
  const isImage =
    file.type.startsWith('image/') &&
    !file.type.includes('svg'); // SVG no se comprime bien con esta lib

  if (!isImage) {
    return file;
  }

  const opts = { ...DEFAULT_OPTIONS, ...options };

  try {
    const compressed = await imageCompression(file, {
      maxSizeMB: opts.maxSizeMB,
      maxWidthOrHeight: opts.maxWidthOrHeight ?? 1920,
      initialQuality: opts.initialQuality ?? 0.85,
      useWebWorker: true,
      preserveExif: false,
    });
    return compressed;
  } catch (err) {
    console.warn('compressImage failed, using original file:', err);
    return file;
  }
}
