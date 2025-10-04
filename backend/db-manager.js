const sqlite3 = require('sqlite3').verbose();
const readline = require('readline');

const db = new sqlite3.Database('./products.db');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🗄️  Product Database Manager');
console.log('Available commands:');
console.log('1. view - View all products');
console.log('2. count - Count products');
console.log('3. search <term> - Search products');
console.log('4. delete <id> - Delete product by ID');
console.log('5. quit - Exit');

function promptCommand() {
  rl.question('\nEnter command: ', (input) => {
    const [command, ...args] = input.trim().split(' ');
    
    switch(command.toLowerCase()) {
      case 'view':
        db.all('SELECT * FROM products LIMIT 10', (err, rows) => {
          if (err) console.error('Error:', err.message);
          else {
            console.log('\n📦 Products:');
            rows.forEach(product => {
              console.log(`ID: ${product.id} | ${product.name} | $${product.price}`);
            });
          }
          promptCommand();
        });
        break;
        
      case 'count':
        db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
          if (err) console.error('Error:', err.message);
          else console.log(`\n📊 Total products: ${row.count}`);
          promptCommand();
        });
        break;
        
      case 'search':
        const term = args.join(' ');
        if (!term) {
          console.log('Please provide search term');
          promptCommand();
          return;
        }
        db.all(`SELECT * FROM products WHERE name LIKE ? OR brand LIKE ?`, 
               [`%${term}%`, `%${term}%`], (err, rows) => {
          if (err) console.error('Error:', err.message);
          else {
            console.log(`\n🔍 Search results for "${term}":`);
            rows.forEach(product => {
              console.log(`ID: ${product.id} | ${product.name} | ${product.brand}`);
            });
          }
          promptCommand();
        });
        break;
        
      case 'delete':
        const id = args[0];
        if (!id) {
          console.log('Please provide product ID');
          promptCommand();
          return;
        }
        db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
          if (err) console.error('Error:', err.message);
          else console.log(`\n🗑️  Deleted product with ID: ${id}`);
          promptCommand();
        });
        break;
        
      case 'quit':
        console.log('👋 Goodbye!');
        db.close();
        rl.close();
        break;
        
      default:
        console.log('Unknown command. Try: view, count, search <term>, delete <id>, quit');
        promptCommand();
    }
  });
}

promptCommand();
