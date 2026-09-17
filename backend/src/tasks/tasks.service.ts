import {
  BadRequestException,
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
    const { status, priority, search, tag, page = 1, limit = 10 } = filterDto;

    return this.prisma.task.findMany({
      where: {
        userId,
        deletedAt: null,
        priority,
        completed:
          status !== undefined ? status === TaskStatus.COMPLETED : undefined,

        title: search ? { contains: search, mode: 'insensitive' } : undefined,
        tags: tag ? { some: { name: tag } } : undefined,
      },

      include: { tags: true },

      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findOne(userId: number, id: number): Promise<Task> {
    const task = await this.prisma.task.findFirst({
      where: { id, deletedAt: null },
      include: { tags: true },
    });
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
        priority: createTaskDto.priority,
        dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : null,
        user: {
          connect: {
            id: userId,
          },
        },
        tags: {
          connectOrCreate:
            createTaskDto.tags?.map((name) => ({
              where: { name },
              create: { name },
            })) ?? [],
        },
      },
      include: { tags: true },
    });
  }

  async update(
    id: number,
    userId: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    await this.findOne(userId, id);

    const { tags, dueDate, ...taskData } = updateTaskDto;

    return this.prisma.task.update({
      where: { id },
      data: {
        ...taskData,
        ...(dueDate !== undefined && {
          dueDate: dueDate ? new Date(dueDate) : null,
        }),
        ...(tags !== undefined && {
          tags: {
            set: [],
            connectOrCreate: tags.map((name) => ({
              where: { name },
              create: { name },
            })),
          },
        }),
      },
      include: { tags: true },
    });
  }

  async remove(id: number, userId: number): Promise<Task> {
    await this.findOne(userId, id);
    return this.prisma.task.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
      include: { tags: true },
    });
  }

  async findDeleted(userId: number, page = 1, limit = 10): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: { userId, deletedAt: { not: null } },
      include: { tags: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { deletedAt: 'desc' },
    });
  }

  async restore(id: number, userId: number): Promise<Task> {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    if (task.userId !== userId) {
      throw new ForbiddenException('You do not have access to this task');
    }
    if (!task.deletedAt) {
      throw new BadRequestException('Task is not deleted');
    }

    return this.prisma.task.update({
      where: { id },
      data: { deletedAt: null },
      include: { tags: true },
    });
  }
}
