import React, { useState, useMemo } from 'react';
import ReactPaginate from 'react-paginate';
import { Product } from '../types/Product';
import ProductCard from './ProductCard';

interface ProductListProps {
  products: Product[];
}

const ITEMS_PER_PAGE = 12;

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  const [currentPage, setCurrentPage] = useState(0);

  // Calculate pagination
  const paginatedProducts = useMemo(() => {
    const startIndex = currentPage * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return products.slice(startIndex, endIndex);
  }, [products, currentPage]);

  const pageCount = Math.ceil(products.length / ITEMS_PER_PAGE);

  // Reset to first page when products change (e.g., new search)
  React.useEffect(() => {
    setCurrentPage(0);
  }, [products]);

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (products.length === 0) {
    return (
      <div className="no-products">
        <h3>No products found</h3>
        <p>No products match your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <div className="products-grid">
        {paginatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {pageCount > 1 && (
        <div className="pagination-container">
          <ReactPaginate
            breakLabel="..."
            nextLabel="Next"
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            pageCount={pageCount}
            previousLabel="Previous"
            renderOnZeroPageCount={null}
            containerClassName="pagination"
            pageClassName="pagination-page"
            pageLinkClassName="pagination-link"
            previousClassName="pagination-previous"
            previousLinkClassName="pagination-previous-link"
            nextClassName="pagination-next"
            nextLinkClassName="pagination-next-link"
            breakClassName="pagination-break"
            breakLinkClassName="pagination-break-link"
            activeClassName="pagination-active"
            disabledClassName="pagination-disabled"
          />
        </div>
      )}
    </div>
  );
};

export default ProductList;
