import * as XLSX from 'xlsx';
import { 
    ProductV2Raw, 
    ProductV2, 
    GroupedProductV2, 
    ProductV2Variant,
    RubroV2,
    SubrubroV2,
    ProductV2Filters
} from '../types/producto-v2';
import { getProductSizeChart } from '../data/sizeMappings';

/**
 * Servicio para procesar productos desde CSV con nueva estructura
 * Archivo: public/product.csv
 */
class ProductsV2Service {
    private readonly IMAGES_BASE_URL = '/imgs/products';
    private readonly TALLES_BASE_URL = '/imgs/talles';
    private readonly BORDADOS_BASE_URL = '/imgs/bordados';

    /**
     * Convierte nombre a slug (para URLs)
     */
    private nombreToSlug(nombre: string): string {
        return nombre
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    }

    /**
     * Normaliza el género en el nombre del producto
     * "D" → "Dama", "H" → "Hombre"
     * Solo reemplaza cuando "D" o "H" están solos (no como parte de otra palabra)
     */
    private normalizeGenero(nombre: string): string {
        // Normalizar " D " (espacio D espacio) a " DAMA " (mayúsculas para consistencia)
        // También " D " al inicio o final, pero no si es parte de otra palabra
        // Usar lookbehind y lookahead para asegurar que esté separado
        nombre = nombre.replace(/(^|\s+)D(\s+|$)/gi, '$1DAMA$2');
        
        // Normalizar " H " (espacio H espacio) a " HOMBRE " (mayúsculas para consistencia)
        // También " H " al inicio o final, pero no si es parte de otra palabra
        nombre = nombre.replace(/(^|\s+)H(\s+|$)/gi, '$1HOMBRE$2');
        
        // Limpiar espacios múltiples que puedan quedar
        nombre = nombre.replace(/\s+/g, ' ').trim();
        
        return nombre;
    }

    /**
     * Extrae el nombre base del producto (sin talle/color)
     * Ejemplo: "Buzo Standard Unisex Azul Marino 2XL" → "Buzo Standard Unisex"
     * También normaliza "D" a "Dama" y "H" a "Hombre"
     * IMPORTANTE: Remueve el color para que la carpeta sea solo del producto
     */
    private extractNombreBase(item: string): string {
        // Primero normalizar género: "D" → "Dama", "H" → "Hombre"
        let nombre = this.normalizeGenero(item.trim());

        // Patrones comunes de talles al final
        const tallePatterns = [
            /\s+(2XS|XS|S|M|L|XL|2XL|3XL|4XL|5XL)\s*$/i,
            /\s+(\d{1,2})\s*$/,
            /\s+(PP|P|G|GG|XG|XXG|XXXG)\s*$/i,
        ];

        // Remover talle del final
        for (const pattern of tallePatterns) {
            nombre = nombre.replace(pattern, '').trim();
        }

        // Remover colores conocidos del final usando regex más robusto
        // Colores compuestos (más largos primero para evitar coincidencias parciales)
        // IMPORTANTE: Normalizar abreviaciones como "GRIS MEL CL" → "gris melange"
        const coloresCompuestos = [
            { pattern: /\s+azul\s+marino\s*$/i, replace: '' },
            { pattern: /\s+azul\s+mar\s*$/i, replace: '' },
            { pattern: /\s+gris\s+melange\s*$/i, replace: '' },
            { pattern: /\s+gris\s+mel\s+cl\s*$/i, replace: '' }, // GRIS MEL CL → gris melange
            { pattern: /\s+gris\s+mel\s*$/i, replace: '' },
            { pattern: /\s+gris\s+topo\s*$/i, replace: '' },
            { pattern: /\s+lavado\s+oscuro\s*$/i, replace: '' },
            { pattern: /\s+lavado\s+claro\s*$/i, replace: '' },
            { pattern: /\s+lavado\s+medio\s*$/i, replace: '' },
            { pattern: /\s+cemento\s*$/i, replace: '' }, // Agregar cemento como color compuesto
            { pattern: /\s+tostado\s*$/i, replace: '' }, // Agregar tostado como color compuesto
        ];
        
        // Aplicar colores compuestos
        for (const color of coloresCompuestos) {
            nombre = nombre.replace(color.pattern, color.replace).trim();
        }
        
        // Colores simples (buscar desde el final)
        const coloresSimples = [
            'celeste', 'azul', 'negro', 'blanco', 'gris', 'rojo', 'verde',
            'amarillo', 'naranja', 'rosa', 'violeta', 'beige', 'marron', 'camel', 'bordo',
            'arena', 'marino', 'melange', 'topo', 'oscuro', 'claro', 'medio',
            'cemento', 'tostado' // Agregar cemento y tostado como colores
        ];
        
        // Remover colores simples del final
        for (const color of coloresSimples) {
            const regex = new RegExp(`\\s+${color}\\s*$`, 'i');
            if (regex.test(nombre)) {
                nombre = nombre.replace(regex, '').trim();
                break; // Solo remover el primer color encontrado (el último en el string)
            }
        }

        return nombre.trim();
    }

