const SSR_PREFETCH_TIMEOUT_MS = 4_000;

/**
 * Ejecuta un prefetch SSR con timeout. Si vence el plazo, no lanza error:
 * el cliente puede completar la carga después.
 */
export async function prefetchWithTimeout(
  fn: () => Promise<void>,
  timeoutMs: number = SSR_PREFETCH_TIMEOUT_MS
): Promise<boolean> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  try {
    await Promise.race([
      fn(),
      new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error('SSR_PREFETCH_TIMEOUT'));
        }, timeoutMs);
      }),
    ]);
    return true;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === 'SSR_PREFETCH_TIMEOUT' &&
      process.env.NODE_ENV === 'development'
    ) {
      console.warn(`[prefetchWithTimeout] Prefetch superó ${timeoutMs}ms`);
    }
    return false;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

export { SSR_PREFETCH_TIMEOUT_MS };
