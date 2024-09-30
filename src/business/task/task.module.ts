import { Module } from '@nestjs/common';

import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { AxiosModule } from '../common/axios';
import { configService } from 'src/config/cli.config.service';

@Module({
  imports: [
    AxiosModule.register({
      baseURL:  configService.get('BASE_URL'), //'https://api.coinlayer.com/'
      params: {
        access_key: configService.get('ACCESS_KEY')
      }
    })
  ],
  controllers: [
    TaskController
  ],
  providers: [
    TaskService
  ]
})
export class TaskModule {
  
}
