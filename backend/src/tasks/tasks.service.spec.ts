import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { TasksService } from './tasks.service';

jest.mock('../redis/redis.service', () => ({
  RedisService: class RedisService {},
}));

describe('TasksService', () => {
  let service: TasksService;
  const prisma = {
    task: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };
  const redis = {
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    redis.get.mockResolvedValue(null);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: PrismaService, useValue: prisma },
        { provide: RedisService, useValue: redis },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns task data with pagination metadata', async () => {
    const tasks = [];
    prisma.task.findMany.mockResolvedValue(tasks);
    prisma.task.count.mockResolvedValue(23);

    await expect(service.findAll(7, { page: 2, limit: 10 })).resolves.toEqual({
      data: tasks,
      total: 23,
      page: 2,
      limit: 10,
      totalPages: 3,
    });
    expect(prisma.task.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 10, take: 10 }),
    );
    expect(prisma.task.count).toHaveBeenCalledWith({
      where: expect.objectContaining({ userId: 7, deletedAt: null }),
    });
  });

  it('caches the default task list for 60 seconds', async () => {
    const tasks = [];
    prisma.task.findMany.mockResolvedValue(tasks);
    prisma.task.count.mockResolvedValue(0);

    await service.findAll(7, {});

    expect(redis.set).toHaveBeenCalledWith(
      'tasks:list:7',
      JSON.stringify({
        data: tasks,
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      }),
      60,
    );
  });

  it('returns the cached default task list without querying the database', async () => {
    const cachedList = {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    };
    redis.get.mockResolvedValue(JSON.stringify(cachedList));

    await expect(service.findAll(7, {})).resolves.toEqual(cachedList);
    expect(prisma.task.findMany).not.toHaveBeenCalled();
    expect(prisma.task.count).not.toHaveBeenCalled();
  });

  it('does not cache filtered task lists', async () => {
    prisma.task.findMany.mockResolvedValue([]);
    prisma.task.count.mockResolvedValue(0);

    await service.findAll(7, { search: 'example' });

    expect(redis.get).not.toHaveBeenCalled();
    expect(redis.set).not.toHaveBeenCalled();
  });

  it('returns zero pages when no deleted tasks match', async () => {
    prisma.task.findMany.mockResolvedValue([]);
    prisma.task.count.mockResolvedValue(0);

    await expect(service.findDeleted(7, 1, 10)).resolves.toEqual({
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    });
  });
});
