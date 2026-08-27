import type { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'danger' | 'ghost' | 'success'
  disabled?: boolean
  className?: string
}

export function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
}: ButtonProps) {
  const base =
    'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'

  const variants = {
    primary:
      'bg-indigo-600 text-white hover:bg-indigo-500 focus:ring-indigo-500 shadow-lg shadow-indigo-500/20',
    danger:
      'bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30 focus:ring-red-500',
    ghost:
      'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700 focus:ring-gray-500',
    success:
      'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30 focus:ring-emerald-500',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
