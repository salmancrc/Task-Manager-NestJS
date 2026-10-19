import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { ToastContainer, type ToastType } from '../components/ui/Toast'
import { setApiErrorHandler } from '../api/axios'
import { PENDING_TOAST_STORAGE_KEY, ToastContext } from './toast'

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

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>(() => {
    const pendingToast = sessionStorage.getItem(PENDING_TOAST_STORAGE_KEY)
    if (!pendingToast) return []
    sessionStorage.removeItem(PENDING_TOAST_STORAGE_KEY)
    return [{ id: Date.now(), message: pendingToast, type: 'error' }]
  })
  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  setApiErrorHandler((message) => showToast(message, 'error'))

  useEffect(() => () => setApiErrorHandler(null), [])

  const value: ToastContextValue = { showToast, dismissToast, toasts }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  )
}
