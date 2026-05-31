import { Pool } from 'pg';
import { logger } from '../utils/logger';
import dotenv from 'dotenv';

dotenv.config();

let pool: Pool;

export async function initDatabase(): Promise<void> {
  pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'unified_dashboard',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  pool.on('error', (err) => {
    logger.error('Unexpected PostgreSQL error:', err);
  });

  try {
    await pool.connect();
    await createTables();
    logger.info('PostgreSQL connected successfully');
  } catch (error) {
    logger.error('Failed to connect to PostgreSQL:', error);
    throw error;
  }
}

async function createTables(): Promise<void> {
  const queries = [
    `
    CREATE TABLE IF NOT EXISTS system_integrations (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      type VARCHAR(100) NOT NULL,
      status VARCHAR(50) NOT NULL,
      config JSONB NOT NULL,
      last_sync TIMESTAMP,
      metrics JSONB,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS dashboard_metrics (
      id SERIAL PRIMARY KEY,
      category VARCHAR(100) NOT NULL,
      label VARCHAR(255) NOT NULL,
      value DECIMAL(20, 4) NOT NULL,
      unit VARCHAR(20),
      change DECIMAL(20, 4),
      change_percent DECIMAL(5, 2),
      system VARCHAR(100) NOT NULL,
      timestamp TIMESTAMP DEFAULT NOW()
    )
    `,
    `
    CREATE INDEX IF NOT EXISTS idx_metrics_category ON dashboard_metrics(category);
    CREATE INDEX IF NOT EXISTS idx_metrics_system ON dashboard_metrics(system);
    CREATE INDEX IF NOT EXISTS idx_metrics_timestamp ON dashboard_metrics(timestamp);
    `,
  ];

  for (const query of queries) {
    await pool.query(query);
  }
}

export function getPool(): Pool {
  if (!pool) {
    throw new Error('Database not initialized');
  }
  return pool;
}