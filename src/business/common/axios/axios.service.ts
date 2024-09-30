import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class AxiosService {
  constructor(private readonly httpService: HttpService) {}
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    console.log('AxiosService Get :', url, config);
    const response = await firstValueFrom(
      this.httpService.get<T>(url, config).pipe(
        catchError((error) => {
          console.log('AxiosService Get Error:', error);
          console.error(
            'AxiosService Get Error:',
            error?.response?.data?.message,
          );
          throw new HttpException(
            'Failed to make HTTP Get request',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }),
      ),
    );
    //console.log('AxiosService Get Response:', response);

    return response.data;
  }

  async getFullData<T>(url: string, config?: AxiosRequestConfig) {
    console.log('AxiosService Get Full Data :', url);
    try {
      return this.httpService.axiosRef.get<T>(url, config);
    } catch (error) {
      console.error(
        'AxiosService getFullData Error:',
        error?.response?.data?.message,
      );
      throw error;
    }
  }
}
