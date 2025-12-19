import * as XLSX from 'xlsx';
import { ProductWithImage, ProductFilters, GroupedProduct, ProductVariant } from '../types/producto';
import { getVariantInfo } from '../data/variantMapping';
import { getProductSizeChart } from '../data/sizeMappings';

class ProductsService {

    /**
     * Lee el archivo XLS/CSV y parsea los productos
     * Procesa múltiples hojas: primera hoja tiene códigos individuales, segunda tiene descripciones agrupadas
     */
    async parseProductsFile(file: File): Promise<ProductWithImage[]> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const data = e.target?.result;
                    const workbook = XLSX.read(data, { type: 'binary' });

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
                        
                        // Debe tener link a Drive en Costo x LM
                        const tieneFotos = this.extractDriveUrl(costoXLM) !== null;
                        
                        // Debe tener "INDICACIONES" en Lista Material
                        const tieneIndicaciones = listaMaterial.includes('INDICACIONES') || listaMaterial.includes('BORDADOS');
                        
                        return tieneTablaTalles && tieneFotos && tieneIndicaciones;
                    });

                    // Hoja 2: Productos agrupados por nombre (con descripciones)
                    // IMPORTANTE: Todos los productos están en la columna "PRODUCTOS WORKWEAR"
                    // Los productos BASIC vienen después de una fila separadora que dice "PRODUCTOS BASIC"
                    let productosAgrupados: any[] = [];
                    if (workbook.SheetNames.length > 1) {
                        const sheet2 = workbook.Sheets[workbook.SheetNames[1]];
                        // Leer como JSON
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
                                // Mapear las columnas a nombres más legibles
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

                    // Procesar productos agrupados y combinar con datos individuales
                    // La segunda hoja tiene: NOMBRE, DESCRICPION, TALLES, COLORES, TEXTIL, FOTO, TABLA DE TALLES, LINK, DATO DE BORDADO
                    const products: ProductWithImage[] = [];
                    
                    productosAgrupados.forEach((rowAgrupado: any) => {
                        const nombre = this.sanitizeString(rowAgrupado.NOMBRE || rowAgrupado.nombre);
                        if (!nombre) return;

                        const descripcion = this.sanitizeString(rowAgrupado.DESCRICPION || rowAgrupado.DESCRIPCION || rowAgrupado.descripcion);
                        
                        // Buscar todos los productos de la hoja 1 que contengan este NOMBRE en su Descripcion
                        const nombreUpper = nombre.toUpperCase();

                        // Extraer las 2 primeras palabras significativas del nombre
                        const palabrasNombre = nombreUpper.split(/\s+/).filter((p: string) => p.length > 2);
                        const palabrasPrincipales = palabrasNombre.slice(0, 2);

                        const productosCoincidentes = productosIndividuales.filter((prod: any) => {
                            const prodDesc = String(prod.Descripcion || '').toUpperCase();

                            // Estrategia 1: Coincidencia exacta del nombre completo
                            if (prodDesc.includes(nombreUpper)) {
                                return true;
                            }

                            // Estrategia 2: Las 2 primeras palabras principales deben estar en la descripción
                            if (palabrasPrincipales.length >= 2) {
                                const todasLasPalabrasCoinciden = palabrasPrincipales.every((palabra: string) =>
                                    prodDesc.includes(palabra)
                                );

                                if (todasLasPalabrasCoinciden) {
                                    // Verificar género si está en el nombre
                                    const tieneGenero = nombreUpper.includes('HOMBRE') || nombreUpper.includes('DAMA') || nombreUpper.includes('UNISEX');

                                    if (tieneGenero) {
                                        const generoCoincide =
                                            (nombreUpper.includes('HOMBRE') && prodDesc.includes('HOMBRE')) ||
                                            (nombreUpper.includes('DAMA') && prodDesc.includes('DAMA')) ||
                                            (nombreUpper.includes('UNISEX') && prodDesc.includes('UNISEX'));

                                        return generoCoincide;
                                    }

                                    return true;
                                }
                            }

                            // Estrategia 3: Buscar en columna Costo x LM
                            const costoXLM = String(prod['Costo x LM'] || '').toUpperCase();
                            if (costoXLM === nombreUpper || costoXLM.includes(nombreUpper)) {
                                return true;
                            }

                            return false;
                        });

                        // Para cada producto coincidente, combinar con datos de la hoja 2
                        productosCoincidentes.forEach((productoIndividual: any) => {
                            // Obtener imagen de talles correspondiente automáticamente
                            const tablaTallesImage = getProductSizeChart({
                                NOMBRE: nombre,
                                Descripcion: productoIndividual.Descripcion,
                                Subrubro: productoIndividual.Subrubro,
                                DescripcionCorta: productoIndividual.DescripcionCorta
                            });

                            const productoCombinado = {
                                ...productoIndividual,
                                Descripcion: descripcion || productoIndividual.Descripcion || nombre,
                                DescripcionCorta: descripcion || productoIndividual.DescripcionCorta || nombre,
                                Material: this.sanitizeString(rowAgrupado.TEXTIL || productoIndividual.Material),
                                tablaTallesUrl: this.extractSheetUrl(rowAgrupado['TABLA DE TALLES'] || productoIndividual['Ult. Actualizacion'] || productoIndividual['Ult Actualizacion']),
                                tablaTallesImage: tablaTallesImage, // Imagen de talles local
                                fotosDriveUrl: this.extractDriveUrl(rowAgrupado.FOTO || productoIndividual['Costo x LM']),
                                indicacionesBordadosUrl: this.extractDocUrl(rowAgrupado['DATO DE BORDADO'] || productoIndividual['Lista Material']),
                                NOMBRE: nombre,
                                TALLES: this.sanitizeString(rowAgrupado.TALLES),
                                COLORES: this.sanitizeString(rowAgrupado.COLORES),
                            };
                            products.push(this.mapRowToProduct(productoCombinado));
                        });
                    });

                    // Si no hay productos (no hay hoja 2 o no hay coincidencias), no devolver nada
                    // porque necesitamos la hoja 2 para agrupar correctamente

                    resolve(products);
                } catch (error) {
                    reject(new Error(`Error al parsear el archivo: ${error}`));
                }
            };

            reader.onerror = () => {
                reject(new Error('Error al leer el archivo'));
            };

            reader.readAsBinaryString(file);
        });
    }

    /**
     * Extrae URL de Google Sheet desde una celda
     */
    private extractSheetUrl(cellValue: any): string | null {
        if (!cellValue) return null;
        
        const str = String(cellValue).trim();
        
        // Si contiene "TABLAS DE TALLE" o similar, usar la URL fija
        if (str.toUpperCase().includes('TALLE') || str.toUpperCase().includes('TABLA')) {
            return 'https://docs.google.com/spreadsheets/d/1cBzB_iVwtJF1UhizX8ZtwZJhyFzX6LEdwQiQCo7dH08/edit';
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
     * Extrae URL de Drive desde una celda
     */
    private extractDriveUrl(cellValue: any): string | null {
        if (!cellValue) return null;
        
        const str = String(cellValue).trim();
        if (!str || str.length === 0) return null;
        
        // Patrón 1: URL completa de Drive folders
        const drivePattern1 = /https?:\/\/drive\.google\.com\/drive\/folders\/([a-zA-Z0-9_-]+)/;
        const match1 = str.match(drivePattern1);
        if (match1) {
            return `https://drive.google.com/drive/folders/${match1[1]}`;
        }
        
        // Patrón 2: URL de compartir
        const drivePattern2 = /https?:\/\/drive\.google\.com\/[^/]+\/d\/([a-zA-Z0-9_-]+)/;
        const match2 = str.match(drivePattern2);
        if (match2) {
            return `https://drive.google.com/drive/folders/${match2[1]}`;
        }
        
        // Patrón 3: Solo el ID del folder
        if (/^[a-zA-Z0-9_-]{20,}$/.test(str)) {
            return `https://drive.google.com/drive/folders/${str}`;
        }
        
        return null;
    }

    /**
     * Extrae URL de Google Doc desde una celda
     */
    private extractDocUrl(cellValue: any): string | null {
        if (!cellValue) return null;
        
        const str = String(cellValue).trim();
        
        // Si contiene "INDICACIONES" o "BORDADOS", usar la URL fija
        if (str.toUpperCase().includes('INDICACIONES') || str.toUpperCase().includes('BORDADOS')) {
            return 'https://docs.google.com/document/d/1jDEk526GzUjEsFaidhsJyfdnyhYq25Ag9WOK9UR-fbc/edit';
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
     * Mapea una fila del Excel/CSV a nuestro tipo ProductWithImage
     */
    private mapRowToProduct(row: any): ProductWithImage {
        return {
            Codigo: this.sanitizeString(row.Codigo) || '',
            Tipo: this.sanitizeString(row.Tipo),
            Descripcion: this.sanitizeString(row.Descripcion),
            UM: this.sanitizeString(row.UM),
            Rubro: this.sanitizeString(row.Rubro),
            Subrubro: this.sanitizeString(row.Subrubro),
            Activo: this.parseBoolean(row.Activo),
            Moneda: this.sanitizeString(row.Moneda),
            PrecioCosto: this.parseNumber(row.PrecioCosto),
            UltActualizacion: this.sanitizeString(row.UltActualizacion),
            CostoXLM: this.parseNumber(row.CostoXLM),
            ListaMaterial: this.sanitizeString(row.ListaMaterial),
            PrecioUMCompra: this.parseNumber(row.PrecioUMCompra),
            UMCompra: this.sanitizeString(row.UMCompra),
            PrecioVenta: this.parseNumber(row.PrecioVenta),
            UtilidadP: this.parseNumber(row.UtilidadP),
            UtilidadR: this.parseNumber(row.UtilidadR),
            Base: this.sanitizeString(row.Base),
            Barcode: this.sanitizeString(row.Barcode),
            EqCodigoContable: this.sanitizeString(row.EqCodigoContable),
            EqCodigoExterno: this.sanitizeString(row.EqCodigoExterno),
            ItemDeCompra: this.parseBoolean(row.ItemDeCompra),
            ItemDeVenta: this.parseBoolean(row.ItemDeVenta),
            ItemDeAlquiler: this.parseBoolean(row.ItemDeAlquiler),
            Fabricar: this.parseBoolean(row.Fabricar),
            APedido: this.parseBoolean(row.APedido),
            GrupoGasto: this.sanitizeString(row.GrupoGasto),
            CTACompras: this.sanitizeString(row.CTACompras),
            CTAVentas: this.sanitizeString(row.CTAVentas),
            StockMin: this.parseNumber(row.StockMin),
            StockMax: this.parseNumber(row.StockMax),
            PesoBruto: this.parseNumber(row.PesoBruto),
            DescripcionCorta: this.sanitizeString(row.DescripcionCorta),
            Observaciones: this.sanitizeString(row.Observaciones),
            ProveedorPorDefecto: this.sanitizeString(row.ProveedorPorDefecto),
            DepositoConsumo: this.sanitizeString(row.DepositoConsumo),
            Ubicacion: this.sanitizeString(row.Ubicacion),
            ItemLote: this.parseBoolean(row.ItemLote),
            ItemSerie: this.parseBoolean(row.ItemSerie),
            Clase: this.sanitizeString(row.Clase),
            Linea: this.sanitizeString(row.Linea),
            Material: this.sanitizeString(row.Material),
            ActPrecioXOC: this.parseBoolean(row.ActPrecioXOC),
            FlowintSincroEnabled: this.parseBoolean(row.FlowintSincroEnabled),
            Usuario: this.sanitizeString(row.Usuario),
            FechaAlta: this.sanitizeString(row.FechaAlta),
            // Agregar imagen placeholder hasta que tengamos las reales
            imagen: null,
            imagenPlaceholder: undefined,
            // Enlaces a recursos externos (ya extraídos en parseProductsFile)
            tablaTallesUrl: (row as any).tablaTallesUrl || null,
            tablaTallesImage: (row as any).tablaTallesImage || null, // Imagen de talles local
            fotosDriveUrl: (row as any).fotosDriveUrl || null,
            indicacionesBordadosUrl: (row as any).indicacionesBordadosUrl || null,
        };
    }

    /**
     * Helpers para sanitizar datos
     */
    private sanitizeString(value: any): string | null {
        if (value === undefined || value === null || value === '') return null;
        return String(value).trim();
    }

    private parseNumber(value: any): number | null {
        if (value === undefined || value === null || value === '') return null;
        const num = Number(value);
        return isNaN(num) ? null : num;
    }

    /**
     * Parsea un precio que puede venir como string con formato de moneda
     * Ejemplo: "$35,900.00" → 35900
     */
    private parsePrecio(precioStr: string | number | undefined | null): number | undefined {
        if (precioStr === undefined || precioStr === null || precioStr === '') return undefined;
        
        // Si ya es un número, retornarlo
        if (typeof precioStr === 'number') return precioStr;
        
        // Si es string, limpiar símbolos y comas
        const cleaned = String(precioStr)
            .replace(/[$\s]/g, '')
            .replace(/,/g, '')
            .trim();
        
        const parsed = parseFloat(cleaned);
        return isNaN(parsed) ? undefined : parsed;
    }

    /**
     * Asegura que una URL de imagen sea relativa (local)
     * Convierte URLs absolutas de Ferozo a rutas relativas
     */
    private ensureRelativeImageUrl(url: string | null): string | null {
        if (!url) return null;
        
        const urlStr = String(url).trim();
        if (!urlStr) return null;
        
        // Si ya es una ruta relativa (empieza con /), devolverla tal cual
        if (urlStr.startsWith('/')) {
            return urlStr;
        }
        
        // Si es una URL absoluta (http/https), extraer la ruta relativa
        const absoluteUrlPattern = /https?:\/\/[^\/]+(\/.*)/;
        const match = urlStr.match(absoluteUrlPattern);
        if (match && match[1]) {
            return match[1]; // Devolver solo la ruta relativa
        }
        
        // Si no empieza con /, agregarlo
        return urlStr.startsWith('/') ? urlStr : `/${urlStr}`;
    }

    private parseBoolean(value: any): boolean | null {
        if (value === undefined || value === null || value === '') return null;
        if (typeof value === 'boolean') return value;
        const str = String(value).toLowerCase().trim();
        if (str === 'true' || str === '1' || str === 'sí' || str === 'si') return true;
        if (str === 'false' || str === '0' || str === 'no') return false;
        return null;
    }

    /**
     * Filtra productos según criterios
     */
    filterProducts(
        products: ProductWithImage[],
        filters: ProductFilters
    ): ProductWithImage[] {
        return products.filter((product) => {
            // Filtro por rubro
            if (filters.rubro && product.Rubro !== filters.rubro) {
                return false;
            }

            // Filtro por subrubro
            if (filters.subrubro && product.Subrubro !== filters.subrubro) {
                return false;
            }

            // Filtro por activo
            if (filters.activo !== undefined && product.Activo !== filters.activo) {
                return false;
            }

            // Filtro por item de venta
            if (filters.itemDeVenta !== undefined && product.ItemDeVenta !== filters.itemDeVenta) {
                return false;
            }

            // Filtro por búsqueda de texto
            if (filters.searchTerm) {
                const searchLower = filters.searchTerm.toLowerCase();
                const matchesSearch =
                    product.Codigo?.toLowerCase().includes(searchLower) ||
                    product.Descripcion?.toLowerCase().includes(searchLower) ||
                    product.DescripcionCorta?.toLowerCase().includes(searchLower) ||
                    product.Rubro?.toLowerCase().includes(searchLower);

                if (!matchesSearch) return false;
            }

            return true;
        });
    }

    /**
     * Obtiene rubros únicos de los productos
     */
    getUniqueRubros(products: ProductWithImage[]): string[] {
        const rubros = products
            .map((p) => p.Rubro)
            .filter((r): r is string => r !== null && r !== undefined);
        return Array.from(new Set(rubros)).sort();
    }

    /**
     * Obtiene subrubros únicos de los productos
     */
    getUniqueSubrubros(products: ProductWithImage[]): string[] {
        const subrubros = products
            .map((p) => p.Subrubro)
            .filter((s): s is string => s !== null && s !== undefined);
        return Array.from(new Set(subrubros)).sort();
    }

    /**
     * Busca un producto por código
     */
    findProductByCode(products: ProductWithImage[], code: string): ProductWithImage | undefined {
        return products.find((p) => p.Codigo === code);
    }

    /**
     * Guarda productos en localStorage (para persistencia temporal)
     */
    saveProductsToLocalStorage(products: ProductWithImage[]): void {
        try {
            localStorage.setItem('ntds_products', JSON.stringify(products));
            localStorage.setItem('ntds_products_updated', new Date().toISOString());
        } catch (error) {
            // Error silencioso al guardar en localStorage
        }
    }

    /**
     * Carga productos desde localStorage
     */
    loadProductsFromLocalStorage(): ProductWithImage[] | null {
        try {
            const stored = localStorage.getItem('ntds_products');
            if (!stored) return null;
            return JSON.parse(stored);
        } catch (error) {
            return null;
        }
    }

    /**
     * Carga productos desde la API (Google Sheets)
     */
    async loadProductsFromAPI(): Promise<ProductWithImage[] | null> {
        try {
            const response = await fetch('/api/products');
            
            if (!response.ok) {
                // Si es 404, la API no existe, retornar null silenciosamente
                if (response.status === 404) {
                    return null;
                }
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (!data.success || !data.data) {
                throw new Error(data.error || 'Error desconocido');
            }

            // Convertir los datos agrupados a array plano de productos
            // El API devuelve productos agrupados, pero necesitamos el array plano
            const products: ProductWithImage[] = [];
            
            if (Array.isArray(data.data)) {
                // Si es array de grupos, extraer todos los productos
                data.data.forEach((group: any) => {
                    if (group.variants && Array.isArray(group.variants)) {
                        group.variants.forEach((variant: any) => {
                            products.push(this.mapApiProductToProductWithImage(variant));
                        });
                    } else if (group.displayProduct) {
                        products.push(this.mapApiProductToProductWithImage(group.displayProduct));
                    }
                });
            } else if (Array.isArray(data.data.variants)) {
                // Si es un solo grupo
                data.data.variants.forEach((variant: any) => {
                    products.push(this.mapApiProductToProductWithImage(variant));
                });
            }

            return products.length > 0 ? products : null;
        } catch (error) {
            return null;
        }
    }

    /**
     * Mapea un producto de la API a ProductWithImage
     */
    private mapApiProductToProductWithImage(apiProduct: any): ProductWithImage {
        return {
            Codigo: this.sanitizeString(apiProduct.Codigo) || '',
            Tipo: this.sanitizeString(apiProduct.Tipo),
            Descripcion: this.sanitizeString(apiProduct.Descripcion || apiProduct.descripcionDetallada),
            UM: this.sanitizeString(apiProduct.UM),
            Rubro: this.sanitizeString(apiProduct.Rubro),
            Subrubro: this.sanitizeString(apiProduct.Subrubro),
            Activo: this.parseBoolean(apiProduct.Activo),
            Moneda: this.sanitizeString(apiProduct.Moneda),
            PrecioCosto: this.parseNumber(apiProduct.PrecioCosto),
            UltActualizacion: this.sanitizeString(apiProduct.UltActualizacion),
            CostoXLM: this.parseNumber(apiProduct.CostoXLM),
            ListaMaterial: this.sanitizeString(apiProduct.ListaMaterial),
            PrecioUMCompra: this.parseNumber(apiProduct.PrecioUMCompra),
            UMCompra: this.sanitizeString(apiProduct.UMCompra),
            PrecioVenta: this.parseNumber(apiProduct.PrecioVenta),
            UtilidadP: this.parseNumber(apiProduct.UtilidadP),
            UtilidadR: this.parseNumber(apiProduct.UtilidadR),
            Base: this.sanitizeString(apiProduct.Base),
            Barcode: this.sanitizeString(apiProduct.Barcode),
            EqCodigoContable: this.sanitizeString(apiProduct.EqCodigoContable),
            EqCodigoExterno: this.sanitizeString(apiProduct.EqCodigoExterno),
            ItemDeCompra: this.parseBoolean(apiProduct.ItemDeCompra),
            ItemDeVenta: this.parseBoolean(apiProduct.ItemDeVenta),
            ItemDeAlquiler: this.parseBoolean(apiProduct.ItemDeAlquiler),
            Fabricar: this.parseBoolean(apiProduct.Fabricar),
            APedido: this.parseBoolean(apiProduct.APedido),
            GrupoGasto: this.sanitizeString(apiProduct.GrupoGasto),
            CTACompras: this.sanitizeString(apiProduct.CTACompras),
            CTAVentas: this.sanitizeString(apiProduct.CTAVentas),
            StockMin: this.parseNumber(apiProduct.StockMin),
            StockMax: this.parseNumber(apiProduct.StockMax),
            PesoBruto: this.parseNumber(apiProduct.PesoBruto),
            DescripcionCorta: this.sanitizeString(apiProduct.DescripcionCorta),
            Observaciones: this.sanitizeString(apiProduct.Observaciones),
            ProveedorPorDefecto: this.sanitizeString(apiProduct.ProveedorPorDefecto),
            DepositoConsumo: this.sanitizeString(apiProduct.DepositoConsumo),
            Ubicacion: this.sanitizeString(apiProduct.Ubicacion),
            ItemLote: this.parseBoolean(apiProduct.ItemLote),
            ItemSerie: this.parseBoolean(apiProduct.ItemSerie),
            Clase: this.sanitizeString(apiProduct.Clase),
            Linea: this.sanitizeString(apiProduct.Linea),
            Material: this.sanitizeString(apiProduct.Material || apiProduct.textil),
            ActPrecioXOC: this.parseBoolean(apiProduct.ActPrecioXOC),
            FlowintSincroEnabled: this.parseBoolean(apiProduct.FlowintSincroEnabled),
            Usuario: this.sanitizeString(apiProduct.Usuario),
            FechaAlta: this.sanitizeString(apiProduct.FechaAlta),
            // Enlaces a recursos externos
            tablaTallesUrl: this.sanitizeString(apiProduct.tablaTallesUrl),
            tablaTallesImage: this.sanitizeString(apiProduct.tablaTallesImage), // Imagen de talles local
            fotosDriveUrl: this.sanitizeString(apiProduct.fotosDriveUrl),
            indicacionesBordadosUrl: this.sanitizeString(apiProduct.indicacionesBordadosUrl),
            // Imágenes (usar las que vienen del API, pero asegurar que sean rutas relativas)
            imagen: this.ensureRelativeImageUrl(this.sanitizeString(apiProduct.imagen)),
            imagenes: Array.isArray(apiProduct.imagenes) 
                ? apiProduct.imagenes
                    .filter((img: any) => img)
                    .map((img: any) => this.ensureRelativeImageUrl(String(img)))
                : undefined,
            imagenPlaceholder: undefined,
            // Campos adicionales de la hoja 2
            NOMBRE: this.sanitizeString(apiProduct.NOMBRE) || undefined,
            TALLES: this.sanitizeString(apiProduct.TALLES) || undefined,
            COLORES: this.sanitizeString(apiProduct.COLORES) || undefined,
            // Campos de precios adicionales del CSV
            precioTransfer: this.parsePrecio(apiProduct.precioTransfer),
            precio3cuotas: this.parsePrecio(apiProduct.precio3cuotas),
            precioSImp: this.parsePrecio(apiProduct.precioSImp),
        };
    }

    /**
     * Limpia el cache de productos
     */
    clearProductsCache(): void {
        localStorage.removeItem('ntds_products');
        localStorage.removeItem('ntds_products_updated');
    }

    /**
     * Extrae el SKU base de un código de producto
     * Ejemplos:
     *   L-OF-BU-RCON24 -> L-OF-BU-RCON
     *   L-OF-TEJ-CAR-CHA18 -> L-OF-TEJ-CAR-CHA
     *   L-OF-PAN-CCOZY14 -> L-OF-PAN-CCOZY
     */
    private extractSkuBase(codigo: string): string {
        if (!codigo) return codigo;

        // Buscar el patrón: todo excepto los números finales
        const match = codigo.match(/^(.+?)(\d+)$/);

        if (match) {
            return match[1]; // Retorna todo menos los números finales
        }

        // Si no hay números al final, retornar el código completo
        return codigo;
    }

    /**
     * Extrae el número de variante de un código
     */
    private extractVariantNumber(codigo: string): number {
        if (!codigo) return 0;

        const match = codigo.match(/(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
    }

    /**
     * Normaliza un nombre para comparación (sin acentos, lowercase, sin espacios extra)
     * Igual que en el backend para mantener consistencia
     */
    private normalizarNombre(nombre: string): string {
        if (!nombre) return '';
        return nombre
            .toLowerCase()
            .normalize('NFD') // Normaliza caracteres acentuados
            .replace(/[\u0300-\u036f]/g, '') // Elimina diacríticos
            .trim()
            .replace(/\s+/g, ' '); // Reemplaza múltiples espacios con uno solo
    }

    /**
     * Extrae el sexo de un nombre y lo normaliza
     * Detecta: "D" -> "Dama" -> "Mujer", "H" -> "Hombre", etc.
     * IMPORTANTE: Normaliza "D" y "Dama" de la misma manera para unificar productos
     */
    private extraerYNormalizarSexo(nombre: string): { nombreSinSexo: string; sexo: string | null } {
        const nombreLower = nombre.toLowerCase();
        let sexo: string | null = null;
        let nombreSinSexo = nombre;
        
        // PRIMERO: Buscar palabras completas de sexo (prioridad sobre abreviaciones)
        // Esto asegura que "Dama" se procese antes que "D" para evitar conflictos
        const palabrasSexo = ['hombre', 'mujer', 'dama', 'damas', 'unisex', 'niño', 'niña'];
        
        let encontroPalabraCompleta = false;
        for (const s of palabrasSexo) {
            const regex = new RegExp(`\\b${s}\\b`, 'gi');
            if (regex.test(nombreLower)) {
                // Normalizar: "dama" o "damas" -> "mujer"
                if (s === 'dama' || s === 'damas') {
                    sexo = 'Mujer';
                } else {
                    sexo = s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
                }
                nombreSinSexo = nombre.replace(regex, '').trim().replace(/\s+/g, ' ');
                encontroPalabraCompleta = true;
                break;
            }
        }
        
        // SEGUNDO: Si no encontró palabra completa, buscar abreviaciones (D, H)
        // Solo si NO hay palabra completa de sexo ya detectada
        if (!encontroPalabraCompleta) {
            // Buscar " D " o " D" al final (D = Dama)
            // IMPORTANTE: Verificar que no haya "DAMA" ya que puede estar en otra parte
            if (/\bD\b/.test(nombre) && !/\bDAMA\b/i.test(nombre)) {
                sexo = 'Mujer';
                nombreSinSexo = nombre.replace(/\bD\b/gi, '').trim().replace(/\s+/g, ' ');
            }
            // Buscar " H " o " H" al final (H = Hombre)
            else if (/\bH\b/.test(nombre) && !/\bHOMBRE\b/i.test(nombre)) {
                sexo = 'Hombre';
                nombreSinSexo = nombre.replace(/\bH\b/gi, '').trim().replace(/\s+/g, ' ');
            }
        }
        
        return { nombreSinSexo, sexo };
    }

    /**
     * Extrae el nombre base de una descripción (sin talle, color, etc.)
     * Ejemplo: "Remera Gentle Dama NEGRO XS" -> "Remera Gentle Dama"
     */
    private extractNombreBase(descripcion: string | null): string | null {
        if (!descripcion) return null;

        // Remover talles comunes al final
        const talles = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '2XL', '3XL', '4XL', '38', '40', '42', '44', '46', '48', '50', '52'];
        let nombre = descripcion.trim();
        
        talles.forEach(talle => {
            const regex = new RegExp(`\\s*${talle}\\s*$`, 'i');
            nombre = nombre.replace(regex, '');
        });

        // Normalizar "H" a "HOMBRE" para agrupación consistente
        nombre = nombre.replace(/\bH\b/g, 'HOMBRE');
        
        // Remover colores comunes al final
        const colores = ['NEGRO', 'BLANCO', 'AZUL', 'GRIS', 'ROJO', 'VERDE', 'AMARILLO', 'NARANJA', 'ROSA', 'VIOLETA', 'BEIGE', 'MARRON', 'AZUL MARINO', 'CELESTE', 'CEMENTO', 'GRIS TOPO', 'GRISTOPO', 'GRIS MELANGE', 'GRIS PERLA', 'TOSTADO'];
        colores.forEach(color => {
            const regex = new RegExp(`\\s*${color}\\s*$`, 'i');
            nombre = nombre.replace(regex, '');
        });

        return nombre.trim() || descripcion;
    }

    /**
     * Agrupa productos por SKU base y crea variantes
     * Si no hay SKU base, agrupa por nombre/descripción
     */
    groupProductsByVariants(products: ProductWithImage[]): GroupedProduct[] {
        // Mapa para agrupar por SKU base o nombre
        const groupsMap = new Map<string, ProductWithImage[]>();

        // Agrupar productos por nombre base normalizado + sexo (igual que en el backend)
        // Priorizar NOMBRE de la hoja 2 si está disponible
        products.forEach(product => {
            // Priorizar NOMBRE de la hoja 2 para agrupación
            let nombreOriginal: string;
            let nombreBase: string;
            let sexo: string | null = null;
            
            if ((product as any).NOMBRE) {
                // Si tiene NOMBRE de la hoja 2, usarlo
                nombreOriginal = String((product as any).NOMBRE).trim();
            } else if (product.Descripcion) {
                nombreOriginal = this.extractNombreBase(product.Descripcion) || product.Descripcion;
            } else if (product.Codigo) {
                // Fallback: usar SKU base si no hay descripción
                nombreOriginal = this.extractSkuBase(product.Codigo);
            } else {
                return; // Saltar si no hay forma de agrupar
            }

            // Extraer sexo y nombre sin sexo
            const { nombreSinSexo, sexo: sexoExtraido } = this.extraerYNormalizarSexo(nombreOriginal);
            nombreBase = nombreSinSexo;
            sexo = sexoExtraido;

            // Normalizar nombre base para comparación
            const nombreBaseNormalizado = this.normalizarNombre(nombreBase);
            
            // Clave única: nombre normalizado + sexo (igual que en el backend)
            const groupKey = `${nombreBaseNormalizado}|${sexo || 'sin-sexo'}`;

            if (!groupsMap.has(groupKey)) {
                groupsMap.set(groupKey, []);
            }

            groupsMap.get(groupKey)!.push(product);
        });

        // Convertir grupos a GroupedProduct[]
        const groupedProducts: GroupedProduct[] = [];

        groupsMap.forEach((variants, groupKey) => {
            // Extraer nombre base y sexo de la clave
            const [nombreBaseNormalizado, sexoStr] = groupKey.split('|');
            const sexo = sexoStr === 'sin-sexo' ? null : sexoStr;
            
            // Obtener el nombre original del primer producto (para mostrar)
            const primerProducto = variants[0];
            let nombreOriginal: string;
            
            if ((primerProducto as any).NOMBRE) {
                nombreOriginal = String((primerProducto as any).NOMBRE).trim();
            } else if (primerProducto.Descripcion) {
                nombreOriginal = this.extractNombreBase(primerProducto.Descripcion) || primerProducto.Descripcion;
            } else {
                nombreOriginal = this.extractSkuBase(primerProducto.Codigo || '');
            }
            
            // IMPORTANTE: Normalizar el nombre base de manera consistente
            // Usar el nombre normalizado de la clave para asegurar consistencia
            // entre productos que tienen "D" y "Dama"
            const { nombreSinSexo } = this.extraerYNormalizarSexo(nombreOriginal);
            
            // Usar el nombre sin sexo normalizado, pero reconstruir desde el nombre base normalizado
            // para asegurar que todos los productos del mismo grupo tengan el mismo skuBase
            // Buscar el nombre base más común entre todas las variantes para consistencia
            let skuBase = nombreSinSexo || nombreOriginal;
            
            // Si hay múltiples variantes, intentar encontrar el nombre base más común
            // para asegurar consistencia (priorizar nombres sin abreviaciones)
            if (variants.length > 1) {
                const nombresSinSexo = variants.map(v => {
                    let nom: string;
                    if ((v as any).NOMBRE) {
                        nom = String((v as any).NOMBRE).trim();
                    } else if (v.Descripcion) {
                        nom = this.extractNombreBase(v.Descripcion) || v.Descripcion;
                    } else {
                        nom = this.extractSkuBase(v.Codigo || '');
                    }
                    const { nombreSinSexo: nss } = this.extraerYNormalizarSexo(nom);
                    return nss || nom;
                });
                
                // Priorizar nombres que NO tienen abreviaciones (D, H) sobre los que sí
                const nombresSinAbreviaciones = nombresSinSexo.filter(n => 
                    !/\bD\b/i.test(n) && !/\bH\b/i.test(n)
                );
                
                if (nombresSinAbreviaciones.length > 0) {
                    // Usar el nombre más largo (más completo) sin abreviaciones
                    skuBase = nombresSinAbreviaciones.reduce((a, b) => a.length > b.length ? a : b);
                } else {
                    // Si todos tienen abreviaciones, usar el más común
                    skuBase = nombreSinSexo || nombreOriginal;
                }
            }
            // Ordenar variantes por número
            const sortedVariants = variants.sort((a, b) => {
                const numA = this.extractVariantNumber(a.Codigo || '');
                const numB = this.extractVariantNumber(b.Codigo || '');
                return numA - numB;
            });

            // Crear array de variantes con info de color/talle
            const productVariants: ProductVariant[] = sortedVariants.map(product => {
                const variantNumber = this.extractVariantNumber(product.Codigo || '');
                const variantInfo = getVariantInfo(skuBase, variantNumber);

                // Extraer color y talle de la descripción si no están en el mapping
                const talle = variantInfo?.talle || this.extractTalleFromDescription(product.Descripcion);
                const color = variantInfo?.color || this.extractColorFromDescription(product.Descripcion);

                return {
                    codigo: product.Codigo || '',
                    variantNumber,
                    producto: product,
                    talle: talle || undefined,
                    color: color || undefined,
                    colorHex: variantInfo?.colorHex,
                };
            });

            // El primer producto (variante 1) es el que se muestra por defecto
            const displayProduct = sortedVariants[0];

            // Extraer colores y talles únicos
            const availableColors = Array.from(
                new Set(productVariants.filter(v => v.color).map(v => v.color!))
            );
            const availableSizes = Array.from(
                new Set(productVariants.filter(v => v.talle).map(v => v.talle!))
            );

            // Generar slug para navegación
            const nombreToSlug = (nombre: string): string => {
                return nombre
                    .toLowerCase()
                    .trim()
                    .replace(/\s+/g, '-')
                    .replace(/[^\w\-]+/g, '')
                    .replace(/\-\-+/g, '-')
                    .replace(/^-+/, '')
                    .replace(/-+$/, '');
            };

            groupedProducts.push({
                skuBase,
                skuBaseSlug: nombreToSlug(skuBase),
                displayProduct,
                variants: productVariants,
                totalVariants: productVariants.length,
                availableColors: availableColors.length > 0 ? availableColors : undefined,
                availableSizes: availableSizes.length > 0 ? availableSizes : undefined,
            });
        });

        return groupedProducts;
    }

    /**
     * Filtra productos agrupados según criterios
     * Aplica los filtros al displayProduct de cada grupo
     */
    filterGroupedProducts(
        groupedProducts: GroupedProduct[],
        filters: ProductFilters
    ): GroupedProduct[] {
        return groupedProducts.filter(group => {
            const product = group.displayProduct;

            // Filtro por rubro
            if (filters.rubro && product.Rubro !== filters.rubro) {
                return false;
            }

            // Filtro por subrubro
            if (filters.subrubro && product.Subrubro !== filters.subrubro) {
                return false;
            }

            // Filtro por activo
            if (filters.activo !== undefined && product.Activo !== filters.activo) {
                return false;
            }

            // Filtro por item de venta
            if (filters.itemDeVenta !== undefined && product.ItemDeVenta !== filters.itemDeVenta) {
                return false;
            }

            // Filtro por búsqueda de texto
            if (filters.searchTerm) {
                const searchLower = filters.searchTerm.toLowerCase();
                const matchesSearch =
                    product.Codigo?.toLowerCase().includes(searchLower) ||
                    product.Descripcion?.toLowerCase().includes(searchLower) ||
                    product.DescripcionCorta?.toLowerCase().includes(searchLower) ||
                    product.Rubro?.toLowerCase().includes(searchLower) ||
                    group.skuBase.toLowerCase().includes(searchLower);

                if (!matchesSearch) return false;
            }

            return true;
        });
    }

    /**
     * Busca un grupo de producto por SKU base o código completo
     */
    findGroupedProduct(
        groupedProducts: GroupedProduct[],
        codeOrSkuBase: string
    ): GroupedProduct | undefined {
        // Primero intenta buscar por SKU base exacto
        let found = groupedProducts.find(g => g.skuBase === codeOrSkuBase);

        if (!found) {
            // Si no encuentra, extrae el SKU base del código y busca de nuevo
            const skuBase = this.extractSkuBase(codeOrSkuBase);
            found = groupedProducts.find(g => g.skuBase === skuBase);
        }

        return found;
    }

    /**
     * Encuentra una variante específica dentro de un grupo
     */
    findVariantInGroup(
        group: GroupedProduct,
        codigo: string
    ): ProductVariant | undefined {
        return group.variants.find(v => v.codigo === codigo);
    }


    /**
     * Carga productos agrupados desde la API (Google Sheets)
     * Devuelve directamente los grupos, no productos individuales
     */
    async loadGroupedProductsFromAPI(): Promise<GroupedProduct[] | null> {
        try {
            const response = await fetch('/api/products');
            
            if (!response.ok) {
                // Si es 404, la API no existe, retornar null silenciosamente
                if (response.status === 404) {
                    return null;
                }
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (!data.success || !data.data) {
                throw new Error(data.error || 'Error desconocido');
            }

            // El API ya devuelve productos agrupados
            if (Array.isArray(data.data)) {
                // Convertir los grupos de la API a GroupedProduct
                return data.data.map((group: any) => this.mapApiGroupToGroupedProduct(group));
            }

            return null;
        } catch (error) {
            return null;
        }
    }

    /**
     * Mapea un grupo de la API a GroupedProduct
     */
    private mapApiGroupToGroupedProduct(apiGroup: any): GroupedProduct {
        const displayProductRaw = apiGroup.displayProduct || apiGroup.variants?.[0]?.producto || {};
        const displayProduct = this.mapApiProductToProductWithImage(displayProductRaw);
        
        // Asegurar que las imágenes del displayProduct se usen
        if (apiGroup.displayProduct) {
            displayProduct.imagen = apiGroup.displayProduct.imagen || displayProduct.imagen;
            displayProduct.imagenes = apiGroup.displayProduct.imagenes || displayProduct.imagenes;
            displayProduct.NOMBRE = apiGroup.displayProduct.NOMBRE || displayProduct.NOMBRE;
        }

        const variants: ProductVariant[] = (apiGroup.variants || []).map((variant: any) => {
            // Si variant tiene un objeto producto, usarlo directamente
            const variantProducto = variant.producto || variant;
            const producto = this.mapApiProductToProductWithImage(variantProducto);
            
            // Asegurar que las imágenes se usen del variant
            if (variant.producto) {
                producto.imagen = variant.producto.imagen || producto.imagen;
                producto.imagenes = variant.producto.imagenes || producto.imagenes;
                producto.NOMBRE = variant.producto.NOMBRE || producto.NOMBRE;
            }
            
            const variantNumber = variant.variantNumber || this.extractVariantNumber(variant.Codigo || variant.codigo || '');
            
            return {
                codigo: variant.Codigo || variant.codigo || '',
                variantNumber,
                producto,
                talle: variant.talle || this.extractTalleFromDescription(variant.Descripcion || variantProducto.Descripcion),
                color: variant.color || this.extractColorFromDescription(variant.Descripcion || variantProducto.Descripcion),
            };
        });

        // Extraer colores y talles únicos
        const availableColors = Array.from(
            new Set(variants.filter(v => v.color).map(v => v.color!))
        );
        const availableSizes = Array.from(
            new Set(variants.filter(v => v.talle).map(v => v.talle!))
        );

        // Función helper para generar slug
        const nombreToSlug = (nombre: string): string => {
            return nombre
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '-')
                .replace(/[^\w\-]+/g, '')
                .replace(/\-\-+/g, '-')
                .replace(/^-+/, '')
                .replace(/-+$/, '');
        };

        const skuBase = apiGroup.skuBase || this.extractSkuBase(displayProduct.Codigo || '');
        
        return {
            skuBase,
            skuBaseSlug: apiGroup.skuBaseSlug || nombreToSlug(skuBase),
            displayProduct,
            variants,
            totalVariants: variants.length,
            availableColors: availableColors.length > 0 ? availableColors : undefined,
            availableSizes: availableSizes.length > 0 ? availableSizes : undefined,
        };
    }

    /**
     * Extrae el talle de la descripción
     * Detecta talles numéricos (34, 36, 38, etc.) y de letras (XS, S, M, etc.)
     */
    private extractTalleFromDescription(descripcion: string | null): string | undefined {
        if (!descripcion) return undefined;
        
        const descUpper = descripcion.toUpperCase();
        
        // Primero buscar talles numéricos (34, 36, 38, 40, 42, 44, 46, 48, 50, 52)
        const talleNumerico = descUpper.match(/\b(3[4-9]|[4-5][0-2])\b/);
        if (talleNumerico) {
            return talleNumerico[0];
        }
        
        // Si no hay talle numérico, buscar talles de letras
        const talles = ['2XS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];
        for (const talle of talles) {
            if (descUpper.includes(` ${talle} `) || descUpper.endsWith(` ${talle}`)) {
                return talle;
            }
        }
        
        return undefined;
    }

    /**
     * Extrae el color de la descripción
     * Detecta colores compuestos (LAVADO OSCURO, etc.) y simples
     */
    private extractColorFromDescription(descripcion: string | null): string | undefined {
        if (!descripcion) return undefined;
        
        const descUpper = descripcion.toUpperCase();
        
        // Colores compuestos primero (deben ir antes que los simples para que coincidan correctamente)
        const coloresCompuestos = [
            'LAVADO OSCURO', 'LAVADO CLARO', 'LAVADO MEDIO',
            'AZUL MARINO', 'GRIS PERLA', 'GRIS MELANGE', 'GRIS TOPO', 'GRISTOPO',
            'CELESTE', 'CEMENTO', 'TOSTADO', // Agregar CELESTE, CEMENTO y TOSTADO
            'NEGRO', 'BLANCO', 'AZUL', 'GRIS', 'ROJO', 'VERDE', 
            'AMARILLO', 'NARANJA', 'ROSA', 'VIOLETA', 'BEIGE', 'MARRON'
        ];
        
        for (const color of coloresCompuestos) {
            if (descUpper.includes(color)) {
                return color;
            }
        }
        
        return undefined;
    }
}

export const productsService = new ProductsService();