    /**
     * Extrae talle del item
     */
    private extractTalle(item: string): string | undefined {
        const tallePatterns = [
            /\s+(2XS|XS|S|M|L|XL|2XL|3XL|4XL|5XL)\s*$/i,
            /\s+(\d{1,2})\s*$/,
            /\s+(PP|P|G|GG|XG|XXG|XXXG)\s*$/i,
        ];

        for (const pattern of tallePatterns) {
            const match = item.match(pattern);
            if (match) {
                return match[1]?.toUpperCase() || match[0]?.trim().toUpperCase();
            }
        }

        return undefined;
    }

    /**
     * Extrae color del item (última palabra antes del talle, si es un color conocido)
     * Normaliza abreviaciones como "GRIS MEL CL" → "Gris Melange"
     */
    private extractColor(item: string): string | undefined {
        // Primero normalizar abreviaciones comunes
        let normalizedItem = item.toUpperCase();
        
        // Mapeo de abreviaciones a colores completos
        const colorAbbreviations: Record<string, string> = {
            'GRIS MEL': 'gris melange',
            'GRIS MEL CL': 'gris melange',
            'GRIS MELANGE': 'gris melange',
            'GRIS TOPO': 'gris topo',
            'AZUL MAR': 'azul marino',
            'AZUL MARINO': 'azul marino',
            'LAVADO OSCURO': 'lavado oscuro',
            'LAVADO CLARO': 'lavado claro',
        };
        
        // Buscar y reemplazar abreviaciones
        for (const [abbrev, fullColor] of Object.entries(colorAbbreviations)) {
            if (normalizedItem.includes(abbrev)) {
                normalizedItem = normalizedItem.replace(abbrev, fullColor);
                break;
            }
        }
        
        // Colores compuestos (más largos primero)
        // IMPORTANTE: Buscar colores compuestos ANTES de buscar colores simples
        const coloresCompuestos = [
            { pattern: /azul\s+marino|azul\s+mar/i, name: 'Azul Marino' },
            { pattern: /gris\s+melange|gris\s+mel/i, name: 'Gris Melange' },
            { pattern: /gris\s+topo/i, name: 'Gris Topo' },
            { pattern: /lavado\s+oscuro/i, name: 'Lavado Oscuro' },
            { pattern: /lavado\s+claro/i, name: 'Lavado Claro' },
            { pattern: /tostado/i, name: 'Tostado' }, // Agregar Tostado como color compuesto
        ];
        
        // Buscar colores compuestos primero (buscar en el string completo)
        for (const color of coloresCompuestos) {
            if (color.pattern.test(normalizedItem)) {
                return color.name;
            }
        }
        
        // Colores simples (incluyendo cemento y tostado)
        // IMPORTANTE: Solo buscar colores simples si NO se encontró un color compuesto
        // IMPORTANTE: "azul" debe ir DESPUÉS de buscar "azul marino" para evitar falsos positivos
        const colores = [
            'negro', 'blanco', 'azul', 'celeste', 'gris', 'rojo', 'verde', 
            'beige', 'marron', 'camel', 'bordo', 'rosa', 'amarillo', 'arena',
            'cemento', 'tostado' // Agregar cemento y tostado como colores
        ];

        // Primero remover el talle del final para buscar el color correctamente
        // Los talles pueden ser números (36, 38, etc.) o letras (XS, S, M, etc.)
        const tallePatterns = [
            /\s+(2XS|XS|S|M|L|XL|2XL|3XL|4XL|5XL)\s*$/i,
            /\s+(\d{1,2})\s*$/,
            /\s+(PP|P|G|GG|XG|XXG|XXXG)\s*$/i,
        ];
        
        let itemSinTalle = normalizedItem.toLowerCase();
        for (const pattern of tallePatterns) {
            itemSinTalle = itemSinTalle.replace(pattern, '').trim();
        }

        const palabras = itemSinTalle.split(/\s+/);
        
        // Buscar colores desde el final (ahora la última palabra debería ser el color)
        // IMPORTANTE: Buscar desde la última palabra hacia atrás para encontrar el color
        for (let i = palabras.length - 1; i >= 0; i--) {
            const palabra = palabras[i];
            // Buscar coincidencia EXACTA del color (no parcial para evitar falsos positivos)
            const colorEncontrado = colores.find(c => {
                // Solo coincidencia exacta para evitar que "marino" coincida con "marron"
                if (palabra === c) return true;
                return false;
            });
            if (colorEncontrado) {
                // Capitalizar primera letra
                return colorEncontrado.charAt(0).toUpperCase() + colorEncontrado.slice(1);
            }
        }

        return undefined;
    }

