import React, { useEffect, useState } from 'react'
import styles from './Toast.module.css'
import { useToast } from '../context/ToastContext'

const ToastItem: React.FC<{ toast: any; onClose: (id: string) => void }> = ({ toast, onClose }) => {
  const [enter, setEnter] = useState(false)
  useEffect(() => setEnter(true), [])
  return (
    <div className={`${styles.toast} ${enter ? styles.enter : ''}`} key={toast.id} role="status" aria-live="polite">
      <div className="content">{toast.message}</div>
      {toast.actionLabel && (
        <button
          className={styles.actionBtn}
          onClick={() => {
            toast.onAction?.()
            onClose(toast.id)
          }}
        >
          {toast.actionLabel}
        </button>
      )}
      <button className={styles.closeBtn} aria-label="Close" onClick={() => onClose(toast.id)}>
        ✕
      </button>
    </div>
  )
}

export const Toasts: React.FC = () => {
  const { toasts, removeToast } = useToast()

  return (
    <div className={styles.toastsWrap}>
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onClose={removeToast} />
      ))}
    </div>
  )
}

export default Toasts
