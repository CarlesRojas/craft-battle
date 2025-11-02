import { fightWords } from '@/data/ai'
import { api } from '@/db/_generated/api'
import { useMutation } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { useConvex, useMutation as useDbMutation } from 'convex/react'

interface Mutation {
    attackWord: string
    defenseWord: string
}

export function useFightWords() {
    const convex = useConvex()

    const fightWordsFn = useServerFn(fightWords)
    const createFight = useDbMutation(api.fight.create)

    return useMutation({
        mutationFn: async ({ attackWord, defenseWord }: Mutation) => {
            const fight = await convex.query(api.fight.get, { attackWord, defenseWord })
            if (fight) return fight

            const newFight = await fightWordsFn({ data: { attackWord, defenseWord } })
            await createFight({ ...newFight })

            return newFight
        },
    })
}
