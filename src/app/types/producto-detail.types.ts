/**
 * Tipos para el detalle de producto
 * Compatible con la respuesta del backend
 */

export interface ProductoWebDetail {
  id: number;
  empresaId: number;
  productoPadreId: number;
  sfactoryId: number;
  sfactoryCodigo: string;
  sfactoryBarcode: string | null;
  nombre: string;
  descripcionCompleta: string | null;
  sexo: string | null;
  talle: string | null;
  color: string | null;
  precioCache: number | null;
  stockCache: number | null;
  ultimaSyncSfactory: Date | null;
  activoSfactory: boolean;
  imagenVariante: string | null;
  createdAt: Date;
  updatedAt: Date;
  precios?: ProductoPrecioDetail[];
  imagenes?: ProductoImagenDetail[];
}

export interface ProductoPrecioDetail {
  id: number;
  productoWebId: number;
  tipoCliente: 'minorista' | 'mayorista';
  precio: number;
  precioLista: number;
  precioTransfer: number | null;
  cuotasFinanciado: number | null;
  precioSinImp: number | null;
  minimoUnidades: number | null;
}

export interface ProductoImagenDetail {
  id: number;
  productoWebId: number;
  color: string | null;
  imagenUrl: string;
  orden: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RubroDetail {
  id: number;
  nombre: string;
  slug: string | null;
}

export interface SubrubroDetail {
  id: number;
  nombre: string;
  slug: string | null;
}

export interface ProductoPadreConVariantes {
  id: number;
  empresaId: number;
  codigoAgrupacion: string;
  nombre: string;
  descripcion: string | null;
  agrupacionTipo: 'automatico' | 'manual' | 'hibrido';
  agrupacionConfirmada: boolean;
  rubroId: number | null;
  subrubroId: number | null;
  linea: string | null;
  material: string | null;
  um: string | null;
  publicado: boolean;
  destacado: boolean;
  orden: number;
  descripcionMarketing: string | null;
  descripcionCorta: string | null;
  slug: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  imagenes: any | null;
  videoUrl: string | null;
  fichaTecnicaUrl: string | null;
  tablaTallesUrl: string | null;
  camposPersonalizados: any | null;
  coloresDisponibles: any | null;
  tallesDisponibles: any | null;
  createdAt: Date;
  updatedAt: Date;
  productosWeb?: ProductoWebDetail[];
  rubro?: RubroDetail | null;
  subrubro?: SubrubroDetail | null;
  _count?: {
    productosWeb: number;
  };
}

