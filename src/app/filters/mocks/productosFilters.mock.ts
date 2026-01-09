/**
 * Mocks de datos para filtros de productos
 * Centralizados para facilitar reemplazo por API real
 */

export interface MockRubro {
  id: number;
  nombre: string;
  slug: string;
}

export interface MockSubrubro {
  id: number;
  nombre: string;
  slug: string;
  rubroId: number;
}

export const MOCK_RUBROS: MockRubro[] = [
  { id: 1, nombre: 'Remeras', slug: 'remeras' },
  { id: 2, nombre: 'Pantalones', slug: 'pantalones' },
  { id: 3, nombre: 'Buzos', slug: 'buzos' },
  { id: 4, nombre: 'Camisas', slug: 'camisas' },
  { id: 5, nombre: 'Accesorios', slug: 'accesorios' },
];

export const MOCK_SUBRUBROS: MockSubrubro[] = [
  { id: 1, nombre: 'Remera Básica', slug: 'remera-basica', rubroId: 1 },
  { id: 2, nombre: 'Remera Premium', slug: 'remera-premium', rubroId: 1 },
  { id: 3, nombre: 'Pantalón Cargo', slug: 'pantalon-cargo', rubroId: 2 },
  { id: 4, nombre: 'Pantalón Chino', slug: 'pantalon-chino', rubroId: 2 },
  { id: 5, nombre: 'Buzo con Capucha', slug: 'buzo-capucha', rubroId: 3 },
  { id: 6, nombre: 'Buzo Sin Capucha', slug: 'buzo-sin-capucha', rubroId: 3 },
  { id: 7, nombre: 'Camisa Ejecutiva', slug: 'camisa-ejecutiva', rubroId: 4 },
  { id: 8, nombre: 'Camisa Casual', slug: 'camisa-casual', rubroId: 4 },
];

export const SEXO_OPTIONS = [
  { value: 'masculino', label: 'Masculino' },
  { value: 'femenino', label: 'Femenino' },
  { value: 'unisex', label: 'Unisex' },
] as const;

export const COLOR_OPTIONS = [
  'Negro',
  'Blanco',
  'Gris',
  'Azul',
  'Rojo',
  'Verde',
  'Amarillo',
  'Naranja',
  'Rosa',
  'Beige',
  'Marron',
] as const;

export const TALLE_OPTIONS = [
  'XS',
  'S',
  'M',
  'L',
  'XL',
  '2XL',
  '3XL',
  '4XL',
] as const;

export const ORDER_BY_OPTIONS = [
  { value: 'name', label: 'Nombre' },
  { value: 'price', label: 'Precio' },
] as const;

export const ORDER_DIRECTION_OPTIONS = [
  { value: 'asc', label: 'Ascendente' },
  { value: 'desc', label: 'Descendente' },
] as const;

