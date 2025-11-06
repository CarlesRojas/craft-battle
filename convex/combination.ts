import { v } from 'convex/values'
import { normalize } from '../src/lib/normalize'
import { mutation, query } from './_generated/server'

export const get = query({
    args: {
        word1: v.string(),
        word2: v.string(),
    },
    handler: async (ctx, { word1, word2 }) => {
        const normalizedWord1 = normalize(word1, true)
        const normalizedWord2 = normalize(word2, true)
        const sortedWords = [normalizedWord1, normalizedWord2].sort()

        return await ctx.db
            .query('combination')
            .withIndex('words', q => q.eq('word1Normalized', sortedWords[0]).eq('word2Normalized', sortedWords[1]))
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
        const normalizedWord1 = normalize(args.word1, true)
        const normalizedWord2 = normalize(args.word2, true)
        const sortedWords = [normalizedWord1, normalizedWord2].sort()

        let newDepth = args.depth ?? 0

        if (args.depth === undefined) {
            const word1Combination = await ctx.db
                .query('combination')
                .withIndex('result', q => q.eq('resultNormalized', sortedWords[0]))
                .first()

            const word2Combination = await ctx.db
                .query('combination')
                .withIndex('result', q => q.eq('resultNormalized', sortedWords[1]))
                .first()

            newDepth = Math.max(word1Combination?.depth ?? 0, word2Combination?.depth ?? 0) + 1
        }

        return await ctx.db.insert('combination', {
            ...args,
            depth: newDepth,
            word1: sortedWords[0],
            word2: sortedWords[1],

            word1Normalized: normalizedWord1,
            word2Normalized: normalizedWord2,
            resultNormalized: normalize(args.result, true),
        })
    },
})
