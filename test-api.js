const http = require('http');

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/products/load-from-files',
    method: 'GET'
};

console.log('🔍 Probando API de productos...\n');

const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log('✅ API Response:');
            console.log(`   📦 Total Groups: ${json.totalGroups}`);
            console.log(`   📊 Total Products: ${json.totalProducts}`);
            console.log(`   📄 Files Processed: ${json.filesProcessed}`);
            console.log(`   ✅ Success: ${json.success}`);
            console.log('');

            if (json.data && json.data.length > 0) {
                console.log('📋 Primeros 5 productos:');
                json.data.slice(0, 5).forEach((product, i) => {
                    console.log(`   ${i + 1}. ${product.skuBase} (${product.totalVariants} variantes)`);
                });

                console.log('');
                console.log('📋 Últimos 5 productos:');
                json.data.slice(-5).forEach((product, i) => {
                    console.log(`   ${i + 1}. ${product.skuBase} (${product.totalVariants} variantes)`);
                });
            }

            console.log('\n✅ Test completado!');
        } catch (e) {
            console.error('❌ Error parsing JSON:', e.message);
            console.log('Response:', data.substring(0, 500));
        }
    });
});

req.on('error', (error) => {
    console.error('❌ Error:', error.message);
});

req.end();
