import React from 'react';

interface AddProductsButtonProps {
  onAddProducts: () => void;
  loading: boolean;
}

const AddProductsButton: React.FC<AddProductsButtonProps> = ({ onAddProducts, loading }) => {
  return (
    <button
      onClick={onAddProducts}
      disabled={loading}
      className="btn btn-primary"
    >
      {loading ? 'Adding...' : 'Add Products'}
    </button>
  );
};

export default AddProductsButton;
