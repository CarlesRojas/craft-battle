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
        explanation: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const normalizedText = normalize(args.text, true)

        const words = await ctx.db
            .query('word')
            .withIndex('word', q => q.eq('text', normalizedText))
            .collect()

        if (words.length > 0) return words[0]._id

        const wordId = await ctx.db.insert('word', { ...args, text: normalizedText })
        return wordId
    },
})

export type CreateWord = Omit<Doc<'word'>, '_id' | '_creationTime' | 'gameId' | 'playerId'>
