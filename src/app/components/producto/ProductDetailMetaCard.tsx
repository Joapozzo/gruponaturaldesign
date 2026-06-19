"use client";

import React, { useMemo } from 'react';
import {
  MapPin,
  AlignLeft,
  ChevronRight,
  Hash,
  Tag,
  Ruler,
  FileText,
  ImageIcon,
} from 'lucide-react';
import { ProductVariant, ProductWithImage } from '@/app/types/producto';
import { getProductBordadosImage } from '@/app/data/bordadosMappings';
import { getWhatsAppNumberForUrl } from '@/app/utils/constants';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface ProductDetailMetaCardProps {
  product: ProductWithImage;
  selectedVariant: ProductVariant;
  displayProduct: ProductWithImage;
  onOpenImageModal: (images: string[], index?: number, label?: string) => void;
  className?: string;
}

function formatRubro(rubro: string | null | undefined): string | null {
  if (!rubro) return null;
  let value = rubro;
  if (value.toUpperCase().startsWith('PRODUCTO ')) {
    value = value.substring(9);
  }
  if (value.toUpperCase().includes('OFFICE')) {
    return 'BASIC';
  }
  return value;
}

function SectionHeading({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-900 mb-3">
      <Icon className="w-3.5 h-3.5 text-neutral-400 shrink-0" aria-hidden />
      {children}
    </h2>
  );
}

function MetaSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('w-full', className)}>
      {children}
    </section>
  );
}

function MetaChip({
  icon: Icon,
  label,
  value,
  mono = false,
  onClick,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  mono?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const sharedClass = cn(
    'flex items-center gap-3 min-h-9 sm:min-h-10 px-4 py-2 rounded-none bg-neutral-100 text-left min-w-0 transition-colors w-full',
    onClick && 'cursor-pointer hover:bg-neutral-200/90',
    className,
  );

  const content = (
    <>
      <Icon className="w-4 h-4 shrink-0 text-neutral-400" aria-hidden />
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <span className="text-[10px] font-medium uppercase tracking-wide text-neutral-500">
          {label}
        </span>
        <span className={cn('text-xs font-semibold text-neutral-900 break-all', mono && 'font-mono')}>
          {value}
        </span>
      </div>
      {onClick && (
        <span className="flex items-center self-stretch shrink-0 pl-1">
          <ChevronRight className="w-5 h-5 text-neutral-400" aria-hidden />
        </span>
      )}
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={sharedClass}>
        {content}
      </button>
    );
  }

  return <div className={sharedClass}>{content}</div>;
}

export default function ProductDetailMetaCard({
  product,
  selectedVariant,
  displayProduct,
  onOpenImageModal,
  className,
}: ProductDetailMetaCardProps) {
  const bordadosImageUrl = getProductBordadosImage(product);

  const description = useMemo(() => {
    const text =
      product.descripcionCompleta ||
      product.Descripcion ||
      displayProduct.descripcionCompleta ||
      displayProduct.Descripcion;
    return text?.trim() || null;
  }, [product, displayProduct]);

  const material = product.Material || product.textiles || displayProduct.Material || null;
  const categoria = formatRubro(displayProduct.Rubro);
  const codigo = selectedVariant.codigo;

  const hasTalles = Boolean(product.tablaTallesImage || product.tablaTallesUrl);
  const hasBordados = Boolean(product.indicacionesBordadosUrl);
  const hasFotos = Boolean(product.fotosDriveUrl);
  const hasResources = hasTalles || hasBordados || hasFotos;

  const whatsappNumber = getWhatsAppNumberForUrl();
  const whatsappMessage = encodeURIComponent(
    '¡Hola! Me gustaría coordinar una cita para ver productos en el showroom.',
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const hasSpecs = Boolean(codigo || categoria);
  const hasSpecsOrResources = hasSpecs || hasResources;

  return (
    <article className={cn('w-full flex flex-col gap-5 sm:gap-6', className)}>
      {(description || material) && (
        <MetaSection>
          <SectionHeading icon={AlignLeft}>Descripción</SectionHeading>
          {description && (
            <p className="text-sm font-normal text-neutral-600 leading-relaxed whitespace-pre-line">
              {description}
            </p>
          )}
          {material && (
            <p className={cn('text-xs text-neutral-500', description && 'mt-2')}>
              {material}
            </p>
          )}
        </MetaSection>
      )}

      {hasSpecsOrResources && (
        <MetaSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {codigo && (
              <MetaChip icon={Hash} label="Código" value={codigo} mono />
            )}
            {categoria && (
              <MetaChip icon={Tag} label="Categoría" value={categoria} />
            )}
            {hasTalles &&
              (product.tablaTallesImage ? (
                <MetaChip
                  icon={Ruler}
                  label="Talles"
                  value="Tabla de talles"
                  onClick={() =>
                    onOpenImageModal([product.tablaTallesImage!], 0, 'Tabla de talles')
                  }
                />
              ) : (
                <MetaChip
                  icon={Ruler}
                  label="Talles"
                  value="Tabla de talles"
                  onClick={() => window.open(product.tablaTallesUrl!, '_blank', 'noopener,noreferrer')}
                />
              ))}
            {hasBordados && bordadosImageUrl && (
              <MetaChip
                icon={FileText}
                label="Bordado"
                value="Guía de bordados"
                onClick={() =>
                  onOpenImageModal([bordadosImageUrl], 0, 'Guía de bordados')
                }
              />
            )}
            {hasFotos && (
              <MetaChip
                icon={ImageIcon}
                label="Fotos"
                value="Ver en Drive"
                onClick={() => window.open(product.fotosDriveUrl!, '_blank', 'noopener,noreferrer')}
              />
            )}
          </div>
        </MetaSection>
      )}

      <MetaSection>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <MapPin className="w-6 h-6 sm:w-7 sm:h-7 text-neutral-400 shrink-0 self-center" aria-hidden />
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <h2 className="text-sm font-semibold text-neutral-900 mb-1">
              ¿Necesitás ver el producto en persona?
            </h2>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Visitá nuestro showroom en Rivera Indarte 2143, Córdoba.
            </p>
          </div>
          <Button
            type="button"
            variant="brandRedOutline"
            size="sm"
            onClick={() => window.open(whatsappUrl, '_blank', 'noopener,noreferrer')}
            className="shrink-0 w-full sm:w-auto whitespace-nowrap"
          >
            Coordiná tu cita por WhatsApp
          </Button>
        </div>
      </MetaSection>
    </article>
  );
}
