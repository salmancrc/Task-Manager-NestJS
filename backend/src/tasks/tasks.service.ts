import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Task } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksFilterDto, TaskStatus } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: number, filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search, page = 1, limit = 10 } = filterDto;

    return this.prisma.task.findMany({
      where: {
        userId,
        completed:
          status !== undefined ? status === TaskStatus.COMPLETED : undefined,

        title: search ? { contains: search, mode: 'insensitive' } : undefined,
      },

      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findOne(userId: number, id: number): Promise<Task> {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    if (task.userId !== userId) {
      throw new ForbiddenException('You do not have access to this task');
    }

    return task;
  }

  async create(createTaskDto: CreateTaskDto, userId: number): Promise<Task> {
    return this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        completed: createTaskDto.completed ?? false,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async update(
    id: number,
    userId: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    await this.findOne(userId, id);

    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  async remove(id: number, userId: number): Promise<Task> {
    await this.findOne(userId, id);
    return this.prisma.task.delete({ where: { id } });
  }
}
