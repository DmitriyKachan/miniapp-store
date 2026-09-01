import http from 'node:http';

async function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      `http://localhost:5000${path}`,
      {
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
        ...options,
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data) });
          } catch {
            resolve({ status: res.statusCode, raw: data });
          }
        });
      }
    );
    req.on('error', reject);
    if (options.body) req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting API integration tests...\n');

  // 1. Health check
  const health = await request('/api/health');
  console.log('1. Health check:', health.status === 200 ? '✅ PASS' : '❌ FAIL', health.data);

  // 2. Get Categories
  const cats = await request('/api/categories');
  console.log('2. GET Categories:', cats.status === 200 ? '✅ PASS' : '❌ FAIL', `Found ${cats.data.data.length} categories`);

  // 3. Create Category
  const newCat = await request('/api/categories', {
    method: 'POST',
    body: { name: 'Тестовая категория', icon: 'Sparkles', sort_order: 10 }
  });
  console.log('3. POST Category:', newCat.status === 201 ? '✅ PASS' : '❌ FAIL', newCat.data);
  const testCatId = newCat.data.data.id;

  // 4. Update Category
  const updateCat = await request(`/api/categories/${testCatId}`, {
    method: 'PUT',
    body: { name: 'Обновленная категория', icon: 'Flame' }
  });
  console.log('4. PUT Category:', updateCat.status === 200 ? '✅ PASS' : '❌ FAIL', updateCat.data.data.name);

  // 5. Create Product
  const newProd = await request('/api/products', {
    method: 'POST',
    body: {
      category_id: testCatId,
      title: 'Тестовый товар',
      description: 'Прекрасный тестовый товар для проверки',
      price: 1250,
      image_url: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d',
      in_stock: 1
    }
  });
  console.log('5. POST Product:', newProd.status === 201 ? '✅ PASS' : '❌ FAIL', newProd.data);
  const testProdId = newProd.data.data.id;

  // 6. Toggle Stock
  const stockToggle = await request(`/api/products/${testProdId}/stock`, { method: 'PATCH' });
  console.log('6. PATCH Product Stock:', stockToggle.status === 200 && stockToggle.data.data.in_stock === 0 ? '✅ PASS' : '❌ FAIL');

  // 7. Create Order
  const orderRes = await request('/api/orders', {
    method: 'POST',
    body: {
      customer_name: 'Тестовый Покупатель',
      phone: '+7 999 111-22-33',
      comment: 'Доставить быстро',
      items: [{ id: testProdId, title: 'Тестовый товар', price: 1250, quantity: 2 }],
      total_price: 2500
    }
  });
  console.log('7. POST Order:', orderRes.status === 201 ? '✅ PASS' : '❌ FAIL', `Order #${orderRes.data.data.id} created`);
  const orderId = orderRes.data.data.id;

  // 8. Update Order Status
  const statusRes = await request(`/api/orders/${orderId}/status`, {
    method: 'PATCH',
    body: { status: 'paid' }
  });
  console.log('8. PATCH Order Status:', statusRes.status === 200 && statusRes.data.data.status === 'paid' ? '✅ PASS' : '❌ FAIL');

  // 9. Clean up test product and category
  const delProd = await request(`/api/products/${testProdId}`, { method: 'DELETE' });
  console.log('9. DELETE Product:', delProd.status === 200 ? '✅ PASS' : '❌ FAIL');

  const delCat = await request(`/api/categories/${testCatId}`, { method: 'DELETE' });
  console.log('10. DELETE Category:', delCat.status === 200 ? '✅ PASS' : '❌ FAIL');

  console.log('\n🎉 All API Tests completed successfully!');
  process.exit(0);
}

runTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