    /**
     * Parsea precio desde string con formato $35,900.00 o $35900.00
     */
    private parsePrecio(precioStr: string): number {
        if (!precioStr) return 0;

        // Remover símbolos, espacios y comas
        const cleaned = String(precioStr)
            .replace(/[$\s]/g, '')
            .replace(/,/g, '')
            .trim();

        const parsed = parseFloat(cleaned);
        return isNaN(parsed) ? 0 : parsed;
    }

    /**
     * Normaliza color a slug para usar en nombres de archivos
     * IMPORTANTE: Según la estructura real de archivos:
     * - "Azul Marino" → "marino" (archivo: buzo-standard-unisex-marino-1.jpg)
     * - "Gris Melange" → "melange" (archivo: buzo-standard-unisex-melange-1.jpg)
     * - "Gris Topo" → "gristopo" (archivo: buzo-standard-unisex-gristopo-1.jpg)
     * - "Negro" → "negro" (archivo: buzo-standard-unisex-negro-1.jpg)
     */
    private normalizeColorToSlug(color: string): string {
        if (!color) return '';
        
        const colorLower = color.toLowerCase().trim();
        
        // Mapeo de colores según la estructura real de archivos
        const colorMap: Record<string, string> = {
            'azul marino': 'azulmarino',
            'azul-marino': 'azulmarino',
            'azul mar': 'azulmarino',
            'gris melange': 'grismelange',
            'gris-melange': 'grismelange',
            'gris mel': 'grismelange',
            'gris-mel': 'grismelange',
            'gris topo': 'gristopo',
            'gris-topo': 'gristopo',
            'gristopo': 'gristopo',
            'negro': 'negro',
            'neg': 'negro',
            'blanco': 'blanco',
            'celeste': 'celeste',
            'cemento': 'cemento',
            'tostado': 'tostado',
        };
        
        if (colorMap[colorLower]) {
            return colorMap[colorLower];
        }
        
        // Si no está en el mapeo, convertir a slug normal (sin espacios, en minúsculas)
        return colorLower.replace(/\s+/g, '-');
    }

    /**
     * Genera rutas de imágenes basadas en el nombre base del producto y colores disponibles
     * Estructura: /imgs/products/{nombre-base-slug}/{nombre-base-slug}-{color-slug}-{numero}.jpg
     * Ejemplo: /imgs/products/buzo-standard/buzo-standard-azul-1.jpg
     * 
     * IMPORTANTE: La carpeta es global para todos los colores del producto
     * Las fotos dentro tienen el formato: {nombre-base}-{color}-{numero}.jpg
     * 
     * NOTA: Solo genera las primeras 5 imágenes por color para evitar muchos 404s.
     * Los componentes verificarán cuáles imágenes existen realmente.
     */
    private generateImageUrls(nombreBase: string, colores: string[]): string[] {
        const nombreSlug = this.nombreToSlug(nombreBase);
        const images: string[] = [];

        // Si hay colores, generar imágenes para cada color
        if (colores.length > 0) {
            colores.forEach(color => {
                if (!color) return;
                
                // Normalizar color a slug
                const colorSlug = this.normalizeColorToSlug(color);
                
                // Generar hasta 20 imágenes por color (el componente verificará cuáles existen)
                // Formato: /imgs/products/{nombre-slug}/{nombre-slug}-{color-slug}-{numero}.jpg
                for (let i = 1; i <= 20; i++) {
                    const imagePath = `${this.IMAGES_BASE_URL}/${nombreSlug}/${nombreSlug}-${colorSlug}-${i}.jpg`;
                    images.push(imagePath);
                }
            });
        } else {
            // Si no hay colores, generar imágenes genéricas (sin color)
            // Formato: /imgs/products/{nombre-slug}/{nombre-slug}-{numero}.jpg
            for (let i = 1; i <= 20; i++) {
                const imagePath = `${this.IMAGES_BASE_URL}/${nombreSlug}/${nombreSlug}-${i}.jpg`;
                images.push(imagePath);
            }
        }

        return images;
    }

