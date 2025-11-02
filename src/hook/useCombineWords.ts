import { combineWords } from '@/data/ai'
import { api } from '@/db/_generated/api'
import { useMutation } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { useConvex, useMutation as useDbMutation } from 'convex/react'

interface Mutation {
    word1: string
    word2: string
}

export function useCombineWords() {
    const convex = useConvex()

    const combineWordsFn = useServerFn(combineWords)
    const createCombination = useDbMutation(api.combination.create)

    return useMutation({
        mutationFn: async ({ word1, word2 }: Mutation) => {
            const combination = await convex.query(api.combination.get, { word1, word2 })
            if (combination) return combination

            const newCombination = await combineWordsFn({ data: { word1, word2 } })
            await createCombination({ ...newCombination })

            return newCombination
        },
    })
}
