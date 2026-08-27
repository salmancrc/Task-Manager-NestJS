export function EmptyState({ message = 'No tasks found' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {/* Simple SVG illustration */}
      <div className="mb-4 rounded-full bg-gray-800/50 p-5">
        <svg
          className="h-10 w-10 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      </div>
      <p className="text-base font-medium text-gray-400">{message}</p>
      <p className="mt-1 text-sm text-gray-600">Create a new task to get started</p>
    </div>
  )
}
