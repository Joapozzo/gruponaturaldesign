/**
 * Utilidades para el formulario modal de producto (wizard).
 * Funciones puras reutilizables.
 */

export interface ItemConSFactoryId {
  id: number;
  sfactoryId: number;
}

/**
 * Parsea mensajes de error del backend y los mapea a campos del formulario.
 */
export function parsearErrorBackend(errorMessage: string): Record<string, string> {
  const errores: Record<string, string> = {};
  const errorLower = errorMessage.toLowerCase();

  const mapeoErrores: Array<{ pattern: string | RegExp; campo: string; mensaje: string }> = [
    { pattern: /subrubro.*id/i, campo: 'subrubro_id', mensaje: 'El subrubro es requerido' },
    { pattern: /rubro.*id/i, campo: 'rubro_id', mensaje: 'El rubro es requerido' },
    { pattern: /unidad.*medida.*id/i, campo: 'um_id', mensaje: 'La unidad de medida es requerida' },
    { pattern: /descripcion/i, campo: 'descripcion', mensaje: 'La descripción es requerida' },
    { pattern: /tipo/i, campo: 'tipo', mensaje: 'El tipo es requerido' },
    { pattern: /codigo/i, campo: 'codigo', mensaje: 'El código es requerido' },
  ];

  for (const { pattern, campo, mensaje } of mapeoErrores) {
    const matches =
      typeof pattern === 'string'
        ? errorLower.includes(pattern.toLowerCase())
        : pattern.test(errorMessage);
    if (matches) {
      errores[campo] = mensaje;
      break;
    }
  }

  return errores;
}

/**
 * Hace scroll al primer campo con error y le da foco.
 */
export function scrollToFirstError(errors: Record<string, string>, delayMs = 100): void {
  const keys = Object.keys(errors);
  if (keys.length === 0) return;

  setTimeout(() => {
    const firstErrorField = keys[0];
    const errorElement =
      document.getElementById(firstErrorField) ||
      document.querySelector(`[name="${firstErrorField}"]`);
    if (errorElement) {
      errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      (errorElement as HTMLElement).focus();
    }
  }, delayMs);
}

/**
 * Normaliza rubro_id y subrubro_id a IDs de SFactory para los selects.
 */
export function normalizeSFactoryIdsForEdit<
  T extends { rubro_id?: number | null; subrubro_id?: number | null }
>(
  datos: T,
  rubros: ItemConSFactoryId[] | undefined,
  subrubros: ItemConSFactoryId[] | undefined
): T & { rubro_id: number | null; subrubro_id: number | null } {
  const rubroIdRaw = datos.rubro_id;
  const subrubroIdRaw = datos.subrubro_id;

  let rubroIdSfactory: number | null = rubroIdRaw ?? null;
  let subrubroIdSfactory: number | null = subrubroIdRaw ?? null;

  if (rubros?.length) {
    const bySfactory = rubros.find((r) => r.sfactoryId === rubroIdRaw);
    const byLocal = rubros.find((r) => r.id === rubroIdRaw);
    rubroIdSfactory = bySfactory ? rubroIdRaw! : (byLocal?.sfactoryId ?? rubroIdRaw ?? null);
  }

  if (subrubros?.length) {
    const bySfactory = subrubros.find((s) => s.sfactoryId === subrubroIdRaw);
    const byLocal = subrubros.find((s) => s.id === subrubroIdRaw);
    subrubroIdSfactory = bySfactory ? subrubroIdRaw! : (byLocal?.sfactoryId ?? subrubroIdRaw ?? null);
  }

  return { ...datos, rubro_id: rubroIdSfactory, subrubro_id: subrubroIdSfactory };
}
