import { gql } from 'graphql-tag';

export const typeDefs = gql`
  scalar DateTime
  scalar JSON

  type SystemIntegration {
    id: ID!
    name: String!
    type: String!
    status: IntegrationStatus!
    lastSync: DateTime
    metrics: JSON
    config: JSON
  }

  enum IntegrationStatus {
    CONNECTED
    DISCONNECTED
    ERROR
    SYNCING
  }

  type DashboardMetric {
    id: ID!
    category: String!
    label: String!
    value: Float!
    unit: String
    change: Float
    changePercent: Float
    timestamp: DateTime
    system: String!
  }

  type UnifiedDashboard {
    id: ID!
    systems: [SystemIntegration!]!
    metrics: [DashboardMetric!]!
    summary: DashboardSummary!
    lastUpdated: DateTime!
  }

  type DashboardSummary {
    totalSystems: Int!
    connectedSystems: Int!
    totalMetrics: Int!
    avgResponseTime: Float
    errorRate: Float
  }

  type Lead {
    id: ID!
    name: String!
    email: String
    phone: String
    property: String
    status: String!
    source: String
    createdAt: DateTime!
  }

  type FitnessClass {
    id: ID!
    name: String!
    instructor: String!
    startTime: DateTime!
    endTime: DateTime!
    capacity: Int!
    booked: Int!
    status: String!
  }

  type Payment {
    id: ID!
    amount: Float!
    currency: String!
    status: String!
    method: String
    createdAt: DateTime!
    reference: String
  }

  type AIAgentMetrics {
    model: String!
    tokensUsed: Int!
    requestsCount: Int!
    avgResponseTime: Float!
    errorRate: Float!
    lastActivity: DateTime!
  }

  type VPSMetrics {
    cpuUsage: Float!
    memoryUsage: Float!
    diskUsage: Float!
    networkIn: Float!
    networkOut: Float!
    uptime: Int!
    timestamp: DateTime!
  }

  type GitHubRepo {
    id: ID!
    name: String!
    fullName: String!
    private: Boolean!
    htmlUrl: String!
    description: String
    language: String
    stargazersCount: Int!
    forksCount: Int!
    openIssuesCount: Int!
    updatedAt: DateTime!
    pushedAt: DateTime!
  }

  type GitHubIssue {
    id: ID!
    number: Int!
    title: String!
    state: String!
    htmlUrl: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    pullRequest: JSON
  }

  type VercelProject {
    id: ID!
    name: String!
    framework: String
    createdAt: DateTime!
    updatedAt: DateTime!
    latestDeployments: [VercelDeployment!]!
  }

  type VercelDeployment {
    id: ID!
    url: String!
    state: String!
    createdAt: DateTime!
    ready: Float
    buildingAt: Float
    inspectorUrl: String
  }

  type Query {
    # Unified dashboard
    dashboard: UnifiedDashboard!
    
    # System integrations
    systems: [SystemIntegration!]!
    system(id: ID!): SystemIntegration
    
    # Metrics
    metrics(category: String, limit: Int = 50): [DashboardMetric!]!
    
    # Business-specific queries
    leads(status: String, limit: Int = 20): [Lead!]!
    fitnessClasses(start: DateTime, end: DateTime): [FitnessClass!]!
    payments(limit: Int = 20): [Payment!]!
    aiAgentMetrics: [AIAgentMetrics!]!
    vpsMetrics: VPSMetrics!
    githubRepos(limit: Int = 20): [GitHubRepo!]!
    githubIssues(state: String = "open", limit: Int = 20): [GitHubIssue!]!
    vercelProjects(limit: Int = 20): [VercelProject!]!
    vercelDeployments(projectId: ID!, limit: Int = 10): [VercelDeployment!]!
    
    # Real-time data
    systemStatus(systemId: ID!): SystemIntegration!
  }

  type Mutation {
    # Sync data from systems
    syncSystem(systemId: ID!): SystemIntegration!
    syncAllSystems: [SystemIntegration!]!
    
    # Configure integrations
    updateSystemConfig(
      id: ID!
      config: JSON!
    ): SystemIntegration!
    
    # Manual lead creation
    createLead(input: LeadInput!): Lead!
  }

  input LeadInput {
    name: String!
    email: String
    phone: String
    property: String
    status: String = "new"
    source: String
  }

  subscription {
    systemStatusUpdated(systemId: ID): SystemIntegration!
    metricUpdated(category: String): DashboardMetric!
    leadCreated: Lead!
  }
`;