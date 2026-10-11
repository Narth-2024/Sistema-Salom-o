import { useRef, useState, useCallback } from 'react'

// Bloqueia submits duplicados de forma síncrona (ref), sem depender do render do React.
// Uso:
//   const submitLock = useSubmitLock()
//   function handleSubmit(e) {
//       e.preventDefault()
//       if (submitLock.locked) return
//       submitLock.lock()
//       post('/transactions', { onFinish: submitLock.unlock })
//   }
//   <Button disabled={processing || submitLock.locked}>
export default function useSubmitLock() {
    const ref = useRef(false)
    const [locked, setLocked] = useState(false)

    const lock = useCallback(() => {
        ref.current = true
        setLocked(true)
    }, [])

    const unlock = useCallback(() => {
        ref.current = false
        setLocked(false)
    }, [])

    // Retorna true se o submit pode prosseguir; false se já estava em andamento.
    const tryLock = useCallback(() => {
        if (ref.current) return false
        ref.current = true
        setLocked(true)
        return true
    }, [])

    return { locked, lock, unlock, tryLock }
}
