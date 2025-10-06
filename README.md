# Financial Product Catalog

A modern full-stack application for searching and filtering financial products with real-time search, pagination, and a clean React interface.

## Features

- **Real-time Search**: Debounced search with 3+ character minimum
- **Pagination**: Client-side pagination with 12 products per page
- **Product Management**: Generate and manage financial product database
- **Responsive Design**: Mobile-friendly interface with sticky pagination
- **Health Monitoring**: Built-in health checks and status monitoring

## Quick Start

### Option 1: Docker (Recommended)

```bash
# Production mode
npm run docker:prod

# Development mode with hot reload
npm run docker:dev

# View logs
npm run docker:logs
```

### Option 2: Local Development

```bash
# Install dependencies
npm run install-all

# Start development servers
npm start

# Run tests
npm test
```

Access the application at `http://localhost:3000`

## API Endpoints

- `GET /` - Web interface
- `GET /health` - Health check
- `GET /products` - List all products
- `GET /products/search?q=<query>` - Search products
- `POST /products/generate` - Generate sample products

## Tech Stack

- **Backend**: Node.js, Express, SQLite3
- **Frontend**: React 19, TypeScript, CSS3
- **Search**: SQL LIKE queries with relevance scoring
- **Pagination**: react-paginate
- **Containerization**: Docker with Ubuntu-based images

## Project Structure

```
├── backend/          # Express API server
├── frontend/         # React application
├── data/            # Database persistence
└── Dockerfile       # Production container
```

## Development Commands

```bash
npm start              # Start both frontend and backend
npm run dev:backend    # Backend only with nodemon
npm run dev:frontend   # Frontend only with live reload
npm test              # Run backend tests
npm run docker:clean  # Clean Docker containers and images
```

Built with ❤️ for modern financial product discovery.