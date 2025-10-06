# Backend API Server

Express.js API server for the Financial Product Catalog application.

## Features

- **RESTful API** - Clean endpoints for product management
- **SQLite Database** - Lightweight data storage with indexes
- **Search Functionality** - SQL-based search with relevance scoring
- **Health Monitoring** - Built-in health check endpoint
- **CORS Support** - Cross-origin request handling

## API Endpoints

- `GET /health` - Health check
- `GET /products` - List all products
- `GET /products/search?q=<query>` - Search products
- `POST /products/generate` - Generate sample products
- `GET /` - Serve React frontend

## Development

```bash
npm run dev    # Start with nodemon
npm test       # Run API tests
npm start      # Production start
```

## Database

Uses SQLite with optimized indexes for search performance. Database file is created automatically on first run.