import { useToastStore, type ToastType } from '@/store/toasts'
import { X } from 'lucide-react'

function getToastStyle(type: ToastType) {
  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
  }
  return styles[type]
}

function getIconStyle(type: ToastType) {
  const styles = {
    success: 'text-green-600',
    error: 'text-red-600',
    info: 'text-blue-600',
    warning: 'text-amber-600',
  }
  return styles[type]
}

function getIcon(type: ToastType) {
  switch (type) {
    case 'success':
      return '✓'
    case 'error':
      return '✕'
    case 'info':
      return 'ℹ'
    case 'warning':
      return '⚠'
  }
}

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 p-4 rounded-lg border animate-in fade-in slide-in-from-bottom-4 duration-300 ${getToastStyle(
            toast.type
          )}`}
        >
          <span className={`text-lg font-semibold flex-shrink-0 ${getIconStyle(toast.type)}`}>
            {getIcon(toast.type)}
          </span>
          <p className="text-sm font-medium flex-1">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 text-current opacity-60 hover:opacity-100 transition-opacity"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}
