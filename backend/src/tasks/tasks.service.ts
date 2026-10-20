import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Task } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksFilterDto, TaskStatus } from './dto/get-tasks-filter.dto';
import { PaginatedTasksResponse } from './dto/paginated-tasks.response';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    userId: number,
    filterDto: GetTasksFilterDto,
  ): Promise<PaginatedTasksResponse> {
    const { status, priority, search, tag, page = 1, limit = 10 } = filterDto;

    const where = {
      userId,
      deletedAt: null,
      priority,
      completed:
        status !== undefined ? status === TaskStatus.COMPLETED : undefined,

      title: search
        ? { contains: search, mode: 'insensitive' as const }
        : undefined,
      tags: tag ? { some: { name: tag } } : undefined,
    };

    const [data, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        include: { tags: true },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.task.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
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

  async findDeleted(
    userId: number,
    page = 1,
    limit = 10,
  ): Promise<PaginatedTasksResponse> {
    const where = { userId, deletedAt: { not: null } };
    const [data, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        include: { tags: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { deletedAt: 'desc' },
      }),
      this.prisma.task.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
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
