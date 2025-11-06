import { useEffect, useState } from 'react'

export const useAutoResetState = <T>(
    initialValue: T,
    duration: number,
    onReset?: () => void,
): [T, (value: T) => void] => {
    const [internalState, setInternalState] = useState<T>(initialValue)

    useEffect(() => {
        let timeout: NodeJS.Timeout | null = null
        if (internalState !== initialValue)
            timeout = setTimeout(() => {
                setInternalState(initialValue)
                onReset?.()
            }, duration)

        return () => {
            if (timeout) clearTimeout(timeout)
        }
    }, [duration, initialValue, internalState, onReset])

    return [internalState, setInternalState]
}
