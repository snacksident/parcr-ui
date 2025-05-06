const BASE_URL = 'http://localhost:5000/shopify';

export async function fetchProducts() {
  const response = await fetch(`${BASE_URL}/products`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
}

export async function createProduct(productData) {
  const response = await fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  if (!response.ok) throw new Error('Failed to create product');
  return response.json();
}

export async function fetchProductBySKU(sku) {
  const response = await fetch(`${BASE_URL}/products/${sku}`);
  if (!response.ok) throw new Error('Failed to fetch product by SKU');
  return response.json();
}