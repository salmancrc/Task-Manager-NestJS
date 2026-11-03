import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  readonly client: ReturnType<typeof createClient>;

  constructor(config: ConfigService) {
    this.client = createClient({
      socket: {
        host: config.getOrThrow<string>('REDIS_HOST'),
        port: config.getOrThrow<number>('REDIS_PORT'),
      },
    });

    this.client.on('error', (error) => {
      this.logger.error('Redis client error', error);
    });
  }

  async onModuleInit() {
    await this.client.connect();
    await this.client.ping();
    this.logger.log('Connected to Redis');
  }

  async onModuleDestroy() {
    if (this.client.isOpen) {
      await this.client.quit();
      this.logger.log('Disconnected from Redis');
    }
  }
}
