const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const excelPath = path.join(__dirname, 'public', 'data', 'products', 'products.xlsx');

console.log('🔍 Debuggeando productos faltantes\n');

const fileBuffer = fs.readFileSync(excelPath);
const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

// HOJA 2
const sheet2 = workbook.Sheets[workbook.SheetNames[1]];
const rawData2 = XLSX.utils.sheet_to_json(sheet2, { defval: null });

const productosHoja2 = rawData2
    .filter((row, index) => {
        if (index === 0) return false;
        const nombre = String(row['PRODUCTOS WORKWEAR'] || '').trim();
        const esHeader = nombre === 'NOMBRE' || nombre === 'PRODUCTOS WORKWEAR';
        const esSeparador = nombre === 'PRODUCTOS BASIC' || nombre === 'PRODUCTOS OFFICE';
        return nombre && !esHeader && !esSeparador;
    })
    .map(row => String(row['PRODUCTOS WORKWEAR'] || '').trim());

console.log('📋 Productos en Hoja 2:', productosHoja2.length);
productosHoja2.forEach((p, i) => console.log(`  ${i + 1}. ${p}`));
console.log('');

// HOJA 1
const sheet1 = workbook.Sheets[workbook.SheetNames[0]];
const productosIndividualesRaw = XLSX.utils.sheet_to_json(sheet1);

// Filtrar según criterios
const productosFiltrados = productosIndividualesRaw.filter((row) => {
    const ultActualizacion = String(row['Ult. Actualizacion'] || row['Ult Actualizacion'] || '').toUpperCase();
    const costoXLM = String(row['Costo x LM'] || '').trim();
    const listaMaterial = String(row['Lista Material'] || '').toUpperCase();

    const tieneTablaTalles = ultActualizacion.includes('TABLAS DE TALLE') || ultActualizacion.includes('TABLA DE TALLE');
    const tieneCostoXLM = costoXLM && costoXLM.length > 0;
    const tieneIndicaciones = listaMaterial.includes('INDICACIONES') || listaMaterial.includes('BORDADOS');

    return tieneTablaTalles && tieneCostoXLM && tieneIndicaciones;
});

console.log('📋 Productos filtrados en Hoja 1:', productosFiltrados.length);
console.log('');

// Buscar coincidencias para cada producto de Hoja 2
console.log('🔎 Buscando coincidencias para cada producto:\n');

const productosFaltantes = [];

productosHoja2.forEach(nombre => {
    const nombreUpper = nombre.toUpperCase();
    const coincidencias = productosFiltrados.filter(prod => {
        const prodDesc = String(prod.Descripcion || '').toUpperCase();
        return prodDesc.includes(nombreUpper);
    });

    if (coincidencias.length === 0) {
        console.log(`❌ ${nombre} - NO HAY COINCIDENCIAS`);
        productosFaltantes.push(nombre);

        // Buscar variantes en Descripcion
        console.log(`   Buscando "${nombreUpper}" en descripciones...`);

        const similares = productosFiltrados
            .filter(prod => {
                const desc = String(prod.Descripcion || '').toUpperCase();
                // Buscar palabras clave del nombre
                const palabras = nombreUpper.split(' ').filter(p => p.length > 3);
                return palabras.some(palabra => desc.includes(palabra));
            })
            .slice(0, 3);

        if (similares.length > 0) {
            console.log(`   Productos similares encontrados:`);
            similares.forEach(sim => {
                console.log(`     - ${sim.Codigo}: ${sim.Descripcion}`);
            });
        } else {
            console.log(`   No se encontraron productos similares`);
        }
        console.log('');
    } else {
        console.log(`✅ ${nombre} - ${coincidencias.length} coincidencias`);
    }
});

console.log('\n📊 Resumen:');
console.log(`  Total productos Hoja 2: ${productosHoja2.length}`);
console.log(`  Productos con coincidencias: ${productosHoja2.length - productosFaltantes.length}`);
console.log(`  Productos SIN coincidencias: ${productosFaltantes.length}`);

if (productosFaltantes.length > 0) {
    console.log('\n❌ Productos faltantes:');
    productosFaltantes.forEach(p => console.log(`   - ${p}`));
}
