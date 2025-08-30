# Docker Setup for URL Shortener

This project includes Docker configurations for both development and production environments.

## Prerequisites

- Docker
- Docker Compose
- pnpm (for local development)

## Quick Start

### Production Environment

To run the entire stack in production mode:

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up --build -d
```

### Development Environment

To run the entire stack in development mode with hot reloading:

```bash
# Build and start all services in development mode
docker-compose -f docker-compose.dev.yml up --build

# Or run in detached mode
docker-compose -f docker-compose.dev.yml up --build -d
```

## Services

### 1. PostgreSQL Database
- **Port**: 5432
- **Database**: `url_shortener` (production) / `url_shortener_dev` (development)
- **User**: `postgres`
- **Password**: `postgres`

### 2. NestJS API
- **Port**: 3000
- **Environment**: Production or Development
- **Features**: 
  - Production: Optimized build, health checks
  - Development: Hot reloading, volume mounts

### 3. Next.js Web App
- **Port**: 4321
- **Environment**: Production or Development
- **Features**:
  - Production: Optimized build, health checks
  - Development: Hot reloading, volume mounts

## Environment Variables

### API Environment Variables

Create a `.env` file in the `apps/api` directory:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/url_shortener_dev
JWT_ACCESS_TOKEN_SECRET=your-access-token-secret
JWT_REFRESH_TOKEN_SECRET=your-refresh-token-secret
JWT_TOKEN_ISSUER=url-shrtnr
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
DOMAIN_NAME=localhost
APP_URL=http://localhost:3000
```

### Web App Environment Variables

Create a `.env.local` file in the `apps/web` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Useful Commands

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f web
docker-compose logs -f postgres
```

### Stop services
```bash
# Production
docker-compose down

# Development
docker-compose -f docker-compose.dev.yml down
```

### Rebuild specific service
```bash
# Production
docker-compose up --build api

# Development
docker-compose -f docker-compose.dev.yml up --build web
```

### Access database
```bash
# Connect to PostgreSQL
docker exec -it url-shrtnr-postgres psql -U postgres -d url_shortener

# Or for development
docker exec -it url-shrtnr-postgres-dev psql -U postgres -d url_shortener_dev
```

### Clean up
```bash
# Remove containers, networks, and volumes
docker-compose down -v

# Remove all unused containers, networks, images
docker system prune -a
```

## Development Workflow

1. **Start development environment**:
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

2. **Make code changes** - they will automatically reload in the containers

3. **View logs** to debug issues:
   ```bash
   docker-compose -f docker-compose.dev.yml logs -f api
   ```

4. **Stop development environment**:
   ```bash
   docker-compose -f docker-compose.dev.yml down
   ```

## Production Deployment

1. **Set proper environment variables** in production
2. **Use production compose file**:
   ```bash
   docker-compose up --build -d
   ```
3. **Monitor health checks**:
   ```bash
   docker-compose ps
   ```

## Troubleshooting

### Port conflicts
If ports 3000, 4321, or 5432 are already in use, modify the port mappings in the docker-compose files.

### Database connection issues
Ensure PostgreSQL is healthy before starting the API:
```bash
docker-compose logs postgres
```

### Build issues
Clear Docker cache and rebuild:
```bash
docker-compose down
docker system prune -f
docker-compose up --build
```

### Permission issues
On Linux, you might need to adjust file permissions:
```bash
sudo chown -R $USER:$USER .
```
