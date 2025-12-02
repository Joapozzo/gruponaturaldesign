/**
 * Helper para obtener color hexadecimal desde nombre de color
 */
export const getColorHex = (colorName: string): string => {
    const colorMap: Record<string, string> = {
        'NEGRO': '#000000',
        'BLANCO': '#FFFFFF',
        'AZUL': '#0066CC',
        'AZUL MARINO': '#003366',
        'GRIS': '#808080',
        'GRIS PERLA': '#E8E8E8',
        'GRIS MELANGE': '#A0A0A0',
        'GRIS TOPO': '#8B7355',
        'ROJO': '#CC0000',
        'VERDE': '#00CC00',
        'AMARILLO': '#FFCC00',
        'NARANJA': '#FF6600',
        'ROSA': '#FF99CC',
        'VIOLETA': '#9966CC',
        'BEIGE': '#F5F5DC',
        'MARRON': '#8B4513',
        'CELESTE': '#87CEEB',
        'LAVADO OSCURO': '#2C2C2C',
        'LAVADO CLARO': '#D3D3D3',
        'LAVADO MEDIO': '#808080',
    };
    return colorMap[colorName.toUpperCase()] || '#999999';
};

