import { create } from 'zustand'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

interface ToastStore {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

let toastId = 0

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = `toast-${++toastId}`
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id, duration: toast.duration ?? 4000 }],
    }))

    // Auto-remove after duration
    if (toast.duration !== 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }))
      }, toast.duration ?? 4000)
    }
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }))
  },
}))

/**
 * Helper to show success toast
 */
export function showSuccessToast(message: string, duration?: number) {
  useToastStore.getState().addToast({ type: 'success', message, duration })
}

/**
 * Helper to show error toast
 */
export function showErrorToast(message: string, duration?: number) {
  useToastStore.getState().addToast({ type: 'error', message, duration })
}

/**
 * Helper to show info toast
 */
export function showInfoToast(message: string, duration?: number) {
  useToastStore.getState().addToast({ type: 'info', message, duration })
}

/**
 * Helper to show warning toast
 */
export function showWarningToast(message: string, duration?: number) {
  useToastStore.getState().addToast({ type: 'warning', message, duration })
}
