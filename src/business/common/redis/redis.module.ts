import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { RedisOptions } from 'ioredis/built/redis/RedisOptions';

export const REDIS_CLIENT = 'REDIS_CLIENT';

const exportedProviders = [
  {
    provide: REDIS_CLIENT,
    useFactory: (configService: ConfigService) => {
      const enableAuth =
        configService.get<string>('REDIS_SERVICE_ENABLE_AUTH') === 'true';
      console.log(
        'Redis Enable Auth::',
        enableAuth,
        configService.get<string>('REDIS_SERVICE_URL')
      );

      const options: RedisOptions = {
        host: configService.get<string>('REDIS_SERVICE_URL'),
        port: configService.get<number>('REDIS_SERVICE_PORT'),
        ...(enableAuth
          ? {
              username: configService.get<string>('REDIS_SERVICE_USERNAME'),
              password: configService.get<string>('REDIS_SERVICE_PASSWORD')
            }
          : {})
      };
      return new Redis(options);
    },
    inject: [ConfigService]
  }
];

@Global()
@Module({
  providers: [...exportedProviders],
  exports: [...exportedProviders]
})
export class RedisModule {}
