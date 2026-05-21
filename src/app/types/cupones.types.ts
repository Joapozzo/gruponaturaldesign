export type CuponTipoDescuento = 'porcentaje' | 'monto_fijo';
export type CuponAlcance = 'carrito_completo' | 'productos_web' | 'productos_padre' | 'rubro' | 'subrubro';
export type CuponEstado = 'activo' | 'pausado' | 'archivado';

export interface CuponValidationItem {
  productoWebId: number;
  productoPadreId: number;
  cantidad: number;
  precioUnitario: number;
  rubroId?: number;
  subrubroId?: number;
}

export interface CuponValidacionResponse {
  aplicable: boolean;
  descuentoTotal: number;
  mensaje?: string;
  cupon?: {
    id: number;
    codigo: string;
    nombre: string;
    tipoDescuento: CuponTipoDescuento;
    valorDescuento: number;
    alcance: CuponAlcance;
  };
}

export interface CuponListItem {
  id: number;
  codigo: string;
  nombre: string;
  tipoDescuento: CuponTipoDescuento;
  valorDescuento: number;
  alcance: CuponAlcance;
  estado: CuponEstado;
  fechaInicio: string;
  fechaFin: string | null;
  usoMaximo: number | null;
  usoActual: number;
  montoMinimo: number | null;
  montoMaximoDescuento: number | null;
  /** Relación con productos/rubros (viene del backend con los counts) */
  productosWeb?: { productoId: number }[];
  productosPadre?: { productoId: number }[];
  rubros?: { rubroId: number }[];
  subrubros?: { subrubroId: number }[];
  _count?: { usages: number };
}

export interface CuponDetalle
  extends Omit<CuponListItem, 'productosWeb' | 'productosPadre' | 'rubros' | 'subrubros'> {
  descripcion: string | null;
  usoMaximoUsuario: number | null;
  esExclusivoWeb: boolean;
  aplicaIVA: boolean;
  requiereCodigo: boolean;
  productosWeb: number[];
  productosPadre: number[];
  rubros: number[];
  subrubros: number[];
  createdAt: string;
  updatedAt: string;
}

export interface CuponCreatePayload {
  codigo: string;
  nombre: string;
  descripcion?: string;
  tipoDescuento: CuponTipoDescuento;
  valorDescuento: number;
  alcance: CuponAlcance;
  estado?: CuponEstado;
  montoMinimo?: number;
  montoMaximoDescuento?: number;
  usoMaximo?: number;
  usoMaximoUsuario?: number;
  fechaInicio: string;
  fechaFin?: string;
  esExclusivoWeb?: boolean;
  aplicaIVA?: boolean;
  requiereCodigo?: boolean;
  productosWeb?: number[];
  productosPadre?: number[];
  rubros?: number[];
  subrubros?: number[];
}

export type CuponUpdatePayload = Partial<CuponCreatePayload>;

export interface CuponesAdminListResponse {
  cupones: CuponListItem[];
  total: number;
  page: number;
  limit: number;
}

export interface CuponAplicado {
  id: number;
  codigo: string;
  nombre: string;
  tipoDescuento: CuponTipoDescuento;
  valorDescuento: number;
  descuentoTotal: number;
}