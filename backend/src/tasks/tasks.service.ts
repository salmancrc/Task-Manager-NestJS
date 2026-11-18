import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { Task } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksFilterDto, TaskStatus } from './dto/get-tasks-filter.dto';
import { PaginatedTasksResponse } from './dto/paginated-tasks.response';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  private readonly listCacheTtlSeconds = 60;

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

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

    const shouldCache =
      status === undefined &&
      priority === undefined &&
      search === undefined &&
      tag === undefined &&
      page === 1 &&
      limit === 10;
    const cacheKey = `tasks:list:${userId}`;

    if (shouldCache) {
      const cached = await this.redis.get(cacheKey);
      if (cached !== null) {
        try {
          return JSON.parse(cached) as PaginatedTasksResponse;
        } catch {
          this.logger.warn(
            `Ignoring invalid task-list cache for user ${userId}`,
          );
          await this.redis.delete(cacheKey);
        }
      }
    }

    const [data, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        include: { tags: true },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.task.count({ where }),
    ]);

    const result = {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    if (shouldCache) {
      await this.redis.set(
        cacheKey,
        JSON.stringify(result),
        this.listCacheTtlSeconds,
      );
    }

    return result;
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
    const task = await this.prisma.task.create({
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
    await this.invalidateTaskListCache(userId);
    return task;
  }

  async update(
    id: number,
    userId: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    await this.findOne(userId, id);

    const { tags, dueDate, ...taskData } = updateTaskDto;

    const task = await this.prisma.task.update({
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
    await this.invalidateTaskListCache(userId);
    return task;
  }

  async remove(id: number, userId: number): Promise<Task> {
    await this.findOne(userId, id);
    const task = await this.prisma.task.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
      include: { tags: true },
    });
    await this.invalidateTaskListCache(userId);
    return task;
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

    const restoredTask = await this.prisma.task.update({
      where: { id },
      data: { deletedAt: null },
      include: { tags: true },
    });
    await this.invalidateTaskListCache(userId);
    return restoredTask;
  }

  private async invalidateTaskListCache(userId: number): Promise<void> {
    await this.redis.delete(`tasks:list:${userId}`);
  }
}
