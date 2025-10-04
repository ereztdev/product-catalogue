# Product Catalog Filter

A simple Node.js application that demonstrates dynamic product catalog filtering with a clean, responsive web interface.

## Features

- **Dynamic Product Generation**: Generate 100+ product records with realistic data
- **Real-time Search**: Search products by name, brand, category, description, or SKU
- **Responsive UI**: Clean, modern interface that works on desktop and mobile
- **SQLite Database**: Lightweight database for storing product data
- **RESTful API**: Well-structured API endpoints for all operations

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the server**:
   ```bash
   npm start
   ```

3. **Open your browser** and go to `http://localhost:3000`

4. **Generate products** by clicking the "Generate Products" button

5. **Search products** using the search input field

## API Endpoints

- `POST /products/generate` - Generate product records (default: 100 products)
- `GET /products` - Retrieve all products
- `GET /products/search?q=<query>` - Search products by query
- `GET /` - Serve the main web interface

## Development

For development with auto-restart:
```bash
npm run dev
```

## Testing

Run the test suite:
```bash
 npm test
```

## Project Structure

```
product-catalogue/
├── server.js          # Main Express server
├── package.json       # Dependencies and scripts
├── public/
│   └── index.html     # Frontend web interface
├── tests/
│   └── api.test.js    # API tests
└── products.db        # SQLite database (created on first run)
```

## Assumptions & Tradeoffs

### Assumptions Made:
1. **SQLite for simplicity**: Chose SQLite over PostgreSQL/MySQL for easier setup and portability
2. **In-memory search**: Implemented simple LIKE queries instead of full-text search for simplicity
3. **Single-page application**: Used vanilla JavaScript instead of React/Vue for faster development
4. **Basic error handling**: Implemented essential error handling without comprehensive logging
5. **Fixed product schema**: Used predefined categories and brands instead of dynamic ones

### Tradeoffs:
1. **Performance vs Simplicity**: 
   - ✅ Simple SQLite queries are easy to understand and debug
   - ❌ May not scale well with millions of products
   - ❌ No caching layer implemented

2. **Search Functionality**:
   - ✅ Simple LIKE queries work for basic search
   - ❌ No fuzzy matching or advanced search features
   - ❌ No search result ranking

3. **Frontend Architecture**:
   - ✅ Vanilla JS is lightweight and fast to load
   - ❌ No component reusability or state management
   - ❌ Limited scalability for complex features

4. **Database Design**:
   - ✅ Simple schema is easy to understand
   - ❌ No relationships or normalization
   - ❌ No data validation constraints

## Improvements for Production

Given more time, I would implement:

1. **Database Optimization**:
   - Add database indexes for search fields
   - Implement connection pooling
   - Add data validation and constraints

2. **Search Enhancement**:
   - Full-text search with FTS5 (SQLite) or Elasticsearch
   - Search result ranking and relevance scoring
   - Search suggestions and autocomplete

3. **Performance**:
   - Redis caching layer
   - API response compression
   - Database query optimization
   - Pagination for large datasets

4. **Frontend Improvements**:
   - React/Vue.js for better component architecture
   - State management (Redux/Vuex)
   - Progressive Web App features
   - Better loading states and error handling

5. **DevOps & Monitoring**:
   - Docker containerization
   - CI/CD pipeline
   - Logging and monitoring
   - Health check endpoints

6. **Security**:
   - Input validation and sanitization
   - Rate limiting
   - CORS configuration
   - Authentication/authorization

## Docker Support

The application is ready for Docker containerization. A `Dockerfile` can be added to package the application with all dependencies.

## License

MIT License - feel free to use this code for learning and development purposes.
