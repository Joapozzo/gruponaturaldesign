import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

// Cache en memoria
let cachedProducts: ProductV2Raw[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 1000 * 60 * 10; // 10 minutos

// Tipo para productos raw desde CSV
interface ProductV2Raw {
    codigo: string;
    item: string;
    rubro: string;
    subrubro: string;
    deposito: string;
    stock: number;
    precioLista: string;
    precioTransfer?: string;
    precioSImp?: string;
    precio3cuotas?: string;
    fotos?: string;
    talles?: string;
    bordados?: string;
    descripcion?: string;
    textiles?: string;
}

/**
 * API Route que lee el archivo CSV desde public/products.csv
 * y lo procesa con la nueva estructura V2
 */
export async function GET(request: Request) {
    try {
        // Verificar si se solicita limpiar el cache
        const { searchParams } = new URL(request.url);
        const clearCache = searchParams.get('nocache') === 'true';

        // Verificar cache
        const now = Date.now();
        if (!clearCache && cachedProducts && (now - cacheTimestamp) < CACHE_DURATION) {
            // Si el caché tiene datos, devolverlos
            if (cachedProducts.length > 0) {
                return NextResponse.json({
                    success: true,
                    data: cachedProducts,
                    cached: true,
                    timestamp: new Date(cacheTimestamp).toISOString()
                });
            } else {
                // Si el caché está vacío, limpiarlo y recargar
                cachedProducts = null;
                cacheTimestamp = 0;
            }
        }

        if (clearCache) {
            cachedProducts = null;
            cacheTimestamp = 0;
        }

        // Leer archivo CSV desde public/products.csv
        const csvPath = join(process.cwd(), 'public', 'products.csv');
        
        try {
            const fileBuffer = await readFile(csvPath);
            
            // Leer CSV como texto y parsear manualmente para mejor control
            const csvText = fileBuffer.toString('utf-8');
            
            if (csvText.trim().length === 0) {
                cachedProducts = [];
                cacheTimestamp = now;
                return NextResponse.json({
                    success: true,
                    data: [],
                    total: 0,
                    cached: false,
                    timestamp: new Date(cacheTimestamp).toISOString()
                });
            }

            // Parsear CSV completo respetando campos multilínea entre comillas
            const parseCSV = (text: string): string[][] => {
                const rows: string[][] = [];
                let current = '';
                let inQuotes = false;
                const currentRow: string[] = [];
                
                for (let i = 0; i < text.length; i++) {
                    const char = text[i];
                    const nextChar = i < text.length - 1 ? text[i + 1] : null;
                    
                    if (char === '"') {
                        // Manejar comillas escapadas ("")
                        if (inQuotes && nextChar === '"') {
                            current += '"';
                            i++; // Saltar la siguiente comilla
                        } else {
                            inQuotes = !inQuotes;
                        }
                    } else if (char === ',' && !inQuotes) {
                        // Fin de campo
                        currentRow.push(current.trim());
                        current = '';
                    } else if ((char === '\n' || char === '\r') && !inQuotes) {
                        // Fin de fila (solo si no estamos dentro de comillas)
                        // Manejar \r\n como un solo salto de línea
                        if (char === '\r' && nextChar === '\n') {
                            // Es \r\n, saltar ambos caracteres
                            i++; // Saltar el \n
                        }
                        
                        // Agregar último campo de la fila
                        currentRow.push(current.trim());
                        // Agregar fila si tiene contenido
                        if (currentRow.length > 0 && currentRow.some(f => f !== '')) {
                            rows.push([...currentRow]); // Hacer copia del array
                        }
                        // Limpiar para la siguiente fila
                        currentRow.length = 0;
                        current = '';
                    } else {
                        // Agregar carácter al campo actual
                        // Reemplazar saltos de línea dentro de comillas con espacio
                        if (inQuotes && (char === '\n' || char === '\r')) {
                            current += ' ';
                            // Si es \r\n, saltar el \n también
                            if (char === '\r' && nextChar === '\n') {
                                i++; // Saltar el \n
                            }
                        } else {
                            current += char;
                        }
                    }
                }
                
                // Agregar última fila si hay contenido (para archivos que no terminan en \n)
                if (current.trim() !== '' || currentRow.length > 0) {
                    currentRow.push(current.trim());
                    if (currentRow.length > 0 && currentRow.some(f => f !== '')) {
                        rows.push([...currentRow]); // Hacer copia del array
                    }
                }
                
                return rows;
            };

            // Parsear todo el CSV
            let allRows: string[][];
            try {
                allRows = parseCSV(csvText);
            } catch (parseError) {
                return NextResponse.json({
                    success: false,
                    error: `Error al parsear CSV: ${parseError instanceof Error ? parseError.message : 'Error desconocido'}`,
                    data: []
                }, { status: 500 });
            }
            
            if (allRows.length === 0) {
                cachedProducts = [];
                cacheTimestamp = now;
                return NextResponse.json({
                    success: true,
                    data: [],
                    total: 0,
                    cached: false,
                    timestamp: new Date(cacheTimestamp).toISOString()
                });
            }
            
            if (allRows.length === 1) {
                cachedProducts = [];
                cacheTimestamp = now;
                return NextResponse.json({
                    success: true,
                    data: [],
                    total: 0,
                    cached: false,
                    timestamp: new Date(cacheTimestamp).toISOString()
                });
            }

            // Primera fila son los headers
            const headersRaw = allRows[0];
            if (!headersRaw || headersRaw.length === 0) {
                return NextResponse.json({
                    success: false,
                    error: 'El CSV no tiene headers válidos',
                    data: []
                }, { status: 500 });
            }
            const headers = headersRaw.map(h => h.trim().toLowerCase());

            // Crear mapa de índices de columnas usando headers sin normalizar para mejor precisión
            const columnIndexes: Record<string, number> = {};
            headersRaw.forEach((headerRaw, index) => {
                const header = headerRaw.trim().toLowerCase();
                const normalized = header.replace(/\s+/g, '');
                
                // Mapear exactamente por nombre de columna
                if (header === 'codigo') columnIndexes.codigo = index;
                else if (header === 'item') columnIndexes.item = index;
                else if (header === 'rubro') columnIndexes.rubro = index;
                else if (header === 'subrubro') columnIndexes.subrubro = index;
                else if (header === 'deposito' || header === 'depósito') columnIndexes.deposito = index;
                else if (header === 'stock' || header === 'existencia') columnIndexes.stock = index;
                else if (normalized === 'preciolista' || (normalized.includes('precio') && normalized.includes('lista'))) columnIndexes.precioLista = index;
                else if (normalized === 'preciotransfer' || (normalized.includes('precio') && normalized.includes('transfer'))) columnIndexes.precioTransfer = index;
                else if (normalized === 'preciosimp' || (normalized.includes('precio') && normalized.includes('simp'))) columnIndexes.precioSImp = index;
                else if (normalized === 'precio3cuotas' || (normalized.includes('precio') && normalized.includes('cuotas'))) columnIndexes.precio3cuotas = index;
                else if (header === 'fotos' || header === 'foto') columnIndexes.fotos = index;
                else if (header === 'talles' || header === 'talle') columnIndexes.talles = index;
                else if (header === 'bordados' || header === 'bordado') columnIndexes.bordados = index;
                else if (header === 'descripcion' || header === 'descripción') columnIndexes.descripcion = index;
                else if (header === 'textiles' || header === 'textil') columnIndexes.textiles = index;
            });

            // Procesar filas (saltar la primera que son headers)
            const rawData = allRows.slice(1);

            if (rawData.length === 0) {
                cachedProducts = [];
                cacheTimestamp = now;
                return NextResponse.json({
                    success: true,
                    data: [],
                    total: 0,
                    cached: false,
                    timestamp: new Date(cacheTimestamp).toISOString()
                });
            }


            // Procesar filas
            const products: ProductV2Raw[] = rawData
                .map((rowArray: string[]): ProductV2Raw | null => {
                    const getValue = (key: string): string | null => {
                        const idx = columnIndexes[key];
                        if (idx === undefined || idx >= rowArray.length) {
                            return null;
                        }
                        const value = rowArray[idx];
                        return value !== null && value !== undefined ? String(value).trim() : null;
                    };

                    const codigo = getValue('codigo');
                    const item = getValue('item');
                    const rubro = getValue('rubro');
                    const subrubro = getValue('subrubro');

                    // Solo procesar si tiene código e item
                    if (!codigo || !item || codigo === '' || item === '') {
                        return null;
                    }

                    const fotosValue = getValue('fotos');
                    const tallesValue = getValue('talles');
                    const bordadosValue = getValue('bordados');
                    const precioTransferValue = getValue('precioTransfer');
                    const precioSImpValue = getValue('precioSImp');
                    const precio3cuotasValue = getValue('precio3cuotas');
                    const descripcionValue = getValue('descripcion');
                    const textilesValue = getValue('textiles');

                    return {
                        codigo,
                        item,
                        rubro: rubro || '',
                        subrubro: subrubro || '',
                        deposito: getValue('deposito') || '',
                        stock: Number(getValue('stock') || 0),
                        precioLista: getValue('precioLista') || '0',
                        precioTransfer: precioTransferValue || undefined,
                        precioSImp: precioSImpValue || undefined,
                        precio3cuotas: precio3cuotasValue || undefined,
                        fotos: fotosValue || undefined,
                        talles: tallesValue || undefined,
                        bordados: bordadosValue || undefined,
                        descripcion: descripcionValue || undefined,
                        textiles: textilesValue || undefined,
                    };
                })
                .filter((p): p is ProductV2Raw => p !== null && p.codigo !== '' && p.item !== ''); // Filtrar nulos y filas vacías

            // Guardar en cache
            cachedProducts = products;
            cacheTimestamp = now;

            return NextResponse.json({
                success: true,
                data: products,
                total: products.length,
                cached: false,
                timestamp: new Date(cacheTimestamp).toISOString()
            });

        } catch (fileError: unknown) {
            // Si el archivo no existe, retornar error
            const error = fileError as { code?: string };
            if (error.code === 'ENOENT') {
                return NextResponse.json({
                    success: false,
                    error: 'Archivo products.csv no encontrado en public/products.csv',
                    data: []
                }, { status: 404 });
            }
            throw fileError;
        }

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Error al procesar productos';
        return NextResponse.json({
            success: false,
            error: errorMessage,
            data: []
        }, { status: 500 });
    }
}

