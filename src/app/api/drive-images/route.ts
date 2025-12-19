import { NextResponse } from 'next/server';

/**
 * API Route para obtener imágenes de una carpeta pública de Google Drive
 * 
 * Esta ruta extrae el ID de la carpeta y devuelve las URLs de las imágenes
 */

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || '';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const folderUrl = searchParams.get('folderUrl');

    if (!folderUrl) {
      return NextResponse.json(
        { error: 'Se requiere folderUrl' },
        { status: 400 }
      );
    }

    // Extraer ID de la carpeta
    const folderId = extractFolderId(folderUrl);
    if (!folderId) {
      return NextResponse.json(
        { error: 'URL de Drive no válida' },
        { status: 400 }
      );
    }

    // Si no hay API key, devolver método alternativo
    if (!GOOGLE_API_KEY) {
      return NextResponse.json({
        folderId,
        folderUrl: `https://drive.google.com/drive/folders/${folderId}`,
        images: [],
        message: 'Google API Key no configurada. Usa el enlace directo a Drive.'
      });
    }

    // Obtener archivos de la carpeta usando Google Drive API
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType+contains+'image/'&fields=files(id,name,mimeType,thumbnailLink)&key=${GOOGLE_API_KEY}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      // Si falla, devolver el enlace directo
      return NextResponse.json({
        folderId,
        folderUrl: `https://drive.google.com/drive/folders/${folderId}`,
        images: [],
        error: 'No se pudieron obtener las imágenes. La carpeta debe ser pública.'
      });
    }

    const data = await response.json();

    if (!data.files || data.files.length === 0) {
      return NextResponse.json({
        folderId,
        folderUrl: `https://drive.google.com/drive/folders/${folderId}`,
        images: [],
        message: 'No se encontraron imágenes en la carpeta'
      });
    }

    // Construir URLs de las imágenes
    const images = data.files.map((file: any) => ({
      id: file.id,
      name: file.name,
      url: `https://drive.google.com/uc?export=view&id=${file.id}`,
      thumbnail: file.thumbnailLink || `https://drive.google.com/thumbnail?id=${file.id}&sz=w400`
    }));

    return NextResponse.json({
      folderId,
      folderUrl: `https://drive.google.com/drive/folders/${folderId}`,
      images,
      total: images.length
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error desconocido' },
      { status: 500 }
    );
  }
}

/**
 * Extrae el ID de la carpeta de una URL de Drive
 */
function extractFolderId(url: string): string | null {
  // Patrón 1: https://drive.google.com/drive/folders/FOLDER_ID
  const pattern1 = /drive\.google\.com\/drive\/folders\/([a-zA-Z0-9_-]+)/;
  const match1 = url.match(pattern1);
  if (match1) return match1[1];

  // Patrón 2: https://drive.google.com/open?id=FOLDER_ID
  const pattern2 = /[?&]id=([a-zA-Z0-9_-]+)/;
  const match2 = url.match(pattern2);
  if (match2) return match2[1];

  // Patrón 3: Solo el ID
  if (/^[a-zA-Z0-9_-]{20,}$/.test(url.trim())) {
    return url.trim();
  }

  return null;
}

