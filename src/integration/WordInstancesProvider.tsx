import { api } from '@/db/_generated/api'
import type { Id } from '@/db/_generated/dataModel'
import type { WordInstance } from '@/db/instance'
import type { User } from '@/db/username'
import type { CreateWord } from '@/db/word'
import { useCombineWords } from '@/hook/useCombineWords'
import { normalize } from '@/lib/normalize'
import { useMutation as useConvexMutation, useQuery as useConvexQuery } from 'convex/react'
import type { ReactNode } from 'react'
import { createContext, useContext, useState } from 'react'
import { v4 as uuid } from 'uuid'

type WordInstancesContextType = {
    instances: Array<WordInstance>
    overlappedInstanceId: string | null
    loadingInstances: Array<Id<'instance'>>
    newInstances: Array<Id<'instance'>>
    addInstance: (instance: WordInstance, isNew?: boolean) => Promise<void>
    removeInstance: (instanceId: Id<'instance'>) => void
    clearInstances: () => void
    replaceInstances: (instances: Array<WordInstance>) => void
    getOverlappingInstance: (word: WordInstance) => WordInstance | null
    clearOverlapped: () => void
    combine: (word1: WordInstance, word2: WordInstance) => Promise<boolean>
    updateSize: (instance: Partial<WordInstance>) => void
    removeNewInstance: (instanceId: Id<'instance'>) => void
}

const WordInstancesContext = createContext<WordInstancesContextType | null>(null)

interface Props {
    children: ReactNode
    onCombine: (result: CreateWord) => Promise<{ id: Id<'word'>; isNew: boolean }>
    user: User
}

export function WordInstancesProvider({ children, onCombine, user }: Props) {
    const game = useConvexQuery(api.game.get, { playerId: user._id })
    const instances = game?.instances ?? []
    const combineWords = useCombineWords()

    const addInstanceMutation = useConvexMutation(api.instance.add).withOptimisticUpdate((localStore, args) => {
        const currentValue = localStore.getQuery(api.game.get, { playerId: user._id })
        if (!currentValue) return

        localStore.setQuery(
            api.game.get,
            { playerId: user._id },
            {
                ...currentValue,
                instances: [
                    ...currentValue.instances,
                    {
                        ...args,
                        _creationTime: 0,
                        _id: `temporal-id-${uuid()}` as Id<'instance'>,
                        text: normalize(args.text, true, true),
                    },
                ],
            },
        )
    })

    const removeInstanceMutation = useConvexMutation(api.instance.remove).withOptimisticUpdate((localStore, args) => {
        const currentValue = localStore.getQuery(api.game.get, { playerId: user._id })
        if (!currentValue) return

        localStore.setQuery(
            api.game.get,
            { playerId: user._id },
            {
                ...currentValue,
                instances: currentValue.instances.filter(instance => instance._id !== args.instanceId),
            },
        )
    })

    const clearInstancesutation = useConvexMutation(api.instance.removeAll).withOptimisticUpdate(localStore => {
        const currentValue = localStore.getQuery(api.game.get, { playerId: user._id })
        if (!currentValue) return

        localStore.setQuery(api.game.get, { playerId: user._id }, { ...currentValue, instances: [] })
    })

    const replaceAllMutation = useConvexMutation(api.instance.replaceAll).withOptimisticUpdate((localStore, args) => {
        const currentValue = localStore.getQuery(api.game.get, { playerId: user._id })
        if (!currentValue) return

        localStore.setQuery(api.game.get, { playerId: user._id }, { ...currentValue, instances: args.instances })
    })

    const updateMutation = useConvexMutation(api.instance.update).withOptimisticUpdate((localStore, args) => {
        const currentValue = localStore.getQuery(api.game.get, { playerId: user._id })
        if (!currentValue) return

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
    const [newInstances, setNewInstances] = useState<Array<Id<'instance'>>>([])
    const [overlappedInstanceId, setOverlappedInstanceId] = useState<string | null>(null)

    const addInstance = async (instance: WordInstance, isNew = false) => {
        const createdIncidenceId = await addInstanceMutation({
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

        if (isNew && createdIncidenceId) setNewInstances(prev => [...prev, createdIncidenceId])
    }

    const removeInstance = (instanceId: Id<'instance'>) => {
        if (instanceId.startsWith('temporal-id')) return
        removeInstanceMutation({ instanceId })
    }

    const clearInstances = () => {
        clearInstancesutation({ instances: instances.map(instance => instance._id) })
    }

    const replaceInstances = (replacedInstances: Array<WordInstance>) => {
        replaceAllMutation({
            instances: replacedInstances.filter(instance => !instance._id.startsWith('temporal-id')),
        })
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

        const { id, isNew } = await onCombine({
            text: normalize(result.result, true, true),
            icon: result.icon,
        })

        removeInstance(word1._id)
        addInstance(
            {
                wordId: id,
                x: word1.x,
                y: word1.y,
                width: 0,
                height: 0,
                icon: result.icon,
                text: normalize(result.result, true, true),
                gameId: game!.game._id,
                _id: `temporal-id-${uuid()}` as Id<'instance'>,
                playerId: user._id,
                _creationTime: new Date().getTime(),
            },
            isNew,
        )

        setLoadingInstances(prev => prev.filter(currId => currId !== word1._id))

        return isNew
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

    const removeNewInstance = (instanceId: Id<'instance'>) => {
        setNewInstances(prev => prev.filter(currId => currId !== instanceId))
    }

    return (
        <WordInstancesContext.Provider
            value={{
                instances,
                loadingInstances,
                overlappedInstanceId,
                newInstances,
                addInstance,
                removeInstance,
                clearInstances,
                replaceInstances,
                getOverlappingInstance,
                clearOverlapped,
                combine,
                updateSize,
                removeNewInstance,
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
