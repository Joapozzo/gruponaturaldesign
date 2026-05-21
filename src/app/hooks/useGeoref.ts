'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  getLocalidades,
  getProvincias,
  type GeorefLocalidad,
  type GeorefProvincia,
} from '@/app/services/georef.service';

/**
 * Loads provincias once. Loads localidades when `provinciaNombre` matches a provincia
 * in the loaded list (nombre → id). Pass the stored `ShippingData.provincia` string.
 */
export function useGeoref(provinciaNombre?: string | null) {
  const [provincias, setProvincias] = useState<GeorefProvincia[]>([]);
  const [localidades, setLocalidades] = useState<GeorefLocalidad[]>([]);
  const [loadingProvincias, setLoadingProvincias] = useState(true);
  const [loadingLocalidades, setLoadingLocalidades] = useState(false);

  const provinciaId = useMemo(() => {
    const name = (provinciaNombre ?? '').trim();
    if (!name) return undefined;
    return provincias.find((p) => p.nombre === name)?.id;
  }, [provinciaNombre, provincias]);

  useEffect(() => {
    let cancelled = false;
    setLoadingProvincias(true);
    void getProvincias()
      .then((list) => {
        if (!cancelled) setProvincias(list);
      })
      .catch(() => {
        if (!cancelled) setProvincias([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingProvincias(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const id = provinciaId?.trim();
    if (!id) {
      setLocalidades([]);
      setLoadingLocalidades(false);
      return;
    }

    let cancelled = false;
    setLoadingLocalidades(true);
    setLocalidades([]);

    void getLocalidades(id)
      .then((list) => {
        if (!cancelled) setLocalidades(list);
      })
      .catch(() => {
        if (!cancelled) setLocalidades([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingLocalidades(false);
      });

    return () => {
      cancelled = true;
    };
  }, [provinciaId]);

  return {
    provincias,
    localidades,
    loadingProvincias,
    loadingLocalidades,
  };
}
