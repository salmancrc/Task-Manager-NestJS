interface BadgeProps {
  completed: boolean
}

export function Badge({ completed }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        completed
          ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20'
          : 'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20'
      }`}
    >
      <span
        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
          completed ? 'bg-emerald-400' : 'bg-amber-400'
        }`}
      />
      {completed ? 'Completed' : 'Pending'}
    </span>
  )
}
