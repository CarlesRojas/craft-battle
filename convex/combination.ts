import { v } from 'convex/values'
import { normalize } from '../src/lib/normalize'
import { mutation, query } from './_generated/server'

export const get = query({
    args: {
        word1: v.string(),
        word2: v.string(),
    },
    handler: async (ctx, { word1, word2 }) => {
        const sortedWords = [word1, word2].sort()
        const word1Normalized = normalize(sortedWords[0], true)
        const word2Normalized = normalize(sortedWords[1], true)

        return await ctx.db
            .query('combination')
            .withIndex('words', q => q.eq('word1Normalized', word1Normalized).eq('word2Normalized', word2Normalized))
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
        const word1Normalized = normalize(sortedWords[0], true)
        const word2Normalized = normalize(sortedWords[1], true)

        let newDepth = args.depth ?? 0

        if (args.depth === undefined) {
            const word1Combination = await ctx.db
                .query('combination')
                .withIndex('result', q => q.eq('resultNormalized', word1Normalized))
                .collect()
            const minWord1Depth = word1Combination.reduce(
                (min, combination) => Math.min(min, combination.depth),
                Number.MAX_SAFE_INTEGER,
            )

            const word2Combination = await ctx.db
                .query('combination')
                .withIndex('result', q => q.eq('resultNormalized', word2Normalized))
                .collect()
            const minWord2Depth = word2Combination.reduce(
                (min, combination) => Math.min(min, combination.depth),
                Number.MAX_SAFE_INTEGER,
            )

            newDepth = Math.max(minWord1Depth, minWord2Depth) + 1
        }

        return await ctx.db.insert('combination', {
            ...args,
            depth: newDepth,
            word1: sortedWords[0],
            word2: sortedWords[1],

            word1Normalized,
            word2Normalized,
            resultNormalized: normalize(args.result, true),
        })
    },
})
