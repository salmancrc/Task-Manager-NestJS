import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from '@prisma/client';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import type { JwtPayload } from 'src/auth/interfaces/jwt.payload.interface';

@UseGuards(AuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  findAll(
    @GetUser() user: JwtPayload,
    @Query() filterDto: GetTasksFilterDto,
  ): Promise<Task[]> {
    return this.taskService.findAll(user.sub, filterDto);
  }

  @Get(':id')
  findOne(
    @GetUser() user: JwtPayload,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Task> {
    return this.taskService.findOne(user.sub, id);
  }

  @Post()
  create(
    @GetUser() user: JwtPayload,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    return this.taskService.create(createTaskDto, user.sub);
  }

  @Patch(':id')
  update(
    @GetUser() user: JwtPayload,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.update(id, user.sub, updateTaskDto);
  }

  @Delete(':id')
  remove(@GetUser() user: JwtPayload, @Param('id', ParseIntPipe) id: number) {
    return this.taskService.remove(id, user.sub);
  }
}
