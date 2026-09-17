import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { useUpdateTask } from '../../hooks/useUpdateTask'
import type { Task } from '../../types/task'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onRestore?: (task: Task) => void
}

export function TaskCard({ task, onEdit, onDelete, onRestore }: TaskCardProps) {
  const updateTask = useUpdateTask()

  // Quick toggle: click the checkbox to flip completed status without opening the modal
  const handleToggle = () => {
    updateTask.mutate({ id: task.id, data: { completed: !task.completed } })
  }

  const priorityStyles = {
    LOW: 'bg-sky-500/10 text-sky-300 ring-sky-500/20',
    MEDIUM: 'bg-amber-500/10 text-amber-300 ring-amber-500/20',
    HIGH: 'bg-rose-500/10 text-rose-300 ring-rose-500/20',
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

      <div className="min-w-0 flex-1">
        <span
          className={`block truncate text-sm font-medium transition-colors ${
            task.completed ? 'text-gray-500 line-through' : 'text-gray-100'
          }`}
        >
          {task.title}
        </span>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${priorityStyles[task.priority ?? 'MEDIUM']}`}>
            {(task.priority ?? 'MEDIUM').charAt(0) + (task.priority ?? 'MEDIUM').slice(1).toLowerCase()}
          </span>
          {task.dueDate && (
            <span className="text-xs text-gray-500">
              Due {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
          {(task.tags ?? []).map((tag) => (
            <span key={tag.id} className="rounded-full bg-gray-800 px-2 py-0.5 text-[11px] text-gray-400">
              #{tag.name}
            </span>
          ))}
        </div>
      </div>

      <Badge completed={task.completed} />

      {/* Action buttons — only visible on hover */}
      <div className="flex items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
        {onRestore ? (
          <Button variant="success" onClick={() => onRestore(task)} className="!px-2.5 !py-1.5 text-xs">
            Restore
          </Button>
        ) : (
          <>
            <Button variant="ghost" onClick={() => onEdit(task)} className="!px-2.5 !py-1.5 text-xs">
              Edit
            </Button>
            <Button variant="danger" onClick={() => onDelete(task)} className="!px-2.5 !py-1.5 text-xs">
              Delete
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
