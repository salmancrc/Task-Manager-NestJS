import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { useUpdateTask } from '../../hooks/useUpdateTask'
import type { Task } from '../../types/task'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const updateTask = useUpdateTask()

  // Quick toggle: click the checkbox to flip completed status without opening the modal
  const handleToggle = () => {
    updateTask.mutate({ id: task.id, data: { completed: !task.completed } })
  }

  return (
    <div className="group flex items-center gap-4 rounded-xl border border-gray-800 bg-gray-900/50 px-5 py-4 transition-all duration-200 hover:border-gray-700 hover:bg-gray-900">
      {/* Quick-complete checkbox */}
      <button
        onClick={handleToggle}
        disabled={updateTask.isPending}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${
          task.completed
            ? 'border-emerald-500 bg-emerald-500'
            : 'border-gray-600 hover:border-indigo-400'
        }`}
      >
        {task.completed && (
          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Task title */}
      <span
        className={`flex-1 text-sm font-medium transition-colors ${
          task.completed ? 'text-gray-500 line-through' : 'text-gray-100'
        }`}
      >
        {task.title}
      </span>

      {/* Status badge */}
      <Badge completed={task.completed} />

      {/* Action buttons — only visible on hover */}
      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <Button variant="ghost" onClick={() => onEdit(task)} className="!px-2.5 !py-1.5 text-xs">
          Edit
        </Button>
        <Button variant="danger" onClick={() => onDelete(task)} className="!px-2.5 !py-1.5 text-xs">
          Delete
        </Button>
      </div>
    </div>
  )
}
