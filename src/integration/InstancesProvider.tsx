import { createContext, ReactNode, useContext, useState } from 'react'

export type WordInstance = {
    id: string
    text: string
    x: number
    y: number
}

type WordInstancesContextType = {
    instances: WordInstance[]
    addInstance: (instance: WordInstance) => void
    removeInstance: (id: string) => void
    updateInstance: (id: string, updates: Partial<WordInstance>) => void
    clearInstances: () => void
}

const WordInstancesContext = createContext<WordInstancesContextType | null>(null)

export function WordInstancesProvider({ children }: { children: ReactNode }) {
    const [instances, setInstances] = useState<WordInstance[]>([])

    const addInstance = (instance: WordInstance) => {
        setInstances(prev => [...prev, instance])
    }

    const removeInstance = (id: string) => {
        setInstances(prev => prev.filter(instance => instance.id !== id))
    }

    const updateInstance = (id: string, updates: Partial<WordInstance>) => {
        setInstances(prev => prev.map(instance => (instance.id === id ? { ...instance, ...updates } : instance)))
    }

    const clearInstances = () => {
        setInstances([])
    }

    return (
        <WordInstancesContext.Provider
            value={{
                instances,
                addInstance,
                removeInstance,
                updateInstance,
                clearInstances,
            }}
        >
            {children}
        </WordInstancesContext.Provider>
    )
}

export function useWordInstances() {
    const context = useContext(WordInstancesContext)

    if (!context) throw new Error('useInstances must be used within a WordInstancesProvider')

    return context
}
