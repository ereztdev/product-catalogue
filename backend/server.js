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
const dbPath = process.env.NODE_ENV === 'test' ? ':memory:' : (process.env.DB_PATH || './products.db');
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
  
  // Add indexes for search performance
  db.run(`CREATE INDEX IF NOT EXISTS idx_products_name ON products(name COLLATE NOCASE)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_products_description ON products(description COLLATE NOCASE)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category COLLATE NOCASE)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand COLLATE NOCASE)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku COLLATE NOCASE)`);
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
    // Start transaction for better performance
    db.run('BEGIN TRANSACTION');
    
    const stmt = db.prepare(`INSERT INTO products (name, description, category, brand, price, stock_quantity, sku) 
                             VALUES (?, ?, ?, ?, ?, ?, ?)`);
    
    let successCount = 0;
    let errorCount = 0;
    let completed = 0;
    
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
        
        completed++;
        
        // Check if all products have been processed
        if (completed === count) {
          stmt.finalize((err) => {
            if (err) {
              db.run('ROLLBACK');
              res.status(500).json({ error: 'Failed to generate products' });
            } else {
              // Commit transaction
              db.run('COMMIT', (err) => {
                if (err) {
                  res.status(500).json({ error: 'Failed to commit products' });
                } else {
                  res.json({ 
                    message: `Added ${successCount} products successfully${errorCount > 0 ? ` (${errorCount} duplicates skipped)` : ''}` 
                  });
                }
              });
            }
          });
        }
      });
    }
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
               WHERE name LIKE ? COLLATE NOCASE OR description LIKE ? COLLATE NOCASE OR category LIKE ? COLLATE NOCASE OR brand LIKE ? COLLATE NOCASE OR sku LIKE ? COLLATE NOCASE
               ORDER BY 
                 CASE 
                   WHEN name LIKE ? COLLATE NOCASE THEN 1
                   WHEN brand LIKE ? COLLATE NOCASE THEN 2
                   WHEN category LIKE ? COLLATE NOCASE THEN 3
                   WHEN sku LIKE ? COLLATE NOCASE THEN 4
                   WHEN description LIKE ? COLLATE NOCASE THEN 5
                   ELSE 6
                 END,
                 name`;
  
  const exactMatch = `${query}`;
  db.all(sql, [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, exactMatch, exactMatch, exactMatch, exactMatch, exactMatch], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Failed to search products' });
    } else {
      res.json(rows);
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
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
