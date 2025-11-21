/**
 * Google Apps Script para exportar productos desde Google Sheets
 * 
 * INSTRUCCIONES:
 * 1. Abre tu Google Sheet: https://docs.google.com/spreadsheets/d/18Ii4Wd4-WnfBIJBcAOZu0g2kt6kzGX3ckMKkLw-zCYw/edit
 * 2. Ve a Extensiones > Apps Script
 * 3. Pega este código
 * 4. Guarda el proyecto
 * 5. Ve a Implementar > Nueva implementación
 * 6. Tipo: Aplicación web
 * 7. Ejecutar como: Yo
 * 8. Quién tiene acceso: Cualquiera
 * 9. Haz clic en Implementar
 * 10. Copia la URL que te da (será tu endpoint)
 */

// IDs de los recursos
const SHEET_ID = '18Ii4Wd4-WnfBIJBcAOZu0g2kt6kzGX3ckMKkLw-zCYw';
const TABLA_TALLES_SHEET_ID = '1cBzB_iVwtJF1UhizX8ZtwZJhyFzX6LEdwQiQCo7dH08';
const INDICACIONES_BORDADOS_DOC_ID = '1jDEk526GzUjEsFaidhsJyfdnyhYq25Ag9WOK9UR-fbc';

// Nombres de las hojas (ajusta según tus nombres reales)
// Si no encuentras las hojas por nombre, el script intentará usar la primera y segunda hoja
const HOJA_PRODUCTOS_TOTALES = 'HOJA_PRODUCTOS_TOTALE'; // Nombre real de tu primera hoja
const HOJA_PRODUCTOS_SUBIR = 'HOJA_PRODUCTOS_SUBIR'; // Nombre real de tu segunda hoja

/**
 * Función principal que se ejecuta cuando se llama al endpoint
 */
