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
        icon: v.string(),
        depth: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const sortedWords = [args.word1, args.word2].sort()

        let newDepth = args.depth ?? 0

        if (args.depth === undefined) {
            const word1Combination = await ctx.db
                .query('combination')
                .withIndex('result', q => q.eq('result', sortedWords[0]))
                .first()

            const word2Combination = await ctx.db
                .query('combination')
                .withIndex('result', q => q.eq('result', sortedWords[1]))
                .first()

            newDepth = Math.max(word1Combination?.depth ?? 0, word2Combination?.depth ?? 0) + 1
        }

        return await ctx.db.insert('combination', {
            ...args,
            depth: newDepth,
            word1: sortedWords[0],
            word2: sortedWords[1],
        })
    },
})
