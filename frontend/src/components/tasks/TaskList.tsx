import { TaskCard } from './TaskCard'
import { Spinner } from '../ui/Spinner'
import { EmptyState } from '../ui/EmptyState'
import type { Task } from '../../types/task'

interface TaskListProps {
  tasks: Task[] | undefined
  isLoading: boolean
  isError: boolean
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

export function TaskList({ tasks, isLoading, isError, onEdit, onDelete }: TaskListProps) {
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-gray-800 border-dashed bg-gray-900/20">
        <Spinner size="lg" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-red-900/50 border-dashed bg-red-950/20 text-center">
        <svg className="mb-3 h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="font-medium text-red-400">Failed to load tasks</p>
        <p className="text-sm text-red-500/70">Please check if your backend server is running.</p>
      </div>
    )
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-800 border-dashed bg-gray-900/20">
        <EmptyState />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}
