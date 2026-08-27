import { useQuery } from '@tanstack/react-query'
import { getTasks } from '../api/tasks'
import type { GetTasksParams } from '../types/task'

// Fetches the task list. Re-fetches automatically whenever 'params' changes.
// The queryKey includes params so each unique filter combo is cached separately.
export function useTasks(params: GetTasksParams) {
  return useQuery({
    queryKey: ['tasks', params],
    queryFn: () => getTasks(params),
  })
}
