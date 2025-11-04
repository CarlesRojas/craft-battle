import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useState } from 'react'
import { v4 as uuid } from 'uuid'

export type Word = {
    id: string
    text: string
    icon: string
    discoveredAt: Date
    explanation?: string
}

export type Order = 'asc' | 'desc'
export type Sort = 'discovered' | 'name'

type WordListContextType = {
    list: Array<Word>
    addWord: (word: Word) => void
    applySearch: (query: string) => void
    clearSearch: () => void
    applySort: (sort: Sort, order: Order) => void
    resetSort: () => void
}

const WordListContext = createContext<WordListContextType | null>(null)

interface FilterAndSortProps {
    listToFilter: Array<Word>
    query: string
    sort: Sort
    order: Order
}

const filterAndSortList = ({ listToFilter, query, sort, order }: FilterAndSortProps) => {
    const result = [...listToFilter]

    if (!!query) result.filter(word => word.text.toLowerCase().includes(query.toLowerCase()))

    result.sort((a, b) => {
        if (sort === 'discovered') return a.discoveredAt.getTime() - b.discoveredAt.getTime()
        else if (sort === 'name') return a.text.localeCompare(b.text)
        return 0
    })

    if (order === 'desc') result.reverse()

    return result
}

const DEFAULT_SORT = 'discovered'
const DEFAULT_ORDER = 'asc'

export function WordListProvider({ children }: { children: ReactNode }) {
    const [list, setList] = useState<Array<Word>>([
        { id: uuid(), text: 'water', icon: '💧', discoveredAt: new Date() },
        { id: uuid(), text: 'fire', icon: '🔥', discoveredAt: new Date() },
        { id: uuid(), text: 'wind', icon: '💨', discoveredAt: new Date() },
        { id: uuid(), text: 'earth', icon: '🌍', discoveredAt: new Date() },
    ])
    const [query, setQuery] = useState<string>('')
    const [sort, setSort] = useState<Sort>(DEFAULT_SORT)
    const [order, setOrder] = useState<Order>(DEFAULT_ORDER)

    const addWord = useCallback(
        (word: Word) => {
            setList(prev => filterAndSortList({ listToFilter: [...prev, word], query, sort, order }))
        },
        [query, sort, order],
    )

    const applySearch = useCallback(
        (newQuery: string) => {
            setQuery(newQuery)
            setList(prev => filterAndSortList({ listToFilter: prev, query: newQuery, sort, order }))
        },
        [sort, order],
    )

    const clearSearch = useCallback(() => {
        setQuery('')
        setList(prev => filterAndSortList({ listToFilter: prev, query: '', sort, order }))
    }, [sort, order])

    const applySort = useCallback(
        (newSort: Sort, newOrder: Order) => {
            setSort(newSort)
            setOrder(newOrder)
            setList(prev => filterAndSortList({ listToFilter: prev, query, sort: newSort, order: newOrder }))
        },
        [query],
    )

    const resetSort = useCallback(() => {
        setSort(DEFAULT_SORT)
        setOrder(DEFAULT_ORDER)
        setList(prev => filterAndSortList({ listToFilter: prev, query, sort: DEFAULT_SORT, order: DEFAULT_ORDER }))
    }, [query])

    return (
        <WordListContext.Provider
            value={{
                list,
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
