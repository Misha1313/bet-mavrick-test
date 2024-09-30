import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './business/task/task.module';
import { RedisModule } from './business/common/redis/redis.module';
import { ConfigModule } from './config/config.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [TaskModule, RedisModule, ConfigModule, ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
