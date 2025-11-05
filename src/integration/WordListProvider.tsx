import { DEFAULT_ORDER, DEFAULT_SORT, Order, Sort } from '@/const/sort'
import { api } from '@/db/_generated/api'
import type { Doc, Id } from '@/db/_generated/dataModel'
import type { User } from '@/db/username'
import type { CreateWord } from '@/db/word'
import { useMutation as useConvexMutation, useQuery as useConvexQuery } from 'convex/react'
import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useMemo, useState } from 'react'

type WordListContextType = {
    list: Array<Doc<'word'>>
    addWord: (word: CreateWord) => Promise<{ id: Id<'word'>; isNew: boolean }>
    applySearch: (query: string) => void
    applySort: (sort: Sort, order: Order) => void
}

const WordListContext = createContext<WordListContextType | null>(null)

interface FilterAndSortProps {
    listToFilter: Array<Doc<'word'>>
    query: string
    sort: Sort
    order: Order
}

const filterAndSortList = ({ listToFilter, query, sort, order }: FilterAndSortProps) => {
    let result = [...listToFilter]

    if (query) {
        const queryWords = query.toLowerCase().split(' ')
        result = result.filter(word => {
            return queryWords.every(queryWord => word.text.toLowerCase().includes(queryWord))
        })
    }

    result.sort((a, b) => {
        if (sort === Sort.DISCOVERED) return a._creationTime - b._creationTime
        else return a.text.localeCompare(b.text)
    })

    if (order === Order.DESC) result.reverse()

    return result
}

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
            const result = await addWordMutation({ ...word, playerId: user._id, gameId: game!.game._id })
            return result
        },
        [game, addWordMutation, user],
    )

    const applySearch = useCallback((newQuery: string) => {
        setQuery(newQuery)
    }, [])

    const applySort = useCallback((newSort: Sort, newOrder: Order) => {
        setSort(newSort)
        setOrder(newOrder)
    }, [])

    return (
        <WordListContext.Provider
            value={{
                list: filteredList,
                addWord,
                applySearch,
                applySort,
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
