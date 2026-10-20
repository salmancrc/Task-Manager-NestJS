import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;
  const prisma = {
    task: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService, { provide: PrismaService, useValue: prisma }],
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
