import redis from 'redis';

export class CacheService {
  private static instance: CacheService;
  private client: redis.RedisClientType | null = null;

  private constructor() {}

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  async connect(): Promise<void> {
    this.client = redis.createClient({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
    });

    this.client.on('error', (err) => {
      console.error('Redis Client Error', err);
    });

    await this.client.connect();
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.client) {
      throw new Error('Cache not connected');
    }
    const value = await this.client.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: any, ttl: number = 300): Promise<void> {
    if (!this.client) {
      throw new Error('Cache not connected');
    }
    await this.client.setEx(key, ttl, JSON.stringify(value));
  }

  async subscribe(channel: string): Promise<AsyncIterator<any>> {
    if (!this.client) {
      throw new Error('Cache not connected');
    }
    const subscriber = this.client.duplicate();
    await subscriber.connect();
    await subscriber.subscribe(channel);
    return subscriber.iterateMessages();
  }
}