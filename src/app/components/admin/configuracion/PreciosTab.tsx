'use client';

import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Loader2, RefreshCw, Save, Info } from 'lucide-react';
import BaseModal from '@/app/components/modal/BaseModal';
import ConfirmModal from '@/app/components/modal/ConfirmModal';
import { SyncOverlay } from '@/app/components/admin/SyncOverlay';
import { updatePrecioConfig, recalcularPrecios } from '@/app/services/empresaConfig.service';
import { getEmpresaId } from '@/app/utils/getEmpresaId';
import { usePrecioConfigQuery } from '@/app/hooks/usePrecioConfigQuery';
import { PreciosTabSkeleton } from '@/app/components/admin/configuracion/skeletons';

export function PreciosTab() {
  const empresaId = getEmpresaId();
  const [formData, setFormData] = useState({
    descuentoTransferencia: 0.15,
    iva: 0.21,
    cuotasFinanciado: 3,
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showRecalcularModal, setShowRecalcularModal] = useState(false);
  const [showProcesando, setShowProcesando] = useState(false);

  const { data: config, isPending, isFetching, refetch } = usePrecioConfigQuery();
  const showSkeleton = isPending && config === undefined;

  useEffect(() => {
    if (config) {
      setFormData({
        descuentoTransferencia: Number(config.descuentoTransferencia),
        iva: Number(config.iva),
        cuotasFinanciado: Number(config.cuotasFinanciado),
      });
      setHasChanges(false);
    }
  }, [config]);

  const updateMutation = useMutation({
    mutationFn: updatePrecioConfig,
    onSuccess: (data) => {
      toast.success('Configuración guardada');
      setFormData({
        descuentoTransferencia: Number(data.descuentoTransferencia),
        iva: Number(data.iva),
        cuotasFinanciado: Number(data.cuotasFinanciado),
      });
      setHasChanges(false);
      refetch();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Error al guardar');
    },
  });

  const recalcularMutation = useMutation({
    mutationFn: async () => {
      setShowProcesando(true);
      return recalcularPrecios();
    },
    onSuccess: (data) => {
      toast.success(`${data.actualizados} precios recalculados`);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Error al recalcular');
    },
    onSettled: () => {
      setShowProcesando(false);
    },
  });

  const handleChange = (field: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData((prev) => ({ ...prev, [field]: numValue }));
    setHasChanges(true);
  };

  const handleSave = () => {
    updateMutation.mutate({
      descuentoTransferencia: formData.descuentoTransferencia,
      iva: formData.iva,
      cuotasFinanciado: formData.cuotasFinanciado,
    });
  };

  if (showSkeleton) {
    return <PreciosTabSkeleton />;
  }

  return (
    <>
      <Card>
        <CardHeader className="flex items-center justify-between gap-2">
          <span>Parámetros de precios</span>
          {isFetching && !isPending ? (
            <Loader2 className="w-4 h-4 animate-spin text-gray-400" aria-label="Actualizando" />
          ) : null}
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="descuento">Descuento por Transferencia (%)</Label>
            <Input
              id="descuento"
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={formData.descuentoTransferencia}
              onChange={(e) => handleChange('descuentoTransferencia', e.target.value)}
            />
            <p className="text-sm text-gray-600">
              Porcentaje de descuento para pagos por transferencia bancaria (ej: 0.15 = 15%)
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="iva">IVA (%)</Label>
            <Input
              id="iva"
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={formData.iva}
              onChange={(e) => handleChange('iva', e.target.value)}
            />
            <p className="text-sm text-gray-600">Porcentaje de IVA (ej: 0.21 = 21%)</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="cuotas">Cuotas Financiadas</Label>
            <Input
              id="cuotas"
              type="number"
              step="1"
              min="1"
              max="99"
              value={formData.cuotasFinanciado}
              onChange={(e) => handleChange('cuotasFinanciado', e.target.value)}
            />
            <p className="text-sm text-gray-600">
              Cantidad de cuotas disponibles para financiar compras
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-4">
            <Button onClick={handleSave} disabled={!hasChanges || updateMutation.isPending}>
              {updateMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Guardar
            </Button>

            <Button
              variant="blackOutline"
              onClick={() => setShowRecalcularModal(true)}
              disabled={recalcularMutation.isPending}
            >
              {recalcularMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Recalcular precios
            </Button>
            <button
              type="button"
              onClick={() => setShowTooltip(true)}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
              aria-label="Información sobre recalcular precios"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </CardBody>
      </Card>

      {/* <Card className="mt-6">
        <CardHeader>Información</CardHeader>
        <CardBody className="text-sm text-gray-600 space-y-1">
          <p>Empresa ID: {empresaId || 'No configurado'}</p>
          <p>
            Última actualización:{' '}
            {config?.precioConfigUpdatedAt
              ? new Date(config.precioConfigUpdatedAt).toLocaleString('es-AR')
              : 'N/A'}
          </p>
        </CardBody>
      </Card> */}

      <BaseModal
        isOpen={showTooltip}
        onClose={() => setShowTooltip(false)}
        title="Recalcular precios"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Recalcula todos los precios derivados de cada producto usando los valores actuales de la
            configuración (descuento por transferencia, IVA y cuotas financiadas).
          </p>
          <ul className="text-sm text-gray-600 space-y-1 bg-gray-50 p-3 rounded-md">
            <li>
              <span className="font-medium">Transferencia:</span> precio lista × (1 - descuento)
            </li>
            <li>
              <span className="font-medium">Sin impuestos:</span> precio transferencia ÷ (1 + IVA)
            </li>
            <li>
              <span className="font-medium">Financiado:</span> cotizado vía proveedor configurado (Mercado Pago) o división estimada
            </li>
          </ul>
          <p className="text-xs text-gray-500">
            Si un producto tiene configuración personalizada, se usan esos valores en lugar de los
            globales.
          </p>
        </div>
      </BaseModal>

      <ConfirmModal
        isOpen={showRecalcularModal}
        onClose={() => setShowRecalcularModal(false)}
        onConfirm={() => {
          setShowRecalcularModal(false);
          recalcularMutation.mutate();
        }}
        title="¿Recalcular precios?"
        message="Se recalcularán todos los precios derivados (transferencia, sin impuestos, financiado) usando la configuración actual. Esta acción puede tardar unos segundos."
        type="warning"
        confirmText="Recalcular"
        cancelText="Cancelar"
        loading={recalcularMutation.isPending}
      />

      <SyncOverlay
        isOpen={showProcesando}
        title="Recalculando precios..."
        message="Actualizando todos los precios derivados. La interfaz estará deshabilitada durante este proceso."
      />
    </>
  );
}
