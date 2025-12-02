const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const excelPath = path.join(__dirname, 'public', 'data', 'products', 'products.xlsx');
const fileBuffer = fs.readFileSync(excelPath);
const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

const sheet1 = workbook.Sheets[workbook.SheetNames[0]];
const productosIndividualesRaw = XLSX.utils.sheet_to_json(sheet1);

const productosFiltrados = productosIndividualesRaw.filter((row) => {
    const ultActualizacion = String(row['Ult. Actualizacion'] || row['Ult Actualizacion'] || '').toUpperCase();
    const costoXLM = String(row['Costo x LM'] || '').trim();
    const listaMaterial = String(row['Lista Material'] || '').toUpperCase();
    const tieneTablaTalles = ultActualizacion.includes('TABLAS DE TALLE') || ultActualizacion.includes('TABLA DE TALLE');
    const tieneCostoXLM = costoXLM && costoXLM.length > 0;
    const tieneIndicaciones = listaMaterial.includes('INDICACIONES') || listaMaterial.includes('BORDADOS');
    return tieneTablaTalles && tieneCostoXLM && tieneIndicaciones;
});

const buscar = [
    'CHOMBA RIVET',
    'CHINO',
    'REMERA GENTLE',
    'SWEATER ESSENCE',
    'SWEATER'
];

console.log('🔍 Buscando nombres exactos en Hoja 1:\n');

buscar.forEach(termino => {
    console.log(`\n📦 Buscando "${termino}":`);
    const encontrados = productosFiltrados.filter(prod => {
        const desc = String(prod.Descripcion || '').toUpperCase();
        return desc.includes(termino);
    });

    if (encontrados.length > 0) {
        console.log(`   ✅ ${encontrados.length} productos encontrados`);
        // Mostrar las primeras 3 descripciones únicas
        const uniqueDescs = [...new Set(encontrados.map(p => String(p.Descripcion || '')))];
        uniqueDescs.slice(0, 3).forEach(desc => {
            console.log(`      - ${desc}`);
        });
    } else {
        console.log(`   ❌ No se encontraron productos`);
    }
});
