import { Product } from '../types/Product';

export class ApiService {
  private baseUrl = 'http://localhost:3000';
  private abortController: AbortController | null = null;

  async generateProducts(count: number = 1000): Promise<{ message: string }> {
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
      throw new Error(`Failed to generate products: ${error}`);
    }
  }

  async getAllProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${this.baseUrl}/products`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to load products: ${error}`);
    }
  }

  async searchProducts(query: string): Promise<Product[]> {
    try {
      // Cancel previous request if it exists
      if (this.abortController) {
        this.abortController.abort();
      }

      // Create new abort controller for this request
      this.abortController = new AbortController();

      const response = await fetch(`${this.baseUrl}/products/search?q=${encodeURIComponent(query)}`, {
        signal: this.abortController.signal
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      // Don't throw error if request was aborted
      if (error instanceof Error && error.name === 'AbortError') {
        return [];
      }
      throw new Error(`Search failed: ${error}`);
    }
  }
}
