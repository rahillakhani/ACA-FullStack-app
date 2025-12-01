import React, { createContext, useContext, useState, useEffect } from 'react'

export interface ToastOptions {
  message: string
  duration?: number
  actionLabel?: string
  onAction?: () => void
}

export interface Toast extends ToastOptions {
  id: string
}

const ToastContext = createContext<{
  toasts: Toast[]
  showToast: (opts: ToastOptions) => void
  removeToast: (id: string) => void
} | null>(null)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = (opts: ToastOptions) => {
    const id = Math.random().toString(36).slice(2, 9)
    const toast: Toast = { id, ...opts }
    setToasts((s) => [...s, toast])
    if (opts.duration !== 0) {
      const timeout = opts.duration ?? 3000
      setTimeout(() => removeToast(id), timeout)
    }
  }

  const removeToast = (id: string) => {
    setToasts((s) => s.filter((t) => t.id !== id))
  }

  return <ToastContext.Provider value={{ toasts, showToast, removeToast }}>{children}</ToastContext.Provider>
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}
