import { NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

/**
 * API Route que lista las imágenes disponibles en una carpeta de producto
 * GET /api/product-images?productSlug=buzo-standard-unisex
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const productSlug = searchParams.get('productSlug');

        if (!productSlug) {
            return NextResponse.json({
                success: false,
                error: 'Se requiere productSlug',
                images: []
            }, { status: 400 });
        }

        // Ruta a la carpeta de imágenes del producto
        const imagesDir = join(process.cwd(), 'public', 'imgs', 'products', productSlug);

        // Verificar si la carpeta existe
        if (!existsSync(imagesDir)) {
            return NextResponse.json({
                success: true,
                images: [],
                productSlug,
                message: 'Carpeta no existe'
            });
        }

        try {
            // Leer archivos en la carpeta
            const files = await readdir(imagesDir);

            // Filtrar solo archivos de imagen (jpg, jpeg, png, webp)
            const imageFiles = files.filter(file => {
                const ext = file.toLowerCase();
                return ext.endsWith('.jpg') || ext.endsWith('.jpeg') || ext.endsWith('.png') || ext.endsWith('.webp');
            });

            // Construir rutas completas de las imágenes
            const images = imageFiles.map(file => {
                return `/imgs/products/${productSlug}/${file}`;
            });

            // Ordenar imágenes por nombre (para mantener orden numérico: 1, 2, 3...)
            images.sort((a, b) => {
                const aNum = extractNumber(a);
                const bNum = extractNumber(b);
                if (aNum !== null && bNum !== null) {
                    return aNum - bNum;
                }
                return a.localeCompare(b);
            });

            return NextResponse.json({
                success: true,
                images,
                total: images.length,
                productSlug
            });

        } catch (dirError: any) {
            if (dirError.code === 'ENOENT') {
                return NextResponse.json({
                    success: true,
                    images: [],
                    productSlug,
                    message: 'Carpeta no existe'
                });
            }
            throw dirError;
        }

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message || 'Error al leer imágenes',
            images: []
        }, { status: 500 });
    }
}

/**
 * Extrae el número de una ruta de imagen para ordenar
 * Ejemplo: "buzo-standard-unisex-marino-1.jpg" -> 1
 */
function extractNumber(path: string): number | null {
    const match = path.match(/-(\d+)\.(jpg|jpeg|png|webp)$/i);
    if (match && match[1]) {
        return parseInt(match[1], 10);
    }
    return null;
}

