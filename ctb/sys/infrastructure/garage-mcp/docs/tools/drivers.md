# Driver System

The garage-mcp system uses a driver-based architecture that allows you to use different vendor services behind the same tool verbs. This provides flexibility and prevents vendor lock-in.

## Architecture

```
Domain Router → Adapter → Driver → Vendor Service
```

- **Domain Routers**: FastAPI endpoints that accept requests
- **Adapters**: Select and manage drivers based on configuration
- **Drivers**: Vendor-specific implementations
- **Vendor Services**: External APIs (Vercel, Render, Neon, etc.)

## Driver Selection

Drivers are selected in this priority order:

1. **Environment Variables** (highest priority)
2. **Configuration File** (`config/drivers.toml`)
3. **Default Values** (lowest priority)

### Environment Variables

```bash
# Database driver selection
export DB_DRIVER=neon
export DB_DRIVER=supabase
export DB_DRIVER=postgres_local

# Frontend driver selection
export FRONTEND_DRIVER=vercel
export FRONTEND_DRIVER=netlify

# Backend driver selection
export BACKEND_DRIVER=render
export BACKEND_DRIVER=flyio
```

### Configuration File

Edit `config/drivers.toml`:

```toml
[database]
driver = "neon"

[frontend]
driver = "vercel"

[backend]
driver = "render"
```

## Available Drivers

### Database Drivers

#### Neon (`neon`)
- **Description**: Neon serverless Postgres
- **Required Environment Variables**:
  - `NEON_API_KEY`: Your Neon API key
  - `NEON_PROJECT_ID`: Your Neon project ID
- **Features**: Branching, serverless scaling, migrations
- **Best For**: Modern serverless applications

#### Supabase (`supabase`)
- **Description**: Supabase managed Postgres
- **Required Environment Variables**:
  - `SUPABASE_URL`: Your Supabase project URL
  - `SUPABASE_SERVICE_KEY`: Your Supabase service role key
  - `SUPABASE_PROJECT_REF`: Your Supabase project reference
- **Features**: Real-time, auth, storage, edge functions
- **Best For**: Full-stack applications with real-time features

#### Local PostgreSQL (`postgres_local`)
- **Description**: Local PostgreSQL instance
- **Required Environment Variables**:
  - `POSTGRES_HOST`: Database host (usually localhost)
  - `POSTGRES_DB`: Database name
  - `POSTGRES_USER`: Database username
  - `POSTGRES_PASSWORD`: Database password
  - `POSTGRES_PORT`: Database port (optional, defaults to 5432)
- **Features**: Full control, no external dependencies
- **Best For**: Development, on-premise deployments

### Frontend Drivers

#### Vercel (`vercel`)
- **Description**: Vercel deployment platform
- **Required Environment Variables**:
  - `VERCEL_TOKEN`: Your Vercel API token
  - `VERCEL_PROJECT_NAME`: Your Vercel project name (optional)
- **Features**: Edge network, serverless functions, automatic deployments
- **Best For**: React, Next.js, static sites

#### Netlify (`netlify`)
- **Description**: Netlify deployment platform
- **Required Environment Variables**:
  - `NETLIFY_ACCESS_TOKEN`: Your Netlify access token
  - `NETLIFY_SITE_ID`: Your Netlify site ID (optional)
- **Features**: Forms, functions, split testing, redirects
- **Best For**: JAMstack sites, static generators

### Backend Drivers

#### Render (`render`)
- **Description**: Render cloud platform
- **Required Environment Variables**:
  - `RENDER_API_KEY`: Your Render API key
  - `RENDER_SERVICE_ID`: Your Render service ID (optional)
- **Features**: Auto-deploy, SSL, CDN, databases
- **Best For**: Full-stack applications, databases included

#### Fly.io (`flyio`)
- **Description**: Fly.io deployment platform
- **Required Environment Variables**:
  - `FLY_ACCESS_TOKEN`: Your Fly.io access token
  - `FLY_APP_NAME`: Your Fly.io app name (optional)
  - `FLY_ORG`: Your Fly.io organization (optional)
- **Features**: Global deployment, persistent volumes, private networking
- **Best For**: Global applications, custom infrastructure

## Environment Variable Setup

### Development (.env file)

Create a `.env` file in your project root:

