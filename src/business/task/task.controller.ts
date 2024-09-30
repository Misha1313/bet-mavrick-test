import { Controller, Get } from '@nestjs/common';
import { TaskService } from './task.service';

@Controller()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('import')
  async importData() {
    await this.taskService.importData();
  }

  @Get('last')
  async getLastRecord() {
    return this.taskService.getLastRecord();
  }
}
