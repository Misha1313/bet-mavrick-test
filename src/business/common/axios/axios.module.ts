import { HttpModule, HttpModuleOptions } from '@nestjs/axios';
import { DynamicModule, Module } from '@nestjs/common';

import { AxiosService } from './axios.service';

@Module({})
export class AxiosModule {
  static register(options: HttpModuleOptions): DynamicModule {
    console.log('AxiosModule Options : ', options);
    return {
      module: AxiosModule,
      imports: [HttpModule.register(options)],
      providers: [AxiosService],
      exports: [AxiosService]
    };
  }
}
