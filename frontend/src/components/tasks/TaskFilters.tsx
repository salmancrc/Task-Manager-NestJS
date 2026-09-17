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
          className="w-full rounded-lg border border-gray-700 bg-gray-800/50 py-2.5 pl-9 pr-10 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
        {searchInput && (
          <button
            type="button"
            aria-label="Clear search"
            title="Clear search"
            onClick={() => setSearchInput('')}
            className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-700 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Status filter dropdown */}
      <div className="relative sm:w-44">
        <select
          value={filters.status ?? ''}
          onChange={(e) =>
            onChange({
              ...filters,
              status: e.target.value as GetTasksParams['status'],
              page: 1,
            })
          }
          className="w-full appearance-none rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-2.5 pr-9 text-sm text-white outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">All Tasks</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9l6 6 6-6" />
        </svg>
      </div>

      <div className="relative sm:w-36">
        <select
          value={filters.priority ?? ''}
          onChange={(e) =>
            onChange({
              ...filters,
              priority: e.target.value as GetTasksParams['priority'],
              page: 1,
            })
          }
          className="w-full appearance-none rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-2.5 pr-9 text-sm text-white outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">All priorities</option>
          <option value="HIGH">High priority</option>
          <option value="MEDIUM">Medium priority</option>
          <option value="LOW">Low priority</option>
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </div>
  )
}
