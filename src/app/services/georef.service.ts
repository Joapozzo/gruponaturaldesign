const GEOREF_BASE = 'https://apis.datos.gob.ar/georef/api';

export type GeorefProvincia = { id: string; nombre: string };
export type GeorefLocalidad = { id: string; nombre: string };

type ProvinciasResponse = {
  provincias?: { id: string; nombre: string }[];
};

type LocalidadesResponse = {
  localidades?: { id: string; nombre: string }[];
  cantidad?: number;
  total?: number;
};

const PAGE_SIZE = 5000;

export async function getProvincias(): Promise<GeorefProvincia[]> {
  const url = `${GEOREF_BASE}/provincias?max=30`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Georef provincias: ${res.status}`);
  }
  const data = (await res.json()) as ProvinciasResponse;
  const list = data.provincias ?? [];
  return list
    .map((p) => ({ id: String(p.id), nombre: p.nombre.trim() }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
}

export async function getLocalidades(provinciaId: string): Promise<GeorefLocalidad[]> {
  if (!provinciaId.trim()) {
    return [];
  }

  const all: GeorefLocalidad[] = [];
  let inicio = 0;
  let total = Infinity;

  while (inicio < total) {
    const url = new URL(`${GEOREF_BASE}/localidades`);
    url.searchParams.set('provincia', provinciaId.trim());
    url.searchParams.set('max', String(PAGE_SIZE));
    url.searchParams.set('inicio', String(inicio));

    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new Error(`Georef localidades: ${res.status}`);
    }

    const data = (await res.json()) as LocalidadesResponse;
    total = typeof data.total === 'number' ? data.total : 0;
    const batch = data.localidades ?? [];
    const cantidad = typeof data.cantidad === 'number' ? data.cantidad : batch.length;

    for (const loc of batch) {
      all.push({ id: String(loc.id), nombre: loc.nombre.trim() });
    }

    inicio += cantidad;
    if (cantidad === 0) {
      break;
    }
  }

  return all.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
}
