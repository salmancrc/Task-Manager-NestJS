import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTask } from '../api/tasks'
import type { UpdateTaskDto } from '../types/task'

export function useUpdateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTaskDto }) =>
      updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}
