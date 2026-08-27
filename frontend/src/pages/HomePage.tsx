import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { TaskFilters } from '../components/tasks/TaskFilters'
import { TaskList } from '../components/tasks/TaskList'
import { Pagination } from '../components/tasks/Pagination'
import { TaskModal } from '../components/tasks/TaskModal'
import { ToastContainer, type ToastType } from '../components/ui/Toast'
import { useTasks } from '../hooks/useTasks'
import { useDeleteTask } from '../hooks/useDeleteTask'
import type { Task, GetTasksParams } from '../types/task'

export function HomePage() {
  const [filters, setFilters] = useState<GetTasksParams>({
    search: '',
    status: '',
    page: 1,
    limit: 10,
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  
  // Toast state management
  const [toasts, setToasts] = useState<{ id: number; message: string; type: ToastType }[]>([])
  
  const showToast = (message: string, type: ToastType = 'success') => {
    setToasts((prev) => [...prev, { id: Date.now(), message, type }])
  }
  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  // Fetch tasks using React Query
  const { data: tasks, isLoading, isError } = useTasks(filters)
  
  // Delete mutation
  const deleteTask = useDeleteTask()

  const handleDelete = async (task: Task) => {
    if (!window.confirm(`Are you sure you want to delete "${task.title}"?`)) return
    
    try {
      await deleteTask.mutateAsync(task.id)
      showToast('Task deleted successfully')
      
      // If we deleted the last item on the page, go back a page
      if (tasks?.length === 1 && filters.page! > 1) {
        setFilters((prev) => ({ ...prev, page: prev.page! - 1 }))
      }
    } catch (err) {
      showToast('Failed to delete task', 'error')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header section with filters and New Task button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-white">Your Tasks</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Task
        </Button>
      </div>

      <TaskFilters filters={filters} onChange={setFilters} />

      {/* Main task list */}
      <TaskList
        tasks={tasks}
        isLoading={isLoading}
        isError={isError}
        onEdit={(task) => {
          setEditingTask(task)
          setIsModalOpen(true)
        }}
        onDelete={handleDelete}
      />

      {/* Pagination controls */}
      {!isLoading && !isError && tasks && (
        <Pagination
          page={filters.page ?? 1}
          hasMore={tasks.length === filters.limit}
          onChange={(page) => setFilters({ ...filters, page })}
        />
      )}

      {/* Create / Edit Modal */}
      <TaskModal
        isOpen={isModalOpen}
        task={editingTask}
        onClose={() => {
          setIsModalOpen(false)
          // Delay clearing the editing state slightly so the modal exit animation is smooth
          setTimeout(() => setEditingTask(null), 300)
        }}
        onSuccess={(msg) => showToast(msg, 'success')}
        onError={(msg) => showToast(msg, 'error')}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  )
}
