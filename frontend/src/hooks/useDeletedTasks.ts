import { useQuery } from '@tanstack/react-query'
import { getDeletedTasks } from '../api/tasks'
import type { GetTasksParams } from '../types/task'

export function useDeletedTasks(params: GetTasksParams) {
  return useQuery({
    queryKey: ['deleted-tasks', params],
    queryFn: () => getDeletedTasks(params),
  })
}
