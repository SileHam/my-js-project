// data.js - central localStorage helper + sample data
const storeKey = {
  products: 'ecom_products',
  categories: 'ecom_categories',
  orders: 'ecom_orders',
  reviews: 'ecom_reviews',
  users: 'ecom_users'
};

function getAll(entity) {
  return JSON.parse(localStorage.getItem(storeKey[entity]) || '[]');
}

function saveAll(entity, arr) {
  localStorage.setItem(storeKey[entity], JSON.stringify(arr));
}

function create(entity, record) {
  const arr = getAll(entity);
  if (!record.id) record.id = Date.now() + Math.floor(Math.random() * 999);
  arr.push(record);
  saveAll(entity, arr);
  return record;
}

function update(entity, id, updates) {
  const arr = getAll(entity);
  const idx = arr.findIndex(x => x.id === id);
  if (idx === -1) return null;
  arr[idx] = { ...arr[idx], ...updates };
  saveAll(entity, arr);
  return arr[idx];
}

function remove(entity, id) {
  const arr = getAll(entity).filter(x => x.id !== id);
  saveAll(entity, arr);
}

function getById(entity, id) {
  return getAll(entity).find(x => x.id === id);
}

function clearAll() {
  Object.values(storeKey).forEach(k => localStorage.removeItem(k));
}

// sample data initializer
function initApp() {
  // users
  if (!localStorage.getItem(storeKey.users)) {
    const users = [
      { id: 1, name: "Admin", email: "admin@app.com", password: "admin123", role: "admin" },
      { id: 2, name: "User", email: "user@app.com", password: "user123", role: "user" }
    ];
    saveAll('users', users);
  }
  // categories
  if (!localStorage.getItem(storeKey.categories)) {
    const cats = [
      { id: 101, name: "Électronique", description: "Téléphones, ordinateurs..." },
      { id: 102, name: "Maison", description: "Meubles, déco" },
      { id: 103, name: "Beauté", description: "Cosmétiques" },
      { id: 104, name: "Vêtements", description: "Mode et accessoires" },
      { id: 105, name: "Sport", description: "Équipement sportif" }
    ];
    saveAll('categories', cats);
  }
  // products
  if (!localStorage.getItem(storeKey.products)) {
    const p = [
      { id: 201, title: "Smartphone X", sku: "SMX-01", price: 399.99, qty: 12, categoryId: 101, description: "Téléphone moderne avec écran OLED", rating: 4.2 },
      { id: 202, title: "Chaise Confort", sku: "CHA-02", price: 89.5, qty: 40, categoryId: 102, description: "Chaise design ergonomique", rating: 4.0 },
      { id: 203, title: "Parfum 50ml", sku: "PARF-03", price: 49.99, qty: 100, categoryId: 103, description: "Parfum unisexe", rating: 4.5 },
      { id: 204, title: "Laptop Pro", sku: "LAP-04", price: 899.99, qty: 8, categoryId: 101, description: "Ordinateur portable haute performance", rating: 4.7 },
      { id: 205, title: "Table Basse", sku: "TAB-05", price: 129.99, qty: 25, categoryId: 102, description: "Table basse moderne", rating: 4.3 },
      { id: 206, title: "T-shirt Premium", sku: "TSH-06", price: 29.99, qty: 150, categoryId: 104, description: "T-shirt en coton bio", rating: 4.1 },
      { id: 207, title: "Raquette Tennis", sku: "RAQ-07", price: 79.99, qty: 30, categoryId: 105, description: "Raquette professionnelle", rating: 4.4 }
    ];
    saveAll('products', p);
  }
  // orders
  if (!localStorage.getItem(storeKey.orders)) {
    const orders = [];
    const products = getAll('products');
    const users = getAll('users');
    for (let i = 0; i < 12; i++) {
      const month = i + 1;
      const date = new Date(2024, month - 1, Math.floor(Math.random() * 28) + 1);
      const statuses = ['pending', 'processing', 'completed', 'cancelled'];
      orders.push({
        id: 300 + i,
        userId: users[Math.floor(Math.random() * users.length)].id,
        items: [{ productId: products[Math.floor(Math.random() * products.length)].id, qty: Math.floor(Math.random() * 3) + 1, price: products[Math.floor(Math.random() * products.length)].price }],
        total: Math.floor(Math.random() * 500) + 50,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        date: date.toISOString()
      });
    }
    saveAll('orders', orders);
  }
  // reviews
  if (!localStorage.getItem(storeKey.reviews)) {
    const reviews = [];
    const products = getAll('products');
    const users = getAll('users');
    products.forEach((p, idx) => {
      reviews.push({
        id: 400 + idx,
        productId: p.id,
        userId: users[Math.floor(Math.random() * users.length)].id,
        rating: p.rating,
        comment: `Excellent produit, je recommande !`,
        date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString()
      });
    });
    saveAll('reviews', reviews);
  }
}
