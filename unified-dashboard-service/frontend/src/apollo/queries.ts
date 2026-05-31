import { gql } from '@apollo/client';

export const DASHBOARD_QUERY = gql`
  query GetDashboard {
    dashboard {
      id
      lastUpdated
      summary {
        totalSystems
        connectedSystems
        totalMetrics
        avgResponseTime
        errorRate
      }
      systems {
        id
        name
        type
        status
        lastSync
        metrics
      }
      metrics {
        id
        category
        label
        value
        unit
        change
        changePercent
        system
      }
    }
  }
`;

export const SYSTEM_STATUS_SUBSCRIPTION = gql`
  subscription SystemStatusUpdated {
    systemStatusUpdated {
      id
      name
      status
      lastSync
    }
  }
`;