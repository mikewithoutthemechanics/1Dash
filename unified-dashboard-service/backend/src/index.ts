import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { createServer } from 'http';

import { typeDefs } from './api/graphql/schema';
import { resolvers } from './api/graphql/resolvers';
import { restRoutes } from './api/rest/routes';
import { webhookHandlers } from './api/webhooks/handlers';
import { logger } from './utils/logger';
import { initDatabase } from './database/connection';
import { CacheService } from './services/cache.service';

dotenv.config();

const app = express();
const httpServer = createServer(app);

async function startServer() {
  // Initialize database
  await initDatabase();
  
  // Initialize cache
  await CacheService.getInstance().connect();

  // Middleware
  app.use(helmet());
  app.use(compression());
  app.use(cors());
  app.use(express.json());

  // REST API routes
  app.use('/api/v1', restRoutes);
  
  // Webhook endpoints
  app.use('/webhooks', webhookHandlers);

  // GraphQL setup
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }) => ({
      headers: req.headers,
      cache: CacheService.getInstance(),
    }),
  }));

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  const PORT = process.env.PORT || 4000;
  
  httpServer.listen(PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${PORT}`);
    logger.info(`📊 GraphQL: http://localhost:${PORT}/graphql`);
    logger.info(`🔌 REST API: http://localhost:${PORT}/api/v1`);
    logger.info(`🔗 Webhooks: http://localhost:${PORT}/webhooks`);
  });
}

startServer().catch(err => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});