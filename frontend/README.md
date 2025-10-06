# Frontend React Application

Modern React frontend for the Financial Product Catalog with TypeScript support.

## Features

- **React 19** - Latest React with modern hooks
- **TypeScript** - Type-safe development
- **Real-time Search** - Debounced search with 3+ character minimum
- **Pagination** - Client-side pagination with react-paginate
- **Responsive Design** - Mobile-friendly interface
- **Sticky Pagination** - Always-visible pagination controls

## Components

- `ProductCatalog` - Main application container
- `SearchBar` - Search input with debouncing
- `ProductList` - Product grid with pagination
- `ProductCard` - Individual product display
- `AddProductsButton` - Generate sample products
- `StatusMessage` - Success/error notifications

## Development

```bash
npm start     # Development server (port 3001)
npm test      # Run tests with coverage
npm run build # Production build
```

## API Integration

Uses `ApiService` for backend communication with request cancellation and error handling.