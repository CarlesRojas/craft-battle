import { useCombineWords } from '@/hook/useCombineWords'
import { createContext, ReactNode, useContext, useState } from 'react'
import { v4 as uuid } from 'uuid'

export type WordInstance = {
    id: string
    text: string
    x: number
    y: number
    width: number
    height: number
    isLoading?: boolean
}

type WordInstancesContextType = {
    instances: WordInstance[]
    overlappedWordId: string | null
    addInstance: (instance: WordInstance) => void
    removeInstance: (id: string) => void
    updateInstance: (id: string, updates: Partial<WordInstance>) => void
    clearInstances: () => void
    getOverlappingWord: (word: WordInstance) => WordInstance | null
    clearOverlapped: () => void
    combine: (word1: WordInstance, word2: WordInstance) => void
}

const WordInstancesContext = createContext<WordInstancesContextType | null>(null)

export function WordInstancesProvider({ children }: { children: ReactNode }) {
    const [instances, setInstances] = useState<WordInstance[]>([])
    const [overlappedWordId, setOverlappedWordId] = useState<string | null>(null)

    const combineWords = useCombineWords()

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

    const getOverlappingWord = (word: WordInstance) => {
        const newOverlappedWord =
            instances.find(instance => {
                if (instance.id === word.id) return false

                return !(
                    instance.x + instance.width < word.x ||
                    word.x + word.width < instance.x ||
                    instance.y + instance.height < word.y ||
                    word.y + word.height < instance.y
                )
            }) ?? null

        if (overlappedWordId !== newOverlappedWord?.id) setOverlappedWordId(newOverlappedWord?.id ?? null)

        return newOverlappedWord
    }

    const clearOverlapped = () => {
        setOverlappedWordId(null)
    }

    const combine = async (word1: WordInstance, word2: WordInstance) => {
        setInstances(prev =>
            prev
                .filter(instance => word2.id !== instance.id)
                .map(instance => (instance.id === word1.id ? { ...instance, isLoading: true } : instance)),
        )

        const result = await combineWords.mutateAsync({ word1: word1.text, word2: word2.text })

        setInstances(prev => [
            ...prev.filter(instance => ![word1.id, word2.id].includes(instance.id)),
            {
                ...result,
                id: uuid(),
                text: result.result,
                x: word1.x,
                y: word1.y,
                // TODO calculate the width and height
                width: 0,
                height: 0,
            },
        ])
    }

    return (
        <WordInstancesContext.Provider
            value={{
                instances,
                overlappedWordId,
                addInstance,
                removeInstance,
                updateInstance,
                clearInstances,
                getOverlappingWord,
                clearOverlapped,
                combine,
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