function doGet(e) {
  try {
    const products = getProductsFromSheets();
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        data: products,
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString(),
        message: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Lee ambas hojas y agrupa productos
 * IMPORTANTE: Solo procesa productos que están en HOJA_PRODUCTOS_SUBIR (los que tienen fotos)
 * OPTIMIZADO: Para evitar timeouts, procesa de forma más eficiente
 */
function getProductsFromSheets() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  
  // Leer hoja 2 PRIMERO: Productos a subir (SOLO ESTOS TIENEN FOTOS)
  let sheet2 = spreadsheet.getSheetByName(HOJA_PRODUCTOS_SUBIR);
  if (!sheet2) {
    const sheets = spreadsheet.getSheets();
    sheet2 = sheets.length > 1 ? sheets[1] : sheets[0];
  }
  const productosSubir = readSheetData(sheet2);
  
  if (productosSubir.length === 0) {
    return [];
  }
  
  // Crear un Set con los códigos de productos que SÍ tienen fotos (están en hoja 2)
  const codigosConFotos = new Set();
  productosSubir.forEach(row => {
    if (row['Codigo']) {
      codigosConFotos.add(String(row['Codigo']).trim());
    }
  });
  
  // Leer hoja 1: Productos totales (con enlaces a Drive)
  // OPTIMIZACIÓN: Solo leer columnas necesarias y crear mapa rápido
  let sheet1 = spreadsheet.getSheetByName(HOJA_PRODUCTOS_TOTALES);
  if (!sheet1) {
    sheet1 = spreadsheet.getSheets()[0];
  }
  
  // Crear mapa de productos de hoja 1 solo para códigos que necesitamos
  const productosTotalesMap = createProductosMapOptimized(sheet1, codigosConFotos);
  
  // Crear mapa de productos por código para búsqueda rápida
  const productosMap = new Map();
  
  // SOLO procesar productos que están en HOJA_PRODUCTOS_SUBIR
  productosSubir.forEach(row => {
    const codigo = row['Codigo'];
    if (!codigo) return;
    
    const codigoStr = String(codigo).trim();
    
    // Buscar el producto correspondiente en la hoja 1 (ya está en el mapa)
    const productoEnHoja1 = productosTotalesMap.get(codigoStr);
    
    // Crear el producto combinando datos de ambas hojas
    const producto = {
      ...row,
      // Si existe en hoja 1, combinar datos
      ...(productoEnHoja1 || {}),
      // Extraer enlaces de Drive desde la hoja 1 (ya extraídos en el mapa)
      fotosDriveUrl: productoEnHoja1 ? (productoEnHoja1.fotosDriveUrl || null) : null,
      tablaTallesUrl: extractSheetUrl(row['Ult. Actualizacion'] || (productoEnHoja1 ? productoEnHoja1['Ult. Actualizacion'] : null)),
      indicacionesBordadosUrl: extractDocUrl(row['Lista Material'] || (productoEnHoja1 ? productoEnHoja1['Lista Material'] : null)),
      // Datos adicionales
      talles: extractTalles(row),
      colores: extractColores(row),
      textil: row['Material'] || (productoEnHoja1 ? productoEnHoja1['Material'] : null)
    };
    
    productosMap.set(codigoStr, producto);
  });
  
  // Convertir a array y agrupar por SKU base
  const productosArray = Array.from(productosMap.values());
  const grouped = groupProductsBySkuBase(productosArray);
  
  return grouped;
}

/**
 * Crea un mapa optimizado de productos de la hoja 1
 * Solo procesa los productos que están en codigosConFotos
 */
function createProductosMapOptimized(sheet, codigosConFotos) {
  const map = new Map();
  
  if (!sheet || codigosConFotos.size === 0) return map;
  
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  if (values.length <= 1) return map; // Sin datos o solo headers
  
  const headers = values[0].map(h => String(h).trim());
  const codigoIndex = headers.indexOf('Codigo');
  const costoLMIndex = headers.indexOf('Costo x LM');
  
  if (codigoIndex === -1) return map;
  
  // Procesar solo las filas que necesitamos
  for (let i = 1; i < values.length; i++) {
    const codigo = String(values[i][codigoIndex]).trim();
    
    // Solo procesar si está en la lista de códigos con fotos
    if (!codigosConFotos.has(codigo)) continue;
    
    // Crear objeto del producto
    const producto = {};
    headers.forEach((header, index) => {
      producto[header] = values[i][index];
    });
    
    // Extraer hipervínculo de Drive SOLO si existe la columna
    if (costoLMIndex !== -1) {
      try {
        const cell = sheet.getRange(i + 1, costoLMIndex + 1);
        const driveUrl = extractDriveUrlFromCell(cell);
        producto.fotosDriveUrl = driveUrl;
      } catch (e) {
        producto.fotosDriveUrl = null;
      }
    }
    
    map.set(codigo, producto);
  }
  
  return map;
}

/**
 * Extrae URL de Drive desde una celda (versión optimizada)
 */
function extractDriveUrlFromCell(cell) {
  if (!cell) return null;
  
  try {
    // Método 1: RichTextValue (más rápido para hipervínculos insertados)
    const richTextValue = cell.getRichTextValue();
    const runs = richTextValue.getRuns();
    
    for (let j = 0; j < runs.length; j++) {
      const run = runs[j];
      const linkUrl = run.getLinkUrl();
      if (linkUrl) {
        const driveUrl = extractDriveUrl(linkUrl);
        if (driveUrl) return driveUrl;
      }
    }
  } catch (e) {
    // Continuar con otros métodos
  }
  
  try {
    // Método 2: Fórmula HYPERLINK
    const formula = cell.getFormula();
    if (formula && formula.includes('HYPERLINK')) {
      const urlMatch = formula.match(/HYPERLINK\("([^"]+)"/);
      if (urlMatch && urlMatch[1]) {
        const driveUrl = extractDriveUrl(urlMatch[1]);
        if (driveUrl) return driveUrl;
      }
    }
  } catch (e) {
    // Continuar
  }
  
  try {
    // Método 3: Valor de la celda
    const cellValue = cell.getValue();
    const driveUrl = extractDriveUrl(cellValue);
    if (driveUrl) return driveUrl;
  } catch (e) {
    // Ignorar
  }
  
  return null;
}

/**
 * Lee datos de una hoja del spreadsheet
 */
function readSheetData(sheet) {
  if (!sheet) return [];
  
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  if (values.length <= 1) return []; // Sin datos o solo headers
  
  const headers = values[0].map(h => String(h).trim());
  const rows = [];
  
  for (let i = 1; i < values.length; i++) {
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[i][index];
    });
    rows.push(row);
  }
  
  return rows;
}



/**
 * Extrae URL de Drive desde una celda
 * Acepta URLs completas, IDs de folder, o enlaces de compartir
 */
function extractDriveUrl(cellValue) {
  if (!cellValue) return null;
  
  const str = String(cellValue).trim();
  if (!str || str.length === 0) return null;
  
  // Patrón 1: URL completa de Drive folders
  const drivePattern1 = /https?:\/\/drive\.google\.com\/drive\/folders\/([a-zA-Z0-9_-]+)/;
  const match1 = str.match(drivePattern1);
  if (match1) {
    return `https://drive.google.com/drive/folders/${match1[1]}`;
  }
  
  // Patrón 2: URL de compartir (con /d/ID/view o similar)
  const drivePattern2 = /https?:\/\/drive\.google\.com\/[^/]+\/d\/([a-zA-Z0-9_-]+)/;
  const match2 = str.match(drivePattern2);
  if (match2) {
    return `https://drive.google.com/drive/folders/${match2[1]}`;
  }
  
  // Patrón 3: Solo el ID del folder (formato: 19wXonPnKkfUz7mO_3mjCEjTDGn0uMpTA)
  if (/^[a-zA-Z0-9_-]{20,}$/.test(str)) {
    return `https://drive.google.com/drive/folders/${str}`;
  }
  
  // Si contiene texto pero no es un enlace, retornar null
  // (porque puede ser texto descriptivo como "REMERA ESCOTE EN V DAMA")
  return null;
}

