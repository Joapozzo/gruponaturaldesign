import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import { getProductSizeChart } from '@/app/data/sizeMappings';

// URL base de las imágenes (SIEMPRE LOCAL - usar rutas relativas)
// IGNORAR variable de entorno, siempre usar rutas relativas locales
// Las imágenes están en public/imgs/products/
const IMAGES_BASE_URL = '/imgs/products';

/**
 * API Route que lee archivos CSV/Excel desde una carpeta local
 * y los procesa automáticamente
 * 
 * Ruta de archivos: public/data/products/
 */

// Buscar en múltiples ubicaciones posibles
const PRODUCTS_FOLDERS = [
    join(process.cwd(), 'public', 'data', 'products'), // public/data/products/
    join(process.cwd(), 'public', 'data'), // public/data/ (fallback)
];

// Cache en memoria
let cachedProducts: any = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 1000 * 60 * 10; // 10 minutos

/**
 * Extrae URL de Google Sheet desde una celda
 */
function extractSheetUrl(cellValue: any): string | null {
    if (!cellValue) return null;

    const str = String(cellValue).trim();

    if (str.toUpperCase().includes('TALLE') || str.toUpperCase().includes('TABLA')) {
        return 'https://docs.google.com/spreadsheets/d/1cBzB_iVwtJF1UhizX8ZtwZJhyFzX6LEdwQiQCo7dH08/edit';
    }

    const sheetPattern = /https?:\/\/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/;
    const match = str.match(sheetPattern);

    if (match) {
        return `https://docs.google.com/spreadsheets/d/${match[1]}/edit`;
    }

    return null;
}

/**
 * Extrae URL de Drive desde una celda
 */
function extractDriveUrl(cellValue: any): string | null {
    if (!cellValue) return null;

    const str = String(cellValue).trim();
    if (!str || str.length === 0) return null;

    const drivePattern1 = /https?:\/\/drive\.google\.com\/drive\/folders\/([a-zA-Z0-9_-]+)/;
    const match1 = str.match(drivePattern1);
    if (match1) {
        return `https://drive.google.com/drive/folders/${match1[1]}`;
    }

    const drivePattern2 = /https?:\/\/drive\.google\.com\/[^/]+\/d\/([a-zA-Z0-9_-]+)/;
    const match2 = str.match(drivePattern2);
    if (match2) {
        return `https://drive.google.com/drive/folders/${match2[1]}`;
    }

    if (/^[a-zA-Z0-9_-]{20,}$/.test(str)) {
        return `https://drive.google.com/drive/folders/${str}`;
    }

    return null;
}

/**
 * Convierte un nombre de producto a slug (para URLs de imágenes)
 * Ejemplo: "CARDIGAN CHARM DAMA ESCOTE EN V" → "cardigan-charm-dama-escote-en-v"
 * Normaliza "RAGER" a "RANGER" para coincidir con las carpetas de imágenes
 */
function nombreToSlug(nombre: string): string {
    return nombre
        .toLowerCase()
        .trim()
        .replace(/\brager\b/g, 'ranger')  // Normalizar "rager" a "ranger" para las carpetas de imágenes
        .replace(/\s+/g, '-')  // Espacios a guiones
        .replace(/[^\w\-]+/g, '') // Remover caracteres especiales
        .replace(/\-\-+/g, '-')  // Múltiples guiones a uno
        .replace(/^-+/, '')      // Guiones al inicio
        .replace(/-+$/, '');     // Guiones al final
}

/**
 * Genera URLs de imágenes del producto en Ferozo
 * Basado en el nombre del producto, genera URLs como:
 * https://tudominio.com/imgs/products/cardigan-charm-dama-escote-en-v/cardigan-charm-dama-escote-en-v-1.jpg
 */
function generateProductImageUrls(nombre: string, maxImages: number = 10): string[] {
    const slug = nombreToSlug(nombre);
    const urls: string[] = [];

    // Generar URLs para hasta maxImages imágenes
    for (let i = 1; i <= maxImages; i++) {
        urls.push(`${IMAGES_BASE_URL}/${slug}/${slug}-${i}.jpg`);
    }

    return urls;
}

/**
 * Genera la URL de la imagen principal del producto
 */
function generateProductMainImageUrl(nombre: string): string {
    const slug = nombreToSlug(nombre);
    return `${IMAGES_BASE_URL}/${slug}/${slug}-1.jpg`;
}

