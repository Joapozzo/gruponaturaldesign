import type { VariantePublicada } from '@/app/types/producto-publicado.types';

/** Elige la mejor variante entre duplicados color+talle (más stock, luego precio, luego id). */
export function findBestVariantePublicada(
  variantes: VariantePublicada[],
  color: string | null,
  talle: string | null,
): VariantePublicada | null {
  const matches = variantes.filter((v) => v.color === color && v.talle === talle);
  if (matches.length === 0) {
    return variantes[0] ?? null;
  }
  return matches.reduce((best, v) => {
    if (v.stock > best.stock) return v;
    if (v.stock < best.stock) return best;
    if (v.precio > best.precio) return v;
    if (v.precio < best.precio) return best;
    return v.id > best.id ? v : best;
  });
}

/** Color y talle iniciales: primera combinación con stock, o la primera disponible. */
export function getDefaultVariantSelection(producto: {
  colores?: string[];
  talles?: string[];
  variantes?: VariantePublicada[];
}): { color: string | null; talle: string | null } {
  const colores = producto.colores ?? [];
  const talles = producto.talles ?? [];
  const variantes = producto.variantes ?? [];

  for (const color of colores) {
    for (const talle of talles) {
      const v = findBestVariantePublicada(variantes, color, talle);
      if (v && v.stock > 0) {
        return { color, talle };
      }
    }
  }

  if (colores.length === 0 && talles.length > 0) {
    for (const talle of talles) {
      const v = findBestVariantePublicada(variantes, null, talle);
      if (v && v.stock > 0) {
        return { color: null, talle };
      }
    }
    return { color: null, talle: talles[0] ?? null };
  }

  return {
    color: colores[0] ?? null,
    talle: talles[0] ?? null,
  };
}

/** Deduplica variantes publicadas por color+talle (misma lógica que el API). */
export function deduplicateVariantesPublicadas(
  variantes: VariantePublicada[],
): VariantePublicada[] {
  const byKey = new Map<string, VariantePublicada>();

  for (const v of variantes) {
    const key = `${v.color ?? ''}|${v.talle ?? ''}`;
    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, v);
      continue;
    }
    const best = [existing, v].reduce((a, b) => {
      if (a.stock > b.stock) return a;
      if (a.stock < b.stock) return b;
      if (a.precio > b.precio) return a;
      if (a.precio < b.precio) return b;
      return a.id > b.id ? a : b;
    });
    byKey.set(key, best);
  }

  return Array.from(byKey.values());
}

/** Stock máximo por color+talle (para selectores cuando hay duplicados en caché). */
export function buildVariantStockMap(
  variantes: VariantePublicada[],
): Record<string, number> {
  return variantes.reduce<Record<string, number>>((acc, v) => {
    if (v.talle) {
      acc[v.talle] = Math.max(acc[v.talle] ?? 0, v.stock);
    }
    return acc;
  }, {});
}
