import { Product } from '../types/Product';

export class ApiService {
  private baseUrl = '';

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
      const response = await fetch(`${this.baseUrl}/products/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Search failed: ${error}`);
    }
  }
}
