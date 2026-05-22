import { useState, useCallback } from 'react'

export function useToast() {
  const [toast, setToast] = useState(null) // { msg, tipo: 'ok'|'err' }

  const mostrar = useCallback((msg, tipo = 'ok') => {
    setToast({ msg, tipo })
    setTimeout(() => setToast(null), 3000)
  }, [])

  return { toast, mostrar }
}
