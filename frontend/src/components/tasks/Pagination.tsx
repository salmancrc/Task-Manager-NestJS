interface PaginationProps {
  page: number
  hasMore: boolean
  onChange: (page: number) => void
}

export function Pagination({ page, hasMore, onChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-between border-t border-gray-800 pt-4">
      <span className="text-sm text-gray-500">Page {page}</span>
      <div className="flex gap-2">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          className="flex items-center gap-1.5 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>
        <button
          onClick={() => onChange(page + 1)}
          disabled={!hasMore}
          className="flex items-center gap-1.5 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
