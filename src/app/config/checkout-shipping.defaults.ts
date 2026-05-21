/** Bulto por defecto checkout (alineado con `POST /checkout/shipping/quote`). */
export const DEFAULT_CHECKOUT_PARCEL = {
  weightGrams: 1000,
  height: 20,
  width: 30,
  depth: 10,
} as const;

export function buildCheckoutParcel(declaredValue: number): {
  weightGrams: number;
  height: number;
  width: number;
  depth: number;
  declaredValue: number;
} {
  return {
    ...DEFAULT_CHECKOUT_PARCEL,
    declaredValue: Math.max(0, declaredValue),
  };
}
