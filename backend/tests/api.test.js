const request = require('supertest');
const { app, db } = require('../server');

describe('Product Catalog API Tests', () => {
  beforeAll((done) => {
    // Initialize database for tests
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        category TEXT,
        brand TEXT,
        price REAL,
        stock_quantity INTEGER,
        sku TEXT UNIQUE
      )`, done);
    });
  });

  afterAll((done) => {
    // Close database connection
    db.close(done);
  });

  beforeEach((done) => {
    // Clear products before each test
    db.run('DELETE FROM products', done);
  });

  describe('POST /products/generate', () => {
    test('should generate products successfully', async () => {
      const response = await request(app)
        .post('/products/generate')
        .send({ count: 10 })
        .expect(200);

      expect(response.body.message).toContain('Added 10 products successfully');
    });

    test('should generate default 100 products when no count specified', async () => {
      const response = await request(app)
        .post('/products/generate')
        .send({})
        .expect(200);

      expect(response.body.message).toContain('Added 100 products successfully');
    });
  });

  describe('GET /products', () => {
    test('should return all products', async () => {
      // First generate some products
      await request(app)
        .post('/products/generate')
        .send({ count: 5 });

      const response = await request(app)
        .get('/products')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(5);
      
      // Check product structure
      if (response.body.length > 0) {
        const product = response.body[0];
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('description');
        expect(product).toHaveProperty('category');
        expect(product).toHaveProperty('brand');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('stock_quantity');
        expect(product).toHaveProperty('sku');
      }
    });
  });

  describe('GET /products/search', () => {
    beforeEach(async () => {
      // Generate test products before each search test
      await request(app)
        .post('/products/generate')
        .send({ count: 10 });
    });

    test('should return all products when no search query provided', async () => {
      const response = await request(app)
        .get('/products/search')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(10);
    });

    test('should return empty array when no products match search', async () => {
      const response = await request(app)
        .get('/products/search?q=nonexistentproduct123')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    test('should search products by name', async () => {
      // Get all products first to find a searchable term
      const allProductsResponse = await request(app)
        .get('/products');
      
      if (allProductsResponse.body.length > 0) {
        const productName = allProductsResponse.body[0].name;
        const searchTerm = productName.split(' ')[0]; // Use first word of product name
        
        const response = await request(app)
          .get(`/products/search?q=${encodeURIComponent(searchTerm)}`)
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        
        // Verify all returned products contain the search term
        response.body.forEach(product => {
          const searchableText = `${product.name} ${product.description} ${product.category} ${product.brand} ${product.sku}`.toLowerCase();
          expect(searchableText).toContain(searchTerm.toLowerCase());
        });
      }
    });

    test('should search products by brand', async () => {
      // Get all products first to find a searchable brand
      const allProductsResponse = await request(app)
        .get('/products');
      
      if (allProductsResponse.body.length > 0) {
        const brand = allProductsResponse.body[0].brand;
        
        const response = await request(app)
          .get(`/products/search?q=${encodeURIComponent(brand)}`)
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        
        // Verify all returned products contain the brand
        response.body.forEach(product => {
          const searchableText = `${product.name} ${product.description} ${product.category} ${product.brand} ${product.sku}`.toLowerCase();
          expect(searchableText).toContain(brand.toLowerCase());
        });
      }
    });
  });

  describe('GET /', () => {
    test('should serve the main HTML page', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.text).toContain('<!doctype html>');
      expect(response.text).toContain('<title>React App</title>');
      expect(response.text).toContain('<div id="root"></div>');
    });
  });
});
