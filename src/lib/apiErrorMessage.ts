/** Mensaje legible desde Error o respuesta normalizada de apiClient ({ message, error }). */
export function extractApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }
  if (error && typeof error === 'object') {
    const o = error as Record<string, unknown>;
    if (typeof o.message === 'string' && o.message.trim()) {
      return o.message;
    }
    if (typeof o.error === 'string' && o.error.trim()) {
      return o.error;
    }
  }
  return fallback;
}
