import React from 'react';
import './App.css';
import ProductCatalog from './components/ProductCatalog';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>🏦 Financial Product Catalog Filter</h1>
        <p>Search and filter through our financial product catalog</p>
      </header>
      <main>
        <ProductCatalog />
      </main>
    </div>
  );
}

export default App;