```bash
# Copy from .env.example
cp .env.example .env

# Edit with your values
# Database (choose one)
DB_DRIVER=postgres_local
POSTGRES_HOST=localhost
POSTGRES_DB=garage_dev
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password

# Frontend (choose one)
FRONTEND_DRIVER=netlify
NETLIFY_ACCESS_TOKEN=your_netlify_token

# Backend (choose one)
BACKEND_DRIVER=render
RENDER_API_KEY=your_render_api_key
```

### Production

Set environment variables in your deployment platform:

```bash
# Heroku example
heroku config:set DB_DRIVER=neon
heroku config:set NEON_API_KEY=your_api_key
heroku config:set NEON_PROJECT_ID=your_project_id

# Vercel example
vercel env add DB_DRIVER
vercel env add NEON_API_KEY
vercel env add NEON_PROJECT_ID
```

## Security

### Secret Redaction

All sensitive information is automatically redacted from logs:

- API keys, tokens, passwords
- Database URLs with credentials
- Service keys and auth tokens

### Environment Variable Security

- Never commit `.env` files to version control
- Use your platform's secure environment variable storage
- Rotate API keys regularly
- Use least-privilege access tokens

## Adding New Drivers

### 1. Create Driver Implementation

Create a new driver file in the appropriate directory:

```python
# services/mcp/drivers/db/planetscale.py
class PlanetscaleDriver:
    def __init__(self):
        self.required_env = ["PLANETSCALE_TOKEN", "PLANETSCALE_ORG"]
        self._validate_environment()
    
    async def migrate(self, target_version=None, dry_run=False):
        # Implementation here
        pass
```

### 2. Update Configuration

Add to `config/drivers.toml`:

```toml
[database.drivers.planetscale]
description = "PlanetScale serverless MySQL"
required_env = ["PLANETSCALE_TOKEN", "PLANETSCALE_ORG"]
```

### 3. Add Tests

Create tests using fake drivers:

```python
# tests/fakes/fake_planetscale_driver.py
class FakePlanetscaleDriver:
    # Test implementation
```

### 4. Update Documentation

Add driver documentation to this file and create tool-specific docs.

## Troubleshooting

### Driver Not Found

```
Failed to load database driver 'neon': No module named 'services.mcp.drivers.db.neon'
```

**Solution**: Check that the driver file exists and the driver name is correct.

### Missing Environment Variables

```
Missing required environment variables: NEON_API_KEY, NEON_PROJECT_ID
```

**Solution**: Set the required environment variables for your selected driver.

### Authentication Errors

```
401 Unauthorized: Invalid token
```

**Solution**: 
1. Verify your API token is correct
2. Check token permissions
3. Ensure token hasn't expired

### Connection Timeouts

```
HTTPError: Connection timeout
```

**Solution**:
1. Check your network connection
2. Verify service endpoints are accessible
3. Check if service is experiencing outages

## Integration Testing

Skip integration tests that require real services:

```bash
# Skip integration tests
CI_SKIP_INTEGRATION=true pytest

# Run only unit tests
pytest tests/modules/test_adapters_*.py
```

Set `CI_SKIP_INTEGRATION=true` in CI environments to avoid real API calls during testing.

## Monitoring

The sidecar service logs all driver operations:

```
[MCP Event] Tool: domains.db.migrate, Domain: database, Verb: migrate, Driver: neon
```

This provides audit trails and helps with debugging driver issues.

## Examples

### Switch from Local to Neon

```bash
# Current: local development
export DB_DRIVER=postgres_local

# Switch to Neon for staging
export DB_DRIVER=neon
export NEON_API_KEY=your_key
export NEON_PROJECT_ID=your_project

# Same API calls, different backend
curl -X POST localhost:7001/tools/domains/db/migrate
```

### Multi-Environment Setup

```bash
# Development
DB_DRIVER=postgres_local
FRONTEND_DRIVER=netlify
BACKEND_DRIVER=render

# Production  
DB_DRIVER=neon
FRONTEND_DRIVER=vercel
BACKEND_DRIVER=flyio
```

### Testing with Fakes

```bash
# Use fake drivers for testing
DB_DRIVER=fake_db
FRONTEND_DRIVER=fake_frontend
BACKEND_DRIVER=fake_backend
```

## Best Practices

1. **Environment Isolation**: Use different drivers per environment
2. **Gradual Migration**: Switch drivers one domain at a time
3. **Monitoring**: Watch sidecar logs for driver performance
4. **Testing**: Use fake drivers in CI/CD pipelines
5. **Documentation**: Document environment setup for your team
6. **Security**: Rotate API keys regularly
7. **Backup**: Test restore procedures across different drivers