export interface IntegrationMeta {
  id: string;
  name: string;
  description: string;
  authUrl?: string;
  tokenUrl?: string;
  scopes?: string[];
  fields?: Array<{ key: string; label: string; type: 'text' | 'password' | 'url' }>;
  dataRoute: string;
  statusRoute?: string;
  category: 'dev' | 'payments' | 'marketing' | 'infra' | 'social' | 'other';
}

export interface IntegrationStatus {
  id: string;
  connected: boolean;
  lastSync?: string;
  error?: string;
}

export interface IntegrationClient {
  getMeta(): IntegrationMeta;
  getStatus(token: string): Promise<IntegrationStatus>;
  fetchData(token: string, params: Record<string, string | undefined>): Promise<unknown>;
}

export class IntegrationRegistry {
  private static clients = new Map<string, IntegrationClient>();

  static register(client: IntegrationClient) {
    this.clients.set(client.getMeta().id, client);
  }

  static get(id: string) {
    return this.clients.get(id);
  }

  static list() {
    return Array.from(this.clients.values()).map((client) => client.getMeta());
  }
}
