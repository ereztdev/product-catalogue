# Product Catalog Filter - Full Stack Application

A complete product catalog filtering system with separate backend and frontend components, ready for React Native integration.

## Project Structure

```
product-catalogue/
├── backend/                 # Node.js/Express API server
│   ├── server.js           # Main Express server
│   ├── package.json        # Backend dependencies
│   ├── tests/              # API tests
│   ├── products.db         # SQLite database
│   └── README.md           # Backend documentation
├── frontend/               # Web frontend (current)
│   └── public/             # Static web files
│       ├── index.html      # Main HTML page
│       ├── styles.css      # CSS styling
│       └── app.js          # JavaScript logic
└── package.json           # Root package.json for workspace management
```

## Quick Start

1. **Install all dependencies:**
   ```bash
   npm run install-all
   ```

2. **Start the backend server:**
   ```bash
   npm start
   ```

3. **Open your browser** and go to `http://localhost:3000`

## Development

- **Backend only:** `npm run dev` (with nodemon)
- **Run tests:** `npm test`
- **Install backend deps:** `npm run install-backend`
- **Install frontend deps:** `npm run install-frontend`

## Next Steps

This project is now organized for easy React Native integration:

- **Backend API** is ready and can serve mobile apps
- **Frontend folder** is prepared for React Native setup
- **Clean separation** allows independent development
- **Workspace structure** supports monorepo management

## API Endpoints

- `POST /products/generate` - Generate product records
- `GET /products` - Retrieve all products  
- `GET /products/search?q=<query>` - Search products
- `GET /` - Serve web interface

Ready for React Native integration! 🚀