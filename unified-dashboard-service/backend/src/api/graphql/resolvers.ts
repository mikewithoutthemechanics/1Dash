import { CacheService } from '../../services/cache.service';
import { DataAggregatorService } from '../../services/data-aggregator.service';

export const resolvers = {
  Query: {
    dashboard: async () => {
      const cache = CacheService.getInstance();
      const cached = await cache.get('unified-dashboard');
      
      if (cached) return cached;

      const systems = await DataAggregatorService.getAllSystems();
      const metrics = await DataAggregatorService.getAllMetrics();
      const summary = await DataAggregatorService.getSummary();

      const dashboard = {
        id: 'unified-main',
        systems,
        metrics,
        summary,
        lastUpdated: new Date().toISOString(),
      };

      await cache.set('unified-dashboard', dashboard, 60); // Cache 1min
      return dashboard;
    },

    systems: async () => {
      return DataAggregatorService.getAllSystems();
    },

    metrics: async (_, { category, limit }) => {
      return DataAggregatorService.getMetrics(category, limit);
    },

    leads: async (_, { status, limit }) => {
      const connector = DataAggregatorService.getConnector('real-estate');
      return connector.getLeads(status, limit);
    },

    fitnessClasses: async (_, { start, end }) => {
      const connector = DataAggregatorService.getConnector('fitness');
      return connector.getClasses(start, end);
    },

    payments: async (_, { limit }) => {
      const connector = DataAggregatorService.getConnector('payfast');
      return connector.getPayments(limit);
    },

    aiAgentMetrics: async () => {
      const openclaw = DataAggregatorService.getConnector('openclaw');
      const ollama = DataAggregatorService.getConnector('ollama');
      return [...(await openclaw.getMetrics()), ...(await ollama.getMetrics())];
    },

    vpsMetrics: async () => {
      const connector = DataAggregatorService.getConnector('vps-metrics');
      return connector.getMetrics();
    },
  },

  Mutation: {
    syncSystem: async (_, { systemId }) => {
      return DataAggregatorService.syncSystem(systemId);
    },

    syncAllSystems: async () => {
      return DataAggregatorService.syncAllSystems();
    },

    updateSystemConfig: async (_, { id, config }) => {
      return DataAggregatorService.updateSystemConfig(id, config);
    },

    createLead: async (_, { input }) => {
      const connector = DataAggregatorService.getConnector('real-estate');
      return connector.createLead(input);
    },
  },

  Subscription: {
    systemStatusUpdated: {
      subscribe: async (_, { systemId }, { cache }) => {
        const channel = systemId ? `system:${systemId}` : 'system:*';
        return cache.subscribe(channel);
      },
    },
  },

  DateTime: {
    serialize: (value) => new Date(value).toISOString(),
    parseValue: (value) => new Date(value),
  },

  JSON: {
    serialize: (value) => value,
    parseValue: (value) => JSON.parse(value),
  },
};