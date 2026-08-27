import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTask } from '../api/tasks'
import type { CreateTaskDto } from '../types/task'

// After a successful creation, invalidate the tasks cache so the list auto-refreshes
export function useCreateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTaskDto) => createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}
