const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Ruta al archivo Excel
const excelPath = path.join(__dirname, 'public', 'data', 'products', 'products.xlsx');

console.log('📊 Diagnóstico del Excel de Productos\n');
console.log('📁 Archivo:', excelPath);
console.log('');

// Leer el archivo
const fileBuffer = fs.readFileSync(excelPath);
const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

console.log('📄 Hojas encontradas:', workbook.SheetNames);
console.log('');

// HOJA 2: Productos agrupados
if (workbook.SheetNames.length > 1) {
    const sheet2Name = workbook.SheetNames[1];
    console.log(`\n📋 Analizando Hoja 2: "${sheet2Name}"\n`);

    const sheet2 = workbook.Sheets[sheet2Name];
    const rawData = XLSX.utils.sheet_to_json(sheet2, { defval: null, header: 1 });

    // Mostrar primera fila (headers)
    console.log('🔤 Primera fila (headers):');
    console.log(rawData[0]);
    console.log('');

    // Mostrar primeras 5 filas con datos
    console.log('📊 Primeras 5 filas de datos:');
    for (let i = 1; i <= Math.min(5, rawData.length - 1); i++) {
        console.log(`Fila ${i}:`, rawData[i]);
    }
    console.log('');

    // Ahora leer como JSON para ver las claves
    const jsonData = XLSX.utils.sheet_to_json(sheet2, { defval: null });
    console.log('🔑 Claves detectadas en la primera fila de datos:');
    if (jsonData.length > 0) {
        console.log(Object.keys(jsonData[0]));
    }
    console.log('');

    // Analizar productos - TODOS están en la columna "PRODUCTOS WORKWEAR"
    console.log('📦 Productos detectados (con nuevo filtro correcto):\n');

    let totalProductos = 0;
    const productosValidos = [];

    jsonData.forEach((row, index) => {
        if (index === 0) return; // Saltar primera fila

        const nombre = String(row['PRODUCTOS WORKWEAR'] || '').trim();

        // Aplicar el mismo filtro que el código de carga
        const esHeader = nombre === 'NOMBRE' || nombre === 'PRODUCTOS WORKWEAR';
        const esSeparador = nombre === 'PRODUCTOS BASIC' || nombre === 'PRODUCTOS OFFICE';

        if (nombre && !esHeader && !esSeparador) {
            totalProductos++;
            productosValidos.push(nombre);
            console.log(`  ${totalProductos}. ${nombre}`);
        }
    });

    console.log('');
    console.log('📊 Resumen:');
    console.log(`  TOTAL de productos válidos: ${totalProductos} productos`);
    console.log('');
    console.log('✅ Lista de productos procesados:');
    productosValidos.forEach((p, i) => {
        console.log(`   ${i + 1}. ${p}`);
    });
}

// HOJA 1: Productos individuales
console.log('\n\n📋 Analizando Hoja 1: Productos Individuales\n');
const sheet1 = workbook.Sheets[workbook.SheetNames[0]];
const productosIndividualesRaw = XLSX.utils.sheet_to_json(sheet1);

console.log(`📦 Total de productos en Hoja 1: ${productosIndividualesRaw.length}`);

// Filtrar según criterios
const productosConTablaTalles = productosIndividualesRaw.filter((row) => {
    const ultActualizacion = String(row['Ult. Actualizacion'] || row['Ult Actualizacion'] || '').toUpperCase();
    return ultActualizacion.includes('TABLAS DE TALLE') || ultActualizacion.includes('TABLA DE TALLE');
});

const productosConDrive = productosIndividualesRaw.filter((row) => {
    const costoXLM = String(row['Costo x LM'] || '').trim();
    return costoXLM && costoXLM.length > 0;
});

const productosConIndicaciones = productosIndividualesRaw.filter((row) => {
    const listaMaterial = String(row['Lista Material'] || '').toUpperCase();
    return listaMaterial.includes('INDICACIONES') || listaMaterial.includes('BORDADOS');
});

const productosFiltrados = productosIndividualesRaw.filter((row) => {
    const ultActualizacion = String(row['Ult. Actualizacion'] || row['Ult Actualizacion'] || '').toUpperCase();
    const costoXLM = String(row['Costo x LM'] || '').trim();
    const listaMaterial = String(row['Lista Material'] || '').toUpperCase();

    const tieneTablaTalles = ultActualizacion.includes('TABLAS DE TALLE') || ultActualizacion.includes('TABLA DE TALLE');
    const tieneCostoXLM = costoXLM && costoXLM.length > 0;
    const tieneIndicaciones = listaMaterial.includes('INDICACIONES') || listaMaterial.includes('BORDADOS');

    return tieneTablaTalles && tieneCostoXLM && tieneIndicaciones;
});

console.log(`  ✅ Con "TABLAS DE TALLE": ${productosConTablaTalles.length}`);
console.log(`  ✅ Con "Costo x LM" (Drive): ${productosConDrive.length}`);
console.log(`  ✅ Con "INDICACIONES" o "BORDADOS": ${productosConIndicaciones.length}`);
console.log(`  🔍 Productos que cumplen TODOS los criterios: ${productosFiltrados.length}`);

console.log('\n✅ Diagnóstico completo\n');