/**
 * Extrae URL de Google Doc desde una celda
 */
function extractDocUrl(cellValue: any): string | null {
    if (!cellValue) return null;

    const str = String(cellValue).trim();

    if (str.toUpperCase().includes('INDICACIONES') || str.toUpperCase().includes('BORDADOS')) {
        return 'https://docs.google.com/document/d/1jDEk526GzUjEsFaidhsJyfdnyhYq25Ag9WOK9UR-fbc/edit';
    }

    const docPattern = /https?:\/\/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/;
    const match = str.match(docPattern);

    if (match) {
        return `https://docs.google.com/document/d/${match[1]}/edit`;
    }

    return null;
}

/**
 * Procesa un archivo Excel/CSV
 * NUEVA LÓGICA:
 * 1. Leer hoja 2 (HOJA_PRODUCTOS_SUBIR) - productos agrupados con NOMBRE, DESCRIPCION, TALLES, COLORES, TEXTIL, FOTO, TABLA DE TALLES, DATO DE BORDADO
 * 2. Leer hoja 1 (HOJA_PRODUCTOS_TOTALE) - productos individuales, pero SOLO los que tengan:
 *    - Ult. Actualizacion con "TABLAS DE TALLE CATALOGO SHOP ONLINE NTDS"
 *    - Costo x LM con link a Drive
 *    - Lista Material con "INDICACIONES PARA BORDADOS"
 * 3. Agrupar por NOMBRE de la hoja 2, buscando coincidencias en la hoja 1
 */
