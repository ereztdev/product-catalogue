const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/build')));

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
const categories = ['Personal Loans', 'Home Loans', 'Business Loans', 'Auto Loans', 'Student Loans', 'Credit Cards', 'Investment Products', 'Insurance'];
const brands = ['Chase', 'Bank of America', 'Wells Fargo', 'Citibank', 'Goldman Sachs', 'Morgan Stanley', 'JPMorgan', 'American Express', 'Capital One', 'Discover'];
const productNames = [
  'Personal Loan', 'Mortgage Loan', 'Business Credit Line', 'Auto Financing', 'Student Loan', 'Credit Card', 'Investment Account', 'Savings Account',
  'Checking Account', 'Certificate of Deposit', 'Money Market Account', 'IRA Account', '401k Plan', 'Life Insurance', 'Auto Insurance', 'Home Insurance'
];

function generateRandomProduct() {
  const category = categories[Math.floor(Math.random() * categories.length)];
  const brand = brands[Math.floor(Math.random() * brands.length)];
  const name = productNames[Math.floor(Math.random() * productNames.length)];
  
  // Generate a more unique SKU using timestamp and random number
  const timestamp = Date.now().toString().slice(-6);
  const randomNum = Math.floor(Math.random() * 10000);
  
  return {
    name: `${brand} ${name}`,
    description: `Professional ${name.toLowerCase()} from ${brand}. Competitive rates and excellent customer service.`,
    category: category,
    brand: brand,
    price: (Math.random() * 50000 + 1000).toFixed(2), // Financial products have higher values
    stock_quantity: Math.floor(Math.random() * 50) + 1, // Lower stock quantities for financial products
    sku: `${brand.substring(0, 3).toUpperCase()}${timestamp}${randomNum}`
  };
}

// Routes

// Clear all products endpoint
app.delete('/products', (req, res) => {
  db.run('DELETE FROM products', (err) => {
    if (err) {
      res.status(500).json({ error: 'Failed to clear products' });
    } else {
      res.json({ message: 'All products cleared successfully' });
    }
  });
});

// Generate products endpoint
app.post('/products/generate', (req, res) => {
  const count = req.body.count || 100;
  
  db.serialize(() => {
    const stmt = db.prepare(`INSERT INTO products (name, description, category, brand, price, stock_quantity, sku) 
                             VALUES (?, ?, ?, ?, ?, ?, ?)`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < count; i++) {
      const product = generateRandomProduct();
      stmt.run(product.name, product.description, product.category, product.brand, 
               product.price, product.stock_quantity, product.sku, (err) => {
        if (err) {
          errorCount++;
          console.log(`Error inserting product: ${err.message}`);
        } else {
          successCount++;
        }
      });
    }
    
    stmt.finalize((err) => {
      if (err) {
        res.status(500).json({ error: 'Failed to generate products' });
      } else {
        res.json({ 
          message: `Added ${successCount} products successfully${errorCount > 0 ? ` (${errorCount} duplicates skipped)` : ''}` 
        });
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

// Serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
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
