/**
 * API Service Module
 * Handles all communication with the backend API
 */
class ApiService {
    constructor(baseUrl = '') {
        this.baseUrl = baseUrl;
    }

    /**
     * Generate products in the database
     * @param {number} count - Number of products to generate
     * @returns {Promise<Object>} Response from the API
     */
    async generateProducts(count = 100) {
        try {
            const response = await fetch(`${this.baseUrl}/products/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ count })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw new Error(`Failed to generate products: ${error.message}`);
        }
    }

    /**
     * Fetch all products from the database
     * @returns {Promise<Array>} Array of product objects
     */
    async getAllProducts() {
        try {
            const response = await fetch(`${this.baseUrl}/products`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw new Error(`Failed to load products: ${error.message}`);
        }
    }

    /**
     * Search products by query string
     * @param {string} query - Search query
     * @returns {Promise<Array>} Array of matching product objects
     */
    async searchProducts(query) {
        try {
            const response = await fetch(`${this.baseUrl}/products/search?q=${encodeURIComponent(query)}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw new Error(`Search failed: ${error.message}`);
        }
    }
}

/**
 * UI Controller Module
 * Handles all user interface interactions and state management
 */
class UIController {
    constructor(apiService) {
        this.apiService = apiService;
        this.products = [];
        this.searchTimeout = null;
        
        this.initializeElements();
        this.bindEvents();
    }

    /**
     * Initialize DOM element references
     */
    initializeElements() {
        this.searchInput = document.getElementById('searchInput');
        this.generateBtn = document.getElementById('generateBtn');
        this.status = document.getElementById('status');
        this.productsContainer = document.getElementById('productsContainer');
        this.countText = document.getElementById('countText');
    }

    /**
     * Bind event listeners to DOM elements
     */
    bindEvents() {
        this.generateBtn.addEventListener('click', () => this.handleGenerateProducts());
        
        this.searchInput.addEventListener('input', (e) => this.handleSearchInput(e));
        
        // Load products when page loads (silently)
        window.addEventListener('load', () => this.handleLoadProducts(false, false));
    }

    /**
     * Handle product generation button click
     */
    async handleGenerateProducts() {
        try {
            this.setButtonState(this.generateBtn, true, 'Adding...');
            this.showStatus('Adding products...', 'info');

            const result = await this.apiService.generateProducts(100);
            this.showStatus(result.message, 'success');
            
            // Automatically load products after generation (with success message)
            await this.handleLoadProducts(true, true);
        } catch (error) {
            this.showStatus(`Error adding products: ${error.message}`, 'error');
        } finally {
            this.setButtonState(this.generateBtn, false, 'Add Products');
        }
    }

    /**
     * Load products from API
     */
    async handleLoadProducts(showSuccessMessage = true, showLoadingMessage = true) {
        try {
            if (showLoadingMessage) {
                this.showStatus('Loading products...', 'info');
            }

            this.products = await this.apiService.getAllProducts();
            this.displayProducts(this.products);
            
            if (showSuccessMessage && this.products.length > 0) {
                this.showStatus(`Loaded ${this.products.length} products`, 'success');
            } else if (this.products.length === 0 && showLoadingMessage) {
                this.showStatus('No products found. Click "Add Products" to get started.', 'info');
            }
        } catch (error) {
            this.showStatus(`Error loading products: ${error.message}`, 'error');
            this.updateProductCount(0);
        }
    }

    /**
     * Handle search input changes with debouncing
     */
    handleSearchInput(event) {
        const query = event.target.value.trim();
        
        // Clear previous timeout
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }

        // Debounce search to avoid too many API calls
        this.searchTimeout = setTimeout(async () => {
            if (query.length > 0) {
                await this.performSearch(query);
            } else {
                this.displayProducts(this.products);
            }
        }, 300);
    }

    /**
     * Perform the actual search operation
     */
    async performSearch(query) {
        try {
            const filteredProducts = await this.apiService.searchProducts(query);
            this.displayProducts(filteredProducts);
        } catch (error) {
            this.showStatus(`Search error: ${error.message}`, 'error');
        }
    }

    /**
     * Display products in the UI
     */
    displayProducts(productsToShow) {
        this.updateProductCount(productsToShow.length);
        
        if (productsToShow.length === 0) {
            this.productsContainer.innerHTML = `
                <div class="no-products">
                    <h3>No products found</h3>
                    <p>No products match your search criteria.</p>
                </div>
            `;
            return;
        }

        const productsHTML = productsToShow.map(product => this.createProductCard(product)).join('');
        this.productsContainer.innerHTML = `<div class="products-grid">${productsHTML}</div>`;
    }

    /**
     * Create HTML for a single product card
     */
    createProductCard(product) {
        return `
            <div class="product-card">
                <div class="product-name">${this.escapeHtml(product.name)}</div>
                <div class="product-brand">${this.escapeHtml(product.brand)}</div>
                <div class="product-description">${this.escapeHtml(product.description)}</div>
                <div class="product-details">
                    <div class="product-price">$${parseFloat(product.price).toFixed(2)}</div>
                    <div class="product-stock">Stock: ${product.stock_quantity}</div>
                </div>
                <div class="product-category">${this.escapeHtml(product.category)}</div>
                <div class="product-sku">SKU: ${this.escapeHtml(product.sku)}</div>
            </div>
        `;
    }

    /**
     * Update the product count display
     */
    updateProductCount(count) {
        if (count === 0) {
            this.countText.textContent = 'No products found';
        } else if (count === 1) {
            this.countText.textContent = 'Showing 1 product';
        } else {
            this.countText.textContent = `Showing ${count} products`;
        }
    }

    /**
     * Show status message to user
     */
    showStatus(message, type = 'info') {
        this.status.textContent = message;
        this.status.className = `status ${type}`;
        this.status.style.display = 'block';
        
        // Auto-hide success messages
        if (type === 'success') {
            setTimeout(() => {
                this.status.style.display = 'none';
            }, 1000);
        }
    }

    /**
     * Set button state (enabled/disabled and text)
     */
    setButtonState(button, disabled, text) {
        button.disabled = disabled;
        button.textContent = text;
    }

    /**
     * Escape HTML to prevent XSS attacks
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

/**
 * Application initialization
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize API service
    const apiService = new ApiService();
    
    // Initialize UI controller
    const uiController = new UIController(apiService);
    
    // Make controller available globally for debugging
    window.app = {
        apiService,
        uiController
    };
});
