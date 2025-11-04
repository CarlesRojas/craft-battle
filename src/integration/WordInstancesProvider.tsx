import { api } from '@/db/_generated/api'
import { Id } from '@/db/_generated/dataModel'
import { WordInstance } from '@/db/instance'
import { User } from '@/db/username'
import type { CreateWord } from '@/db/word'
import { useCombineWords } from '@/hook/useCombineWords'
import { useMutation as useConvexMutation, useQuery as useConvexQuery } from 'convex/react'
import type { ReactNode } from 'react'
import { createContext, useContext, useMemo, useState } from 'react'
import { v4 as uuid } from 'uuid'

type WordInstancesContextType = {
    instances: Array<WordInstance>
    overlappedInstanceId: string | null
    loadingInstances: Array<Id<'instance'>>
    addInstance: (instance: WordInstance) => void
    removeInstance: (instanceId: Id<'instance'>) => void
    replaceInstances: (instances: Array<WordInstance>) => void
    getOverlappingInstance: (word: WordInstance) => WordInstance | null
    clearOverlapped: () => void
    combine: (word1: WordInstance, word2: WordInstance) => void
    updateSize: (instance: Partial<WordInstance>) => void
}

const WordInstancesContext = createContext<WordInstancesContextType | null>(null)

interface Props {
    children: ReactNode
    onCombine: (result: CreateWord) => Promise<Id<'word'>>
    user: User
}

export function WordInstancesProvider({ children, onCombine, user }: Props) {
    const game = useConvexQuery(api.game.get, { playerId: user._id })
    const instances = useMemo(() => game?.instances ?? [], [game])
    const combineWords = useCombineWords()

    const addInstanceMutation = useConvexMutation(api.instance.add).withOptimisticUpdate((localStore, args) => {
        const currentValue = localStore.getQuery(api.game.get, { playerId: user._id })

        if (!!currentValue)
            localStore.setQuery(
                api.game.get,
                { playerId: user._id },
                {
                    ...currentValue,
                    instances: [
                        ...currentValue.instances,
                        { ...args, _creationTime: 0, _id: `temporal-id-${uuid()}` as Id<'instance'> },
                    ],
                },
            )
    })

    const removeInstanceMutation = useConvexMutation(api.instance.remove).withOptimisticUpdate((localStore, args) => {
        const currentValue = localStore.getQuery(api.game.get, { playerId: user._id })

        if (!!currentValue)
            localStore.setQuery(
                api.game.get,
                { playerId: user._id },
                {
                    ...currentValue,
                    instances: currentValue.instances.filter(instance => instance._id !== args.instanceId),
                },
            )
    })

    const replaceAllMutation = useConvexMutation(api.instance.replaceAll).withOptimisticUpdate((localStore, args) => {
        const currentValue = localStore.getQuery(api.game.get, { playerId: user._id })

        if (!!currentValue)
            localStore.setQuery(api.game.get, { playerId: user._id }, { ...currentValue, instances: args.instances })
    })

    const updateMutation = useConvexMutation(api.instance.update).withOptimisticUpdate((localStore, args) => {
        const currentValue = localStore.getQuery(api.game.get, { playerId: user._id })

        if (!!currentValue)
            localStore.setQuery(
                api.game.get,
                { playerId: user._id },
                {
                    ...currentValue,
                    instances: currentValue.instances.map(instance =>
                        instance._id === args.instanceId
                            ? {
                                  ...instance,
                                  x: args.x ?? instance.x,
                                  y: args.y ?? instance.y,
                                  width: args.width ?? instance.width,
                                  height: args.height ?? instance.height,
                              }
                            : instance,
                    ),
                },
            )
    })

    const [loadingInstances, setLoadingInstances] = useState<Array<Id<'instance'>>>([])
    const [overlappedInstanceId, setOverlappedInstanceId] = useState<string | null>(null)

    const addInstance = (instance: WordInstance) => {
        addInstanceMutation({
            wordId: instance.wordId,
            x: instance.x,
            y: instance.y,
            width: instance.width,
            height: instance.height,
            icon: instance.icon,
            playerId: instance.playerId,
            text: instance.text,
            gameId: instance.gameId,
            _creationTime: instance._creationTime,
        })
    }

    const removeInstance = (instanceId: Id<'instance'>) => {
        if (instanceId.startsWith('temporal-id')) return
        removeInstanceMutation({ instanceId })
    }

    const replaceInstances = (newInstances: Array<WordInstance>) => {
        replaceAllMutation({ instances: newInstances.filter(instance => !instance._id.startsWith('temporal-id')) })
    }

    const getOverlappingInstance = (instanceToCheck: WordInstance) => {
        const newOverlappedInstance =
            instances.find(instance => {
                if (instance._id === instanceToCheck._id || loadingInstances.includes(instance._id)) return false

                return !(
                    instance.x + instance.width < instanceToCheck.x ||
                    instanceToCheck.x + instanceToCheck.width < instance.x ||
                    instance.y + instance.height < instanceToCheck.y ||
                    instanceToCheck.y + instanceToCheck.height < instance.y
                )
            }) ?? null

        if (overlappedInstanceId !== newOverlappedInstance?._id)
            setOverlappedInstanceId(newOverlappedInstance?._id ?? null)

        return newOverlappedInstance
    }

    const clearOverlapped = () => {
        setOverlappedInstanceId(null)
    }

    const combine = async (word1: WordInstance, word2: WordInstance) => {
        removeInstance(word2._id)
        setLoadingInstances(prev => [...prev, word1._id])

        const result = await combineWords.mutateAsync({ word1: word1.text, word2: word2.text })

        const wordId = await onCombine({ text: result.result, icon: result.icon, explanation: result.explanation })

        removeInstance(word1._id)
        addInstance({
            wordId,
            x: word1.x,
            y: word1.y,
            width: 0,
            height: 0,
            icon: result.icon,
            text: result.result,
            explanation: result.explanation,
            gameId: game!.game._id,
            _id: `temporal-id-${uuid()}` as Id<'instance'>,
            playerId: user._id,
            _creationTime: new Date().getTime(),
        })
    }

    const updateSize = (instance: Partial<WordInstance>) => {
        if (!instance._id || instance._id.startsWith('temporal-id')) return

        updateMutation({
            instanceId: instance._id,
            x: instance.x,
            y: instance.y,
            width: instance.width,
            height: instance.height,
        })
    }

    return (
        <WordInstancesContext.Provider
            value={{
                instances,
                loadingInstances,
                overlappedInstanceId,
                addInstance,
                removeInstance,
                replaceInstances,
                getOverlappingInstance,
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