    /**
     * Parsea fotos desde string del CSV
     * Formato del CSV: "carpeta/nombre-archivo-1" (ej: "cardigan-charm-dama/cardigan-charm-dama-azulmarino-1")
     * Genera múltiples imágenes (1, 2, 3, 4, 5) para ese color en esa carpeta
     * Retorna array de rutas completas organizadas por color
     */
    private parseFotos(fotosStr?: string): string[] {
        if (!fotosStr || fotosStr.trim() === '') {
            return [];
        }
        
        // Remover comillas si las tiene
        let cleanFotos = fotosStr.trim();
        if (cleanFotos.startsWith('"') && cleanFotos.endsWith('"')) {
            cleanFotos = cleanFotos.slice(1, -1);
        }
        
        // Separar por comas si hay múltiples fotos
        const fotos = cleanFotos.split(',').map(f => f.trim()).filter(f => f && !f.includes('$'));
        
        const allImages: string[] = [];
        
        // Procesar cada foto del CSV
        fotos.forEach(foto => {
            // Si ya tiene ruta completa, usarla
            if (foto.startsWith('/')) {
                allImages.push(foto);
                return;
            }
            
            // El formato del CSV es: "carpeta/nombre-archivo-1"
            // Ejemplo: "cardigan-charm-dama/cardigan-charm-dama-azulmarino-1"
            if (foto.includes('/')) {
                const parts = foto.split('/');
                const folder = parts[0];
                const fileName = parts[1];
                
                // Extraer el patrón base del nombre (sin el número final)
                // Ejemplo: "cardigan-charm-dama-azulmarino-1" → base: "cardigan-charm-dama-azulmarino"
                const match = fileName.match(/^(.+?)-(\d+)$/);
                if (match) {
                    const baseName = match[1]; // "cardigan-charm-dama-azulmarino"
                    const firstNumber = parseInt(match[2], 10); // 1
                    
                    // Generar múltiples imágenes (1-20) para ese color
                    // El componente verificará cuáles existen realmente
                    for (let i = firstNumber; i <= 20; i++) {
                        const imagePath = `${this.IMAGES_BASE_URL}/${folder}/${baseName}-${i}.jpg`;
                        allImages.push(imagePath);
                    }
                } else {
                    // Si no tiene número, usar el nombre tal cual
                    const finalFileName = fileName.includes('.') ? fileName : `${fileName}.jpg`;
                    allImages.push(`${this.IMAGES_BASE_URL}/${folder}/${finalFileName}`);
                }
            } else {
                // Si no tiene carpeta, intentar construirla
                const match = foto.match(/^(.+?)-(\d+)$/);
                if (match) {
                    const baseName = match[1];
                    const number = match[2];
                    // Generar imágenes 1-5
                    for (let i = parseInt(number, 10); i <= 5; i++) {
                        allImages.push(`${this.IMAGES_BASE_URL}/${baseName}/${baseName}-${i}.jpg`);
                    }
                } else {
                    allImages.push(`${this.IMAGES_BASE_URL}/${foto}/${foto}.jpg`);
                }
            }
        });
        
        return allImages;
    }

    /**
     * Obtiene la imagen de tabla de talles basada en el slug
     */
    private getTablaTallesImage(tallesSlug?: string, subrubro?: string, nombreBase?: string): string | undefined {
        if (tallesSlug) {
            // Remover extensión .jpg si ya existe para evitar doble extensión
            const slugSinExtension = tallesSlug.replace(/\.jpg$/i, '');
            // Construir path: /imgs/talles/{slug}.jpg
            return `${this.TALLES_BASE_URL}/${slugSinExtension}.jpg`;
        }

        // Si no hay slug, intentar obtener desde el nombre base o subrubro usando getProductSizeChart
        const sizeChart = getProductSizeChart({
            NOMBRE: nombreBase,
            Descripcion: nombreBase,
            Subrubro: subrubro,
        });

        return sizeChart || undefined;
    }

    /**
     * Obtiene la imagen de indicaciones de bordados
     * Solo 4 tipos: superiores, pantalon-jean, pantalon-chino, pantalon-cargo
     */
    private getBordadosImage(bordadosSlug?: string, subrubro?: string): string | undefined {
        if (!bordadosSlug) {
            // Si no hay slug, determinar por subrubro
            const subrubroLower = subrubro?.toLowerCase() || '';
            
            // Superiores: buzo, camisa, tejido, chomba, remera, campera
            const superiores = ['buzo', 'camisa', 'tejido', 'chomba', 'remera', 'campera'];
            if (superiores.some(s => subrubroLower.includes(s))) {
                return `${this.BORDADOS_BASE_URL}/superiores.jpg`;
            }

            // Pantalones
            if (subrubroLower.includes('jean')) {
                return `${this.BORDADOS_BASE_URL}/pantalon-jean.jpg`;
            }
            if (subrubroLower.includes('chino')) {
                return `${this.BORDADOS_BASE_URL}/pantalon-chino.jpg`;
            }
            if (subrubroLower.includes('cargo')) {
                return `${this.BORDADOS_BASE_URL}/pantalon-cargo.jpg`;
            }

            // Default: superiores
            return `${this.BORDADOS_BASE_URL}/superiores.jpg`;
        }

        // Construir path: /imgs/bordados/{slug}.jpg
        return `${this.BORDADOS_BASE_URL}/${bordadosSlug}.jpg`;
    }

