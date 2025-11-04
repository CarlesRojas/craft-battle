import { CreateWord } from '@/db/game'
import { useCombineWords } from '@/hook/useCombineWords'
import type { ReactNode } from 'react'
import { createContext, useContext, useState } from 'react'
import { v4 as uuid } from 'uuid'

export type WordInstance = {
    id: string
    text: string
    icon: string
    explanation?: string
    x: number
    y: number
    width: number
    height: number
    isLoading?: boolean
}

type WordInstancesContextType = {
    instances: Array<WordInstance>
    overlappedWordId: string | null
    addInstance: (instance: WordInstance) => void
    removeInstance: (id: string) => void
    updateInstance: (id: string, updates: Partial<WordInstance>) => void
    replaceInstances: (instances: Array<WordInstance>) => void
    clearInstances: () => void
    getOverlappingWord: (word: WordInstance) => WordInstance | null
    clearOverlapped: () => void
    combine: (word1: WordInstance, word2: WordInstance) => void
    updateSize: (instance: Partial<WordInstance>) => void
}

const WordInstancesContext = createContext<WordInstancesContextType | null>(null)

interface Props {
    children: ReactNode
    onCombine: (result: CreateWord) => void
}

export function WordInstancesProvider({ children, onCombine }: Props) {
    const [instances, setInstances] = useState<Array<WordInstance>>([])
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

    const replaceInstances = (newInstances: Array<WordInstance>) => {
        setInstances(newInstances)
    }

    const clearInstances = () => {
        setInstances([])
    }

    const getOverlappingWord = (word: WordInstance) => {
        const newOverlappedWord =
            instances.find(instance => {
                if (instance.id === word.id || instance.isLoading) return false

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

        onCombine({ text: result.result, icon: result.icon, explanation: result.explanation })

        setInstances(prev => [
            ...prev.filter(instance => ![word1.id, word2.id].includes(instance.id)),
            {
                ...result,
                id: uuid(),
                text: result.result,
                x: word1.x,
                y: word1.y,
                width: 0,
                height: 0,
            },
        ])
    }

    const updateSize = ({ id, width, height, x, y }: Partial<WordInstance>) => {
        setInstances(prev =>
            prev.map(instance =>
                instance.id === id
                    ? {
                          ...instance,
                          width: width ?? instance.width,
                          height: height ?? instance.height,
                          x: x ?? instance.x,
                          y: y ?? instance.y,
                      }
                    : instance,
            ),
        )
    }

    return (
        <WordInstancesContext.Provider
            value={{
                instances,
                overlappedWordId,
                addInstance,
                removeInstance,
                updateInstance,
                replaceInstances,
                clearInstances,
                getOverlappingWord,
                clearOverlapped,
                combine,
                updateSize,
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
