import { api } from '@/db/_generated/api'
import type { Id } from '@/db/_generated/dataModel'
import type { WordInstance } from '@/db/instance'
import type { User } from '@/db/username'
import type { CreateWord } from '@/db/word'
import { useCombineWords } from '@/hook/useCombineWords'
import { normalize } from '@/lib/normalize'
import { useMutation as useConvexMutation, useQuery as useConvexQuery } from 'convex/react'
import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { v4 as uuid } from 'uuid'

type WordInstancesContextType = {
    instances: Array<WordInstance>
    overlappedInstanceId: string | null
    loadingInstances: Array<Id<'instance'>>
    newInstances: Array<Id<'instance'>>
    addInstance: (instance: WordInstance) => Promise<void>
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
    getGameQuery: typeof api.classic.get | typeof api.bingo.get
}

export function WordInstancesProvider({ children, onCombine, user, getGameQuery }: Props) {
    const game = useConvexQuery(getGameQuery, { playerId: user._id })
    const instances = useMemo(() => game?.instances ?? [], [game])
    const combineWords = useCombineWords()

    const addInstanceMutation = useConvexMutation(api.instance.add).withOptimisticUpdate((localStore, args) => {
        const currentValue = localStore.getQuery(getGameQuery, { playerId: user._id })
        if (!currentValue) return

        localStore.setQuery(
            getGameQuery,
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
        const currentValue = localStore.getQuery(getGameQuery, { playerId: user._id })
        if (!currentValue) return

        localStore.setQuery(
            getGameQuery,
            { playerId: user._id },
            {
                ...currentValue,
                instances: currentValue.instances.filter(instance => instance._id !== args.instanceId),
            },
        )
    })

    const replaceInstanceMutation = useConvexMutation(api.instance.replace).withOptimisticUpdate((localStore, args) => {
        const currentValue = localStore.getQuery(getGameQuery, { playerId: user._id })
        if (!currentValue) return

        localStore.setQuery(
            getGameQuery,
            { playerId: user._id },
            {
                ...currentValue,
                instances: [
                    ...currentValue.instances.filter(instance => instance._id !== args.instanceId),
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

    const clearInstancesutation = useConvexMutation(api.instance.removeAll).withOptimisticUpdate(localStore => {
        const currentValue = localStore.getQuery(getGameQuery, { playerId: user._id })
        if (!currentValue) return

        localStore.setQuery(getGameQuery, { playerId: user._id }, { ...currentValue, instances: [] })
    })

    const replaceAllMutation = useConvexMutation(api.instance.replaceAll).withOptimisticUpdate((localStore, args) => {
        const currentValue = localStore.getQuery(getGameQuery, { playerId: user._id })
        if (!currentValue) return

        localStore.setQuery(getGameQuery, { playerId: user._id }, { ...currentValue, instances: args.instances })
    })

    const updateMutation = useConvexMutation(api.instance.update).withOptimisticUpdate((localStore, args) => {
        const currentValue = localStore.getQuery(getGameQuery, { playerId: user._id })
        if (!currentValue) return

        localStore.setQuery(
            getGameQuery,
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

    const addInstance = useCallback(
        async (instance: WordInstance) => {
            await addInstanceMutation({
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
        },
        [addInstanceMutation],
    )

    const removeInstance = useCallback(
        async (instanceId: Id<'instance'>) => {
            if (instanceId.startsWith('temporal-id')) return
            await removeInstanceMutation({ instanceId })
        },
        [removeInstanceMutation],
    )

    const clearInstances = useCallback(() => {
        clearInstancesutation({ instances: instances.map(instance => instance._id) })
    }, [clearInstancesutation, instances])

    const replaceInstances = useCallback(
        (replacedInstances: Array<WordInstance>) => {
            replaceAllMutation({
                instances: replacedInstances.filter(instance => !instance._id.startsWith('temporal-id')),
            })
        },
        [replaceAllMutation],
    )

    const getOverlappingInstance = useCallback(
        (instanceToCheck: WordInstance) => {
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
        },
        [instances, loadingInstances, overlappedInstanceId],
    )

    const clearOverlapped = useCallback(() => {
        setOverlappedInstanceId(null)
    }, [setOverlappedInstanceId])

    const combine = useCallback(
        async (word1: WordInstance, word2: WordInstance) => {
            setLoadingInstances(prev => [...prev, word1._id])
            await removeInstance(word2._id)

            const result = await combineWords.mutateAsync({ word1: word1.text, word2: word2.text })

            const { id, isNew } = await onCombine({
                text: normalize(result.result, true, true),
                icon: result.icon,
            })

            const createdIncidenceId = await replaceInstanceMutation({
                instanceId: word1._id,
                wordId: id,
                x: word1.x,
                y: word1.y,
                width: 0,
                height: 0,
                icon: result.icon,
                text: normalize(result.result, true, true),
                gameId: game!.game._id,
                playerId: user._id,
                _creationTime: new Date().getTime(),
            })

            if (isNew && createdIncidenceId) setNewInstances(prev => [...prev, createdIncidenceId])
            setLoadingInstances(prev => prev.filter(currId => currId !== word1._id))

            return isNew
        },
        [replaceInstanceMutation, combineWords, game, onCombine, removeInstance, user],
    )

    const updateSize = useCallback(
        (instance: Partial<WordInstance>) => {
            if (!instance._id || instance._id.startsWith('temporal-id')) return

            updateMutation({
                instanceId: instance._id,
                x: instance.x,
                y: instance.y,
                width: instance.width,
                height: instance.height,
            })
        },
        [updateMutation],
    )

    const removeNewInstance = useCallback((instanceId: Id<'instance'>) => {
        setNewInstances(prev => prev.filter(currId => currId !== instanceId))
    }, [])

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