    /**
     * Normaliza rubro: PRODUCTO WORKWEAR → WORKWEAR, PRODUCTO OFFICE → BASIC
     * IMPORTANTE: 
     * - Si contiene "WORKWEAR" → WORKWEAR
     * - Si contiene "OFFICE" → BASIC
     * - Si no contiene ninguno, lanzar error (no debería pasar en el CSV)
     */
    private normalizeRubro(rubro: string): 'WORKWEAR' | 'BASIC' {
        if (!rubro || !rubro.trim()) {
            console.error('[normalizeRubro] ERROR: Rubro vacío o nulo');
            return 'BASIC'; // Fallback
        }
        
        const rubroUpper = rubro.toUpperCase().trim();
        
        // Verificar WORKWEAR primero (más específico)
        if (rubroUpper.includes('WORKWEAR')) {
            return 'WORKWEAR';
        }
        
        // Todo lo que contenga OFFICE se mapea a BASIC
        if (rubroUpper.includes('OFFICE')) {
            return 'BASIC';
        }
        
        // Si contiene BASIC explícitamente, también es BASIC
        if (rubroUpper.includes('BASIC')) {
            return 'BASIC';
        }
        
        // Si no coincide con nada, es un error - no debería pasar
        console.error(`[normalizeRubro] ERROR: Rubro desconocido "${rubro}" - no contiene WORKWEAR ni OFFICE`);
        return 'BASIC'; // Fallback por seguridad
    }

    /**
     * Convierte ProductV2Raw a ProductV2
     */
    private mapRawToProduct(raw: ProductV2Raw): ProductV2 {
        // Normalizar género en el item antes de procesar
        const itemNormalizado = this.normalizeGenero(raw.item);
        
        const nombreBase = this.extractNombreBase(itemNormalizado);
        const precioLista = this.parsePrecio(raw.precioLista);
        const precioTransfer = raw.precioTransfer ? this.parsePrecio(raw.precioTransfer) : undefined;
        const precioSImp = raw.precioSImp ? this.parsePrecio(raw.precioSImp) : undefined;
        const precio3cuotas = raw.precio3cuotas ? this.parsePrecio(raw.precio3cuotas) : undefined;
        const talle = this.extractTalle(itemNormalizado);
        const color = this.extractColor(itemNormalizado);
        
        // Debug: verificar que el rubro se lea correctamente
        if (process.env.NODE_ENV === 'development' && raw.codigo && raw.codigo.includes('WW')) {
            console.log(`[mapRawToProduct] Producto ${raw.codigo}: rubro="${raw.rubro}"`);
        }
        
        const rubroNormalizado = this.normalizeRubro(raw.rubro);
        
        // Debug: verificar normalización
        if (process.env.NODE_ENV === 'development' && raw.codigo && raw.codigo.includes('WW')) {
            console.log(`[mapRawToProduct] Producto ${raw.codigo}: rubro="${raw.rubro}" → normalizado="${rubroNormalizado}"`);
        }
        
        // Parsear imágenes directamente del CSV
        const imagenes = this.parseFotos(raw.fotos);
        const imagen = imagenes.length > 0 ? imagenes[0] : undefined;

        return {
            codigo: raw.codigo,
            item: itemNormalizado, // Usar item normalizado
            rubro: raw.rubro,
            subrubro: raw.subrubro,
            deposito: raw.deposito,
            stock: raw.stock,
            precioLista,
            precioTransfer,
            precioSImp,
            precio3cuotas,
            nombreBase,
            imagenes, // Leer directamente del CSV
            imagen,   // Primera imagen del CSV
            tablaTallesImage: this.getTablaTallesImage(raw.talles, raw.subrubro, nombreBase),
            indicacionesBordadosImage: this.getBordadosImage(raw.bordados, raw.subrubro),
            talle,
            color,
            rubroNormalizado, // PRODUCTO OFFICE → BASIC, PRODUCTO WORKWEAR → WORKWEAR
            descripcion: raw.descripcion,
            textiles: raw.textiles,
        };
    }

