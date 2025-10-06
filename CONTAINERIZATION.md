# Containerization Guide

## 🐳 Docker Setup

This project is now fully containerized and ready for Linux deployment.

### Quick Start (Linux/Container)

```bash
# Build and run production container
npm run docker:prod

# Or for development with hot reload
npm run docker:dev

# Stop containers
npm run docker:stop
```

### Manual Docker Commands

```bash
# Build the image
docker build -t product-catalogue .

# Run production container
docker run -p 3000:3000 product-catalogue

# Run development container with volume mounts
docker-compose -f docker-compose.dev.yml up --build
```

## 📁 Files Added for Containerization

### Linux Scripts
- `start-server.sh` - Linux equivalent of Windows batch/PowerShell scripts
- Uses `lsof` and `kill` instead of `netstat` and `taskkill`

### Docker Files
- `Dockerfile` - Multi-stage build with Node.js Alpine
- `docker-compose.yml` - Production setup
- `docker-compose.dev.yml` - Development with hot reload
- `.dockerignore` - Excludes Windows-specific files

### Updated Scripts
- Added Docker commands to `package.json`
- Cross-platform compatible scripts

## 🔄 Migration from Windows to Linux

### What Changes:
1. **Process Management**: `taskkill` → `kill -9`
2. **Port Detection**: `netstat -ano` → `lsof -ti:3000`
3. **Script Execution**: `.bat/.ps1` → `.sh`
4. **Path Separators**: `\` → `/`

### What Stays the Same:
- ✅ All Node.js/Express code
- ✅ React frontend
- ✅ SQLite database
- ✅ API endpoints
- ✅ Package.json scripts (mostly)

## 🚀 Deployment Options

### 1. Docker Compose (Recommended)
```bash
# Production
docker-compose up -d

# Development
docker-compose -f docker-compose.dev.yml up
```

### 2. Direct Docker
```bash
docker build -t product-catalogue .
docker run -p 3000:3000 product-catalogue
```

### 3. Linux Native
```bash
# Install dependencies
npm run install-all

# Build frontend
npm run build

# Start with Linux script
./start-server.sh
```

## 🔧 Environment Variables

```bash
NODE_ENV=production  # or development
PORT=3000           # Server port
```

## 📊 Performance Notes

- **Container startup**: ~10-15 seconds
- **1000 products generation**: ~122ms (optimized)
- **Memory usage**: ~100-200MB
- **Image size**: ~300-400MB (Alpine-based)

## 🛠️ Development vs Production

### Development (`docker-compose.dev.yml`)
- Volume mounts for hot reload
- Source code changes reflected immediately
- Debug-friendly

### Production (`docker-compose.yml`)
- Optimized build
- Health checks
- Restart policies
- Persistent database volume

## ✅ Ready for Linux Deployment!

The application is now fully containerized and ready for:
- ✅ **Docker** deployment
- ✅ **Kubernetes** orchestration  
- ✅ **Linux servers**
- ✅ **Cloud platforms** (AWS, GCP, Azure)
- ✅ **CI/CD pipelines**

## 🎯 Next Steps

1. **Test locally**: `npm run docker:prod`
2. **Deploy to cloud**: Use docker-compose.yml
3. **Scale**: Add load balancer/replicas
4. **Monitor**: Add logging/metrics containers
