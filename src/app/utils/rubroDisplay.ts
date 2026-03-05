/**
 * Nombres de rubro para la UI.
 * En backend/BD: PRODUCTO WORKWEAR (3285), PRODUCTO OFFICE (3314).
 * En el front mostramos OFFICE como "BASIC" (semántica del cliente).
 */

export const RUBRO_DISPLAY_BASIC = 'BASIC';
export const RUBRO_DISPLAY_WORKWEAR = 'WORKWEAR';

/**
 * Devuelve el nombre a mostrar para un rubro.
 * OFFICE -> "BASIC", WORKWEAR -> "WORKWEAR", el resto sin cambio.
 */
export function getRubroDisplayName(nombre: string): string {
  if (!nombre || typeof nombre !== 'string') return nombre || '';
  const upper = nombre.toUpperCase().trim();
  if (upper.includes('OFFICE')) return RUBRO_DISPLAY_BASIC;
  if (upper.includes('WORKWEAR') || (upper.includes('WORK') && upper.includes('WEAR')))
    return RUBRO_DISPLAY_WORKWEAR;
  return nombre.trim();
}

export interface RubroOption {
  id: number;
  nombre: string;
}

/**
 * Encuentra el id del rubro "WORKWEAR" en la lista (por nombre).
 */
export function getWorkwearRubroId(rubros: RubroOption[]): number | null {
  const r = rubros.find((x) => getRubroDisplayName(x.nombre) === RUBRO_DISPLAY_WORKWEAR);
  return r?.id ?? null;
}

/**
 * Encuentra el id del rubro "OFFICE" (mostrado como BASIC) en la lista.
 */
export function getBasicRubroId(rubros: RubroOption[]): number | null {
  const r = rubros.find((x) => getRubroDisplayName(x.nombre) === RUBRO_DISPLAY_BASIC);
  return r?.id ?? null;
}
