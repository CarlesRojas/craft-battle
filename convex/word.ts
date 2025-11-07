import { v } from 'convex/values'
import { normalize } from '../src/lib/normalize'
import type { Doc } from './_generated/dataModel'
import { mutation } from './_generated/server'

export const add = mutation({
    args: {
        playerId: v.id('user'),
        gameId: v.id('game'),
        text: v.string(),
        icon: v.string(),
    },
    handler: async (ctx, args) => {
        const normalizedText = normalize(args.text, true, true)

        const words = await ctx.db
            .query('word')
            .withIndex('playerWord', q => q.eq('text', normalizedText).eq('playerId', args.playerId))
            .collect()

        if (words.length > 0) return { id: words[0]._id, isNew: false }

        const wordId = await ctx.db.insert('word', {
            ...args,
            text: normalizedText,
        })

        return { id: wordId, isNew: true }
    },
})

export type CreateWord = Omit<Doc<'word'>, '_id' | '_creationTime' | 'gameId' | 'playerId'>
