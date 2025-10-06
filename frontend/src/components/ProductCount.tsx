import React from 'react';

interface ProductCountProps {
  count: number;
}

const ProductCount: React.FC<ProductCountProps> = ({ count }) => {
  const getCountText = () => {
    if (count === 0) return 'No products found';
    if (count === 1) return 'Showing 1 product';
    return `Showing ${count} products`;
  };

  return (
    <div className="product-count">
      <span>{getCountText()}</span>
    </div>
  );
};

export default ProductCount;
