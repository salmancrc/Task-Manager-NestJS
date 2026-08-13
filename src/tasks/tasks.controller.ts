import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import type { Task } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.findOne(id);
  }

  @Post()
  create(@Body() body: Task) {
    return this.taskService.create(body);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.remove(id);
  }
}
