# Unified Dashboard Integration Service

A comprehensive dashboard service that integrates multiple systems including:
- Payment processing (PayFast)
- AI Agents (OpenClaw, Ollama)
- Real Estate CRM
- Fitness Class Booking
- VPS Metrics Monitoring

## Features

- **Unified GraphQL API**: Single endpoint for all data
- **REST API fallback**: For legacy systems
- **Real-time webhooks**: Live updates from all systems
- **Caching layer**: Redis for performance
- **Self-hosted**: Docker on your Ubuntu VPS
- **Extensible connectors**: Base class for easy addition
- **Real-time dashboard**: Subscriptions for live data
- **OAuth management**: Automatic token refresh

## Architecture

```
unified-dashboard-service/
├── backend/
│   ├── src/
│   │   ├── index.ts                 # Main entry point
│   │   ├── api/
│   │   │   ├── graphql/
│   │   │   │   ├── schema.ts        # GraphQL schema
│   │   │   │   └── resolvers.ts     # GraphQL resolvers
│   │   │   └── rest/
│   │   │       └── routes.ts        # REST API routes
│   │   ├── integrations/
│   │   │   ├── base.connector.ts    # Base connector class
│   │   │   ├── payfast.connector.ts
│   │   │   ├── openclaw.connector.ts
│   │   │   ├── ollama.connector.ts
│   │   │   ├── real-estate.connector.ts
│   │   │   ├── fitness.connector.ts
│   │   │   └── vps-metrics.connector.ts
│   │   ├── services/
│   │   │   ├── data-aggregator.service.ts
│   │   │   ├── oauth.service.ts
│   │   │   └── cache.service.ts
│   │   └── database/
│   │       └── models.ts
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   └── index.tsx            # Main dashboard
│   │   └── components/
│   │       └── MetricsGrid.tsx
│   └── package.json
├── docker-compose.yml
└── .env.example
```

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 20+
- PostgreSQL
- Redis

### Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd unified-dashboard-service
   ```

2. Set environment variables:
   ```bash
   cp .env.example .env
   nano .env  # Add your actual API keys
   ```

3. Start all services:
   ```bash
   docker-compose up -d
   ```

4. Check status:
   ```bash
   docker-compose ps
   ```

5. View logs:
   ```bash
   docker-compose logs -f backend
   ```

### Access Services

- Dashboard: http://localhost:3000
- GraphQL: http://localhost:4000/graphql
- n8n Automation: http://localhost:5678
- PostgreSQL: localhost:5432
- Redis: localhost:6379

## Development

### Backend
```bash
cd backend
npm install
npm run dev  # Runs with ts-node-dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev  # Runs Next.js dev server
```

## API Endpoints

### GraphQL
- Main endpoint: `POST /graphql`
- Query example:
  ```graphql
  query {
    dashboard {
      summary {
        totalSystems
        connectedSystems
      }
      metrics {
        label
        value
        unit
      }
    }
  }
  ```

### REST
- Base URL: `/api/v1`
- Endpoints:
  - `GET /api/v1/systems`
  - `GET /api/v1/metrics`
  - `GET /api/v1/leads`

### Webhooks
- Base URL: `/webhooks`
- Configure external services to POST to this endpoint

## Extending the Service

### Adding New Connectors

1. Create a new connector file in `backend/src/integrations/`
2. Extend the `BaseConnector` class
3. Implement `getStatus()`, `sync()`, and `getMetrics()` methods
4. Register the connector in `DataAggregatorService`

Example:
```typescript
import { BaseConnector } from './base.connector';

export class NewServiceConnector extends BaseConnector {
  // Implement required methods
}
```

### Adding New Dashboard Metrics

1. Extend the GraphQL schema in `schema.ts`
2. Add resolver logic in `resolvers.ts`
3. Implement data fetching in the appropriate connector
4. Update frontend components to display new metrics

## Deployment

### Production Build
```bash
# Build backend
cd backend
npm run build

# Build frontend  
cd frontend
npm run build

# Start services
docker-compose up -d
```

### Environment Variables
Refer to `.env.example` for all required variables. Key categories:
- Database credentials
- API keys for external services
- Service URLs
- Feature flags

## Monitoring & Maintenance

### Health Checks
- Backend: `GET /health`
- Database: `pg_isready`
- Redis: `redis-cli ping`

### Logs
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Backup
```bash
# Backup PostgreSQL
docker exec unified-dashboard-service-postgres-1 pg_dump -U postgres unified_dashboard > backup.sql

# Backup Redis (if persistence enabled)
docker exec unified-dashboard-service-redis-1 redis-cli save
```

## Security Considerations

1. **Environment Variables**: Never commit `.env` file
2. **Network Security**: Use Docker networks to isolate services
3. **API Keys**: Store secrets in Docker secrets or environment variables
4. **CORS**: Configure appropriately for your frontend domain
5. **Rate Limiting**: Implement in production for public endpoints

## Troubleshooting

### Common Issues

1. **Container fails to start**:
   ```bash
   docker-compose logs -f <service-name>
   ```

2. **Database connection errors**:
   - Verify PostgreSQL is running
   - Check credentials in .env
   - Ensure database exists

3. **Redis connection errors**:
   - Verify Redis is running on port 6379
   - Check REDIS_HOST and REDIS_PORT

4. **API connection timeouts**:
   - Verify external service URLs
   - Check network connectivity
   - Review API key validity

### Resetting State
```bash
docker-compose down -v  # Removes volumes and data
docker-compose up -d    # Fresh start
```

## License

MIT License - feel free to modify and extend for your use case.

## Support

For issues and feature requests, please open an issue on the GitHub repository.