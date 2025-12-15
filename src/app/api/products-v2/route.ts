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
    fotos?: string;
    talles?: string;
    bordados?: string;
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

        // Leer archivo CSV desde public/products.csv
        const csvPath = join(process.cwd(), 'public', 'products.csv');
        
        try {
            const fileBuffer = await readFile(csvPath);
            
            // Leer CSV como texto y parsear manualmente para mejor control
            const csvText = fileBuffer.toString('utf-8');
            const lines = csvText.split('\n').filter(line => line.trim() !== '');
            
            if (lines.length === 0) {
                console.warn('[API] CSV vacío');
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

            // Parsear CSV manualmente (manejar comillas y valores con comas)
            const parseCSVLine = (line: string): string[] => {
                const result: string[] = [];
                let current = '';
                let inQuotes = false;
                
                for (let i = 0; i < line.length; i++) {
                    const char = line[i];
                    
                    if (char === '"') {
                        inQuotes = !inQuotes;
                    } else if (char === ',' && !inQuotes) {
                        result.push(current.trim());
                        current = '';
                    } else {
                        current += char;
                    }
                }
                result.push(current.trim()); // Último campo
                return result;
            };

            // Primera línea son los headers
            const headersRaw = parseCSVLine(lines[0]);
            const headers = headersRaw.map(h => h.trim().toLowerCase());
            console.log('[API] Headers detectados (raw):', headersRaw);
            console.log('[API] Headers detectados (normalizados):', headers);
            
            // Verificar que el header "rubro" esté en la posición correcta
            const rubroIndex = headersRaw.findIndex(h => h.trim().toLowerCase() === 'rubro');
            console.log('[API] Índice de "rubro" en headers:', rubroIndex);
            
            // Debug: verificar la primera fila de datos antes de procesar
            if (lines.length > 1) {
                const firstDataLine = parseCSVLine(lines[1]);
                console.log('[API] Primera fila de datos parseada:', firstDataLine);
                console.log('[API] Longitud de primera fila:', firstDataLine.length);
                console.log('[API] Headers esperados:', headersRaw);
                console.log('[API] Headers length:', headersRaw.length);
                // Mostrar mapeo de columnas
                console.log('[API] Mapeo esperado:');
                headersRaw.forEach((header, idx) => {
                    console.log(`  ${header} (índice ${idx}) -> "${firstDataLine[idx] || 'VACÍO'}"`);
                });
            }

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
                else if (normalized.includes('precio') || normalized === 'preciolista') columnIndexes.precioLista = index;
                else if (header === 'fotos' || header === 'foto') columnIndexes.fotos = index;
                else if (header === 'talles' || header === 'talle') columnIndexes.talles = index;
                else if (header === 'bordados' || header === 'bordado') columnIndexes.bordados = index;
            });
            
            // Verificar que todos los índices estén correctos
            console.log('[API] Mapeo de columnas:', {
                codigo: columnIndexes.codigo,
                item: columnIndexes.item,
                rubro: columnIndexes.rubro,
                subrubro: columnIndexes.subrubro,
                deposito: columnIndexes.deposito,
                stock: columnIndexes.stock,
                precioLista: columnIndexes.precioLista,
                fotos: columnIndexes.fotos,
                talles: columnIndexes.talles,
                bordados: columnIndexes.bordados
            });

            console.log('[API] Índices de columnas:', columnIndexes);

            // Procesar filas (saltar la primera que son headers)
            const rawData = lines.slice(1).map(line => parseCSVLine(line));

            if (rawData.length === 0) {
                console.warn('[API] CSV vacío o sin datos');
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

            // Debug: mostrar primera fila de datos para verificar mapeo
            if (rawData.length > 0) {
                console.log('[API] Primera fila de datos (raw):', rawData[0]);
                console.log('[API] Headers esperados:', headersRaw);
                console.log('[API] Primera fila parseada completa:', rawData[0]);
                console.log('[API] Longitud de primera fila:', rawData[0].length);
                // Verificar específicamente el rubro
                const rubroIdx = columnIndexes.rubro;
                const subrubroIdx = columnIndexes.subrubro;
                if (rubroIdx !== undefined && rawData[0][rubroIdx]) {
                    console.log(`[API] Rubro en índice ${rubroIdx}: "${rawData[0][rubroIdx]}"`);
                } else {
                    console.error('[API] ERROR: No se encontró rubro en la primera fila');
                    console.error('[API] Índices de columnas:', columnIndexes);
                    console.error('[API] Primera fila completa:', rawData[0]);
                }
                if (subrubroIdx !== undefined && rawData[0][subrubroIdx]) {
                    console.log(`[API] Subrubro en índice ${subrubroIdx}: "${rawData[0][subrubroIdx]}"`);
                }
                // Mostrar todos los valores de la primera fila con sus índices
                console.log('[API] Primera fila con índices:');
                rawData[0].forEach((val, idx) => {
                    console.log(`  [${idx}]: "${val}"`);
                });
            }

            // Procesar filas
            const products: ProductV2Raw[] = rawData
                .map((rowArray: string[]): ProductV2Raw | null => {
                    const getValue = (key: string): string | null => {
                        const idx = columnIndexes[key];
                        if (idx === undefined || idx >= rowArray.length) {
                            if (process.env.NODE_ENV === 'development') {
                                console.warn(`[API] Columna "${key}" no encontrada. Índice: ${idx}, Longitud fila: ${rowArray.length}`);
                            }
                            return null;
                        }
                        const value = rowArray[idx];
                        return value !== null && value !== undefined ? String(value).trim() : null;
                    };

                    const codigo = getValue('codigo');
                    const item = getValue('item');
                    const rubro = getValue('rubro');
                    const subrubro = getValue('subrubro');

                    // Debug: verificar primera fila
                    if (codigo === 'L-WW-BU-ST22') {
                        console.log('[API] DEBUG Primera fila:', {
                            codigo,
                            item,
                            rubro,
                            subrubro,
                            rowArray,
                            columnIndexes,
                            'rubro index': columnIndexes.rubro,
                            'subrubro index': columnIndexes.subrubro,
                            'value at rubro index': rowArray[columnIndexes.rubro],
                            'value at subrubro index': rowArray[columnIndexes.subrubro]
                        });
                    }

                    // Solo procesar si tiene código e item
                    if (!codigo || !item || codigo === '' || item === '') {
                        return null;
                    }

                    const fotosValue = getValue('fotos');
                    const tallesValue = getValue('talles');
                    const bordadosValue = getValue('bordados');

                    return {
                        codigo,
                        item,
                        rubro: rubro || '',
                        subrubro: subrubro || '',
                        deposito: getValue('deposito') || '',
                        stock: Number(getValue('stock') || 0),
                        precioLista: getValue('precioLista') || '0',
                        fotos: fotosValue || undefined,
                        talles: tallesValue || undefined,
                        bordados: bordadosValue || undefined,
                    };
                })
                .filter((p): p is ProductV2Raw => p !== null && p.codigo !== '' && p.item !== ''); // Filtrar nulos y filas vacías

            console.log(`[API] Productos procesados: ${products.length} de ${rawData.length} filas`);
            if (products.length === 0 && rawData.length > 0) {
                console.warn('[API] No se procesaron productos. Primera fila raw:', rawData[0]);
                if (rawData[0] && Array.isArray(rawData[0])) {
                    console.warn('[API] Longitud de la primera fila:', rawData[0].length);
                    console.warn('[API] Valores de la primera fila:', rawData[0]);
                }
            }
            if (products.length > 0) {
                console.log('[API] Ejemplo de producto procesado:', products[0]);
                // Verificar que el rubro esté correcto
                const ejemploWW = products.find(p => p.codigo === 'L-WW-BU-ST22');
                const ejemploOF = products.find(p => p.codigo && p.codigo.includes('OF'));
                if (ejemploWW) {
                    console.log('[API] Ejemplo WORKWEAR:', ejemploWW);
                }
                if (ejemploOF) {
                    console.log('[API] Ejemplo OFFICE:', ejemploOF);
                }
            }

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
        console.error('Error en /api/products-v2:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error al procesar productos';
        return NextResponse.json({
            success: false,
            error: errorMessage,
            data: []
        }, { status: 500 });
    }
}

