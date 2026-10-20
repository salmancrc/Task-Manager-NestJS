import type { Task } from '@prisma/client';

export interface PaginatedTasksResponse {
  data: Task[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
