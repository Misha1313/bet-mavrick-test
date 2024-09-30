import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AxiosService } from '../common/axios';
import Redis from 'ioredis';
import { Cron, CronExpression } from '@nestjs/schedule';
import { startOfHour } from 'date-fns';
import { ConfigService } from '@nestjs/config';

type CryptoData = {
  success: boolean;
  timestamp: number;
  target: string;
  rates: any[]
} 

type LastRecord = {
  lastUpdate: Date;
  rates: any[]
}

type CallLimit = {
  date: Date;
  callCount: number;
}

@Injectable()
export class TaskService {
  redisKey = 'crypto';
  redisKeyCallLimit = 'call-limit';

  constructor(
    private readonly axiosService: AxiosService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    private configService: ConfigService
  ) {}
  
  @Cron(CronExpression.EVERY_10_MINUTES)
  async importData() {
    const data: CryptoData = await this.axiosService.get('live', {
      params: { 
        target: 'EUR',
        expand: 1
       }
    });

    this.redis.set(
      this.redisKey,
      JSON.stringify(data)
    );

    const unixTimestamp = data.timestamp; // Example Unix timestamp
    const date = new Date(unixTimestamp * 1000);
    
    console.log('data', data.timestamp, data.target, date.toLocaleString());

  }

  async getLastRecord(): Promise<LastRecord> {
    // check if call count is more than limit
    let callLimit: CallLimit = JSON.parse(
      await this.redis.get(this.redisKeyCallLimit)
    );

    if(
      startOfHour(callLimit?.date).getTime() === startOfHour(new Date()).getTime() &&
      callLimit?.callCount + 1 > this.configService.get<number>('CALL_LIMIT_PER_MINUTE')
    ) {
      throw new HttpException('call count per hour has been exceeded its limit', HttpStatus.BAD_REQUEST);
    }

    const redisData: CryptoData = JSON.parse(
      await this.redis.get(this.redisKey)
    );

    if(!callLimit) {
      callLimit = {
        date: new Date(),
        callCount: 1
      }
    } else {
      callLimit.callCount = startOfHour(callLimit.date).getTime() === startOfHour(new Date()).getTime() ? callLimit.callCount + 1 : 1;
      callLimit.date = new Date();
    }

    
    await this.redis.set(this.redisKeyCallLimit, JSON.stringify(callLimit));

    // console.log('callCount', callLimit?.callCount);

    const unixTimestamp = redisData.timestamp;
    const date = new Date(unixTimestamp * 1000);

    return {
      lastUpdate: date,
      rates: redisData.rates
    };

  }
  
}
