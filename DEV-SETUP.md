# Development Setup

## Quick Start

```bash
# Install all dependencies
npm run install-all

# Start development environment (both backend + frontend with live reload)
npm start
```

## Available Scripts

### Development
- `npm start` - Starts both backend and frontend with live reload
- `npm run dev` - Alias for `npm start`
- `npm run dev:backend` - Start only backend with nodemon (auto-restart)
- `npm run dev:frontend` - Start only frontend with React dev server (live reload)

### Production
- `npm run build` - Build frontend for production
- `npm run build:prod` - Build frontend and start backend in production mode

### Utilities
- `npm test` - Run backend tests
- `npm run install-all` - Install dependencies for both backend and frontend

## Development URLs

- **Frontend**: http://localhost:3001 (React dev server with live reload)
- **Backend API**: http://localhost:3000 (Express server with nodemon)

## Live Reload Features

### Backend (Port 3000)
- **Auto-restart** on file changes (nodemon)
- **API endpoints** available immediately
- **Database changes** reflected instantly

### Frontend (Port 3001)
- **Hot module replacement** - preserves state during updates
- **Auto-refresh** on file changes
- **Instant updates** for CSS, JS, and TSX files

## Development Workflow

1. **Make changes** to any file (backend or frontend)
2. **Save the file** (Ctrl+S)
3. **See changes instantly** - no manual build required
4. **Test in browser** - frontend auto-refreshes, backend auto-restarts

## Troubleshooting

- **Port conflicts**: Make sure ports 3000 and 3001 are available
- **Dependencies**: Run `npm run install-all` if you get module errors
- **Cache issues**: Hard refresh browser (Ctrl+F5) if changes don't appear
