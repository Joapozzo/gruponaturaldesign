/**
 * Obtiene el empresaId de forma escalable
 * Prioridad:
 * 1. Variable de entorno (para desarrollo/producción)
 * 2. API de autenticación (cuando esté implementada)
 * 3. Valor por defecto (solo para desarrollo)
 */
export function getEmpresaId(): number {
  // TODO: Implementar obtención desde API de autenticación cuando esté disponible
  // Por ahora usar variable de entorno o valor por defecto
  
  if (typeof window === 'undefined') {
    // Server-side: usar variable de entorno
    return parseInt(process.env.NEXT_PUBLIC_DEFAULT_EMPRESA_ID || '1', 10);
  }
  
  // Client-side: usar variable de entorno o valor por defecto
  return parseInt(process.env.NEXT_PUBLIC_DEFAULT_EMPRESA_ID || '1', 10);
}

