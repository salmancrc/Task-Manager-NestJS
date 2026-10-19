import { createContext, useContext } from 'react'
import type { ToastType } from '../components/ui/Toast'

export const PENDING_TOAST_STORAGE_KEY = 'task-manager-pending-toast'

interface ToastItem {
  id: number
  message: string
  type: ToastType
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void
  dismissToast: (id: number) => void
  toasts: ToastItem[]
}

export const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return ctx
}

export type { ToastType }