    /**
     * Lee y parsea el archivo CSV desde public/product.csv vía API
     */
    async loadProductsFromCSV(): Promise<ProductV2[]> {
        try {
            console.log('[ProductsV2Service] Cargando productos desde /api/products-v2...');
            
            // Cargar desde API endpoint
            const response = await fetch('/api/products-v2');
            
            console.log('[ProductsV2Service] Response status:', response.status, response.statusText);
            
            if (!response.ok) {
                if (response.status === 404) {
                    console.warn('[ProductsV2Service] Endpoint /api/products-v2 no encontrado, intentando carga directa...');
                    // Fallback: intentar carga directa (puede no funcionar en producción)
                    return this.loadProductsFromCSVDirect();
                }
                const errorText = await response.text();
                console.error('[ProductsV2Service] Error response:', errorText);
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('[ProductsV2Service] Data recibida:', {
                success: data.success,
                total: data.total,
                cached: data.cached,
                dataLength: Array.isArray(data.data) ? data.data.length : 'no es array'
            });

            if (!data.success) {
                throw new Error(data.error || 'Error desconocido al cargar productos');
            }

            if (!Array.isArray(data.data)) {
                console.error('[ProductsV2Service] data.data no es un array:', typeof data.data, data.data);
                throw new Error('Los datos recibidos no son un array');
            }

            // Mapear a ProductV2Raw
            const productsRaw: ProductV2Raw[] = data.data;
            console.log('[ProductsV2Service] Productos raw:', productsRaw.length);

            if (productsRaw.length === 0) {
                console.warn('[ProductsV2Service] No se encontraron productos en el CSV');
                return [];
            }

            // Convertir a ProductV2
            const products = productsRaw.map(raw => this.mapRawToProduct(raw));
            console.log('[ProductsV2Service] Productos procesados:', products.length);
            
            // Debug: contar productos por rubro normalizado
            const rubrosCount = products.reduce((acc, p) => {
                const rubro = p.rubroNormalizado || 'SIN_RUBRO';
                acc[rubro] = (acc[rubro] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);
            console.log('[ProductsV2Service] Productos por rubro normalizado:', rubrosCount);
            
            return products;
        } catch (error) {
            console.error('[ProductsV2Service] Error al cargar productos desde CSV:', error);
            throw error;
        }
    }

    /**
     * Fallback: carga directa del CSV (solo funciona en desarrollo)
     */
    private async loadProductsFromCSVDirect(): Promise<ProductV2[]> {
        try {
            // Leer archivo desde public/product.csv
            const response = await fetch('/product.csv');
            if (!response.ok) {
                throw new Error(`Error al cargar product.csv: ${response.statusText}`);
            }

            // Leer como array buffer para XLSX
            const arrayBuffer = await response.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { 
                type: 'array',
                raw: false,
                dateNF: 'yyyy-mm-dd',
            });

            // Leer primera hoja
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const rawData = XLSX.utils.sheet_to_json(sheet, { 
                defval: null,
                raw: false,
            });

            // Mapear a ProductV2Raw (normalizar nombres de columnas)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const productsRaw: ProductV2Raw[] = rawData.map((row: any) => ({
                codigo: String(row.codigo || row.Codigo || row.CODIGO || '').trim(),
                item: String(row.item || row.Item || row.ITEM || '').trim(),
                rubro: String(row.rubro || row.Rubro || row.RUBRO || '').trim(),
                subrubro: String(row.subrubro || row.Subrubro || row.SUBRUBRO || '').trim(),
                deposito: String(row.deposito || row.Depósito || row.DEPOSITO || '').trim(),
                stock: Number(row.stock || row.Stock || row.STOCK || row.Existencia || row.EXISTENCIA || 0),
                precioLista: String(row.precioLista || row.PrecioLista || row['PRECIO DE LISTA'] || row['precioLista'] || '0'),
                fotos: row.fotos || row.Fotos || row.FOTOS ? String(row.fotos || row.Fotos || row.FOTOS) : undefined,
                talles: row.talles || row.Talles || row.TALLES ? String(row.talles || row.Talles || row.TALLES) : undefined,
                bordados: row.bordados || row.Bordados || row.BORDADOS ? String(row.bordados || row.Bordados || row.BORDADOS) : undefined,
            })).filter((p: ProductV2Raw) => p.codigo && p.item); // Filtrar filas vacías

            // Convertir a ProductV2
            return productsRaw.map(raw => this.mapRawToProduct(raw));
        } catch (error) {
            console.error('Error en carga directa de CSV:', error);
            throw error;
        }
    }

    /**
     * Agrupa productos por nombre base (misma lógica que antes)
     * Las imágenes se leen directamente del CSV
     */
    groupProductsByVariants(products: ProductV2[]): GroupedProductV2[] {
        const groupsMap = new Map<string, ProductV2[]>();

        // Agrupar por nombre base
        products.forEach(product => {
            const groupKey = product.nombreBase.trim();
            
            if (!groupsMap.has(groupKey)) {
                groupsMap.set(groupKey, []);
            }

            groupsMap.get(groupKey)!.push(product);
        });

        // Convertir a GroupedProductV2[]
        const groupedProducts: GroupedProductV2[] = [];

        // Procesar cada grupo de productos
        for (const [nombreBase, variants] of groupsMap.entries()) {
            // Ordenar variantes
            const sortedVariants = variants.sort((a, b) => {
                // Ordenar por talle si existe
                if (a.talle && b.talle) {
                    const talleOrder = ['2XS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];
                    const aIndex = talleOrder.indexOf(a.talle);
                    const bIndex = talleOrder.indexOf(b.talle);
                    if (aIndex !== -1 && bIndex !== -1) {
                        return aIndex - bIndex;
                    }
                }
                return a.codigo.localeCompare(b.codigo);
            });

            const primerProducto = sortedVariants[0];
            const skuBaseSlug = this.nombreToSlug(nombreBase);

            // Extraer colores y talles únicos
            const coloresSet = new Set<string>();
            const tallesSet = new Set<string>();

            sortedVariants.forEach(v => {
                if (v.color) coloresSet.add(v.color);
                if (v.talle) tallesSet.add(v.talle);
            });

            const availableColors = Array.from(coloresSet);
            const availableSizes = Array.from(tallesSet);

            // Organizar imágenes por color para que cambien cuando se selecciona un color
            // Mapa: color -> Set de imágenes (para evitar duplicados)
            const imagenesPorColorSet = new Map<string, Set<string>>();
            const todasLasImagenes = new Set<string>();
            
            sortedVariants.forEach(v => {
                if (v.color && v.imagenes && v.imagenes.length > 0) {
                    // Agrupar imágenes por color
                    const color = v.color; // Guardar en constante para type safety
                    if (!imagenesPorColorSet.has(color)) {
                        imagenesPorColorSet.set(color, new Set<string>());
                    }
                    // Solo agregar imágenes de la primera variante de cada color para evitar duplicados
                    // Todas las variantes del mismo color deberían tener las mismas imágenes
                    const colorSet = imagenesPorColorSet.get(color)!;
                    v.imagenes.forEach(img => {
                        if (!colorSet.has(img)) {
                            colorSet.add(img);
                            todasLasImagenes.add(img);
                        }
                    });
                } else if (v.imagenes && v.imagenes.length > 0) {
                    // Si no tiene color, agregar a un grupo "sin-color"
                    const noColorKey = 'sin-color';
                    if (!imagenesPorColorSet.has(noColorKey)) {
                        imagenesPorColorSet.set(noColorKey, new Set<string>());
                    }
                    const noColorSet = imagenesPorColorSet.get(noColorKey)!;
                    v.imagenes.forEach(img => {
                        if (!noColorSet.has(img)) {
                            noColorSet.add(img);
                            todasLasImagenes.add(img);
                        }
                    });
                }
            });
            
            // Convertir Sets a Arrays para el displayProduct
            const imagenesPorColor = new Map<string, string[]>();
            imagenesPorColorSet.forEach((imgSet, color) => {
                imagenesPorColor.set(color, Array.from(imgSet));
            });
            
            // Obtener todas las imágenes únicas (para el displayProduct)
            const imagenes = Array.from(todasLasImagenes);
            
            // Seleccionar imagen principal: primera imagen del primer color disponible
            let imagen: string | undefined;
            if (availableColors.length > 0 && imagenesPorColor.has(availableColors[0])) {
                const primerasImagenes = imagenesPorColor.get(availableColors[0])!;
                imagen = primerasImagenes[0];
            } else if (imagenes.length > 0) {
                imagen = imagenes[0];
            }

            // Actualizar el displayProduct con todas las imágenes
            const displayProductWithImages: ProductV2 = {
                ...primerProducto,
                imagenes,
                imagen,
            };

            // Crear variantes con imágenes organizadas por color
            const productVariants: ProductV2Variant[] = sortedVariants.map(v => {
                // Obtener imágenes específicas del color de esta variante
                let imagenesVariante = imagenes;
                let imagenVariante = imagen;
                
                if (v.color && imagenesPorColor.has(v.color)) {
                    imagenesVariante = imagenesPorColor.get(v.color)!;
                    imagenVariante = imagenesVariante[0];
                }
                
                return {
                    codigo: v.codigo,
                    talle: v.talle,
                    color: v.color,
                    stock: v.stock,
                    precioLista: v.precioLista,
                    producto: {
                        ...v,
                        imagenes: imagenesVariante, // Imágenes específicas del color
                        imagen: imagenVariante,    // Imagen principal del color
                    },
                };
            });

            groupedProducts.push({
                skuBase: nombreBase,
                skuBaseSlug,
                displayProduct: displayProductWithImages,
                variants: productVariants,
                totalVariants: productVariants.length,
                availableColors,
                availableSizes,
            });
        }

        return groupedProducts;
    }

    /**
     * Extrae rubros y subrubros únicos de los productos
     */
    extractRubrosAndSubrubros(products: ProductV2[]): { rubros: RubroV2[]; subrubros: SubrubroV2[] } {
        const rubrosMap = new Map<string, RubroV2>();
        const subrubrosMap = new Map<string, SubrubroV2>();

        products.forEach(product => {
            const rubroId = product.rubroNormalizado.toLowerCase();
            const subrubroId = this.nombreToSlug(product.subrubro);

            // Agregar rubro si no existe
            if (!rubrosMap.has(rubroId)) {
                rubrosMap.set(rubroId, {
                    id: rubroId,
                    nombre: product.rubro,
                    nombreNormalizado: product.rubroNormalizado,
                    subrubros: [],
                });
            }

            // Agregar subrubro si no existe
            if (!subrubrosMap.has(subrubroId)) {
                const subrubro: SubrubroV2 = {
                    id: subrubroId,
                    nombre: product.subrubro,
                    rubroId,
                };
                subrubrosMap.set(subrubroId, subrubro);
                
                // Agregar a rubro
                const rubro = rubrosMap.get(rubroId)!;
                if (!rubro.subrubros.find(s => s.id === subrubroId)) {
                    rubro.subrubros.push(subrubro);
                }
            }
        });

        return {
            rubros: Array.from(rubrosMap.values()),
            subrubros: Array.from(subrubrosMap.values()),
        };
    }

    /**
     * Filtra productos agrupados según filtros
     */
    filterGroupedProducts(
        groupedProducts: GroupedProductV2[],
        filters: ProductV2Filters
    ): GroupedProductV2[] {
        return groupedProducts.filter(group => {
            // Filtro por rubro
            if (filters.rubro && group.displayProduct.rubroNormalizado !== filters.rubro) {
                return false;
            }

            // Filtro por subrubro
            if (filters.subrubro) {
                const subrubroSlug = this.nombreToSlug(group.displayProduct.subrubro);
                if (subrubroSlug !== filters.subrubro) {
                    return false;
                }
            }

            // Filtro por búsqueda
            if (filters.searchTerm) {
                const searchLower = filters.searchTerm.toLowerCase();
                const matchesName = group.skuBase.toLowerCase().includes(searchLower);
                const matchesDesc = group.displayProduct.item.toLowerCase().includes(searchLower);
                const matchesCodigo = group.variants.some(v => v.codigo.toLowerCase().includes(searchLower));
                
                if (!matchesName && !matchesDesc && !matchesCodigo) {
                    return false;
                }
            }

            // Filtro por precio
            if (filters.minPrecio !== undefined) {
                const minPrecio = Math.min(...group.variants.map(v => v.precioLista));
                if (minPrecio < filters.minPrecio) {
                    return false;
                }
            }

            if (filters.maxPrecio !== undefined) {
                const maxPrecio = Math.max(...group.variants.map(v => v.precioLista));
                if (maxPrecio > filters.maxPrecio) {
                    return false;
                }
            }

            // Filtro por disponibilidad
            if (filters.disponible) {
                const tieneStock = group.variants.some(v => v.stock > 0);
                if (!tieneStock) {
                    return false;
                }
            }

            return true;
        });
    }

    /**
     * Busca un producto agrupado por código o slug
     */
    findGroupedProduct(
        groupedProducts: GroupedProductV2[],
        identifier: string
    ): GroupedProductV2 | null {
        const identifierLower = identifier.toLowerCase();

        return groupedProducts.find(group => {
            // Buscar por código
            if (group.variants.some(v => v.codigo.toLowerCase() === identifierLower)) {
                return true;
            }

            // Buscar por slug
            if (group.skuBaseSlug === identifierLower) {
                return true;
            }

            // Buscar por nombre base
            if (group.skuBase.toLowerCase() === identifierLower) {
                return true;
            }

            return false;
        }) || null;
    }
}

// Exportar instancia singleton
export const productsV2Service = new ProductsV2Service();