async function processFile(filePath: string): Promise<any[]> {
    try {
        const fileBuffer = await readFile(filePath);
        const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

        // HOJA 2: Productos agrupados (HOJA_PRODUCTOS_SUBIR)
        // IMPORTANTE: Todos los productos están en la columna "PRODUCTOS WORKWEAR"
        // Los productos BASIC vienen después de una fila separadora que dice "PRODUCTOS BASIC"
        let productosAgrupados: any[] = [];
        if (workbook.SheetNames.length > 1) {
            const sheet2 = workbook.Sheets[workbook.SheetNames[1]];
            const rawData = XLSX.utils.sheet_to_json(sheet2, { defval: null });

            // Todos los productos están en la columna "PRODUCTOS WORKWEAR"
            // Filtrar solo productos válidos (no headers ni separadores)
            productosAgrupados = rawData
                .filter((row: any, index: number) => {
                    if (index === 0) return false; // Saltar primera fila (headers internos)

                    const nombre = String(row['PRODUCTOS WORKWEAR'] || '').trim();

                    // Filtrar:
                    // - Filas vacías
                    // - Headers ("NOMBRE", "PRODUCTOS WORKWEAR")
                    // - Separadores de categorías ("PRODUCTOS BASIC", "PRODUCTOS OFFICE")
                    const esHeader = nombre === 'NOMBRE' || nombre === 'PRODUCTOS WORKWEAR';
                    const esSeparador = nombre === 'PRODUCTOS BASIC' || nombre === 'PRODUCTOS OFFICE';

                    return nombre && !esHeader && !esSeparador;
                })
                .map((row: any) => ({
                    NOMBRE: String(row['PRODUCTOS WORKWEAR'] || '').trim(),
                    DESCRICPION: String(row.__EMPTY || '').trim(),
                    TALLES: String(row.__EMPTY_1 || '').trim(),
                    COLORES: String(row.__EMPTY_2 || '').trim(),
                    TEXTIL: String(row.__EMPTY_3 || '').trim(),
                    FOTO: row.__EMPTY_4 || null,
                    'TABLA DE TALLES': row.__EMPTY_5 || null,
                    LINK: row.__EMPTY_6 || null,
                    'DATO DE BORDADO': row.__EMPTY_7 || null,
                }));
        }

        // HOJA 1: Productos individuales (HOJA_PRODUCTOS_TOTALE)
        // FILTRAR: Solo productos que tengan datos en Ult. Actualizacion, Costo x LM, y Lista Material
        const sheet1 = workbook.Sheets[workbook.SheetNames[0]];
        const productosIndividualesRaw = XLSX.utils.sheet_to_json(sheet1);

        // Filtrar productos que tengan los campos requeridos
        const productosIndividuales = productosIndividualesRaw.filter((row: any) => {
            const ultActualizacion = String(row['Ult. Actualizacion'] || row['Ult Actualizacion'] || '').toUpperCase();
            const costoXLM = String(row['Costo x LM'] || '').trim();
            const listaMaterial = String(row['Lista Material'] || '').toUpperCase();

            // Debe tener "TABLAS DE TALLE" en Ult. Actualizacion
            const tieneTablaTalles = ultActualizacion.includes('TABLAS DE TALLE') || ultActualizacion.includes('TABLA DE TALLE');

            // Costo x LM debe tener contenido (puede ser texto o link)
            const tieneCostoXLM = costoXLM && costoXLM.length > 0;

            // Debe tener "INDICACIONES" en Lista Material
            const tieneIndicaciones = listaMaterial.includes('INDICACIONES') || listaMaterial.includes('BORDADOS');

            return tieneTablaTalles && tieneCostoXLM && tieneIndicaciones;
        });


        // Crear grupos basados en NOMBRE de la hoja 2
        const groups: any[] = [];

        productosAgrupados.forEach((rowAgrupado: any) => {
            const nombre = String(rowAgrupado.NOMBRE || '').trim();
            if (!nombre) return;

            const nombreUpper = nombre.toUpperCase();

            // Extraer palabras clave significativas del nombre (> 3 caracteres)
            // Filtrar palabras comunes que no ayudan a identificar el producto
            const palabrasIgnorar = ['PARA', 'CON', 'SIN', 'TIPO', 'ESCOTE', 'CUELLO'];
            const palabrasClave = nombreUpper
                .split(/\s+/)
                .filter(palabra =>
                    palabra.length > 3 &&
                    !palabrasIgnorar.includes(palabra)
                );

            // Buscar todos los productos de la hoja 1 que contengan este NOMBRE
            // Buscar en Descripcion Y en todas las demás columnas (por si hay una columna con el nombre agrupado)
            const productosCoincidentes = productosIndividuales.filter((prod: any) => {
                const prodDesc = String(prod.Descripcion || '').toUpperCase();

                // Estrategia 1: Coincidencia exacta del nombre completo
                if (prodDesc.includes(nombreUpper)) {
                    return true;
                }

                // Estrategia 2: Coincidencia por palabras clave (al menos 2 palabras deben coincidir)
                // Esto permite que "REMERA GENTLE ESCOTE EN V DAMA" coincida con "Remera Gentle Dama"
                if (palabrasClave.length >= 2) {
                    const palabrasCoincidentes = palabrasClave.filter(palabra =>
                        prodDesc.includes(palabra)
                    );

                    // Si coinciden al menos 2 palabras clave (o el 60% de las palabras)
                    const umbralCoincidencia = Math.max(2, Math.ceil(palabrasClave.length * 0.6));
                    if (palabrasCoincidentes.length >= umbralCoincidencia) {
                        return true;
                    }
                }

                // Estrategia 3: Buscar en todas las demás columnas
                for (const key in prod) {
                    if (key !== 'Descripcion') {
                        const value = String(prod[key] || '').toUpperCase();
                        if (value === nombreUpper || value.includes(nombreUpper)) {
                            return true;
                        }
                    }
                }

                return false;
            });


            // Si encontramos productos coincidentes, crear el grupo
            if (productosCoincidentes.length > 0) {
                // Extraer talles y colores únicos de las descripciones individuales
                const tallesSet = new Set<string>();
                const coloresSet = new Set<string>();

                productosCoincidentes.forEach((prod: any) => {
                    const desc = String(prod.Descripcion || '').toUpperCase();

                    // Extraer talle - buscar números de talle al final de la descripción
                    // Primero buscar talles numéricos (34, 36, 38, 40, 42, 44, 46, 48, 50, 52)
                    const talleNumerico = desc.match(/\b(3[4-9]|[4-5][0-2])\b/);
                    if (talleNumerico) {
                        tallesSet.add(talleNumerico[0]);
                    } else {
                        // Si no hay talle numérico, buscar talles de letras
                        const talles = ['2XS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];
                        for (const talle of talles) {
                            if (desc.includes(` ${talle} `) || desc.endsWith(` ${talle}`)) {
                                tallesSet.add(talle);
                                break;
                            }
                        }
                    }

                    // Extraer color - buscar colores compuestos primero, luego simples
                    // Colores compuestos (deben ir primero para que coincidan antes que los simples)
                    const coloresCompuestos = [
                        'LAVADO OSCURO', 'LAVADO CLARO', 'LAVADO MEDIO',
                        'AZUL MARINO', 'GRIS PERLA', 'GRIS MELANGE', 'GRIS TOPO',
                        'NEGRO', 'BLANCO', 'AZUL', 'GRIS', 'ROJO', 'VERDE',
                        'AMARILLO', 'NARANJA', 'ROSA', 'VIOLETA', 'BEIGE', 'MARRON'
                    ];

                    let colorEncontrado = false;
                    for (const color of coloresCompuestos) {
                        if (desc.includes(color)) {
                            coloresSet.add(color);
                            colorEncontrado = true;
                            break;
                        }
                    }
                });

                // Generar URLs de imágenes en Ferozo basadas en el nombre del producto
                // Generar hasta 10 imágenes (el frontend filtrará las que no existan)
                const imageUrls = generateProductImageUrls(nombre, 10); // Hasta 10 imágenes
                const mainImageUrl = generateProductMainImageUrl(nombre);

                // Crear el grupo con datos de la hoja 2 y productos individuales
                const primerProducto = productosCoincidentes[0] || {} as any;
                const skuBaseSlug = nombreToSlug(nombre); // Slug URL-friendly para la navegación

                // Normalizar Rubro: "office" -> "basic"
                const rubroOriginal = String(primerProducto?.Rubro || '').trim();
                const rubroNormalizado = rubroOriginal.toLowerCase() === 'office' ? 'BASIC' : rubroOriginal;

                // Obtener imagen de talles correspondiente automáticamente
                const tablaTallesImage = getProductSizeChart({
                    NOMBRE: nombre,
                    Descripcion: primerProducto?.Descripcion,
                    Subrubro: primerProducto?.Subrubro,
                    DescripcionCorta: primerProducto?.DescripcionCorta
                });

                const grupo = {
                    skuBase: nombre, // Nombre original para mostrar
                    skuBaseSlug: skuBaseSlug, // Slug para URLs
                    displayProduct: {
                        // Todos los campos del producto individual de la hoja 1
                        ...(primerProducto || {}),
                        // Normalizar Rubro: "office" -> "BASIC"
                        Rubro: rubroNormalizado,
                        // Sobrescribir con datos de la hoja 2 (prioridad)
                        Descripcion: String(rowAgrupado.DESCRICPION || '').trim() || primerProducto?.Descripcion || nombre,
                        DescripcionCorta: String(rowAgrupado.DESCRICPION || '').trim() || primerProducto?.DescripcionCorta || nombre,
                        Material: String(rowAgrupado.TEXTIL || '').trim() || primerProducto?.Material || null,
                        // URLs de recursos externos
                        tablaTallesUrl: extractSheetUrl(rowAgrupado['TABLA DE TALLES']),
                        tablaTallesImage: tablaTallesImage, // Imagen de talles local
                        fotosDriveUrl: extractDriveUrl(rowAgrupado.FOTO),
                        indicacionesBordadosUrl: extractDocUrl(rowAgrupado['DATO DE BORDADO']),
                        // URLs de imágenes en Ferozo
                        imagen: mainImageUrl,
                        imagenes: imageUrls,
                        // Datos adicionales de la hoja 2
                        NOMBRE: nombre,
                        TALLES: String(rowAgrupado.TALLES || '').trim(),
                        COLORES: String(rowAgrupado.COLORES || '').trim(),
                    },
                    variants: productosCoincidentes.map((prod: any, idx: number) => {
                        const desc = String(prod.Descripcion || '').toUpperCase();

                        // Extraer talle y color de la descripción individual
                        let talle: string | undefined;
                        let color: string | undefined;

                        // Extraer talle - buscar números de talle al final de la descripción
                        const talleNumerico = desc.match(/\b(3[4-9]|[4-5][0-2])\b/);
                        if (talleNumerico) {
                            talle = talleNumerico[0];
                        } else {
                            // Si no hay talle numérico, buscar talles de letras
                            const talles = ['2XS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];
                            for (const t of talles) {
                                if (desc.includes(` ${t} `) || desc.endsWith(` ${t}`)) {
                                    talle = t;
                                    break;
                                }
                            }
                        }

                        // Extraer color - buscar colores compuestos primero, luego simples
                        const coloresCompuestos = [
                            'LAVADO OSCURO', 'LAVADO CLARO', 'LAVADO MEDIO',
                            'AZUL MARINO', 'GRIS PERLA', 'GRIS MELANGE', 'GRIS TOPO',
                            'NEGRO', 'BLANCO', 'AZUL', 'GRIS', 'ROJO', 'VERDE',
                            'AMARILLO', 'NARANJA', 'ROSA', 'VIOLETA', 'BEIGE', 'MARRON'
                        ];

                        for (const c of coloresCompuestos) {
                            if (desc.includes(c)) {
                                color = c;
                                break;
                            }
                        }

                        // Normalizar Rubro en cada variante también
                        const variantRubroOriginal = String(prod.Rubro || '').trim();
                        const variantRubroNormalizado = variantRubroOriginal.toLowerCase() === 'office' ? 'BASIC' : variantRubroOriginal;

                        return {
                            codigo: prod.Codigo,
                            variantNumber: idx + 1,
                            producto: {
                                ...prod,
                                Descripcion: prod.Descripcion,
                                DescripcionCorta: prod.DescripcionCorta || prod.Descripcion,
                                Rubro: variantRubroNormalizado,
                                Subrubro: prod.Subrubro,
                                Material: String(rowAgrupado.TEXTIL || prod.Material || '').trim(),
                                tablaTallesUrl: extractSheetUrl(rowAgrupado['TABLA DE TALLES'] || prod['Ult. Actualizacion'] || prod['Ult Actualizacion']),
                                tablaTallesImage: tablaTallesImage, // Usar la misma imagen de talles para todas las variantes
                                fotosDriveUrl: extractDriveUrl(rowAgrupado.FOTO || prod['Costo x LM']),
                                indicacionesBordadosUrl: extractDocUrl(rowAgrupado['DATO DE BORDADO'] || prod['Lista Material']),
                                // URLs de imágenes en Ferozo
                                imagen: mainImageUrl,
                                imagenes: imageUrls,
                                NOMBRE: nombre,
                            },
                            talle: talle || undefined,
                            color: color || undefined,
                        };
                    }),
                    totalVariants: productosCoincidentes.length,
                    availableColors: Array.from(coloresSet),
                    availableSizes: Array.from(tallesSet),
                };

                groups.push(grupo);
            }
        });

        return groups;
    } catch (error) {
        console.error(`Error al procesar archivo ${filePath}:`, error);
        console.error(`Error details:`, error);
        return [];
    }
}

/**
 * Agrupa productos por nombre base
 * NOTA: Ahora processFile ya devuelve los productos agrupados,
 * esta función solo se usa como fallback si processFile devuelve productos individuales
 */
function groupProductsByNombreBase(products: any[]): any[] {
    // Si los productos ya vienen agrupados (tienen skuBase), devolverlos directamente
    if (products.length > 0 && products[0].skuBase && products[0].variants) {
        return products;
    }

    // Fallback: agrupar productos individuales (no debería pasar con la nueva lógica)
    const groupsMap = new Map<string, any[]>();

    products.forEach(product => {
        let groupKey: string;

        if (product.NOMBRE) {
            groupKey = String(product.NOMBRE).trim();
        } else if (product.Descripcion) {
            const desc = String(product.Descripcion).trim();
            let nombreBase = desc
                .replace(/\s*(2XS|XS|S|M|L|XL|XXL|XXXL|2XL|3XL|4XL|38|40|42|44|46|48|50|52)\s*$/i, '')
                .replace(/\s*(NEGRO|BLANCO|AZUL|GRIS|ROJO|VERDE|AMARILLO|NARANJA|ROSA|VIOLETA|BEIGE|MARRON|AZUL MARINO|GRIS PERLA|GRIS MELANGE|GRIS TOPO)\s*$/i, '')
                .trim();
            groupKey = nombreBase || desc;
        } else if (product.Codigo) {
            const codigo = String(product.Codigo);
            const match = codigo.match(/^(.+?)(\d+)$/);
            groupKey = match ? match[1] : codigo;
        } else {
            return;
        }

        if (!groupsMap.has(groupKey)) {
            groupsMap.set(groupKey, []);
        }
        groupsMap.get(groupKey)!.push(product);
    });

    const grouped: any[] = [];
    groupsMap.forEach((variants, nombreBase) => {
        const sortedVariants = variants.sort((a, b) => {
            const codigoA = String(a.Codigo || '');
            const codigoB = String(b.Codigo || '');
            const numA = parseInt(codigoA.match(/(\d+)$/)?.[1] || '0', 10);
            const numB = parseInt(codigoB.match(/(\d+)$/)?.[1] || '0', 10);
            return numA - numB;
        });

        grouped.push({
            skuBase: nombreBase,
            displayProduct: sortedVariants[0],
            variants: sortedVariants.map((v, idx) => ({
                codigo: v.Codigo,
                variantNumber: idx + 1,
                producto: v,
                talle: extractTalleFromDescription(v.Descripcion),
                color: extractColorFromDescription(v.Descripcion),
            })),
            totalVariants: sortedVariants.length,
        });
    });

    return grouped;
}

function extractTalleFromDescription(descripcion: any): string | undefined {
    if (!descripcion) return undefined;

    const descUpper = String(descripcion).toUpperCase();
    const talles = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '2XL', '3XL', '4XL', '38', '40', '42', '44', '46', '48', '50', '52'];

    for (const talle of talles) {
        if (descUpper.includes(talle)) {
            return talle;
        }
    }

    return undefined;
}

function extractColorFromDescription(descripcion: any): string | undefined {
    if (!descripcion) return undefined;

    const descUpper = String(descripcion).toUpperCase();
    const colores = ['NEGRO', 'BLANCO', 'AZUL', 'GRIS', 'ROJO', 'VERDE', 'AMARILLO', 'NARANJA', 'ROSA', 'VIOLETA', 'BEIGE', 'MARRON', 'AZUL MARINO'];

    for (const color of colores) {
        if (descUpper.includes(color)) {
            return color;
        }
    }

    return undefined;
}

export async function GET(request: Request) {
    try {
        // Verificar si se solicita limpiar el cache
        const { searchParams } = new URL(request.url);
        const clearCache = searchParams.get('nocache') === 'true';

        // Verificar cache
        const now = Date.now();
        if (!clearCache && cachedProducts && (now - cacheTimestamp) < CACHE_DURATION) {
            return NextResponse.json({
                success: true,
                data: cachedProducts,
                cached: true,
                timestamp: new Date(cacheTimestamp).toISOString()
            });
        }

        if (clearCache) {
            cachedProducts = null;
            cacheTimestamp = 0;
        }

        // Leer archivos de las carpetas posibles
        // SOLO procesar archivos .xlsx (específicamente products.xlsx)
        let files: { path: string; name: string }[] = [];

        for (const folder of PRODUCTS_FOLDERS) {
            try {
                const fileList = await readdir(folder);
                const validFiles = fileList
                    .filter(file =>
                        // Solo archivos .xlsx (excluir .xls y .csv)
                        file.endsWith('.xlsx')
                    )
                    .map(file => ({
                        path: join(folder, file),
                        name: file
                    }));
                files.push(...validFiles);
            } catch (error: any) {
                // Continuar con la siguiente carpeta si esta no existe
                if (error.code !== 'ENOENT') {
                    console.error(`Error al leer carpeta ${folder}:`, error);
                }
            }
        }

        // Priorizar products.xlsx si existe
        const productsXlsx = files.find(f => f.name === 'products.xlsx');
        const uniqueFiles = productsXlsx
            ? [productsXlsx]
            : Array.from(new Map(files.map(f => [f.name, f])).values());


        if (uniqueFiles.length === 0) {
            return NextResponse.json({
                success: true,
                data: [],
                message: 'No se encontraron archivos CSV/Excel en public/data/ o public/data/products/',
                timestamp: new Date().toISOString()
            });
        }

        // Procesar todos los archivos
        const allProducts: any[] = [];

        for (const file of uniqueFiles) {
            const products = await processFile(file.path);
            allProducts.push(...products);
        }

        // Agrupar productos por nombre base
        const grouped = groupProductsByNombreBase(allProducts);

        // Actualizar cache
        cachedProducts = grouped;
        cacheTimestamp = now;

        return NextResponse.json({
            success: true,
            data: grouped,
            cached: false,
            filesProcessed: uniqueFiles.length,
            files: uniqueFiles.map(f => f.name),
            totalProducts: allProducts.length,
            totalGroups: grouped.length,
            timestamp: new Date().toISOString()
        });

    } catch (error: any) {
        console.error('Error en /api/products/load-from-files:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Error desconocido',
                message: 'No se pudieron cargar los productos desde los archivos'
            },
            { status: 500 }
        );
    }
}

