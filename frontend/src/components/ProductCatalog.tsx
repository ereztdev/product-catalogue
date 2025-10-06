import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Product } from '../types/Product';
import { ApiService } from '../services/ApiService';
import ProductList from './ProductList';
import SearchBar from './SearchBar';
import AddProductsButton from './AddProductsButton';
import ProductCount from './ProductCount';
import StatusMessage from './StatusMessage';

const ProductCatalog: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  // Removed unused searchLoading state
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  
  const apiService = useMemo(() => new ApiService(), []);

  const loadProducts = useCallback(async (showSuccessMessage = true) => {
    try {
      setLoading(true);
      const allProducts = await apiService.getAllProducts();
      setProducts(allProducts);
      setFilteredProducts(allProducts);
      
      if (showSuccessMessage && allProducts.length > 0) {
        showStatus(`Loaded ${allProducts.length} products`, 'success');
      }
    } catch (error) {
      showStatus(`Error loading products: ${error}`, 'error');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load products on component mount
  useEffect(() => {
    loadProducts(false);
  }, [loadProducts]);

  const addProducts = async () => {
    try {
      setLoading(true);
      showStatus('Adding products...', 'info');
      
      const result = await apiService.generateProducts(1000);
      showStatus(result.message, 'success');
      
      // Reload products after adding
      await loadProducts(true);
    } catch (error) {
      showStatus(`Error adding products: ${error}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showStatus = useCallback((text: string, type: 'success' | 'error' | 'info') => {
    setStatusMessage({ text, type });
    
    // Auto-hide success messages after 1 second
    if (type === 'success') {
      setTimeout(() => {
        setStatusMessage(null);
      }, 1000);
    }
  }, []);

  const searchProducts = useCallback(async (query: string) => {
    try {
      if (query.trim() === '') {
        setFilteredProducts(products);
        return;
      }
      
      const searchResults = await apiService.searchProducts(query);
      setFilteredProducts(searchResults);
    } catch (error) {
      showStatus(`Search error: ${error}`, 'error');
    }
  }, [products, apiService, showStatus]);

  return (
    <div className="product-catalog">
      <div className="controls">
        <SearchBar onSearch={searchProducts} />
      </div>
      
      <div className="add-products-container">
        <AddProductsButton onAddProducts={addProducts} loading={loading} />
      </div>
      
      <StatusMessage message={statusMessage} />
      
      <ProductCount count={filteredProducts.length} />
      
      <ProductList products={filteredProducts} />
    </div>
  );
};

export default ProductCatalog;
