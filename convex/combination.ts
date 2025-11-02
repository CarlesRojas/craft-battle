import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const get = query({
    args: {
        word1: v.string(),
        word2: v.string(),
    },
    handler: async (ctx, { word1, word2 }) => {
        const sortedWords = [word1, word2].sort()

        return await ctx.db
            .query('combination')
            .withIndex('words', q => q.eq('word1', sortedWords[0]).eq('word2', sortedWords[1]))
            .first()
    },
})

export const create = mutation({
    args: {
        word1: v.string(),
        word2: v.string(),
        result: v.string(),
        explanation: v.string(),
        icon: v.string(),
    },
    handler: async (ctx, args) => {
        const sortedWords = [args.word1, args.word2].sort()

        return await ctx.db.insert('combination', {
            ...args,
            word1: sortedWords[0],
            word2: sortedWords[1],
        })
    },
})
