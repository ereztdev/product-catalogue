const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('../frontend/public'));

// Database setup - use in-memory database for tests
const dbPath = process.env.NODE_ENV === 'test' ? ':memory:' : './products.db';
const db = new sqlite3.Database(dbPath);

// Initialize database
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
  )`);
});

// Sample data generators
const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty', 'Toys', 'Automotive'];
const brands = ['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony', 'Microsoft', 'Google', 'Amazon', 'Tesla', 'Toyota'];
const productNames = [
  'Smartphone', 'Laptop', 'Headphones', 'T-Shirt', 'Jeans', 'Sneakers', 'Book', 'Tablet',
  'Camera', 'Watch', 'Backpack', 'Sunglasses', 'Coffee Maker', 'Blender', 'Vacuum', 'Chair'
];

function generateRandomProduct() {
  const category = categories[Math.floor(Math.random() * categories.length)];
  const brand = brands[Math.floor(Math.random() * brands.length)];
  const name = productNames[Math.floor(Math.random() * productNames.length)];
  
  return {
    name: `${brand} ${name}`,
    description: `High-quality ${name.toLowerCase()} from ${brand}. Perfect for everyday use.`,
    category: category,
    brand: brand,
    price: (Math.random() * 1000 + 10).toFixed(2),
    stock_quantity: Math.floor(Math.random() * 100) + 1,
    sku: `${brand.substring(0, 3).toUpperCase()}${Math.floor(Math.random() * 10000)}`
  };
}

// Routes

// Generate products endpoint
app.post('/products/generate', (req, res) => {
  const count = req.body.count || 100;
  
  db.serialize(() => {
    // Clear existing products
    db.run('DELETE FROM products');
    
    const stmt = db.prepare(`INSERT INTO products (name, description, category, brand, price, stock_quantity, sku) 
                             VALUES (?, ?, ?, ?, ?, ?, ?)`);
    
    for (let i = 0; i < count; i++) {
      const product = generateRandomProduct();
      stmt.run(product.name, product.description, product.category, product.brand, 
               product.price, product.stock_quantity, product.sku);
    }
    
    stmt.finalize((err) => {
      if (err) {
        res.status(500).json({ error: 'Failed to generate products' });
      } else {
        res.json({ message: `Generated ${count} products successfully` });
      }
    });
  });
});

// Get all products endpoint
app.get('/products', (req, res) => {
  db.all('SELECT * FROM products ORDER BY name', (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Failed to fetch products' });
    } else {
      res.json(rows);
    }
  });
});

// Search products endpoint
app.get('/products/search', (req, res) => {
  const query = req.query.q || '';
  
  if (!query.trim()) {
    // If no query, return all products
    db.all('SELECT * FROM products ORDER BY name', (err, rows) => {
      if (err) {
        res.status(500).json({ error: 'Failed to fetch products' });
      } else {
        res.json(rows);
      }
    });
    return;
  }
  
  const searchTerm = `%${query}%`;
  const sql = `SELECT * FROM products 
               WHERE name LIKE ? OR description LIKE ? OR category LIKE ? OR brand LIKE ? OR sku LIKE ?
               ORDER BY name`;
  
  db.all(sql, [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Failed to search products' });
    } else {
      res.json(rows);
    }
  });
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public', 'index.html'));
});

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    db.close((err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Database connection closed.');
      process.exit(0);
    });
  });
}

// Export app and db for testing
module.exports = { app, db };
