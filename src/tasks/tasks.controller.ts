import { Body, Controller, Get, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import type { Task } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @Post()
  create(@Body() body: Task) {
    return this.taskService.create(body);
  }
}
