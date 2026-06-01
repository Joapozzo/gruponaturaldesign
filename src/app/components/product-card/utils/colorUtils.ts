/**
 * Helper para obtener color hexadecimal desde nombre de color
 * Maneja múltiples variantes y formatos de nombres de colores
 */
export const getColorHex = (colorName: string): string => {
    if (!colorName) return '#999999';
    
    // Normalizar el nombre del color
    const normalized = colorName.trim().toUpperCase();
    
    const colorMap: Record<string, string> = {
        // Colores principales
        'NEGRO': '#000000',
        'BLACK': '#000000',
        'BLANCO': '#FFFFFF',
        'WHITE': '#FFFFFF',
        
        // Azules
        'AZUL': '#0066CC',
        'AZUL MARINO': '#003366',
        'AZULMARINO': '#003366',
        'MARINO': '#003366',
        'BLUE': '#0066CC',
        
        // Grises
        'GRIS': '#808080',
        'GRIS MELANGE': '#808080',
        'GRISMELANGE': '#808080',
        'GRIS MEL': '#808080',
        'MELANGE': '#808080',
        'MEL': '#808080',
        'GRIS TOPO': '#4A4A4A',
        'GRISTOPO': '#4A4A4A',
        'TOPO': '#4A4A4A',
        'GRIS PERLA': '#E8E8E8',
        'GRISPERLA': '#E8E8E8',
        'GRIS ACERO': '#71797E',
        'PERLA': '#E8E8E8',
        'VERDE MILITAR': '#4B5320',
        'GRAY': '#808080',
        'GREY': '#808080',
        
        // Beiges/Tostados
        'BEIGE': '#D2B48C',
        'TOSTADO': '#D2B48C',
        'CEMENTO': '#D2B48C',
        
        // Otros colores
        'ROJO': '#CC0000',
        'RED': '#CC0000',
        'VERDE': '#00CC00',
        'GREEN': '#00CC00',
        'AMARILLO': '#FFCC00',
        'YELLOW': '#FFCC00',
        'NARANJA': '#FF6600',
        'ORANGE': '#FF6600',
        'ROSA': '#FF99CC',
        'PINK': '#FF99CC',
        'VIOLETA': '#9966CC',
        'VIOLET': '#9966CC',
        'MARRON': '#8B4513',
        'BROWN': '#8B4513',
        'CELESTE': '#87CEEB',
        'SKY BLUE': '#87CEEB',
        'LAVADO OSCURO': '#2C2C2C',
        'LAVADOOSCURO': '#2C2C2C',
        'LAVADO CLARO': '#D3D3D3',
        'LAVADOCLARO': '#D3D3D3',
        'LAVADO MEDIO': '#808080',
        'LAVADOMEDIO': '#808080',
        
        // Colores adicionales comunes
        'CAMEL': '#C19A6B',
        'BORDO': '#800020',
        'ARENA': '#C2B280',
        'HUESO': '#F5F5DC',
        'RAYADO CELESTE ANCHO': '#87CEEB',
        'RAYAS 1: CELESTE': '#87CEEB',
        'RAYAS 1: COMBINADAS': '#808080',
        'RAYAS 2: COMBINADAS': '#808080',
        'RAYAS 2: FINA AZUL': '#0066CC',
    };
    
    // Buscar coincidencia exacta primero
    if (colorMap[normalized]) {
        return colorMap[normalized];
    }
    
    // Buscar coincidencias parciales (para casos como "Gris Melange" que puede venir con espacios diferentes)
    for (const [key, value] of Object.entries(colorMap)) {
        if (normalized.includes(key) || key.includes(normalized)) {
            return value;
        }
    }
    
    // Si no se encuentra, retornar gris por defecto
    return '#999999';
};