/**
 * Extrae URL de Google Sheet desde una celda
 */
function extractSheetUrl(cellValue) {
  if (!cellValue) return null;
  
  const str = String(cellValue);
  
  // Si contiene "TABLAS DE TALLE" o similar, usar la URL fija
  if (str.toUpperCase().includes('TALLE') || str.toUpperCase().includes('TABLA')) {
    return `https://docs.google.com/spreadsheets/d/${TABLA_TALLES_SHEET_ID}/edit`;
  }
  
  // Buscar patrón de URL de Sheet
  const sheetPattern = /https?:\/\/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/;
  const match = str.match(sheetPattern);
  
  if (match) {
    return `https://docs.google.com/spreadsheets/d/${match[1]}/edit`;
  }
  
  return null;
}

/**
 * Extrae URL de Google Doc desde una celda
 */
function extractDocUrl(cellValue) {
  if (!cellValue) return null;
  
  const str = String(cellValue);
  
  // Si contiene "INDICACIONES" o "BORDADOS", usar la URL fija
  if (str.toUpperCase().includes('INDICACIONES') || str.toUpperCase().includes('BORDADOS')) {
    return `https://docs.google.com/document/d/${INDICACIONES_BORDADOS_DOC_ID}/edit`;
  }
  
  // Buscar patrón de URL de Doc
  const docPattern = /https?:\/\/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/;
  const match = str.match(docPattern);
  
  if (match) {
    return `https://docs.google.com/document/d/${match[1]}/edit`;
  }
  
  return null;
}

/**
 * Extrae talles de una fila (busca en diferentes columnas posibles)
 */
function extractTalles(row) {
  // Buscar en columnas que puedan contener talles
  const possibleColumns = ['Talles', 'Talle', 'Tallas', 'Talla', 'Size', 'Sizes'];
  
  for (const col of possibleColumns) {
    if (row[col]) {
      const value = String(row[col]);
      // Si es una lista separada por comas, espacios, etc.
      return value.split(/[,;\s]+/).filter(t => t.trim()).map(t => t.trim());
    }
  }
  
  return null;
}

/**
 * Extrae colores de una fila
 */
function extractColores(row) {
  // Buscar en columnas que puedan contener colores
  const possibleColumns = ['Colores', 'Color', 'Colour', 'Colours'];
  
  for (const col of possibleColumns) {
    if (row[col]) {
      const value = String(row[col]);
      return value.split(/[,;\s]+/).filter(c => c.trim()).map(c => c.trim());
    }
  }
  
  // Intentar extraer de la descripción
  if (row['Descripcion']) {
    const desc = String(row['Descripcion']).toUpperCase();
    const colors = ['NEGRO', 'BLANCO', 'AZUL', 'GRIS', 'ROJO', 'VERDE', 'AMARILLO', 'NARANJA', 'ROSA', 'VIOLETA', 'BEIGE', 'MARRON'];
    const found = colors.filter(c => desc.includes(c));
    if (found.length > 0) return found;
  }
  
  return null;
}

/**
 * Extrae el SKU base de un código (sin el número final)
 */
function extractSkuBase(codigo) {
  if (!codigo) return codigo;
  
  const str = String(codigo);
  // Buscar patrón: todo excepto los números finales
  const match = str.match(/^(.+?)(\d+)$/);
  
  if (match) {
    return match[1]; // Retorna todo menos los números finales
  }
  
  return str;
}

/**
 * Extrae el número de variante de un código
 */
function extractVariantNumber(codigo) {
  if (!codigo) return 0;
  
  const str = String(codigo);
  const match = str.match(/(\d+)$/);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * Agrupa productos por SKU base
 */
function groupProductsBySkuBase(productos) {
  const groupsMap = new Map();
  
  productos.forEach(producto => {
    const codigo = producto['Codigo'];
    if (!codigo) return;
    
    const skuBase = extractSkuBase(codigo);
    
    if (!groupsMap.has(skuBase)) {
      groupsMap.set(skuBase, {
        skuBase: skuBase,
        variants: []
      });
    }
    
    const variantNumber = extractVariantNumber(codigo);
    groupsMap.get(skuBase).variants.push({
      ...producto,
      variantNumber: variantNumber
    });
  });
  
  // Convertir a array y ordenar variantes
  const grouped = Array.from(groupsMap.values()).map(group => {
    // Ordenar variantes por número
    group.variants.sort((a, b) => a.variantNumber - b.variantNumber);
    
    // El primer producto es el displayProduct
    group.displayProduct = group.variants[0];
    group.totalVariants = group.variants.length;
    
    return group;
  });
  
  return grouped;
}

