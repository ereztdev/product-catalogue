import React from 'react';
import { Product } from '../types/Product';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="product-card">
      <div className="product-name">{product.name}</div>
      <div className="product-brand">{product.brand}</div>
      <div className="product-description">{product.description}</div>
      <div className="product-details">
        <div className="product-price">${product.price.toFixed(2)}</div>
        <div className="product-stock">Stock: {product.stock_quantity}</div>
      </div>
      <div className="product-category">{product.category}</div>
      <div className="product-sku">SKU: {product.sku}</div>
    </div>
  );
};

export default ProductCard;
