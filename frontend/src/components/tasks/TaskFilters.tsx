import type { GetTasksParams } from '../../types/task'
import { useEffect, useState } from 'react'

interface TaskFiltersProps {
  filters: GetTasksParams
  onChange: (filters: GetTasksParams) => void
}

export function TaskFilters({ filters, onChange }: TaskFiltersProps) {
  // Local state for search input so we can debounce before updating parent
  const [searchInput, setSearchInput] = useState(filters.search ?? '')

  // Debounce: wait 400ms after user stops typing before calling the API
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange({ ...filters, search: searchInput, page: 1 })
    }, 400)
    return () => clearTimeout(timer)
  }, [searchInput]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Search input */}
      <div className="relative flex-1">
        <svg
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full rounded-lg border border-gray-700 bg-gray-800/50 py-2.5 pl-9 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      {/* Status filter dropdown */}
      <select
        value={filters.status ?? ''}
        onChange={(e) =>
          onChange({
            ...filters,
            status: e.target.value as GetTasksParams['status'],
            page: 1,
          })
        }
        className="rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:w-44"
      >
        <option value="">All Tasks</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  )
}
