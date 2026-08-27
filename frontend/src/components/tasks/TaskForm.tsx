import { useState, useEffect } from 'react'
import { Button } from '../ui/Button'
import type { Task, CreateTaskDto, UpdateTaskDto } from '../../types/task'

interface TaskFormProps {
  task?: Task | null // If provided, we are in edit mode
  onSubmit: (data: CreateTaskDto | UpdateTaskDto) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export function TaskForm({ task, onSubmit, onCancel, isSubmitting = false }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title ?? '')
  const [completed, setCompleted] = useState(task?.completed ?? false)
  const [error, setError] = useState('')

  // Sync form fields when a different task is passed in (e.g. switching edits)
  useEffect(() => {
    setTitle(task?.title ?? '')
    setCompleted(task?.completed ?? false)
    setError('')
  }, [task])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Task title is required')
      return
    }
    onSubmit({ title: title.trim(), completed })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Title field */}
      <div>
        <label htmlFor="task-title" className="mb-1.5 block text-sm font-medium text-gray-300">
          Task Title <span className="text-red-400">*</span>
        </label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            if (error) setError('')
          }}
          placeholder="e.g. Review pull request"
          className={`w-full rounded-lg border bg-gray-800/50 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:ring-1 ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-700 focus:border-indigo-500 focus:ring-indigo-500'
          }`}
          autoFocus
        />
        {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
      </div>

      {/* Completed toggle */}
      <label className="flex cursor-pointer items-center gap-3">
        <div className="relative">
          <input
            type="checkbox"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
            className="sr-only"
          />
          <div
            className={`h-6 w-11 rounded-full transition-colors ${
              completed ? 'bg-indigo-600' : 'bg-gray-700'
            }`}
          >
            <div
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                completed ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </div>
        </div>
        <span className="text-sm text-gray-300">Mark as completed</span>
      </label>

      {/* Action buttons */}
      <div className="flex justify-end gap-2 border-t border-gray-800 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : task ? 'Save Changes' : 'Create Task'}
        </Button>
      </div>
    </form>
  )
}
