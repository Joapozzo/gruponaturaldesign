# Carpeta de Productos

Coloca aquí tus archivos CSV o Excel con los productos.

## Estructura del archivo

El archivo debe tener **2 hojas**:

### Hoja 1: Productos Individuales
- Contiene todos los productos con sus códigos únicos
- Columnas importantes:
  - `Codigo`: Código único del producto
  - `Costo x LM`: Enlace a carpeta de Drive con fotos
  - `Ult. Actualizacion`: Enlace o texto para tabla de talles
  - `Lista Material`: Enlace o texto para indicaciones de bordados

### Hoja 2: Productos Agrupados
- Contiene productos agrupados por nombre
- Columnas importantes:
  - `Codigo`: Código del producto (debe coincidir con Hoja 1)
  - `Descripcion`: Nombre/descripción del producto
  - `Rubro`, `Subrubro`: Categorías
  - `Precio Venta`: Precio del producto

## Formato de enlaces

### Fotos (Costo x LM)
- URL completa: `https://drive.google.com/drive/folders/19wXonPnKkfUz7mO_3mjCEjTDGn0uMpTA`
- Solo ID: `19wXonPnKkfUz7mO_3mjCEjTDGn0uMpTA`

### Tabla de Talles (Ult. Actualizacion)
- Texto: `TABLAS DE TALLE CATALOGO SHOP ONLINE NTDS` (usa URL fija)
- URL: `https://docs.google.com/spreadsheets/d/ID/edit`

### Indicaciones Bordados (Lista Material)
- Texto: `INDICACIONES PARA BORDADOS` (usa URL fija)
- URL: `https://docs.google.com/document/d/ID/edit`

## Notas

- Los archivos se procesan automáticamente al iniciar la app
- Se cachean por 10 minutos
- Puedes tener múltiples archivos, todos se procesarán
- Los productos se agrupan automáticamente por nombre base

