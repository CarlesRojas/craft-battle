import { api } from '@/db/_generated/api'
import type { Doc, Id } from '@/db/_generated/dataModel'
import type { User } from '@/db/username'
import type { CreateWord } from '@/db/word'
import { useMutation as useConvexMutation, useQuery as useConvexQuery } from 'convex/react'
import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useMemo, useState } from 'react'

export type Order = 'asc' | 'desc'
export type Sort = 'discovered' | 'name'

type WordListContextType = {
    list: Array<Doc<'word'>>
    addWord: (word: CreateWord) => Promise<Id<'word'>>
    applySearch: (query: string) => void
    clearSearch: () => void
    applySort: (sort: Sort, order: Order) => void
    resetSort: () => void
}

const WordListContext = createContext<WordListContextType | null>(null)

interface FilterAndSortProps {
    listToFilter: Array<Doc<'word'>>
    query: string
    sort: Sort
    order: Order
}

const filterAndSortList = ({ listToFilter, query, sort, order }: FilterAndSortProps) => {
    const result = [...listToFilter]

    if (query) result.filter(word => word.text.toLowerCase().includes(query.toLowerCase()))

    result.sort((a, b) => {
        if (sort === 'discovered') return a._creationTime - b._creationTime
        else return a.text.localeCompare(b.text)
    })

    if (order === 'desc') result.reverse()

    return result
}

const DEFAULT_SORT = 'discovered'
const DEFAULT_ORDER = 'asc'

interface Props {
    children: ReactNode
    user: User
}

export function WordListProvider({ children, user }: Props) {
    const game = useConvexQuery(api.game.get, { playerId: user._id })
    const addWordMutation = useConvexMutation(api.word.add)

    const [query, setQuery] = useState<string>('')
    const [sort, setSort] = useState<Sort>(DEFAULT_SORT)
    const [order, setOrder] = useState<Order>(DEFAULT_ORDER)

    const filteredList = useMemo(
        () => (game ? filterAndSortList({ listToFilter: game.words, query, sort, order }) : []),
        [game, query, sort, order],
    )

    const addWord = useCallback(
        async (word: CreateWord) => {
            const wordId: Id<'word'> = await addWordMutation({ ...word, playerId: user._id, gameId: game!.game._id })
            return wordId
        },
        [game, addWordMutation, user],
    )

    const applySearch = useCallback((newQuery: string) => {
        setQuery(newQuery)
    }, [])

    const clearSearch = useCallback(() => {
        setQuery('')
    }, [])

    const applySort = useCallback((newSort: Sort, newOrder: Order) => {
        setSort(newSort)
        setOrder(newOrder)
    }, [])

    const resetSort = useCallback(() => {
        setSort(DEFAULT_SORT)
        setOrder(DEFAULT_ORDER)
    }, [])

    return (
        <WordListContext.Provider
            value={{
                list: filteredList,
                addWord,
                applySearch,
                clearSearch,
                applySort,
                resetSort,
            }}
        >
            {children}
        </WordListContext.Provider>
    )
}

export function useWordList() {
    const context = useContext(WordListContext)

    if (!context) throw new Error('useInstances must be used within a WordListProvider')

    return context
}
