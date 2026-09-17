import { Modal } from '../ui/Modal'
import { TaskForm } from './TaskForm'
import type { Task, CreateTaskDto, UpdateTaskDto } from '../../types/task'
import { useCreateTask } from '../../hooks/useCreateTask'
import { useUpdateTask } from '../../hooks/useUpdateTask'

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  task?: Task | null // If provided, we are editing
  onSuccess: (message: string) => void
  onError: (message: string) => void
}

export function TaskModal({ isOpen, onClose, task, onSuccess, onError }: TaskModalProps) {
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()

  const isSubmitting = createTask.isPending || updateTask.isPending

  const handleSubmit = async (data: CreateTaskDto | UpdateTaskDto) => {
    try {
      if (task) {
        // Edit mode
        await updateTask.mutateAsync({ id: task.id, data })
        onSuccess('Task updated successfully!')
      } else {
        // Create mode
        await createTask.mutateAsync(data as CreateTaskDto)
        onSuccess('Task created successfully!')
      }
      onClose()
    } catch (err) {
      onError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task ? 'Edit Task' : 'New Task'}>
      <TaskForm
        key={task?.id ?? 'new'}
        task={task}
        onSubmit={handleSubmit}
        onCancel={onClose}
        isSubmitting={isSubmitting}
      />
    </Modal>
  )
}
